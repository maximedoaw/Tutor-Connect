"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../../firebase/config" // Chemin à ajuster selon votre structure
import { Check, Clock, Calendar, Send, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import YouTube from "react-youtube"
import { extractYouTubeID, isValidURL } from "../../../constant/utils"
import { addDoc, collection, deleteDoc, doc, onSnapshot, or, orderBy, query, serverTimestamp } from "firebase/firestore"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar"
import PaymentModal from "../../course/[id]/PaymentModal"

export default function CourseContent({
  course,
  currentModule,
  currentLessonInModule,
  noteText,
  setNoteText,
  markLessonAsCompleted,
  isCompleted,
}) {
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState("content")
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)

  
  const isFreeCourse = course.price === 0  || hasPurchased

  const lessonId = course.modules[currentModule]?.lessons[currentLessonInModule]?.id


  const handleAddNote = async () => {
    if (!noteText.trim() || !user || !lessonId) return

    setLoading(true)
    
    try {
      const newNote = {
        text: noteText,
        createdAt: serverTimestamp(),
        author: {
          id: user.uid,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || null,
        },
        lessonId: lessonId,
        courseId: course.id,
      }

      // Ajouter à Firestore
      const docRef = await addDoc(
        collection(db, "courses", course.id, "lessons", lessonId, "notes"),
        newNote
      )

      // Mettre à jour l'état local
      setNotes([...notes, {
        ...newNote,
        id: docRef.id,
        createdAt: new Date().toISOString(), // Pour l'affichage immédiat
      }])
      
      setNoteText("")
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!user || !lessonId) return

    setLoading(true)
    
    try {
      // Supprimer de Firestore
      await deleteDoc(
        doc(db, "courses", course.id, "lessons", lessonId, "notes", noteId)
      )

      // Mettre à jour l'état local
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!lessonId || !course?.id) return

    setLoadingNotes(true)
    
    const notesCollection = collection(db, "courses", course.id, "lessons", lessonId, "notes")
    const q = query(notesCollection, orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = []
      querySnapshot.forEach((doc) => {
        const note = doc.data()
        notesData.push({
          id: doc.id,
          ...note,
          // Convertir le timestamp Firestore en date JavaScript
          createdAt: note.createdAt?.toDate()?.toISOString() || new Date().toISOString()
        })
      })
      
      setNotes(notesData)
      setLoadingNotes(false)
    }, (error) => {
      console.error("Erreur lors de la récupération des notes:", error)
      setLoadingNotes(false)
    })

    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe()
  }, [course.id, lessonId])
  
  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Aucun contenu disponible pour ce cours.</p>
      </div>
    )
  }

  const module = course.modules[currentModule]
  const lesson = module?.lessons[currentLessonInModule]

  if (!lesson) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Leçon non trouvée.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <p className="text-gray-400">
            Module {currentModule + 1}: {module.title}
          </p>
        </div>

        {!isFreeCourse && <button
          className={`flex items-center gap-2 py-2 px-4 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
          onClick={() => setShowPaymentModal(true)}
          disabled={isCompleted}
        >
          <Check className="h-4 w-4" />
          <span>Acheter</span>
        </button>}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{lesson.duration || "10 min"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Ajouté le {new Date(lesson.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "content" ? "text-white underline underline-offset-4" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("content")}
            >
              Contenu
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "notes" ? "text-white underline underline-offset-4" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              Notes ({notes.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "content" ? (
            <div className="space-y-6">
              {lesson.videoUrl && (
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <YouTube 
                    videoId={isValidURL(lesson.videoUrl) ? extractYouTubeID(lesson.videoUrl) : lesson.videoUrl} 
                    opts={opts} 
                    className="w-full h-full" 
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {user ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Ajouter une note..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                  <button
                    className="p-2 rounded-lg bg-primary text-white disabled:opacity-50"
                    onClick={() => handleAddNote(user)}
                    disabled={!noteText.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-2">
                  Connectez-vous pour ajouter une note
                </p>
              )}



              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                        <Avatar>
                          <AvatarImage src={note.author?.avatar} alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                          <p className="font-medium text-white mt-2">
                            {note.author?.name || "Anonyme"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {note.createdAt &&
                              formatDistanceToNow(new Date(note.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                          </p>
                        </div>
                        {(user?.uid === note.author?.id || user?.email === "admin@example.com") && (
                          <button 
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="mt-2">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">
                    Aucune note pour cette leçon. {user ? "Ajoutez votre première note !" : "Connectez-vous pour voir les notes."}
                  </p>
                )}
              </div>
            </div>
          )}
              {showPaymentModal && (
                     <PaymentModal
                        course={course}
                        onClose={() => setShowPaymentModal(false)}
                        onPaymentSuccess={() => {
                          setShowPaymentModal(false)
                          setHasPurchased(true)
                        }}
                      />
              )}
        </div>
      </div>
    </div>
  )
}