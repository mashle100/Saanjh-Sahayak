import React, { createContext, useState, useCallback } from 'react';

export const HealthRecordContext = createContext();

export const HealthRecordProvider = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState([]);

  const fetchHealthRecords = useCallback(() => {
    // This is a mock function. Replace with actual API call.
    const mockData = [
      { name: 'John Doe', age: 75, medicalHistory: 'Hypertension, Diabetes', currentMedications: 'Metformin, Lisinopril', lastCheckup: '2024-06-01' },
      { name: 'Jane Smith', age: 80, medicalHistory: 'Arthritis', currentMedications: 'Ibuprofen', lastCheckup: '2024-05-20' },
      // Add more mock data as needed
    ];
    setHealthRecords(mockData);
  }, []);

  return (
    <HealthRecordContext.Provider value={{ healthRecords, fetchHealthRecords }}>
      {children}
    </HealthRecordContext.Provider>
  );
};
