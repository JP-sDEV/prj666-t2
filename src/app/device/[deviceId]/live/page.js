// "use client";

// import { useDevices } from "@/app/context/deviceContext";
// import { useState, useEffect } from "react";
// import Chart from "@/app/components/charts/line";

// export default function DevicePage({ params }) {
//   const { deviceId } = use(params);

//   //   const { devices, setDevices } = useDevices();
//   //   const [data, setData] = useState({});
//   //   const [isLoading, setIsLoading] = useState(true);

//   //   const fetchData = async () => {
//   //     setIsLoading(true); // Set loading state

//   //     try {
//   //       const response = await fetch(`/api/device/data/${deviceId}`);
//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch devices");
//   //       }

//   //       const data = await response.json();
//   //       setData(data); // Set the devices from the response
//   //       console.log("data: ", data);
//   //     } catch (error) {
//   //       console.error("Error fetching devices:", error);
//   //     } finally {
//   //       setIsLoading(false); // Set loading to false once the fetch is complete
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     fetchData();
//   //   }, [deviceId]);

//   //   // console.log(devices);
//   //   // check if device belongs to user
//   //   const userOwns = devices.some((device) => device.serialId == deviceId);

//   //   if (!userOwns) {
//   //     return <h1>Device: {deviceId} does not belong to you.</h1>;
//   //   }

//   //   if (isLoading) {
//   //   return (
//   //     <div className="flex min-h-screen items-center justify-center">
//   //       <p>Loading...</p>
//   //     </div>
//   //   );
//   //   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Device ID: {deviceId}</h1>

//       {/* <div>
//         <Chart
//           temperatureData={data.temperature}
//           humidityData={data.humidity}
//           moistureData={data.moisture}
//         />
//       </div> */}
//     </div>
//   );
// }

"use client";

import { useState, use } from "react";
import MqttSubscriber from "@/app/components/mqtt/client";

export default function DevicePage({ params }) {
  const { deviceId } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the POST request when the button is clicked
  const handlePostRequest = async () => {
    setIsLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(`/api/device/data/${deviceId}/live`, {
        // make a server call
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "https://demo.com/device/123",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      const data = await response.json();
      console.log("Server response: ", data);
      alert("Client successfully initialized"); // Alert on success
    } catch (error) {
      console.error("Error sending POST request:", error);
      setError("Error sending POST request: " + error.message); // Set the error message to display
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const getLiveData = async () => {
    try {
      const response = await fetch(`/api/device/data/${deviceId}/live`, {
        // make a server call
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      const data = await response.json();
      console.log("Server response: ", data);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Device ID: {deviceId}</h1>



      {/* Button to send the POST request */}
      {/* <button
        onClick={handlePostRequest}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Initialize Client"}
      </button> */}

      {/* <button
        onClick={getLiveData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isLoading}
      >
        Get data point
      </button> */}

      <MqttSubscriber />

      {/* Error message if something goes wrong */}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
