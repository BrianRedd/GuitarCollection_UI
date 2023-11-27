/** @module App.test */

import { findByTestAttr, commonSetup } from "../utils/utilsTest";
import TestedComponent from "../App";

const defaultProps = {};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "container-app");
  expect(component.length).toBe(1);
});
