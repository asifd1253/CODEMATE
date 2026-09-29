import React from "react";
import UserCard from "../components/UserCard";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  // console.log(user);

  return (
    <>
      {user && (
      <div>
        <UserCard user={user} showActions={false}/>
      </div>
      )}
    </>
  );
};

export default Profile;
