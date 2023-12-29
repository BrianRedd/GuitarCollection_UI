/** @module validationSchemas */

import * as Yup from "yup";

import { TEXT_REQUIRED } from "../../../data/constants";

export const wishListValidationSchema = Yup.object().shape({
  brandId: Yup.string().ensure().required(TEXT_REQUIRED),
  model: Yup.string().ensure().required(TEXT_REQUIRED),
  instrumentType: Yup.string().ensure().required(TEXT_REQUIRED),
  noOfStrings: Yup.number().required(TEXT_REQUIRED),
  soundScape: Yup.string().ensure().required(TEXT_REQUIRED),
  notes: Yup.string().nullable()
});
