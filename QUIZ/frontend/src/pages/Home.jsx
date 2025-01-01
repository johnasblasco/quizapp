import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
const Home = () => {
      const navigate = useNavigate();
      return (
            <div className='bg-purple-800 min-h-screen font-roboto'>

                  <Header />

                  <div className='flex flex-col items-center justify-center'>
                        <img src="/logo_white.png" alt="" className='md:size-[600px]' />
                        <div className='mt-[-150px] md:mt-[-350px] md:w-96 text-pretty text-center text-white'>
                              <h1 className='text-4xl '>Welcome to Quizzit</h1>
                              <p>Ready to test your knowledge and have fun?
                                    Sign up or Login kupal to explore exciting quizzz and Challenges.
                              </p>
                        </div>
                        <div className="flex gap-4">
                              <button onClick={() => navigate('/signup')} className="hover:scale-95 w-24 h-16 bg-purple-500 text-white px-4 py-2 rounded-lg mt-4 shadow-md hover:bg-purple-600 transition duration-300">
                                    Signup
                              </button>
                              <button onClick={() => navigate('/login')} className="hover:scale-95 w-24 h-16 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mt-4 shadow-md hover:bg-gray-200 transition duration-300">
                                    Login
                              </button>
                        </div>
                  </div>
            </div>

      )
}

export default Home