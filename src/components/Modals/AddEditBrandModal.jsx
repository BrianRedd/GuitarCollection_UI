/** @module AddEditBrandModal */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

import { faCircleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import useModalContext from "../../hooks/useModalContext";
import {
  addBrand,
  getBrands,
  updateBrand
} from "../../store/slices/brandsSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import * as types from "../../types/types";
import { SERVER_LOCATION } from "../../utils/constants";
import InputTextField from "../common/InputTextField";
import { getBrandsValidationSchema } from "./data/modalData";

/**
 * @function AddEditBrandModal
 * @returns {React.ReactNode}
 */
const AddEditBrandModal = () => {
  const dispatch = useDispatch();

  const brands = useSelector(state => state.brandsState.list) ?? [];

  const { isOpen, selectedBrand, isEdit } =
    useModalContext("addEditBrandModal");
  const toggle = () => dispatch(toggleToggle({ id: "addEditBrandModal" }));

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEdit ? `Edit ${selectedBrand?.name}` : "New Brand"}
      </ModalHeader>
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
                dispatch(getBrands());
                toggle();
              })
            : dispatch(addBrand(submissionValues)).then(() => {
                actions.resetForm(types.brand.defaults);
                dispatch(getBrands());
                toggle();
              });
        }}
        validationSchema={getBrandsValidationSchema({
          brands,
          thisItem: selectedBrand?._id ? selectedBrand : null
        })}
      >
        {formProps => {
          return (
            <React.Fragment>
              <ModalBody>
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
                        width="wide"
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
                            src={`${SERVER_LOCATION}/brandLogos/${selectedBrand.logo}`}
                            width="100"
                            className="img-thumbnail mt-1"
                            alt={selectedBrand.name}
                          ></img>
                        </Col>
                      )}
                    </Row>
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="me-2"
                  onClick={() => {
                    toggle();
                  }}
                  variant="contained"
                  disableElevation
                  color="error"
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
                  Cancel
                </Button>
                <Button
                  onClick={formProps.handleSubmit}
                  variant="contained"
                  disableElevation
                  color="success"
                  className="font-weight-bold"
                >
                  <FontAwesomeIcon icon={faSave} className="me-3" />
                  {isEdit ? `Save ${selectedBrand.name}` : "Create New Brand"}
                </Button>
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddEditBrandModal;
