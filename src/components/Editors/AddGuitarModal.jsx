import React from "react";

import { Formik } from "formik";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { addGuitar, getGuitars } from "../../store/slices/guitarsSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import * as types from "../../types/types";
import { getGuitarsValidationSchema } from "./data/validationSchemas";

import useModalContext from "../../hooks/useModalContext";
import GuitarForm from "./GuitarForm";
import GuitarFormButtons from "./GuitarFormButtons";

/**
 * @function AddGuitarModal
 * @returns {React.ReactNode}
 */
const AddGuitarModal = () => {
  const dispatch = useDispatch();

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];

  const { isOpen, selectAndGoToGuitar } = useModalContext("addGuitarModal");
  const toggle = () => dispatch(toggleToggle({ id: "addGuitarModal" }));

  const initialValues = types.guitar.defaults;

  const submitButtonText = "Add Instrument";

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen>
      <ModalHeader toggle={toggle}>Add Instrument</ModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values,
            specifications: _.orderBy(values?.specifications, "specType")
          };
          dispatch(addGuitar(submissionValues)).then(response => {
            if (response) {
              dispatch(getGuitars()).then(() => {
                actions.resetForm(initialValues);
                selectAndGoToGuitar(response?.payload?.data?._id);
              });
            }
            toggle();
          });
        }}
        validationSchema={getGuitarsValidationSchema({
          guitars
        })}
      >
        {() => {
          return (
            <React.Fragment>
              <ModalBody>
                <GuitarForm initialValues={initialValues} />
              </ModalBody>
              <ModalFooter>
                <GuitarFormButtons
                  submitButtonText={submitButtonText}
                  initialValues={initialValues}
                  toggle={toggle}
                />
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddGuitarModal;
