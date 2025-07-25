import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: token,
          },
        });

        setProfile(response.data.user);
      } catch (err) {
        console.log(err);
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl font-medium">{message || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg">
          <h2 className="text-3xl font-semibold mb-8 text-center">Your Profile</h2>

          <p className="mb-4 text-lg text-center">
            <strong>Name:</strong> {profile.name}
          </p>
          <p className="mb-4 text-lg text-center">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="mb-4 text-lg text-center">
            <strong>Role:</strong> {profile.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;