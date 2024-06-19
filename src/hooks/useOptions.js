/** @module useOptions */

import _ from "lodash";
import { useSelector } from "react-redux";
import {
  COLOR_OPTIONS_DEFAULTS,
  COUNTRY_OPTIONS_DEFAULTS,
  INSTRUMENT_OPTIONS_DEFAULTS,
  SOUNDSCAPE_OPTIONS_DEFAULTS,
  STATUS_OPTIONS_DEFAULTS,
  STATUS_OPTION_PLAYABLE,
  TEXT_ASC,
  TEXT_DESC,
  TUNING_OPTIONS_DEFAULTS
} from "../components/data/constants";

const useOptions = ({ guitarId }) => {
  const guitars = useSelector((state) => state.guitarsState?.list) ?? [];
  const brands = useSelector((state) => state.brandsState.list) ?? [];

  const brandOptions = _.orderBy(
    brands?.map((brand) => ({
      value: brand.id,
      label: brand.name,
      presence: (guitars ?? []).filter((guitar) => guitar.brandId === brand.id).length
    })),
    ["presence", "name"],
    [TEXT_DESC, TEXT_ASC]
  );
  const countryOptions = _.uniq(
    _.compact([
      ...COUNTRY_OPTIONS_DEFAULTS,
      ...guitars.map((guitar) => guitar.countyOfOrigin).sort()
    ])
  );
  const instrumentOptions = _.uniq(
    _.compact([
      ...INSTRUMENT_OPTIONS_DEFAULTS,
      ...guitars.map((guitar) => guitar.instrumentType).sort()
    ])
  );
  const soundScapeOptions = _.uniq(
    _.compact([
      ...SOUNDSCAPE_OPTIONS_DEFAULTS,
      ...guitars.map((guitar) => guitar.soundScape)
    ])
  ).sort();
  const colorOptions = _.uniq(
    _.compact([...COLOR_OPTIONS_DEFAULTS, ...guitars.map((guitar) => guitar.color)])
  ).sort();
  const statusOptions = _.uniq(
    _.compact([
      ...STATUS_OPTIONS_DEFAULTS,
      ...guitars.map((guitar) => guitar.status).sort()
    ])
  );
  const tuningOptions = _.uniq(
    _.compact([
      ...TUNING_OPTIONS_DEFAULTS,
      ...guitars.map((guitar) => guitar.tuning).sort()
    ])
  );
  const yearOptions = _.uniq(
    _.compact(
      guitars
        .map((guitar) => parseFloat(guitar.year).toString())
        .filter((option) => option !== "NaN")
        .sort()
    )
  );
  const noOfStringOptions = _.uniq(
    _.compact(_.orderBy(guitars.map((guitar) => parseFloat(guitar.noOfStrings))))
  ).map((option) => option.toString());
  const otherGuitarOptions = [
    {
      value: null,
      label: "None"
    },
    ..._.orderBy(
      guitars
        .filter((guitar) => !guitarId || guitar?._id !== guitarId)
        .map((guitar) => ({
          value: guitar._id,
          label: `${guitar.name}${guitar.status === STATUS_OPTION_PLAYABLE ? "" : "*"}`
        })),
      "label"
    )
  ];

  return {
    brandOptions,
    countryOptions,
    instrumentOptions,
    soundScapeOptions,
    colorOptions,
    statusOptions,
    tuningOptions,
    yearOptions,
    noOfStringOptions,
    otherGuitarOptions
  };
};

export default useOptions;
