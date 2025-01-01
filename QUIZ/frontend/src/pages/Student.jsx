import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios'
import Student_Navbar from '../components/Student_Navbar';
import { useUser } from '../UserContext'
const Student = () => {
      const { user } = useUser();
      const [classes, setClasses] = useState([]);
      const [joinCode, setJoinCode] = useState('');
      const [showModal, setShowModal] = useState(false);



      useEffect(() => {
            const fetchClasses = async () => {
                  try {
                        const response = await fetch('http://localhost:8000/classes/');
                        if (response.ok) {
                              const data = await response.json();
                              setClasses(data);
                        } else {
                              console.error('Failed to fetch classes');
                        }
                  } catch (error) {
                        console.error('Error fetching classes:', error);
                  }
            };
            fetchClasses();
      }, [user.name]);


      const joinClass = async (studentId, classCode) => {
            try {
                  // Fetch the student's current data
                  const { data: studentData } = await axios.get(`http://localhost:8000/students/${studentId}`);
                  const currentClasses = studentData.joined_classes;

                  // Fetch all classes
                  const { data: classes } = await axios.get('http://localhost:8000/classes/');
                  const matchedClass = classes.find((cls) => cls.class_code === classCode);

                  if (!matchedClass) {
                        alert("Invalid class code!");
                        return;
                  }

                  if (currentClasses.includes(matchedClass.id)) {
                        Swal.fire({
                              position: "center",
                              icon: "error",
                              title: "You have already joined this class!",
                              showConfirmButton: false,
                              timer: 1500
                        });

                        setShowModal(false)
                        return;
                  }

                  // Update the joined_classes with the new class ID
                  const updatedJoinedClasses = [...currentClasses, matchedClass.id];

                  // Perform the update using a PUT request
                  await axios.put(`http://localhost:8000/students/${studentId}/`, {
                        name: studentData.name,
                        username: studentData.username,
                        password: studentData.password,
                        joined_classes: updatedJoinedClasses,
                  });

                  Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Successfully joined the class!",
                        showConfirmButton: false,
                        timer: 1500
                  });
            } catch (error) {
                  console.error("Error joining class:", error);
                  if (error.response) {
                        console.error("Response data:", error.response.data);
                  }
            }

            setShowModal(false)
      };


      return (
            <div className="flex h-screen bg-gray-100">
                  {/* Sidebar */}
                  <Student_Navbar />

                  {/* Main Content */}
                  < main className="flex-grow p-8" >
                        {/* Header */}
                        < header className="flex justify-between items-center mb-6" >
                              <h1 className="text-2xl font-bold">Home</h1>
                              <button onClick={() => setShowModal(!showModal)} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                                    Join Class
                              </button>
                        </header >

                        {/* Greeting and Input */}
                        < div className="bg-white p-6 rounded-lg shadow mb-8" >
                              <h2 className="text-xl font-bold mb-4">Hi, {user.name}!</h2>
                              <div className="flex items-center space-x-4">
                                    <input
                                          onChange={(e) => setJoinCode(e.target.value)}
                                          type="text"
                                          placeholder="Enter a join code"
                                          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <button
                                          onClick={() => {
                                                joinClass(user.id, joinCode);
                                                setJoinCode(''); // Clear the input field
                                          }}
                                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                          Join
                                    </button>
                              </div>
                        </div >

                        {/* Recent Quizzes and Classes */}
                        < div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                              {/* Recent Quizzes */}
                              < div className="bg-white p-6 rounded-lg shadow" >
                                    <h3 className="text-lg font-bold mb-4">Recent Quiz</h3>
                                    <ul className="space-y-3">
                                          {["Quiz Name", "Quiz Name", "Quiz Name", "Quiz Name"].map(
                                                (quiz, index) => (
                                                      <li
                                                            key={index}
                                                            className="flex justify-between items-center p-2 rounded-lg bg-gray-100"
                                                      >
                                                            <span>{quiz}</span>
                                                            <span className="text-sm text-gray-500">12:00 PM</span>
                                                      </li>
                                                )
                                          )}
                                    </ul>
                              </div >

                              {/* Recent Classes */}
                              < div className="bg-white p-6 rounded-lg shadow" >
                                    <div className="flex justify-between items-center mb-4">
                                          <h3 className="text-lg font-bold">Recent Classes</h3>
                                          <a href="http://localhost:8000/classes/" target='_blank' className="text-sm text-purple-500 hover:underline">
                                                View All
                                          </a>
                                    </div>
                                    <ul className="space-y-3 overflow-y-scroll max-h-48">
                                          {classes.map((classItem) => (
                                                <li
                                                      key={classItem.id}
                                                      className="flex justify-between items-center p-2 rounded-lg bg-gray-100"
                                                >
                                                      <span className="flex items-center space-x-3">
                                                            <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                                                                  CM
                                                            </span>
                                                            <span>{classItem.name}</span>
                                                      </span>
                                                      <span className="text-sm text-gray-500">{classItem.teacher}</span>
                                                </li>
                                          ))}
                                    </ul>

                              </div >
                        </div >
                  </main >



                  {/* // CONDITIONAL RENDERING HERE */}
                  {showModal && (
                        <div onClick={() => setShowModal(!showModal)} className='bg-black/60 fixed inset-0 flex items-center justify-center z-50'>

                              <div onClick={(e) => e.stopPropagation()}
                                    className="flex flex-col items-center gap-8 bg-white md:w-[800px] md:py-20 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-4xl text-purple-900 font-bold mb-4">Enter Class Code</h2>
                                    <input
                                          onChange={(e) => setJoinCode(e.target.value)}
                                          type="text"
                                          placeholder="Enter a join code"
                                          className="flex-grow px-4 w-[80%] text-center py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <button
                                          onClick={() => {
                                                joinClass(user.id, joinCode);
                                                setJoinCode(''); // Clear the input field
                                          }}
                                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    >
                                          Join
                                    </button>

                              </div>


                        </div>
                  )}
            </div >


      );
}

export default Student