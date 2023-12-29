/** @module AddWishListItemModal */

import React from "react";

import { faCircleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import useModalContext from "../../../hooks/useModalContext";
import { toggleToggle } from "../../../store/slices/toggleSlice";
import { addWishListItem, getWishList } from "../../../store/slices/wishListSlice";
import * as types from "../../../types/types";
import { wishListValidationSchema } from "./data/validationSchemas";

import WishListForm from "./WishListForm";

import "../Guitars/styles/editors.scss";

/**
 * @function AddWishListItemModal
 * @returns {React.ReactNode}
 */
const AddWishListItemModal = () => {
  const dispatch = useDispatch();

  const { isOpen } = useModalContext("addWishListModal");
  const toggle = () => dispatch(toggleToggle({ id: "addWishListModal" }));

  const initialValues = types.wish.defaults;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add Wish List Item</ModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values
          };
          dispatch(addWishListItem(submissionValues)).then((response) => {
            if (response) {
              dispatch(getWishList()).then(() => {
                actions.resetForm(initialValues);
              });
            }
            toggle();
          });
        }}
        validationSchema={wishListValidationSchema}
      >
        {(formProps) => {
          return (
            <React.Fragment>
              <ModalBody>
                <WishListForm />
              </ModalBody>
              <ModalFooter>
                <div className={`w-100 d-flex justify-content-end save-buttons`}>
                  <Button
                    onClick={() => {
                      formProps.resetForm(initialValues);
                      toggle();
                    }}
                    variant="outlined"
                    color="error"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
                    Cancel
                  </Button>
                  <Button
                    className="ms-2"
                    onClick={formProps.handleSubmit}
                    variant="contained"
                    disableElevation
                    color="success"
                  >
                    <FontAwesomeIcon icon={faSave} className="me-3" />
                    Create Item
                  </Button>
                </div>
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddWishListItemModal;
