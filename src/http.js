import axios from "axios";

const client = axios.create({
  baseURL: process.env.PREACT_APP_API_URL,
  timeout: 2000
});

export default client;
