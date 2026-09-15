import React, { useState } from "react";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";

const PatientForm = () => {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    contactNumber: "",
    healthRecords: [],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "healthRecords") {
      setPatient((prevState) => ({
        ...prevState,
        healthRecords: e.target.files,
      }));
    } else {
      setPatient((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      return;
    }

    // Client-side preflight validation
    if (!patient.name || !patient.age || !patient.gender || !patient.address || !patient.contactNumber) {
      setError('Please fill all required fields before submitting.');
      return;
    }

    // Ensure at least one file is attached
    if (!patient.healthRecords || patient.healthRecords.length === 0) {
      setError('Please attach at least one health record file.');
      return;
    }

    const formData = new FormData();
    formData.append("name", patient.name);
    formData.append("age", patient.age);
    formData.append("gender", patient.gender);
    formData.append("address", patient.address);
    formData.append("contactNumber", patient.contactNumber);

    for (let i = 0; i < patient.healthRecords.length; i++) {
      formData.append("healthRecords", patient.healthRecords[i]);
    }

    try {
      // Debug: log number of files selected and FormData entries
      try {
        console.log('Number of files selected:', patient.healthRecords.length);
        for (const pair of formData.entries()) {
          if (pair[1] instanceof File) {
            console.log(`FormData entry: ${pair[0]} -> File name=${pair[1].name}, type=${pair[1].type}, size=${pair[1].size}`);
          } else {
            console.log(`FormData entry: ${pair[0]} -> ${pair[1]}`);
          }
        }
      } catch (fdErr) {
        console.warn('Could not iterate FormData entries:', fdErr);
      }

      // Let the browser set the Content-Type (including boundary) for FormData uploads.
      const resp = await axios.post('/patients', formData);
      console.log('Upload response:', resp.status, resp.data);
      alert("Patient added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
        // Surface server message when available
        setError(error.response.data.msg || JSON.stringify(error.response.data) || 'Server Error');
      }

      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          // Use the configured axios instance to call the refresh endpoint under /api/auth/refresh
          const response = await axios.post('/auth/refresh', { refreshToken });
          localStorage.setItem("token", response.data.accessToken);
          await axios.post('/patients', formData);
          alert("Patient added successfully");
          navigate("/dashboard");
        } catch (refreshError) {
          setError("Session expired, please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } else {
        // If we didn't already set a detailed error, show a generic one
        if (!error.response) setError("Error adding patient");
      }
    }
  };

  const validateForm = () => {
    return (
      patient.name &&
      patient.age &&
      patient.gender &&
      patient.address &&
      patient.contactNumber
    );
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Name:
          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Age:
          <input
            type="number"
            name="age"
            value={patient.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Gender:
          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block">
          Address:
          <input
            type="text"
            name="address"
            value={patient.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Contact Number:
          <input
            type="tel"
            name="contactNumber"
            value={patient.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
        <label className="block">
          Health Records:
          <input
            type="file"
            name="healthRecords"
            onChange={handleChange}
            accept=".jpg,.jpeg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf"
            multiple
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          type="submit"
          disabled={!validateForm()}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Patient
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default PatientForm;
