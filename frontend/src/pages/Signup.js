import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.role) {
      setError("Please select a role");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        user
      );
      const responseData = response.data;
      alert(responseData.msg);
      setUser({ username: "", email: "", password: "", role: "" });
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      setError(error.response.data.msg || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Username:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Role:
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="staff">Staff</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
