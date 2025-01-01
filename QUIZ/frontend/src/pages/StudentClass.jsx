import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Student_Navbar from '../components/Student_Navbar';

const StudentClass = () => {
      const [joinedClasses, setJoinedClasses] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const navigate = useNavigate();

      useEffect(() => {
            const fetchJoinedClasses = async () => {
                  try {
                        const response = await fetch('http://localhost:8000/students/8/'); // Replace `8` with the current student's ID
                        if (!response.ok) {
                              throw new Error(`Failed to fetch data: ${response.status}`);
                        }
                        const data = await response.json();
                        setJoinedClasses(data.joined_classes); // Ensure `joined_classes` contains class IDs
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchJoinedClasses();
      }, []);

      return (
            <div className="flex h-screen bg-gray-100">
                  {/* Sidebar */}
                  <Student_Navbar />

                  {/* Main Content */}
                  <div className="flex-1 p-6">
                        <h1 className="text-3xl font-bold mb-6">Your Classes</h1>

                        {loading ? (
                              <p>Loading classes...</p>
                        ) : error ? (
                              <p className="text-red-500">Error: {error}</p>
                        ) : joinedClasses.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {joinedClasses.map((classId) => (
                                          <ClassCard key={classId} classId={classId} navigate={navigate} />
                                    ))}
                              </div>
                        ) : (
                              <p className="text-gray-600">You have not joined any classes yet.</p>
                        )}
                  </div>
            </div>
      );
};

// Reusable component to fetch and display class details
const ClassCard = ({ classId, navigate }) => {
      const [classData, setClassData] = useState(null);

      useEffect(() => {
            const fetchClassData = async () => {
                  try {
                        const response = await fetch(`http://localhost:8000/classes/${classId}/`);
                        const data = await response.json();
                        setClassData(data);
                  } catch (err) {
                        console.error(`Failed to fetch class data for ID: ${classId}`, err);
                  }
            };

            fetchClassData();
      }, [classId]);

      if (!classData) {
            return <div className="bg-gray-200 p-4 rounded-lg">Loading class details...</div>;
      }

      return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-purple-600 mb-2">{classData.name}</h2>
                  <p className="text-gray-800 mb-2">Teacher: {classData.teacher}</p>
                  <p className="text-gray-600 mb-4">Class Code: {classData.class_code}</p>
                  <button
                        onClick={() => navigate(`/class/${classId}`)} // Navigate to class-specific page
                        className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                        Go to Class
                  </button>
            </div>
      );
};

export default StudentClass;
