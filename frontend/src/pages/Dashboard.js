import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    contactNumber: ''
  });
  const [newFile, setNewFile] = useState(null);
  const [error, setError] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifiedStaffList, setVerifiedStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);

  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/patients', {
        headers: { 'x-auth-token': token }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPatientsForStaff = async (staffId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/patients/patients', {
        headers: { 'x-auth-token': token },
        params: { user_id: staffId }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctorsList = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/patients/verified', {
        headers: { 'x-auth-token': token }
      });
      setDoctorsList(response.data);
    } catch (error) {
      console.error('Error fetching doctors list:', error);
    }
  };

  const handleRemoveStaffId = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patients/remove-staff', { staffId: userId }, {
        headers: { 'x-auth-token': token }
      });
      fetchDoctorsList();
    } catch (error) {
      console.error('Error removing staff ID:', error);
    }
  };



  const handleGenerateOtp = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current userId before OTP generation:', userId); // Debugging

      const response = await axios.post('http://localhost:5000/api/patients/generate-otp', { userId }, {
        headers: { 'x-auth-token': token }
      });

      console.log('API response for OTP generation:', response.data); // Debugging
      setGeneratedOtp(response.data.otp);
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('Failed to generate OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const staffUserId = prompt("Enter staff user ID for verification:");
      if (!staffUserId) {
        setOtpError('Staff user ID is required for verification.');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/patients/verify-otp', {
        otp: otpValue,
        userId: staffUserId
      }, {
        headers: { 'x-auth-token': token }
      });

      console.log('OTP verification successful:', response.data);
      setOtpError('');
      fetchVerifiedStaffList(); // Fetch the list of verified staff
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      setOtpError('Invalid OTP or Staff User ID. Please try again.');
    }
  };

  // Fetch verified staff list
  const fetchVerifiedStaffList = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/patients/verified-staff', {
        headers: { 'x-auth-token': token }
      });
      setVerifiedStaffList(response.data);
    } catch (error) {
      console.error('Error fetching verified staff:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const storedUserId = localStorage.getItem('userId');

      if (token) {
        setIsAuthenticated(true);
        setUsername(localStorage.getItem('username'));
        setUserRole(role);
        setUserId(storedUserId);

        if (role === 'doctor') {
          await fetchVerifiedStaffList();
        } else {
          await fetchPatients();
          await fetchDoctorsList(); // Fetch doctors list for staff
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    initialize();
  }, []);

  const handleViewPatients = (staffId) => {
    setSelectedStaffId(staffId);
    fetchPatientsForStaff(staffId);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setPatientForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      contactNumber: patient.contactNumber
    });
    setShowDetails(true);
    setEditMode(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setEditMode(false);
  };

  const handleEditPatient = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientForm({
      ...patientForm,
      [name]: value
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/patients/${selectedPatient._id}`, patientForm, {
        headers: {
          "x-auth-token": token
        }
      });
      setSelectedPatient(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Failed to save changes');
    }
  };

  const handleAddFile = async () => {
    if (!newFile || !selectedPatient) return;

    const formData = new FormData();
    formData.append('file', newFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/patients/${selectedPatient._id}/files`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewFile(null);
      await fetchPatients(); // Refresh patient list
    } catch (err) {
      console.error('Error adding file:', err);
      setError('Failed to add file');
    }
  };

  const handleDeleteFile = async (filename) => {
    if (!selectedPatient) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}/files/${filename}`, {
        headers: {
          'x-auth-token': token
        }
      });
      await fetchPatients(); // Refresh patient list
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setPatients(patients.filter(p => p._id !== selectedPatient._id));
      setSelectedPatient(null);
      setShowDetails(false);
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('Failed to delete patient');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {isAuthenticated ? (
        <>
          <p className="text-lg mb-2">Welcome, {username}!</p>
          <p className="text-md mb-2">Role: {userRole}</p>
          <p className="text-md mb-4">User ID: {userId}</p>
          {userRole === 'staff' && (
            <>
              <button
                onClick={handleGenerateOtp}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              >
                Generate OTP
              </button>
              {generatedOtp && (
                <p className="mb-4">
                  Generated OTP: {generatedOtp} <br />
                  User ID: {userId}
                </p>
              )}
              <Link to="/patientform">
                <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
                  Add Patient
                </button>
              </Link>
            </>
          )}

          {userRole === 'doctor' && (
            <>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Enter OTP"
                className="border border-gray-300 p-2 rounded mb-4"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              >
                Verify OTP
              </button>
              {otpError && <p className="text-red-500 mb-4">{otpError}</p>}

                            {verifiedStaffList.length > 0 && (
                <>
                  <select
                    onChange={(e) => { 
                      setSelectedStaffId(e.target.value);
                      fetchPatientsForStaff(e.target.value); // Fetch patients for the selected staff ID
                    }}
                    value={selectedStaffId}
                    className="border border-gray-300 p-2 rounded mb-4"
                  >
                    <option value="">Select Staff</option>
                    {verifiedStaffList.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.username}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((patient) => (
                    <div key={patient._id} className="bg-white shadow-md rounded p-4">
                      <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
                      <p className="text-gray-700 mb-2">Age: {patient.age}</p>
                      <p className="text-gray-700 mb-4">Gender: {patient.gender}</p>
                      <button
                        onClick={() => handleViewDetails(patient)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No patients found.</p>
              )}
            </>
          )}

          {userRole === 'staff' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Doctor List</h3>
              {doctorsList.length > 0 ? (
                <div className="bg-white shadow-md rounded p-4">
                  {doctorsList.map((doctor) => (
                    <div key={doctor._id} className="flex justify-between items-center mb-2">
                      <span>{doctor.username}</span>
                      <button
                        onClick={() => handleRemoveStaffId(doctor._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No doctors found.</p>
              )}
              <div className="mt-4">
                {patients.length === 0 ? (
                  <p className="text-gray-700">No patients found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patients.map((patient) => (
                      <div key={patient._id} className="bg-white shadow-md rounded p-4">
                        <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
                        <p className="text-gray-700 mb-2">Age: {patient.age}</p>
                        <p className="text-gray-700 mb-4">Gender: {patient.gender}</p>
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {showDetails && selectedPatient && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <button
                  onClick={handleCloseDetails}
                  className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                {(editMode && userRole === 'staff') ? (
                  <>
                    <h3 className="text-2xl font-bold mb-4">Edit Patient Details</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                      <input
                        type="text"
                        name="name"
                        value={patientForm.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="border border-gray-300 p-2 rounded mb-4 w-full"
                      />
                      <input
                        type="number"
                        name="age"
                        value={patientForm.age}
                        onChange={handleInputChange}
                        placeholder="Age"
                        className="border border-gray-300 p-2 rounded mb-4 w-full"
                      />
                      <input
                        type="text"
                        name="gender"
                        value={patientForm.gender}
                        onChange={handleInputChange}
                        placeholder="Gender"
                        className="border border-gray-300 p-2 rounded mb-4 w-full"
                      />
                      <input
                        type="text"
                        name="address"
                        value={patientForm.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="border border-gray-300 p-2 rounded mb-4 w-full"
                      />
                      <input
                        type="text"
                        name="contactNumber"
                        value={patientForm.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                        className="border border-gray-300 p-2 rounded mb-4 w-full"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Save Changes
                      </button>
                    </form>
                    <input
                      type="file"
                      onChange={(e) => setNewFile(e.target.files[0])}
                      className="mt-4 mb-4"
                    />
                    <button
                      onClick={handleAddFile}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add File
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-4">Patient Details</h3>
                    <p><strong>Name:</strong> {selectedPatient.name}</p>
                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Address:</strong> {selectedPatient.address}</p>
                    <p><strong>Contact Number:</strong> {selectedPatient.contactNumber}</p>
                    <h4 className="text-xl font-semibold mt-4">Health Records</h4>
                    {selectedPatient.healthRecords.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedPatient.healthRecords.map((record) => (
                          <li key={record.filename} className="mb-2">
                            <a href={`http://localhost:5000/api/patients/files/${record.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                              {record.filename}
                            </a>
                            {userRole === 'staff' && (
                              <button
                                onClick={() => handleDeleteFile(record.filename)}
                                className="bg-red-500 text-white px-2 py-1 rounded ml-4"
                              >
                                Delete
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No records found.</p>
                    )}
                    {userRole === 'staff' && (
                      <>
                        <button
                          onClick={handleEditPatient}
                          className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeletePatient}
                          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                        >
                          Delete Patient
                        </button>
                      </>
                    )}
                  </>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-700">Please log in to view this content.</p>
      )}
    </div>
  );
};

export default Dashboard;

