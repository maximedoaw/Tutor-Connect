"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"

export default function CourseNavigation({ goToPreviousLesson, goToNextLesson, isFirstLesson, isLastLesson }) {
  return (
    <div className="flex justify-between mt-8">
      <button
        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
          isFirstLesson ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        onClick={goToPreviousLesson}
        disabled={isFirstLesson}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Précédent</span>
      </button>

      <button
        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
          isLastLesson ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        onClick={goToNextLesson}
        disabled={isLastLesson}
      >
        <span>Suivant</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

