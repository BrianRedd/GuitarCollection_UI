/** @module validationSchemas */

import * as Yup from "yup";

import { TEXT_REQUIRED } from "../../data/constants";

export const getGuitarsValidationSchema = ({ guitars, isEdit }) => {
  const usedNames = (guitars ?? []).map(guitar => guitar.name);
  return Yup.object().shape({
    name: Yup.string()
      .ensure()
      .required(TEXT_REQUIRED)
      .test(
        "unique",
        "Name has already been used",
        value => isEdit || (value && !usedNames.includes(value))
      ),
    brandId: Yup.string().ensure().required(TEXT_REQUIRED),
    model: Yup.string().ensure().required(TEXT_REQUIRED),
    serialNo: Yup.string().ensure().required(TEXT_REQUIRED),
    year: Yup.string().nullable(),
    countyOfOrigin: Yup.string().nullable(),
    case: Yup.string().nullable(),
    instrumentType: Yup.string().ensure().required(TEXT_REQUIRED),
    noOfStrings: Yup.number().required(TEXT_REQUIRED),
    soundScape: Yup.string().ensure().required(TEXT_REQUIRED),
    color: Yup.string().ensure().required(TEXT_REQUIRED),
    appearanceNotes: Yup.string().nullable(),
    purchaseHistory: Yup.array().of(
      Yup.object().shape({
        ownershipStatus: Yup.string().nullable(),
        where: Yup.string().nullable(),
        when: Yup.string().nullable(),
        who: Yup.string().nullable(),
        amount: Yup.number().nullable()
      })
    ),
    story: Yup.string().nullable(),
    status: Yup.string().ensure().required(TEXT_REQUIRED),
    tuning: Yup.string().nullable(),
    lastPlayed: Yup.string().nullable()
  });
};
