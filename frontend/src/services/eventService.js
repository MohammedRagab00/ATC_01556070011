import axios from "axios";

const API_URL =
  "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/event";

const eventService = {
  getEvents: async (page = 0, size = 6) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.get(`${API_URL}?page=${page}&size=${size}`, { headers });
  },
  getEvent: async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.get(`${API_URL}/${id}`, { headers });
  },
  bookEvent: async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return axios.post(
      `${API_URL}/book/${eventId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
};

export default eventService;
