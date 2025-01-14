import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import UploadBtn from "../component/Buttons/UploadBtn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  checkData,
  downloadDataById,
  getAllData,
  uploadData,
} from "../helper/Urlhelper";
import ErrorModal from "../modal/ErrorModal";

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
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
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
    const date = rowDetail.createdAt;

    try {
      const res = await downloadDataById(rowDetail.id, "pdf");

      // Extract file name from the "Content-Disposition" header
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "output.pdf"; // Default file name
      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      const parts = fileName.split("-");
      const newFileName = `${parts[0]}-${parts[1]}.pdf`;

      // Convert response data to Blob
      const blob = new Blob([res.data], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName; // Use the extracted file name
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleCsvDownload = async (rowDetail) => {
    const date = rowDetail.createdAt;

    try {
      const res = await downloadDataById(rowDetail.id, "csv");

      // Extract file name from the "Content-Disposition" header
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "output.csv"; // Default file name
      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      const parts = fileName.split("-");
      const newFileName = `${parts[0]}-${parts[1]}.csv`;

      // Convert response data to Blob
      const blob = new Blob([res.data], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName; // Use the extracted file name
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleUpload = (file) => {
    setFile(file);
  };

  const handleUploadAndProcess = async () => {
    if (!file) {
      toast.warning("Please select a file to upload");
      return;
    }

    let filesToExclude = [];
    let excludedFileNames = [];
    let filesToStore = [];
    let includedFileNames = [];
    // Loop through all selected files
    for (let i = 0; i < file.length; i++) {
      const currentFile = file[i];
      const fileName = currentFile.name;
      // Check if the file is already present
      const res = await checkData(fileName); // Assuming checkData is async and returns an object { isPresent: boolean }

      if (res.isPresent) {
        // If file is already present, add it to the filesToStore array, but don't add it yet
        filesToStore.push(currentFile);
        excludedFileNames.push(currentFile.name);
      } else {
        // If the file is not present, directly add it to the list
        filesToExclude.push(currentFile);
        includedFileNames.push(currentFile.name);
      }
    }

    let allFiles = [...filesToExclude];
    // After the loop ends, check if there are any files to store
    if (filesToStore.length > 0) {
      const userChoice = window.confirm(
        `The following files already exist: ${excludedFileNames.join(
          ", "
        )}. Do you want to reupload them? (Click 'Cancel' to skip them.)`
      );

      if (userChoice) {
        allFiles = [...filesToExclude, ...filesToStore];
      }
    }

    if (allFiles.length === 0) {
      toast.info("No files to upload.");
      return;
    }

    setIsloading(true);
    const formdata = new FormData();

    for (const item of allFiles) {
      // Append the files to FormData
      formdata.append("file", item);
    }

    try {
      const response = await uploadData(formdata);

      // If the upload fails, trigger a toast and stop further actions
      if (!response || response.status !== 200) {
        console.log(response);
        const blob = new Blob([response.data], { type: "application/json" });
        const textData = await blob.text(); // Convert Blob to text
        const errorData = JSON.parse(textData); // Parse JSON if applicable

        console.error("Error Response Data:", errorData);
        throw new Error("Upload failed");
      }

      setIsUploadSuccessful(true); // Set upload success state to true

      // Handle file name extraction and download
      const contentDisposition = response.headers["content-disposition"];
      const matches = /filename="(.+)"/.exec(contentDisposition);
      const uploadedFileName =
        matches && matches[1] ? matches[1] : "download.pdf";
      const parts = uploadedFileName.split("-");
      const newFileName = `${parts[0]}-${parts[1]}.pdf`;

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName; // Use extracted filename or default
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Upload failed. Please try again.");
      setIsUploadSuccessful(false); // Reset the upload success state
    } finally {
      setIsloading(false);
    }
  };

  const AllUploadedData = allData.map((user, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 cursor-pointer">
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{user.User.email}</td>
      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => {
            if (isUploadSuccessful) {
              handleCsvDownload(user);
            } else {
              toast.warning("Upload is not successful, cannot download.");
            }
          }}
          disabled={!isUploadSuccessful}
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
          onClick={() => {
            if (isUploadSuccessful) {
              handledTextDownload(user);
            } else {
              toast.warning("Upload is not successful, cannot download.");
            }
          }}
          disabled={!isUploadSuccessful}
          className="flex items-center space-x-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.414c0-.53-.21-1.04-.586-1.414l-5-5C14.04 2.21 13.53 2 13 2H6z" />
              <path
                d="M14 3.414L18.586 8H14V3.414z"
                className="text-gray-300"
              />
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="white"
                className="pointer-events-none"
              >
                PDF
              </text>
            </svg>
          </div>
          <span className="text-sm font-medium"> PDF</span>
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <Sidebar />

      <div className=" items-center p-4 sm:ml-64 mt-10">
        <h1 className="text-3xl font-semibold mb-4">Serialization</h1>

        <div className="w-full">
          <form className="flex items-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 justify-center flex-col ">
            <div className="mb-4 items-center">
              <label
                className="block text-gray-700 text-xl font-bold mb-2"
                htmlFor="username"
              >
                Upload CSV
              </label>
              <UploadBtn onChange={handleUpload} resetSignal={resetSignal} />
            </div>
            <div className="flex items-center w-1/4 justify-between">
              <button
                className={`w-full py-2 px-4 rounded font-bold focus:outline-none focus:shadow-outline ${
                  isLoading
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
                type="button"
                onClick={handleUploadAndProcess}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Upload and Process"}
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
                    Pdf File
                  </th>
                </tr>
              </thead>
              {AllUploadedData.length !== 0 && <tbody>{AllUploadedData}</tbody>}
            </table>
          </div>
          {AllUploadedData.length === 0 && (
            <div className="px-4 py-6 w-full text-center text-gray-500 italic bg-gray-50 flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mb-2 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2C5.582 2 2 5.582 2 10s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM9 14l-4-4h3V6h2v4h3l-4 4z" />
              </svg>
              <p>No records available</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
};

export default Upload;
