"use client"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import UserCard from "./user-card"
import UserForm from "./user-form"

export default function UsersView({ searchQuery, handleSearch, loading, filteredUsers, fetchData }) {
  const [showAddForm, setShowAddForm] = useState(false)

  const handleUserUpdated = () => {
    fetchData()
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>

        <button
          className="flex items-center gap-2 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg"
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
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onUserUpdated={handleUserUpdated} />
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Aucun utilisateur trouvé.</p>
              <button
                className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={() => setShowAddForm(true)}
              >
                Ajouter un utilisateur
              </button>
            </div>
          )}
        </div>
      )}

      {showAddForm && <UserForm onClose={() => setShowAddForm(false)} onSuccess={handleUserUpdated} />}
    </div>
  )
}

