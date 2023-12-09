/** @module constants */

import {
  faFileContract,
  faGift,
  faHandHoldingDollar,
  faTag
} from "@fortawesome/free-solid-svg-icons";

export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_ORDER_BY = "name";

export const TEXT_REQUIRED = "Required";

export const DATE_FORMAT = "YYYY-MM-DD";

export const OWNERSHIP_STATUS_OPTIONS = [
  {
    value: "PUR",
    label: "Purchased"
  },
  {
    value: "UCT",
    label: "Under Contract",
    icon: faFileContract
  },
  {
    value: "FSA",
    label: "For Sale",
    icon: faTag
  },
  {
    value: "SLD",
    label: "Sold",
    icon: faHandHoldingDollar
  },
  {
    value: "GFT",
    label: "Gifted",
    icon: faGift
  }
];

export const COUNTRY_OPTIONS_DEFAULTS = ["United States"];

export const INSTRUMENT_OPTION_GUITAR = "Guitar";

export const INSTRUMENT_OPTIONS_DEFAULTS = [INSTRUMENT_OPTION_GUITAR];

export const SOUNDSCAPE_OPTIONS_DEFAULTS = [
  "Acoustic",
  "Acoustic/Electric",
  "Classical/Nylon",
  "Electric",
  "Electric Stereo"
];

export const COLOR_OPTIONS_DEFAULTS = [
  "Black",
  "Natural",
  "Red",
  "Tobacco Sunburst"
];

export const TUNING_OPTIONS_DEFAULTS = [
  "Standard/EADGBE",
  "Drop-D/DADGBE",
  "D-Scale/DGCFAD"
];

export const STATUS_OPTION_PLAYABLE = "Playable";

export const STATUS_OPTIONS_DEFAULTS = [
  STATUS_OPTION_PLAYABLE,
  "Display Only",
  "In Need of Repairs",
  "In Transit",
  "For Sale",
  "Offsite for Repairs",
  "Sold or Gifted"
];

export const CAPTION_OPTION_FULL_FRONT = "Full Front";
export const CAPTION_OPTION_RECEIPT = "Receipt";

export const CAPTION_OPTIONS_DEFAULTS = [
  CAPTION_OPTION_FULL_FRONT,
  "Full Side",
  "Body Front",
  "Body Back",
  "Headstock Front",
  "Headstock Back",
  "Label",
  "Serial Number",
  "Case",
  CAPTION_OPTION_RECEIPT
];

export const SPEC_OPTIONS_DEFAULTS = [
  "Body Material",
  "Body Type",
  "Bridge",
  "Decorations",
  "Electronics",
  "Fretboard",
  "Hardware",
  "Neck Length",
  "Neck Material",
  "Nut Material",
  "Nut Width",
  "Pickups",
  "Pre-Amp",
  "Scale Length",
  "Sound Hole",
  "Tailpiece",
  "Tuners",
  "Reference Link^",
  "Other"
];

export const TODO_OPTIONS_DEFAULTS = [
  "Not Started",
  "In Progress",
  "On Hold",
  "Completed"
];

export const ADMIN_PERM = "ADMIN";
export const GUITAR_PERM = "EDIT_GUITAR";
export const BRAND_PERM = "EDIT_BRAND";
export const PURCHASE_PERM = "VIEW_PURCHASE_HISTORY";

export const PERMISSIONS_OPTIONS = [
  ADMIN_PERM,
  BRAND_PERM,
  GUITAR_PERM,
  PURCHASE_PERM
];

export const FILTER_QUERY = "query";
export const FILTER_STATUS = "status";
export const FILTER_FEATURED_STATUS = "featuredStatus";

export const ALLOWED_DATE_FORMATS = [
  "DD/MM/YYYY",
  "DD/M/YYYY",
  "D/MM/YYYY",
  "D/M/YYYY",
  "YYYY-MM-DD",
  "YYYY-M-DD",
  "MM/YYYY",
  "M/YYYY",
  "YYYY-MM",
  "YYYY-M"
];
