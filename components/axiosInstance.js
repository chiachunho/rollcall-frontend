import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const APIbaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL: APIbaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const session = await getSession();

    // handle network error first
    if (error.response) {
      if (error.message === 'Network Error') {
        if (typeof window === 'undefined') {
          throw 'Network Error'; //Throw custom error here
        } else {
          if (window.location.pathname !== '/networkError/') {
            window.location.href = `/networkError/?next=${router.pathname}`;
          }
        }
        return Promise.reject(error);
      }

      // Prevent infinite loops
      if (error.response.status === 401 && originalRequest.url === 'auth/token/refresh/') {
        if (typeof window === 'undefined') {
          throw 'Occur error'; //Throw custom error here
        } else {
          window.location.href = `/api/auth/signin/?next=${router.pathname}`;
        }

        return Promise.reject(error);
      }

      if (error.response.data.code === 'token_not_valid' && error.response.status === 401) {
        const refreshToken = session ? session.refreshToken : null;

        if (refreshToken) {
          const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

          // exp date in token is expressed in seconds, while now() returns milliseconds:
          const now = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp > now) {
            return axiosInstance
              .post('/auth/token/refresh/', { refresh: refreshToken })
              .then((response) => {
                axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            console.error('Refresh token is expired', tokenParts.exp, now);
            signOut({
              redirect: true,
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/auth/signin`,
            });
          }
        } else {
          console.error('Refresh token not available.');

          if (typeof window !== 'undefined') {
            // Client-side-only code
            signOut({
              redirect: true,
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/auth/signin`,
            });
          } else {
            throw 'Refresh token not available.'; //Throw custom error here
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
