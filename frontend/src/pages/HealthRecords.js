// import React, { useContext, useEffect } from 'react';
// import './HealthRecords.css';
// import { HealthRecordContext } from '../context/HealthRecordContext';

// const HealthRecords = () => {
//   const { healthRecords, fetchHealthRecords } = useContext(HealthRecordContext);

//   useEffect(() => {
//     fetchHealthRecords();
//   }, [fetchHealthRecords]);

//   return (
//     <div className="health-records-page">
//       <h2>Health Records</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Resident Name</th>
//             <th>Age</th>
//             <th>Medical History</th>
//             <th>Current Medications</th>
//             <th>Last Checkup</th>
//           </tr>
//         </thead>
//         <tbody>
//           {healthRecords.map((record, index) => (
//             <tr key={index}>
//               <td>{record.name}</td>
//               <td>{record.age}</td>
//               <td>{record.medicalHistory}</td>
//               <td>{record.currentMedications}</td>
//               <td>{record.lastCheckup}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HealthRecords;
// src/pages/HealthRecords.js
// src/pages/HealthRecords.js

import React from 'react';
import { BrowserRouter as  Navigate } from 'react-router-dom';
const HealthRecords = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <div className="health-records-page">
      <h2>Health Records</h2>
      <p>Display health records here.</p>
    </div>
  );
};

export default HealthRecords;
