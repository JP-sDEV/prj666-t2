"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Devices() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    device_id: "",
    mode: "user",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.name) {
      setError("Device Name are required.");
      return;
    }

    if (!session?.user?.id) {
      setError("User ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/device/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("111111111111111111111111111111111111111111111111111111:", response.status); //404

      const responseData = await response.json(); 
      if (responseData.ok) {
        setFormData({
          userId: "",
          name: "",
          device_id: "",
          mode: "user",
        });

        setSuccessMessage("Device registered successfully!");
        setShowPopup(true); 

        console.log("Device Register Success!");

      } else {
        setError(responseData.message || "Failed to register!."); //error here!
        console.log("Response: ", responseData);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 2500); 
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-900 lg:text-3xl text-2xl font-bold mb-8">
          Register Device
        </h3>

        {/* Success Popup */}
        {successMessage && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50"
            onClick={() => setSuccessMessage(false)}
          >
            <div
              className="bg-green-100 text-green-700 p-6 rounded-lg shadow-lg w-80 text-center transition-opacity duration-1000 opacity-0 animate-fadeIn"
              style={{ animationDuration: "1s", opacity: "1" }}
            >
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-800 font-medium mb-2 block">
              Device Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-none border border-gray-300 focus:border-blue-600 focus:bg-white"
              placeholder="Enter Raspberry Pi Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm text-gray-800 font-medium mb-2 block">
              Device ID
            </label>
            <input
              name="device_id"
              type="text"
              required
              className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-none border border-gray-300 focus:border-blue-600 focus:bg-white"
              placeholder="Enter Raspberry Pi ID"
              value={formData.device_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="w-full shadow-md py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Register Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
