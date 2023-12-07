/** @module GuitarDetail */

import React, { useEffect } from "react";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Container, Row } from "reactstrap";
import confirm from "reactstrap-confirm";

import usePermissions from "../../hooks/usePermissions";
import { updateGuitar, updateSelected } from "../../store/slices/guitarsSlice";
import { serverLocation } from "../../utils/constants";
import { getColWidth } from "../../utils/utils";
import {
  CAPTION_OPTION_FULL_FRONT,
  DATE_FORMAT,
  GUITAR_PERM,
  PURCHASE_PERM
} from "../data/constants";

import GuitarPictures from "./GuitarPictures";
import MaintenanceTable from "./MaintenanceTable";
import PurchaseDetailTable from "./PurchaseDetailTable";
import SpecificationsTable from "./SpecificationsTable";
import TodoList from "./TodoList";

import "./styles/guitardetail.scss";

/**
 * @function GuitarDetail
 * @returns {React.ReactNode}
 */
const GuitarDetail = props => {
  const { selectAndGoToGuitar, editGuitar } = props;

  const dispatch = useDispatch();

  const hash = (window.location.hash ?? "").slice(1);

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];
  const brands = useSelector(state => state.brandsState?.list) ?? [];
  const gallery = useSelector(state => state.galleryState?.list) ?? [];

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);
  const hasPurchaseHistoryPermissions = usePermissions(PURCHASE_PERM);

  const guitar =
    guitars.find(guitar => guitar._id === hash || guitar.name === hash) ?? {};

  const guitarName = guitar.name ?? "";

  useEffect(() => {
    dispatch(updateSelected(guitarName));
  }, [dispatch, guitarName, hash]);

  const brand = (brands ?? []).find(brand => brand.id === guitar.brandId) ?? {};

  const DetailItem = ({ width = "", title = "", children }) => {
    const widthProps = getColWidth(width);
    return (
      <Col {...widthProps} className="my-2">
        <b>{title}:</b> {children}
      </Col>
    );
  };

  const LinkParser = paragraph => {
    // links
    const potentialLinks = paragraph.split(/[|^_]+/);
    return potentialLinks.map((snippet, id) => {
      const linkedGuitar = guitars.find(guitar => guitar.name === snippet);
      if (!_.isEmpty(linkedGuitar)) {
        return (
          <span
            key={`${id}`}
            className="navigation-span"
            onClick={() => selectAndGoToGuitar(linkedGuitar._id)}
          >
            {snippet}
          </span>
        );
      }
      return snippet;
    });
  };

  if (!guitar?._id || !hash) {
    return (
      <Alert className="m-0" color={"danger"}>
        {hash ?? "Guitar"} Not Found or ID is Invalid
      </Alert>
    );
  }

  const frontPictures = gallery.filter(
    image => image.caption === CAPTION_OPTION_FULL_FRONT
  );
  const thumbnail = frontPictures.find(picture =>
    (guitar.pictures ?? []).includes(picture._id)
  );

  return (
    <React.Fragment>
      {hash ? (
        <Container fluid="md">
          <div className="d-flex w-100 justify-content-between">
            <h1>{guitar.name}</h1>
            {hasEditGuitarPermissions && (
              <IconButton
                onClick={() => {
                  editGuitar(guitar._id);
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="text-info" />
              </IconButton>
            )}
          </div>
          <Row>
            {thumbnail && (
              <Col {...getColWidth()} className="brand-logo">
                <img
                  src={`${serverLocation}/gallery/${thumbnail.image}`}
                  alt={guitar.name}
                ></img>
              </Col>
            )}
            <Col>
              <Row>
                <Col {...getColWidth()} className="brand-logo">
                  {brand.logo && (
                    <img
                      src={`${serverLocation}/brandLogos/${brand.logo}`}
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
                      {hasEditGuitarPermissions ? (
                        <Button
                          variant="contained"
                          disableElevation
                          color="success"
                          onClick={async event => {
                            event.preventDefault();
                            const result = await confirm({
                              title: `Played ${guitar.name} today?`,
                              message: `Did you play ${guitar.name} today?`,
                              confirmColor: "success",
                              cancelColor: "link text-danger",
                              confirmText: "Yes!",
                              cancelText: "No"
                            });
                            if (result) {
                              dispatch(
                                updateGuitar({
                                  ...guitar,
                                  lastPlayed: moment().format(DATE_FORMAT)
                                })
                              );
                            }
                          }}
                        >
                          Last Played: {guitar.lastPlayed || "N/A"}
                        </Button>
                      ) : (
                        <DetailItem title="Last Played" width="wide">
                          {guitar.lastPlayed
                            ? moment(guitar.lastPlayed).format(DATE_FORMAT)
                            : "N/A"}
                        </DetailItem>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <DetailItem title="Model" width="wide">
                      {guitar.model}
                    </DetailItem>
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
          {hasPurchaseHistoryPermissions && (
            <PurchaseDetailTable guitar={guitar} />
          )}
          <SpecificationsTable guitar={guitar} />
          <TodoList guitar={guitar} />
          <MaintenanceTable guitar={guitar} />
        </Container>
      ) : (
        <div />
      )}
    </React.Fragment>
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
