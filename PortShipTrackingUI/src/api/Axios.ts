import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5026/api", // ASP.NET API endpoint'inin base URL’i
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
