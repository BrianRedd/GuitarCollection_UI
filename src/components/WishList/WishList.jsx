/** @module WishList */

import React from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import { toggleToggle } from "../../store/slices/toggleSlice";
import * as types from "../../types/types";
import { GUITAR_PERM } from "../data/constants";
import { wishListColumnsConfig } from "./data/gridData";

import Grid from "../common/Grid";

import "../GuitarList/styles/guitarlist.scss";

/**
 * @function WishList
 * @returns {React.ReactNode}
 */
const WishList = () => {
  const dispatch = useDispatch();

  const wishList = useSelector((state) => state.wishListState?.list) ?? [];
  const brands = useSelector((state) => state.brandsState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);

  const gridData = wishList.map((item) => {
    const brand = (brands ?? []).find((brand) => brand.id === item.brandId) ?? {};
    return {
      ...item,
      brand
    };
  });

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <h1>Wish List</h1>
        </Col>
        {hasEditGuitarPermissions && (
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              className="mb-3 float-right"
              variant="contained"
              disableElevation
              color="primary"
              onClick={() =>
                dispatch(
                  toggleToggle({
                    id: "addWishListItem",
                    selectedBrand: types.wish.defaults
                  })
                )
              }
              startIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              Add New Wish List Item
            </Button>
          </Col>
        )}
      </Row>
      <Grid
        columnsConfig={wishListColumnsConfig}
        defaultSort={{
          sortBy: "name"
        }}
        gridData={gridData}
        onRowSelect={(row) => console.log("row", row)}
      />
    </Container>
  );
};

export default WishList;
