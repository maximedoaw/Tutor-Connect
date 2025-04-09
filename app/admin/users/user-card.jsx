'use client'

import { useState } from "react"
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db,auth } from "../../../firebase/config"
import {  Trash2, Check, X, Eye } from "lucide-react"

export default function UserCard({ user, onUserUpdated }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "student",
    status: user.status || "active",
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.id), {
        ...editData,
        updatedAt: serverTimestamp(),
      })

      setIsEditing(false)
      if (onUserUpdated) {
        onUserUpdated()
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      alert("Une erreur est survenue lors de la mise à jour de l'utilisateur")
    }
  }

  const handleDelete = async () => {
    // Afficher une fenêtre de confirmation avant la suppression
    const confirmation = window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)

    if (confirmation) {
      setIsDeleting(true)
      try {
        await deleteDoc(doc(db, "users", user.id))

        if (onUserUpdated) {
          onUserUpdated()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error)
        alert("Une erreur est survenue lors de la suppression de l'utilisateur")
        setIsDeleting(false)
      }
    }
  }

  // Convertir Firestore Timestamp en Date
  const createdAt = user.createdAt ? user.createdAt.toDate() : null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">{user.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="font-bold bg-gray-800 border border-gray-700 rounded p-1 w-full"
              />
            ) : (
              <h3 className="font-bold">{user.name}</h3>
            )}
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded p-1 w-full mt-1"
              />
            ) : (
              <p className="text-sm text-gray-400">{user.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Rôle:</span>
            {isEditing ? (
              <select
                name="role"
                value={editData.role}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded p-1 text-xs"
              >
                <option value="admin">Administrateur</option>
                <option value="tutor">Tuteur</option>
                <option value="student">Étudiant</option>
              </select>
            ) : (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-500"
                    : user.role === "tutor"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {user.role === "admin" ? "Administrateur" : user.role === "tutor" ? "Tuteur" : "Étudiant"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Statut:</span>
            {isEditing ? (
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded p-1 text-xs"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            ) : (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}
              >
                {user.status === "active" ? "Actif" : "Inactif"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Inscrit le:</span>
            <span className="text-sm">{createdAt ? createdAt.toLocaleDateString() : 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Cours suivis:</span>
            <span className="text-sm">{user.enrolledCourses || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                onClick={handleSave}
              >
                <Check className="h-4 w-4 inline mr-1" />
                Enregistrer
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 inline mr-1" />
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
                <Eye className="h-4 w-4 inline mr-1" />
                Voir le profil
              </button>
              <button
                className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
