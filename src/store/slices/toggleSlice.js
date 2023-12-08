/** @module toggleSlice */

import { createSlice } from "@reduxjs/toolkit";

import * as types from "../../types/types";

const initialState = types.toggleState.defaults;

const toggleSlice = createSlice({
  name: "toggleState",
  initialState,
  reducers: {
    toggleToggle(state, action) {
      const updatedToggles = [...state.toggles];
      const idx = (state.toggles ?? [])
        .map(toggle => toggle?.id)
        ?.indexOf(action.payload?.id);
      if (idx === -1) {
        updatedToggles.push(action.payload);
      } else {
        updatedToggles.splice(idx, 1);
      }
      state.toggles = updatedToggles;
    }
  }
});

export const { toggleToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
