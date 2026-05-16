import axios from "axios";

const PROD_API_URL = "https://traineasy-production.up.railway.app";

// Em dev local, usa o backend hospedado no Railway.
const baseURL = PROD_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
