/** @module EditWishListItemModal */

import React from "react";

import {
  faCircleXmark,
  faSave,
  faSquarePlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import useModalContext from "../../../hooks/useModalContext";
import { toggleToggle } from "../../../store/slices/toggleSlice";
import {
  getWishList,
  removeWishListItem,
  updateWishListItem
} from "../../../store/slices/wishListSlice";
import * as types from "../../../types/types";
import { wishListValidationSchema } from "./data/validationSchemas";

import WishListForm from "./WishListForm";

import "../Guitars/styles/editors.scss";

/**
 * @function EditWishListItemModal
 * @returns {React.ReactNode}
 */
const EditWishListItemModal = () => {
  const dispatch = useDispatch();

  const { isOpen, selectAndGoToGuitar, selectedInstrument } =
    useModalContext("editWishListModal");
  const toggle = () => dispatch(toggleToggle({ id: "editWishListModal" }));

  const initialValues = selectedInstrument ?? types.wish.defaults;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Update Wish List Item {selectedInstrument?.model ?? ""}
      </ModalHeader>
      <Formik
        initialValues={selectedInstrument}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values
          };
          dispatch(updateWishListItem(submissionValues)).then((response) => {
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
                <Button
                  className="w-100"
                  onClick={() => {
                    dispatch(
                      toggleToggle({
                        id: "confirmationModal",
                        title: `Acquired ${formProps?.values?.model ?? "Instrument"}?`,
                        text: `Did you acquire ${
                          formProps?.values?.model ?? "this instrument"
                        }? If so, congratulations! Continuing will remove this from
                          Wish List.  Continue?`,
                        handleYes: () => {
                          toggle();
                          // dispatch(removeWishListItem(formProps?.values?._id));
                          dispatch(
                            toggleToggle({
                              id: "addGuitarModal",
                              newGuitar: {
                                ...formProps?.values,
                                story: `From Wish List. ${formProps?.values?.notes}`,
                                _id: null
                              },
                              selectAndGoToGuitar
                            })
                          );
                        }
                      })
                    );
                  }}
                  variant="contained"
                  disableElevation
                  color="info"
                >
                  <FontAwesomeIcon icon={faSquarePlus} className="me-3" />
                  Acquired {formProps?.values?.model ?? "Instrument"}
                </Button>
              </ModalBody>
              <ModalFooter>
                <div className={`w-100 d-flex justify-content-between save-buttons`}>
                  <Button
                    onClick={() => {
                      dispatch(
                        toggleToggle({
                          id: "confirmationModal",
                          title: `Delete ${
                            formProps?.values?.model ?? "Instrument"
                          } from Wish List?`,
                          text: `Are you sure you want to permanently remove ${
                            formProps?.values?.model ?? "this instrument"
                          } from your Wish List?`,
                          handleYes: () => {
                            toggle();
                            dispatch(removeWishListItem(formProps?.values?._id));
                          }
                        })
                      );
                    }}
                    variant="contained"
                    disableElevation
                    color="error"
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-3" />
                    Delete
                  </Button>
                  <div>
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
                      Update Item
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default EditWishListItemModal;
