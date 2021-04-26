import React from "react";
import { render } from "@testing-library/react";
import App, {
	storiesReducer,
	Item,
	List,
	SearchForm,
	InputWithLabel,
} from "./App";

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

// StoriesReducer Testing:
const storyOne = {
	title: "React",
	url: "https://reactjs.org/",
	author: "Jordan Walke",
	num_comments: 3,
	points: 4,
	objectID: 0,
};

const storyTwo = {
	title: "Redux",
	url: "https://redux.js.org/",
	author: "Dan Abramov, Andrew Clark",
	num_comments: 2,
	points: 5,
	objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("StoriesReducer Function: ", () => {
	//test remove_story:
	test("Remove Story from All Stories", () => {
		const action = { type: "REMOVE_STORY", payload: storyOne }; //TODO: some action
		const state = { data: stories, isLoading: false, isError: false }; //TODO: Some current state:

		const newState = storiesReducer(state, action);
		const expectedState = {
			data: [storyTwo],
			isLoading: false,
			isError: false,
		};

		expect(newState).toStrictEqual(expectedState);
	});

	//test fetch success:
	test("Fetch Stories from All Stories: ", () => {
		const action = { type: "STORIES_FETCH_SUCCESS", payload: stories };
		const state = { data: null, isLoading: false, isError: false };
		const newState = storiesReducer(state, action);
		const expectedState = {
			data: stories,
			isLoading: false,
			isError: false,
		};

		expect(newState).toStrictEqual(expectedState);
	});

	//test fetch failure:
	test("Fetch Stories Fails", () => {
		const action = { type: "STORIES_FETCH_FAILURE", payload: stories };
		const state = { data: null, isLoading: false, isError: false };
		const newState = storiesReducer(state, action);
		const expectedState = {
			data: null,
			isLoading: false,
			isError: true,
		};

		expect(newState).toStrictEqual(expectedState);
	});

	//test the init loading function:
	test("Test Init Function", () => {
		const action = { type: "STORIES_FETCH_INIT", payload: stories };
		const state = { data: null, isLoading: false, isError: false };
		const newState = storiesReducer(state, action);
		const expectedState = { data: null, isLoading: true, isError: false };

		expect(newState).toStrictEqual(expectedState);
	});
});
