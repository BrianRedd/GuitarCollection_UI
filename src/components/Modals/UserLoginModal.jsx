/** @module UserLoginModal */

import React, { useEffect, useState } from "react";

import {
  faEye,
  faEyeSlash,
  faUser,
  faUserCheck,
  faXmarkCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { Formik } from "formik";
import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { getUser, updateUser, writeUser } from "../../store/slices/userSlice";

import md5Hasher from "../../utils/md5";
import { cookieFunctions } from "../../utils/utils";
import InputTextField from "../common/InputTextField";
import { userLoginValidationSchema } from "./data/modalData";

/**
 * @function UserLoginModal
 * @returns {React.ReactNode}
 */
const UserLoginModal = props => {
  const { isModalOpen, toggle } = props;
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const user = useSelector(state => state.userState?.user) ?? {};

  const [userObject, setUserObject] = useState({});
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const initialValues = {
    isNewPassword: false,
    username: "",
    password: "",
    passwordConfirm: "",
    saveCookie: true
  };

  useEffect(() => {
    if (isModalOpen && _.isEmpty(user)) {
      setIsPasswordVisible(false);
    }
  }, [isModalOpen, user]);

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
    <Modal isOpen={isModalOpen} toggle={toggle}>
      <Formik
        initialValues={initialValues}
        validationSchema={userLoginValidationSchema}
        onSubmit={values => {
          if (values.isNewPassword) {
            const submissionObject = {
              ..._.pick(userObject, [
                "_id",
                "username",
                "firstname",
                "lastname",
                "permissions"
              ]),
              password: md5Hasher(values.password)
            };
            dispatch(updateUser(submissionObject)).then(response => {
              if (response?.payload?.data) {
                dispatch(
                  writeUser({
                    ...response?.payload?.data,
                    ...submissionObject
                  })
                );
                if (values.saveCookie) {
                  cookieFunctions.setCookie(
                    "bgln",
                    `${submissionObject.username}|${submissionObject.password}`
                  );
                } else {
                  cookieFunctions.setCookie("bgln", "");
                }
              }
            });
          } else if (md5Hasher(values.password) === userObject.password) {
            dispatch(writeUser(userObject));
            if (values.saveCookie) {
              cookieFunctions.setCookie(
                "bgln",
                `${userObject.username}|${userObject.password}`
              );
            } else {
              cookieFunctions.setCookie("bgln", "");
            }
          } else {
            setError("Wrong Password");
            return false;
          }
          toggle();
        }}
      >
        {formProps => (
          <React.Fragment>
            <ModalHeader toggle={toggle}>User Login</ModalHeader>
            <ModalBody>
              {error && (
                <Alert className="m-0 mb-3" color={"danger"}>
                  {error}
                </Alert>
              )}
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
                        if (response?.payload?.data) {
                          if (!response.payload.data?.password) {
                            formProps.setFieldValue("isNewPassword", true);
                          }
                          setUserObject(response.payload.data);
                          setError(null);
                        } else {
                          setUserObject({});
                          setError(response?.payload?.message);
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
              {userObject._id && (
                <React.Fragment>
                  {!userObject?.password ? (
                    <React.Fragment>
                      <p>
                        User {userObject?.username} Found, but without password.
                      </p>
                      <InputTextField
                        name="password"
                        required
                        otherProps={{
                          type: isPasswordVisible ? "" : "password"
                        }}
                        width="full"
                        Adornment={EyeAdornment}
                      />
                      <InputTextField
                        name="passwordConfirm"
                        label="Confirm Password"
                        required
                        otherProps={{
                          disabled: !formProps?.values?.password,
                          type: isPasswordVisible ? "" : "password"
                        }}
                        Adornment={EyeAdornment}
                        width="full"
                      />
                    </React.Fragment>
                  ) : (
                    <InputTextField
                      name="password"
                      required
                      otherProps={{
                        type: isPasswordVisible ? "" : "password"
                      }}
                      onChange={evt => {
                        const value = evt.target.value;
                        formProps.setFieldValue("passwordConfirm", value);
                      }}
                      Adornment={EyeAdornment}
                      width="full"
                    />
                  )}
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
                </React.Fragment>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={toggle} className="me-3">
                <FontAwesomeIcon icon={faXmarkCircle} className="me-2" />
                Close
              </Button>
              <Button
                onClick={formProps.handleSubmit}
                variant="contained"
                disableElevation
                color="primary"
                className="font-weight-bold"
                disabled={!formProps.values?.password}
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Login
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      </Formik>
    </Modal>
  );
};

UserLoginModal.propTypes = {
  image: PropTypes.objectOf(PropTypes.any),
  isModalOpen: PropTypes.bool,
  toggle: PropTypes.func
};

UserLoginModal.defaultProps = {
  image: {},
  isModalOpen: false,
  toggle: () => {}
};

export default UserLoginModal;
