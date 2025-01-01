import React from 'react';
import { useLocation } from 'react-router-dom';

const CreateQuiz = () => {
      const location = useLocation();
      const { classId, className } = location.state || {};

      return (
            <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Create Quiz for {className}</h1>
                  <p>Class ID: {classId}</p>
                  {/* Add your quiz creation form or UI here */}
            </div>
      );
};

export default CreateQuiz;
