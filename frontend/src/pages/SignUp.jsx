import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserRound, Mail, KeyRound, Eye, EyeOff, Code2 } from "lucide-react";
import useSignUp from "../hooks/useSignUp";
import { useDispatch } from "react-redux";
import { addUser } from "../app/userSlice";
import useLoggedIn from "../hooks/useLoggedIn";

const SignUp = () => {
  useLoggedIn();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    console.log(formData);
    // Add your signup API call here.
    const result = await useSignUp(formData);

    if (!result.success) {
      setError(result.message);
    }

    if (result.success) {
      dispatch(addUser(result.data?.data));
      navigate("/feed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#191e28] px-4 py-10 sm:px-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700/70 bg-[#191e28] px-5 py-8 shadow-2xl shadow-black/20 sm:px-10 sm:py-10 md:px-14">
        {/* Logo */}
        <div className="mb-4 flex items-center justify-center">
          <img
            src="/logo3.png"
            alt="CODEMATE Logo"
            className="h-14 w-auto object-contain sm:h-16"
          />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">
            Create Account
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-lg">
            Join CODEMATE and connect with developers around the world.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="input flex h-16 items-center gap-4 rounded-xl border border-slate-700 bg-[#1c222d] px-5 text-slate-300 focus-within:border-blue-500 focus-within:outline-none">
              <UserRound size={23} className="shrink-0 text-slate-400" />
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-400 sm:text-lg"
                required
              />
            </label>

            <label className="input flex h-16 items-center gap-4 rounded-xl border border-slate-700 bg-[#1c222d] px-5 text-slate-300 focus-within:border-blue-500 focus-within:outline-none">
              <UserRound size={23} className="shrink-0 text-slate-400" />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-400 sm:text-lg"
                required
              />
            </label>
          </div>

          {/* Email */}
          <label className="input flex h-16 items-center gap-4 rounded-xl border border-slate-700 bg-[#1c222d] px-5 text-slate-300 focus-within:border-blue-500 focus-within:outline-none">
            <Mail size={24} className="shrink-0 text-slate-400" />
            <input
              type="emailId"
              name="emailId"
              placeholder="Email address"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-400 sm:text-lg"
              required
            />
          </label>

          {/* Password */}
          <label className="input flex h-16 items-center gap-4 rounded-xl border border-slate-700 bg-[#1c222d] px-5 text-slate-300 focus-within:border-blue-500 focus-within:outline-none">
            <KeyRound size={24} className="shrink-0 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-400 sm:text-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 text-slate-400 transition-colors hover:text-blue-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={23} /> : <Eye size={23} />}
            </button>
          </label>

          {/* Confirm Password */}
          <label className="input flex h-16 items-center gap-4 rounded-xl border border-slate-700 bg-[#1c222d] px-5 text-slate-300 focus-within:border-blue-500 focus-within:outline-none">
            <KeyRound size={24} className="shrink-0 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-400 sm:text-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="shrink-0 text-slate-400 transition-colors hover:text-blue-400"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={23} /> : <Eye size={23} />}
            </button>
          </label>

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            className="btn h-16 min-h-0 w-full rounded-xl border-none bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/30 sm:text-lg"
          >
            Create account
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-slate-400 sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-500 transition-colors hover:text-blue-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
