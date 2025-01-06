import React, { useEffect } from "react";
import Sidebar from "../component/sidebar";
import UploadBtn from "../component/Buttons/UploadBtn";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadDataById, getAllData, uploadData } from "../helper/Urlhelper";
function formatDate(dateString) {
  const date = new Date(dateString);

  // Define the options for formatting the date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  // Format the date into a human-readable string
  return date.toLocaleString("en-US", options);
}
const Upload = () => {
  const [file, setFile] = useState(null);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await getAllData();
        if (Array.isArray(res)) {
          setAllData(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllData();
  }, [isLoading]);
  const handledTextDownload = async (rowDetail) => {
    try {
      // console.log(rowDetail.id);

      const res = await downloadDataById(rowDetail.id, "text");
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
  const handleCsvDownload = async (rowDetail) => {
    try {
      // console.log(rowDetail.id);

      const res = await downloadDataById(rowDetail.id, "csv");
      // Convert response to Blob
      const blob = new Blob([res], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.csv"; // The file name for the downloaded file
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpload = (file) => {
    setFile(file);
    console.log(file);
  };

  const AllUploadedData = allData.map((user, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 cursor-pointer">
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{user.User.email}</td>
      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => {
            handleCsvDownload(user);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm9 0H5v12h6v-2h1V5h-1V3zM5 5h4v2H5V5zm0 4h4v2H5V9z" />
          </svg>
          <span>CSV</span>
        </button>
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => handledTextDownload(user)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h4a2 2 0 002-2V4a2 2 0 00-2-2H8zM6 4a4 4 0 014-4h4a4 4 0 014 4v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4z" />
          </svg>
          <span>TXT</span>
        </button>
      </td>
    </tr>
  ));
  const handleUploadAndProcess = async () => {
    if (!file) {
      toast.warning("Please select a file to upload");
      return;
    }
    setIsloading(true);
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
    } finally {
      setIsloading(false);
    }
  };
  return (
    <>
      <Sidebar />

      <div className=" items-center p-4 sm:ml-64 mt-10">
        <h1 className="text-3xl font-semibold mb-4">Serialization</h1>

        <div className="w-full  ">
          <form className="flex items-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  justify-center flex-col ">
            <div className="mb-4 items-center">
              <label
                className="block text-gray-700 text-xl font-bold mb-2"
                htmlFor="username"
              >
                Upload CSV
              </label>
              <UploadBtn onChange={handleUpload} />
            </div>
            <div className="flex items-center  w-1/4 justify-between">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUploadAndProcess}
              >
                Upload and process
              </button>
            </div>
          </form>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[50vh]">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Sl No.
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Csv File
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Text File
                  </th>
                </tr>
              </thead>
              {AllUploadedData.length !== 0 && <tbody>{AllUploadedData}</tbody>}
            </table>
          </div>
          {AllUploadedData.length === 0 && (
            <div
              // colSpan="5" // Replace 5 with the total number of columns in your table
              className="px-4 py-6 w-full text-center text-gray-500 italic bg-gray-50 flex flex-col items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m2 0a6 6 0 11-12 0 6 6 0 0112 0zm2 0a8 8 0 10-16 0 8 8 0 0016 0z"
                />
              </svg>
              No data available to display.
            </div>
          )}

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
