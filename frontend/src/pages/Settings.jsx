import React from "react";
import { Link } from "react-router";

const Settings = () => {
  return (
    <div>
      <Link to="/reset-password" className="btn btn-warning m-10">
        Reset Password
      </Link>
    </div>
  );
};

export default Settings;
