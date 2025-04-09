"use client"

import { CheckCircle } from "lucide-react"

export default function LessonItem({ lesson, isActive, onClick }) {
  return (
    <button
      className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded ${
        isActive ? "bg-primary/20 text-primary" : "hover:bg-gray-800 text-gray-300"
      }`}
      onClick={onClick}
    >
      {lesson.completed ? (
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-gray-600 flex-shrink-0" />
      )}
      <span className="text-sm">{lesson.title}</span>
      <span className="ml-auto text-xs text-gray-500">{lesson.duration}</span>
    </button>
  )
}

