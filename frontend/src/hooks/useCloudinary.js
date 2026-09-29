import axios from "axios";
import { CLOUDINARY_URL } from "../utils/constants";

const useCloudinary = async (file) => {
  try {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "codemate");
    formData.append("cloud_name", "dd28t1tvk");

    const response = await axios.post(CLOUDINARY_URL, formData);

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default useCloudinary;
