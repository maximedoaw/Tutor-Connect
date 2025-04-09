"use client"

import { ShieldCheck, ArrowLeft, MoveLeft } from "lucide-react"

export default function MobileHeader({ activeTab, setActiveTab }) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Admin</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-800 text-gray-400" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-t border-gray-800">
        <button
          className={`flex-shrink-0 px-4 py-2 border-b-2 ${
            activeTab === "dashboard" ? "border-primary text-primary" : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Tableau de bord
        </button>
        <button
          className={`flex-shrink-0 px-4 py-2 border-b-2 ${
            activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("comments")}
        >
          Commentaires
        </button>
        <button
          className={`flex-shrink-0 px-4 py-2 border-b-2 ${
            activeTab === "users" ? "border-primary text-primary" : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Utilisateurs
        </button>
        <button
          className={`flex-shrink-0 px-4 py-2 border-b-2 ${
            activeTab === "courses" ? "border-primary text-primary" : "border-transparent text-gray-400"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          Cours
        </button>
      </div>
    </div>
  )
}

