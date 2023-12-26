/** @module Grid */

import React, { useState } from "react";

import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import PropTypes from "prop-types";
import { Table } from "reactstrap";

import { TEXT_ASC, TEXT_DESC } from "../data/constants";

/**
 * @function Grid
 * @returns {React.ReactNode}
 */
const Grid = (props) => {
  const { columnsConfig, defaultSort, gridData, onRowSelect } = props;

  const [sortField, setSortField] = useState(defaultSort?.sortBy ?? "");
  const [sortDirectionAsc, setsortDirectionAsc] = useState(defaultSort?.direction !== TEXT_DESC);

  const columnKeys = Object.keys(columnsConfig ?? {});

  const sortedGridData = sortField
    ? _.orderBy(gridData, sortField, sortDirectionAsc ? TEXT_ASC : TEXT_DESC)
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
            } else setsortDirectionAsc(!sortDirectionAsc);
          }
        }}
      >
        {columnsConfig?.[hrow]?.title ?? ""}
        {sortField === hrow ? (
          <small style={{ opacity: 0.5 }}>
            <FontAwesomeIcon
              icon={sortDirectionAsc ? faArrowDown : faArrowUp}
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

Grid.propTypes = {
  columnsConfig: PropTypes.objectOf(PropTypes.any),
  defaultSort: PropTypes.shape({
    sortBy: PropTypes.string,
    direction: PropTypes.string
  }),
  gridData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  onRowSelect: PropTypes.func
};

Grid.defaultProps = {
  columnsConfig: {},
  defaultSort: {},
  gridData: [],
  onRowSelect: undefined
};

export default Grid;
