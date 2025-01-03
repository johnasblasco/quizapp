import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Teacher from '../pages/Teacher'
import CreateQuiz from '../pages/CreateQuiz'
import EditTeacherProfile from '../pages/EditTeacherProfile'
import ManageClass from '../pages/ManageClass'
import ViewActivity from '../pages/ViewActivity'


const Teacher_Routes = () => {
      return (
            <div>
                  <Routes>
                        <Route path='/' element={<Teacher />}></Route>
                        <Route path="/profile" element={<EditTeacherProfile />} />
                        <Route path="/create-quiz" element={<CreateQuiz />} />
                        <Route path="/manage-class" element={<ManageClass />} />
                        <Route path="/view-activity" element={<ViewActivity />}/>
                  </Routes>
            </div>
      )
}

export default Teacher_Routes