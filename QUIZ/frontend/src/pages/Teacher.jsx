import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Teacher_Navbar from '../components/Teacher_Navbar';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';

const Teacher = () => {
      const { user } = useUser();
      const [showClass, setShowClass] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
      const [classes, setClasses] = useState([]);
      const [className, setClassName] = useState('');
      const [classId, setClassId] = useState('');

      // Fetch classes from the backend
      useEffect(() => {
            const fetchClasses = async () => {
                  try {
                        const response = await fetch('http://localhost:8000/classes/');
                        if (response.ok) {
                              const data = await response.json();
                              const teacherClasses = data.filter(
                                    (cls) => cls.teacher === user.name
                              );
                              setClasses(teacherClasses);
                        } else {
                              console.error('Failed to fetch classes');
                        }
                  } catch (error) {
                        console.error('Error fetching classes:', error);
                  }
            };
            fetchClasses();
      }, [user.name]);

      // Handle creating a class
      const handleCreateClass = async () => {
            if (!className.trim()) {
                  setErrorMessage('Class name cannot be empty.');
                  return;
            }

            const newClass = {
                  name: className,
                  teacher: user.name || 'Unknown',
                  class_code: classId,
            };

            try {
                  const response = await fetch('http://localhost:8000/classes/', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newClass),
                  });

                  if (response.ok) {
                        const data = await response.json();
                        Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: 'Class created successfully!',
                              showConfirmButton: false,
                              timer: 1500,
                        });

                        setClasses((prev) => [...prev, data]);
                        setShowClass(false);
                        setClassName('');
                        setErrorMessage('');
                  } else {
                        const errorData = await response.json();
                        console.error('Error details:', errorData);
                        setErrorMessage(errorData.message || 'Failed to create class. Please try again.');
                  }
            } catch (error) {
                  console.error('Network error:', error);
                  setErrorMessage(
                        'An error occurred while creating the class. Please check your network and try again.'
                  );
            }
      };

      return (
            <div className="flex h-screen bg-gray-100">
                  {/* Sidebar */}
                  <Teacher_Navbar />

                  {/* Main Content */}
                  <main className="flex-grow p-8">
                        <div className="flex justify-between">
                              <button className="text-purple-800 font-bold mb-4">&lt; Back</button>

                              <button
                                    onClick={() => setShowClass(true)}
                                    className="text-purple-800 font-bold mb-4"
                              >
                                    + create class
                              </button>

                        </div>

                        {classes.length ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {classes.map((cls) => (
                                          <div
                                                key={cls._id}
                                                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                                          >
                                                <h3 className="text-xl font-semibold">{cls.name}</h3>
                                                <p className="text-gray-600">Teacher: {cls.teacher}</p>
                                                <Link
                                                      to="/create-quiz"
                                                      state={{ classId: cls._id, className: cls.name }}
                                                      className="text-purple-600 hover:underline"
                                                >
                                                      Manage Class
                                                </Link>

                                          </div>
                                    ))}
                              </div>
                        ) : (
                              <div className="flex flex-col items-center justify-center h-full">
                                    <img
                                          src="https://via.placeholder.com/150"
                                          alt="No classes"
                                          className="mb-6 w-32"
                                    />
                                    <p className="text-gray-600 text-lg mb-4">
                                          You don’t have any classes yet.
                                    </p>
                                    <button
                                          onClick={() => setShowClass(true)}
                                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                          Create Class
                                    </button>
                              </div>
                        )}

                        {/* Show error message if it exists */}
                        {errorMessage && (
                              <div className="mt-4 text-red-600 font-bold">{errorMessage}</div>
                        )}
                  </main>

                  {/* CONDITIONAL RENDERING FOR CLASS CREATION MODAL */}
                  {showClass && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4">Create Class Room</h2>
                                    <input
                                          type="text"
                                          placeholder="Class Name"
                                          value={className}
                                          onChange={(e) => setClassName(e.target.value)}
                                          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                    <input
                                          type="text"
                                          placeholder="Class Code eg. 123456"
                                          value={classId}
                                          onChange={(e) => setClassId(e.target.value)}
                                          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                          onClick={handleCreateClass}
                                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                          Create Class
                                    </button>
                                    <button
                                          onClick={() => setShowClass(false)}
                                          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                          Cancel
                                    </button>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Teacher;
