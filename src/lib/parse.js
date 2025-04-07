const parseIncomingData = (rawData) => {
  const data = {
    temperature: [],
    humidity: [],
    moisture: [],
  };

  rawData.forEach((entry) => {
    // Convert Decimal128 to string and then parse it to a float
    const temperature = parseFloat(entry.temperature.toString());
    const humidity = parseFloat(entry.humidity.toString());
    const moisture = parseFloat(entry.moisture.toString());

    // Push to the respective arrays
    data.temperature.push({
      timestamp: entry.timestamp,
      temperature: temperature,
    });
    data.humidity.push({
      timestamp: entry.timestamp,
      humidity: humidity,
    });
    data.moisture.push({
      timestamp: entry.timestamp,
      moisture: moisture,
    });
  });

  return data;
};

export { parseIncomingData };
