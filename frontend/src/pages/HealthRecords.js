import React from "react";
import { Navigate } from "react-router-dom";

const HealthRecords = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Health Records</h2>
        <p className="text-gray-700">Display health records here.</p>
      </div>
    </div>
  );
};

export default HealthRecords;
