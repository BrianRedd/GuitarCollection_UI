/** @module EditableGrid */

import React, { useEffect, useState } from "react";

import {
  faCircleXmark,
  faPenToSquare,
  faPlus,
  faSave,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";

const EditToolbar = props => {
  const { setRows, setRowModesModel, title, fieldDefaults, CustomButton } =
    props;

  const createNewRow = () => {
    const id = randomId();
    setRows(oldRows => [
      {
        id,
        ...fieldDefaults,
        isNew: true
      },
      ...oldRows
    ]);
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: Object.keys(fieldDefaults ?? {})[0]
      }
    }));
  };

  return (
    <GridToolbarContainer className="d-flex justify-content-between p-2">
      <h5>{title}</h5>
      <div className="d-inline-flex">
        {CustomButton}
        <Button
          className="ms-3"
          variant="contained"
          disableElevation
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={createNewRow}
        >
          Add Entry
        </Button>
      </div>
    </GridToolbarContainer>
  );
};

/**
 * @function EditableGrid
 * @returns {React.ReactNode}
 */
const EditableGrid = props => {
  const {
    writeArray,
    listName,
    gridColumns,
    title,
    fieldDefaults,
    isReadOnly,
    CustomButton
  } = props;
  const formProps = useFormikContext();

  const sourceRows = formProps?.values?.[listName];

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    setRows(sourceRows ?? []);
  }, [sourceRows]);

  const writeList = rows => {
    writeArray(listName, rows);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = id => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = id => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View }
    });
    writeList(rows);
  };

  const handleDeleteClick = id => () => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
    writeList(newRows);
  };

  const handleCancelClick = id => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find(row => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const processRowUpdate = newRow => {
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map(row => (row.id === newRow.id ? updatedRow : row));
    setRows(newRows);
    writeList(newRows);
    return updatedRow;
  };

  const handleRowModesModelChange = newRowModesModel => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    ...gridColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FontAwesomeIcon icon={faCircleXmark} />}
              label="Cancel"
              className="text-danger"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<FontAwesomeIcon icon={faSave} />}
              label="Save"
              className="text-success"
              onClick={handleSaveClick(id)}
            />
          ];
        }

        return isReadOnly
          ? []
          : [
              <GridActionsCellItem
                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                label="Edit"
                onClick={handleEditClick(id)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={<FontAwesomeIcon icon={faTrash} />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="warning"
              />
            ];
      }
    }
  ];

  return (
    <Box
      sx={{
        width: "100%",
        "& .actions": {
          color: "text.secondary"
        },
        "& .textPrimary": {
          color: "text.primary"
        }
      }}
      className="mb-3"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        hideFooter={true}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={
          isReadOnly
            ? {}
            : {
                toolbar: toolBarProps => (
                  <EditToolbar
                    {...toolBarProps}
                    title={title}
                    fieldDefaults={fieldDefaults}
                    CustomButton={CustomButton}
                  />
                )
              }
        }
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}
      />
    </Box>
  );
};

EditableGrid.propTypes = {
  writeList: PropTypes.func,
  listName: PropTypes.string,
  gridColumns: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.string,
  fieldDefaults: PropTypes.objectOf(PropTypes.any),
  isReadOnly: PropTypes.bool,
  CustomButton: PropTypes.node
};

EditableGrid.defaultProps = {
  writeList: () => {},
  listName: "",
  gridColumns: [],
  title: "",
  fieldDefaults: {},
  isReadOnly: false,
  CustomButton: undefined
};

export default EditableGrid;
