import axios from "axios";

const LOCAL_IP = "10.0.0.115";
const DEV_API_URL = `http://${LOCAL_IP}:8080`;
const PROD_API_URL = "https://traineasy-production.up.railway.app";

const baseURL = __DEV__ ? DEV_API_URL : PROD_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
