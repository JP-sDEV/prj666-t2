"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDevices } from "../context/deviceContext";
// import { Container, Main, Section } from "@/components/craft";
import Chart from "../components/charts/line";
import React from "react";
import dynamic from "next/dynamic";
import DeviceCard from "../components/cards/device";

// Import the DashboardCharts component with dynamic import to avoid SSR issues with WebSockets
// const DashboardCharts = dynamic(
//   () => import("@/components/dashboard/DashboardCharts"),
//   {
//     ssr: false,
//     loading: () => <p>Loading charts...</p>,
//   }
// );

export default function DashboardPage() {
  const { devices, isLoading } = useDevices();

  // const temperatureData = [
  //   { timestamp: "2025-02-14T21:00:32.099Z", temperature: 9.77 },
  //   { timestamp: "2025-02-14T21:00:32.141Z", temperature: 2.81 },
  //   { timestamp: "2025-02-14T21:00:32.176Z", temperature: 7.18 },
  //   { timestamp: "2025-02-14T21:00:32.219Z", temperature: 2.97 },
  //   { timestamp: "2025-02-14T21:00:32.254Z", temperature: 6.45 },
  // ];

  // const humidityData = [
  //   { timestamp: "2025-02-14T21:00:32.099Z", humidity: 31.96 },
  //   { timestamp: "2025-02-14T21:00:32.141Z", humidity: 87.47 },
  //   { timestamp: "2025-02-14T21:00:32.176Z", humidity: 94.5 },
  //   { timestamp: "2025-02-14T21:00:32.219Z", humidity: 75.29 },
  //   { timestamp: "2025-02-14T21:00:32.254Z", humidity: 83.3 },
  // ];

  // const moistureData = [
  //   { timestamp: "2025-02-14T21:00:32.099Z", moisture: 9.42 },
  //   { timestamp: "2025-02-14T21:00:32.141Z", moisture: 61.11 },
  //   { timestamp: "2025-02-14T21:00:32.176Z", moisture: 69.65 },
  //   { timestamp: "2025-02-14T21:00:32.219Z", moisture: 74.09 },
  //   { timestamp: "2025-02-14T21:00:32.254Z", moisture: 65.23 },
  // ];

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (!devices) {
    return <h1>You didn't register your device</h1>;
  }
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {session?.user?.name}
          </h2>
          <p className="text-gray-600">
            This is a protected route. You can only see this if you&apos;re
            logged in.
          </p>
          {/* User Account Details */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Your Account Details:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Email:</span>{" "}
                {session?.user?.email}
              </li>
              <li>
                <span className="font-medium">User ID:</span>{" "}
                {session?.user?.id}
              </li>
            </ul>
          </div>
          {/* Real-time Sensor Data Charts
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Real-time Sensor Data
            </h3>
            <DashboardCharts />
          </div> */}
        </div>

        {/* Additional Charts */}
        {/* <div className="mt-6">
          <Chart
            temperatureData={temperatureData}
            humidityData={humidityData}
            moistureData={moistureData}
          />
        </div> */}

        <div className="mt-6">
          {devices.map((device, index) => (
            <div key={index} className="flex-none">
              <DeviceCard deviceName={device.name} deviceId={device.serialId} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
