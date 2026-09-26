import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="navbar sticky top-0 z-50 border-b border-base-content/10 bg-base-100/95 px-2 shadow-sm backdrop-blur">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost px-2 text-2xl font-bold tracking-wide text-primary hover:bg-base-200"
        >
          CODEMATE
        </Link>
      </div>

      {/* Profile Dropdown */}
      <div className="flex-none px-2">
        <div className="dropdown dropdown-end ">
          <button
            tabIndex={0}
            className="avatar btn btn-circle btn-ghost online "
            aria-label="Open profile menu"
          >
            <div className="w-10 rounded-full ring-2 ring-base-content/70 ring-offset-2 ring-offset-base-100">
              <img
                src="https://avatars.githubusercontent.com/u/140490107?v=4&size=64"
                alt="Profile"
              />
            </div>
          </button>

          <ul
            tabIndex={0}
            className="menu dropdown-content z-50 mt-3 w-52 rounded-box border border-base-content/10 bg-base-100 p-2 text-base-content shadow-xl"
          >
            <li>
              <Link
                to="/profile"
                className="hover:bg-base-content/10 hover:text-base-content"
              >
                Profile
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="hover:bg-base-content/10 hover:text-base-content"
              >
                Settings
              </Link>
            </li>

            <li>
              <Link
                to="/logout"
                className="hover:bg-base-content/10 hover:text-base-content"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
