/** @module WishListForm */

import React from "react";

import { Col, Form, FormGroup, Row } from "reactstrap";

import useOptions from "../../../hooks/useOptions";

import InputFreeFormField from "../../common/InputFreeFormField";
import InputSelectField from "../../common/InputSelectField";
import InputTextField from "../../common/InputTextField";

/**
 * @function WishListForm
 * @returns {React.ReactNode}
 */
const WishListForm = () => {
  const { brandOptions, instrumentOptions, soundScapeOptions } = useOptions({});

  return (
    <Form>
      <FormGroup>
        <Row>
          <Col xs={4}>
            <InputSelectField
              name="brandId"
              label="Brand"
              required
              options={brandOptions}
              width="full"
            />
          </Col>
          <Col xs={8}>
            <InputTextField name="model" width="full" required />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <InputFreeFormField
              label="Instrument Type"
              name="instrumentType"
              options={instrumentOptions}
              required
              width="full"
            />
          </Col>
          <Col xs={3}>
            <InputTextField
              name="noOfStrings"
              label="Number of Strings"
              required
              otherProps={{
                type: "number"
              }}
              width="full"
            />
          </Col>
          <Col xs={5}>
            <InputFreeFormField
              name="soundScape"
              label="Sound Scape"
              required
              options={soundScapeOptions}
              width="full"
            />
          </Col>
        </Row>
        <Row>
          <InputTextField
            name="notes"
            otherProps={{
              multiline: true,
              rows: 4
            }}
            width="full"
          />
        </Row>
      </FormGroup>
    </Form>
  );
};

export default WishListForm;
