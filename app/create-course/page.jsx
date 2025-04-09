"use client"

import React from 'react'
import CourseCreationForm from '../create-course/components/create-course'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/config'

const page = () => {
  const [user] = useAuthState(auth)
  return  <CourseCreationForm />
}

export default page