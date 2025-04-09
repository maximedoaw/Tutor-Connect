"use client"

import { Button } from "../../../components/ui/button"
import { ChevronRight } from 'lucide-react'
import CourseCard from "./course-card"
import { categories } from "./categories-section"
import { useRouter } from "next/navigation"

export default function CoursesSection({ courses, selectedCategory, toggleFavorite, resetFilters }) {
  const router = useRouter()

  const handleCourseClick = (courseId) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory
              ? `Cours de ${categories.find((c) => c.id === selectedCategory)?.name}`
              : "Cours recommandés pour vous"}
          </h2>
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCard
                key={`${course.id}-${index}`}
                course={course}
                onToggleFavorite={toggleFavorite}
                onClick={() => handleCourseClick(course.id)}  // course.id doit être l'ID du document Firebase
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">Aucun cours trouvé dans cette catégorie.</p>
              <Button onClick={resetFilters}>Voir tous les cours</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
