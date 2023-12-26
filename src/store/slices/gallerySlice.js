/** @module gallerySlice */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import { enqueueSnackbar } from "notistack";

import * as types from "../../types/types";
import { apiURL } from "../../utils/constants";

const initialState = types.galleryState.defaults;

/**
 * @function getGallery
 * @description Makes API call to retrieve gallery from DB
 */
export const getGallery = createAsyncThunk("gallery/getGallery", () => {
  return axios.get(`${apiURL}/getgallery`).then(response => {
    return response.data;
  });
});

/**
 * @function addGalleryImage
 * @description Makes API call add new brand to DB
 * @param {Object} imageObject
 */
export const addGalleryImage = createAsyncThunk(
  "gallery/saveImage",
  imageObject => {
    return axios
      .post(`${apiURL}/saveimage`, imageObject, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        enqueueSnackbar(response.data.message);
        return response.data;
      });
  }
);

/**
 * @function updateGalleryImage
 * @description Makes API call update existing brand in DB
 * @param {Object} imageObject
 */
export const updateGalleryImage = createAsyncThunk(
  "gallery/updateimage",
  imageObject => {
    return axios
      .put(`${apiURL}/updateimage/${imageObject._id}`, imageObject, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        enqueueSnackbar(response.data.message);
        return response.data;
      });
  }
);

/**
 * @function deleteGalleryImage
 * @description Makes API call remove existing brand from DB
 * @param {Object} imageObject
 */
export const deleteGalleryImage = createAsyncThunk(
  "gallery/deleteImage",
  imageObject => {
    return axios
      .delete(`${apiURL}/deleteimage/${imageObject._id}`, {
        data: imageObject
      })
      .then(response => {
        enqueueSnackbar(response.data.message);
        return response.data;
      });
  }
);

const gallerySlice = createSlice({
  name: "galleryState",
  initialState,
  reducers: {
    clearMessage(state, action) {
      state.message = {};
    }
  },
  extraReducers: builder => {
    // GET
    builder.addCase(getGallery.pending, state => {
      state.loading = true;
    });
    builder.addCase(getGallery.fulfilled, (state, action) => {
      state.loading = false;
      state.list = _.orderBy(action.payload.data, "name");
    });
    builder.addCase(getGallery.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // POST
    builder.addCase(addGalleryImage.pending, state => {
      state.loading = true;
    });
    builder.addCase(addGalleryImage.fulfilled, (state, action) => {
      state.loading = false;
      state.list = [{ ...action.payload.data, isNew: true }, ...state.list];
    });
    builder.addCase(addGalleryImage.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // PUT
    builder.addCase(updateGalleryImage.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateGalleryImage.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload.data._id);
      list[idx] = action.payload.data;
      state.loading = false;
      state.list = list;
    });
    builder.addCase(updateGalleryImage.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // DELETE
    builder.addCase(deleteGalleryImage.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteGalleryImage.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload.data._id);
      list.splice(idx, 1);
      state.loading = false;
      state.list = list;
    });
    builder.addCase(deleteGalleryImage.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
  }
});

export const { clearMessage } = gallerySlice.actions;

export default gallerySlice.reducer;
