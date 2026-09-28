import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import useCloudinary from "../hooks/useCloudinary";
import { useDispatch } from "react-redux";
import { addUser } from "../app/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [age, setAge] = useState(user.age ?? "");
  const [gender, setGender] = useState(user.gender ?? "");
  const [about, setAbout] = useState(user.about ?? "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");
  const [skills, setSkills] = useState(user.skills ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePhotoUrl = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setIsUploading(true);

    try {
      const uploadedUrl = await useCloudinary(e);

      if (uploadedUrl) {
        setPhotoUrl(uploadedUrl);
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleEdit = async () => {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age: age === "" ? undefined : Number(age),
          gender,
          about,
          photoUrl,
          skills: skills.filter(Boolean),
        },
        { withCredentials: true },
      );
      // console.log(response.data.apiResult);

      dispatch(addUser(response.data.apiResult));
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-base-100 px-4 py-10 lg:flex-row lg:items-start">
      {/* Edit Profile Form */}
      <div className="card w-full max-w-md border border-base-300 bg-base-200 shadow-xl">
        <div className="card-body gap-4">
          <h2 className="card-title justify-center text-2xl font-bold">
            Edit Profile
          </h2>

          <div className="divider my-0" />

          {/* First Name */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">First Name</span>
            <input
              type="text"
              value={firstName}
              className="input input-bordered w-full"
              placeholder="Enter first name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          {/* Last Name */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">Last Name</span>
            <input
              type="text"
              value={lastName}
              className="input input-bordered w-full"
              placeholder="Enter last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">Age</span>
              <input
                type="number"
                min="18"
                value={age}
                className="input input-bordered w-full"
                placeholder="Age"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2 font-medium">Gender</span>
              <select
                value={gender}
                className="select select-bordered w-full"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* About */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">About</span>
            <textarea
              value={about}
              className="textarea textarea-bordered min-h-24 w-full"
              placeholder="Tell us about yourself"
              onChange={(e) => setAbout(e.target.value)}
            />
          </label>

          {/* Profile Image */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">Profile Image</span>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handlePhotoUrl}
              disabled={isUploading}
            />
            {isUploading && (
              <span className="mt-2 text-sm text-info">Uploading image...</span>
            )}
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Profile preview"
                className="mt-3 h-24 w-24 cursor-pointer rounded-full object-cover"
              />
            )}
          </label>

          {/* Skills */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">Skills</span>
            <textarea
              value={skills.join(", ")}
              className="textarea textarea-bordered min-h-24 w-full"
              placeholder="React, Node.js, MongoDB"
              nChange={(e) =>
                setSkills(
                  e.target.value.split(",").map((skill) => skill.trim()),
                )
              }
            />
            <span className="label-text-alt mt-1 opacity-60">
              Separate skills with commas.
            </span>
          </label>

          {/* Status Messages */}
          {error && <p className="text-center text-sm text-error">{error}</p>}
          {success && (
            <p className="text-center text-sm text-success">{success}</p>
          )}

          {/* Submit */}
          <div className="card-actions mt-4 justify-center">
            <button
              onClick={handleEdit}
              type="button"
              disabled={isSaving || isUploading}
              className="btn btn-success w-full text-base"
            >
              {isSaving ? (
                <>
                  <span className="loading loading-spinner" />
                  Saving...
                </>
              ) : (
                "Edit Submit"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Profile Preview */}
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Profile Preview</h2>
        <div className="w-full">
          <UserCard
            user={{
              firstName,
              lastName,
              age,
              gender,
              about,
              photoUrl,
              skills,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
