/** @module Grid */

import React, { useState } from "react";

import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { Table } from "reactstrap";
import { TEXT_ASC, TEXT_DESC } from "../data/constants";

/**
 * @function Grid
 * @returns {React.ReactNode}
 */
const Grid = (props) => {
  const { columnsConfig, gridData, onRowSelect } = props;

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState(0);

  const columnKeys = Object.keys(columnsConfig ?? {});

  const sortedGridData = sortField
    ? _.orderBy(gridData, sortField, sortDirection ? TEXT_ASC : TEXT_DESC)
    : gridData;

  const TableHeader = () => {
    const tableHeader = columnKeys.map((hrow) => (
      <th
        className="text-nowrap"
        key={hrow}
        onClick={() => {
          if (!columnsConfig?.[hrow]?.isNotSortable) {
            if (sortField !== hrow) {
              setSortField(hrow);
            } else setSortDirection((sortDirection + 1) % 2);
          }
        }}
      >
        {columnsConfig?.[hrow]?.title ?? ""}
        {sortField === hrow ? (
          <small style={{ opacity: 0.5 }}>
            <FontAwesomeIcon
              icon={sortDirection ? faArrowUp : faArrowDown}
              className="ms-1"
            />
          </small>
        ) : (
          "  "
        )}
      </th>
    ));
    return (
      <thead>
        <tr>{tableHeader}</tr>
      </thead>
    );
  };

  const TableRow = ({ row }) => {
    console.log("row", row);
    const tableRow = columnKeys.map((column) => (
      <td key={column}>
        {columnsConfig?.[column]?.cellComponent
          ? columnsConfig?.[column]?.cellComponent(row)
          : row[column]}
      </td>
    ));
    return (
      <tr
        onClick={() => {
          console.log("row", row);
          if (onRowSelect) {
            onRowSelect(row);
          }
        }}
      >
        {tableRow}
      </tr>
    );
  };

  const TableBody = () => {
    const gridRows = sortedGridData.map((row, idx) => (
      <TableRow key={`row_${idx}`} row={row} />
    ));
    return <tbody>{gridRows}</tbody>;
  };

  return (
    <Table responsive>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

Grid.propTypes = {};

Grid.defaultProps = {};

export default Grid;
