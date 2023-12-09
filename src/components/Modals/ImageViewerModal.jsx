/** @module ImageViewerModal */

import React from "react";

import PropTypes from "prop-types";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

import { SERVER_LOCATION } from "../../utils/constants";

/**
 * @function ImageViewerModal
 * @returns {React.ReactNode}
 */
const ImageViewerModal = props => {
  const { isModalOpen, toggle, image } = props;
  return (
    <Modal isOpen={isModalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{image.caption ?? "Image"}</ModalHeader>
      <ModalBody>
        <img
          className="w-100"
          src={`${SERVER_LOCATION}/gallery/${image.image}`}
          alt={image.caption ?? "Image"}
        ></img>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={toggle}
          variant="contained"
          disableElevation
          color="primary"
          className="font-weight-bold"
        >
          <FontAwesomeIcon icon={faXmarkCircle} className="me-3" />
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ImageViewerModal.propTypes = {
  image: PropTypes.objectOf(PropTypes.any),
  isModalOpen: PropTypes.bool,
  toggle: PropTypes.func
};

ImageViewerModal.defaultProps = {
  image: {},
  isModalOpen: false,
  toggle: () => {}
};

export default ImageViewerModal;
