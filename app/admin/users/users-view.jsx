'use client'

import { useState, useMemo } from 'react'
import { Search, UserPlus, Trash } from 'lucide-react'
import UserCard from './user-card'
import UserForm from './user-form'
import { collection, query, deleteDoc, doc } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db, auth } from '../../../firebase/config'
import { deleteUser } from 'firebase/auth'

export default function UsersView() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const usersRef = collection(db, 'users')
  const [snapshot, loading, error] = useCollection(query(usersRef))

  const users = useMemo(() => {
    if (!snapshot) return []
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  }, [snapshot])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDeleteUser = async (userId, firebaseUid) => {
    try {
      // Supprimer de Firestore
      await deleteDoc(doc(db, 'users', userId))
      console.log('Utilisateur supprimé de Firestore')

      // Supprimer de Firebase Auth (uniquement si l'uid est différent de l'utilisateur connecté)
      if (firebaseUid !== auth.currentUser?.uid) {
        const user = auth.currentUser
        if (user && user.uid === firebaseUid) {
          await deleteUser(user)
          console.log('Utilisateur supprimé de Firebase Auth')
        }
      } else {
        console.error("Impossible de supprimer l'utilisateur actuellement connecté.")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    }
  }

  const refreshData = () => {
    // Le hook useCollection est live, donc pas besoin de fetch manuel
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <button
          className="flex items-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-900 rounded-lg"
          onClick={() => setShowAddForm(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Ajouter un utilisateur</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Rechercher des utilisateurs..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="relative">
              <UserCard user={user} onUserUpdated={refreshData} />
              <button
                onClick={() => handleDeleteUser(user.id, user.uid)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Aucun utilisateur trouvé.</p>
              <button
                className="py-2 px-4 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                onClick={() => setShowAddForm(true)}
              >
                Ajouter un utilisateur
              </button>
            </div>
          )}
        </div>
      )}

      {showAddForm && <UserForm onClose={() => setShowAddForm(false)} onSuccess={refreshData} />}
    </div>
  )
}
