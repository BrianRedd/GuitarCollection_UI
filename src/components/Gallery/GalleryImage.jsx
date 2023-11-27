/** @module GalleryImage */

import React, { useState } from "react";

import {
  faEdit,
  faSquareMinus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import confirm from "reactstrap-confirm";

import usePermissions from "../../hooks/usePermissions";
import {
  deleteGalleryImage,
  getGallery
} from "../../store/slices/gallerySlice";
import { serverLocation } from "../../utils/constants";

import ImageViewerModal from "../Modals/ImageViewerModal";

import "./styles/gallery.scss";

/**
 * @function GalleryImage
 * @returns {React.ReactNode}
 */
const GalleryImage = props => {
  const { image, selectImage, handleDelete } = props;
  const dispatch = useDispatch();

  const hasEditGuitarPermissions = usePermissions("EDIT_GUITAR");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isDisconnect = Boolean(handleDelete);

  return (
    <React.Fragment>
      <div
        className="border gallery-image me-2 p-0 mb-2"
        style={{
          backgroundImage: `url(${serverLocation}/gallery/${image.image})`
        }}
      >
        {image.caption && (
          <div className="gallery-image-caption">
            {image.guitar ? `${image.guitar} ` : ""}
            {image.caption}
          </div>
        )}
        <ButtonBase
          className="click-space"
          onClick={evt => {
            evt.preventDefault();
            toggle();
          }}
        />
        {hasEditGuitarPermissions && (
          <div className="gallery-image-buttons px-1">
            <IconButton
              onClick={() => {
                selectImage(image);
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="text-success small" />
            </IconButton>
            <IconButton
              onClick={async () => {
                const result = await confirm({
                  title: `${isDisconnect ? "Disconnect" : "Delete"} Image?`,
                  message: `Are you sure you want to ${
                    isDisconnect ? "disconnect" : "permanently delete"
                  } image?`,
                  confirmColor: "danger",
                  cancelColor: "link text-primary"
                });
                if (result) {
                  if (handleDelete) {
                    handleDelete();
                  } else {
                    dispatch(deleteGalleryImage(image)).then(() => {
                      dispatch(getGallery());
                    });
                  }
                }
              }}
            >
              <FontAwesomeIcon
                icon={isDisconnect ? faSquareMinus : faTrash}
                className="text-danger small"
              />
            </IconButton>
          </div>
        )}
      </div>
      <ImageViewerModal
        isModalOpen={isModalOpen}
        toggle={toggle}
        image={image}
      />
    </React.Fragment>
  );
};

GalleryImage.propTypes = {
  handleDelete: PropTypes.func,
  image: PropTypes.objectOf(PropTypes.any),
  selectImage: PropTypes.func
};

GalleryImage.defaultTypes = {
  handleDelete: undefined,
  image: {},
  selectImage: () => {}
};

export default GalleryImage;
