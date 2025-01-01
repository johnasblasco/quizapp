import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import TeacherNav from '../components/Teacher_Navbar';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
import { Button } from 'antd';

export default function ManageClass() {
  const { user } = useUser();
  const [classDetails, setClassDetails] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const location = useLocation();
  const { classId } = location.state || {};  // Get classId from passed state

  // Fetch the class based on classId
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/classes/');
        if (response.ok) {
          const data = await response.json();
          const selectedClass = data.find((cls) => cls.id === classId);  // Find the class by ID
          setClassDetails(selectedClass);

          if (selectedClass) {
            // Fetch all students data
            const studentsResponse = await fetch('http://localhost:8000/students/');
            if (studentsResponse.ok) {
              const studentsData = await studentsResponse.json();
              // Filter students who joined the class with matching classId
              const studentsInClass = studentsData.filter(student =>
                student.joined_classes.includes(classId)
              );
              setEnrolledStudents(studentsInClass);
            } else {
              console.error('Failed to fetch students data');
            }
          }
        } else {
          console.error('Failed to fetch class details');
        }
      } catch (error) {
        console.error('Error fetching class details or students:', error);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherNav />
      
      <div className='flex-grow h-screen'>
        <div className='flex m-6 font-bold text-4xl'>
          <span>{classDetails.name}</span>  
        </div>
        
        <div className="p-4 flex flex-col w-auto h-[85%] m-6 bg-[#f1f1f1] shadow-md rounded-md">
          <div className='flex justify-between'>
            <span className='m-4 font-bold text-2xl'>Activity</span>

            <Button className="m-4 w-auto h-auto p-2 rounded-lg shadow-md" type="primary">
                <Link to="/teacher/create-quiz"> {/* Absolute path to /teacher/create-quiz */}
                    Create a Quiz
                </Link>
            </Button>
          </div>

          <div className='w-auto h-[30%] rounded-md border-2 m-2'>
            {/* Display all the Created Activities */}
          </div>

          <div className='my-4 h-full'>
            <span className='m-4 font-bold text-2xl'>Enrolled Students</span>

            <div className='border-2 w-auto h-[30%] m-2'>
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((student) => (
                  <div key={student.id} className="p-2 flex flex-col">
                    <span className='font-bold'>{student.name}</span>
                  </div>
                ))
              ) : (
                <p>No students enrolled in this class.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
