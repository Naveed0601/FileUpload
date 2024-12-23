import React from "react";

const Apitest = () => {
  const handleConsole = async () => {
    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   "x-api-key": "AIzaSyBfyQ-ct__5fH-yNDNMI9C6MHrvblKX69A",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleConsole}>Click</button>
    </div>
  );
};

export default Apitest;
