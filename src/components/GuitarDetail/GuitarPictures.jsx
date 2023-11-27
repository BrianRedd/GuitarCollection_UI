/** @module GuitarPictures */

import React, { useState } from "react";

import {
  faArrowDown,
  faArrowRight,
  faCloudArrowUp,
  faImages
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase } from "@mui/material";
import { Formik } from "formik";
import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Col, Collapse, Row } from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import {
  addGalleryImage,
  getGallery,
  updateGalleryImage
} from "../../store/slices/gallerySlice";
import { getGuitars, updateGuitar } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { galleryValidationSchema } from "../Gallery/data/validationSchemas";

import GalleryImage from "../Gallery/GalleryImage";
import ImageSelectorModal from "../Modals/ImageSelectorModal";
import ImageUploadModal from "../Modals/ImageUploadModal";

import "../Gallery/styles/gallery.scss";

/**
 * @function GuitarPictures
 * @returns {React.ReactNode}
 */
const GuitarPictures = props => {
  const { guitar } = props;
  const dispatch = useDispatch();

  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions("EDIT_GUITAR");

  const [selectedImage, setSelectedImage] = useState(
    types.galleryImage.defaults
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const guitarImageList = _.orderBy(
    (guitar.pictures ?? [])?.map(imageId => {
      const image = gallery.find(img => img._id === imageId) ?? {};
      return image;
    }),
    "caption"
  );

  return (
    <Formik
      initialValues={selectedImage}
      onSubmit={(values, actions) => {
        const submissionValues = {
          ...values
        };
        Boolean(selectedImage?._id)
          ? dispatch(
              updateGalleryImage({
                ...submissionValues,
                old_image: selectedImage.image
              })
            ).then(() => {
              actions.resetForm(types.galleryImage.defaults);
              setSelectedImage({});
              dispatch(getGallery());
              dispatch(getGuitars());
            })
          : dispatch(addGalleryImage(submissionValues)).then(response => {
              dispatch(
                updateGuitar({
                  ...guitar,
                  pictures: _.compact([
                    ...(guitar.pictures ?? []),
                    response.payload.data._id
                  ])
                })
              );
              actions.resetForm(types.galleryImage.defaults);
              setSelectedImage({});
              dispatch(getGallery());
              dispatch(getGuitars());
            });
      }}
      validationSchema={galleryValidationSchema}
    >
      {formProps => {
        const selectImage = image => {
          formProps.setValues(image);
          setSelectedImage(image);
        };
        return (
          <Row>
            <ButtonBase
              onClick={() => setIsOpen(!isOpen)}
              className=" justify-content-start d-flex"
            >
              <h5 className="mt-2 ps-2 text-decoration-underline">
                Picture Gallery ({(guitar.pictures ?? []).length})
                <FontAwesomeIcon
                  className="ms-2"
                  icon={isOpen ? faArrowDown : faArrowRight}
                />
              </h5>
            </ButtonBase>
            <Collapse isOpen={isOpen}>
              <Row>
                {guitarImageList?.map(image => (
                  <GalleryImage
                    key={image._id}
                    image={image}
                    selectImage={image => {
                      selectImage(image);
                      setIsUploadModalOpen(true);
                    }}
                    handleDelete={() => {
                      dispatch(
                        updateGuitar({
                          ...guitar,
                          pictures: (guitar.pictures ?? []).filter(
                            id => id !== image._id
                          )
                        })
                      );
                    }}
                  />
                ))}
                {hasEditGuitarPermissions && (
                  <div className="gallery-image border d-block">
                    <ButtonBase
                      className="w-100 d-block h-50"
                      onClick={() => {
                        selectImage(types.galleryImage.defaults);
                        setIsUploadModalOpen(true);
                      }}
                    >
                      <Row>
                        <Col>
                          <h6>Upload New Image</h6>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
                        </Col>
                      </Row>
                    </ButtonBase>
                    <ButtonBase
                      className="w-100 d-block h-50 border-top"
                      onClick={() => {
                        selectImage(types.galleryImage.defaults);
                        setIsSelectModalOpen(true);
                      }}
                    >
                      <Row>
                        <Col>
                          <h6>Select From Gallery</h6>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FontAwesomeIcon icon={faImages} size="2xl" />
                        </Col>
                      </Row>
                    </ButtonBase>
                  </div>
                )}
              </Row>
            </Collapse>
            <ImageUploadModal
              isOpen={isUploadModalOpen}
              toggle={() => setIsUploadModalOpen(!isUploadModalOpen)}
              selectedImage={selectedImage}
              handleSubmit={formProps.handleSubmit}
            />
            <ImageSelectorModal
              isOpen={isSelectModalOpen}
              toggle={() => setIsSelectModalOpen(!isSelectModalOpen)}
              handleSubmit={image => {
                dispatch(
                  updateGuitar({
                    ...guitar,
                    pictures: [...(guitar.pictures ?? []), image._id]
                  })
                );
                const galleryImage = (gallery ?? []).find(
                  img => img._id === image._id
                );
                if (galleryImage && image.caption !== galleryImage.caption) {
                  dispatch(
                    updateGalleryImage({
                      ...galleryImage,
                      caption: image.caption
                    })
                  );
                }
              }}
              unavailableImages={guitar.pictures}
            />
          </Row>
        );
      }}
    </Formik>
  );
};

GuitarPictures.propTypes = {
  guitar: PropTypes.objectOf(PropTypes.any)
};

GuitarPictures.defaultProps = {
  guitar: {}
};

export default GuitarPictures;
