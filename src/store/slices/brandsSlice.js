/** @module brandsSlice */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import { enqueueSnackbar } from "notistack";

import * as types from "../../types/types";
import { apiURL } from "../../utils/constants";

const initialState = types.brandsState.defaults;

/**
 * @function getBrands
 * @description Makes API call to retrieve brands from DB
 */
export const getBrands = createAsyncThunk("brands/getBrands", () => {
  return axios.get(`${apiURL}/getbrands`).then(response => {
    return response.data;
  });
});

/**
 * @function addBrand
 * @description Makes API call add new brand to DB
 * @param {Object} brandObject
 */
export const addBrand = createAsyncThunk("brands/saveBrand", brandObject => {
  return axios
    .post(`${apiURL}/savebrand`, brandObject, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(response => {
      enqueueSnackbar(response.data.message);
      return response.data;
    });
});

/**
 * @function updateBrand
 * @description Makes API call update existing brand in DB
 * @param {Object} brandObject
 */
export const updateBrand = createAsyncThunk(
  "brands/updatebrand",
  brandObject => {
    return axios
      .put(`${apiURL}/updatebrand/${brandObject._id}`, brandObject, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        enqueueSnackbar(response.data.message);
        return response;
      });
  }
);

/**
 * @function deleteBrand
 * @description Makes API call remove existing brand from DB
 * @param {Object} brandObject
 */
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  brandObject => {
    return axios
      .delete(`${apiURL}/deletebrand/${brandObject._id}`, {
        data: brandObject
      })
      .then(response => {
        enqueueSnackbar(response.data.message);
        return response.data;
      });
  }
);

const brandsSlice = createSlice({
  name: "brandsState",
  initialState,
  reducers: {
    clearMessage(state, action) {
      state.message = {};
    }
  },
  extraReducers: builder => {
    // GET
    builder.addCase(getBrands.pending, state => {
      state.loading = true;
    });
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.loading = false;
      state.list = _.orderBy(action.payload.data, "name");
    });
    builder.addCase(getBrands.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // POST
    builder.addCase(addBrand.pending, state => {
      state.loading = true;
    });
    builder.addCase(addBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.list = [{ ...action.payload.data, isNew: true }, ...state.list];
    });
    builder.addCase(addBrand.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // PUT
    builder.addCase(updateBrand.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateBrand.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload.data._id);
      list[idx] = action.payload.data;
      state.loading = false;
      state.list = list;
    });
    builder.addCase(updateBrand.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
    // DELETE
    builder.addCase(deleteBrand.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteBrand.fulfilled, (state, action) => {
      const list = state.list;
      const idx = list.map(item => item._id).indexOf(action.payload.data._id);
      list.splice(idx, 1);
      state.loading = false;
      state.list = list;
    });
    builder.addCase(deleteBrand.rejected, (state, action) => {
      state.loading = false;
      state.message = {
        type: "danger",
        text: action.error.message
      };
    });
  }
});

export const { clearMessage } = brandsSlice.actions;

export default brandsSlice.reducer;
