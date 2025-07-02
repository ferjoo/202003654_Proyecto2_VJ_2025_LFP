import axios from 'axios';
import { AnalysisRequest, AnalysisResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'text/plain',
  },
});

export const analyzeCode = async (code: string): Promise<AnalysisResponse> => {
  try {
    const response = await api.post<AnalysisResponse>('/analyze', code);
    return response.data;
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
};

export default api; 