/** @module ManageUserModal */

import React, { useState } from "react";

import {
  faArrowDown,
  faArrowRight,
  faEye,
  faEyeSlash,
  faUserPen,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  IconButton
} from "@mui/material";
import { Formik } from "formik";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

import { updateUser, writeUser } from "../../../store/slices/userSlice";

import useModalContext from "../../../hooks/useModalContext";
import usePermissions from "../../../hooks/usePermissions";
import { toggleToggle } from "../../../store/slices/toggleSlice";
import md5Hasher from "../../../utils/md5";
import { cookieFunctions, getUserName } from "../../../utils/utils";
import { ADMIN_PERM, PERMISSIONS_OPTIONS } from "../../data/constants";
import { manageUserValidationSchema } from "../data/modalData";

import InputMultiSelectField from "../../common/InputMultiSelectField";
import InputTextField from "../../common/InputTextField";
import AddEditUserForm from "./AddEditUserForm";

/**
 * @function ManageUserModal
 * @returns {React.ReactNode}
 */
const ManageUserModal = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.userState) ?? {};

  const { isOpen } = useModalContext("manageUserModal");
  const toggle = () => dispatch(toggleToggle({ id: "manageUserModal" }));

  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasAdminPermissions = usePermissions(ADMIN_PERM);

  const initialValues = {
    ...user,
    permissions: user.permissions ?? [],
    oldPassword: "",
    newPassword: "",
    passwordConfirm: "",
    saveCookie: true
  };

  const EyeAdornment = (
    <IconButton
      size="small"
      onClick={() => {
        setIsPasswordVisible(!isPasswordVisible);
      }}
      color="info"
    >
      <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
    </IconButton>
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Formik
        initialValues={initialValues}
        validationSchema={manageUserValidationSchema}
        onSubmit={values => {
          const submissionObject = _.pick(values, [
            "_id",
            "username",
            "firstname",
            "lastname",
            "permissions",
            "password"
          ]);
          if (values.newPassword) {
            submissionObject.password = md5Hasher(values.newPassword);
          }
          dispatch(updateUser(submissionObject)).then(response => {
            if (response?.payload?.data) {
              const userObject = {
                ...response?.payload?.data,
                ...submissionObject
              };
              dispatch(writeUser(userObject));
              if (values.saveCookie) {
                cookieFunctions.setCookie(
                  "bgln",
                  `${userObject.username}|${userObject.password}`
                );
              } else {
                cookieFunctions.setCookie("bgln", "");
              }
            }
          });
          toggle();
        }}
      >
        {formProps => (
          <React.Fragment>
            <ModalHeader toggle={toggle}>
              Manage {getUserName(user)} ({user.username})
            </ModalHeader>
            <ModalBody>
              <InputTextField
                name="firstname"
                label="First Name"
                required
                width="full"
              />
              <InputTextField name="lastname" label="Last Name" width="full" />

              <ButtonBase
                onClick={() => setIsUpdatePasswordOpen(!isUpdatePasswordOpen)}
                className=" justify-content-start d-flex"
              >
                <h6 className="mt-2 ps-2 text-decoration-underline">
                  Update Password
                  <FontAwesomeIcon
                    className="ms-2"
                    icon={isUpdatePasswordOpen ? faArrowDown : faArrowRight}
                  />
                </h6>
              </ButtonBase>
              <Collapse isOpen={isUpdatePasswordOpen}>
                <InputTextField
                  name="oldPassword"
                  label="Old Password"
                  otherProps={{
                    type: isPasswordVisible ? "" : "password"
                  }}
                  width="full"
                  Adornment={EyeAdornment}
                />
                <InputTextField
                  name="newPassword"
                  label="New Password"
                  required={Boolean(formProps?.values?.oldPassword)}
                  otherProps={{
                    disabled:
                      md5Hasher(formProps?.values?.oldPassword) !==
                      user.password,
                    type: isPasswordVisible ? "" : "password"
                  }}
                  width="full"
                  Adornment={EyeAdornment}
                />
                <InputTextField
                  name="passwordConfirm"
                  label="Confirm New Password"
                  required={Boolean(formProps?.values?.oldPassword)}
                  otherProps={{
                    disabled: !formProps?.values?.newPassword,
                    type: isPasswordVisible ? "" : "password"
                  }}
                  Adornment={EyeAdornment}
                  width="full"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formProps.values?.saveCookie}
                      onChange={() =>
                        formProps.setFieldValue(
                          "saveCookie",
                          !formProps.values?.saveCookie
                        )
                      }
                    />
                  }
                  label="Remember Me"
                />
              </Collapse>
              {hasAdminPermissions && (
                <InputMultiSelectField
                  className="mt-3"
                  name="permissions"
                  options={PERMISSIONS_OPTIONS.map(option => ({
                    value: option,
                    label: _.startCase(_.toLower(option.replaceAll("_", " ")))
                  }))}
                  width="full"
                />
              )}
              <AddEditUserForm />
            </ModalBody>
            <ModalFooter className="d-flex justify-content-around">
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={() => {
                  dispatch(writeUser({}));
                  cookieFunctions.setCookie("bgln", "");
                  toggle();
                }}
              >
                <FontAwesomeIcon icon={faUserSlash} className="me-2" />
                Logout
              </Button>
              <Button
                variant="contained"
                disableElevation
                color="success"
                onClick={formProps.handleSubmit}
              >
                <FontAwesomeIcon icon={faUserPen} className="me-2" />
                Update {getUserName(user)}
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </Formik>
    </Modal>
  );
};

export default ManageUserModal;
