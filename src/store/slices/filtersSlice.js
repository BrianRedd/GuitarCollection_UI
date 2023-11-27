/** @module filtersSlice */

import { createSlice } from "@reduxjs/toolkit";

import * as types from "../../types/types";

const initialState = types.filtersState.defaults;

const filtersSlice = createSlice({
  name: "filtersState",
  initialState,
  reducers: {
    writeFilters(state, action) {
      state.filters = action.payload;
    }
  }
});

export const { writeFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
