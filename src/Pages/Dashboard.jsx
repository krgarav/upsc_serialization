import React from "react";
import Sidebar from "../component/sidebar";

const Dashboard = () => {
  return (
    <>
      <Sidebar />

      <div className="p-4 sm:ml-64  mt-10">
        <h1 className="text-3xl font-semibold mb-4">
          UPSC Serialization Dashboard
        </h1>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold text-blue-600">1,245</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">New Users</h2>
            <p className="text-2xl font-bold text-green-600">325</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl font-bold text-purple-600">$12,345</p>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Added a new product</span>
              <span className="text-gray-500">1 hour ago</span>
            </li>
            <li className="flex justify-between">
              <span>Updated pricing for item #2</span>
              <span className="text-gray-500">2 hours ago</span>
            </li>
            <li className="flex justify-between">
              <span>Completed a sale of 10 items</span>
              <span className="text-gray-500">4 hours ago</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
