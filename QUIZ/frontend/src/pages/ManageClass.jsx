import React, { useState, useEffect } from 'react';
import TeacherNav from '../components/Teacher_Navbar'
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';

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
      <div className='w-max'>
        <div className='flex m-6 font-bold text-4xl'>
          <span>{cls.name}</span>  
        </div>
        
        <div className="flex w-full h-5 m-6 bg-red-300">

        </div>

      </div>))}
    </div>
  )
}
