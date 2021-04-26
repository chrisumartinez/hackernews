import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// Example of a test suite with tests:
//Describe block is test suite, test blocks are test cases:
describe("something truthy and falsy", () => {
	test("true to be true", () => {
		expect(true).toBeTruthy();
	});
	test("false to be false", () => {
		expect(false).toBeFalsy();
	});
});

//
