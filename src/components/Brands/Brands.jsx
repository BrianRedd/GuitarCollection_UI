/** @module Brands */

import React, { useState } from "react";

import {
  faCircleXmark,
  faPenToSquare,
  faPlus,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Col,
  Collapse,
  Container,
  Form,
  FormGroup,
  Row
} from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import {
  addBrand,
  getBrands,
  updateBrand
} from "../../store/slices/brandsSlice";
import * as types from "../../types/types";
import { serverLocation } from "../../utils/constants";
import { BRAND_PERM } from "../data/constants";
import { getBrandsValidationSchema } from "./data/validationSchemas";

import InputTextField from "../common/InputTextField";
import BrandBlock from "./BrandBlock";

import "./styles/brands.scss";

/**
 * @function Brands
 * @returns {ReactNode}
 */
const Brands = props => {
  const { scrollTo } = props;

  const dispatch = useDispatch();

  const brands = useSelector(state => state.brandsState.list) ?? [];

  const [selectedBrand, setSelectedBrand] = useState(types.brand.defaults);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const hasEditBrandPermissions = usePermissions(BRAND_PERM);

  const isEdit = Boolean(selectedBrand._id);

  return (
    <Container fluid="md">
      <h1>Brands</h1>
      <Formik
        initialValues={selectedBrand}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values
          };
          isEdit
            ? dispatch(
                updateBrand({
                  ...submissionValues,
                  old_logo: selectedBrand.logo
                })
              ).then(() => {
                actions.resetForm(types.brand.defaults);
                setSelectedBrand({});
                dispatch(getBrands());
              })
            : dispatch(addBrand(submissionValues)).then(() => {
                actions.resetForm(types.brand.defaults);
                setSelectedBrand({});
                dispatch(getBrands());
              });
        }}
        validationSchema={getBrandsValidationSchema({
          brands,
          thisItem: selectedBrand._id ? selectedBrand : null
        })}
      >
        {formProps => {
          const selectBrand = brand => {
            formProps.setValues(brand);
            setSelectedBrand(brand);
          };
          return (
            <React.Fragment>
              {hasEditBrandPermissions && (
                <React.Fragment>
                  <Row className=" justify-content-end d-flex mb-3">
                    <Button
                      color="primary"
                      onClick={() => setIsEditOpen(!isEditOpen)}
                      className=" justify-content-end d-flex"
                      startIcon={
                        <FontAwesomeIcon
                          icon={isEdit ? faPenToSquare : faPlus}
                        />
                      }
                    >
                      <b>
                        {isEdit
                          ? `Edit Brand ${selectedBrand.name}`
                          : "Add New Brand"}
                      </b>
                    </Button>
                  </Row>
                  <Collapse isOpen={isEditOpen}>
                    <Form>
                      <FormGroup>
                        <Row>
                          <InputTextField
                            name="name"
                            required
                            onChange={evt => {
                              const value = evt.target.value;
                              if (value && value.length > 2 && !isEdit) {
                                formProps.setFieldValue(
                                  "id",
                                  value?.slice(0, 2)?.toUpperCase()
                                );
                              }
                            }}
                          />
                          <InputTextField
                            name="id"
                            required
                            otherProps={{
                              disabled: !formProps.values?.name || isEdit
                            }}
                          />
                          <InputTextField name="notes" width="wide" />
                        </Row>
                        <Row>
                          <Col xs={isEdit ? 6 : 12} md={isEdit ? 4 : 6}>
                            <input
                              type="file"
                              name="image"
                              className="form-control form-control-lg"
                              onChange={event => {
                                formProps.setFieldValue(
                                  "logo",
                                  event.currentTarget.files[0]
                                );
                              }}
                              required
                            />
                          </Col>
                          {isEdit && selectedBrand.logo && (
                            <Col xs={6} md={2}>
                              <img
                                src={`${serverLocation}/brandLogos/${selectedBrand.logo}`}
                                width="100"
                                className="img-thumbnail mt-1"
                                alt={selectedBrand.name}
                              ></img>
                            </Col>
                          )}
                          <Col xs={12} md={6} className="buttons-container">
                            <Button
                              onClick={formProps.handleSubmit}
                              variant="contained"
                              disableElevation
                              color="primary"
                              className="font-weight-bold"
                            >
                              <FontAwesomeIcon icon={faSave} className="me-3" />
                              {isEdit
                                ? `Save ${selectedBrand.name}`
                                : "Create New Brand"}
                            </Button>
                            <Button
                              className="ms-2 bg-white"
                              onClick={() => {
                                formProps.resetForm(types.brand.defaults);
                                setSelectedBrand(types.brand.defaults);
                                setIsEditOpen(false);
                              }}
                              variant="outlined"
                              color="secondary"
                            >
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="me-3"
                              />
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Form>
                  </Collapse>
                </React.Fragment>
              )}
              {brands?.length ? (
                <Row className="brands-container border justify-content-center">
                  {brands?.map(brand => (
                    <BrandBlock
                      key={brand.id}
                      brand={brand}
                      selectBrand={selectBrand}
                      scrollTo={scrollTo}
                      setIsEditOpen={setIsEditOpen}
                    />
                  ))}
                </Row>
              ) : (
                <Alert className="m-0" color={"danger"}>
                  No Brands Found
                </Alert>
              )}
            </React.Fragment>
          );
        }}
      </Formik>
    </Container>
  );
};

Brands.propTypes = {
  scrollTo: PropTypes.func
};

Brands.defaultProps = {
  scrollTo: () => {}
};

export default Brands;
