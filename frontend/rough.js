import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Users, Network, UserRound, Check, X } from "lucide-react";

import { BASE_URL } from "../utils/constants";
import {
  setRequests,
  setConnections,
  removeRequest,
} from "../app/networkSlice";

const ShowNetwork = () => {
  const dispatch = useDispatch();

  const requests = useSelector((store) => store.network.requests);
  const connections = useSelector((store) => store.network.connections);
  const curUser = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Fetch both requests and connections
  const fetchNetworkData = useCallback(async () => {
    try {
      setError("");

      const [requestResponse, connectionResponse] = await Promise.all([
        axios.get(`${BASE_URL}/user/requests/received`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        }),
      ]);

      dispatch(setRequests(requestResponse.data.apiResult ?? []));

      dispatch(setConnections(connectionResponse.data.apiResult ?? []));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch requests and connections.",
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);

  // Hide toast after 5 seconds
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Accept or reject a connection request
  const handleReview = async (request, status) => {
    try {
      setProcessingId(request._id);
      setToast(null);
      setError("");

      const response = await axios.post(
        `${BASE_URL}/user/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeRequest(request._id));

      setToast({
        type: "success",
        message: response.data.message || `Request ${status} successfully`,
      });

      // Refresh both sections after the review.
      await fetchNetworkData();
    } catch (err) {
      setToast({
        type: "error",
        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update the request.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Get the other user's details from a connection.
  const getConnectionUser = (connection) => {
    if (!connection) return null;

    // The API may return the user directly.
    if (connection.firstName) {
      return connection;
    }

    const fromUser = connection.fromUserId;
    const toUser = connection.toUserId;
    const currentUserId = curUser?._id?.toString();

    // Both users are populated.
    if (
      fromUser &&
      typeof fromUser === "object" &&
      toUser &&
      typeof toUser === "object"
    ) {
      return fromUser._id?.toString() === currentUserId ? toUser : fromUser;
    }

    // Only one side is populated.
    if (fromUser && typeof fromUser === "object") {
      return fromUser._id?.toString() === currentUserId ? null : fromUser;
    }

    if (toUser && typeof toUser === "object") {
      return toUser._id?.toString() === currentUserId ? null : toUser;
    }

    // Alternative response shape.
    return connection.user || connection.connectedUser || null;
  };

  // Reusable user card
  const UserCard = ({ user, children }) => {
    if (!user || typeof user !== "object") {
      return (
        <div className="alert alert-warning">User details are unavailable.</div>
      );
    }

    return (
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="avatar">
            <div className="w-28 rounded-xl bg-base-200 sm:w-36">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={`${user.firstName || "User"}'s profile`}
                />
              ) : (
                <div className="flex h-full min-h-28 items-center justify-center">
                  <UserRound size={48} className="text-base-content/40" />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              {user.age != null ? `${user.age} years` : ""}
              {user.age != null && user.gender ? " • " : ""}
              {user.gender || ""}
            </p>

            {user.about && (
              <p className="mt-2 text-sm text-base-content/80">{user.about}</p>
            )}

            {Array.isArray(user.skills) && user.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-primary badge-outline"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-8">
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

      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <Network size={32} />
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">My Network</h1>
          </div>

          <p className="mt-3 text-base-content/60">
            Manage your connection requests and professional network.
          </p>
        </div>

        {/* Total counts */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-4 text-primary">
                <Users size={28} />
              </div>

              <div>
                <p className="text-sm text-base-content/60">New Requests</p>
                <p className="text-3xl font-bold">{requests.length}</p>
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center gap-4">
              <div className="rounded-xl bg-success/10 p-4 text-success">
                <Network size={28} />
              </div>

              <div>
                <p className="text-sm text-base-content/60">My Connections</p>
                <p className="text-3xl font-bold">{connections.length}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button className="btn btn-sm" onClick={fetchNetworkData}>
              Retry
            </button>
          </div>
        )}

        {/* New Requests */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">New Requests</h2>
            <span className="badge badge-primary badge-lg">
              {requests.length}
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center">
              <Users size={40} className="mx-auto mb-3 text-base-content/30" />
              <p className="font-semibold">No new requests</p>
              <p className="mt-1 text-sm text-base-content/60">
                You don't have any pending connection requests.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {requests.map((request) => (
                <UserCard key={request._id} user={request.fromUserId}>
                  <div className="flex shrink-0 gap-3">
                    <button
                      className="btn btn-success"
                      disabled={processingId !== null}
                      onClick={() => handleReview(request, "accepted")}
                    >
                      {processingId === request._id ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <Check size={20} />
                      )}
                      Accept
                    </button>

                    <button
                      className="btn btn-outline btn-error"
                      disabled={processingId !== null}
                      onClick={() => handleReview(request, "rejected")}
                    >
                      <X size={20} />
                      Reject
                    </button>
                  </div>
                </UserCard>
              ))}
            </div>
          )}
        </section>

        {/* My Connections */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Connections</h2>
            <span className="badge badge-success badge-lg">
              {connections.length}
            </span>
          </div>

          {connections.length === 0 ? (
            <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center">
              <Network
                size={40}
                className="mx-auto mb-3 text-base-content/30"
              />
              <p className="font-semibold">No connections yet</p>
              <p className="mt-1 text-sm text-base-content/60">
                Your accepted connections will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {connections.map((connection) => (
                <UserCard
                  key={connection._id || connection._id}
                  user={getConnectionUser(connection)}
                >
                  <span className="badge badge-success badge-lg shrink-0">
                    Connected
                  </span>
                </UserCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ShowNetwork;
