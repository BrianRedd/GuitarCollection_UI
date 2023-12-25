/** @module GuitarList */

import React, { useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from "@mui/material";
import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Badge, Col, Row } from "reactstrap";

import useFilters from "../../hooks/useFilters";
import { updatePagination } from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { SERVER_LOCATION } from "../../utils/constants";
import { formatDate } from "../../utils/utils";
import {
  ALLOWED_DATE_FORMATS,
  CAPTION_OPTION_FULL_FRONT,
  OWNERSHIP_STATUS_OPTIONS,
  TEXT_ASC,
  TEXT_DESC
} from "../data/constants";

import moment from "moment";
import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/guitarlist.scss";

/**
 * @function GuitarList
 * @returns {ReactNode}
 */
const GuitarList = (props) => {
  const { selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const { list: guitarsFromState = [], pagination = types.guitarsState.defaults } =
    useSelector((state) => state.guitarsState) ?? {};
  const brands = useSelector((state) => state.brandsState?.list) ?? [];
  const gallery = useSelector((state) => state.galleryState?.list) ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filters = useSelector((state) => state.filtersState?.filters) ?? {};

  const applyFilter = useFilters();

  const frontPictures = gallery.filter(
    (image) => image.caption === CAPTION_OPTION_FULL_FRONT
  );

  const guitars = applyFilter(guitarsFromState ?? []).map((guitar) => {
    const rawAcquiredDate =
      guitar?.purchaseHistory?.find(
        (transaction) => transaction.ownershipStatus === "PUR"
      )?.when ?? "";
    const isAcquiredDateValid = moment(
      rawAcquiredDate,
      ALLOWED_DATE_FORMATS,
      true
    ).isValid();
    return {
      ...guitar,
      noOfPictures: (guitar?.pictures ?? []).length,
      dateAcquired: formatDate(rawAcquiredDate ?? "", true),
      lastPlayed: guitar.playLog?.[0]?.playDate || "N/A",
      isAcquiredDateValid
    };
  });

  const numberOfAppliedFilters = useMemo(
    () =>
      Object.keys(filters ?? {}).filter((filter) => {
        return (
          (Array.isArray(filters[filter]) && Boolean(filters[filter].length)) ||
          (!Array.isArray(filters[filter]) && filters[filter])
        );
      }).length,
    [filters]
  );

  const { orderBy, order } = pagination;

  const headCells = [
    {
      id: "noOfPictures",
      label: ""
    },
    {
      id: "name",
      label: "Name"
    },
    {
      id: "brandId",
      label: "Make"
    },
    {
      id: "model",
      label: "Model"
    },
    {
      id: "year",
      label: "Year"
    },
    {
      id: "serialNo",
      label: "S/N"
    },
    {
      id: "status",
      label: "Status"
    },
    {
      id: "dateAcquired",
      label: "Date Acquired"
    },
    {
      id: "lastPlayed",
      label: "Last Played"
    }
  ];

  const gridData = _.orderBy(guitars, [orderBy, "serialNo"], [order, TEXT_ASC]);

  const getNameAdornment = (row) => {
    const lastPurchaseHistory = row?.purchaseHistory?.slice(-1) ?? {};
    const lastOwnershipStatus = lastPurchaseHistory[0]?.ownershipStatus;
    const icon = OWNERSHIP_STATUS_OPTIONS.find(
      (option) => option.value === lastOwnershipStatus
    )?.icon;
    return icon ? (
      <Tooltip
        arrow
        placement="right"
        title={
          OWNERSHIP_STATUS_OPTIONS.find((option) => option.value === lastOwnershipStatus)
            ?.label
        }
      >
        <FontAwesomeIcon icon={icon} className="ms-2" />
      </Tooltip>
    ) : (
      ""
    );
  };

  return (
    <Box sx={{ width: "100%" }} className="p-4">
      <Row>
        <Col>
          <h1>Guitar List</h1>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <h5 onClick={() => dispatch(toggleToggle({ id: "filterModal" }))}>
            ({guitars.length} displayed; {numberOfAppliedFilters} filters applied)
          </h5>
        </Col>
      </Row>
      {guitars.length ? (
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="small">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    className={headCell.id === "iconHolder" ? "icon_holder" : ""}
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.id === "iconHolder" ? (
                      <span>{headCell.label}</span>
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : TEXT_ASC}
                        onClick={() => {
                          dispatch(
                            updatePagination({
                              orderBy: headCell.id,
                              order: order === TEXT_ASC ? TEXT_DESC : TEXT_ASC
                            })
                          );
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gridData.map((row) => {
                const brand =
                  (brands ?? []).find((brand) => brand.id === row.brandId) ?? {};
                const frontPicture = frontPictures.find((picture) =>
                  (row.pictures ?? []).includes(picture._id)
                );
                return (
                  <TableRow
                    key={row._id}
                    onClick={() => {
                      selectAndGoToGuitar(row._id);
                    }}
                  >
                    <TableCell component="th" scope="row" className="text-nowrap">
                      {!_.isEmpty(frontPicture) && (
                        <React.Fragment>
                          <img
                            src={`${SERVER_LOCATION}/gallery/${frontPicture.image}`}
                            height="60"
                            alt={row.name}
                          />
                          {Boolean(row.noOfPictures) && (
                            <Badge color="info" className="picture-badge">
                              {row.noOfPictures}
                            </Badge>
                          )}
                        </React.Fragment>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <b>{row.name}</b>
                      {getNameAdornment(row)}
                    </TableCell>
                    <TableCell>
                      {brand.logo ? (
                        <img
                          src={`${SERVER_LOCATION}/brandLogos/${brand.logo}`}
                          height="45"
                          alt={brand.name}
                        ></img>
                      ) : (
                        brand.name ?? row.brandId
                      )}
                    </TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.serialNo}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.isAcquiredDateValid
                        ? moment(row.dateAcquired).format("MMM YYYY")
                        : row.dateAcquired}
                    </TableCell>
                    <TableCell>{row.lastPlayed}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert className="m-0" color={"danger"}>
          No Guitars Found
        </Alert>
      )}
    </Box>
  );
};

GuitarList.propTypes = {
  selectAndGoToGuitar: PropTypes.func,
  editGuitar: PropTypes.func
};

GuitarList.defaultProps = {
  selectAndGoToGuitar: () => {},
  editGuitar: () => {}
};

export default GuitarList;
