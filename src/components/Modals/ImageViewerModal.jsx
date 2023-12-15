/** @module ImageViewerModal */

import React from "react";

import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { SERVER_LOCATION } from "../../utils/constants";

/**
 * @function ImageViewerModal
 * @returns {React.ReactNode}
 */
const ImageViewerModal = props => {
  const { isModalOpen, image, selectAndGoToGuitar, toggle } = props;
  return (
    <Modal isOpen={isModalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {image.guitar ? (
          <span
            className="navigation-span me-1"
            onClick={() => {
              toggle();
              selectAndGoToGuitar(image.guitar);
            }}
          >
            {image.guitar}
          </span>
        ) : (
          ""
        )}
        {image.caption}
      </ModalHeader>
      <ModalBody>
        <img
          className="w-100"
          src={`${SERVER_LOCATION}/gallery/${image.image}`}
          alt={image.caption ?? "Image"}
        />
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
  selectAndGoToGuitar: PropTypes.func,
  toggle: PropTypes.func
};

ImageViewerModal.defaultProps = {
  image: {},
  isModalOpen: false,
  selectAndGoToGuitar: () => {},
  toggle: () => {}
};

export default ImageViewerModal;
