// // // api.js

// // import axios from 'axios';

// // const API_BASE_URL = 'http://localhost:5000'; // Adjust the URL as needed

// // // Function to submit patient data
// // export const submitFormData = async (data) => {
// //   try {
// //     const response = await axios.post(`${API_BASE_URL}/api/patients`, data, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data; // Assuming backend sends back a response
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     throw error;
// //   }
// // };

// // // Function to predict disease risk
// // export const predictDiseaseRisk = async (healthData) => {
// //   try {
// //     const response = await axios.post(`${API_BASE_URL}/predict`, healthData);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error predicting disease risk:', error);
// //     throw error;
// //   }
// // };

// // export default axios; // Export axios instance for general use if needed
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000'; // Adjust the URL as needed

// // Function to submit patient data
// export const submitFormData = async (data) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/patients`, data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data; // Assuming backend sends back a response
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     throw error;
//   }
// };

// // Function to fetch patient data
// export const fetchPatients = async (token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/patients`, {
//       headers: {
//         'x-auth-token': token,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//     throw error;
//   }
// };

// export default axios; // Export axios instance for general use if needed
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
