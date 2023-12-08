/** @module GuitarList */

import React from "react";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
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
import { Alert, Badge } from "reactstrap";

import useFilters from "../../hooks/useFilters";
import usePermissions from "../../hooks/usePermissions";
import {
  removeGuitar,
  updatePagination
} from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import { serverLocation } from "../../utils/constants";
import { formatDate } from "../../utils/utils";
import {
  ALLOWED_DATE_FORMATS,
  CAPTION_OPTION_FULL_FRONT,
  GUITAR_PERM,
  OWNERSHIP_STATUS_OPTIONS
} from "../data/constants";

import moment from "moment";
import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/guitarlist.scss";

/**
 * @function GuitarList
 * @returns {ReactNode}
 */
const GuitarList = props => {
  const { selectAndGoToGuitar, editGuitar } = props;

  const dispatch = useDispatch();

  const {
    list: guitarsFromState = [],
    pagination = types.guitarsState.defaults
  } = useSelector(state => state.guitarsState) ?? {};
  const brands = useSelector(state => state.brandsState?.list) ?? [];
  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

  const applyFilter = useFilters();

  const frontPictures = gallery.filter(
    image => image.caption === CAPTION_OPTION_FULL_FRONT
  );

  const guitars = applyFilter(guitarsFromState ?? []).map(guitar => {
    const rawAcquiredDate =
      guitar?.purchaseHistory?.find(
        transaction => transaction.ownershipStatus === "PUR"
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
      lastPlayed:
        guitar.playLog?.[0]?.playDate || `${guitar.lastPlayed || "N/A"}*`,
      isAcquiredDateValid
    };
  });

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

  if (hasEditGuitarPermissions) {
    headCells.push({
      id: "iconHolder",
      label: ""
    });
  }

  const gridData = _.orderBy(guitars, [orderBy, "serialNo"], [order, "asc"]);

  const getNameAdornment = row => {
    const lastPurchaseHistory = row?.purchaseHistory?.slice(-1) ?? {};
    const lastOwnershipStatus = lastPurchaseHistory[0]?.ownershipStatus;
    const icon = OWNERSHIP_STATUS_OPTIONS.find(
      option => option.value === lastOwnershipStatus
    )?.icon;
    return icon ? (
      <Tooltip
        arrow
        placement="right"
        title={
          OWNERSHIP_STATUS_OPTIONS.find(
            option => option.value === lastOwnershipStatus
          )?.label
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
      <h1>Guitar List</h1>
      {guitars.length ? (
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="small">
            <TableHead>
              <TableRow>
                {headCells.map(headCell => (
                  <TableCell
                    className={
                      headCell.id === "iconHolder" ? "icon_holder" : ""
                    }
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.id === "iconHolder" ? (
                      <span>{headCell.label}</span>
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => {
                          dispatch(
                            updatePagination({
                              orderBy: headCell.id,
                              order: order === "asc" ? "desc" : "asc"
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
              {gridData.map(row => {
                const brand =
                  (brands ?? []).find(brand => brand.id === row.brandId) ?? {};
                const frontPicture = frontPictures.find(picture =>
                  (row.pictures ?? []).includes(picture._id)
                );
                return (
                  <TableRow key={row._id}>
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                      className="text-nowrap"
                    >
                      {!_.isEmpty(frontPicture) && (
                        <React.Fragment>
                          <img
                            src={`${serverLocation}/gallery/${frontPicture.image}`}
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
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      <b>{row.name}</b>
                      {getNameAdornment(row)}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {brand.logo ? (
                        <img
                          src={`${serverLocation}/brandLogos/${brand.logo}`}
                          height="45"
                          alt={brand.name}
                        ></img>
                      ) : (
                        brand.name ?? row.brandId
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {row.model}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {row.year}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {row.isAcquiredDateValid
                        ? moment(row.dateAcquired).format("MMM YYYY")
                        : row.dateAcquired}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        selectAndGoToGuitar(row._id);
                      }}
                    >
                      {row.lastPlayed}
                    </TableCell>
                    {hasEditGuitarPermissions && (
                      <TableCell className="icon_holder">
                        <IconButton
                          onClick={() => {
                            editGuitar(row._id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="text-success small"
                          />
                        </IconButton>
                        <IconButton
                          onClick={() => 
                            dispatch(
                              toggleToggle({
                                id: "confirmationModal",
                                title: `Delete ${row.name ?? "Instrument"}?`,
                                text: `Are you sure you want to permanently delete ${
                                  row.name ?? "this instrument"
                                }?`,
                                handleYes: () => dispatch(removeGuitar(row._id))
                              })
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger small"
                          />
                        </IconButton>
                      </TableCell>
                    )}
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
