import React from "react";
import { UserRound, CalendarDays, Users } from "lucide-react";

const ShowNetwork = ({ connection }) => {
  const {
    firstName,
    lastName,
    age,
    skills = [],
    gender,
    photoUrl,
    about,
  } = connection;

  const uniqueSkills = [...new Set(skills)];

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {/* Profile Image */}
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-base-200 sm:h-28 sm:w-32 md:h-28 md:w-32">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound size={48} className="text-base-content/30" />
          </div>
        )}
      </div>

      {/* User Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h2 className="break-words text-lg font-bold text-base-content">
          {firstName} {lastName}
        </h2>

        {/* Age and Gender */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/70">
          {age != null && age !== "" && (
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {age} years old
            </span>
          )}

          {gender && (
            <span className="flex items-center gap-1 capitalize">
              <UserRound size={13} />
              {gender}
            </span>
          )}
        </div>

        {/* About */}
        {about && (
          <p className="line-clamp-2 break-words text-sm leading-5 text-base-content/80">
            {about}
          </p>
        )}

        {/* Skills */}
        {uniqueSkills.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {uniqueSkills.map((skill) => (
              <span
                key={skill}
                className="badge badge-ghost badge-sm border border-base-300 px-2 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="flex shrink-0 items-center justify-start sm:items-start sm:self-start">
        <span className="badge badge-success badge-outline gap-1.5 rounded-full px-3 py-3 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-success" />
          Connected
        </span>
      </div>
    </div>
  );
};

export default ShowNetwork;
