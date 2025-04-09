"use client"

import { Menu, ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "../auth/user-session"

export default function CourseHeader({ sidebarOpen, setSidebarOpen, courseTitle }) {
  const router = useRouter()
  const { user } = useUser()

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-400"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              className="p-2 rounded-lg bg-gray-800 text-gray-400 flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>

            <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-none">{courseTitle || "Cours"}</h1>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name || "Utilisateur"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    {user.name?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                )}
                <span className="hidden md:inline font-medium">{user.name || "Utilisateur"}</span>
              </div>
            ) : (
              <button className="py-2 px-4 rounded-lg bg-primary text-white" onClick={() => router.push("/auth")}>
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

