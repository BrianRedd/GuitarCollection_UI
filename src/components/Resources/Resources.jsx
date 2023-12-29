/** @module Resources */

import React, { useState } from "react";

import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { Formik } from "formik";
import { Col, Container, Row } from "reactstrap";
import { getDateFromOvationSN } from "../../utils/dateFromSN";
import InputTextField from "../common/InputTextField";

/**
 * @function Resources
 * @returns {React.ReactNode}
 */
const Resources = () => {
  const [snComment, setSnComment] = useState(null);

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <h1 className="mb-5">Tools &amp; Resources</h1>
        </Col>
      </Row>
      <Formik
        initialValues={{
          brandId: "OV"
        }}
      >
        {(formProps) => (
          <Row className="align-content-center">
            <Col xs={12} md={4}>
              <h5>Date Your Ovation from S/N</h5>
            </Col>
            <Col xs={12} md={4}>
              <InputTextField
                name="serialNo"
                label="Ovation S/N"
                width="full"
                Adornment={
                  <IconButton
                    onClick={() => {
                      const dateFromSN = getDateFromOvationSN({
                        brandId: formProps.values.brandId,
                        serialNo: formProps.values.serialNo
                      });
                      formProps.setFieldValue("year", dateFromSN.year || "S/N Not Found");
                      setSnComment(dateFromSN.comment ?? "");
                    }}
                    disabled={!formProps.values.brandId || !formProps.values.serialNo}
                    color="info"
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </IconButton>
                }
              />
            </Col>
            <Col xs={12} md={4}>
              <InputTextField name="year" width="full" helperText={snComment} />
            </Col>
          </Row>
        )}
      </Formik>
    </Container>
  );
};

export default Resources;
