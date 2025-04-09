"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../../firebase/config"
import { X, Upload, Plus, Trash2 } from "lucide-react"

export default function CourseForm({ course = null, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "Débutant",
    price: 0,
    duration: "",
    imageUrl: "",
  })
  const [sections, setSections] = useState([])
  const [newSection, setNewSection] = useState({ title: "", description: "" })
  const [courseImage, setCourseImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        instructor: course.instructor || "",
        category: course.category || "",
        level: course.level || "Débutant",
        price: course.price || 0,
        duration: course.duration || "",
        imageUrl: course.imageUrl || "",
      })
      setSections(course.sections || [])
      setImagePreview(course.imageUrl || "")
    }
  }, [course])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      setCourseImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSectionChange = (e) => {
    const { name, value } = e.target
    setNewSection({
      ...newSection,
      [name]: value,
    })
  }

  const addSection = () => {
    if (!newSection.title.trim()) {
      setError("Le titre de la section est requis")
      return
    }

    setSections([...sections, { ...newSection, id: Date.now().toString(), lessons: [] }])
    setNewSection({ title: "", description: "" })
    setError("")
  }

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      let imageURL = formData.imageUrl

      // Upload de l'image si une nouvelle image est sélectionnée
      if (courseImage) {
        const imageRef = ref(storage, `courses/images/${Date.now()}_${courseImage.name}`)

        setUploadProgress(30)
        await uploadBytes(imageRef, courseImage)
        setUploadProgress(70)

        imageURL = await getDownloadURL(imageRef)
        setUploadProgress(100)
      }

      const courseData = {
        ...formData,
        imageUrl: imageURL,
        sections,
        updatedAt: serverTimestamp(),
      }

      if (course) {
        // Mise à jour d'un cours existant
        await updateDoc(doc(db, "courses", course.id), courseData)
      } else {
        // Création d'un nouveau cours
        courseData.createdAt = serverTimestamp()
        courseData.enrolledStudents = 0
        courseData.rating = 0
        courseData.reviewCount = 0
        courseData.views = 0
        courseData.materials = []

        await addDoc(collection(db, "courses"), courseData)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du cours:", error)
      setError("Une erreur est survenue lors de l'enregistrement du cours")
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">{course ? "Modifier le cours" : "Ajouter un nouveau cours"}</h2>
          <button className="p-2 rounded-full hover:bg-gray-800" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre du cours</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instructeur</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image du cours</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-32 bg-gray-800 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500">Aucune image</div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 py-2 px-4 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Choisir une image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Format recommandé: 16:9, max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="math">Mathématiques</option>
                    <option value="science">Sciences</option>
                    <option value="programming">Programmation</option>
                    <option value="languages">Langues</option>
                    <option value="music">Musique</option>
                    <option value="art">Art & Design</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Niveau</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                    required
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Tous niveaux">Tous niveaux</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Durée (ex: 24h)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-medium mb-4">Sections du cours</h3>

            <div className="space-y-4 mb-6">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">{section.lessons?.length || 0} leçon(s)</div>
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Aucune section ajoutée. Ajoutez des sections pour organiser votre cours.
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Ajouter une nouvelle section</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre de la section</label>
                  <input
                    type="text"
                    name="title"
                    value={newSection.title}
                    onChange={handleSectionChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optionnelle)</label>
                  <textarea
                    name="description"
                    value={newSection.description}
                    onChange={handleSectionChange}
                    rows={2}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-2 py-2 px-4 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter la section</span>
                </button>
              </div>
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Téléchargement en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : course ? "Mettre à jour" : "Créer le cours"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

