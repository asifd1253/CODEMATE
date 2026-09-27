import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../app/userSlice";

const Navbar = () => {
  const curUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true },
      );
      // console.log(res.data);

      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-navbar navbar sticky top-0 z-50 border-b border-base-300 px-4 shadow-sm backdrop-blur-md">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="flex items-center">
          <img
            src="/logo3.png"
            alt="CODEMATE Logo"
            className="h-12 w-auto object-contain active:scale-95"
          />
        </Link>
      </div>
      {/* Profile Dropdown */}
      <div className="flex-none px-2 active:scale-95">
        {curUser && (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="flex cursor-pointer items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-base-200"
              aria-label="Open profile menu"
            >
              <span className="text-sm font-medium text-base-content">
                Welcome, {curUser.firstName || "User"}
              </span>

              <div className="avatar online">
                <div className="w-10 rounded-full ring-2 ring-neutral ring-offset-2 ring-offset-base-100">
                  <img
                    src={curUser.photoUrl || "/default-avatar.png"}
                    alt={`${curUser.firstName || "User"}'s profile`}
                  />
                </div>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-xl"
            >
              <li>
                <Link
                  to="/profile"
                  className="rounded-lg transition-colors hover:bg-base-200"
                >
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/settings"
                  className="rounded-lg transition-colors hover:bg-base-200"
                >
                  Settings
                </Link>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg text-error transition-colors hover:bg-error/10 hover:text-error"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
