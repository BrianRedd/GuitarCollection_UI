import React from "react";

import { Formik } from "formik";
import moment from "moment";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { getGuitars, updateGuitar } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { DATE_FORMAT, INSTRUMENT_OPTION_GUITAR } from "../data/constants";
import { getGuitarsValidationSchema } from "./data/validationSchemas";

import GuitarForm from "./GuitarForm";
import GuitarFormButtons from "./GuitarFormButtons";

/**
 * @function EditGuitarModal
 * @returns {React.ReactNode}
 */
const EditGuitarModal = props => {
  const { isOpen, toggle } = props;
  const dispatch = useDispatch();

  const { list: guitars, selected: selectedGuitar } =
    useSelector(state => state.guitarsState) ?? {};

  const hash = (window.location.hash ?? "").slice(1);

  const initialValues = {
    ...types.guitar.defaults,
    ...guitars.find(
      guitar =>
        guitar.name === selectedGuitar ||
        guitar._id === hash ||
        guitar.name === hash
    )
  };

  const submitButtonText = `Update ${
    initialValues.name ??
    initialValues.instrumentType ??
    INSTRUMENT_OPTION_GUITAR
  }`;

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen>
      <ModalHeader toggle={toggle}>
        Edit {initialValues.name ?? "Guitar"}
      </ModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values,
            lastPlayed: values.lastPlayed
              ? moment(values.lastPlayed).format(DATE_FORMAT)
              : ""
          };
          dispatch(updateGuitar(submissionValues)).then(() => {
            dispatch(getGuitars()).then(() => {
              actions.resetForm(initialValues);
            });
          });
          toggle();
        }}
        validationSchema={getGuitarsValidationSchema({
          isEdit: true,
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

EditGuitarModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

EditGuitarModal.defaultProps = {
  isOpen: false,
  toggle: () => {}
};

export default EditGuitarModal;
