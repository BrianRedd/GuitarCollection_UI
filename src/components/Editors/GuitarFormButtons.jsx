/** @module GuitarFormButtons */

import React from "react";

import { faCircleXmark, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";

import usePermissions from "../../hooks/usePermissions";
import { GUITAR_PERM } from "../data/constants";

import { useDispatch } from "react-redux";
import { removeGuitar } from "../../store/slices/guitarsSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/editors.scss";

/**
 * @function GuitarFormButtons
 * @returns {React.ReactNode}
 */
const GuitarFormButtons = (props) => {
  const { className, submitButtonText, initialValues, toggle } = props;

  const dispatch = useDispatch();

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

  const { values: formValues, resetForm, handleSubmit } = useFormikContext();

  return (
    <div className={`w-100 d-flex justify-content-between save-buttons ${className}`}>
      {hasEditGuitarPermissions && formValues?._id ? (
        <Button
          onClick={() => {
            dispatch(
              toggleToggle({
                id: "confirmationModal",
                title: `Delete ${formValues.name ?? "Instrument"}?`,
                text: `Are you sure you want to permanently delete ${
                  formValues.name ?? "this instrument"
                }?`,
                handleYes: () => {
                  toggle();
                  dispatch(removeGuitar(formValues._id))
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
      ) : (
        <div />
      )}
      <div>
        <Button
          onClick={() => {
            resetForm(initialValues);
            toggle();
          }}
          variant="outlined"
          color="error"
        >
          <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
          Cancel
        </Button>
        {hasEditGuitarPermissions && (
          <Button
            className="ms-2"
            onClick={handleSubmit}
            variant="contained"
            disableElevation
            color="success"
          >
            <FontAwesomeIcon icon={faSave} className="me-3" />
            {submitButtonText}
          </Button>
        )}
      </div>
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
