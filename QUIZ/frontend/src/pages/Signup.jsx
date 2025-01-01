import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Signup = () => {
      const navigate = useNavigate();

      const [name, setName] = useState("");
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [accountType, setAccountType] = useState("student");

      const handleSubmit = async (e) => {
            e.preventDefault();

            // Client-side validation
            if (!name || !username || !password) {
                  Swal.fire({
                        icon: "error",
                        title: "Validation Error",
                        text: "All fields are required.",
                  });
                  return;
            }

            const url =
                  accountType === "student"
                        ? "http://localhost:8000/students/"
                        : "http://localhost:8000/teachers/";

            try {
                  const response = await fetch(url, {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name, username, password }),
                  });

                  if (response.ok) {
                        Swal.fire({
                              position: "center",
                              icon: "success",
                              title: "Account created successfully!",
                              showConfirmButton: false,
                              timer: 1500,
                        });
                        navigate("/login");
                  } else {
                        const errorData = await response.json();
                        // Handle API validation errors dynamically
                        const errorMessages = Object.values(errorData)
                              .flat()
                              .join(", ");
                        Swal.fire({
                              icon: "error",
                              title: "Registration Failed",
                              text: errorMessages || "An unknown error occurred.",
                        });
                  }
            } catch (error) {
                  console.error("Error during registration:", error);
                  Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Unable to connect to the server. Please try again later.",
                  });
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center bg-purple-900">
                  <div className="flex w-3/4 max-w-4xl bg-white rounded-lg shadow-lg">
                        {/* Left Panel */}
                        <div className="hidden md:flex w-1/2 p-8 bg-purple-800 rounded-l-lg flex-col justify-center items-center text-white">
                              <h1 className="text-4xl font-bold mb-4">QuizIT</h1>
                              <p className="text-lg">Start your learning with us!</p>
                        </div>
                        {/* Right Panel */}
                        <div className="w-1/2 p-8">
                              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                                    Signup
                              </h2>
                              <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Full Name
                                          </label>
                                          <input
                                                type="text"
                                                id="name"
                                                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                          />
                                    </div>
                                    <div>
                                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                Username
                                          </label>
                                          <input
                                                type="text"
                                                id="username"
                                                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                                placeholder="Choose a username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                          />
                                    </div>
                                    <div>
                                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                          </label>
                                          <input
                                                type="password"
                                                id="password"
                                                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                                placeholder="Create a password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                          />
                                    </div>
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                                User Type
                                          </label>
                                          <div className="flex items-center space-x-4">
                                                <label className="flex items-center">
                                                      <input
                                                            type="radio"
                                                            name="accountType"
                                                            value="student"
                                                            checked={accountType === "student"}
                                                            onChange={(e) => setAccountType(e.target.value)}
                                                            className="form-radio h-4 w-4 text-purple-400"
                                                      />
                                                      <span className="ml-2 text-gray-700">Student</span>
                                                </label>
                                                <label className="flex items-center">
                                                      <input
                                                            type="radio"
                                                            name="accountType"
                                                            value="teacher"
                                                            checked={accountType === "teacher"}
                                                            onChange={(e) => setAccountType(e.target.value)}
                                                            className="form-radio h-4 w-4 text-purple-400"
                                                      />
                                                      <span className="ml-2 text-gray-700">Teacher</span>
                                                </label>
                                          </div>
                                    </div>
                                    <button
                                          type="submit"
                                          className="w-full py-2 px-4 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
                                    >
                                          Create Account
                                    </button>
                              </form>
                        </div>
                  </div>
            </div>
      );
};

export default Signup;
