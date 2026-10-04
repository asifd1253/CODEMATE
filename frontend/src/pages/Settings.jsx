import React from "react";
import { Link } from "react-router";
import {
  UserRound,
  LockKeyhole,
  ChevronRight,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-base-200 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <SettingsIcon size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-base-content">Settings</h1>

          <p className="mt-2 text-sm text-base-content/60">
            Manage your account and personalize your experience.
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Edit Profile */}
          <Link
            to="/profile/edit"
            className="group card border border-base-300 bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
          >
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <UserRound size={26} />
                </div>

                <ChevronRight
                  size={22}
                  className="text-base-content/40 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              <div>
                <h2 className="card-title text-lg">Edit Profile</h2>

                <p className="mt-1 text-sm leading-relaxed text-base-content/60">
                  Update your name, profile photo, age, skills and other
                  personal details.
                </p>
              </div>

              <div className="card-actions mt-auto pt-2">
                <span className="text-sm font-semibold text-primary">
                  Manage profile
                </span>
              </div>
            </div>
          </Link>

          {/* Reset Password */}
          <Link
            to="/reset-password"
            className="group card border border-base-300 bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-warning/50 hover:shadow-xl"
          >
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-warning/10 p-3 text-warning transition-colors group-hover:bg-warning group-hover:text-warning-content">
                  <LockKeyhole size={26} />
                </div>

                <ChevronRight
                  size={22}
                  className="text-base-content/40 transition-transform group-hover:translate-x-1 group-hover:text-warning"
                />
              </div>

              <div>
                <h2 className="card-title text-lg">Reset Password</h2>

                <p className="mt-1 text-sm leading-relaxed text-base-content/60">
                  Change your current password to keep your account secure.
                </p>
              </div>

              <div className="card-actions mt-auto pt-2">
                <span className="text-sm font-semibold text-warning">
                  Change password
                </span>
              </div>
            </div>
          </Link>

          {/* Delete Account */}
          <Link
            to="/delete-account"
            className="group card cursor-pointer border border-error/30 bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-error hover:shadow-xl"
          >
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-error/10 p-3 text-error transition-colors group-hover:bg-error group-hover:text-error-content">
                  <Trash2 size={26} />
                </div>

                <ChevronRight
                  size={22}
                  className="text-base-content/40 transition-transform group-hover:translate-x-1 group-hover:text-error"
                />
              </div>

              <div>
                <h2 className="card-title text-lg text-error">
                  Delete Account
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-base-content/60">
                  Permanently delete your account and all associated
                  connections. This action cannot be undone.
                </p>
              </div>

              <div className="card-actions mt-auto pt-2">
                <span className="text-sm font-semibold text-error">
                  Delete account
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
