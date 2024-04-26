import axios from "axios";
const baseUrl = "/api/users";

export const signup = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
