import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Teacher from '../pages/Teacher'
import CreateQuiz from '../pages/CreateQuiz'
import EditTeacherProfile from '../pages/EditTeacherProfile'
const Teacher_Routes = () => {
      return (
            <div>
                  <Routes>
                        <Route path='/' element={<Teacher />}></Route>
                        <Route path="/profile" element={<EditTeacherProfile />} />
                        <Route path="/create-quiz" element={<CreateQuiz />} />
                  </Routes>
            </div>
      )
}

export default Teacher_Routes