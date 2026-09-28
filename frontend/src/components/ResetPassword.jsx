import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.patch(
        BASE_URL + "/profile/reset_password",
        { curPassword: currentPassword, newPassword: newPassword },
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
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <div className="mb-32 mt-4 flex justify-center bg-base-100 px-4 py-6">
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4 justify-center text-2xl font-bold">
            Reset Password
          </h2>

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {/* Current Password */}
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showCurrent ? "text" : "password"}
                className="grow"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                type="button"
              >
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </label>

            {/* New Password */}
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showNew ? "text" : "password"}
                className="grow"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button onClick={() => setShowNew(!showNew)} type="button">
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </label>

            {/* Confirm Password */}
            <label className="input input-bordered flex items-center gap-2">
              <input
                type={showConfirm ? "text" : "password"}
                className="grow"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                type="button"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </label>

            {/* Error and Success*/}
            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="toast toast-end toast-top mt-16 h-2">
                <div className="alert alert-success">
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-outline btn-success w-full text-lg"
            >
              {isLoading ? (
                <>
                  <span />
                  Requesting...
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
