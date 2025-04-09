"use client"

import { ShieldCheck, BarChart2, MessageSquare, Users, BookOpen, MoveLeft } from "lucide-react"

export default function Sidebar({ activeTab, setActiveTab, pendingCommentsCount }) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full hidden md:block">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "dashboard" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Tableau de bord</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "comments" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Commentaires</span>
              {pendingCommentsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCommentsCount}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "users" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-5 w-5" />
              <span>Utilisateurs</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "courses" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <BookOpen className="h-5 w-5" />
              <span>Cours</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

