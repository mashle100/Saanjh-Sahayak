
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [patientForm, setPatientForm] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     address: '',
//     contactNumber: ''
//   });
//   const [newFile, setNewFile] = useState(null);
//   const [error, setError] = useState(null);
//   const [otpValue, setOtpValue] = useState('');
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [verifiedStaffList, setVerifiedStaffList] = useState([]);
// const [selectedStaffId, setSelectedStaffId] = useState('');
// const [doctorsList, setDoctorsList] = useState([]);
  
//   // Fetch patients for staff (authenticated user)
// const fetchPatients = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await axios.get('http://localhost:5000/api/patients', {
//       headers: { 'x-auth-token': token }
//     });
//     console.log('Fetched patients:', response.data);
//     setPatients(response.data);
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//   }
// };

// // Fetch patients for staff
// const fetchPatientsForStaff = async (staffId) => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await axios.get('http://localhost:5000/api/patients/patients', {
//       headers: { 'x-auth-token': token },
//       params: { user_id: staffId }
//     });
//     setPatients(response.data);
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//   }
// };
// const fetchDoctorsList = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await axios.get(`http://localhost:5000/api/patients/verified`,{
//       headers: { 'x-auth-token': token }
//     });
//     setDoctorsList(response.data);
//   } catch (error) {
//     console.error('Error fetching doctors list:', error);
//   }
// };

// const handleRemoveStaffId = async (doctorId) => {
//   try {
//     const token = localStorage.getItem('token');
//     await axios.post('http://localhost:5000/api/patients/remove-staff', { staffId: userId }, {
//       headers: { 'x-auth-token': token }
//     });
//     // Update the doctors list after removal
//     fetchDoctorsList();
//   } catch (error) {
//     console.error('Error removing staff ID:', error);
//   }
// };

//   const handleGenerateOtp = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Current userId before OTP generation:', userId); // Debugging
      
//       const response = await axios.post('http://localhost:5000/api/patients/generate-otp', { userId }, {
//         headers: { 'x-auth-token': token }
//       });
  
//       console.log('API response for OTP generation:', response.data); // Debugging
//       setGeneratedOtp(response.data.otp);
      
//       // Use the userId from local state or storage if needed for further processes
//       // If userId is not included in response, make sure it's set correctly from local state
//     } catch (error) {
//       console.error('Error generating OTP:', error);
//       setError('Failed to generate OTP');
//     }
//   };
  
  
  
  

//   const handleVerifyOtp = async () => {
//     try {
//       const staffUserId = prompt("Enter staff user ID for verification:");
//       if (!staffUserId) {
//         setOtpError('Staff user ID is required for verification.');
//         return;
//       }
  
//       const token = localStorage.getItem('token'); // Make sure token is being fetched
//       const response = await axios.post('http://localhost:5000/api/patients/verify-otp', {
//         otp: otpValue,
//         userId: staffUserId
//       }, {
//         headers: { 'x-auth-token': token } // Ensure token is included in headers
//       });
  
//       console.log('OTP verification successful:', response.data);
//       setOtpError('');
//       fetchVerifiedStaffList(); // Fetch the list of verified staff
//     } catch (error) {
//       console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
//       setOtpError('Invalid OTP or Staff User ID. Please try again.');
//     }
//   };
  
//   // Fetch verified staff list
//   const fetchVerifiedStaffList = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get('http://localhost:5000/api/patients/verified-staff', {
//         headers: { 'x-auth-token': token }
//       });
//       setVerifiedStaffList(response.data);
//     } catch (error) {
//       console.error('Error fetching verified staff:', error);
//     }
//   };
  
//   useEffect(() => {
//     const initialize = async () => {
//       const token = localStorage.getItem('token');
//       const role = localStorage.getItem('role');
//       const storedUserId = localStorage.getItem('userId');
    
//       if (token) {
//         setIsAuthenticated(true);
//         setUsername(localStorage.getItem('username'));
//         setUserRole(role);
//         setUserId(storedUserId);
    
//         if (role === 'doctor') {
//           await fetchVerifiedStaffList();
//         } else {
//           await fetchPatients();
//           await fetchDoctorsList(); // Fetch doctors list for staff
//         }
//       } else {
//         setIsAuthenticated(false);
//       }
//     };
    
