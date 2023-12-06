/** @module Brands */

import React, { useState } from "react";

import { faCircleXmark, faIndustry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Container, Form, FormGroup, Row } from "reactstrap";
import { getBrandsValidationSchema } from "./data/validationSchemas";

import usePermissions from "../../hooks/usePermissions";
import {
  addBrand,
  getBrands,
  updateBrand
} from "../../store/slices/brandsSlice";
import * as types from "../../types/types";
import { serverLocation } from "../../utils/constants";
import { BRAND_PERM } from "../data/constants";

import InputTextField from "../common/InputTextField";
import BrandBlock from "./BrandBlock";

import "./styles/brands.scss";

/**
 * @function Brands
 * @returns {ReactNode}
 */
const Brands = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState(types.brand.defaults);
  const brands = useSelector(state => state.brandsState.list) ?? [];

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
                  <h4 className="mt-3">
                    {isEdit
                      ? `Edit Brand ${selectedBrand.name}`
                      : "Add New Brand"}
                  </h4>
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
                            <FontAwesomeIcon
                              icon={faIndustry}
                              className="me-3"
                            />
                            {isEdit
                              ? `Save ${selectedBrand.name}`
                              : "Create New Brand"}
                          </Button>
                          <Button
                            className="ms-2 bg-white"
                            onClick={() => {
                              formProps.resetForm(types.brand.defaults);
                              setSelectedBrand(types.brand.defaults);
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
                </React.Fragment>
              )}
              {brands?.length ? (
                <Row className="brands-container border">
                  {brands?.map(brand => (
                    <BrandBlock
                      key={brand.id}
                      brand={brand}
                      selectBrand={selectBrand}
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

export default Brands;
