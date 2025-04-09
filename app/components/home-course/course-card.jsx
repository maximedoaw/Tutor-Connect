"use client"

import { useState } from "react"
import { Star, Clock, Users, Heart } from "lucide-react"

export default function CourseCard({ course, onToggleFavorite, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleFavoriteClick = (e) => {
    e.stopPropagation() // Empêcher la propagation pour éviter la redirection
    onToggleFavorite(course.id)
  }

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} // Ajouter l'événement onClick ici
    >
      <div className="relative h-48">
        <img
          src={course.imageUrl || "/placeholder.svg?height=192&width=384"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <button
          className={`absolute top-2 right-2 p-2 rounded-full ${
            course.isFavorite ? "bg-primary text-red-500" : "bg-black/50 text-white"
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`h-4 w-4 ${course.isFavorite ? "fill-white" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">{course.category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{course.rating}</span>
          </div>
        </div>

        <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students} étudiants</span>
          </div>
        </div>

        <div className={`mt-4 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <div className="h-[1px] bg-gray-800 mb-4"></div>
          <div className="flex items-center justify-between">
            <span className="font-bold">{course.price} €</span>
            <span className="text-sm text-primary">Voir le cours</span>
          </div>
        </div>
      </div>
    </div>
  )
}

