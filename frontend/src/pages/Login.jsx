import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../app/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { KeyRound, Eye, EyeOff, Mail } from "lucide-react";
import { Link } from "react-router";
import useLoggedIn from "../hooks/useLoggedIn";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLoggedIn();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res.data));
      navigate("/feed", { replace: true });
    } catch (error) {
      setError(error.response?.data.message || "An error occurred during login.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            Login
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <label className="input input-bordered flex items-center gap-3">
              <span>
                <Mail size={18} />
              </span>

              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </label>

            {/* Password */}
            <label className="input input-bordered flex items-center gap-3">
              <span>
                <KeyRound size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </span>
            </label>

            {/* Error */}
            {error && <p className="text-center text-sm text-error">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-neutral btn-active w-full text-lg"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary transition-colors hover:text-primary/70"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
