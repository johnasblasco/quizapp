import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Student from '../pages/Student'
import StudentClass from '../pages/StudentClass'
import EditStudentProfile from '../pages/EditStudentProfile'
const Student_Routes = () => {
      return (
            <>
                  <Routes>
                        <Route path='/' element={<Student />}></Route>
                        <Route path="/student-class" element={<StudentClass />} />
                        <Route path="/profile" element={<EditStudentProfile />} />
                  </Routes>
            </>
      )
}

export default Student_Routes