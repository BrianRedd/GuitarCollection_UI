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
import AddWishListItemModal from "./WishList/AddWishListItemModal";
import EditWishListItemModal from "./WishList/EditWishListItemModal";

const Modals = () => {
  return (
    <React.Fragment>
      <AddEditBrandModal />
      <AddGuitarModal />
      <AddWishListItemModal />
      <ConfirmationModal />
      <EditGuitarModal />
      <EditWishListItemModal />
      <FiltersModal />
      <ManageUserModal />
      <PlayLogModal />
      <UserLoginModal />
    </React.Fragment>
  );
};

export default Modals;
