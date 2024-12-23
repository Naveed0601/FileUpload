import React from 'react';
import Upload from '../Components/Upload/Upload';
import { Routes, Route } from 'react-router-dom';
import Success from '../Components/Success/Success';

const FileUpload = () => {
  return (
    <div className="h-screen">
      <div className="bg-gradient-to-b from-white to-blue-300 h-full">
        <Routes>
          <Route path="/" element={<Upload />}></Route>
          <Route path="/success" element={<Success />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default FileUpload;
