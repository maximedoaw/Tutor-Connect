
import React from 'react'
import CourseUpdateForm from './components/update-course'

const page = async ({params}) => {
  const { id } = params

  return  <>

  <CourseUpdateForm id={id}/>
  </>
}

export default page