import React from 'react'
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { Link } from 'react-router-dom';


const Success = () => {
  return (
    <div  className="h-screen flex justify-center items-center">
      <div className="w-[40%] bg-white rounded-3xl shadow-xl flex flex-col justify-center items-center relative">
       <MdOutlineFileDownloadDone  className='mt-10 text-7xl rounded-full bg-green-400 text-white p-4 shadow-white ' />
       <h1 className='font-bold mt-4 font-serif text-2xl'>Upload Complete</h1>
       <p className='font-serif text-xl text-center mt-5 ml-6 mr-6'>Your files have been uploaded successfully</p>
       <div className='bg-gradient-to-r from-sky-500 to-fuchsia-500 w-full flex justify-center items-center mt-14 h-[90px] rounded-b-3xl '>
       <Link to={'/'}>
        <button className="bg-white w-32 h-10 rounded-3xl font-sans text-fuchsia-700">
          Continue
        </button>
        </Link>
        </div>
      </div>
    </div>
  )
}

export default Success