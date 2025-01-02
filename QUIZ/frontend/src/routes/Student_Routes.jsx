import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Student from '../pages/Student'
import StudentClass from '../pages/StudentClass'
import EditStudentProfile from '../pages/EditStudentProfile'
import TakeActivity from '../pages/TakeActivity'
const Student_Routes = () => {
      return (
            <>
                  <Routes>
                        <Route path='/' element={<Student />}></Route>
                        <Route path="/student-class" element={<StudentClass />} />
                        <Route path="/profile" element={<EditStudentProfile />} />
                        <Route path="/take-activity" element={<TakeActivity />}/>
                  </Routes>
            </>
      )
}

export default Student_Routes