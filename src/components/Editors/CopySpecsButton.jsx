/** @module CopySpecsButton */

import React, { useState } from "react";

import {
  faCheckCircle,
  faCircleXmark,
  faCopy
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import { Formik, useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Row } from "reactstrap";
import useOptions from "../../hooks/useOptions";
import InputSelectField from "../common/InputSelectField";

const CopySpecsButton = props => {
  const { writeArray } = props;
  const guitars = useSelector(state => state.guitarsState?.list) ?? [];

  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const parentFormProps = useFormikContext();

  const { otherGuitarOptions } = useOptions({
    guitarId: parentFormProps?.values?._id
  });

  return (
    <React.Fragment>
      {isSelectVisible ? (
        <Formik
          initialValues={{
            sourceGuitar: parentFormProps?.values?.sibling ?? ""
          }}
          onSubmit={values => {
            const updatedSpecifications = [
              ...(guitars.find(guitar => guitar._id === values.sourceGuitar)
                ?.specifications ?? []),
              ...(parentFormProps.values?.specifications ?? [])
            ];
            writeArray("specifications", updatedSpecifications);
          }}
        >
          {formProps => (
            <React.Fragment>
              <Row style={{ width: "200px" }}>
                <InputSelectField
                  name="sourceGuitar"
                  label="Source Guitar"
                  options={otherGuitarOptions}
                  width="full"
                  compact
                />
              </Row>
              <IconButton
                onClick={() => {
                  formProps.resetForm();
                  setIsSelectVisible(false);
                }}
                color="error"
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </IconButton>
              <IconButton
                onClick={values => {
                  formProps.handleSubmit(values);
                  setIsSelectVisible(false);
                }}
                color="success"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </IconButton>
            </React.Fragment>
          )}
        </Formik>
      ) : (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          startIcon={<FontAwesomeIcon icon={faCopy} />}
          onClick={() => setIsSelectVisible(!isSelectVisible)}
        >
          Copy Specs
        </Button>
      )}
    </React.Fragment>
  );
};

export default CopySpecsButton;
