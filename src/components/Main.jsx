import React, { useEffect } from "react";

import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { getBrands } from "../store/slices/brandsSlice";
import { getGallery } from "../store/slices/gallerySlice";
import { getGuitars } from "../store/slices/guitarsSlice";

import { getUser, writeUser } from "../store/slices/userSlice";
import { cookieFunctions } from "../utils/utils";
import Brands from "./Brands/Brands";
import AddGuitar from "./Editors/AddGuitar";
import EditGuitar from "./Editors/EditGuitar";
import Gallery from "./Gallery/Gallery";
import GuitarDetail from "./GuitarDetail/GuitarDetail";
import GuitarList from "./GuitarList/GuitarList";
import Home from "./Viewer/Home";
import Layout from "./Viewer/Layout";

/**
 * @function Main
 * @returns {React.ReactNode}
 */
const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGuitars()).then(response => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getBrands()).then(response => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getGallery()).then(response => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginCookie = cookieFunctions.getCookie("bgln");

  useEffect(() => {
    if (loginCookie) {
      const loginArray = loginCookie.split("|");
      dispatch(getUser(loginArray?.[0])).then(response => {
        if (response?.payload?.data?.password === loginArray?.[1]) {
          dispatch(writeUser(response.payload.data));
        } else {
          dispatch(writeUser({}));
          cookieFunctions.setCookie("bgln", "");
        }
      });
    }
  }, [dispatch, loginCookie]);

  return (
    <BrowserRouter>
      <div className="App" data-test="component-app">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="guitarlist" element={<GuitarList />} />
            <Route path="addguitar" element={<AddGuitar />} />
            <Route path="editguitar" element={<EditGuitar />} />
            <Route path="editguitar/:id" element={<EditGuitar />} />
            <Route path="brands" element={<Brands />} />
            <Route path="guitar" element={<GuitarDetail />} />
            <Route path="guitar/:id" element={<GuitarDetail />} />
            <Route path="gallery" element={<Gallery />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Main;
