"use client"

import { useState } from "react"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from "../../../firebase/config"
import { Upload, Download, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CourseMaterials({ course, selectedFile, uploadProgress, handleFileChange, handleFileUpload }) {
  const [deletingMaterial, setDeletingMaterial] = useState(null)

  const handleDeleteMaterial = async (materialIndex) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?")) {
      return
    }

    setDeletingMaterial(materialIndex)
    try {
      const material = course.materials[materialIndex]

      // Supprimer le fichier du storage
      if (material.url) {
        try {
          const fileRef = ref(storage, material.url)
          await deleteObject(fileRef)
        } catch (storageError) {
          console.error("Erreur lors de la suppression du fichier:", storageError)
          // Continuer même si la suppression du fichier échoue
        }
      }

      // Mettre à jour le document pour supprimer la référence
      const updatedMaterials = [...course.materials]
      updatedMaterials.splice(materialIndex, 1)

      try {
        await updateDoc(doc(db, "courses", course.id), {
          materials: updatedMaterials,
          updatedAt: serverTimestamp(),
        })

        // Rafraîchir la page ou mettre à jour l'état local
        window.location.reload()
      } catch (updateError) {
        if (updateError.code === "not-found") {
          alert("Ce cours n'existe plus dans la base de données.")
          window.location.reload()
        } else {
          throw updateError
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du matériel:", error)
      alert("Une erreur est survenue lors de la suppression du matériel")
    } finally {
      setDeletingMaterial(null)
    }
  }

  return (
    <div className="border-t border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <Link href={`course/${course.id}`}>
          <div className="flex items-center gap-2 ml-auto my-auto">

            <button
              className="py-1 px-3 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-colors"
            >
              Voir le cours
            </button>
          </div>
        </Link>
      </div>

    </div>
  )
}

