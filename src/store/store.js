/** @module store */

import { configureStore } from "@reduxjs/toolkit";

import brandsReducer from "./slices/brandsSlice";
import filtersReducer from "./slices/filtersSlice";
import galleryReducer from "./slices/gallerySlice";
import guitarsReducer from "./slices/guitarsSlice";
import toggleReducer from "./slices/toggleSlice";
import userReducer from "./slices/userSlice";
import wishListReducer from "./slices/wishListSlice";

const store = configureStore({
  reducer: {
    brandsState: brandsReducer,
    filtersState: filtersReducer,
    galleryState: galleryReducer,
    guitarsState: guitarsReducer,
    toggleState: toggleReducer,
    userState: userReducer,
    wishListState: wishListReducer
  }
});

export default store;
