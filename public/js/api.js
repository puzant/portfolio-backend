const api = axios.create({
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);