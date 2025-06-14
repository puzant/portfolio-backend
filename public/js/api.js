const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);