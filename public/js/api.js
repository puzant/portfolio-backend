const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);