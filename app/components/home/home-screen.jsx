"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../../firebase/config"
import Header from "../home-course/header"
import HeroBanner from "../home-course/hero-banner"
import CategoriesSection from "../home-course/categories-section"
import CoursesSection from "../home-course/courses-section"
import LearningProgressSection from "../home-course/learning-progress-section"
import TutorsSection from "../home-course/tutors-section"
import AdminSection from "../home-course/admin-section"
import ChatButton from "../home-course/chat-button"
import Footer from "../home-course/footer"
import { useFetchCourses } from "../../../hook/useFetchCourses"

export default function HomeScreen() {

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { coursesFetching, loading, error } = useFetchCourses(db)
  const [courses, setCourses] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true)
  const [user] = useAuthState(auth)


  // ✅ Met à jour courses lorsque coursesFetching change
  useEffect(() => {
    setCourses(coursesFetching) // Charge les cours au démarrage
  }, [coursesFetching])

  // ✅ Met à jour les résultats de recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }, [searchQuery, courses])

  // ✅ Filtrage par catégorie
  useEffect(() => {
    if (!selectedCategory) {
      setCourses(coursesFetching) // Réinitialise si aucune catégorie sélectionnée
      return
    }

    const filtered = coursesFetching.filter((course) => course.category === selectedCategory)
    setCourses(filtered)
  }, [selectedCategory, coursesFetching])

  // ✅ Fonction pour ajouter/retirer des favoris
  const toggleFavorite = (courseId) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, isFavorite: !course.isFavorite } : course
      )
    )
  }

  // ✅ Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    setCourses(coursesFetching)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col dark">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isAdmin={isAdmin}
      />

      <main className="flex-1">
        <HeroBanner />

        <CategoriesSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          resetFilters={resetFilters}
        />

        <CoursesSection
          courses={courses} // ✅ Correction : on passe courses filtrés
          selectedCategory={selectedCategory}
          toggleFavorite={toggleFavorite}
          resetFilters={resetFilters}
        />

        <LearningProgressSection numCourses={2}/>

        <TutorsSection />

        {isAdmin && <AdminSection />}

        <ChatButton />
      </main>

      <Footer />
    </div>
  )
}
