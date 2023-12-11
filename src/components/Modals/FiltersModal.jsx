/** @module FiltersModal */

import React, { useState } from "react";

import {
  faArrowRotateLeft,
  faCircleCheck,
  faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

import useModalContext from "../../hooks/useModalContext";
import useOptions from "../../hooks/useOptions";
import { writeFilters } from "../../store/slices/filtersSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import * as types from "../../types/types";
import { FILTER_FEATURED_STATUS, FILTER_STATUS } from "../data/constants";

import InputMultiSelectField from "../common/InputMultiSelectField";
import InputSelectField from "../common/InputSelectField";
import InputTextField from "../common/InputTextField";

/**
 * @function FiltersModal
 * @returns {React.ReactNode}
 */
const FiltersModal = () => {
  const dispatch = useDispatch();

  const filters = useSelector(state => state.filtersState.filters) ?? {};

  const { isOpen } = useModalContext("filterModal");
  const toggle = () => dispatch(toggleToggle({ id: "filterModal" }));

  const [brandRadioOption, setBrandRadioOption] = useState(0);

  const {
    brandOptions,
    countryOptions,
    instrumentOptions,
    soundScapeOptions,
    colorOptions,
    statusOptions,
    tuningOptions,
    yearOptions,
    noOfStringOptions
  } = useOptions({});

  const ovationBrands = ["ADO", "APO", "HGO", "OV"];

  const clearedFilters = {
    ...types.filtersState.defaults.filters,
    [FILTER_STATUS]: [],
    [FILTER_FEATURED_STATUS]: []
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Apply Filters</ModalHeader>
      <Formik
        initialValues={filters}
        onSubmit={values => {
          dispatch(writeFilters(values));
          toggle();
        }}
        enableReinitialize
      >
        {formProps => {
          const clickBrandRadioOption = val => {
            setBrandRadioOption(val);
            switch (val) {
              case 1:
                formProps.setFieldValue(
                  "brandId",
                  brandOptions
                    .map(option => option.value)
                    .filter(option => ovationBrands?.includes(option))
                );
                break;
              case 2:
                formProps.setFieldValue(
                  "brandId",
                  brandOptions
                    .map(option => option.value)
                    .filter(option => !ovationBrands?.includes(option))
                );
                break;
              default:
                formProps.setFieldValue("brandId", []);
            }
          };
          return (
            <React.Fragment>
              <ModalBody>
                <InputTextField name="query" width="full" />
                <Row>
                  <Col>
                    <Input
                      className="me-3"
                      type="radio"
                      onChange={() => clickBrandRadioOption(0)}
                      checked={brandRadioOption === 0}
                    />
                    All Brands
                  </Col>
                  <Col>
                    <Input
                      className="me-3"
                      type="radio"
                      onChange={() => clickBrandRadioOption(1)}
                      checked={brandRadioOption === 1}
                    />
                    All Ovations
                  </Col>
                  <Col>
                    <Input
                      className="me-3"
                      type="radio"
                      onChange={() => clickBrandRadioOption(2)}
                      checked={brandRadioOption === 2}
                    />
                    Non Ovations
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <InputMultiSelectField
                      name="brandId"
                      label="Brand"
                      size="small"
                      width="full"
                      options={brandOptions}
                    />
                    <InputMultiSelectField
                      label="Instrument Type"
                      name="instrumentType"
                      options={instrumentOptions}
                      size="small"
                      width="full"
                    />
                    <InputMultiSelectField
                      label="Number of Strings"
                      name="noOfStrings"
                      options={noOfStringOptions}
                      size="small"
                      width="full"
                    />
                    <InputMultiSelectField
                      label="Sound Scape"
                      name="soundScape"
                      options={soundScapeOptions}
                      size="small"
                      width="full"
                    />
                    <InputMultiSelectField
                      name="tuning"
                      options={tuningOptions}
                      size="small"
                      width="full"
                    />
                  </Col>
                  <Col>
                    <InputMultiSelectField
                      name={FILTER_STATUS}
                      options={statusOptions}
                      size="small"
                      width="full"
                    />
                    <InputMultiSelectField
                      label="Featured Instrument Status"
                      name={FILTER_FEATURED_STATUS}
                      options={statusOptions}
                      size="small"
                      width="full"
                    />
                    <Row className="mt-4">
                      <Col>
                        <InputSelectField
                          name="from_year"
                          label="From Year"
                          width="full"
                          options={yearOptions}
                        />
                      </Col>
                      <Col>
                        <InputSelectField
                          name="to_year"
                          label="To Year"
                          width="full"
                          options={yearOptions}
                        />
                      </Col>
                    </Row>
                    <InputMultiSelectField
                      name="countyOfOrigin"
                      label="Country of Origin"
                      options={countryOptions}
                      size="small"
                      width="full"
                    />
                    <InputMultiSelectField
                      name="color"
                      options={colorOptions}
                      size="small"
                      width="full"
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="me-2"
                  onClick={() => {
                    formProps.setValues(clearedFilters);
                  }}
                  variant="contained"
                  disableElevation
                  color="error"
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
                  Clear
                </Button>
                <Button
                  className="me-2"
                  onClick={() => {
                    formProps.setValues(types.filtersState.defaults.filters);
                  }}
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  <FontAwesomeIcon icon={faArrowRotateLeft} className="me-3" />
                  Reset
                </Button>
                <Button
                  onClick={formProps.handleSubmit}
                  variant="contained"
                  disableElevation
                  color="success"
                  className="font-weight-bold"
                >
                  <FontAwesomeIcon icon={faCircleCheck} className="me-3" />
                  Apply Filter
                </Button>
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default FiltersModal;
