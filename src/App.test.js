import React from "react";
import App, {
	storiesReducer,
	Item,
	List,
	SearchForm,
	InputWithLabel,
} from "./App";
import axios from "axios";

import {
	render,
	screen,
	fireEvent,
	act,
	getByRole,
} from "@testing-library/react";

jest.mock("axios");

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

//testing item component:
describe("Item", () => {
	test("Render All Properties: ", () => {
		render(<Item item={storyOne} />);
		expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
		expect(screen.getByText("React")).toHaveAttribute(
			"href",
			"https://reactjs.org/"
		);
	});

	test("renders a clickable dismiss button", () => {
		render(<Item item={storyOne} />);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	test("clicking the dismiss button calls the callback handler", () => {
		const handleRemoveItem = jest.fn();
		render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
		fireEvent.click(screen.getByRole("button"));
		expect(handleRemoveItem).toHaveBeenCalledTimes(1);
	});
});

//Testing SearchForm:
describe("SearchForm", () => {
	const searchFormProps = {
		searchTerm: "React",
		onSearchInput: jest.fn(),
		onSearchSubmit: jest.fn(),
	};

	test("renders input field with target value: ", () => {
		render(<SearchForm {...searchFormProps} />);

		expect(screen.getByDisplayValue("React")).toBeInTheDocument();
	});

	// test("renders correct label: ", () => {
	// 	render(<SearchForm {...searchFormProps} />);
	// 	expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
	// });

	test("calls onSearchInput on input field change", () => {
		render(<SearchForm {...searchFormProps} />);

		//change value of searchform from react to redux:
		fireEvent.change(screen.getByDisplayValue("React"), {
			target: { value: "Redux" },
		});

		//test how many times callback handler was called:
		expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
	});

	test("Calls on SearchSubmit for button click", () => {
		render(<SearchForm {...searchFormProps} />);
		//fire event of button:
		fireEvent.submit(screen.getByRole("button"));
		expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
	});
});

//Testing List Component:
describe("List Component: ", () => {
	const listProps = {
		list: stories,
		onRemoveItem: jest.fn(),
	};

	test("rendering the list component: ", () => {
		render(<List {...listProps} />);
		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Redux")).toBeInTheDocument();
	});

	//TODO : onRemoveItem
	// test("Checking for OnRemoveItem to be called: ", () => {
	// 	render(<List {...listProps} />);

	// 	//fire off button click
	// 	//screen.debug();
	// 	const dismissEvents = screen.getAllByText("Dismiss");
	// 	fireEvent.click(dismissEvents[0]);
	// 	expect(dismissEvents[0]).toHaveBeenCalledTimes(1);

	// 	//expect(listProps.onRemoveItem).toHaveBeenCalledTimes(1);
	// });
});

//Testing the fetching of data:
describe("App: ", () => {
	test("Succeeds Fetching Data: ", async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});

		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		expect(screen.queryByText(/Loading/)).toBeInTheDocument();

		await act(() => promise);
		expect(screen.queryByText(/Loading/)).toBeNull();
		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Redux")).toBeInTheDocument();
		expect(screen.getAllByText("Dismiss").length).toBe(2);
	});

	test("Fetching Data Failed: ", async () => {
		const promise = Promise.reject();
		axios.get.mockImplementationOnce(() => promise);
		render(<App />);
		expect(screen.queryByText(/Loading/)).toBeInTheDocument();
		try {
			await act(() => promise);
		} catch (error) {
			expect(screen.queryByText(/Loading/)).toBeNull();
			expect(screen.queryByText(/Error/)).toBeInTheDocument();
		}
	});

	test("Removes a Story", async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});

		axios.get.mockImplementationOnce(() => promise);

		render(<App />);

		await act(() => promise);

		expect(screen.getAllByText("Dismiss").length).toBe(2);
		expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
		fireEvent.click(screen.getAllByText("Dismiss")[0]);
		expect(screen.queryByText("Jordan Walke")).toBeNull();
	});

	test("searches for specific stories", async () => {
		const reactPromise = Promise.resolve({
			data: {
				hits: stories,
			},
		});

		const anotherStory = {
			title: "JavaScript",
			url: "https://en.wikipedia.org/wiki/JavaScript",
			author: "Brendan Eich",
			num_comments: 15,
			points: 10,
			objectID: 3,
		};

		const javascriptPromise = Promise.resolve({
			data: {
				hits: [anotherStory],
			},
		});

		axios.get.mockImplementation((url) => {
			if (url.includes("React")) {
				return reactPromise;
			}

			if (url.includes("JavaScript")) {
				return javascriptPromise;
			}

			throw Error();
		});

		// Initial Render

		render(<App />);

		// First Data Fetching

		await act(() => reactPromise);

		expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
		expect(screen.queryByDisplayValue("JavaScript")).toBeNull();

		expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
		expect(
			screen.queryByText("Dan Abramov, Andrew Clark")
		).toBeInTheDocument();
		expect(screen.queryByText("Brendan Eich")).toBeNull();

		// User Interaction -> Search

		fireEvent.change(screen.queryByDisplayValue("React"), {
			target: {
				value: "JavaScript",
			},
		});

		expect(screen.queryByDisplayValue("React")).toBeNull();
		expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

		fireEvent.submit(screen.queryByText("Submit"));

		// Second Data Fetching

		await act(() => javascriptPromise);

		expect(screen.queryByText("Jordan Walke")).toBeNull();
		expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
		expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
	});
});
