/** @module Gallery */

import React, { useState } from "react";

import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ButtonBase } from "@mui/material";
import { Formik } from "formik";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { galleryValidationSchema } from "./data/validationSchemas";

import usePermissions from "../../hooks/usePermissions";
import {
  addGalleryImage,
  getGallery,
  updateGalleryImage
} from "../../store/slices/gallerySlice";
import * as types from "../../types/types";
import {
  CAPTION_OPTION_RECEIPT,
  GUITAR_PERM,
  PURCHASE_PERM
} from "../data/constants";

import ImageUploadModal from "../Modals/ImageUploadModal";
import GalleryImage from "./GalleryImage";

import "./styles/gallery.scss";

/**
 * @function Gallery
 * @returns {ReactNode}
 */
const Gallery = () => {
  const dispatch = useDispatch();

  const guitars = useSelector(state => state.guitarsState.list) ?? [];
  const galleryFromState = useSelector(state => state.galleryState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);
  const hasPurchaseHistoryPermissions = usePermissions(PURCHASE_PERM);

  const gallery = hasPurchaseHistoryPermissions
    ? galleryFromState
    : galleryFromState?.filter(
        image => image.caption !== CAPTION_OPTION_RECEIPT
      );

  const [selectedImage, setSelectedImage] = useState(
    types.galleryImage.defaults
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEdit = Boolean(selectedImage._id);

  const gridData = () => {
    const imageGuitarMapping = {};
    guitars.forEach(guitar => {
      (guitar.pictures ?? []).forEach(picture => {
        if (!imageGuitarMapping[picture]) {
          imageGuitarMapping[picture] = guitar.name;
        }
      });
    });
    return _.orderBy(
      (gallery ?? []).map(image => ({
        key: image._id,
        ...image,
        guitar: `${imageGuitarMapping?.[image._id] ?? ""}`
      })),
      "guitar"
    );
  };

  return (
    <Box sx={{ width: "100%" }} className="p-4">
      <h1>Gallery</h1>
      <Formik
        initialValues={selectedImage}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values
          };
          isEdit
            ? dispatch(
                updateGalleryImage({
                  ...submissionValues,
                  old_image: selectedImage.image
                })
              ).then(() => {
                actions.resetForm(types.galleryImage.defaults);
                setSelectedImage({});
                dispatch(getGallery());
              })
            : dispatch(addGalleryImage(submissionValues)).then(() => {
                actions.resetForm(types.galleryImage.defaults);
                setSelectedImage({});
                dispatch(getGallery());
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
            <React.Fragment>
              <Row>
                {hasEditGuitarPermissions && (
                  <ButtonBase
                    className="gallery-image border d-block me-2"
                    onClick={() => {
                      selectImage(types.galleryImage.defaults);
                      setIsModalOpen(true);
                    }}
                  >
                    <Row>
                      <Col>
                        <h6 className="">Upload New Image</h6>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col>
                        <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
                      </Col>
                    </Row>
                  </ButtonBase>
                )}
                {gridData()?.map((image, idx) => (
                  <GalleryImage
                    key={`${image._id}_${idx}`}
                    image={image}
                    selectImage={image => {
                      selectImage(image);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </Row>
              <ImageUploadModal
                isOpen={isModalOpen}
                toggle={() => setIsModalOpen(!isModalOpen)}
                selectedImage={selectedImage}
                handleSubmit={formProps.handleSubmit}
              />
            </React.Fragment>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Gallery;
