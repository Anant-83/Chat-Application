import axios from "axios";
const BACKEND_DOMAIN = "http://localhost:8000";

export const fetchInterests = async () => {
  const res = await axios(`${BACKEND_DOMAIN}/interests`);
  const data = res.data;
  return data;
};

export const createInterest = async (roomName) => {
  const res = await axios.post(`${BACKEND_DOMAIN}/createInterest`, {
    roomName,
  });
  const data = res.data;
  return data;
};
