import React, { useState, useEffect } from 'react';
import Student_Navbar from '../components/Student_Navbar';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { Button } from 'antd';

export default function TakeActivity() {
  const [classDetails, setClassDetails] = useState(null);
  const [activities, setActivities] = useState([]); // State to store activities
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State to store enrolled students

  // Get classId from passed state using useLocation
  const location = useLocation();
  const { classId } = location.state || {}; 

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
  }, [classId]); // Depend on classId so this effect runs when classId changes

  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Student_Navbar />

      <div className="flex-grow h-screen">
        <div className="p-4 flex flex-col w-auto h-[85%] m-6 bg-[#f1f1f1] shadow-md rounded-md">

          {/* Display activities */}
          <div className="space-y-4 p-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                
                <div key={activity.id} >
                    <h1 className='text-2xl font-bold m-3'>{activity.name}</h1>
                  <div className="flex flex-col bg-white p-4 shadow-md rounded-md">
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                  
                </div>
              ))
            ) : (
              <p>No activities available for this class.</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button type="primary">
              <Link>Submit</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
