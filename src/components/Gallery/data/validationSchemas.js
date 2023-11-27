/** @module validationSchemas */

import * as Yup from "yup";

import { TEXT_REQUIRED } from "../../data/constants";

export const galleryValidationSchema = Yup.object().shape({
  image: Yup.string().required(TEXT_REQUIRED),
  caption: Yup.string().nullable()
});
