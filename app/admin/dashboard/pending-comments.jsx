"use client"

import { Check, X } from "lucide-react"

export default function PendingComments({
  comments,
  loading,
  handleApproveComment,
  handleRejectComment,
  setActiveTab,
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Commentaires récents à modérer</h3>
        <button className="text-primary hover:underline text-sm" onClick={() => setActiveTab("comments")}>
          Voir tout
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="space-y-4">
          {comments
            .filter((comment) => comment.status === "pending")
            .slice(0, 3)
            .map((comment) => (
              <div key={comment.id} className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
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
                    <div>
                      <p className="font-medium">{comment.userName}</p>
                      <p className="text-xs text-gray-400">
                        {comment.createdAt?.toLocaleDateString()} à {comment.createdAt?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30"
                      onClick={() => handleApproveComment(comment.id)}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30"
                      onClick={() => handleRejectComment(comment.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            ))}

          {comments.filter((comment) => comment.status === "pending").length === 0 && (
            <p className="text-gray-400 text-center py-4">Aucun commentaire en attente de modération.</p>
          )}
        </div>
      )}
    </div>
  )
}

