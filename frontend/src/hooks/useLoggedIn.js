import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../app/userSlice";
import { BASE_URL } from "../utils/constants";

const useLoggedIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });

        dispatch(addUser(res.data));
        navigate("/feed", { replace: true });
      } catch (error) {
        console.log("User is not logged in");
      }
    };

    checkLogin();
  }, [dispatch, navigate]);
};

export default useLoggedIn;
