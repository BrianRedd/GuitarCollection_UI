/** @module ImageSelectorModal */

import React, { useState } from "react";

import { faCircleXmark, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonBase } from "@mui/material";
import { useFormikContext } from "formik";
import _ from "lodash";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

import { serverLocation } from "../../utils/constants";
import { CAPTION_OPTIONS_DEFAULTS } from "../data/constants";

import InputFreeFormField from "../common/InputFreeFormField";

import "./styles/modalstyles.scss";

/**
 * @function ImageSelectorModal
 * @returns {React.ReactNode}
 */
const ImageSelectorModal = props => {
  const { isOpen, toggle, handleSubmit, handleCancel, unavailableImages } =
    props;

  const [selectedImage, setSelectedImage] = useState({});

  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const formProps = useFormikContext();

  const captionOptions = _.uniq(
    _.compact([
      ...CAPTION_OPTIONS_DEFAULTS,
      ...gallery.map(image => image.caption).sort()
    ])
  );

  const selectImage = image => {
    setSelectedImage(image);
    formProps.setFieldValue("caption", image.caption);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen>
      <ModalHeader toggle={toggle}>Select Image From Gallery</ModalHeader>
      <ModalBody>
        <Row className="selector-image-container">
          {gallery.map(image => (
            <ButtonBase
              key={image._id}
              onClick={() => selectImage(image)}
              className={_.compact([
                "image-selector",
                image._id === selectedImage._id && "selected"
              ]).join(" ")}
              style={{
                backgroundImage: `url(${serverLocation}/gallery/${image.image})`
              }}
              disabled={unavailableImages.includes(image._id)}
            />
          ))}
        </Row>
        <Row className="mt-3">
          <Col>
            <InputFreeFormField
              name="caption"
              options={captionOptions}
              width="full"
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            handleSubmit(selectedImage);
            toggle();
          }}
          variant="contained"
          disableElevation
          color="primary"
          className="font-weight-bold"
          disabled={_.isEmpty(selectedImage)}
        >
          <FontAwesomeIcon icon={faImage} className="me-3" />
          Select
        </Button>
        <Button
          className="ms-2"
          onClick={() => {
            handleCancel();
            toggle();
          }}
          variant="outlined"
          color="secondary"
        >
          <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ImageSelectorModal.propTypes = {
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedImage: PropTypes.objectOf(PropTypes.any),
  toggle: PropTypes.func,
  unavailableImages: PropTypes.arrayOf(PropTypes.string)
};

ImageSelectorModal.defaultProps = {
  handleCancel: () => {},
  handleSubmit: () => {},
  isOpen: false,
  selectedImage: {},
  toggle: () => {},
  unavailableImages: []
};

export default ImageSelectorModal;
