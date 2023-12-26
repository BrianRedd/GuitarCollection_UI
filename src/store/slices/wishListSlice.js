/** @module wishListSlice */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import * as types from "../../types/types";
import { apiURL } from "../../utils/constants";

const initialState = types.wishListState.defaults;

/**
 * @function getWishList
 * @description Makes API call to retrieve wishList from DB
 */
export const getWishList = createAsyncThunk("wishList/getWishList", () => {
  return axios.get(`${apiURL}/getWishList`).then((response) => {
    return response.data;
  });
});

/**
 * @function addWishListItem
 * @description Makes API call add new guitar to DB
 * @param {Object} guitarObject
 */
export const addWishListItem = createAsyncThunk("wishList/addWishListItem", (guitarObject) => {
  return axios.post(`${apiURL}/saveWishList`, guitarObject).then((response) => {
    enqueueSnackbar(response.data.message);
    return response.data;
  });
});

/**
 * @function updateWishListItem
 * @description Makes API call update existing guitar in DB
 * @param {Object} guitarObject
 */
export const updateWishListItem = createAsyncThunk("wishList/updateWishListItem", (guitarObject) => {
  return axios
    .put(`${apiURL}/updateWishList/${guitarObject._id}`, guitarObject)
    .then((response) => {
      enqueueSnackbar(response.data.message);
      return {
        ...response.data,
        ...guitarObject
      };
    });
});

/**
 * @function removeWishListItem
 * @description Makes API call remove existing guitar from DB
 * @param {string} id
 */
export const removeWishListItem = createAsyncThunk("wishList/removeWishListItem", (id) => {
  return axios.delete(`${apiURL}/deleteWishList/${id}`).then((response) => {
    enqueueSnackbar(response.data.message);
    return response.data;
  });
});

const wishListSlice = createSlice({
  name: "wishListState",
  initialState,
  reducers: {
    clearMessage(state, action) {
      state.message = {};
    }
  },
  extraReducers: (builder) => {
    // GET
    builder.addCase(getWishList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWishList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data;
    });
    builder.addCase(getWishList.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // POST
    builder.addCase(addWishListItem.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addWishListItem.fulfilled, (state, action) => {
      state.loading = false;
      state.list = [{ ...action.payload?.data, isNew: true }, ...state.list];
    });
    builder.addCase(addWishListItem.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // PUT
    builder.addCase(updateWishListItem.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateWishListItem.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map((item) => item._id).indexOf(action.payload?.data._id);
      list[idx] = action.payload;
      state.loading = false;
      state.list = list;
    });
    builder.addCase(updateWishListItem.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // DELETE
    builder.addCase(removeWishListItem.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeWishListItem.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map((item) => item._id).indexOf(action.payload?.data._id);
      list.splice(idx, 1);
      state.loading = false;
      state.list = list;
    });
    builder.addCase(removeWishListItem.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
  }
});

export const { clearMessage } = wishListSlice.actions;

export default wishListSlice.reducer;
