"use client"

import { useState, useEffect, useRef } from "react"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { PlusCircle, Trash2, Upload, Check, X, ArrowLeft } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../../firebase/config"
import { useRouter } from "next/navigation"
import { Button } from "../../../../components/ui/button";

export default function CourseUpdateForm({ id }) {
  const [course, setCourse] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user] = useAuthState(auth)
  const router = useRouter()
  const fileInputRef = useRef(null)

  // Récupérer le cours existant
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id || !user?.uid) return

      try {
        const db = getFirestore()
        const courseRef = doc(db, `users/${user.uid}/userCourses`, id)
        const docSnap = await getDoc(courseRef)

        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Ce cours n'existe pas")
          router.push('/admin/courses')
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        setError("Erreur lors du chargement du cours")
      }
    }

    fetchCourse()
  }, [id, user?.uid, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCourse(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }))
  }

  const handleSectionChange = (e, sectionIndex) => {
    const { name, value } = e.target
    setCourse(prev => {
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [name]: value,
      }
      return { ...prev, sections: updatedSections }
    })
  }

  const handleLessonChange = (e, sectionIndex, lessonIndex) => {
    const { name, value } = e.target
    setCourse(prev => {
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex].lessons[lessonIndex] = {
        ...updatedSections[sectionIndex].lessons[lessonIndex],
        [name]: value,
      }
      return { ...prev, sections: updatedSections }
    })
  }

  const addSection = () => {
    setCourse(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section${Date.now()}`,
          title: "",
          description: "",
          lessons: [
            {
              id: `lesson${Date.now()}`,
              title: "",
              content: "",
              videoUrl: "",
              duration: "",
            },
          ],
        },
      ],
    }))
  }

  const removeSection = (sectionIndex) => {
    setCourse(prev => {
      const updatedSections = prev.sections.filter((_, index) => index !== sectionIndex)
      return { ...prev, sections: updatedSections }
    })
  }

  const addLesson = (sectionIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex].lessons.push({
        id: `lesson${Date.now()}`,
        title: "",
        content: "",
        videoUrl: "",
        duration: "",
      })
      return { ...prev, sections: updatedSections }
    })
  }

  const removeLesson = (sectionIndex, lessonIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons.filter(
        (_, index) => index !== lessonIndex,
      )
      return { ...prev, sections: updatedSections }
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      const storage = getStorage()
      
      // Upload new image
      const storageRef = ref(storage, `courses/${user.uid}/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          setIsUploading(false)
          setError("Erreur lors du téléchargement de l'image")
          console.error("Upload error:", error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          
          // Delete old image if exists
          if (course.imageUrl) {
            try {
              const oldImageRef = ref(storage, course.imageUrl)
              await deleteObject(oldImageRef)
            } catch (error) {
              console.log("Error deleting old image:", error)
            }
          }

          setCourse(prev => ({ ...prev, imageUrl: downloadURL }))
          setIsUploading(false)
        }
      )
    } catch (error) {
      setIsUploading(false)
      setError("Erreur lors de la mise à jour de l'image")
      console.error("Error:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user?.uid || !course) {
      setError("Vous devez être connecté pour modifier un cours")
      return
    }

    if (!course.title || !course.description || !course.imageUrl) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const db = getFirestore()
      const courseRef = doc(db, `users/${user.uid}/userCourses`, id)

      await updateDoc(courseRef, {
        title: course.title,
        instructor: course.instructor,
        price: course.price,
        imageUrl: course.imageUrl,
        category: course.category,
        level: course.level,
        duration: course.duration,
        isFavorite: course.isFavorite,
        students: course.students,
        description: course.description,
        sections: course.sections,
        updatedAt: new Date(),
      })

      setSuccess("Cours mis à jour avec succès!")
      setTimeout(() => {
        router.push('/tutor-courses')
      }, 2000)
    } catch (error) {
      console.error("Error updating course:", error)
      setError("Erreur lors de la mise à jour du cours")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!course) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p>Chargement du cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
        <Button variant="link" onClick={() => router.back()} className="text-white hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150
        ">
          <ArrowLeft className="h-5 w-5 mr-2" />
        </Button>
        <h1 className="text-2xl font-bold mb-6 text-white">Modifier le cours</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center">
            <X className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-300">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Titre du cours *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={course.title || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-300 mb-1">
                  Instructeur
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={course.instructor || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={course.price || 0}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                    Durée totale
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={course.duration || ""}
                    onChange={handleChange}
                    placeholder="ex: 24h"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={course.category || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="math">Mathématiques</option>
                    <option value="science">Sciences</option>
                    <option value="programming">Programmation</option>
                    <option value="language">Langues</option>
                    <option value="business">Business</option>
                    <option value="art">Art</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-1">
                    Niveau
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={course.level || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description du cours *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={course.description || ""}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image du cours *</label>
                <div className="mt-1 flex flex-col items-center space-y-2">
                  {course.imageUrl ? (
                    <div className="relative w-full h-48 rounded-md overflow-hidden">
                      <img
                        src={course.imageUrl}
                        alt="Aperçu du cours"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCourse(prev => ({ ...prev, imageUrl: "" }))}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">Cliquez pour télécharger une image</p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {isUploading && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Téléchargement en cours...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sections et leçons */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Sections et leçons</h2>

            {course.sections?.map((section, sectionIndex) => (
              <div key={section.id} className="mb-8 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Section {sectionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor={`section-title-${sectionIndex}`}
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      id={`section-title-${sectionIndex}`}
                      name="title"
                      value={section.title || ""}
                      onChange={(e) => handleSectionChange(e, sectionIndex)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`section-description-${sectionIndex}`}
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Description de la section
                    </label>
                    <textarea
                      id={`section-description-${sectionIndex}`}
                      name="description"
                      value={section.description || ""}
                      onChange={(e) => handleSectionChange(e, sectionIndex)}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-300">Leçons</h4>

                  {section.lessons?.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="p-3 bg-gray-600 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium">Leçon {lessonIndex + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeLesson(sectionIndex, lessonIndex)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`lesson-title-${sectionIndex}-${lessonIndex}`}
                            className="block text-xs font-medium text-gray-300 mb-1"
                          >
                            Titre de la leçon
                          </label>
                          <input
                            type="text"
                            id={`lesson-title-${sectionIndex}-${lessonIndex}`}
                            name="title"
                            value={lesson.title || ""}
                            onChange={(e) => handleLessonChange(e, sectionIndex, lessonIndex)}
                            className="w-full px-3 py-1.5 bg-gray-700 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`lesson-duration-${sectionIndex}-${lessonIndex}`}
                            className="block text-xs font-medium text-gray-300 mb-1"
                          >
                            Durée
                          </label>
                          <input
                            type="text"
                            id={`lesson-duration-${sectionIndex}-${lessonIndex}`}
                            name="duration"
                            value={lesson.duration || ""}
                            onChange={(e) => handleLessonChange(e, sectionIndex, lessonIndex)}
                            placeholder="ex: 30min"
                            className="w-full px-3 py-1.5 bg-gray-700 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label
                          htmlFor={`lesson-content-${sectionIndex}-${lessonIndex}`}
                          className="block text-xs font-medium text-gray-300 mb-1"
                        >
                          Contenu de la leçon
                        </label>
                        <textarea
                          id={`lesson-content-${sectionIndex}-${lessonIndex}`}
                          name="content"
                          value={lesson.content || ""}
                          onChange={(e) => handleLessonChange(e, sectionIndex, lessonIndex)}
                          rows="2"
                          className="w-full px-3 py-1.5 bg-gray-700 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        ></textarea>
                      </div>

                      <div className="mt-3">
                        <label
                          htmlFor={`lesson-video-${sectionIndex}-${lessonIndex}`}
                          className="block text-xs font-medium text-gray-300 mb-1"
                        >
                          URL de la vidéo (YouTube)
                        </label>
                        <input
                          type="text"
                          id={`lesson-video-${sectionIndex}-${lessonIndex}`}
                          name="videoUrl"
                          value={lesson.videoUrl || ""}
                          onChange={(e) => handleLessonChange(e, sectionIndex, lessonIndex)}
                          placeholder="https://youtu.be/example"
                          className="w-full px-3 py-1.5 bg-gray-700 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addLesson(sectionIndex)}
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300 mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Ajouter une leçon
                  </button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addSection} className="flex items-center text-blue-400 hover:text-blue-300">
              <PlusCircle className="h-5 w-5 mr-1" />
              Ajouter une section
            </button>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              className="px-6 py-2 rounded-md text-white font-medium bg-gray-600 hover:bg-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                isSubmitting || isUploading ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}