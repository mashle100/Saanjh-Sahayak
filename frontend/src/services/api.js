import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust the URL as needed

export const predictDiseaseRisk = async (healthData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, healthData);
    return response.data;
  } catch (error) {
    console.error('Error predicting disease risk:', error);
    throw error;
  }
};
