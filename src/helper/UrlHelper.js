import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const URL = "http://192.168.1.11:9000";
export const login = async (body) => {
  //   const token = localStorage.getItem("token");
  //   const userInfo = jwtDecode(token);
  //   const userID = userInfo.userId;
  try {
    const response = await axios.post(`${URL}/api/users/login`, { ...body });
    return response; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/api/users/getall`,

      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const createUser = async (body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/api/users/create`,
      { ...body },

      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getUserById = async (id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/api/users/get/${id}`, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const updateUserById = async (id, body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.put(
      `${URL}/api/users/update/${id}`,
      { ...body },
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const deleteUserById = async (id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.delete(`${URL}/api/users/remove/${id}`, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const uploadData = async (formdata) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/api/serializes/upload`,
      formdata,
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};
