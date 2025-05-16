import axios from "axios";

const API_URL =
  "https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/event";

const eventService = {
  getEvents: () => axios.get(`${API_URL}`),
  getEvent: (id) => axios.get(`${API_URL}/${id}`),
};

export default eventService;
