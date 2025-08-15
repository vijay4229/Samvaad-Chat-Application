import axios from 'axios';
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });
export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/message/', body);
    return data;
  } catch (error) {
    console.log('error in sendmessage api' + error);
  }
};
export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.log('error in fetch Message API ' + error);
  }
};
export const uploadFile = async (file) => {
  const token = localStorage.getItem('userToken');
  const formData = new FormData();
  formData.append('file', file);

  try {
    // This now uses API(token) to ensure it calls the backend at localhost:5000
    const { data } = await API(token).post('/api/message/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.log('Error uploading file:', error);
  }
};

// In apis/messages.js

// Add this new function
// In apis/messages.js

export const downloadFile = async (url, filename) => {
  try {
    const token = localStorage.getItem('userToken');
    // The responseType 'blob' is crucial for receiving file data
    const response = await API(token).get(`/api/message/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};