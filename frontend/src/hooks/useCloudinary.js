import axios from "axios";
import { CLOUDINARY_URL } from "../utils/constants";

const useCloudinary = async (e) => {
  try {
    const file = e.target.files[0];
    // console.log(file);

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "codemate");
    formData.append("cloud_name", "dd28t1tvk");

    const response = await axios.post(CLOUDINARY_URL, formData);
    // console.log(response?.data?.secure_url);
    return response?.data?.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
};

export default useCloudinary;
