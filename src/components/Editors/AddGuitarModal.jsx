import React from "react";

import { Formik } from "formik";
import moment from "moment";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { addGuitar, getGuitars } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { DATE_FORMAT } from "../data/constants";
import { getGuitarsValidationSchema } from "./data/validationSchemas";

import GuitarForm from "./GuitarForm";
import GuitarFormButtons from "./GuitarFormButtons";

/**
 * @function AddGuitarModal
 * @returns {React.ReactNode}
 */
const AddGuitarModal = props => {
  const { isOpen, toggle, selectAndGoToGuitar } = props;
  const dispatch = useDispatch();

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];

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
            lastPlayed: values.lastPlayed
              ? moment(values.lastPlayed).format(DATE_FORMAT)
              : ""
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

AddGuitarModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  scrollTo: PropTypes.func
};

AddGuitarModal.defaultProps = {
  isOpen: false,
  toggle: () => {},
  scrollTo: () => {}
};

export default AddGuitarModal;
