import axios from "axios";

const PROD_API_URL = "https://traineasy-production.up.railway.app";
const LOCAL_API_URL = "http://192.168.15.5:8080";

const baseURL = PROD_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
