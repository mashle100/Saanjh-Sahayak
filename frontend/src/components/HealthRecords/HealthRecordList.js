import React from 'react';

const HealthRecordList = ({ healthRecords }) => {
  return (
    <div className="health-record-list">
      <h3>Existing Health Records</h3>
      <ul>
        {healthRecords.map((record, index) => (
          <li key={index}>
            <h4>{record.name}</h4>
            <p>Age: {record.age}</p>
            <p>Health Data: {record.healthData}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HealthRecordList;
