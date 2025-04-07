
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useDevices } from "@/app/context/deviceContext";
import Image from 'next/image';

export default function Profile() {
  // Access the devices and loading state from the context
  const { devices, isLoading } = useDevices();
  const { data: session, status } = useSession();
  // Show a loading message while the devices are being fetched
  if (isLoading) {
    return <div>Loading devices...</div>;
  }

  if (!devices) {
    return <div>No devices found.</div>;
  }

  return (


    <div className="device flex flex-wrap justify-left gap-6 p-10 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl">
        {devices.map((device, index) => (
          <div key={index} className="flex-none">
  
            <div className="card flex bg-white rounded-lg shadow-lg max-w-4xl w-full ">
              <div className="image-container flex-shrink-0">
                <Image
                  src="/device.jpg"
                  alt="image"
                  width={300}
                  height={200}
                  className="device-img rounded-l-lg"
                />
              </div>
              <div className="mt-3 text-lg text-gray-700 p-4">
                <p> <span className="font-bold inline-block w-35">User Name:</span> {session.user.name}</p>
                <p> <span className="font-bold inline-block w-35">Capacity:</span>   32GB </p>
                <p> <span className="font-bold inline-block w-35">Version: </span>   1.24.0</p>


      {device ? (
        <>
                <p> <span className="font-bold inline-block w-35">Identifier:</span> {device.serialId} </p>
                <p> <span className="font-bold inline-block w-35">Device Name:</span> {device.name}</p>
        </>
       ) : (
        <>
                <p> <span className="font-bold inline-block w-35">Identifier:</span> No device id found </p>
                <p> <span className="font-bold inline-block w-35">Device Name:</span> No device name found</p>
        </>
       )} 


              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
