import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
import { Input, Button, Alert, Typography } from 'antd';

// Import image from public folder or src/assets
import pic from '../../public/pic.png';  // Adjust this path if you store it in src/assets

const { Title, Text } = Typography;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser from context

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch the list of students and teachers
      const studentsResponse = await fetch('http://localhost:8000/students/');
      const students = await studentsResponse.json();

      const teachersResponse = await fetch('http://localhost:8000/teachers/');
      const teachers = await teachersResponse.json();

      // Check if credentials match any student or teacher
      const student = students.find(
        (student) => student.username === username && student.password === password
      );
      const teacher = teachers.find(
        (teacher) => teacher.username === username && teacher.password === password
      );

      if (student) {
        setUser({ id: student.id, name: student.name }); // Save student info in context
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Logged in successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/student');
      } else if (teacher) {
        setUser({ id: teacher.id, name: teacher.name }); // Save teacher info in context
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Logged in successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/teacher');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-purple-800 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Image above Welcome Back title */}
        <div className="mb-6 text-center">
          <img src={pic} alt="Login Illustration" className="w-32 h-32 mx-auto mb-4" />
        </div>

        {/* Title with enhanced styling */}
        <Title level={2} className="text-center text-purple-700 mb-6 font-semibold">
          Welcome Back
        </Title>

        {/* Input for Username */}
        <div className="mb-4">
          <Text className="block text-sm text-gray-600 mb-2">Username</Text>
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="large"
            className="border-2 border-gray-300 rounded-md"
          />
        </div>

        {/* Input for Password */}
        <div className="mb-4">
          <Text className="block text-sm text-gray-600 mb-2">Password</Text>
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="large"
            className="border-2 border-gray-300 rounded-md"
          />
        </div>

        {/* Error handling */}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4 font-medium" />
        )}

        {/* Login Button */}
        <Button
          type="primary"
          onClick={handleLogin}
          block
          size="large"
          className="bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 text-white font-semibold"
        >
          Sign in
        </Button>

        {/* Sign Up link */}
        <div className="mt-6 text-center">
          <Text className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-400 hover:underline font-medium">
              Sign up
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
