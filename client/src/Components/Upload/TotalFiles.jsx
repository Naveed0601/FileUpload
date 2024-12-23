import React, { useEffect, useState } from "react";

const TotalFiles = () => {
  const [files, setFiles] = useState([]);
  const [secret, setSecret] = useState([]);

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/download/${fileName}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error("File download failed with status:", response.status);
        alert("File Download Failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during file download:", error);
      alert("Error occurred while downloading the file");
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:8000/getfiles", {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Failed to fetch files:", response.statusText);
          return;
        }

        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  });

  useEffect(() => {
    const FetchKey = async () => {
      try {
        const response = await fetch("http://localhost:8000/key");
        console.log(response);
        if (!response.ok) {
          console.error("Failed to fetch key", response.statusText);
        }
        const data = await response.json();
        setSecret(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    FetchKey();
  }, []);

  return (
    <div className="mt-4 ">
      <h1 className="">secretkey : {secret}</h1>
      <h2 className="text-lg font-bold">Files Available for Download:</h2>
      {files.length > 0 ? (
        <ul className="list-disc list-inside">
          {files.map((file, index) => (
            <div key={index} className="mt-2 bg-gray-400 h-10 p-2 rounded-lg">
              <ul>
                <li className="flex justify-between items-center text-black">
                  <span>{file}</span>
                  <button
                    className="bg-blue-500 rounded-lg p-1 w-20 h-7"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </button>
                </li>
              </ul>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No files available.</p>
      )}
    </div>
  );
};

export default TotalFiles;
