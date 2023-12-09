/** @module ConfirmationModal */

import React from "react";

import {
  faCircleCheck,
  faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useModalContext from "../../hooks/useModalContext";

import { toggleToggle } from "../../store/slices/toggleSlice";

/**
 * @function ConfirmationModal
 * @returns {React.ReactNode}
 */
const ConfirmationModal = () => {
  const dispatch = useDispatch();

  const { isOpen, title, text, handleNo, handleYes, children } =
    useModalContext("confirmationModal");
  const toggle = () => dispatch(toggleToggle({ id: "confirmationModal" }));

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title ?? "Confirm"}</ModalHeader>
      <ModalBody>
        <span>{text ?? "Are you sure?"}</span>
        {children ? <p>{children}</p> : null}
      </ModalBody>
      <ModalFooter>
        <Button
          className="me-2"
          onClick={() => {
            if (handleNo) {
              handleNo();
            }
            toggle();
          }}
          variant="contained"
          disableElevation
          color="error"
        >
          <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
          No
        </Button>
        <Button
          onClick={() => {
            if (handleYes) {
              handleYes();
            }
            toggle();
          }}
          variant="contained"
          disableElevation
          color="success"
          className="font-weight-bold"
        >
          <FontAwesomeIcon icon={faCircleCheck} className="me-3" />
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
