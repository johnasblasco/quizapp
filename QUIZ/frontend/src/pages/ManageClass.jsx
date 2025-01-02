import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TeacherNav from '../components/Teacher_Navbar';
import { useUser } from '../UserContext';
import { Button } from 'antd';

export default function ManageClass() {
  const { user } = useUser();
  const [classDetails, setClassDetails] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [activities, setActivities] = useState([]); // State to store activities
  const location = useLocation();
  const { classId } = location.state || {}; // Get classId from passed state

  // Fetch the class, students, and activities based on classId
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/classes/');
        if (response.ok) {
          const data = await response.json();
          const selectedClass = data.find((cls) => cls.id === classId); // Find the class by ID
          setClassDetails(selectedClass);

          if (selectedClass) {
            // Fetch all students data
            const studentsResponse = await fetch('http://localhost:8000/students/');
            if (studentsResponse.ok) {
              const studentsData = await studentsResponse.json();
              // Filter students who joined the class with matching classId
              const studentsInClass = studentsData.filter((student) =>
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

    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:8000/activities/');
        if (response.ok) {
          const data = await response.json();
          // Filter activities by classId
          const classActivities = data.filter((activity) => activity.class_id === classId);
          setActivities(classActivities);
        } else {
          console.error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    if (classId) {
      fetchClassDetails();
      fetchActivities(); // Fetch activities for the class
    }
  }, [classId]);

  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherNav />
      
      <div className="flex-grow h-screen">
        <div className="flex m-6 font-bold text-4xl">
          <span>{classDetails.name}</span>  
        </div>
        
        <div className="p-4 flex flex-col w-auto h-[85%] m-6 bg-[#f1f1f1] shadow-md rounded-md">
          <div className="flex justify-between">
            <span className="m-4 font-bold text-2xl">Activity</span>

            <Button className="m-4 w-auto h-auto p-2 rounded-lg shadow-md" type="primary">
              <Link 
                to="/teacher/create-quiz" 
                state={{ classId: classDetails.id, className: classDetails.name }} // Pass classId and className
              >
                Create a Quiz
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Display all the Created Activities */}
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow border"
                >
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">{activity.name}</span>
                  </div>
                  <Link
                    to={`/teacher/view-activity`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No activities created for this class yet.</p>
            )}
          </div>

          <div className="my-4 h-full">
            <span className="m-4 font-bold text-2xl">Enrolled Students</span>

            <div className="border-2 w-auto h-[30%] m-2">
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((student) => (
                  <div key={student.id} className="p-2 flex flex-col">
                    <span className="font-bold">{student.name}</span>
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
