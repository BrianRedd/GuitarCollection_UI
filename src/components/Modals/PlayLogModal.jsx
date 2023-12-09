/** @module PlayLogModal */

import React from "react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import {
  faCircleCheck,
  faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { Formik } from "formik";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import useModalContext from "../../hooks/useModalContext";
import { toggleToggle } from "../../store/slices/toggleSlice";
import { DATE_FORMAT } from "../data/constants";

import { updateGuitar } from "../../store/slices/guitarsSlice";
import EditableGrid from "../Editors/EditableGrid";

/**
 * @function PlayLogModal
 * @returns {React.ReactNode}
 */
const PlayLogModal = () => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.userState?.user) ?? {};

  const { isOpen, guitar, selectAndGoToGuitar, isReadOnly } =
    useModalContext("playLogModal");
  const toggle = () => dispatch(toggleToggle({ id: "playLogModal" }));

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Play Log</ModalHeader>
      <Formik
        initialValues={{
          ...guitar,
          playLog: (guitar?.playLog ?? [])?.map(log => ({
            ...log,
            id: log.id ?? log._id
          }))
        }}
        onSubmit={values => {
          dispatch(updateGuitar(values)).then(() => {
            toggle();
            if (selectAndGoToGuitar) {
              selectAndGoToGuitar(guitar._id);
            }
          });
        }}
      >
        {formProps => {
          const writeArray = (arrayField, rows) => {
            formProps.setFieldValue(arrayField, rows);
          };
          return (
            <React.Fragment>
              <ModalBody>
                <EditableGrid
                  title=""
                  writeArray={writeArray}
                  listName="playLog"
                  fieldDefaults={{
                    playDate: moment(new Date()).format(DATE_FORMAT),
                    playedBy: user.username,
                    notes: ""
                  }}
                  isReadOnly={isReadOnly}
                  gridColumns={[
                    {
                      field: "playDate",
                      headerName: "Date",
                      flex: 1,
                      editable: true,
                      headerClassName: "fst-italic"
                    },
                    {
                      field: "playedBy",
                      headerName: "Played By",
                      flex: 1,
                      editable: true,
                      headerClassName: "fst-italic"
                    },
                    {
                      field: "notes",
                      headerName: "Notes",
                      flex: 2,
                      editable: true,
                      headerClassName: "fst-italic"
                    }
                  ]}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="me-2"
                  onClick={() => {
                    toggle();
                  }}
                  variant="contained"
                  disableElevation
                  color="error"
                >
                  <FontAwesomeIcon icon={faCircleXmark} className="me-3" />
                  Cancel
                </Button>
                {!isReadOnly && (
                  <Button
                    onClick={formProps.handleSubmit}
                    variant="contained"
                    disableElevation
                    color="success"
                    className="font-weight-bold"
                  >
                    <FontAwesomeIcon icon={faCircleCheck} className="me-3" />
                    Record
                  </Button>
                )}
              </ModalFooter>
            </React.Fragment>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default PlayLogModal;
