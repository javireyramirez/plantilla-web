import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL + '/api',
  timeout: 10000, //10s
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
