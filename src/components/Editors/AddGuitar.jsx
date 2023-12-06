import React from "react";

import { Formik } from "formik";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";

import { addGuitar } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { DATE_FORMAT } from "../data/constants";
import { getGuitarsValidationSchema } from "./data/validationSchemas";

import GuitarForm from "./GuitarForm";
import GuitarFormButtons from "./GuitarFormButtons";

/**
 * @function AddGuitar
 * @returns {React.ReactNode}
 */
const AddGuitar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];

  const initialValues = types.guitar.defaults;

  const submitButtonText = "Add Instrument";

  return (
    <Container fluid="md">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const submissionValues = {
            ...values,
            lastPlayed: values.lastPlayed
              ? moment(values.lastPlayed).format(DATE_FORMAT)
              : ""
          };
          dispatch(addGuitar(submissionValues)).then(response => {
            actions.resetForm(initialValues);
            navigate(
              `/guitar/${response?.payload?.data?._id ?? values?.name ?? ""}`
            );
          });
        }}
        validationSchema={getGuitarsValidationSchema({
          guitars
        })}
      >
        {() => {
          return (
            <React.Fragment>
              <div className="w-100 d-flex justify-content-between">
                <h1>Add Instrument</h1>
                <GuitarFormButtons
                  className=""
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
    </Container>
  );
};

export default AddGuitar;
