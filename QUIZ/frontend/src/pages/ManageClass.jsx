import React, { useState, useEffect } from 'react';
import TeacherNav from '../components/Teacher_Navbar'
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
import { Button, Divider } from 'antd'

export default function ManageClass() {
    const { user } = useUser();
    const [classes, setClasses] = useState([]);

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


  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherNav />
        {/* container 1 */}
    {classes.map((cls) => (
      <div className='w-screen h-screen'>
        <div className='flex m-6 font-bold text-4xl'>
          <span>{cls.name}</span>  
        </div>
        
        <div className="p-4 flex flex-col w-auto h-[85%] m-6 bg-[#f1f1f1] shadow-md rounded-md">
            <div className='flex justify-between'>
            <span className='m-4 font-bold text-2xl'>Activity</span>

            <Button 
                className='m-4 w-auto h-auto p-2 rounded-lg shadow-md'
                type='primary'
            >        
                Create a Quiz
            </Button>
            </div>

            <div className='w-auto h-[30%] rounded-md border-2 m-2'>
            {/* display all of the Created Activity*/}
            </div>


            {/* display all of the students that are enrolled */}
            <div className='my-4 h-full'>
            <span className='m-4 font-bold text-2xl'>Enrolled Students</span>

                <div className='border-2 w-auto h-[30%] m-2'>
                    {/* enrolled students go here */}
                </div>
            </div>

        </div>
      </div>))}
    </div>
  )
}
