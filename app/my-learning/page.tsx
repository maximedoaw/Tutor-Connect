"use client"

import LearningProgressSection from "../components/home-course/learning-progress-section"


const page = () => {


  return (
    <div className="min-h-screen bg-gray-900">
      <LearningProgressSection numCourses={10000} />
    </div>
  )
}

export default page