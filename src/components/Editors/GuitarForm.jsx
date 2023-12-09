/** @module GuitarForm */

import React, { useState } from "react";

import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Col, Form, FormGroup, Row } from "reactstrap";

import useOptions from "../../hooks/useOptions";
import usePermissions from "../../hooks/usePermissions";
import { SERVER_LOCATION } from "../../utils/constants";
import { getDateFromOvationSN } from "../../utils/dateFromSN";
import { getColWidth } from "../../utils/utils";
import {
  CAPTION_OPTION_FULL_FRONT,
  OWNERSHIP_STATUS_OPTIONS,
  PURCHASE_PERM,
  SPEC_OPTIONS_DEFAULTS,
  TODO_OPTIONS_DEFAULTS
} from "../data/constants";

import EditableGrid from "../common/EditableGrid";
import InputFreeFormField from "../common/InputFreeFormField";
import InputSelectField from "../common/InputSelectField";
import InputTextField from "../common/InputTextField";

/**
 * @function GuitarForm
 * @returns {React.ReactNode}
 */
const GuitarForm = props => {
  const { initialValues } = props;

  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const hasPurchaseHistoryPermissions = usePermissions(PURCHASE_PERM);

  const [snComment, setSnComment] = useState(null);

  const formProps = useFormikContext();

  const isEdit = Boolean(initialValues._id);

  const {
    brandOptions,
    countryOptions,
    instrumentOptions,
    soundScapeOptions,
    colorOptions,
    statusOptions,
    tuningOptions,
    siblingOptions
  } = useOptions();

  const writeArray = (arrayField, rows) => {
    formProps.setFieldValue(arrayField, rows);
  };

  const frontPictures = gallery.filter(
    image => image.caption === CAPTION_OPTION_FULL_FRONT
  );
  const thumbnail = frontPictures.find(picture =>
    (initialValues.pictures ?? []).includes(picture._id)
  );

  return (
    <Form>
      <FormGroup>
        <Row>
          {thumbnail && (
            <Col {...getColWidth()} className="brand-logo">
              <img
                src={`${SERVER_LOCATION}/gallery/${thumbnail.image}`}
                alt={initialValues.name}
              ></img>
            </Col>
          )}
          <Col>
            {isEdit ? (
              <Row className="border my-4 pt-3">
                <InputFreeFormField
                  name="status"
                  required
                  options={statusOptions}
                  width="wide"
                />
                <InputFreeFormField
                  name="tuning"
                  options={tuningOptions}
                  width="wide"
                />
                <InputTextField
                  name="lastPlayed"
                  label="Last Played"
                  otherProps={{
                    type: "date",
                    InputLabelProps: { shrink: true }
                  }}
                  width="wide"
                />
              </Row>
            ) : null}
            <Row>
              <InputTextField name="name" required />
              <InputSelectField
                name="brandId"
                label="Brand"
                required
                options={brandOptions}
              />
              <InputTextField name="model" required />
              <InputTextField
                name="serialNo"
                label="S/N"
                required
                Adornment={
                  <IconButton
                    onClick={() => {
                      const dateFromSN = getDateFromOvationSN({
                        brandId: formProps.values.brandId,
                        serialNo: formProps.values.serialNo
                      });
                      formProps.setFieldValue("year", dateFromSN.year ?? "");
                      setSnComment(dateFromSN.comment ?? "");
                    }}
                    disabled={
                      !formProps.values.brandId || !formProps.values.serialNo
                    }
                    color="info"
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </IconButton>
                }
              />
              <InputTextField name="year" required helperText={snComment} />
              <InputFreeFormField
                name="countyOfOrigin"
                label="Country of Origin"
                options={countryOptions}
              />
              <InputTextField name="case" width="wide" />
              <InputFreeFormField
                label="Instrument Type"
                name="instrumentType"
                options={instrumentOptions}
                required
              />
              <InputTextField
                name="noOfStrings"
                label="Number of Strings"
                required
                otherProps={{
                  type: "number"
                }}
              />
              <InputFreeFormField
                name="soundScape"
                label="Sound Scape"
                required
                options={soundScapeOptions}
                width="wide"
              />
              <InputFreeFormField
                name="color"
                required
                options={colorOptions}
                width="wide"
              />
              <InputTextField
                name="appearanceNotes"
                label="Notes on Appearance"
                width="wide"
              />
              <InputSelectField
                name="sibling"
                options={siblingOptions}
                width="wide"
              />
            </Row>
          </Col>
        </Row>
        <Row>
          <InputTextField
            name="story"
            otherProps={{
              multiline: true,
              rows: 4
            }}
            width="full"
          />
        </Row>
        {isEdit ? null : (
          <Row>
            <InputFreeFormField
              name="status"
              required
              options={statusOptions}
              width="wide"
            />
            <InputFreeFormField
              name="tuning"
              options={tuningOptions}
              width="wide"
            />
            <InputTextField
              name="lastPlayed"
              label="Last Played"
              otherProps={{
                type: "date",
                InputLabelProps: { shrink: true }
              }}
            />
          </Row>
        )}
        {hasPurchaseHistoryPermissions && (
          <EditableGrid
            title="Purchase History"
            writeArray={writeArray}
            listName="purchaseHistory"
            fieldDefaults={{
              ownershipStatus: !formProps?.values?.purchaseHistory.length
                ? "PUR"
                : "",
              where: "",
              when: "",
              who: "",
              amount: null,
              notes: ""
            }}
            gridColumns={[
              {
                field: "ownershipStatus",
                headerName: "Ownership Status",
                flex: 1,
                editable: true,
                type: "singleSelect",
                valueOptions: OWNERSHIP_STATUS_OPTIONS,
                getOptionValue: value => value.value,
                getOptionLabel: value => value.label,
                headerClassName: "fst-italic"
              },
              {
                field: "where",
                headerName: "Transaction Location",
                flex: 1,
                editable: true,
                headerClassName: "fst-italic"
              },
              {
                field: "when",
                headerName: "Date",
                flex: 1,
                editable: true,
                headerClassName: "fst-italic"
              },
              {
                field: "who",
                headerName: "Store / Party",
                flex: 1,
                editable: true,
                headerClassName: "fst-italic"
              },
              {
                field: "amount",
                headerName: "Amount",
                type: "number",
                flex: 1,
                align: "right",
                headerAlign: "right",
                editable: true,
                valueFormatter: params => {
                  if (params.value == null) {
                    return "";
                  }
                  return `$ ${params.value.toLocaleString()}`;
                },
                headerClassName: "fst-italic"
              },
              {
                field: "notes",
                headerName: "Notes",
                flex: 1.5,
                editable: true,
                headerClassName: "fst-italic"
              }
            ]}
          />
        )}
        <EditableGrid
          title="Specifications"
          writeArray={writeArray}
          listName="specifications"
          fieldDefaults={{
            specType: "",
            specification: ""
          }}
          gridColumns={[
            {
              field: "specType",
              headerName: "Type",
              flex: 0.3,
              editable: true,
              type: "singleSelect",
              valueOptions: SPEC_OPTIONS_DEFAULTS,
              getOptionValue: value => value,
              getOptionLabel: value => value.replaceAll("^", ""),
              headerClassName: "fst-italic"
            },
            {
              field: "specification",
              headerName: "Specification",
              editable: true,
              flex: 1,
              headerClassName: "fst-italic"
            }
          ]}
        />
        <EditableGrid
          title="To Do List"
          writeArray={writeArray}
          listName="todoList"
          fieldDefaults={{
            todoItem: "",
            status: "",
            completionDate: "",
            notes: ""
          }}
          gridColumns={[
            {
              field: "todoItem",
              headerName: "To Do Task",
              editable: true,
              flex: 3,
              headerClassName: "fst-italic"
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              editable: true,
              type: "singleSelect",
              valueOptions: TODO_OPTIONS_DEFAULTS,
              headerClassName: "fst-italic"
            },
            {
              field: "completionDate",
              headerName: "Completed On",
              editable: true,
              flex: 1,
              headerClassName: "fst-italic"
            },
            {
              field: "notes",
              headerName: "Notes",
              editable: true,
              flex: 2,
              headerClassName: "fst-italic"
            }
          ]}
        />
        <EditableGrid
          title="Maintenance History"
          writeArray={writeArray}
          listName="maintenance"
          fieldDefaults={{
            maintenanceType: "",
            maintenanceDate: "",
            whoBy: "",
            cost: null,
            notes: ""
          }}
          gridColumns={[
            {
              field: "maintenanceType",
              headerName: "Maintenance Type",
              editable: true,
              flex: 3,
              headerClassName: "fst-italic"
            },
            {
              field: "maintenanceDate",
              headerName: "Date",
              editable: true,
              flex: 1,
              headerClassName: "fst-italic"
            },
            {
              field: "whoBy",
              headerName: "Performed By",
              flex: 1,
              editable: true,
              headerClassName: "fst-italic"
            },
            {
              field: "cost",
              headerName: "Cost",
              type: "number",
              flex: 1,
              align: "right",
              headerAlign: "right",
              editable: true,
              valueFormatter: params => {
                if (params.value == null) {
                  return "";
                }
                return `$ ${params.value.toLocaleString()}`;
              },
              headerClassName: "fst-italic"
            },
            {
              field: "notes",
              headerName: "Notes",
              editable: true,
              flex: 2,
              headerClassName: "fst-italic"
            }
          ]}
        />
      </FormGroup>
    </Form>
  );
};

GuitarForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.objectOf(PropTypes.any)
};

GuitarForm.defaultTypes = {
  handleSubmit: () => {},
  initialValues: {}
};

export default GuitarForm;
