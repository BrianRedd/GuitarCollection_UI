import React from "react";

import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Spinner } from "reactstrap";

import NavBar from "./NavBar";

const Layout = () => {
  const { loading: guitarLoading } =
    useSelector(state => state.guitarsState) ?? {};
  const { loading: brandsLoading } =
    useSelector(state => state.brandsState) ?? {};

  return (
    <React.Fragment>
      <NavBar />
      <div className="app-body">
        {(guitarLoading || brandsLoading) && (
          <div className="position-absolute p-auto d-flex w-100 justify-content-center">
            <Spinner
              color="success"
              style={{
                marginTop: "100px",
                height: "5rem",
                width: "5rem"
              }}
            >
              Loading...
            </Spinner>
          </div>
        )}
        <Outlet />
      </div>
    </React.Fragment>
  );
};

export default Layout;
