/** @module TodoList */

import React, { useState } from "react";

import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ButtonBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import PropTypes from "prop-types";
import { Collapse, Row } from "reactstrap";

export const TodoList = props => {
  const { guitar } = props;

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Row className="mt-3">
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        className=" justify-content-start d-flex"
      >
        <h5 className="mt-2 ps-2 text-decoration-underline">
          To Do List ({(guitar.todoList ?? []).length})
          <FontAwesomeIcon
            className="ms-2"
            icon={isOpen ? faArrowDown : faArrowRight}
          />
        </h5>
      </ButtonBase>
      <Collapse isOpen={isOpen}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Completion Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(guitar.todoList ?? []).map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.todoItem}
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.completionDate}</TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </Row>
  );
};

TodoList.propTypes = {
  guitar: PropTypes.objectOf(PropTypes.any)
};

TodoList.defaultProps = {
  guitar: {}
};

export default TodoList;
