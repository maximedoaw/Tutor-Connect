"use client"
import Image from "next/image"
import { Card } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { auth, db } from "../../../firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, limit, onSnapshot, doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function LearningProgressSection({ numCourses }) {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)

    const transactionsRef = collection(db, `users/${user.uid}/transactions`)
    const transactionsQuery = query(transactionsRef, limit(numCourses))

    const unsubscribe = onSnapshot(
      transactionsQuery,
      async (querySnapshot) => {
        try {
          const courseIds = []
          querySnapshot.forEach((doc) => {
            if (doc.data().courseId) {
              courseIds.push(doc.data().courseId)
            }
          })

          const coursesData = []
          for (const courseId of courseIds) {
            const courseRef = doc(db, "courses", courseId)
            const courseSnap = await getDoc(courseRef)

            if (courseSnap.exists()) {
              coursesData.push({
                id: courseSnap.id,
                ...courseSnap.data(),
                progress: 65, // temporaire
              })
            }
          }

          setPurchasedCourses(coursesData)
          setLoading(false)
        } catch (err) {
          console.error("Erreur:", err)
          setError("Erreur lors du chargement des cours")
          setLoading(false)
        }
      },
      (err) => {
        console.error("Erreur:", err)
        setError("Erreur lors du chargement des transactions")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  const handleContinue = (courseId) => {
    router.push(`/course/${courseId}`)
  }

  const SkeletonCard = () => (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="h-40 sm:h-auto sm:w-48 bg-gray-800"></div>
        <div className="p-4 flex flex-col flex-1 space-y-2">
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-3/4 h-5 bg-gray-700 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
          <div className="w-full h-2 bg-gray-800 rounded-full">
            <div className="h-2 bg-gray-600 rounded-full w-[30%]"></div>
          </div>
          <div className="w-24 h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    </Card>
  )

  return (
    <section className="py-8 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Continuer l'apprentissage</h2>
          <Link href={"/my-learning"}>
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
              Mes cours <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => <SkeletonCard key={idx} />)
            : purchasedCourses.map((course) => (
                <div key={course.id}>
                  <Card className="bg-gray-900 border-gray-800 overflow-hidden text-white">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-40 sm:h-auto sm:w-48 flex-shrink-0">
                        <Image
                          src={course?.imageUrl}
                          alt="cours"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex-1">
                          <Badge className="mb-2">{course?.category}</Badge>
                          <h3 className="font-bold mb-1">{course?.description}</h3>
                          <p className="text-gray-400 text-sm mb-2">{course?.instructor}</p>
                          <div className="flex items-center gap-1 mb-4">
                            <div className="h-2 bg-gray-800 rounded-full flex-1">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400">{course.progress}% terminé</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="self-start bg-gray-600 text-white border-none"
                          onClick={() => handleContinue(course.id)}
                        >
                          Continuer
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
