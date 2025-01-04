import React from "react";
import Sidebar from "../component/sidebar";
import UploadBtn from "../component/Buttons/UploadBtn";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadData } from "../helper/Urlhelper";
const Upload = () => {
  const [file, setFile] = useState(null);
  const handleUpload = (file) => {
    setFile(file);
    console.log(file);
  };

  const handleUploadAndProcess = async () => {
    if (!file) {
      toast.warning("Please select a file to upload");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);
    try {
      const res = await uploadData(formdata);
      // Convert response to Blob
      const blob = new Blob([res], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.txt"; // The file name for the downloaded file
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Sidebar />

      <div className=" items-center p-4 sm:ml-64 mt-10">
        <h1 className="text-3xl font-semibold mb-4">Serialization</h1>

        <div className="w-full max-w-xs ">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex justify-center flex-col ">
            <div className="mb-4 items-center">
              <label
                className="block text-gray-700 text-xl font-bold mb-2"
                htmlFor="username"
              >
                Upload CSV
              </label>
              <UploadBtn onChange={handleUpload} />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUploadAndProcess}
              >
                Upload and process
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;IOS.All rights reserved.
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Upload;
