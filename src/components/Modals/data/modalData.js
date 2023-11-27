/** @module modalData */

import * as Yup from "yup";

import { TEXT_REQUIRED } from "../../data/constants";

export const userLoginValidationSchema = Yup.object().shape({
  isNewPassword: Yup.boolean(),
  username: Yup.string().required(TEXT_REQUIRED),
  password: Yup.string().required(TEXT_REQUIRED),
  passwordConfirm: Yup.string()
    .nullable()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    })
});

export const manageUserValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().nullable(),
  newPassword: Yup.string()
    .nullable()
    .test("required", TEXT_REQUIRED, function (value) {
      return !(Boolean(this.parent.oldPassword) && !value);
    }),
  passwordConfirm: Yup.string()
    .nullable()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.newPassword === value;
    })
});
