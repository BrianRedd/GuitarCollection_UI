/** @module userSlice */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import * as types from "../../types/types";
import { apiURL } from "../../utils/constants";

const initialState = types.userState.defaults;

/**
 * @function getUser
 * @description Makes API call to retrieve user from DB
 * @param {string} username
 */
export const getUser = createAsyncThunk("user/getUser", username => {
  return axios.get(`${apiURL}/getuser/${username}`).then(response => {
    return response.data;
  });
});

/**
 * @function addUser
 * @description Makes API call add new user to DB
 * @param {Object} userObject
 */
export const addUser = createAsyncThunk("user/saveUser", userObject => {
  return axios.post(`${apiURL}/saveuser`, userObject).then(response => {
    enqueueSnackbar(response.data.message);
    return response.data;
  });
});

/**
 * @function updateUser
 * @description Makes API call update existing user in DB
 * @param {Object} userObject
 */
export const updateUser = createAsyncThunk("user/updateUser", userObject => {
  return axios
    .put(`${apiURL}/updateuser/${userObject._id}`, userObject)
    .then(response => {
      enqueueSnackbar(response.data.message);
      return response.data;
    });
});

/**
 * @function deleteUser
 * @description Makes API call remove existing user from DB
 * @param {Object} userObject
 */
export const deleteUser = createAsyncThunk("user/deleteUser", userObject => {
  return axios
    .delete(`${apiURL}/deleteuser/${userObject._id}`, {
      data: userObject
    })
    .then(response => {
      enqueueSnackbar(response.data.message);
      return response.data;
    });
});

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    writeUser(state, action) {
      state.user = action.payload;
    },
    clearMessage(state, action) {
      state.message = {};
    }
  },
  extraReducers: builder => {
    // GET
    builder.addCase(getUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.user = {};
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // POST
    builder.addCase(addUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // PUT
    builder.addCase(updateUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // DELETE
    builder.addCase(deleteUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {};
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
  }
});

export const { clearMessage, writeUser } = userSlice.actions;

export default userSlice.reducer;
