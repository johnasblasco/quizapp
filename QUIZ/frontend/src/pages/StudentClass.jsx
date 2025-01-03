import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Student_Navbar from '../components/Student_Navbar';

// The main StudentClass component
const StudentClass = () => {
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const studentName = 'John Doe'; // Replace with dynamic student name, if needed

  useEffect(() => {
    const fetchJoinedClasses = async () => {
      try {
        // Fetch student data using the student's name (replace 'John Doe' with dynamic student name)
        const response = await fetch(`http://localhost:8000/students?name=${studentName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch student data: ${response.status}`);
        }
        const data = await response.json();

        if (data.length === 0) {
          throw new Error('Student not found');
        }

        const studentData = data[0]; // Assuming the name is unique or we pick the first match
        // Fetch the details of all the classes the student is joined in
        const classPromises = studentData.joined_classes.map((classId) =>
          fetch(`http://localhost:8000/classes/${classId}/`)
            .then((response) => response.json())
            .catch((err) => console.error(`Failed to fetch class data for ID: ${classId}`, err))
        );
        const classesData = await Promise.all(classPromises);
        setJoinedClasses(classesData); // Set the list of class data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedClasses();
  }, [studentName]); // re-run the effect if studentName changes

  // Render the page with the joined classes
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
            {/* Render a ClassCard for each joined class */}
            {joinedClasses.map((classData) => (
              <ClassCard key={classData.id} classData={classData} navigate={navigate} />
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
const ClassCard = ({ classData, navigate }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-purple-600 mb-2">{classData.name}</h2>
      <p className="text-gray-800 mb-2">Teacher: {classData.teacher}</p>
      <p className="text-gray-600 mb-4">Class Code: {classData.class_code}</p>
      <button
        onClick={() => navigate(`/class/${classData.id}`)} // Navigate to the class-specific page
        className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
      >
        Go to Class
      </button>
    </div>
  );
};

export default StudentClass;
