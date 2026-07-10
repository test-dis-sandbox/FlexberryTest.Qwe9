import axios, { AxiosError } from 'axios';

import { getPublicEnv } from '@/utils/envUtils';

const env = getPublicEnv();

const instance = axios.create({
  baseURL: env.BACKEND_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
        error.message = JSON.stringify(response.data);
      } else {
        switch (response.status) {
          case 400:
            error.message = 'Bad Request';
            break;
          case 500:
            error.message = 'Internal Server Error';
            break;
          default:
            error.message = 'An error occurred';
        }
      }
    }
    throw error;
  }
);

export default instance;
