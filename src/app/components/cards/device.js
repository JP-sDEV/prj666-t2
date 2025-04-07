"use client";

import { useRouter } from "next/navigation";

const DeviceCard = ({ deviceName, deviceId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/device/${deviceId}/live`); // Navigate to dynamic route
  };

  return (
    <div
      onClick={handleClick}
      className="w-64 p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition"
    >
      <h2 className="text-xl font-semibold">{deviceName}</h2>
      <p className="text-gray-600">Device ID: {deviceId}</p>
    </div>
  );
};

export default DeviceCard;
