import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Student_Navbar from "../components/Student_Navbar";
import { useUser } from "../UserContext";

const Student = () => {
  const { user } = useUser();
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8000/classes/");
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [user.name]);

  const joinClass = async (studentId, classCode) => {
    try {
      const { data: studentData } = await axios.get(
        `http://localhost:8000/students/${studentId}`
      );
      const currentClasses = studentData.joined_classes;

      const { data: allClasses } = await axios.get(
        "http://localhost:8000/classes/"
      );
      const matchedClass = allClasses.find(
        (cls) => cls.class_code === classCode
      );

      if (!matchedClass) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid class code!",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      if (currentClasses.includes(matchedClass.id)) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "You have already joined this class!",
          showConfirmButton: false,
          timer: 1500,
        });
        setShowModal(false);
        return;
      }

      const updatedJoinedClasses = [...currentClasses, matchedClass.id];

      await axios.put(`http://localhost:8000/students/${studentId}/`, {
        ...studentData,
        joined_classes: updatedJoinedClasses,
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully joined the class!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error joining class:", error);
    }
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Student_Navbar />

      {/* Main Content */}
      <main className="flex-grow p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-purple-800">Dashboard</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700"
          >
            Join Class
          </button>
        </header>

        {/* Greeting */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user.name || "Student"}!
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter a join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={() => {
                joinClass(user.id, joinCode);
                setJoinCode("");
              }}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Join
            </button>
          </div>
        </section>

        {/* Recent Classes and Quizzes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Recent Classes</h3>
              <a
                href="http://localhost:8000/classes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-500 hover:underline"
              >
                View All
              </a>
            </div>
            <ul className="space-y-3 overflow-y-auto max-h-48">
              {classes.map((classItem) => (
                <li
                  key={classItem.id}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                >
                  <span className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                      {classItem.name[0]}
                    </span>
                    <span>{classItem.name}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {classItem.teacher}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Quizzes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Recent Quizzes</h3>
            <ul className="space-y-3">
              {["Math Quiz", "Science Quiz", "History Quiz"].map(
                (quiz, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                  >
                    <span>{quiz}</span>
                    <span className="text-sm text-gray-500">12:00 PM</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-lg shadow-lg text-center w-[90%] md:w-[500px]"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-6">
              Enter Class Code
            </h2>
            <input
              type="text"
              placeholder="Enter class code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={() => {
                joinClass(user.id, joinCode);
                setJoinCode("");
              }}
              className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
