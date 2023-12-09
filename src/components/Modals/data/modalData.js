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

export const getBrandsValidationSchema = ({ brands, thisItem }) =>
  Yup.object().shape({
    name: Yup.string()
      .required(TEXT_REQUIRED)
      .test("unique", "Name must be unique.", value => {
        const isNotUnique =
          (brands ?? []).some(brand => brand.name === value) &&
          (!thisItem || (thisItem && value !== thisItem.name));
        return !isNotUnique;
      }),
    id: Yup.string()
      .required(TEXT_REQUIRED)
      .test("unique", "Id must be unique.", value => {
        const isNotUnique =
          (brands ?? []).some(brand => brand.id === value) &&
          (!thisItem || (thisItem && value !== thisItem.id));
        return !isNotUnique;
      }),
    logo: Yup.string().required(TEXT_REQUIRED),
    notes: Yup.string().nullable()
  });
