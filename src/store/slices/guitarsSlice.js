/** @module guitarsSlice */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import * as types from "../../types/types";
import { apiURL } from "../../utils/constants";

const initialState = types.guitarsState.defaults;

/**
 * @function getGuitars
 * @description Makes API call to retrieve guitars from DB
 */
export const getGuitars = createAsyncThunk("guitars/getGuitars", () => {
  return axios.get(`${apiURL}/get`).then(response => {
    return response.data;
  });
});

/**
 * @function addGuitar
 * @description Makes API call add new guitar to DB
 * @param {Object} guitarObject
 */
export const addGuitar = createAsyncThunk("guitars/addGuitar", guitarObject => {
  return axios.post(`${apiURL}/save`, guitarObject).then(response => {
    enqueueSnackbar(response.data.message);
    return response.data;
  });
});

/**
 * @function updateGuitar
 * @description Makes API call update existing guitar in DB
 * @param {Object} guitarObject
 */
export const updateGuitar = createAsyncThunk(
  "guitars/updateGuitar",
  guitarObject => {
    return axios
      .put(`${apiURL}/update/${guitarObject._id}`, guitarObject)
      .then(response => {
        enqueueSnackbar(response.data.message);
        return {
          ...response.data,
          ...guitarObject
        };
      });
  }
);

/**
 * @function removeGuitar
 * @description Makes API call remove existing guitar from DB
 * @param {string} id
 */
export const removeGuitar = createAsyncThunk("guitars/removeGuitar", id => {
  return axios.delete(`${apiURL}/delete/${id}`).then(response => {
    enqueueSnackbar(response.data.message);
    return response.data;
  });
});

const guitarsSlice = createSlice({
  name: "guitarsState",
  initialState,
  reducers: {
    clearMessage(state, action) {
      state.message = {};
    },
    updateSelected(state, action) {
      state.selected = action.payload;
    }
  },
  extraReducers: builder => {
    // GET
    builder.addCase(getGuitars.pending, state => {
      state.loading = true;
    });
    builder.addCase(getGuitars.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data;
    });
    builder.addCase(getGuitars.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // POST
    builder.addCase(addGuitar.pending, state => {
      state.loading = true;
    });
    builder.addCase(addGuitar.fulfilled, (state, action) => {
      state.loading = false;
      state.list = [{ ...action.payload?.data, isNew: true }, ...state.list];
    });
    builder.addCase(addGuitar.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // PUT
    builder.addCase(updateGuitar.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateGuitar.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload?.data._id);
      list[idx] = action.payload;
      state.loading = false;
      state.list = list;
    });
    builder.addCase(updateGuitar.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // DELETE
    builder.addCase(removeGuitar.pending, state => {
      state.loading = true;
    });
    builder.addCase(removeGuitar.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload?.data._id);
      list.splice(idx, 1);
      state.loading = false;
      state.list = list;
    });
    builder.addCase(removeGuitar.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
  }
});

export const { clearMessage, updateSelected } =
  guitarsSlice.actions;

export default guitarsSlice.reducer;
