import React, { useState } from 'react';

const HealthRecordForm = ({ addHealthRecord }) => {
  const [record, setRecord] = useState({ name: '', age: '', healthData: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealthRecord(record);
    setRecord({ name: '', age: '', healthData: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={record.name} onChange={handleChange} required />
      </label>
      <label>
        Age:
        <input type="number" name="age" value={record.age} onChange={handleChange} required />
      </label>
      <label>
        Health Data:
        <textarea name="healthData" value={record.healthData} onChange={handleChange} required />
      </label>
      <button type="submit">Add Health Record</button>
    </form>
  );
}

export default HealthRecordForm;
