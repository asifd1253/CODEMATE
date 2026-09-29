import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Users, Network, UserRound } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import ShowRequest from "../components/ShowRequest";
import { addNewRequests } from "../app/requestedSlice";

const MyRequests = () => {
  const dispatch = useDispatch();
  const new_requests = useSelector((state) => state.requested.new_requests);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setError("");

        const response = await axios.get(`${BASE_URL}/user/requests/received`, {
          withCredentials: true,
        });


        dispatch(addNewRequests(response.data?.apiResult ?? []));
      } catch (error) {
        console.error("Error fetching requests:", error);

        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Unable to load your requests. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);


  return (
    <main className="min-h-screen bg-base-200 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Network size={24} />
              </div>

              <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                New Requests
              </h1>
            </div>

            <p className="text-sm text-base-content/60 sm:text-base">
              Connect with people and grow your professional network.
            </p>
          </div>

          {!isLoading && !error && (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
              <Users size={20} className="text-primary" />

              <span className="font-semibold text-base-content">
                {new_requests.length}
              </span>

              <span className="text-sm text-base-content/60">
                {new_requests.length === 1 ? "Request" : "Requests"}
              </span>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-base-content/60">
              Loading your requests...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="alert alert-error mx-auto max-w-2xl">
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && new_requests.length === 0 && (
          <div className="card glass mx-auto max-w-xl border border-base-300 bg-base-100 shadow-lg">
            <div className="card-body items-center gap-3 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-5 text-primary">
                <UserRound size={40} />
              </div>

              <h2 className="text-xl font-bold">No Requests Found</h2>

              <p className="max-w-sm text-sm leading-6 text-base-content/60">
                You don't have any new connection requests yet. Visit your feed
                to discover people and start building your network.
              </p>
            </div>
          </div>
        )}

        {/* Requests */}
        {!isLoading && !error && new_requests.length > 0 && (
          <div className="flex flex-col gap-5">
            {new_requests.map((request) => (
              <ShowRequest key={request._id} request={request} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyRequests;
