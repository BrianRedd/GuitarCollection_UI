/** @module GuitarFormButtons */

import React from "react";

import { faCircleXmark, faGuitar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";

import usePermissions from "../../hooks/usePermissions";
import { GUITAR_PERM } from "../data/constants";

import "./styles/editors.scss";

/**
 * @function GuitarFormButtons
 * @returns {React.ReactNode}
 */
const GuitarFormButtons = props => {
  const { className, submitButtonText, initialValues, toggle } = props;

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

  const formProps = useFormikContext();
  return (
    <div className={`d-flex justify-content-end save-buttons ${className}`}>
      {hasEditGuitarPermissions && (
        <Button
          onClick={formProps.handleSubmit}
          variant="contained"
          disableElevation
          color="primary"
          className="font-weight-bold"
        >
          <FontAwesomeIcon icon={faGuitar} className="me-3" />
          {submitButtonText}
        </Button>
      )}
      <Button
        className="ms-2 bg-white"
        onClick={() => {
          formProps.resetForm(initialValues);
          toggle();
        }}
        variant="outlined"
        color="secondary"
      >
        <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
        Cancel
      </Button>
    </div>
  );
};

GuitarFormButtons.propTypes = {
  className: PropTypes.string,
  submitButtonText: PropTypes.string,
  initialValues: PropTypes.objectOf(PropTypes.any),
  toggle: PropTypes.func
};

GuitarFormButtons.defaultProps = {
  className: "",
  submitButtonText: "Submit",
  initialValues: {},
  toggle: () => {}
};

export default GuitarFormButtons;
