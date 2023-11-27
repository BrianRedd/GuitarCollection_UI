/** @module GuitarList */

import React from "react";

import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip
} from "@mui/material";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert } from "reactstrap";
import confirm from "reactstrap-confirm";

import useFilters from "../../hooks/useFilters";
import usePermissions from "../../hooks/usePermissions";
import {
  removeGuitar,
  updatePagination
} from "../../store/slices/guitarsSlice";
import * as types from "../../types/types";
import {
  CAPTION_OPTION_FULL_FRONT,
  DEFAULT_PAGE_SIZE,
  OWNERSHIP_STATUS_OPTIONS
} from "../data/constants";

import "./styles/guitarlist.scss";
import { serverLocation } from "../../utils/constants";

/**
 * @function GuitarList
 * @returns {ReactNode}
 */
const GuitarList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: guitarsFromState = [],
    pagination = types.guitarsState.defaults
  } = useSelector(state => state.guitarsState) ?? {};
  const brands = useSelector(state => state.brandsState?.list) ?? [];
  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions("EDIT_GUITAR");

  const applyFilter = useFilters();

  const frontPictures = gallery.filter(
    image => image.caption === CAPTION_OPTION_FULL_FRONT
  );

  const guitars = applyFilter(guitarsFromState ?? []);

  const { orderBy, order, page = 0, pageSize = DEFAULT_PAGE_SIZE } = pagination;

  const headCells = [
    {
      id: "thumbnail",
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

  const gridData = _.orderBy(
    guitars,
    [orderBy, "serialNo"],
    [order, "asc"]
  ).slice(page * pageSize, page * pageSize + pageSize);

  const handleChangePage = (event, newPage) => {
    dispatch(
      updatePagination({
        page: newPage
      })
    );
  };

  const handleChangeRowsPerPage = event => {
    dispatch(
      updatePagination({
        pageSize: parseInt(event.target.value, 10),
        page: 0
      })
    );
  };

  const emptyRows =
    page > 0 ? Math.max(0, (page + 1) * pageSize) - guitars.length : 0;

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
      {guitars.length ? (
        <React.Fragment>
          <h1>Guitar List</h1>
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
                    (brands ?? []).find(brand => brand.id === row.brandId) ??
                    {};
                  const frontPicture = frontPictures.find(picture =>
                    (row.pictures ?? []).includes(picture._id)
                  );
                  return (
                    <TableRow key={row._id}>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        {!_.isEmpty(frontPicture) && (
                          <img
                            src={`${serverLocation}/gallery/${frontPicture.image}`}
                            height="60"
                            alt={row.name}
                          ></img>
                        )}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        <b>{row.name}</b>
                        {getNameAdornment(row)}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
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
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        {row.model}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        {row.year}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        {row.status}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/guitar/${row._id}`);
                        }}
                      >
                        {row.lastPlayed}
                      </TableCell>
                      {hasEditGuitarPermissions && (
                        <TableCell className="icon_holder">
                          <IconButton
                            onClick={() => navigate(`/editguitar/${row._id}`)}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-success small"
                            />
                          </IconButton>
                          <IconButton
                            onClick={async event => {
                              event.preventDefault();
                              const result = await confirm({
                                title: `Delete ${row.name}?`,
                                message: `Are you sure you want to permanently delete ${row.name}?`,
                                confirmColor: "danger",
                                cancelColor: "link text-primary"
                              });
                              if (result) {
                                dispatch(removeGuitar(row._id));
                              }
                            }}
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
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 71 * emptyRows
                    }}
                  >
                    <TableCell colSpan={headCells.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="custom-pagination"
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={guitars.length}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </React.Fragment>
      ) : (
        <Alert className="m-0" color={"danger"}>
          No Guitars Found
        </Alert>
      )}
    </Box>
  );
};

export default GuitarList;
