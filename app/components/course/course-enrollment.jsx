"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp, updateDoc, increment, doc } from "firebase/firestore"
import { db } from "@/firebase/config"
import { useUser } from "@/components/auth/user-session"
import { Lock, Check, AlertTriangle } from "lucide-react"

export default function CourseEnrollment({ course }) {
  const router = useRouter()
  const { user } = useUser()
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState(null)

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth?redirect=" + encodeURIComponent(`/course/${course.id}`))
      return
    }

    setEnrolling(true)
    setError(null)

    try {
      // Créer l'inscription
      await addDoc(collection(db, "enrollments"), {
        userId: user.uid,
        courseId: course.id,
        enrolledAt: serverTimestamp(),
        status: "active",
        progress: 0,
      })

      // Mettre à jour le nombre d'étudiants inscrits au cours
      await updateDoc(doc(db, "courses", course.id), {
        enrolledStudents: increment(1),
      })

      // Créer un document de progression pour l'utilisateur
      await addDoc(collection(db, "userProgress"), {
        userId: user.uid,
        courseId: course.id,
        currentLessonIndex: 0,
        lastAccessed: serverTimestamp(),
        completedLessons: [],
        notes: [],
      })

      // Rediriger vers la page du cours
      router.push(`/course/${course.id}`)
    } catch (error) {
      console.error("Erreur lors de l'inscription au cours:", error)
      setError("Une erreur est survenue lors de l'inscription au cours")
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Inscription au cours</h3>

      {course.price > 0 ? (
        <div className="mb-4">
          <p className="text-2xl font-bold">{course.price} €</p>
          <p className="text-sm text-gray-400">Accès à vie au contenu du cours</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-lg font-bold text-green-500">Gratuit</p>
          <p className="text-sm text-gray-400">Accès complet au contenu du cours</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        onClick={handleEnroll}
        disabled={enrolling}
      >
        {enrolling ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Inscription en cours...</span>
          </>
        ) : course.price > 0 ? (
          <>
            <Lock className="h-5 w-5" />
            <span>Acheter maintenant</span>
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            <span>S'inscrire gratuitement</span>
          </>
        )}
      </button>

      <div className="mt-4 text-sm text-gray-400">
        <p>En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p>
      </div>
    </div>
  )
}