//     initialize();
//   }, []);
  
//   const handleViewPatients = (staffId) => {
//     setSelectedStaffId(staffId);
//     fetchPatientsForStaff(staffId);
//   };
//   const handleViewDetails = (patient) => {
//     setSelectedPatient(patient);
//     setPatientForm({
//       name: patient.name,
//       age: patient.age,
//       gender: patient.gender,
//       address: patient.address,
//       contactNumber: patient.contactNumber
//     });
//     setShowDetails(true);
//     setEditMode(false);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//     setEditMode(false);
//   };

//   const handleEditPatient = () => {
//     setEditMode(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPatientForm({
//       ...patientForm,
//       [name]: value
//     });
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`http://localhost:5000/api/patients/${selectedPatient._id}`, patientForm, {
//         headers: {
//           "x-auth-token": token
//         }
//       });
//       setSelectedPatient(response.data);
//       setEditMode(false);
//     } catch (error) {
//       console.error('Error updating patient:', error);
//       setError('Failed to save changes');
//     }
//   };

//   const handleAddFile = async () => {
//     if (!newFile || !selectedPatient) return;

//     const formData = new FormData();
//     formData.append('file', newFile);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://localhost:5000/api/patients/${selectedPatient._id}/files`, formData, {
//         headers: {
//           'x-auth-token': token,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setNewFile(null);
//       await fetchPatients(); // Refresh patient list
//     } catch (err) {
//       console.error('Error adding file:', err);
//       setError('Failed to add file');
//     }
//   };

//   const handleDeleteFile = async (filename) => {
//     if (!selectedPatient) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}/files/${filename}`, {
//         headers: {
//           'x-auth-token': token
//         }
//       });
//       await fetchPatients(); // Refresh patient list
//     } catch (err) {
//       console.error('Error deleting file:', err);
//       setError('Failed to delete file');
//     }
//   };

//   const handleDeletePatient = async () => {
//     if (!selectedPatient) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}`, {
//         headers: {
//           'x-auth-token': token
//         }
//       });
//       setPatients(patients.filter(p => p._id !== selectedPatient._id));
//       setSelectedPatient(null);
//       setShowDetails(false);
//     } catch (err) {
//       console.error('Error deleting patient:', err);
//       setError('Failed to delete patient');
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <h2>Dashboard</h2>
//       {isAuthenticated ? (
//         <>
//           <p>Welcome, {username}!</p>
//           <p>Role: {userRole}</p>
//           <p>User ID: {userId}</p>
//           {userRole === 'staff' && (
//             <>
//               <button onClick={handleGenerateOtp}>Generate OTP</button>
//               {generatedOtp && (
//   <p>
//     Generated OTP: {generatedOtp} <br />
//     User ID: {userId} {/* Show user ID */}
//   </p>
// )}
//               <Link to="/patientform">
//                 <button>Add Patient</button>
//               </Link>
//             </>
//           )}
          
//           {userRole === 'doctor' && (
//         <>
//           <input
//             type="text"
//             value={otpValue}
//             onChange={(e) => setOtpValue(e.target.value)}
//             placeholder="Enter OTP"
//           />
//           <button onClick={handleVerifyOtp}>Verify OTP</button>
//           {otpError && <p className="error">{otpError}</p>}

//           {verifiedStaffList.length > 0 && (
//             <>
//               <select
//                 onChange={(e) => { 
//                   setSelectedStaffId(e.target.value);
//                   fetchPatientsForStaff(e.target.value); // Fetch patients for the selected staff ID
//                 }}
//                 value={selectedStaffId}
//               >
//                 <option value="">Select Staff</option>
//                 {verifiedStaffList.map((staff) => (
//                   <option key={staff._id} value={staff._id}>
//                     {staff.username}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}

//           {patients.length > 0 ? (
//             <div className="patient-cards">
//               {patients.map((patient) => (
//                 <div key={patient._id} className="patient-card">
//                   <h3>{patient.name}</h3>
//                   <p>Age: {patient.age}</p>
//                   <p>Gender: {patient.gender}</p>
//                   <button onClick={() => handleViewDetails(patient)}>
//                     View Details
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No patients found.</p>
//           )}
//         </>
//       )}




//           {userRole !== 'doctor' && (
//             <div className="patient-cards">
//               {patients.length === 0 ? (
//                 <p>No patients found.</p>
//               ) : (
//                 patients.map((patient) => (
//                   <div key={patient._id} className="patient-card">
//                     <h3>{patient.name}</h3>
//                     <p>Age: {patient.age}</p>
//                     <p>Gender: {patient.gender}</p>
//                     <button onClick={() => handleViewDetails(patient)}>
//                       View Details
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {showDetails && selectedPatient && (
//             <div className="floating-box">
//               <button onClick={handleCloseDetails}>Close</button>
//               {editMode ? (
//                 <>
//                   <h3>Edit Patient Details</h3>
//                   <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
//                     <input
//                       type="text"
//                       name="name"
//                       value={patientForm.name}
//                       onChange={handleInputChange}
//                       placeholder="Name"
//                     />
//                     <input
//                       type="number"
//                       name="age"
//                       value={patientForm.age}
//                       onChange={handleInputChange}
//                       placeholder="Age"
//                     />
//                     <input
//                       type="text"
//                       name="gender"
//                       value={patientForm.gender}
//                       onChange={handleInputChange}
//                       placeholder="Gender"
//                     />
//                     <input
//                       type="text"
//                       name="address"
//                       value={patientForm.address}
//                       onChange={handleInputChange}
//                       placeholder="Address"
//                     />
//                     <input
//                       type="text"
//                       name="contactNumber"
//                       value={patientForm.contactNumber}
//                       onChange={handleInputChange}
//                       placeholder="Contact Number"
//                     />
//                     <button type="submit">Save Changes</button>
//                   </form>
//                   <input
//                     type="file"
//                     onChange={(e) => setNewFile(e.target.files[0])}
//                   />
//                   <button onClick={handleAddFile}>Add File</button>
//                 </>
//               ) : (
//                 <>
//                   <h3>Patient Details</h3>
//                   <p><strong>Name:</strong> {selectedPatient.name}</p>
//                   <p><strong>Age:</strong> {selectedPatient.age}</p>
//                   <p><strong>Gender:</strong> {selectedPatient.gender}</p>
//                   <p><strong>Address:</strong> {selectedPatient.address}</p>
//                   <p><strong>Contact Number:</strong> {selectedPatient.contactNumber}</p>
//                   <h4>Health Records</h4>
//                   {selectedPatient.healthRecords.length > 0 ? (
//                     <ul>
//                       {selectedPatient.healthRecords.map((record) => (
//                         <li key={record.filename}>
//                           <a href={`http://localhost:5000/api/patients/files/${record.filename}`} target="_blank" rel="noopener noreferrer">
//                             {record.filename}
//                           </a>
//                           <button onClick={() => handleDeleteFile(record.filename)}>Delete</button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No records found.</p>
//                   )}
//                   <button onClick={handleEditPatient}>Edit</button>
//                   <button onClick={handleDeletePatient}>Delete Patient</button>
//                 </>
//               )}
//               {error && <p className="error">{error}</p>}
//             </div>
//           )}
//         </>
//       ) : (
//         <p>Please log in to view this content.</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

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
  
  // Fetch patients for staff (authenticated user)
const fetchPatients = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:5000/api/patients', {
      headers: { 'x-auth-token': token }
    });
    console.log('Fetched patients:', response.data);
    setPatients(response.data);
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

// Fetch patients for staff
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
  // Fetch doctors list
  const fetchDoctorsList = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/patients/verified', {
        headers: { 'x-auth-token': token }
      });
      console.log('Doctors list response:', response.data); // Print the fetched doctors list
      setDoctorsList(response.data);
    } catch (error) {
      console.error('Error fetching doctors list:', error);
    }
  };
  
