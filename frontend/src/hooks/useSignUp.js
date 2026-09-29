import axios from "axios";
import { BASE_URL } from "../utils/constants";

const useSignUp = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData, {
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
};

export default useSignUp;
