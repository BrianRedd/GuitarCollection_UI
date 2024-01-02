/** @module Home */

import React, { useEffect, useState } from "react";

import { Button, ButtonBase } from "@mui/material";
import _ from "lodash";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";

import useFilters from "../hooks/useFilters";
import usePermissions from "../hooks/usePermissions";
import { updateSelected } from "../store/slices/guitarsSlice";
import { toggleToggle } from "../store/slices/toggleSlice";
import { SERVER_LOCATION } from "../utils/constants";
import {
  ADMIN_PERM,
  CAPTION_OPTION_FULL_FRONT,
  GUITAR_PERM,
  STATUS_OPTION_PLAYABLE
} from "./data/constants";

const Home = (props) => {
  const { selectAndGoToGuitar } = props;

  const dispatch = useDispatch();

  const {list: guitars, selected: selectedGuitar} = useSelector((state) => state.guitarsState) ?? {};
  const brands = useSelector((state) => state.brandsState?.list) ?? [];
  const gallery = useSelector((state) => state.galleryState?.list) ?? [];
  const wishList = useSelector((state) => state.wishListState?.list) ?? [];
  const filters = useSelector((state) => state.filtersState.filters) ?? {};

  const hasEditGuitarPermissions = usePermissions(GUITAR_PERM);
  const hasAdminPermissions = usePermissions(ADMIN_PERM);

  const applyFilter = useFilters();

  const [featuredGuitar, setFeaturedGuitar] = useState({});

  const getFeaturedGuitar = (isNew) => {
    const availableGuitars = applyFilter(guitars, true);

    const urlParams = new URLSearchParams(window.location.search);
    const guitarParam = urlParams.get("guitar") || urlParams.get("g");

    // TODO: take into account last played
    const rand = Math.floor(Math.random() * availableGuitars.length);

    const featuredGuitar = (guitars ?? []).find(
      (guitar) =>
        (!isNew && !guitarParam && guitar.name === availableGuitars[rand].name) ||
        (!isNew &&
          guitarParam &&
          (guitar._id === guitarParam || guitar.name === guitarParam)) ||
        (isNew && guitar.name === availableGuitars[rand].name)
    ) ?? {
      name: "Unknown"
    };

    dispatch(updateSelected(featuredGuitar.name));
    const frontPicture = (gallery ?? []).find((image) => {
      return (
        (featuredGuitar.pictures ?? []).includes(image?._id) &&
        image?.caption &&
        image?.caption === CAPTION_OPTION_FULL_FRONT
      );
    })?.image;
    const brandObject = (brands ?? []).find(
      (brand) => brand.id === featuredGuitar.brandId
    );
    return {
      ...featuredGuitar,
      frontPicture,
      brandObject
    };
  };

  const hasFrontPicture = !_.isEmpty(featuredGuitar.frontPicture);

  useEffect(() => {
    if (guitars.length && brands.length && gallery.length && !selectedGuitar) {
      const featuredGuitar = getFeaturedGuitar(false);
      setFeaturedGuitar(featuredGuitar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guitars, brands, gallery]);

  return (
    <Container fluid="md" className="mt-4">
      <Row>
        <Col>
          <h1>Brian's Guitars</h1>
        </Col>
      </Row>
      {hasAdminPermissions && (
        <Row className="border d-flex align-items-center">
          <h3>Statistics</h3>
          <Col>{guitars.length} Instruments</Col>
          <Col>{brands.length} Brands</Col>
          <Col>{gallery.length} Gallery Images</Col>
          <Col>{wishList.length} Wish List Items</Col>
          <Col>
            Average Instrument Cost: $
            {_.round(
              _.mean(
                guitars?.map(
                  (guitar) =>
                    guitar.purchaseHistory?.find((ph) => ph.ownershipStatus === "PUR")
                      ?.amount ?? 0
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
                      selectAndGoToGuitar(featuredGuitar.name);
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
                      src={`${SERVER_LOCATION}/brandLogos/${featuredGuitar.brandObject.logo}`}
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
                  {!(filters.featuredStatus ?? []).includes(STATUS_OPTION_PLAYABLE) && (
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
                  <p>
                    <Button
                      variant="contained"
                      disableElevation
                      color="success"
                      onClick={async (event) => {
                        event.preventDefault();

                        dispatch(
                          toggleToggle({
                            id: "playLogModal",
                            guitar: featuredGuitar,
                            selectAndGoToGuitar,
                            isReadOnly: !hasEditGuitarPermissions
                          })
                        );
                      }}
                    >
                      Play Log
                    </Button>
                  </p>
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
              selectAndGoToGuitar(featuredGuitar.name);
            }}
          >
            {hasFrontPicture ? (
              <img
                src={`${SERVER_LOCATION}/gallery/${featuredGuitar.frontPicture}`}
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
