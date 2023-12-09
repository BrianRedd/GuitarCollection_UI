/** @module Modals */

import React from "react";

import AddGuitarModal from "../Editors/AddGuitarModal";
import EditGuitarModal from "../Editors/EditGuitarModal";
import AddEditBrandModal from "../Modals/AddEditBrandModal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import FiltersModal from "../Modals/FiltersModal";
import ManageUserModal from "../Modals/ManageUserModal";
import PlayLogModal from "../Modals/PlayLogModal";
import UserLoginModal from "../Modals/UserLoginModal";

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
