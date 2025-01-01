import React, { useState } from "react";
import { useUser } from "../UserContext";
import Swal from "sweetalert2";
import Teacher_Navbar from "../components/Teacher_Navbar";

const EditTeacherProfile = () => {
      const { user, setUser } = useUser(); // Access user data from context
      const [name, setName] = useState(user?.name || "");
      const [username, setUsername] = useState(user?.username || "");
      const [password, setPassword] = useState("");

      const handleUpdateProfile = async () => {
            try {
                  const response = await fetch(`http://localhost:8000/teachers/${user.id}/`, {
                        method: "PUT", // Adjust this method if PATCH is preferred
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, username, password }),
                  });

                  if (response.ok) {
                        const updatedUser = await response.json();
                        setUser(updatedUser); // Update context with new user data
                        Swal.fire({
                              icon: "success",
                              title: "Profile updated successfully!",
                              showConfirmButton: false,
                              timer: 1500,
                        });
                  } else {
                        Swal.fire({
                              icon: "error",
                              title: "Failed to update profile",
                              text: "Please try again later.",
                        });
                  }
            } catch (error) {
                  console.error("Error updating profile:", error);
                  Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        text: "Please try again later.",
                  });
            }
      };

      return (
            <div className="flex h-screen bg-gray-100">
                  {/* Sidebar */}
                  <Teacher_Navbar />

                  {/* Content Area */}
                  <div className="flex-grow flex items-center justify-center px-4">
                        <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-lg">
                              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Edit Profile
                              </h2>
                              <form
                                    onSubmit={(e) => {
                                          e.preventDefault();
                                          handleUpdateProfile();
                                    }}
                              >
                                    <div className="space-y-6">
                                          {/* Name Field */}
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Name
                                                </label>
                                                <input
                                                      type="text"
                                                      value={name}
                                                      onChange={(e) => setName(e.target.value)}
                                                      placeholder="Enter your name"
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                          </div>

                                          {/* Username Field */}
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Username
                                                </label>
                                                <input
                                                      type="text"
                                                      value={username}
                                                      onChange={(e) => setUsername(e.target.value)}
                                                      placeholder="Enter your username"
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                          </div>

                                          {/* Password Field */}
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      New Password (Optional)
                                                </label>
                                                <input
                                                      type="password"
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)}
                                                      placeholder="Enter a new password"
                                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                          </div>
                                    </div>

                                    {/* Save Changes Button */}
                                    <div className="mt-8">
                                          <button
                                                type="submit"
                                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                          >
                                                Save Changes
                                          </button>
                                    </div>
                              </form>
                        </div>
                  </div>
            </div>
      );
};

export default EditTeacherProfile;
