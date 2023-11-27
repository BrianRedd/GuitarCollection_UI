/** @module InputFreeFormField */

import React from "react";

import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import _ from "lodash";
import PropTypes from "prop-types";
import { Col } from "reactstrap";

const filter = createFilterOptions();

const InputFreeFormField = props => {
  const {
    className,
    hidden,
    label: labelFromProps,
    name,
    onChange,
    options,
    required,
    size = "small",
    width
  } = props;

  const formProps = useFormikContext();

  const setValue = value => {
    const newValue = value?.title ?? value ?? "";
    formProps.setFieldValue(name, newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const label = labelFromProps || _.capitalize(name);

  const xs = 12;
  let md = 0;
  let lg = 0;
  switch (width) {
    case "wide":
      md = 6;
      lg = 4;
      break;
    case "full":
      md = 12;
      lg = 12;
      break;
    default:
      md = 3;
      lg = 2;
  }

  return (
    <Col
      xs={xs}
      md={md}
      lg={lg}
      className={_.compact(["mb-3", hidden && "d-none", className]).join(" ")}
    >
      <Autocomplete
        onChange={(event, newValue) => {
          if (!newValue) {
            setValue("");
          } else if (typeof newValue === "string") {
            setValue({
              title: newValue
            });
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            setValue({
              title: newValue.inputValue
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            option => inputValue === option.title
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={(options ?? []).map(option => ({
          title: option
        }))}
        getOptionLabel={option => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        fullWidth
        name={name}
        size={size}
        value={_.get(formProps.values, name) ?? ""}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={
              Boolean(_.get(formProps.touched, name)) &&
              Boolean(_.get(formProps.errors, name))
            }
            helperText={_.get(formProps.errors, name)}
          />
        )}
      />
    </Col>
  );
};

InputFreeFormField.propTypes = {
  className: PropTypes.string,
  hidden: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  required: PropTypes.bool,
  size: PropTypes.string,
  width: PropTypes.string
};

InputFreeFormField.defaultProps = {
  className: undefined,
  hidden: false,
  label: undefined,
  lg: 2,
  md: 4,
  name: "",
  onChange: () => {},
  options: [],
  required: false,
  size: "small",
  width: ""
};

export default InputFreeFormField;
