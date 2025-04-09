"use client"

import { Search } from "lucide-react"
import CourseCard from "./course-card"
import { useState, useEffect, useMemo } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function CoursesView({
  searchQuery,
  handleSearch,
  loading,
  selectedFile,
  uploadProgress,
  handleFileChange,
  handleFileUpload,
}) {

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  useEffect(() => {
    const q = query(collection(db, "courses")); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedCourses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(updatedCourses);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => course); // You can add filtering logic based on searchQuery if needed
  }, [courses]);

  // Calculer la portion de cours à afficher pour la page actuelle
  const currentCourses = useMemo(() => {
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [currentPage, filteredCourses]);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des cours</h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Rechercher des cours..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {currentCourses.map((course, index) => (
            <CourseCard
              key={`${course.id}-${index}`}
              course={course}
              selectedFile={selectedFile}
              uploadProgress={uploadProgress}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
            />
          ))}

          {filteredCourses.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Aucun cours trouvé.</p>
              <button className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                Ajouter un cours
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              className="py-2 px-4 bg-gray-800 text-white rounded-lg mx-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className="py-2 px-4 text-white">{currentPage} / {totalPages}</span>
            <button
              className="py-2 px-4 bg-gray-800 text-white rounded-lg mx-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
