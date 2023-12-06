import React, { useEffect, useRef } from "react";

import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { getBrands } from "../store/slices/brandsSlice";
import { getGallery } from "../store/slices/gallerySlice";
import { getGuitars } from "../store/slices/guitarsSlice";

import { getUser, writeUser } from "../store/slices/userSlice";
import { cookieFunctions } from "../utils/utils";

import Brands from "./Brands/Brands";
import Gallery from "./Gallery/Gallery";
import GuitarDetail from "./GuitarDetail/GuitarDetail";
import GuitarList from "./GuitarList/GuitarList";
import Home from "./Viewer/Home";
import NavBar from "./Viewer/NavBar";

/**
 * @function Main
 * @returns {React.ReactNode}
 */
const Main = () => {
  const dispatch = useDispatch();

  const sectionRefs = [
    useRef(null), // 0 home
    useRef(null), // 1 guitarList
    useRef(null), // 2 gallery
    useRef(null), // 3 brands
    useRef(null) // 4 detail
  ];

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

  const hash = window.location.hash;

  const scrollTo = sectionIdx => {
    window.scrollTo({
      top: sectionRefs[sectionIdx].current.offsetTop - 50,
      behavior: "smooth"
    });
  };

  return (
    <BrowserRouter>
      <div className="App" data-test="component-app">
        <NavBar scrollTo={scrollTo} />
        <div className="app-body">
          <div ref={sectionRefs[0]}>
            <Home />
          </div>
          <hr />
          <div ref={sectionRefs[1]}>
            <GuitarList />
          </div>
          <hr />
          <div ref={sectionRefs[2]}>
            <Gallery />
          </div>
          <hr />
          <div ref={sectionRefs[3]}>
            <Brands />
          </div>
          <hr />
          {hash && (
            <React.Fragment>
              <hr />
              <div ref={sectionRefs[3]}>
                <GuitarDetail hash={hash?.slice(1)} ref={sectionRefs[4]} />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Main;
