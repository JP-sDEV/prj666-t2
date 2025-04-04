"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    device_id: "",
    mode: "user",
  });
  const [error, setError] = useState("");

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

      if (response.ok) {
        setFormData({
          userId: "",
          name: "",
          device_id: "",
          mode: "user",
        });

        console.log("Register Success!");
      } else {
        console.log("Response: ", response);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-900 lg:text-3xl text-2xl font-bold mb-8">
          Register Device
        </h3>

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
