/** @module SpecificationsTable */

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

export const SpecificationsTable = props => {
  const { guitar } = props;

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Row className="mt-3">
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        className=" justify-content-start d-flex"
      >
        <h5 className="mt-2 ps-2 text-decoration-underline">
          Specifications ({(guitar.specifications ?? []).length})
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
              <TableCell width="250">Type</TableCell>
              <TableCell>Specification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(guitar.specifications ?? []).map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.specType?.replaceAll("^", "")}
                </TableCell>
                <TableCell>
                  {row.specType?.includes("^") ? (
                    <a
                      href={row.specification}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.specification}
                    </a>
                  ) : (
                    row.specification
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </Row>
  );
};

SpecificationsTable.propTypes = {
  guitar: PropTypes.objectOf(PropTypes.any)
};

SpecificationsTable.defaultProps = {
  guitar: {}
};

export default SpecificationsTable;
