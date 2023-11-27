/** @module useFilters */

import moment from "moment";
import { useSelector } from "react-redux";

import {
  FILTER_FEATURED_STATUS,
  FILTER_QUERY,
  FILTER_STATUS
} from "../components/data/constants";
import * as types from "../types/types";

const useFilters = () => {
  const filtersFromState =
    useSelector(state => state.filtersState.filters) ?? {};

  const applyFilter = (results = [], isFeatured) => {
    if (!results.length) return [];
    const filters = { ...filtersFromState };
    if (isFeatured) {
      filters[FILTER_STATUS] = filters[FILTER_FEATURED_STATUS];
    }
    filters[FILTER_FEATURED_STATUS] = "";
    const filtersArray = Object.keys(types.filtersState.defaults.filters ?? {});
    let filteredResults = [...results];
    filtersArray.forEach(filter => {
      // query
      if (filter === FILTER_QUERY) {
        filteredResults = filteredResults.filter(
          result =>
            !filters[filter] ||
            JSON.stringify(result)
              .toLowerCase()
              .includes((filters[filter] ?? "").toLowerCase())
        );
      }
      // dates
      else if (filter.startsWith("from_")) {
        const field = filter.split("_")[1];
        filteredResults = filteredResults.filter(result => {
          const dateValue =
            field === "year"
              ? parseFloat(result[field]).toString()
              : result[field];
          return (
            !filters[filter] ||
            moment(dateValue).isSameOrAfter(moment(filters[filter]))
          );
        });
      } else if (filter.startsWith("to_")) {
        const field = filter.split("_")[1];
        filteredResults = filteredResults.filter(result => {
          const dateValue =
            field === "year"
              ? parseFloat(result[field]).toString()
              : result[field];
          return (
            !filters[filter] ||
            moment(dateValue).isSameOrBefore(moment(filters[filter]))
          );
        });
      }
      // all string filters
      else if (!Array(filters[filter])) {
        filteredResults = filteredResults.filter(
          result => !filters[filter] || filters[filter] === result[filter]
        );
      }
      // all array filters
      else if (Array(filters[filter])) {
        filteredResults = filteredResults.filter(
          result =>
            !filters[filter].length || filters[filter].includes(result[filter])
        );
      }
    });
    return filteredResults;
  };

  return applyFilter;
};

export default useFilters;
