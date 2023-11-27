/** @module MaintenanceTable */

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
import { NumericFormat } from "react-number-format";
import { Collapse, Row } from "reactstrap";

export const MaintenanceTable = props => {
  const { guitar } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Row className="mt-3">
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        className=" justify-content-start d-flex"
      >
        <h5 className="mt-2 ps-2 text-decoration-underline">
          Maintenance History ({(guitar.maintenance ?? []).length})
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
              <TableCell width="250">Maintenance Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Who By</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(guitar.maintenance ?? []).map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.maintenanceType}
                </TableCell>
                <TableCell>{row.maintenanceDate}</TableCell>
                <TableCell>{row.whoBy}</TableCell>
                <TableCell>
                  <NumericFormat
                    value={row.cost}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    prefix={"$"}
                    displayType="text"
                  />
                </TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </Row>
  );
};

MaintenanceTable.propTypes = {
  guitar: PropTypes.objectOf(PropTypes.any)
};

MaintenanceTable.defaultProps = {
  guitar: {}
};

export default MaintenanceTable;
