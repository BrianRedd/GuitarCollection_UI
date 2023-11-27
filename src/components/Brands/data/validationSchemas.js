/** @module validationSchemas */

import * as Yup from "yup";

import { TEXT_REQUIRED } from "../../data/constants";

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
