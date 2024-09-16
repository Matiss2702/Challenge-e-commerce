import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

