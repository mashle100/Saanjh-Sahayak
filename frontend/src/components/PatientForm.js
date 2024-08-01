
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const PatientForm = () => {
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     address: "",
//     contactNumber: "",
//     healthRecords: [],
//   });
//   const [error, setError] = useState("");
//   const [summary, setSummary] = useState(""); // State to store summary

//   const handleChange = (e) => {
//     if (e.target.name === "healthRecords") {
//       setPatient({ ...patient, healthRecords: e.target.files });
//     } else {
//       setPatient({ ...patient, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const token = localStorage.getItem('authToken'); // Ensure this is the correct key
  
//     if (!token) {
//       setError('No token found. Please log in again.');
//       return;
//     }
  
//     try {
//       const formData = new FormData();
//       formData.append('name', patient.name);
//       formData.append('age', patient.age);
//       formData.append('gender', patient.gender);
//       formData.append('address', patient.address);
//       formData.append('contactNumber', patient.contactNumber);
  
//       // Append multiple files
//       for (let i = 0; i < patient.healthRecords.length; i++) {
//         formData.append('healthRecords', patient.healthRecords[i]);
//       }
//       const token = localStorage.getItem('authToken');
// console.log("Token retrieved:", token); // Debug: Verify token is retrieved


//       await axios.post("http://localhost:5000/api/patients", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "x-auth-token": token, // Ensure this matches your backend expectations
//         },
//       });
  
//       alert("Patient added successfully");
//       navigate("/dashboard"); // Redirect to dashboard after successful submission
//     } catch (error) {
//       console.error("There was an error adding the patient!", error);
//       setError("Error adding patient");
//     }
//   };
  
  
//   const validateForm = () => {
//     return (
//       patient.name &&
//       patient.age &&
//       patient.gender &&
//       patient.address &&
//       patient.contactNumber
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         name="name"
//         value={patient.name}
//         onChange={handleChange}
//         placeholder="Name"
//         required
//       />
//       <input
//         type="number"
//         name="age"
//         value={patient.age}
//         onChange={handleChange}
//         placeholder="Age"
//         required
//       />
//       <select name="gender" value={patient.gender} onChange={handleChange} required>
//         <option value="">Select Gender</option>
//         <option value="male">Male</option>
//         <option value="female">Female</option>
//         <option value="other">Other</option>
//       </select>
//       <input
//         type="text"
//         name="address"
//         value={patient.address}
//         onChange={handleChange}
//         placeholder="Address"
//         required
//       />
//       <input
//         type="tel"
//         name="contactNumber"
//         value={patient.contactNumber}
//         onChange={handleChange}
//         placeholder="Contact Number"
//         required
//       />
//       <input
//         type="file"
//         name="healthRecords"
//         onChange={handleChange}
//         accept=".jpg,.jpeg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf"
//         multiple
//       />
//       <button type="submit" disabled={!validateForm()}>Add Patient</button>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };

// export default PatientForm;
import React, { useState } from "react";
import axios from "axios";
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
      setPatient(prevState => ({ ...prevState, healthRecords: e.target.files }));
    } else {
      setPatient(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token'); // Changed to 'authToken'
    console.log('Retrieved token:', token);
  
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', patient.name);
    formData.append('age', patient.age);
    formData.append('gender', patient.gender);
    formData.append('address', patient.address);
    formData.append('contactNumber', patient.contactNumber);
  
    for (let i = 0; i < patient.healthRecords.length; i++) {
      formData.append('healthRecords', patient.healthRecords[i]);
    }
  
    try {
      await axios.post("http://localhost:5000/api/patients", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });
      alert("Patient added successfully");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Retrieved refresh token:', refreshToken);
          const response = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
          localStorage.setItem('token', response.data.accessToken);
          
          await axios.post("http://localhost:5000/api/patients", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": response.data.accessToken,
            },
          });
          alert("Patient added successfully");
          navigate("/dashboard");
        } catch (refreshError) {
          console.error("Refresh Token Error:", refreshError);
          setError("Session expired, please log in again.");
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      } else {
        console.error("Error adding patient:", error);
        setError("Error adding patient");
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={patient.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="number"
        name="age"
        value={patient.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <select name="gender" value={patient.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input
        type="text"
        name="address"
        value={patient.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        type="tel"
        name="contactNumber"
        value={patient.contactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
        required
      />
      <input
        type="file"
        name="healthRecords"
        onChange={handleChange}
        accept=".jpg,.jpeg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf"
        multiple
      />
      <button type="submit" disabled={!validateForm()}>Add Patient</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default PatientForm;
