/** @module NavBar */

import React, { useEffect, useMemo, useState } from "react";

import {
  faAward,
  faFilter,
  faGuitar,
  faImages,
  faList,
  faRegistered,
  faSquarePlus,
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
import { toggleToggle } from "../../store/slices/toggleSlice";
import { getUserName } from "../../utils/utils";
import { GUITAR_PERM } from "../data/constants";

/**
 * @function NavBar
 * @returns {React.ReactNode}
 */
const NavBar = props => {
  const { scrollTo, selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

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
      Object.keys(filters ?? {}).filter(filter => {
        return (
          (Array.isArray(filters[filter]) && Boolean(filters[filter].length)) ||
          (!Array.isArray(filters[filter]) && filters[filter])
        );
      }).length,
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
            <FontAwesomeIcon icon={faAward} /> Featured
          </NavItem>
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(1);
            }}
          >
            <FontAwesomeIcon icon={faList} /> Guitar List
          </NavItem>
          <NavItem
            onClick={() => {
              toggle();
              scrollTo(3);
            }}
          >
            <FontAwesomeIcon icon={faRegistered} /> Brands
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
              dispatch(toggleToggle({ id: "filterModal" }));
            }}
          >
            <FontAwesomeIcon icon={faFilter} /> Filters
            {Boolean(numberOfAppliedFilters) && (
              <Badge className="ms-2" color="warning">
                {numberOfAppliedFilters}
              </Badge>
            )}
          </NavItem>
          {hasEditGuitarPermissions && (
            <NavItem
              onClick={() => {
                toggle();
                dispatch(
                  toggleToggle({
                    id: "addGuitarModal",
                    selectAndGoToGuitar
                  })
                );
              }}
            >
              <FontAwesomeIcon icon={faSquarePlus} /> Add Instrument
            </NavItem>
          )}
          {user._id ? (
            <NavItem
              className="ms-auto"
              onClick={() => {
                toggle();
                dispatch(toggleToggle({ id: "manageUserModal" }));
              }}
            >
              <FontAwesomeIcon icon={faUserGear} /> {getUserName(user)}
            </NavItem>
          ) : (
            <NavItem
              className="ms-auto"
              onClick={() => {
                toggle();
                dispatch(toggleToggle({ id: "loginModal" }));
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
