import React, { useState, useEffect } from 'react';
import Student_Navbar from '../components/Student_Navbar';
import { Link, useLocation } from 'react-router-dom';
import { Button, Modal } from 'antd';

export default function TakeActivity() {
  const [classDetails, setClassDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [questions, setQuestions] = useState({});
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState({});
  const [trueFalseAnswers, setTrueFalseAnswers] = useState({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const location = useLocation();
  const { classId } = location.state || {};

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return;

      try {
        const response = await fetch('http://localhost:8000/classes/');
        if (response.ok) {
          const data = await response.json();
          const selectedClass = data.find((cls) => cls.id === classId);
          setClassDetails(selectedClass);

          if (selectedClass) {
            const activitiesResponse = await fetch(`http://localhost:8000/activities/?class_id=${classId}`);
            if (activitiesResponse.ok) {
              const activitiesData = await activitiesResponse.json();
              setActivities(activitiesData);

              const questionsMap = activitiesData.reduce((acc, activity) => {
                if (activity.questions) {
                  acc[activity.name] = activity.questions;
                }
                return acc;
              }, {});

              setQuestions(questionsMap);
            } else {
              console.error('Failed to fetch activities');
            }
          }
        } else {
          console.error('Failed to fetch class details');
        }
      } catch (error) {
        console.error('Error fetching class details or activities:', error);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const handleMultipleChoiceChange = (activityName, questionId, answer) => {
    setMultipleChoiceAnswers((prev) => ({
      ...prev,
      [activityName]: {
        ...prev[activityName],
        [questionId]: answer,
      },
    }));
  };

  const handleTrueFalseChange = (activityName, questionId, answer) => {
    setTrueFalseAnswers((prev) => ({
      ...prev,
      [activityName]: {
        ...prev[activityName],
        [questionId]: answer,
      },
    }));
  };

  const handleOpenEndedChange = (activityName, questionId, answer) => {
    setOpenEndedAnswers((prev) => ({
      ...prev,
      [activityName]: {
        ...prev[activityName],
        [questionId]: answer,
      },
    }));
  };

  const calculateScore = () => {
    let calculatedScore = 0;
  
    activities.forEach((activity) => {
      questions[activity.name]?.forEach((question) => {
        const correctAnswer = question.correct_answer?.trim(); // Ensure trimming any extra spaces
  
        if (question.question_type === 'multiple_choice') {
          if (
            multipleChoiceAnswers[activity.name]?.[question.id] === correctAnswer
          ) {
            calculatedScore += 1;
          }
        } else if (question.question_type === 'true_false') {
          // Ensure both answers are compared in lowercase and trimmed to avoid mismatches
          const selectedAnswer = trueFalseAnswers[activity.name]?.[question.id]?.trim()?.toLowerCase();
          const correctAnswerLowercase = correctAnswer?.toLowerCase(); 
  
          if (selectedAnswer === correctAnswerLowercase) {
            calculatedScore += 1;
          }
        } else if (question.question_type === 'open_ended' || question.question_type === 'identification') {
          if (
            openEndedAnswers[activity.name]?.[question.id]?.trim().toLowerCase() ===
            correctAnswer?.trim().toLowerCase()
          ) {
            calculatedScore += 1;
          }
        }
      });
    });
  
    setScore(calculatedScore);
    setIsModalVisible(true);
  };
  

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Student_Navbar />

      <div className="flex-grow h-screen">
        <div className="p-4 flex flex-col w-auto h-[85%] m-6 bg-[#f1f1f1] shadow-md rounded-md">
          <div className="space-y-4 p-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.name}>
                  <h1 className="text-2xl font-bold m-3">{activity.name}</h1>
                  <div className="flex flex-col bg-white p-4 shadow-md rounded-md">
                    <p className="text-gray-600">{activity.description}</p>

                    {questions[activity.name] && questions[activity.name].length > 0 ? (
                      questions[activity.name].map((question) => (
                        <div key={question.id} className="mt-4">
                          <p className="font-bold text-lg">{question.question_text}</p>

                          {/* Multiple Choice */}
                          {question.question_type === 'multiple_choice' && question.options && (
                            <div className="mt-2">
                              {question.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`mc_${activity.name}_${question.id}_${index}`}
                                    name={`mc_${activity.name}_${question.id}`}
                                    value={option}
                                    onChange={() =>
                                      handleMultipleChoiceChange(activity.name, question.id, option)
                                    }
                                    checked={
                                      multipleChoiceAnswers[activity.name]?.[question.id] === option
                                    }
                                  />
                                  <label
                                    htmlFor={`mc_${activity.name}_${question.id}_${index}`}
                                    className="text-gray-600"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* True/False */}
                          {question.question_type === 'true_false' && (
                            <div className="mt-2">
                              <select
                                value={trueFalseAnswers[activity.name]?.[question.id] || ''}
                                onChange={(e) =>
                                  handleTrueFalseChange(activity.name, question.id, e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded-md w-full"
                              >
                                <option value="" disabled>
                                  Select an answer
                                </option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                              </select>
                            </div>
                          )}

                          {/* Open Ended / Identification */}
                          {(question.question_type === 'open_ended' || question.question_type === 'identification') && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={openEndedAnswers[activity.name]?.[question.id] || ''}
                                onChange={(e) =>
                                  handleOpenEndedChange(activity.name, question.id, e.target.value)
                                }
                                placeholder="Your answer"
                                className="p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No questions available for this activity.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No activities available for this class.</p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Button type="primary" onClick={calculateScore}>
              Submit
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Your Score"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <p className="text-xl font-bold text-violet-500">Your Score: {score}</p>
      </Modal>
    </div>
  );
}
