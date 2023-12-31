/** @module GalleryImage */

import React, { useState } from "react";

import {
  faPenToSquare,
  faSquareMinus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import usePermissions from "../../hooks/usePermissions";
import {
  deleteGalleryImage,
  getGallery
} from "../../store/slices/gallerySlice";
import { SERVER_LOCATION } from "../../utils/constants";
import { GUITAR_PERM } from "../data/constants";

import ImageViewerModal from "../Modals/Images/ImageViewerModal";

import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/gallery.scss";

/**
 * @function GalleryImage
 * @returns {React.ReactNode}
 */
const GalleryImage = props => {
  const { handleDelete, image, selectAndGoToGuitar, selectImage } = props;
  const dispatch = useDispatch();

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

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
          backgroundImage: `url(${SERVER_LOCATION}/gallery/${image.image})`
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
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-success small"
              />
            </IconButton>
            <IconButton
              onClick={() => {
                dispatch(
                  toggleToggle({
                    id: "confirmationModal",
                    title: `${isDisconnect ? "Disconnect" : "Delete"} Image?`,
                    text: `Are you sure you want to ${
                      isDisconnect ? "disconnect" : "permanently delete"
                    } image?`,
                    handleYes: () => {
                      if (handleDelete) {
                        handleDelete();
                      } else {
                        dispatch(deleteGalleryImage(image)).then(() => {
                          dispatch(getGallery());
                        });
                      }
                    }
                  })
                );
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
        image={image}
        selectAndGoToGuitar={selectAndGoToGuitar}
        toggle={toggle}
      />
    </React.Fragment>
  );
};

GalleryImage.propTypes = {
  handleDelete: PropTypes.func,
  image: PropTypes.objectOf(PropTypes.any),
  selectAndGoToGuitar: PropTypes.func,
  selectImage: PropTypes.func
};

GalleryImage.defaultTypes = {
  handleDelete: undefined,
  image: {},
  selectAndGoToGuitar: () => {},
  selectImage: () => {}
};

export default GalleryImage;
