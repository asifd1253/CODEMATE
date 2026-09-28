import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, about, age, gender, skills } = user;

  return (
    <div className="card glass w-full shadow-xl">
      <figure>
        <img
          src={photoUrl}
          alt={`${firstName}'s profile`}
          className="h-72 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        <p>
          {age} years old · {gender}
        </p>

        <p>{about}</p>

        <div className="flex flex-wrap gap-2">
          {skills?.map((skill) => (
            <span key={skill} className="badge badge-neutral">
              {skill}
            </span>
          ))}
        </div>
        <div className="card-actions mt-4 justify-center">
          <button className="btn btn-outline btn-error flex-1">Ignore</button>

          <button
            className="btn glass flex-1 border border-primary/40 bg-primary/20 text-primary-content shadow-md backdrop-blur-md hover:bg-primary/40"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
