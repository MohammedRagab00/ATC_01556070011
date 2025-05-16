import axios from "axios";

const API_URL =
  "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/auth";

const authService = {
  login: (credentials) => axios.post(`${API_URL}/authenticate`, credentials),
  register: (userData) => axios.post(`${API_URL}/register`, userData),
};

export default authService;
