import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../app/userSlice";
import axios from "axios";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error.response?.data?.message);

      if (error.response?.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUserProfile();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
