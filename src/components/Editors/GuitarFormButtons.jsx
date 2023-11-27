/** @module GuitarFormButtons */

import React from "react";

import { faCircleXmark, faGuitar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import usePermissions from "../../hooks/usePermissions";

import "./styles/editors.scss";

/**
 * @function GuitarFormButtons
 * @returns {React.ReactNode}
 */
const GuitarFormButtons = props => {
  const { className, submitButtonText, initialValues } = props;

  const isEdit = Boolean(initialValues._id);

  const navigate = useNavigate();

  const hasEditGuitarPermissions = usePermissions("EDIT_GUITAR");

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
        className="ms-2"
        onClick={() => {
          formProps.resetForm(initialValues);
          navigate(`/${isEdit ? `guitar/${initialValues._id}` : "guitarlist"}`);
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
  initialValues: PropTypes.objectOf(PropTypes.any)
};

GuitarFormButtons.defaultProps = {
  className: "",
  submitButtonText: "Submit",
  initialValues: {}
};

export default GuitarFormButtons;
