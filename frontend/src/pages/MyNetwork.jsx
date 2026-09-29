import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Users, Network, UserRound } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../app/networkSlice";
import ShowNetwork from "../components/ShowNetwork";

const MyNetwork = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.network.connections);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        setError("");

        const response = await axios.get(BASE_URL + "/user/network", {
          withCredentials: true,
        });

        dispatch(addConnections(response.data?.apiResult ?? []));
      } catch (error) {
        console.error("Error fetching network:", error);
        setError(
          error.response?.data?.message ||
            "Unable to load your network. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetwork();
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
                My Network
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
                {connections.length}
              </span>
              <span className="text-sm text-base-content/60">
                {connections.length === 1 ? "Connection" : "Connections"}
              </span>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-base-content/60">
              Loading your network...
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
        {!isLoading && !error && connections.length === 0 && (
          <div className="card glass mx-auto max-w-xl border border-base-300 bg-base-100 shadow-lg">
            <div className="card-body items-center gap-3 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-5 text-primary">
                <UserRound size={40} />
              </div>
              <h2 className="text-xl font-bold">Your network is empty</h2>
              <p className="max-w-sm text-sm leading-6 text-base-content/60">
                You haven't made any connections yet. Visit your feed to
                discover people and start building your network.
              </p>
            </div>
          </div>
        )}

        {/* Connections */}
        {!isLoading && !error && connections.length > 0 && (
          <div className="flex flex-col gap-5">
            {connections.map((connection) => (
              <ShowNetwork key={connection._id} connection={connection} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyNetwork;
