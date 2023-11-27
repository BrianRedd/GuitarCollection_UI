import React from "react";

import { Box } from "@mui/system";
import { Formik } from "formik";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "reactstrap";

import { getGuitars, updateGuitar } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { DATE_FORMAT, INSTRUMENT_OPTION_GUITAR } from "../data/constants";
import { getGuitarsValidationSchema } from "./data/validationSchemas";

import GuitarForm from "./GuitarForm";
import GuitarFormButtons from "./GuitarFormButtons";

/**
 * @function EditGuitar
 * @returns {React.ReactNode}
 */
const EditGuitar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: matchId } = useParams();

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];

  const initialValues = {
    ...types.guitar.defaults,
    ...guitars.find(guitar => guitar._id === matchId || guitar.name === matchId)
  };

  const submitButtonText = `Update ${
    initialValues.instrumentType ?? INSTRUMENT_OPTION_GUITAR
  }`;

  return (
    <Box sx={{ width: "100%" }} className="p-4">
      {initialValues?._id && matchId ? (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            const submissionValues = {
              ...values,
              lastPlayed: values.lastPlayed
                ? moment(values.lastPlayed).format(DATE_FORMAT)
                : ""
            };
            dispatch(updateGuitar(submissionValues)).then(() => {
              dispatch(getGuitars()).then(() => {
                actions.resetForm(initialValues);
                navigate(`/guitar/${values?._id ?? values?.name ?? ""}`);
              });
            });
          }}
          validationSchema={getGuitarsValidationSchema({
            isEdit: true,
            guitars
          })}
        >
          {formProps => {
            return (
              <React.Fragment>
                <div className="w-100 d-flex justify-content-between">
                  <h1>Edit {initialValues.name ?? "Guitar"}</h1>
                  <GuitarFormButtons
                    submitButtonText={submitButtonText}
                    initialValues={initialValues}
                  />
                </div>
                <GuitarForm
                  initialValues={initialValues}
                  submitButtonText={submitButtonText}
                />
              </React.Fragment>
            );
          }}
        </Formik>
      ) : (
        <Alert className="m-0" color={"danger"}>
          {matchId ?? "Item"} Not Found or Valid
        </Alert>
      )}
    </Box>
  );
};

export default EditGuitar;
