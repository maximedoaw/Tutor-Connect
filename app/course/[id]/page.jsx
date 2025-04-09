"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { 
  doc, getDoc, collection, query, where, 
  getDocs, updateDoc, increment, serverTimestamp,
  setDoc
} from "firebase/firestore"
import { db, auth } from "../../../firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import PaymentModal from "../[id]/PaymentModal"
import CourseHeader from "../../../app/components/course/course-header"
import CourseSidebar from "../../../app/components/course/course-sidebar"
import CourseContent from "../../../app/components/course/course-content"
import CourseNavigation from "../../../app/components/course/course-navigation"

export default function CoursePage() {
  const router = useRouter()
  const { id } = useParams()
  const [user] = useAuthState(auth)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [userProgress, setUserProgress] = useState(null)
  const [notes, setNotes] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)

  // Récupérer les données du cours
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return

      setLoading(true)
      try {
        // 1. Vérifier si l'utilisateur a acheté le cours
        if (user) {
          const myCourseRef = doc(db, `users/${user.uid}/myCourses`, id)
          const myCourseSnap = await getDoc(myCourseRef)
          setHasPurchased(myCourseSnap.exists())
        }

        // 2. Récupérer les données du cours
        const courseRef = doc(db, "courses", id)
        const courseSnap = await getDoc(courseRef)

        if (!courseSnap.exists()) {
          setError("Ce cours n'existe pas")
          setLoading(false)
          return
        }

        const courseData = { id: courseSnap.id, ...courseSnap.data() }

        // 3. Transformer les sections en modules avec des valeurs par défaut sécurisées
        const modules = (courseData.sections || []).map(section => ({
          title: section.title || "Sans titre",
          description: section.description || "",
          lessons: (section.lessons || []).map(lesson => ({
            ...lesson,
            id: lesson.id || Date.now().toString(),
            completed: false
          }))
        }))

        // 4. Mettre à jour les vues du cours
        await updateDoc(courseRef, {
          views: increment(1),
          lastViewed: serverTimestamp()
        })

        // 5. Récupérer la progression de l'utilisateur
        if (user) {
          const progressQuery = query(
            collection(db, "userProgress"),
            where("userId", "==", user.uid),
            where("courseId", "==", id)
          )
          const progressSnap = await getDocs(progressQuery)

          if (!progressSnap.empty) {
            const progressData = progressSnap.docs[0].data()
            setUserProgress(progressData)

            // Mettre à jour les leçons complétées
            progressData.completedLessons?.forEach(lessonId => {
              modules.forEach(module => {
                module.lessons.forEach(lesson => {
                  if (lesson.id === lessonId) lesson.completed = true
                })
              })
            })

            // Vérifier que l'index de la leçon actuelle est valide
            const safeLessonIndex = Math.min(
              progressData.currentLessonIndex || 0,
              modules.flatMap(m => m.lessons).length - 1
            )
            setCurrentLesson(Math.max(0, safeLessonIndex))
            setNotes(progressData.notes || [])
          }
        }

        setCourse({
          ...courseData,
          modules,
          price: courseData.price || 0
        })

      } catch (error) {
        console.error("Erreur:", error)
        setError("Erreur lors du chargement du cours")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [id, user])

  // Gestion sécurisée des leçons aplaties
  const flatLessons = course?.modules?.flatMap((module, moduleIndex) =>
    (module?.lessons ?? []).map((lesson, lessonIndex) => ({
      ...lesson,
      moduleIndex,
      lessonIndex,
      id: lesson?.id || `lesson-${moduleIndex}-${lessonIndex}`,
    }))
  ) ?? [];
  
  
  // Sécuriser l'accès à la leçon actuelle
  const safeCurrentLesson = Math.min(currentLesson, Math.max(flatLessons.length - 1, 0))
  const currentLessonData = flatLessons[safeCurrentLesson]
  const isFreeCourse = course?.price === 0 || hasPurchased

  // S'assurer que currentLesson reste valide
  useEffect(() => {
    if (flatLessons.length > 0 && currentLesson >= flatLessons.length) {
      setCurrentLesson(flatLessons.length - 1)
    }
  }, [flatLessons.length, currentLesson])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <button
            className="mt-4 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg text-white"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-500 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Cours non trouvé</h2>
          <button
            className="mt-4 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg text-white"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <CourseHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        courseTitle={course.title} 
      />

      <div className="flex-1 flex flex-col md:flex-row">
        <CourseSidebar
          course={course}
          currentModule={currentLessonData?.moduleIndex || 0}
          currentLessonInModule={currentLessonData?.lessonIndex || 0}
          handleLessonClick={(moduleIndex, lessonIndex) => {
            const index = flatLessons.findIndex(
              l => l.moduleIndex === moduleIndex && l.lessonIndex === lessonIndex
            )
            if (index !== -1) {
              setCurrentLesson(index)
              setSidebarOpen(false)
            }
          }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isFreeCourse={isFreeCourse}
        />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">

                  <CourseContent
                    course={course}
                    currentModule={currentLessonData?.moduleIndex || 0}
                    currentLessonInModule={currentLessonData?.lessonIndex || 0}
                    noteText={noteText}
                    setNoteText={setNoteText}
                  />

                  <CourseNavigation
                    goToPreviousLesson={() => {
                      if (currentLesson > 0) {
                        setCurrentLesson(currentLesson - 1)
                        window.scrollTo(0, 0)
                      }
                    }}
                    goToNextLesson={() => {
                      if (currentLesson < flatLessons.length - 1) {
                        setCurrentLesson(currentLesson + 1)
                        window.scrollTo(0, 0)
                      }
                    }}
                    isFirstLesson={currentLesson === 0}
                    isLastLesson={currentLesson === flatLessons.length - 1}
                  />
              ) : (
                <div className="text-center py-12">
                  <p>Aucune leçon disponible dans ce cours</p>
                </div>
              )

          </div>
        </main>
      </div>

      {!isFreeCourse && course?.price > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-full shadow-lg"
          >
            Acheter le cours - {course.price} €
          </button>
        </div>
      )}



      <footer className="bg-gray-950 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold">EduPlatform</span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}