// "use client";

// import { useSession, signIn, signOut } from "next-auth/react";

// export default function Profile() {
//   const { data: session, status } = useSession();
  
//   if (status === "loading") return <p>Loading session...</p>;

//   return (
//   <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">

//       {status === "authenticated" ? (
//         <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Welcome, {session.user.name}!</h1>
//           </div>
//           <div className="space-y-4">

//             <div className="flex justify-between">
//               <p className="text-gray-800 dark:text-white font-medium">Name</p>
//               <p className="text-gray-600 dark:text-gray-300">{session.user.name}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-gray-800 dark:text-white font-medium">Email</p>
//               <p className="text-gray-600 dark:text-gray-300">{session.user.email}</p>
//             </div>

//           </div>
//           <div className="mt-6 text-center">
//             <button
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none"
//               onClick={() => signOut()}
//             >
//               Sign out
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center">
//           <p className="text-gray-800 dark:text-white">You are not signed in.</p>
//           <button
//             onClick={() => signIn()}
//             className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
//           >
//             Sign In
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


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
                <p> <span className="font-bold inline-block w-35">Identifier:</span> {device.serialId} </p>
                <p> <span className="font-bold inline-block w-35">Device Name:</span> {device.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
