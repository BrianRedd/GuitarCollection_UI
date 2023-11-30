/** @module FiltersModal */

import React from "react";

import { faCircleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

import useOptions from "../../hooks/useOptions";
import { writeFilters } from "../../store/slices/filtersSlice";
import * as types from "../../types/types";

import InputMultiSelectField from "../common/InputMultiSelectField";
import InputSelectField from "../common/InputSelectField";
import InputTextField from "../common/InputTextField";
import { FILTER_FEATURED_STATUS, FILTER_STATUS } from "../data/constants";

/**
 * @function FiltersModal
 * @returns {React.ReactNode}
 */
const FiltersModal = props => {
  const { isModalOpen, toggle } = props;

  const dispatch = useDispatch();

  const filters = useSelector(state => state.filtersState.filters) ?? {};

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
  } = useOptions();

  return (
    <Modal isOpen={isModalOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Apply Filters</ModalHeader>
      <Formik
        initialValues={filters}
        onSubmit={values => {
          dispatch(writeFilters(values));
          toggle();
        }}
        enableReinitialize
      >
        {formProps => (
          <React.Fragment>
            <ModalBody>
              <InputTextField name="query" width="full" />
              <Row>
                <Col>
                  <Row>
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
                    name="brandId"
                    label="Brand"
                    size="small"
                    width="full"
                    options={brandOptions}
                  />
                  <InputMultiSelectField
                    name="countyOfOrigin"
                    label="Country of Origin"
                    options={countryOptions}
                    size="small"
                    width="full"
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
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <InputTextField
                        name="from_lastPlayed"
                        label="From Last Played"
                        width="full"
                        otherProps={{
                          type: "date",
                          InputLabelProps: { shrink: true }
                        }}
                      />
                    </Col>
                    <Col>
                      <InputTextField
                        name="to_lastPlayed"
                        label="To Last Played"
                        width="full"
                        otherProps={{
                          type: "date",
                          InputLabelProps: { shrink: true }
                        }}
                      />
                    </Col>
                  </Row>
                  <InputMultiSelectField
                    name="color"
                    options={colorOptions}
                    size="small"
                    width="full"
                  />
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
                  <InputMultiSelectField
                    name="tuning"
                    options={tuningOptions}
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
                  formProps.setValues(types.filtersState.defaults.filters);
                }}
                variant="outlined"
                color="secondary"
              >
                <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
                Clear
              </Button>
              <Button
                onClick={formProps.handleSubmit}
                variant="contained"
                disableElevation
                color="primary"
                className="font-weight-bold"
              >
                <FontAwesomeIcon icon={faSave} className="me-3" />
                Apply Filter
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </Formik>
    </Modal>
  );
};

FiltersModal.propTypes = {
  isModalOpen: PropTypes.bool,
  toggle: PropTypes.func
};

FiltersModal.defaultProps = {
  isModalOpen: false,
  toggle: () => {}
};

export default FiltersModal;
