import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.31.134.104:3002';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const API_BASE_URL = BASE_URL;