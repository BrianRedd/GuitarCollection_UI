/** @module Modals */

import React from "react";

import AddEditBrandModal from "./Brands/AddEditBrandModal";
import ConfirmationModal from "./Confirmation/ConfirmationModal";
import FiltersModal from "./Filters/FiltersModal";
import AddGuitarModal from "./Guitars/AddGuitarModal";
import EditGuitarModal from "./Guitars/EditGuitarModal";
import PlayLogModal from "./PlayLog/PlayLogModal";
import ManageUserModal from "./Users/ManageUserModal";
import UserLoginModal from "./Users/UserLoginModal";

const Modals = () => {
  return (
    <React.Fragment>
      <AddEditBrandModal />
      <AddGuitarModal />
      <ConfirmationModal />
      <EditGuitarModal />
      <FiltersModal />
      <ManageUserModal />
      <PlayLogModal />
      <UserLoginModal />
    </React.Fragment>
  );
};

export default Modals;
