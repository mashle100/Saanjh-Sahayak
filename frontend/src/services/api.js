
import axios from './axios'; // Import the configured Axios instance

// Function to submit patient data
export const submitFormData = async (data) => {
  try {
    const response = await axios.post('/patients', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Assuming backend sends back a response
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

// Function to fetch patient data
export const fetchPatients = async () => {
  try {
    const response = await axios.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};
