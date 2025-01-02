import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Teacher_Navbar from "../components/Teacher_Navbar";
import Swal from "sweetalert2";
import { useUser } from "../UserContext";

const Teacher = () => {
  const { user } = useUser();
  const [showClass, setShowClass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");

  // Fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8000/classes/");
        if (response.ok) {
          const data = await response.json();
          const teacherClasses = data.filter((cls) => cls.teacher === user.name);
          setClasses(teacherClasses);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [user.name]);

  // Handle creating a class
  const handleCreateClass = async () => {
    if (!className.trim()) {
      setErrorMessage("Class name cannot be empty.");
      return;
    }

    const newClass = {
      name: className,
      teacher: user.name || "Unknown",
      class_code: classId,
    };

    try {
      const response = await fetch("http://localhost:8000/classes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClass),
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Class created successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        setClasses((prev) => [...prev, data]);
        setShowClass(false);
        setClassName("");
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        setErrorMessage(errorData.message || "Failed to create class. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("An error occurred while creating the class. Please check your network and try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Teacher_Navbar />

      {/* Main Content */}
      <main className="flex-grow p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button className="text-purple-800 font-bold mb-4">&lt; Back</button>
          <button
            onClick={() => setShowClass(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            + Create Class
          </button>
        </div>

        {/* Classes Section */}
        {classes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((cls) => (
                  <Link
                        key={cls.id}
                        to="manage-class"
                        state={{ classId: cls.id, className: cls.name }}// Pass the classId to the state
                        className="block bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl"
                        >
                        <h3 className="text-xl font-semibold">{cls.name}</h3>
                        <p className="text-gray-600">Teacher: {cls.teacher}</p>
                  </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="https://via.placeholder.com/150"
              alt="No classes"
              className="mb-6 w-32"
            />
            <p className="text-gray-600 text-lg mb-4">You don’t have any classes yet.</p>
            <button
              onClick={() => setShowClass(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Class
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-red-600 font-bold">{errorMessage}</div>
        )}
      </main>

      {/* Modal */}
      {showClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowClass(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Create Class Room
            </h2>
            <input
              type="text"
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Class Code e.g. 123456"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleCreateClass}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Class
            </button>
            <button
              onClick={() => setShowClass(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;
