import React from "react";

const HealthRecordList = ({ healthRecords }) => {
  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Existing Health Records</h3>
      <ul className="space-y-4">
        {healthRecords.map((record, index) => (
          <li
            key={index}
            className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-semibold">{record.name}</h4>
            <p>Age: {record.age}</p>
            <p>Health Data: {record.healthData}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecordList;
