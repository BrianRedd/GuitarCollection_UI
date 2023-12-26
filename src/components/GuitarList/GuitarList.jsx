/** @module GuitarList2 */

import React, { useMemo } from "react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Row } from "reactstrap";

import useFilters from "../../hooks/useFilters";
import { toggleToggle } from "../../store/slices/toggleSlice";
import { formatDate } from "../../utils/utils";
import { ALLOWED_DATE_FORMATS, CAPTION_OPTION_FULL_FRONT } from "../data/constants";
import { guitarsColumnsConfig } from "./data/gridData";

import Grid from "../common/Grid";

import "./styles/guitarlist.scss";

/**
 * @function GuitarList2
 * @returns {React.ReactNode}
 */
const GuitarList2 = (props) => {
  const { selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const { list: guitarsFromState = [] } =
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
    const brand = (brands ?? []).find((brand) => brand.id === guitar.brandId) ?? {};
    const frontPicture = frontPictures.find((picture) =>
      (guitar.pictures ?? []).includes(picture._id)
    );
    return {
      ...guitar,
      noOfPictures: (guitar?.pictures ?? []).length,
      dateAcquired: formatDate(rawAcquiredDate ?? "", "YYYY-MM"),
      lastPlayed: guitar.playLog?.[0]?.playDate || "N/A",
      isAcquiredDateValid,
      brand,
      frontPicture
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

  return (
    <Card className="m-4 p-4">
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
      <Grid
        columnsConfig={guitarsColumnsConfig}
        defaultSort={{
          sortBy: "name"
        }}
        gridData={guitars}
        onRowSelect={(row) => selectAndGoToGuitar(row.name)}
      />
    </Card>
  );
};

GuitarList2.propTypes = {};

GuitarList2.defaultProps = {};

export default GuitarList2;
