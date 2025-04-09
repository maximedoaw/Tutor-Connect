"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "../../../firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Input } from "../../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { GraduationCap, Search, Bell, MessageSquare, ShieldCheck, BookOpen, X, Menu } from "lucide-react"
import Image from "next/image"

export default function Header({
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchResults,
  setShowSearchResults,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isAdmin,
}) {
  const router = useRouter()
  const [user] = useAuthState(auth)

  return (
    <header className="border-b border-gray-800 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl hidden sm:inline">TutorConnect</span>
            </Link>

            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative hidden md:block flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher des cours, des tuteurs..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
            </div>

            {/* Résultats de recherche */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                    onClick={() => {
                      router.push(`/course/${course.id}`)
                      setShowSearchResults(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={course.imageUrl || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                        <p className="text-gray-400 text-xs">{course.instructor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50 p-4 text-center">
                <p className="text-gray-400">Aucun résultat pour "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {(user?.email === "maximedoaw204@gmail.com" || user?.email === "foumanechrispel@gmail.com") && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            <button className="relative">
              <Bell className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            <button className="relative hidden md:block">
              <Link href={"/chat"}>
                <MessageSquare className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
              </Link>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-white">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Profil</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Mes cours</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Paramètres</DropdownMenuItem>
                <Link href={`/tutor-courses`}><DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Mes creations comme tuteur</DropdownMenuItem></Link>

              
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer text-red-500">
                  <div className="flex items-center gap-2" onClick={() => signOut(auth)}>
                    Déconnexion
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher des cours, des tuteurs..."
              className="pl-10 bg-gray-800 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-primary py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            )}
            <Link
              href="/messages"
              className="flex items-center gap-2 text-gray-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>Profil</span>
            </Link>
            <Link
              href="/my-courses"
              className="flex items-center gap-2 text-gray-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Mes cours</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-gray-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Paramètres</span>
            </Link>
            <button className="flex items-center gap-2 text-red-500 py-2" onClick={() => signOut(auth)}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

