/** @module BrandBlock */

import React from "react";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import usePermissions from "../../hooks/usePermissions";
import { deleteBrand, getBrands } from "../../store/slices/brandsSlice";
import { SERVER_LOCATION } from "../../utils/constants";
import { BRAND_PERM } from "../data/constants";

import { writeFilters } from "../../store/slices/filtersSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/brands.scss";

/**
 * @function BrandBlock
 * @returns {React.ReactNode}
 */
const BrandBlock = props => {
  const { brand, scrollTo } = props;
  const dispatch = useDispatch();

  const filters = useSelector(state => state.filtersState.filters) ?? {};

  const hasEditBrandPermissions = usePermissions(BRAND_PERM);

  return (
    <div
      onClick={() => {
        dispatch(
          writeFilters({
            ...filters,
            brandId: [brand.id],
            status: []
          })
        );
        scrollTo(1);
      }}
      className="border brand-block"
    >
      <p className="brand-name">{brand.name}</p>
      {brand.logo && (
        <img
          className="brand-logo"
          src={`${SERVER_LOCATION}/brandLogos/${brand.logo}`}
          alt={brand.name}
        ></img>
      )}
      {brand.notes && <p className="brand-notes">{brand.notes}</p>}
      {hasEditBrandPermissions && (
        <div className="brand-buttons-container">
          <IconButton
            onClick={() => {
              dispatch(
                toggleToggle({
                  id: "addEditBrandModal",
                  selectedBrand: brand,
                  isEdit: true
                })
              );
            }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-success small"
            />
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch(
                toggleToggle({
                  id: "confirmationModal",
                  title: `Delete Brand ${brand.name}?`,
                  text: `Are you sure you want to permanently delete brand ${brand.name}?`,
                  handleYes: () =>
                    dispatch(deleteBrand(brand)).then(() =>
                      dispatch(getBrands())
                    )
                })
              );
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="text-danger small" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

BrandBlock.propTypes = {
  brand: PropTypes.objectOf(PropTypes.any),
  scrollTo: PropTypes.func
};

BrandBlock.defaultTypes = {
  brand: {},
  scrollTo: () => {}
};

export default BrandBlock;
