import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import { downloadDataById, getAllData } from "../helper/Urlhelper";
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
const Dashboard = () => {
  const [allData, setAllData] = useState([]);
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
  }, []);
  const handledTextDownload = async (rowDetail) => {
    const date = rowDetail.createdAt;

    try {
      // console.log(rowDetail.id);

      const res = await downloadDataById(rowDetail.id, "text");

      // Extract file name from the "Content-Disposition" header
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "output.txt"; // Default file name
      console.log(res);
      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }

      // Extract the created date from the "Date" header
      const createdAt = date;
      let formattedDate = new Date(createdAt); // Convert the date to a Date object

      // Optionally format the date (e.g., 'YYYY-MM-DD')
      const formattedDateString = formattedDate.toISOString().split("T")[0];

      // You can now use the `formattedDateString` for any further use
      console.log("File Name:", fileName);
      console.log("Created At:", formattedDateString);

      // Convert response data to Blob
      const blob = new Blob([res.data], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Use the extracted file name
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
  const AllUploadedData = allData.map((user, index) => (
    <tr
      key={index}
      className="border-b hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        // handleUserModal(user);
      }}
    >
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

  return (
    <>
      <Sidebar />

      <div className="p-4 sm:ml-64  mt-10">
        <h1 className="text-3xl font-semibold mb-4">
          UPSC Serialization Dashboard
        </h1>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 my-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total File Uploaded</h2>
            <p className="text-2xl font-bold text-blue-600">1,245</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">All Users</h2>
            <p className="text-2xl font-bold text-green-600">325</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Active Users</h2>
            <p className="text-2xl font-bold text-purple-600">$12,345</p>
          </div>
        </div>
        {/* Recent Activity */}
        {/* Table for displaying users */}
        <div className="overflow-auto bg-white shadow-md rounded-lg max-h-[60vh] my-4">
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
            <tbody>{AllUploadedData}</tbody>
          </table>
        </div>
        <p className="text-center text-gray-500 text-xs">
          &copy;IOS.All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
