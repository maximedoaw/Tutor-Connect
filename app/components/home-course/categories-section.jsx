"use client"

import { Button } from "../../../components/ui/button"
import { Calculator, BookOpen, Code, Languages, Music, Palette, Briefcase } from "lucide-react"

const categories = [
  { id: "math", name: "Mathématiques", icon: <Calculator className="h-4 w-4" /> },
  { id: "science", name: "Sciences", icon: <BookOpen className="h-4 w-4" /> },
  { id: "programming", name: "Programmation", icon: <Code className="h-4 w-4" /> },
  { id: "languages", name: "Langues", icon: <Languages className="h-4 w-4" /> },
  { id: "music", name: "Musique", icon: <Music className="h-4 w-4" /> },
  { id: "art", name: "Art & Design", icon: <Palette className="h-4 w-4" /> },
  { id: "business", name: "Business", icon: <Briefcase className="h-4 w-4" /> },
]

export default function CategoriesSection({ selectedCategory, setSelectedCategory, resetFilters }) {
  return (
    <section className="py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Catégories</h2>
          {selectedCategory && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedCategory === category.id
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white"
              } transition-colors`}
              onClick={() => setSelectedCategory((prev) => (prev === category.id ? null : category.id))}
            >
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-sm text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export { categories }

