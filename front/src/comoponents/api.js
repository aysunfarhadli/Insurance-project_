import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust to your backend URL
});

export default api;
