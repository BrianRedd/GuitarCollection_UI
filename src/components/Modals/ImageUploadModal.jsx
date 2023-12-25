/** @module ImageUploadModal */

import React from "react";

import {
  faCircleXmark,
  faCloudArrowUp,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import _ from "lodash";
import PropTypes from "prop-types";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

import { SERVER_LOCATION } from "../../utils/constants";
import { CAPTION_OPTIONS_DEFAULTS } from "../data/constants";

import InputFreeFormField from "../common/InputFreeFormField";

/**
 * @function ImageUploadModal
 * @returns {React.ReactNode}
 */
const ImageUploadModal = props => {
  const { isOpen, toggle, selectedImage, handleSubmit, handleCancel } = props;

  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const formProps = useFormikContext();

  const isEdit = Boolean(selectedImage._id);

  const captionOptions = _.uniq(
    _.compact([
      ...CAPTION_OPTIONS_DEFAULTS,
      ...gallery.map(image => image.caption).sort()
    ])
  );

  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        600,
        600,
        "png",
        75,
        0,
        uri => {
          resolve(uri);
        },
        "file"
      );
    });

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEdit ? `Edit Image` : "Upload New Image"}
      </ModalHeader>
      <ModalBody>
        {isEdit && (
          <Row>
            <Col>
              <img
                src={`${SERVER_LOCATION}/gallery/${selectedImage.image}`}
                width="100"
                className="img-thumbnail mt-1"
                alt={selectedImage.alt}
              ></img>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <input
              type="file"
              name="image"
              className="form-control form-control-lg"
              style={{ height: "59px" }}
              onChange={async event => {
                const file = event.target.files[0];
                if (file) {
                  const image = await resizeFile(file);
                  formProps.setFieldValue("image", image);
                }
              }}
              required
            />
          </Col>
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
            handleCancel();
            toggle();
          }}
          variant="outlined"
          color="error"
        >
          <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
          Cancel
        </Button>
        <Button
          className="ms-2"
          onClick={() => {
            handleSubmit();
            toggle();
          }}
          variant="contained"
          disableElevation
          color="success"
          disabled={!formProps.values.image}
        >
          <FontAwesomeIcon
            icon={isEdit ? faSave : faCloudArrowUp}
            className="me-3"
          />
          {isEdit ? `Save Image` : "Upload New Image"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ImageUploadModal.propTypes = {
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedImage: PropTypes.objectOf(PropTypes.any),
  toggle: PropTypes.func
};

ImageUploadModal.defaultProps = {
  handleCancel: () => {},
  handleSubmit: () => {},
  isOpen: false,
  selectedImage: {},
  toggle: () => {}
};

export default ImageUploadModal;
