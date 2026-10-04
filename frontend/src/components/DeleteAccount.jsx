import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

import { useDispatch } from "react-redux";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setError("Please enter your current password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.delete(BASE_URL + "/user/delete", {
        data: {
          password,
        },
        withCredentials: true,
      });

      // console.log(res.data);

      dispatch({ type: "store/clearStore" });

      setPassword("");

      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error.response?.data?.message);

      setError(
        error.response?.data?.message ||
          "Unable to delete your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        {/* Delete Account Card */}
        <div className="card border border-error/30 bg-base-100 shadow-lg">
          <div className="card-body p-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-xl bg-error/10 p-4 text-error">
                <Trash2 size={32} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="mt-3 text-center text-2xl font-bold">
              Delete Account
            </h1>

            {/* Description */}
            <p className="mt-2 text-center text-sm text-base-content/60">
              Enter your current password to permanently delete your CODEMATE
              account.
            </p>

            {/* Password */}
            <div className="mt-5">
              <label className="label">
                <span className="label-text text-sm font-semibold">
                  Current Password
                </span>
              </label>

              {/* Password Input + Eye Button */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="input input-sm input-bordered w-full pr-10"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="alert alert-warning mt-4 py-3">
              <Trash2 size={18} />

              <div>
                <h3 className="text-sm font-bold">
                  This action cannot be undone
                </h3>

                <p className="text-xs">
                  Your profile, connections, and account data will be
                  permanently deleted.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error mt-3 py-3">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-2">
              {/* Back Button */}
              <button
                onClick={() => navigate("/settings")}
                className="btn btn-ghost btn-sm gap-2"
                disabled={loading}
              >
                <ArrowLeft size={16} />
                Back to Settings
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteAccount}
                className="btn btn-error btn-sm"
                disabled={loading || !password.trim()}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Permanently Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
