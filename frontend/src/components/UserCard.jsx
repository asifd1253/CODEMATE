import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFromFeed } from "../app/feedSlice";

const UserCard = ({ user, showActions = true }) => {
  const dispatch = useDispatch();

  const { firstName, lastName, photoUrl, about, age, gender, skills } = user;

  const handleChoice = async (status) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/request/send/${status}/${user._id}`,
        {},
        { withCredentials: true },
      );
      // console.log(response.data.apiResult);
      dispatch(removeFromFeed(user._id));
    } catch (error) {
      console.log(error);
    }
  };

  const isMoreInfo = (about?.length ?? 0) > 150 || (skills?.length ?? 0) > 10;
  return (
    <div
      className={`card glass mx-auto my-8 h-fit w-full bg-base-100 shadow-xl lg:card-side ${
        isMoreInfo ? "max-w-4xl" : "max-w-2xl"
      }`}
    >
      <figure className="w-full lg:w-2/5">
        <img
          src={photoUrl}
          alt={`${firstName}'s profile`}
          className="h-64 w-full object-cover lg:h-full"
        />
      </figure>

      <div className="card-body min-w-0 flex-1 !justify-start gap-3">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <p className="!flex-none text-sm text-base-content/70">
            {age && `${age} years old`}
            {age && gender && " · "}
            {gender}
          </p>
        )}

        {about && <p className="!flex-none break-words">{about}</p>}

        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[...new Set(skills)].map((skill) => (
              <span
                key={skill}
                className="badge badge-neutral badge-md py-2 pb-3"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="card-actions mt-4 justify-end">
            <button
              className="btn btn-outline btn-error flex-1"
              onClick={() => handleChoice("ignore")}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={() => handleChoice("interested")}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
