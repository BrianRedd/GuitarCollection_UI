/** @module PurchaseDetailTable */

import React, { useState } from "react";

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

import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OWNERSHIP_STATUS_OPTIONS } from "../data/constants";

export const PurchaseDetailTable = props => {
  const { guitar } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Row className="mt-3">
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        className=" justify-content-start d-flex"
      >
        <h5 className="mt-2 ps-2 text-decoration-underline">
          Purchase History ({(guitar.purchaseHistory ?? []).length})
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
              <TableCell width="250">Ownership Status</TableCell>
              <TableCell>Transaction Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Store / Party</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(guitar.purchaseHistory ?? []).map(row => (
              <TableRow key={row.ownershipStatus}>
                <TableCell component="th" scope="row">
                  <b>
                    {OWNERSHIP_STATUS_OPTIONS?.find(
                      option => option.value === row.ownershipStatus
                    ).label ?? row.ownershipStatus}
                  </b>
                </TableCell>
                <TableCell>{row.where}</TableCell>
                <TableCell>{row.when}</TableCell>
                <TableCell>{row.who}</TableCell>
                <TableCell>
                  <NumericFormat
                    value={row.amount}
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

PurchaseDetailTable.propTypes = {
  guitar: PropTypes.objectOf(PropTypes.any)
};

PurchaseDetailTable.defaultProps = {
  guitar: {}
};

export default PurchaseDetailTable;
