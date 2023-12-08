/** @module Home */

import React, { useEffect, useState } from "react";

import { Button, ButtonBase } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";

import useFilters from "../../hooks/useFilters";
import usePermissions from "../../hooks/usePermissions";
import useUpdatePlayLog from "../../hooks/useUpdatePlayLog";
import { updateGuitar, updateSelected } from "../../store/slices/guitarsSlice";
import { toggleToggle } from "../../store/slices/toggleSlice";
import { serverLocation } from "../../utils/constants";
import {
  ADMIN_PERM,
  CAPTION_OPTION_FULL_FRONT,
  DATE_FORMAT,
  GUITAR_PERM,
  STATUS_OPTION_PLAYABLE
} from "../data/constants";

const Home = props => {
  const { selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const hash = (window.location.hash ?? "").slice(1);

  const guitars = useSelector(state => state.guitarsState?.list) ?? [];
  const brands = useSelector(state => state.brandsState?.list) ?? [];
  const gallery = useSelector(state => state.galleryState?.list) ?? [];
  const filters = useSelector(state => state.filtersState.filters) ?? {};

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);
  const hasAdminPermissions = usePermissions(ADMIN_PERM);

  const applyFilter = useFilters();

  const [featuredGuitar, setFeaturedGuitar] = useState({});

  const getFeaturedGuitar = isNew => {
    const availableGuitars = applyFilter(guitars, true);

    // TODO: take into account last played
    const rand = Math.floor(Math.random() * availableGuitars.length);

    const featuredGuitar = (guitars ?? []).find(
      guitar =>
        (!isNew && hash && (guitar._id === hash || guitar.name === hash)) ||
        (isNew && guitar._id === availableGuitars[rand]._id)
    ) ?? {
      name: "Unknown"
    };

    window.location.hash = `#${featuredGuitar?._id ?? ""}`;
    dispatch(updateSelected(featuredGuitar.name));
    const frontPicture = (gallery ?? []).find(image => {
      return (
        (featuredGuitar.pictures ?? []).includes(image?._id) &&
        image?.caption &&
        image?.caption === CAPTION_OPTION_FULL_FRONT
      );
    })?.image;
    const brandObject = (brands ?? []).find(
      brand => brand.id === featuredGuitar.brandId
    );
    return {
      ...featuredGuitar,
      frontPicture,
      brandObject
    };
  };

  const hasFrontPicture = !_.isEmpty(featuredGuitar.frontPicture);

  useEffect(() => {
    if (guitars.length && brands.length && gallery.length) {
      const featuredGuitar = getFeaturedGuitar(!Boolean(hash));
      setFeaturedGuitar(featuredGuitar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guitars, brands, gallery]);

  useEffect(() => {
    if (!hash) {
      const featuredGuitar = getFeaturedGuitar(true);
      setFeaturedGuitar(featuredGuitar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const { getPlayLog } = useUpdatePlayLog();

  return (
    <Container fluid="md" className="mt-4">
      <Row>
        <Col>
          <h1>Brian's Guitars</h1>
        </Col>
      </Row>
      {hasAdminPermissions && (
        <Row className="border d-flex align-items-baseline">
          <Col>
            <h3>Statistics</h3>
          </Col>
          <Col>{guitars.length} Guitars Loaded</Col>
          <Col>{brands.length} Brands Loaded</Col>
          <Col>{gallery.length} Gallery Images Loaded</Col>
          <Col>
            Average Guitar Cost: $
            {_.round(
              _.mean(
                guitars?.map(
                  guitar =>
                    guitar.purchaseHistory?.find(
                      ph => ph.ownershipStatus === "PUR"
                    )?.amount ?? 0
                )
              ),
              2
            )}
          </Col>
        </Row>
      )}
      <Row className="pt-3 text-center">
        <Col>
          <h3>Today's Featured Instrument</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} className="text-center">
          {!_.isEmpty(featuredGuitar) && (
            <React.Fragment>
              <Row className="mb-3">
                <Col>
                  <h5
                    onClick={() => {
                      selectAndGoToGuitar(featuredGuitar._id);
                    }}
                  >
                    <b>{featuredGuitar.name}</b>
                  </h5>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  {featuredGuitar.brandObject?.logo ? (
                    <img
                      style={{ maxWidth: "75%" }}
                      src={`${serverLocation}/brandLogos/${featuredGuitar.brandObject.logo}`}
                      alt={featuredGuitar.brandObject?.name}
                    ></img>
                  ) : (
                    featuredGuitar.brandObject?.name ?? featuredGuitar.brandId
                  )}
                </Col>
                <Col xs={6} className="text-start">
                  <p>
                    <b>Model:</b> {featuredGuitar.model}
                  </p>
                  <p>
                    <b>Country:</b> {featuredGuitar.countyOfOrigin}
                  </p>
                  <p>
                    <b>Year:</b> {featuredGuitar.year}
                  </p>
                  <p>
                    <b>Instrument:</b> {featuredGuitar.instrumentType}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col className="text-start">
                  <p>
                    <b>Sound Scape:</b> {featuredGuitar.soundScape}
                  </p>
                  <p>
                    <b>Tuning:</b> {featuredGuitar.tuning}
                  </p>
                  {!(filters.featuredStatus ?? []).includes(
                    STATUS_OPTION_PLAYABLE
                  ) && (
                    <p>
                      <b>Status:</b> {featuredGuitar.status}
                    </p>
                  )}
                </Col>
                <Col className="text-start">
                  <p>
                    <b>No of Strings:</b> {featuredGuitar.noOfStrings}
                  </p>
                  <p>
                    <b>Last Played: </b>
                    {featuredGuitar.playLog?.[0]?.playDate ||
                      `${featuredGuitar.lastPlayed || "N/A"}*`}
                  </p>
                  {hasEditGuitarPermissions && (
                    <p>
                      <Button
                        variant="contained"
                        disableElevation
                        color="success"
                        onClick={async event => {
                          event.preventDefault();

                          dispatch(
                            toggleToggle({
                              id: "confirmationModal",
                              title: `Play ${featuredGuitar.name}?`,
                              text: `Want to play ${featuredGuitar.name} today?`,
                              handleYes: () => {
                                const playLog = getPlayLog(
                                  featuredGuitar,
                                  "Featured Guitar"
                                );
                                const updateObject = {
                                  ...featuredGuitar,
                                  lastPlayed: moment().format(DATE_FORMAT),
                                  playLog
                                };
                                dispatch(updateGuitar(updateObject)).then(
                                  () => {
                                    selectAndGoToGuitar(featuredGuitar._id);
                                  }
                                );
                              }
                            })
                          );
                        }}
                      >
                        Play Today?
                      </Button>
                    </p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col className="mt-4 text-center">
                  <Button
                    variant="contained"
                    disableElevation
                    color="info"
                    onClick={() => {
                      const featuredGuitar = getFeaturedGuitar(true);
                      setFeaturedGuitar(featuredGuitar);
                    }}
                  >
                    Find Another Featured Instrument?
                  </Button>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </Col>
        <Col xs={12} md={6} className="text-center">
          <ButtonBase
            style={{ minWidth: "200px", minHeight: "200px" }}
            className="border"
            onClick={() => {
              selectAndGoToGuitar(featuredGuitar._id);
            }}
          >
            {hasFrontPicture ? (
              <img
                src={`${serverLocation}/gallery/${featuredGuitar.frontPicture}`}
                alt={featuredGuitar.name}
              ></img>
            ) : (
              <div className="h-100 w-100 d-flex justify-content-center align-content-middle">
                No Image
              </div>
            )}
          </ButtonBase>
        </Col>
      </Row>
    </Container>
  );
};

Home.propTypes = {
  selectAndGoToGuitar: PropTypes.func
};

Home.defaultProps = {
  selectAndGoToGuitar: () => {}
};

export default Home;
