import axios from "axios";

const API_URL = "http://localhost:3003/api/template/items";

export const getItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addItem = async (item: { name: string }) => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const deleteItem = async (itemName: string) => {
  const response = await axios.delete(`${API_URL}/${itemName}`);
  return response.data;
};
