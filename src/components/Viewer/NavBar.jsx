/** @module NavBar */

import React, { useEffect, useMemo, useState } from "react";

import {
  faFilter,
  faGuitar,
  faHome,
  faImages,
  faIndustry,
  faList,
  faUser,
  faUserGear
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Collapse,
  Nav,
  NavItem,
  Navbar,
  NavbarBrand,
  NavbarToggler
} from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import { clearMessage as clearBrandMessage } from "../../store/slices/brandsSlice";
import { clearMessage as clearGalleryMessage } from "../../store/slices/gallerySlice";
import { clearMessage as clearGuitarMessage } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { getUserName } from "../../utils/utils";

import FiltersModal from "../Modals/FiltersModal";
import ManageUserModal from "../Modals/ManageUserModal";
import UserLoginModal from "../Modals/UserLoginModal";

const NavBar = () => {
  const dispatch = useDispatch();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isManageUserModalOpen, setIsManageUserModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { message: guitarsMessage, selected: selectedGuitar } =
    useSelector(state => state.guitarsState) ?? {};
  const { message: brandsMessage } =
    useSelector(state => state.brandsState) ?? {};
  const { message: galleryMessage } =
    useSelector(state => state.galleryState) ?? {};
  const { user } = useSelector(state => state.userState) ?? {};
  const { filters } = useSelector(state => state.filtersState) ?? {};

  const hasEditGuitarPermissions = usePermissions("EDIT_GUITAR");

  const numberOfAppliedFilters = useMemo(
    () =>
      Object.keys(filters ?? {}).filter(
        filter =>
          filters[filter] !== types.filtersState.defaults.filters[filter]
      ).length,
    [filters]
  );

  useEffect(() => {
    if (!_.isEmpty(guitarsMessage)) {
      setTimeout(() => {
        dispatch(clearGuitarMessage());
      }, 3000);
    }
  }, [dispatch, guitarsMessage]);

  useEffect(() => {
    if (!_.isEmpty(brandsMessage)) {
      setTimeout(() => {
        dispatch(clearBrandMessage());
      }, 3000);
    }
  }, [brandsMessage, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(brandsMessage)) {
      setTimeout(() => {
        dispatch(clearBrandMessage());
      }, 3000);
    }
  }, [brandsMessage, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(galleryMessage)) {
      setTimeout(() => {
        dispatch(clearGalleryMessage());
      }, 3000);
    }
  }, [galleryMessage, dispatch]);

  const toggle = () => setIsHamburgerOpen(!isHamburgerOpen);
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };
  const toggleManageUserModal = () => {
    setIsManageUserModalOpen(!isManageUserModalOpen);
  };

  return (
    <Navbar color="dark" dark expand="sm" fixed="top">
      <NavbarBrand href="/">Brian's Guitars</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isHamburgerOpen} navbar>
        <Nav className="me-auto w-100" navbar>
          <NavItem>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/guitarlist">
              <FontAwesomeIcon icon={faList} /> Guitar List
            </Link>
          </NavItem>
          {hasEditGuitarPermissions && (
            <NavItem>
              <Link to="/addguitar">
                <FontAwesomeIcon icon={faGuitar} /> Add Guitar
              </Link>
            </NavItem>
          )}
          <NavItem>
            <Link to="/brands">
              <FontAwesomeIcon icon={faIndustry} /> Brands
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/gallery">
              <FontAwesomeIcon icon={faImages} /> Image Gallery
            </Link>
          </NavItem>
          <NavItem>
            <Link onClick={toggleFilterModal}>
              <FontAwesomeIcon icon={faFilter} /> Filters{" "}
              {Boolean(numberOfAppliedFilters) && (
                <Badge color="warning">{numberOfAppliedFilters}</Badge>
              )}
            </Link>
          </NavItem>
          {selectedGuitar && (
            <NavItem>
              <Link to={`/guitar/${selectedGuitar}`}>
                <FontAwesomeIcon icon={faGuitar} /> {selectedGuitar}
              </Link>
            </NavItem>
          )}
          {user._id ? (
            <NavItem className="ms-auto">
              <Link onClick={toggleManageUserModal}>
                <FontAwesomeIcon icon={faUserGear} /> {getUserName(user)}
              </Link>
            </NavItem>
          ) : (
            <NavItem className="ms-auto">
              <Link onClick={toggleLoginModal}>
                <FontAwesomeIcon icon={faUser} /> Login
              </Link>
            </NavItem>
          )}
        </Nav>
      </Collapse>
      <Alert
        className="my-0 mx-1"
        color={guitarsMessage?.type}
        isOpen={!_.isEmpty(guitarsMessage)}
        toggle={() => dispatch(clearGuitarMessage())}
      >
        {guitarsMessage?.text}
      </Alert>
      <Alert
        className="my-0 mx-1"
        color={brandsMessage?.type}
        isOpen={!_.isEmpty(brandsMessage)}
        toggle={() => dispatch(clearBrandMessage())}
      >
        {brandsMessage?.text}
      </Alert>
      <Alert
        className="my-0 mx-1"
        color={galleryMessage?.type}
        isOpen={!_.isEmpty(galleryMessage)}
        toggle={() => dispatch(clearGalleryMessage())}
      >
        {galleryMessage?.text}
      </Alert>
      <FiltersModal
        isModalOpen={isFilterModalOpen}
        toggle={toggleFilterModal}
      />
      <UserLoginModal
        isModalOpen={isLoginModalOpen}
        toggle={toggleLoginModal}
      />
      <ManageUserModal
        isModalOpen={isManageUserModalOpen}
        toggle={toggleManageUserModal}
      />
    </Navbar>
  );
};

export default NavBar;
