/** @module AddEditUserForm */

import React, { useState } from "react";

import {
  faArrowDown,
  faArrowRight,
  faUserAltSlash,
  faUserCheck,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, ButtonBase, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { Collapse } from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import {
  addUser,
  deleteUser,
  getUser,
  updateUser
} from "../../store/slices/userSlice";
import * as types from "../../types/types";
import { ADMIN_PERM, PERMISSIONS_OPTIONS } from "../data/constants";

import InputMultiSelectField from "../common/InputMultiSelectField";
import InputTextField from "../common/InputTextField";

const AddEditUserForm = () => {
  const dispatch = useDispatch();

  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);
  const [message, setMessage] = useState({});

  const hasAdminPermissions = usePermissions(ADMIN_PERM);

  const initialValues = {
    ...types.user.defaults,
    isExistingUser: false,
    isNewUser: false
  };

  return (
    <React.Fragment>
      {hasAdminPermissions && (
        <React.Fragment>
          <ButtonBase
            onClick={() => setIsAddUserFormOpen(!isAddUserFormOpen)}
            className=" justify-content-start d-flex"
          >
            <h5 className="mt-2 ps-2 text-decoration-underline">
              Add/Edit User
              <FontAwesomeIcon
                className="ms-2"
                icon={isAddUserFormOpen ? faArrowDown : faArrowRight}
              />
            </h5>
          </ButtonBase>
          <Collapse isOpen={isAddUserFormOpen}>
            <Formik
              initialValues={initialValues}
              onSubmit={(values, actions) => {
                if (values?.isNewUser) {
                  dispatch(addUser(values));
                } else if (values?.isExistingUser) {
                  dispatch(updateUser(values));
                }
                setIsAddUserFormOpen(false);
                setMessage({});
                actions.resetForm(initialValues);
              }}
            >
              {formProps => (
                <Form>
                  <InputTextField
                    name="username"
                    required
                    width="full"
                    Adornment={
                      <IconButton
                        size="small"
                        onClick={() => {
                          const usernameToLower =
                            formProps.values.username.toLowerCase();
                          formProps.setFieldValue("username", usernameToLower);
                          dispatch(getUser(usernameToLower)).then(response => {
                            if (response?.payload?.error) {
                              formProps.setFieldValue("isNewUser", true);
                              formProps.setFieldValue("isExistingUser", false);
                              setMessage({
                                text: `User ${usernameToLower.toUpperCase()} Available`,
                                type: "success"
                              });
                            } else if (!response) {
                              formProps.setFieldValue("isNewUser", false);
                              formProps.setFieldValue("isExistingUser", false);
                              setMessage({
                                text: "Error Retrieving Users",
                                type: "danger"
                              });
                            } else {
                              formProps.setValues(response?.payload?.data);
                              formProps.setFieldValue("isNewUser", false);
                              formProps.setFieldValue("isExistingUser", true);
                              setMessage({
                                text: `User ${usernameToLower.toUpperCase()} Already Exists`,
                                type: "warning"
                              });
                            }
                          });
                        }}
                        color="info"
                        disabled={!formProps.values.username}
                      >
                        <FontAwesomeIcon icon={faUserCheck} />
                      </IconButton>
                    }
                  />
                  {message.text && (
                    <Alert className="m-0 mb-3" color={message.type}>
                      {message.text}
                    </Alert>
                  )}
                  <InputTextField
                    name="firstname"
                    label="First Name"
                    required
                    width="full"
                    otherProps={{
                      disabled: !(
                        formProps.values?.isNewUser ||
                        formProps.values?.isExistingUser
                      )
                    }}
                  />
                  <InputTextField
                    name="lastname"
                    label="Last Name"
                    required
                    width="full"
                    otherProps={{
                      disabled: !(
                        formProps.values?.isNewUser ||
                        formProps.values?.isExistingUser
                      )
                    }}
                  />
                  <InputMultiSelectField
                    className="mt-3"
                    name="permissions"
                    options={PERMISSIONS_OPTIONS.map(option => ({
                      value: option,
                      label: _.startCase(_.toLower(option.replaceAll("_", " ")))
                    }))}
                    otherProps={{
                      disabled: !(
                        formProps.values?.isNewUser ||
                        formProps.values?.isExistingUser
                      )
                    }}
                    width="full"
                  />
                  <div className="d-flex justify-content-around">
                    {formProps?.values?.isExistingUser && (
                      <Button
                        variant="contained"
                        disableElevation
                        color="error"
                        onClick={() => {
                          dispatch(deleteUser(formProps?.values));
                          setIsAddUserFormOpen(false);
                          setMessage({});
                          formProps.resetForm(initialValues);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faUserAltSlash}
                          className="me-2"
                        />
                        Delete {formProps.values.username}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      disableElevation
                      color="info"
                      onClick={formProps.handleSubmit}
                      disabled={
                        !(
                          formProps.values.username ||
                          formProps.values.isNewUser ||
                          formProps.values?.isExistingUser
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      {formProps.values.isNewUser ? "Add" : "Update"}{" "}
                      {formProps.values.username}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Collapse>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AddEditUserForm;
