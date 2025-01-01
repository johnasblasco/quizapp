import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext'
const Teacher_Navbar = () => {

      const { user } = useUser();
      const navigate = useNavigate();

      return (
            <aside className="hidden md:flex w-64 bg-purple-800 text-white flex-col">
                  <div className="flex items-center justify-center h-20 border-b border-purple-600">
                        <div className="text-2xl font-bold">QUIZIT</div>
                  </div>
                  <div className="flex flex-col flex-grow">
                        <div className="flex items-center px-4 py-6">
                              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                              <div className="ml-4">
                                    <p className="font-bold text-lg">Hello, {user.name}</p>
                                    <p className="text-sm">Teacher</p>
                              </div>
                        </div>
                        <nav className="flex-grow">
                              <ul className="space-y-4 px-4">
                                    <li>

                                          <Link to={'/teacher'}
                                                className="flex items-center p-2 rounded-lg hover:bg-purple-700"
                                          >
                                                <span className="ml-2">Home</span>
                                          </Link>
                                    </li>
                                    <li>
                                          <Link to={'/teacher/profile '}
                                                className="flex items-center p-2 rounded-lg hover:bg-purple-700"
                                          >
                                                <span className="ml-2">Profile</span>
                                          </Link>
                                    </li>
                              </ul>
                        </nav>
                        <div className="p-4">
                              <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center w-full p-2 rounded-lg bg-purple-700 hover:bg-purple-600"
                              >
                                    <span className="mx-auto">Logout</span>
                              </button>
                        </div>
                  </div>
            </aside>

      )
}

export default Teacher_Navbar