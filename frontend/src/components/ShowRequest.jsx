import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UserRound, CalendarDays, Check, X } from "lucide-react";
import axios from "axios";

import { BASE_URL } from "../utils/constants";
import {removeRequest} from "../app/requestedSlice";

const ShowRequest = ({ request }) => {
  const dispatch = useDispatch();

  const requestedUser = request?.fromUserId;

  const {
    firstName,
    lastName,
    age,
    skills = [],
    gender,
    photoUrl,
    about,
  } = requestedUser || {};

  const uniqueSkills = [...new Set(skills)];

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Hide the message after 5 seconds
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Accept or reject the connection request
  const handleReview = async (status) => {
    try {
      setLoading(true);
      setToast(null);

      const response = await axios.post(
        `${BASE_URL}/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true },
      );

      // Remove the reviewed request from Redux
      dispatch(removeRequest(request._id));

      setToast({
        type: "success",
        message: response.data?.message || `Request ${status} successfully`,
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {/* Success and error message */}
      {toast && (
        <div className="toast toast-end toast-top z-50 mt-16">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Profile Image */}
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-base-200 sm:h-28 sm:w-32 md:h-28 md:w-32">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${firstName || ""} ${lastName || ""}`}
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

      {/* Accept and Reject Buttons */}
      <div className="flex shrink-0 items-center gap-2 sm:self-start">
        <button
          className="btn btn-success btn-sm sm:btn-md"
          disabled={loading}
          onClick={() => handleReview("accepted")}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Check size={18} />
          )}
          Accept
        </button>

        <button
          className="btn btn-outline btn-error btn-sm sm:btn-md"
          disabled={loading}
          onClick={() => handleReview("rejected")}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <X size={18} />
          )}
          Reject
        </button>
      </div>
    </div>
  );
};

export default ShowRequest;
