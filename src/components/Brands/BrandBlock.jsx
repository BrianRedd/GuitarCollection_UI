/** @module BrandBlock */

import React from "react";

import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import confirm from "reactstrap-confirm";

import usePermissions from "../../hooks/usePermissions";
import { deleteBrand, getBrands } from "../../store/slices/brandsSlice";
import { serverLocation } from "../../utils/constants";

import "./styles/brands.scss";

/**
 * @function BrandBlock
 * @returns {React.ReactNode}
 */
const BrandBlock = props => {
  const { brand, selectBrand } = props;
  const dispatch = useDispatch();

  const hasEditBrandPermissions = usePermissions("EDIT_BRAND");

  return (
    <div className="border brand-block">
      <p className="brand-name">{brand.name}</p>
      {brand.logo && (
        <img
          className="brand-logo"
          src={`${serverLocation}/brandLogos/${brand.logo}`}
          alt={brand.name}
        ></img>
      )}
      {brand.notes && <p className="brand-notes">{brand.notes}</p>}
      {hasEditBrandPermissions && (
        <div className="brand-buttons-container">
          <IconButton onClick={() => selectBrand(brand)}>
            <FontAwesomeIcon icon={faEdit} className="text-success small" />
          </IconButton>
          <IconButton
            onClick={async () => {
              const result = await confirm({
                title: `Delete Brand ${brand.name}?`,
                message: `Are you sure you want to permanently delete brand ${brand.name}?`,
                confirmColor: "danger",
                cancelColor: "link text-primary"
              });
              if (result) {
                dispatch(deleteBrand(brand)).then(() => dispatch(getBrands()));
              }
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
  selectBrand: PropTypes.func
};

BrandBlock.defaultTypes = {
  brand: {},
  selectBrand: () => {}
};

export default BrandBlock;
