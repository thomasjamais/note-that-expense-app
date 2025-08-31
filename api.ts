import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import axios from 'axios';

type LogoutHandler = () => void;
let onLogout: LogoutHandler | null = null;

export function registerLogoutHandler(fn: LogoutHandler) {
  onLogout = fn;
}

const api = axios.create({
  baseURL: 'http://15.236.205.31:3000/', // 'http://192.168.1.194:3000/',
  // baseURL: 'http://192.168.0.107:3000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      onLogout?.();
    }
    return Promise.reject(err);
  },
);

api.interceptors.request.use(async (config) => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    const err: any = new Error('OFFLINE');
    err.code = 'OFFLINE';
    throw err;
  }
  return config;
});

export default api;
