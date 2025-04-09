"use client"

import { Search, Filter } from "lucide-react"
import CommentItem from "./comment-item"

export default function CommentsView({
  searchQuery,
  handleSearch,
  filterStatus,
  setFilterStatus,
  loading,
  filteredComments,
  editingComment,
  editText,
  setEditText,
  handleApproveComment,
  handleRejectComment,
  handleEditComment,
  handleSaveEdit,
  handleDeleteComment,
  setEditingComment,
}) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des commentaires</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher des commentaires..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Commentaire</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      editingComment={editingComment}
                      editText={editText}
                      setEditText={setEditText}
                      handleApproveComment={handleApproveComment}
                      handleRejectComment={handleRejectComment}
                      handleEditComment={handleEditComment}
                      handleSaveEdit={handleSaveEdit}
                      handleDeleteComment={handleDeleteComment}
                      setEditingComment={setEditingComment}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      Aucun commentaire trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

