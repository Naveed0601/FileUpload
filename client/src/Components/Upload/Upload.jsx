import { FaFilePdf } from "react-icons/fa";
import { GiFiles } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import React, { useState, useRef } from "react";
import TotalFiles from "./TotalFiles";

const Upload = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [progress, setProgress] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || e.dataTransfer.files);

    const newFiles = selectedFiles.filter((file) => {
      const isDuplicate = files.some(
        (existing) => existing.file.name === file.name
      );
      if (isDuplicate) {
        alert("File already uploaded");
      }
      return !isDuplicate;
    });

    newFiles.forEach((file) => {
      setFiles((prevFiles) => [...prevFiles, { file, progress: 0 }]);
      startUpload(file);
    });
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const startUpload = async (file) => {
    const totalDuration = 1000;
    const updateInterval = 100;
    const totalSteps = totalDuration / updateInterval;
    const increment = 100 / totalSteps;

    let currentProgress = 0;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketName", "fileupload_10");
    formData.append("fileOutputName", file.name);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Failed to upload file");
        return;
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);

      setFilesList((prevFilesList) => [...prevFilesList, file.name]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    const interval = setInterval(() => {
      currentProgress += increment;

      setProgress((prevProgress) => ({
        ...prevProgress,
        [file.name]: {
          progress: currentProgress.toFixed(2),
          timeLeft: (
            (totalDuration - currentProgress * (totalDuration / 100)) /
            1000
          ).toFixed(2),
        },
      }));

      if (currentProgress >= 100) {
        clearInterval(interval);

        setProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: { progress: 100, timeLeft: 0 },
        }));
      }
    }, updateInterval);
  };

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="upload"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="h-screen flex justify-center items-center overflow-hidden"
      >
        <div
          className={`${
            files.length > 0 ? "w-[60%]" : "w-[30%]"
          } p-6 bg-white rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden`}
        >
          <div className="flex">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div
                className="w-1/2 ml-20 p-6 flex justify-center items-center cursor-pointer"
                onClick={handleFileClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <form>
                  <h1 className="text-xl flex text-blue-500 font-glyphic">
                    UPLOAD <p className="text-black ml-2"> FILES</p>
                  </h1>
                  <div
                    className={`flex flex-col justify-center items-center mt-4 w-[300px] rounded-lg border-dashed border-2 border-gray-500 bg-gray-200 h-[350px] ${
                      isDragging ? "border-blue-500 bg-blue-100" : ""
                    }`}
                  >
                    <GiFiles className="text-center text-9xl text-gray-500 mb-4" />
                    <h1 className="font-bold text-center text-gray-500 font-serif">
                      Drag and drop your files here or{" "}
                      <span className="text-blue-500">Browse</span>
                    </h1>
                  </div>
                </form>
              </div>
            </motion.div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <div className="w-full mt-16">
              <div
                className="flex flex-col gap-2 max-h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                style={{ direction: "ltr" }}
              >
                {files.map(({ file }, index) => (
                  <div
                    key={file.name}
                    className="flex flex-col bg-gray-300 rounded-lg p-2 w-full mb-2 h-auto"
                  >
                    <div className="flex items-center">
                      <FaFilePdf className="text-4xl mr-4 text-red-600" />
                      <div>
                        <h1 className="font-semibold text-sm text-gray-800">
                          {file.name}
                        </h1>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        <div className="w-[200px] bg-gray-400 rounded-full mt-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full"
                            style={{
                              width: `${progress[file.name]?.progress || 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {progress[file.name]?.progress}% -{" "}
                          {progress[file.name]?.timeLeft}s remaining
                        </p>
                      </div>
                      {progress[file.name]?.progress === 100 && (
                        <IoMdCheckmarkCircleOutline className="ml-10 text-3xl text-green-500" />
                      )}
                    </div>

                    {progress[file.name]?.progress === 100 && (
                      <button
                        onClick={() => handleDownload(file.name)}
                        className="mt-2 w-28 h-8 rounded-lg text-white bg-blue-500"
                      >
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Display TotalFiles component */}
          <TotalFiles filesList={filesList} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Upload;
