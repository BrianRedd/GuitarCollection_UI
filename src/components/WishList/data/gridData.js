/** @module gridData */

import React from "react";

import { SERVER_LOCATION } from "../../../utils/constants";

export const wishListColumnsConfig = {
  brandId: {
    title: "Make",
    cellComponent: (row) =>
      row?.brand?.logo ? (
        <img
          src={`${SERVER_LOCATION}/brandLogos/${row?.brand?.logo}`}
          style={{
            maxHeight: "45px",
            maxWidth: "76px"
          }}
          alt={row?.brand?.name}
        ></img>
      ) : (
        row?.brand?.name ?? row.brandId
      )
  },
  model: {
    title: "Model"
  },
  notes: {
    title: "Notes"
  }
};
