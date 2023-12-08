/** @module Modals */

import React from "react";

import AddGuitarModal from "../Editors/AddGuitarModal";
import EditGuitarModal from "../Editors/EditGuitarModal";
import FiltersModal from "../Modals/FiltersModal";
import ManageUserModal from "../Modals/ManageUserModal";
import UserLoginModal from "../Modals/UserLoginModal";

const Modals = () => {
  return (
    <React.Fragment>
      <AddGuitarModal />
      <EditGuitarModal />
      <FiltersModal />
      <ManageUserModal />
      <UserLoginModal />
    </React.Fragment>
  );
};

export default Modals;
