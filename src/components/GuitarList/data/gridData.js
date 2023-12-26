/** @module gridData */

import React from "react";

import _ from "lodash";
import { Badge } from "reactstrap";

import { SERVER_LOCATION } from "../../../utils/constants";
import { formatDate } from "../../../utils/utils";

export const guitarsColumnsConfig = {
  noOfPictures: {
    title: "",
    isNotSortable: true,
    cellComponent: (row) =>
      !_.isEmpty(row.frontPicture) ? (
        <React.Fragment>
          <div
            className="picture-thumbnail"
            style={{
              backgroundImage: `url("${SERVER_LOCATION}/gallery/${row?.frontPicture.image}")`
            }}
          />
          {Boolean(row.noOfPictures) && (
            <Badge color="info" className="picture-badge">
              {row.noOfPictures}
            </Badge>
          )}
        </React.Fragment>
      ) : (
        ""
      )
  },
  name: {
    title: "Name"
  },
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
  year: {
    title: "Year"
  },
  serialNo: {
    title: "S/N"
  },
  status: {
    title: "Status"
  },
  dateAcquired: {
    title: "Date Acquired",
    cellComponent: (row) => formatDate(row.dateAcquired, "MMM YYYY")
  },
  lastPlayed: {
    title: "Last Played"
  }
};
