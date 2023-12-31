/** @module GuitarDetail */

import React, { useEffect } from "react";

import { faGlobe, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Container, Row } from "reactstrap";

import usePermissions from "../../hooks/usePermissions";
import { updateSelected } from "../../store/slices/guitarsSlice";
import { SERVER_LOCATION } from "../../utils/constants";
import { getColWidth } from "../../utils/utils";
import { CAPTION_OPTION_FULL_FRONT, GUITAR_PERM, PURCHASE_PERM } from "../data/constants";

import GuitarPictures from "./GuitarPictures";
import MaintenanceTable from "./MaintenanceTable";
import PurchaseDetailTable from "./PurchaseDetailTable";
import SpecificationsTable from "./SpecificationsTable";
import TodoList from "./TodoList";

import { toggleToggle } from "../../store/slices/toggleSlice";
import "./styles/guitardetail.scss";

/**
 * @function GuitarDetail
 * @returns {React.ReactNode}
 */
const GuitarDetail = (props) => {
  const { selectAndGoToGuitar, editGuitar } = props;

  const dispatch = useDispatch();

  const {list: guitars, selected} = useSelector((state) => state.guitarsState) ?? {};
  const brands = useSelector((state) => state.brandsState?.list) ?? [];
  const gallery = useSelector((state) => state.galleryState?.list) ?? [];
  const user = useSelector((state) => state.userState?.user) ?? {};

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);
  const hasPurchaseHistoryPermissions = usePermissions(PURCHASE_PERM);

  const guitar =
    guitars.find(guitar => guitar._id === selected || guitar.name === selected) ??
    {};

  const guitarName = guitar.name ?? "";

  useEffect(() => {
    dispatch(updateSelected(guitarName));
  }, [dispatch, guitarName]);

  const brand = (brands ?? []).find((brand) => brand.id === guitar.brandId) ?? {};

  const DetailItem = ({ width = "", title = "", children }) => {
    const widthProps = getColWidth(width);
    return (
      <Col {...widthProps} className="my-2">
        <b>{title}:</b> {children}
      </Col>
    );
  };

  const LinkParser = (paragraph) => {
    // links
    const potentialLinks = paragraph.split(/[|^_]+/);
    return potentialLinks.map((snippet, id) => {
      const linkedGuitar = guitars.find((guitar) => guitar.name === snippet);
      if (!_.isEmpty(linkedGuitar)) {
        return (
          <span
            key={`${id}`}
            className="navigation-span"
            onClick={() => selectAndGoToGuitar(linkedGuitar.name)}
          >
            {snippet}
          </span>
        );
      }
      if (_.isEmpty(user)) {
        return (snippet ?? "").replaceAll("Morgan", "Laurel");
      }
      return snippet;
    });
  };

  if (!guitar?._id) {
    return (
      <Alert className="m-0" color={"danger"}>
        Guitar Not Found or ID is Invalid
      </Alert>
    );
  }

  const frontPictures = gallery.filter(
    (image) => image.caption === CAPTION_OPTION_FULL_FRONT
  );
  const thumbnail = frontPictures.find((picture) =>
    (guitar.pictures ?? []).includes(picture._id)
  );

  return (
    <Container fluid="md">
      <div className="d-flex w-100 justify-content-between">
        <h1>{guitar.name}</h1>
        {hasEditGuitarPermissions && (
          <IconButton
            onClick={() => {
              editGuitar(guitar.name);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-primary" />
          </IconButton>
        )}
      </div>
      <Row>
        {thumbnail && (
          <Col {...getColWidth()} className="brand-logo">
            <img
              src={`${SERVER_LOCATION}/gallery/${thumbnail.image}`}
              alt={guitar.name}
            ></img>
          </Col>
        )}
        <Col>
          <Row>
            <Col {...getColWidth()} className="brand-logo">
              {brand.logo && (
                <img
                  src={`${SERVER_LOCATION}/brandLogos/${brand.logo}`}
                  alt={brand.name}
                ></img>
              )}
            </Col>
            <Col>
              <Row>
                <DetailItem title="Status" width="wide">
                  {guitar.status}
                </DetailItem>
                <DetailItem title="Tuning" width="wide">
                  {guitar.tuning}
                </DetailItem>

                <Col {...getColWidth("wide")}>
                  <Button
                    variant="contained"
                    disableElevation
                    color="success"
                    onClick={async (event) => {
                      event.preventDefault();

                      dispatch(
                        toggleToggle({
                          id: "playLogModal",
                          guitar,
                          isReadOnly: !hasEditGuitarPermissions
                        })
                      );
                    }}
                  >
                    Last Played: {guitar.playLog?.[0]?.playDate || "N/A"}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-between align-items-center">
                  <span>
                    <b>Model:</b> {guitar.model}
                  </span>
                  {hasEditGuitarPermissions ? (
                    <IconButton
                      onClick={() => {
                        window.open(
                          `https://www.google.com/search?q=${brand?.name}+${guitar.model}`
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faGlobe} className="text-info small" />
                    </IconButton>
                  ) : (
                    <span />
                  )}
                </Col>
                <DetailItem title="S/N">{guitar.serialNo}</DetailItem>
                <DetailItem title="Year">{guitar.year}</DetailItem>
                <DetailItem title="Country of Origin" width="wide">
                  {guitar.countyOfOrigin}
                </DetailItem>
                <DetailItem title="Case" width="wide">
                  {guitar.case}
                </DetailItem>
                <DetailItem title="Number of Strings" width="wide">
                  {guitar.noOfStrings}
                </DetailItem>
                <DetailItem title="Sound Scape" width="wide">
                  {guitar.soundScape}
                </DetailItem>
                <DetailItem title="Color" width="wide">
                  {guitar.color}
                </DetailItem>
                <DetailItem title="Notes on Appearance" width="wide">
                  {guitar.appearanceNotes}
                </DetailItem>
                {guitar.sibling && (
                  <DetailItem title="Sibling" width="wide">
                    <span
                      className="navigation-span"
                      onClick={() => selectAndGoToGuitar(guitar.sibling)}
                    >
                      {guitars?.find((g) => g._id === guitar.sibling)?.name ?? "Unknown"}
                    </span>
                  </DetailItem>
                )}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mt-3">
              <b>Story: </b>
              <br />
              {(guitar.story ?? "").split("\n").map((paragraph, idx) => (
                <React.Fragment key={`paragraph-${idx}`}>
                  <br />
                  <p>{LinkParser(paragraph)}</p>
                </React.Fragment>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
      <GuitarPictures guitar={guitar} />
      {hasPurchaseHistoryPermissions && <PurchaseDetailTable guitar={guitar} />}
      <SpecificationsTable guitar={guitar} />
      <TodoList guitar={guitar} />
      <MaintenanceTable guitar={guitar} />
    </Container>
  );
};

GuitarDetail.propTypes = {
  selectAndGoToGuitar: PropTypes.func,
  editGuitar: PropTypes.func
};

GuitarDetail.defaultProps = {
  selectAndGoToGuitar: () => {},
  editGuitar: () => {}
};

export default GuitarDetail;
