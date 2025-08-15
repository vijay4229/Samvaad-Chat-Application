// src/apis/ai.js
import axios from 'axios';

const API = (token) =>
    axios.create({
        baseURL: process.env.REACT_APP_SERVER_URL,
        headers: { Authorization: token },
    });

export const fetchAiResponse = async (body) => {
    try {
        const token = localStorage.getItem('userToken');
        const { data } = await API(token).post('/api/ai/chat', body);
        return data;
    } catch (error) {
        console.error('Error fetching AI response:', error);
    }
};

export const getIntroLine = async (body) => {
    try {
        const token = localStorage.getItem('userToken');
        const { data } = await API(token).post('/api/ai/generate-intro', body);
        return data;
    } catch (error)
    {
        console.error('Error fetching AI intro line:', error);
    }
};