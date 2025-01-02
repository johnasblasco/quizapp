import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeacherNav from '../components/Teacher_Navbar';
import Swal from 'sweetalert2';

const CreateQuiz = () => {
  const location = useLocation();
  const { classId, className } = location.state || {}; // Extract classId and className from state
  const navigate = useNavigate();

  const [activityName, setActivityName] = useState('');
  const [questions, setQuestions] = useState([]);

  // Redirect back if classId or className is missing
  useEffect(() => {
    if (!classId || !className) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Class Information',
        text: 'Redirecting to manage classes.',
      }).then(() => {
        navigate('/teacher/manage-class');
      });
    }
  }, [classId, className, navigate]);

  const handleActivityNameChange = (e) => {
    setActivityName(e.target.value);
  };

  const handleAddQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        type: type,
        questionText: '',
        options: type === 'multiple_choice' ? ['', '', '', ''] : [],
        correctAnswer: '',
      },
    ]);
  };

  const handleQuestionTextChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    if (!activityName || !classId) {
      alert('Please fill in the activity name and select a class.');
      return false;
    }

    if (questions.length === 0) {
      alert('Please add at least one question.');
      return false;
    }

    for (const question of questions) {
      if (!question.questionText || !question.correctAnswer) {
        alert('Please complete all fields for each question.');
        return false;
      }

      if (question.type === 'multiple_choice' && question.options.some((option) => !option)) {
        alert('Please fill in all options for multiple-choice questions.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const activityData = {
      class_id: classId,
      name: activityName,
      questions: questions.map((q) => ({
        question_type: q.type,
        question_text: q.questionText,
        options: q.options || [],
        correct_answer: q.correctAnswer,
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/activities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create activity');
      }

      Swal.fire({
        icon: 'success',
        title: 'Activity Created',
        text: 'Your activity has been created successfully!',
      }).then(() => {
        navigate(`/teacher/manage-class`, { state: { classId, className } });
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error creating activity: ${error.message}`,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherNav />
      <div className="flex-grow m-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Create Activity for {className}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2" htmlFor="activityName">
              Activity Name
            </label>
            <input
              type="text"
              id="activityName"
              value={activityName}
              onChange={handleActivityNameChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleAddQuestion('multiple_choice')}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Multiple Choice Question
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('true_false')}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Add True/False Question
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('identification')}
              className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Add Identification Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 bg-white shadow-md rounded">
              <div className="mb-4">
                <label className="block text-lg font-bold mb-2">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter question"
                  required
                />
              </div>

              {question.type === 'multiple_choice' && (
                <div>
                  <div className="mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block text-lg font-bold mb-2">Correct Answer</label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter the correct option"
                    />
                  </div>
                </div>
              )}

              {question.type === 'true_false' && (
                <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Correct Answer</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}

              {question.type === 'identification' && (
                <div className="mb-4">
                  <label className="block text-lg font-bold mb-2">Correct Answer</label>
                  <input
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
            Create Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
