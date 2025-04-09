"use client"

import { X, CheckCircle, Circle } from "lucide-react"

export default function CourseSidebar({
  course,
  currentModule,
  currentLessonInModule,
  handleLessonClick,
  sidebarOpen,
  setSidebarOpen,
}) {
  if (!course || !course.modules) {
    return null
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-0 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-gray-900 border-r border-gray-800 transition-transform transform md:translate-x-0 md:static md:h-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 md:hidden">
          <h2 className="font-bold">Contenu du cours</h2>
          <button className="p-2 rounded-lg bg-gray-800 text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">{course.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{course.instructor}</p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border-b border-gray-800">
              <div className="p-4">
                <h3 className="font-medium">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {module.lessons.length} leçon{module.lessons.length > 1 ? "s" : ""}
                </p>
              </div>

              <ul className="space-y-1 px-4 pb-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <button
                      className={`flex items-center gap-2 w-full text-left p-2 rounded-lg ${
                        moduleIndex === currentModule && lessonIndex === currentLessonInModule
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                    >
                      {lesson.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

