/* eslint-disable jsx-a11y/anchor-is-valid */
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
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
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
import { GUITAR_PERM } from "../data/constants";

import AddGuitarModal from "../Editors/AddGuitarModal";
import FiltersModal from "../Modals/FiltersModal";
import ManageUserModal from "../Modals/ManageUserModal";
import UserLoginModal from "../Modals/UserLoginModal";

const NavBar = props => {
  const { scrollTo, selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isManageUserModalOpen, setIsManageUserModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddGuitarModalOpen, setIsAddGuitarModalOpen] = useState(false);

  const { message: guitarsMessage, selected: selectedGuitar } =
    useSelector(state => state.guitarsState) ?? {};
  const { message: brandsMessage } =
    useSelector(state => state.brandsState) ?? {};
  const { message: galleryMessage } =
    useSelector(state => state.galleryState) ?? {};
  const { user } = useSelector(state => state.userState) ?? {};
  const { filters } = useSelector(state => state.filtersState) ?? {};

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

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
  const toggleAddGuitarModal = () => {
    setIsAddGuitarModalOpen(!isAddGuitarModalOpen);
  };

  return (
    <Navbar color="dark" dark expand="lg" fixed="top">
      <NavbarBrand href="/">Brian's Guitars</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isHamburgerOpen} navbar>
        <Nav className="me-auto w-100" navbar>
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(0);
            }}
          >
            <FontAwesomeIcon icon={faHome} /> Home
          </NavItem>
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(1);
            }}
          >
            <FontAwesomeIcon icon={faList} /> Guitar List
          </NavItem>
          {hasEditGuitarPermissions && (
            <NavItem
              onClick={() => {
                toggle();
                toggleAddGuitarModal();
              }}
            >
              <FontAwesomeIcon icon={faGuitar} /> Add Instrument
            </NavItem>
          )}
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(2);
            }}
          >
            <FontAwesomeIcon icon={faImages} /> Image Gallery
          </NavItem>
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(3);
            }}
          >
            <FontAwesomeIcon icon={faIndustry} /> Brands
          </NavItem>
          <NavItem
            onClick={() => {
              toggleFilterModal();
              toggle();
            }}
          >
            <FontAwesomeIcon icon={faFilter} /> Filters{" "}
            {Boolean(numberOfAppliedFilters) && (
              <Badge color="warning">{numberOfAppliedFilters}</Badge>
            )}
          </NavItem>
          {selectedGuitar && (
            <NavItem
              onClick={() => {
                toggle();
                scrollTo(4);
              }}
            >
              <FontAwesomeIcon icon={faGuitar} /> {selectedGuitar}
            </NavItem>
          )}
          {user._id ? (
            <NavItem
              className="ms-auto"
              onClick={() => {
                toggleManageUserModal();
                toggle();
              }}
            >
              <FontAwesomeIcon icon={faUserGear} /> {getUserName(user)}
            </NavItem>
          ) : (
            <NavItem
              className="ms-auto"
              onClick={() => {
                toggleLoginModal();
                toggle();
              }}
            >
              <FontAwesomeIcon icon={faUser} /> Login
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
      <AddGuitarModal
        isOpen={isAddGuitarModalOpen}
        toggle={toggleAddGuitarModal}
        selectAndGoToGuitar={selectAndGoToGuitar}
      />
    </Navbar>
  );
};

NavBar.propTypes = {
  scrollTo: PropTypes.func,
  selectAndGoToGuitar: PropTypes.func
};

NavBar.defaultProps = {
  scrollTo: () => {},
  selectAndGoToGuitar: () => {}
};

export default NavBar;
