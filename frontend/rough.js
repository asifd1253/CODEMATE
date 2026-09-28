import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.patch(
        `${BASE_URL}/profile/reset-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true },
      );

      setSuccess("Password reset successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-base-100 px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
        <div className="card-body gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-success/10 p-4 text-success">
              <LockKeyhole size={32} />
            </div>
            <h2 className="card-title text-2xl font-bold">Reset Password</h2>
            <p className="text-center text-sm opacity-70">
              Enter your current password and choose a new one.
            </p>
          </div>

          <div className="divider my-0" />

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {/* Current Password */}
            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">
                Current Password
              </span>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="grow"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* New Password */}
            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">New Password</span>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showNew ? "text" : "password"}
                  className="grow"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* Confirm Password */}
            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">
                Confirm New Password
              </span>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="grow"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* Error and Success */}
            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 text-sm">
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-outline btn-success mt-2 w-full text-lg"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
