

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Student_Routes from './routes/Student_Routes';
import Teacher_Routes from './routes/Teacher_Routes';
import { UserProvider } from './UserContext';
function App() {


      return (
            <>
                  <UserProvider>
                        <Routes>
                              <Route path='/' element={<Home />} />
                              <Route path='/login' element={<Login />}></Route>
                              <Route path='/signup' element={<Signup />}></Route>
                              <Route path='/student/*' element={<Student_Routes />}></Route>
                              <Route path='/teacher/*' element={<Teacher_Routes />}></Route>
                        </Routes>
                  </UserProvider>

            </>
      )
}

export default App
