/** @module Brands */

import React from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Container, Row } from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import { toggleToggle } from "../../store/slices/toggleSlice";
import * as types from "../../types/types";
import { BRAND_PERM } from "../data/constants";

import BrandBlock from "./BrandBlock";

import "./styles/brands.scss";

/**
 * @function Brands
 * @returns {ReactNode}
 */
const Brands = props => {
  const { scrollTo } = props;

  const dispatch = useDispatch();

  const brands = useSelector(state => state.brandsState.list) ?? [];

  const hasEditBrandPermissions = usePermissions(BRAND_PERM);

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <h1>Brands</h1>
        </Col>
        {hasEditBrandPermissions && (
          <Col className="d-flex justify-content-end align-items-center">
            <Button
              className="mb-3 float-right"
              variant="contained"
              disableElevation
              color="primary"
              onClick={() =>
                dispatch(
                  toggleToggle({
                    id: "addEditBrandModal",
                    selectedBrand: types.brand.defaults
                  })
                )
              }
              startIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              Add New Brand
            </Button>
          </Col>
        )}
      </Row>
      {brands?.length ? (
        <Row className="brands-container justify-content-center">
          {brands?.map(brand => (
            <BrandBlock key={brand.id} brand={brand} scrollTo={scrollTo} />
          ))}
        </Row>
      ) : (
        <Alert className="m-0" color={"danger"}>
          No Brands Found
        </Alert>
      )}
    </Container>
  );
};

Brands.propTypes = {
  scrollTo: PropTypes.func
};

Brands.defaultProps = {
  scrollTo: () => {}
};

export default Brands;
