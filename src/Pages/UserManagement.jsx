import React from "react";
import Sidebar from "../component/sidebar";
import { useState } from "react";
import { useEffect } from "react";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../helper/Urlhelper";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (Array.isArray(res)) {
          setUsers(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [isModalOpen, profileModal]);

  useEffect(() => {
    if (currentUserDetail) {
      setProfileModal(true);
      console.log(emailRef);
      //   emailRef.current.value = currentUserDetail.email;
      //   passwordRef.current.value = currentUserDetail.password;
      //   userNameRef.current.value = currentUserDetail.username;
    }
  }, [currentUserDetail]);
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSuspendUser = async () => {
    const result = window.confirm(
      "Are you sure you want the user to be suspended?"
    );
    if (!result) {
      return;
    }
    const userId = currentUserDetail.id;
    const obj = { isRestricted: true };
    try {
      const res = await updateUserById(userId, obj);
      setProfileModal(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnSuspendUser = async () => {
    const result = window.confirm(
      "Are you sure you want the user to be un-suspended?"
    );
    if (!result) {
      return;
    }
    const userId = currentUserDetail.id;
    const obj = { isRestricted: false };
    try {
      const res = await updateUserById(userId, obj);
      setProfileModal(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUserModal = async (userDetail) => {
    try {
      const res = await getUserById(userDetail.id);

      setEmail(res.email);
      setUserName(res.username);
      setRole(res.role);
      console.log(res);
      setCurrentUserDetail(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    const userId = currentUserDetail.id;
    try {
      const res = await deleteUserById(userId);
      console.log(res);
      setProfileModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Handle adding a new user
  const handleAddUser = async () => {
    // setUsers([...users, newUser]);

    // setNewUser({ name: "", email: "", password: "" }); // Reset the form
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const userName = userNameRef.current.value;
    if (!userName) {
      toast.warn("Username cannot be empty");
      return;
    }

    if (!email) {
      toast.warn("Email cannot be empty");
      return;
    } else if (!password) {
      toast.warn("Password  cannot be empty");
      return;
    } else if (!userName) {
      toast.warn("Username cannot be empty");
    } else if (!role) {
      console.log(role);
      toast.warn("Select role for the user");
    }
    const obj = {
      username: userName,
      email: email,
      password: password,
      role: role,
    };

    try {
      const res = await createUser(obj);
      console.log(res);
      if (res?.isCreated) {
        toast.success("User created successfully");
        setIsModalOpen(false);
      } else {
        toast.error(res?.data.message);
      }

      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    }
  };

  const AllUsers = users.map((user, index) => (
    <tr
      key={index}
      className="border-b hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        handleUserModal(user);
      }}
    >
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{user.username}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.role}</td>
      <td className="px-4 py-2">{user.isRestricted ? "Inactive" : "Active"}</td>
      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
    </tr>
  ));
  return (
    <>
      <Sidebar />

      <div className="p-4 sm:ml-64 mt-10  flex flex-col">
        <div className="flex justify-between items-center align-middle">
          <h1 className="text-3xl font-semibold mb-4">User Management</h1>
          {/* Create User Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create User
          </button>
        </div>

        {/* Table for displaying users */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[50vh]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Sl No.
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  User Name
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Email
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Role
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Status
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>{AllUsers}</tbody>
          </table>
        </div>

        {/* Modal for adding a new user */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Create User</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  ref={userNameRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(event) => {
                      const selectedRole = event.target.value;
                      setRole(selectedRole);
                    }}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleAddUser}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add User
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {profileModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Update User</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userName}
                  onChange={(event) => {
                    setUserName(event.target.value);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(event) => {
                      const selectedRole = event.target.value;

                      setRole(selectedRole);
                    }}
                    value={role}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <button
                  onClick={handleAddUser}
                  className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Details
                </button>
              </div>
              <div className="flex justify-between">
                {/* <button
                  onClick={handleDeleteUser}
                  className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Remove
                </button> */}
                {currentUserDetail.isRestricted ? (
                  <button
                    onClick={handleUnSuspendUser}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  >
                    Un Suspend
                  </button>
                ) : (
                  <button
                    onClick={handleSuspendUser}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  >
                    Suspend
                  </button>
                )}

                <button
                  onClick={() => setProfileModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
        <p className="text-center bottom-2 text-gray-500 text-xs">
          &copy;IOS.All rights reserved.
        </p>
      </div>
    </>
  );
};

export default UserManagement;
