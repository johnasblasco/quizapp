import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext'

const Login = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const { setUser } = useUser(); // Access setUser from context

      const handleLogin = async (e) => {
            e.preventDefault();

            try {
                  // Fetch the list of students and teachers
                  const studentsResponse = await fetch('http://localhost:8000/students/');
                  const students = await studentsResponse.json();

                  const teachersResponse = await fetch('http://localhost:8000/teachers/');
                  const teachers = await teachersResponse.json();

                  // Check if credentials match any student or teacher
                  const student = students.find((student) => student.username === username && student.password === password);
                  const teacher = teachers.find((teacher) => teacher.username === username && teacher.password === password);

                  if (student) {
                        setUser({ id: student.id, name: student.name }); // Save student info in context
                        Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Logged in successfully!',
                              showConfirmButton: false,
                              timer: 1500,
                        });
                        navigate('/student');
                  } else if (teacher) {
                        setUser({ id: teacher.id, name: teacher.name }); // Save teacher info in context
                        Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Logged in successfully!',
                              showConfirmButton: false,
                              timer: 1500,
                        });
                        navigate('/teacher');
                  } else {
                        setError('Invalid username or password');
                  }
            } catch (err) {
                  setError('An error occurred. Please try again.');
            }
      };

      return (
            <div className="bg-purple-800 min-h-screen flex items-center justify-center ">
                  <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
                        <form className="space-y-4" onSubmit={handleLogin}>
                              <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                          Username
                                    </label>
                                    <input
                                          type="text"
                                          id="username"
                                          className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                          placeholder="Enter your username"
                                          value={username}
                                          onChange={(e) => setUsername(e.target.value)}
                                    />
                              </div>
                              <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                          Password
                                    </label>
                                    <input
                                          type="password"
                                          id="password"
                                          className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                          placeholder="Enter your password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                    />
                              </div>
                              {error && <p className="text-red-500 text-xs">{error}</p>}
                              <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
                              >
                                    Sign in
                              </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-600">
                              Don't have an account?{' '}
                              <a href="/signup" className="text-purple-400 hover:underline">
                                    Sign up
                              </a>
                        </p>
                  </div>
            </div>
      );
};

export default Login;
