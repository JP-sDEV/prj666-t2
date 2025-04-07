"use client";

import Chart from "../charts/line";
import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { FaSpinner, FaPause, FaPlay } from "react-icons/fa"; 

const MQTT_BROKER =
  "wss://9f153fb50aea4234875db6b86d42af5b.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USER = "pico-w";
const MQTT_PASSWORD = "Password1";
// const MQTT_TOPIC_SENSOR = "sensor";
// const MQTT_TOPIC_CONTROL = "control";
const MQTT_TOPIC_SENSOR = "device/e66180109f399025/live-data";
const MQTT_TOPIC_CONTROL = "device/e66180109f399025/control";

export default function MqttSubscriber() {
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [moistureData, setMoistureData] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    temperature: false,
    humidity: false,
    moisture: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USER,
      password: MQTT_PASSWORD,
      protocol: "wss",
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe(MQTT_TOPIC_SENSOR, (err) => {
        if (err) console.error("Subscribe error:", err);
      });
    });

    mqttClient.on("message", (topic, payload) => {
      if (topic === MQTT_TOPIC_SENSOR && isMonitoring) {
        const newData = payload.toString();
        setMessage(newData);

        // Parse the incoming message and add it to the appropriate sensor data array
        try {
          const parsedData = JSON.parse(newData);
          const timestamp = new Date(parsedData.time * 1000).toISOString();

          // Add data to the respective arrays for each sensor type
          setTemperatureData((prevData) => [
            ...prevData,
            { timestamp, temperature: parsedData.temperature },
          ]);
          setHumidityData((prevData) => [
            ...prevData,
            { timestamp, humidity: parsedData.humidity },
          ]);
          setMoistureData((prevData) => [
            ...prevData,
            { timestamp, moisture: parsedData.moisture },
          ]);
        } catch (error) {
          console.error("Error parsing sensor data:", error);
        }
        setIsLoading(false);
      }
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [isMonitoring]); 

  const sendCommand = (command) => {
    if (client) {
      client.publish(MQTT_TOPIC_CONTROL, command);
      console.log(`Sent command: ${command}`);
    }
  };

  const handleFieldChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFields((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleStartClick = () => {
    setIsMonitoring(true); 
    setIsLoading(true);
  };
  const handlePauseClick = () => {
    setIsMonitoring(false); 
    setIsLoading(false); 
  };


  // Export selected fields to CSV
  const exportCSV = () => {
    const headers = ["Timestamp", ...Object.keys(selectedFields).filter(field => selectedFields[field])];
    const rows = temperatureData.map((data, index) => {
      const row = [data.timestamp];
      if (selectedFields.temperature) row.push(data.temperature);
      if (selectedFields.humidity) row.push(humidityData[index]?.humidity || "");
      if (selectedFields.moisture) row.push(moistureData[index]?.moisture || "");
      return row;
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_data.csv";
    link.click();
  };

  // Export selected fields to JSON
  const exportJSON = () => {
    const filteredData = {
      temperatureData: selectedFields.temperature ? temperatureData : [],
      humidityData: selectedFields.humidity ? humidityData : [],
      moistureData: selectedFields.moisture ? moistureData : [],
    };

    const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_data.json";
    link.click();
  };

  const closeModal = () => {
    setShowExportOptions(false);
  };

  return (
    <div className="pl-20 pr-20 pb-20 shadow-lg bg-white text-center">
      <div className="flex items-center justify-center">
      <h2 className="text-4xl font-extrabold text-black transform transition duration-500 ease-in-out ">
  Live Sensor Data
</h2>
        {isLoading && (
          <FaSpinner className="animate-spin text-lg text-gray-500 ml-4" style={{ animationDuration: "1.2s" }} />
        )}
      </div>

      <div className="mt-4 flex gap-6 justify-center">
        {!isMonitoring ? (
          <button
            onClick={() => {
              sendCommand("start");
              handleStartClick();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 "
          >
            <FaPlay className="inline mr-2" />
            Start Monitoring
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                sendCommand("stop");
                handlePauseClick();
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 "
            >
              <FaPause className="inline mr-2" />
              Pause Monitoring
            </button>
          </>
        )}

          <button
            onClick={() => setShowExportOptions(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Export
          </button>
      </div>


      {/* Modal for Export Options */}
      {showExportOptions && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative"> 
            <h3 className="text-lg font-semibold mb-4">Select Data to Export</h3>
            
            {/* Close Modal Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>

            <div className="mt-4 flex justify-center gap-6">
              {["temperature", "humidity", "moisture"].map((field) => (
                <label key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={field}
                    checked={selectedFields[field]}
                    onChange={handleFieldChange}
                  />
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              ))}
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                CSV
              </button>
              <button
                onClick={exportJSON}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                JSON
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6"></div>
      <Chart
        temperatureData={temperatureData}
        humidityData={humidityData}
        moistureData={moistureData}
      />
    </div>
  );
}
