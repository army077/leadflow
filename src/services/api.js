import axios from 'axios';

const BASE_URL = 'https://desarrollotecnologicoar.com/api23';

export const fetchLeads = async () => {
  const { data } = await axios.get(`${BASE_URL}/leads`);
  return data.data ?? [];
};

export const fetchVendors = async () => {
  const { data } = await axios.get(`${BASE_URL}/vendors`);
  return data.data ?? [];
};
