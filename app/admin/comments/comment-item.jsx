"use client"

import { Check, X, Edit, Trash2 } from "lucide-react"

export default function CommentItem({
  comment,
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
    <tr key={comment.id} className="hover:bg-gray-800/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
            {comment.userAvatar ? (
              <img
                src={comment.userAvatar || "/placeholder.svg"}
                alt={comment.userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">{comment.userName.charAt(0)}</span>
            )}
          </div>
          <span>{comment.userName}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {editingComment && editingComment.id === comment.id ? (
          <textarea
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
          />
        ) : (
          <p className="line-clamp-2">{comment.text}</p>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">{comment.createdAt?.toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            comment.status === "approved"
              ? "bg-green-500/20 text-green-500"
              : comment.status === "rejected"
                ? "bg-red-500/20 text-red-500"
                : "bg-yellow-500/20 text-yellow-500"
          }`}
        >
          {comment.status === "approved" ? "Approuvé" : comment.status === "rejected" ? "Rejeté" : "En attente"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {editingComment && editingComment.id === comment.id ? (
            <>
              <button
                className="p-1 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30"
                onClick={handleSaveEdit}
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"
                onClick={() => setEditingComment(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {comment.status === "pending" && (
                <>
                  <button
                    className="p-1 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    onClick={() => handleApproveComment(comment.id)}
                    title="Approuver"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    onClick={() => handleRejectComment(comment.id)}
                    title="Rejeter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                className="p-1 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                onClick={() => handleEditComment(comment)}
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                onClick={() => handleDeleteComment(comment.id)}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