// Remove staff ID from doctor
const handleRemoveStaffId = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/patients/remove-staff', { staffId: userId }, {
      headers: { 'x-auth-token': token }
    });
    // Update the doctors list after removal
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
      
      // Use the userId from local state or storage if needed for further processes
      // If userId is not included in response, make sure it's set correctly from local state
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
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {isAuthenticated ? (
        <>
          <p>Welcome, {username}!</p>
          <p>Role: {userRole}</p>
          <p>User ID: {userId}</p>
          {userRole === 'staff' && (
            <>
              <button onClick={handleGenerateOtp}>Generate OTP</button>
              {generatedOtp && (
  <p>
    Generated OTP: {generatedOtp} <br />
    User ID: {userId} {/* Show user ID */}
  </p>
)}
              <Link to="/patientform">
                <button>Add Patient</button>
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
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          {otpError && <p className="error">{otpError}</p>}

          {verifiedStaffList.length > 0 && (
            <>
              <select
                onChange={(e) => { 
                  setSelectedStaffId(e.target.value);
                  fetchPatientsForStaff(e.target.value); // Fetch patients for the selected staff ID
                }}
                value={selectedStaffId}
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
            <div className="patient-cards">
              {patients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <h3>{patient.name}</h3>
                  <p>Age: {patient.age}</p>
                  <p>Gender: {patient.gender}</p>
                  <button onClick={() => handleViewDetails(patient)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No patients found.</p>
          )}
        </>
      )}




          {userRole === 'staff' && (
            <>
              <h3>Doctor List</h3>
              {doctorsList.length > 0 ? (
                <div className="doctor-list">
                  {doctorsList.map((doctor) => (
                    <div key={doctor._id} className="doctor-item">
                      <span>{doctor.username}</span>
                      <button onClick={() => handleRemoveStaffId(doctor._id)}>Remove</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No doctors found.</p>
              )}
              <div className="patient-cards">
                {patients.length === 0 ? (
                  <p>No patients found.</p>
                ) : (
                  patients.map((patient) => (
                    <div key={patient._id} className="patient-card">
                      <h3>{patient.name}</h3>
                      <p>Age: {patient.age}</p>
                      <p>Gender: {patient.gender}</p>
                      <button onClick={() => handleViewDetails(patient)}>
                        View Details
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          {showDetails && selectedPatient && (
            <div className="floating-box">
              <button onClick={handleCloseDetails}>Close</button>
              {(editMode && userRole==='staff')? (
                <>
                  <h3>Edit Patient Details</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                    <input
                      type="text"
                      name="name"
                      value={patientForm.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                    <input
                      type="number"
                      name="age"
                      value={patientForm.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                    />
                    <input
                      type="text"
                      name="gender"
                      value={patientForm.gender}
                      onChange={handleInputChange}
                      placeholder="Gender"
                    />
                    <input
                      type="text"
                      name="address"
                      value={patientForm.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      name="contactNumber"
                      value={patientForm.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                    />
                    <button type="submit">Save Changes</button>
                  </form>
                  <input
                    type="file"
                    onChange={(e) => setNewFile(e.target.files[0])}
                  />
                  <button onClick={handleAddFile}>Add File</button>
                </>
              ) : (
                <>
                  <h3>Patient Details</h3>
                  <p><strong>Name:</strong> {selectedPatient.name}</p>
                  <p><strong>Age:</strong> {selectedPatient.age}</p>
                  <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                  <p><strong>Contact Number:</strong> {selectedPatient.contactNumber}</p>
                  <h4>Health Records</h4>
                  {selectedPatient.healthRecords.length > 0 ? (
                    <ul>
                      {selectedPatient.healthRecords.map((record) => (
                        <li key={record.filename}>
                          <a href={`http://localhost:5000/api/patients/files/${record.filename}`} target="_blank" rel="noopener noreferrer">
                            {record.filename}
                          </a>
                          {userRole === 'staff' && (
        <>
          <button onClick={() => handleDeleteFile(record.filename)}>Delete</button>
        </>
      )}
                          
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No records found.</p>
                  )}
                  {userRole === 'staff' && (
        <>
          <button onClick={handleEditPatient}>Edit</button>
          <button onClick={handleDeletePatient}>Delete Patient</button>
        </>
      )}
                </>
              )}
              {error && <p className="error">{error}</p>}
            </div>
          )}
        </>
      ) : (
        <p>Please log in to view this content.</p>
      )}
    </div>
  );
};

export default Dashboard;