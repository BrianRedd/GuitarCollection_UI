import React, { useEffect, useRef } from "react";

import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

import { getBrands } from "../store/slices/brandsSlice";
import { getGallery } from "../store/slices/gallerySlice";
import { getGuitars, updateSelected } from "../store/slices/guitarsSlice";

import { getUser, writeUser } from "../store/slices/userSlice";
import { cookieFunctions } from "../utils/utils";

import { toggleToggle } from "../store/slices/toggleSlice";
import Brands from "./Brands/Brands";
import Gallery from "./Gallery/Gallery";
import GuitarDetail from "./GuitarDetail/GuitarDetail";
import GuitarList from "./GuitarList/GuitarList";
import GuitarList2 from "./GuitarList/GuitarList2";
import Home from "./Viewer/Home";
import Modals from "./Viewer/Modals";
import NavBar from "./Viewer/NavBar";

/**
 * @function Main
 * @returns {React.ReactNode}
 */
const Main = () => {
  const dispatch = useDispatch();

  const { list: guitars } = useSelector((state) => state.guitarsState) ?? {};

  const sectionRefs = [
    useRef(null), // 0 home
    useRef(null), // 1 guitarList
    useRef(null), // 2 gallery
    useRef(null), // 3 brands
    useRef(null) // 4 detail
  ];

  useEffect(() => {
    dispatch(getGuitars()).then((response) => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getBrands()).then((response) => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getGallery()).then((response) => {
      enqueueSnackbar(response.payload.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginCookie = cookieFunctions.getCookie("bgln");

  useEffect(() => {
    if (loginCookie) {
      const loginArray = loginCookie.split("|");
      dispatch(getUser(loginArray?.[0])).then((response) => {
        if (response?.payload?.data?.password === loginArray?.[1]) {
          dispatch(writeUser(response.payload.data));
        } else {
          dispatch(writeUser({}));
          cookieFunctions.setCookie("bgln", "");
        }
      });
    }
  }, [dispatch, loginCookie]);

  const scrollTo = (sectionIdx) => {
    window.scrollTo({
      top: sectionRefs[sectionIdx].current.offsetTop - 80,
      behavior: "smooth"
    });
  };

  /**
   * @function selectAndGoToGuitar
   * @description selects guitar and redirects to details tab
   * @param {string} id
   */
  const selectAndGoToGuitar = (id) => {
    const selectedGuitar = guitars?.find(
      (guitar) => guitar._id === id || guitar.name === id
    );
    window.location.hash = `#${id}`;
    dispatch(updateSelected(selectedGuitar?.name ?? id));
    scrollTo(4);
  };

  const editGuitar = (id) => {
    window.location.hash = `#${id}`;
    dispatch(updateSelected(id));
    dispatch(toggleToggle({ id: "editGuitarModal" }));
  };

  return (
    <div className="App" data-test="component-app">
      <NavBar scrollTo={scrollTo} selectAndGoToGuitar={selectAndGoToGuitar} />
      <div className="app-body">
        <div ref={sectionRefs[0]} className="pt-1">
          <Home selectAndGoToGuitar={selectAndGoToGuitar} />
        </div>
        <hr />
        <div>
          <GuitarList2
            selectAndGoToGuitar={selectAndGoToGuitar}
            editGuitar={editGuitar}
          />
        </div>
        <div ref={sectionRefs[1]}>
          <GuitarList selectAndGoToGuitar={selectAndGoToGuitar} editGuitar={editGuitar} />
        </div>
        <hr />
        <div ref={sectionRefs[3]}>
          <Brands scrollTo={scrollTo} />
        </div>
        <hr />
        <div ref={sectionRefs[4]}>
          <GuitarDetail
            selectAndGoToGuitar={selectAndGoToGuitar}
            editGuitar={editGuitar}
          />
        </div>
        <hr />
        <div ref={sectionRefs[2]}>
          <Gallery selectAndGoToGuitar={selectAndGoToGuitar} />
        </div>
      </div>
      <Modals />
    </div>
  );
};

export default Main;
