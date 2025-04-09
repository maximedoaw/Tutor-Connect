"use client"

import { useState, useEffect } from "react"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../../firebase/config"
import { X, Upload, Clock } from "lucide-react"




export default function LessonForm({ course, sectionId, lesson = null, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    content: "",
  })
  const [videoFile, setVideoFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        duration: lesson.duration || "",
        videoUrl: lesson.videoUrl || "",
        content: lesson.content || "",
      })
    }
  }, [lesson])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      let videoURL = formData.videoUrl;
  
      // Upload de la vidéo si un nouveau fichier est sélectionné
      if (videoFile) {
        const videoRef = ref(storage, `courses/${course.id}/videos/${Date.now()}_${videoFile.name}`);
  
        setUploadProgress(30);
        await uploadBytes(videoRef, videoFile);
        setUploadProgress(70);
  
        videoURL = await getDownloadURL(videoRef);
        setUploadProgress(100);
      }
  
      const lessonData = {
        ...formData,
        id: lesson ? lesson.id : Date.now().toString(),
        videoUrl: videoURL,
        completed: false,
      };
  
      const courseRef = doc(db, "courses", course.id);
  
      const updatedSections = course.sections.map((section) => {
        if (section.id === sectionId) {
          if (lesson) {
            // Mise à jour d'une leçon existante
            const updatedLessons = section.lessons.map((l) => (l.id === lesson.id ? lessonData : l));
            return { ...section, lessons: updatedLessons };
          } else {
            // Ajout d'une nouvelle leçon
            return {
              ...section,
              lessons: [...(section.lessons || []), lessonData],
            };
          }
        }
        return section;
      });
  
      // Mettre à jour le document Firestore
      await updateDoc(courseRef, {
        sections: updatedSections,
        updatedAt: serverTimestamp(), // Utiliser serverTimestamp() uniquement ici
      });
  
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la leçon:", error);
      setError("Une erreur est survenue lors de l'enregistrement de la leçon");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 text-white bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">{lesson ? "Modifier la leçon" : "Ajouter une nouvelle leçon"}</h2>
          <button className="p-2 rounded-full hover:bg-gray-800" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre de la leçon</label>
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
                rows={3}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée (ex: 15min)</label>
                <div className="relative">
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-2 pl-8 bg-gray-800 border border-gray-700 rounded-lg"
                    required
                  />
                  <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vidéo</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center gap-2 py-2 px-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg cursor-pointer text-sm">
                    <Upload className="h-4 w-4" />
                    <span className="truncate">{videoFile ? videoFile.name : "Choisir un fichier"}</span>
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL de la vidéo (optionnel)</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://example.com/video.mp4"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">
                Vous pouvez soit télécharger une vidéo, soit fournir une URL externe
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contenu de la leçon</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
                placeholder="Contenu de la leçon en texte riche ou markdown..."
              />
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
              {isSubmitting ? "Enregistrement..." : lesson ? "Mettre à jour" : "Ajouter la leçon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

