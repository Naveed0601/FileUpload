import React, { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheckDouble } from "react-icons/fa6";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopiedIndex(index))
      .catch((err) => console.error("Failed to copy text:", err));
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch("http://localhost:8000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API response:", data);

      let imageList = [];
      try {
        if (!data.Response) {
          throw new Error("Response field is missing in API response.");
        }

        let cleanedResponse = data.Response;

        console.log("Raw Response:", cleanedResponse);

        // Step 1: Replace single quotes with double quotes
        cleanedResponse = cleanedResponse.replace(/'/g, '"');

        // Step 2: Convert Python datetime to ISO string
        cleanedResponse = cleanedResponse.replace(
          /datetime\.datetime\(([^)]+)\)/g,
          (match, p1) => {
            const parts = p1.split(", ").map((part) => parseInt(part, 10));
            const [year, month, day, hour, minute, second, microsecond] = parts;
            const date = new Date(
              Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                second,
                microsecond / 1000
              )
            );
            return `"${date.toISOString()}"`;
          }
        );

        console.log("Cleaned Response:", cleanedResponse);

        // Step 3: Use regex to extract blocks
        const regex = /{"uri":.*?"metadata": \[\]}/g;
        const matches = cleanedResponse.match(regex);

        if (matches) {
          imageList = matches;
          console.log("Extracted Objects:", imageList);
        } else {
          console.error("No matches found in the cleaned response.");
        }
      } catch (e) {
        console.error("Error processing response:", e);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: `Extracted objects: \n${imageList.join("\n\n")}`,
          sender: "bot",
        },
      ]);

      setInput("");
    } catch (error) {
      console.error("Error:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred. Please try again.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-200% animate-gradient-x h-screen flex justify-center items-center">
      <div className="w-[800px] h-[550px] bg-white rounded-2xl shadow-lg flex flex-col">
        <h1 className="bg-gray-400 text-center p-2 text-2xl font-bold rounded-t-2xl">
          Chat
        </h1>
        <div className="flex-1 p-4 overflow-auto flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start w-auto max-w-[80%]"
              }`}
            >
              {msg.sender === "bot" && (
                <button
                  onClick={() => copyToClipboard(msg.text, index)}
                  className="mb-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-flex items-center"
                >
                  {copiedIndex === index ? (
                    <FaCheckDouble />
                  ) : (
                    <IoCopyOutline />
                  )}
                </button>
              )}
              <pre className="whitespace-pre-wrap">{msg.text}</pre>
            </div>
          ))}
        </div>
        <div className="flex items-center p-2 border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter customer ID..."
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
