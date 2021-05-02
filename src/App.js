import React from "react";
import axios from "axios";
import SearchForm from "./SearchForm";
import InputWithLabel from "./InputWithLabel";
import List from "./List";

//styled css components:
import {
	StyledContainer,
	StyledHeadlinePrimary,
	StyledListContainer,
} from "./styled_components.js";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
//custom hook:
const useSemiPersistentState = (key, initialState) => {
	//madeup state:
	const isMounted = React.useRef(false);

	//Hook to set any value:
	const [value, setValue] = React.useState(
		localStorage.getItem("key") || initialState
	);

	//Handling Search Side-Effect using useEffect Hook:
	React.useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
		} else {
			localStorage.setItem("key", value);
		}
	}, [value, key]);

	return [value, setValue];
};

const getSumComments = (stories) => {
	return stories.data.reduce(
		(result, value) => result + value.num_comments,
		0
	);
};

const storiesReducer = (state, action) => {
	//Stories useReducer Method:
	/*
	A reducer function always receives state and the action as its arguments. Based on
	these 2 arguments, it returns a new state.

	A reducer action often associated with a 'type':
	if type matches => do something.
	else:
		throw an error, that implementation is not covered.

	this function is covers only one type, then returns the payload of the incoming action
	without using the current state to returne a new one. The new state ==  the payload.
	*/
	switch (action.type) {
		case "STORIES_FETCH_INIT":
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case "STORIES_FETCH_SUCCESS":
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case "STORIES_FETCH_FAILURE":
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case "REMOVE_STORY":
			return {
				...state,
				data: state.data.filter(
					(story) => action.payload.objectID !== story.objectID
				),
			};
		default:
			throw new Error();
	}
};

const App = () => {
	//Use hook to call reducer function in app():
	/*
	hook receives reducer function + initial state as arguments, returns array with 2 items.
	1 = current state, 2 = state updater function (dispatch function)
	*/
	const [stories, dispatchStories] = React.useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	// //isLoading Hook:
	// const [isLoading, setIsLoading] = React.useState(false);
	// //error-handling hook:
	// const [isError, setIsError] = React.useState(false);

	//custom hook, call useSemiPersistentState();
	// another goal of custom hook: reusability
	const [searchTerm, setSearchTerm] = useSemiPersistentState(
		"search",
		"React"
	);

	//hook to grab the url:
	const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

	//
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	};

	const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

	//Standalone function for data fetching
	//Instead of having it private in the useEffect Hook, it is now a outside public function:
	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });

		try {
			const result = await axios.get(url);
			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		} //if no payload, fire reducer logic for failure
	}, [url]);

	//JS: Use fetch() function to retrieve data from API_ENDPOINT: (fetch() => Browser's native fetch function)
	//Axios: Third Party Library, Alternative to fetch()

	//useEffect Hook to pull data from function handleFetchStories(), dependant on function handleFetchStories()
	React.useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	//function to remove a story from list of stories:
	const handleRemoveStory = (item) => {
		// const newStories = stories.filter(
		// 	(story) => item.objectID !== story.objectID
		// );
		dispatchStories({
			type: "REMOVE_STORY",
			payload: item,
		});
	};

	return (
		<StyledContainer>
			<StyledHeadlinePrimary>
				My Hacker Stories with {sumComments} comments.
			</StyledHeadlinePrimary>
			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>
			<hr />
			<StyledListContainer>
				{stories.isError && <p>Error Occurred.</p>}
				{stories.isLoading ? (
					<p>Loading...</p>
				) : (
					<List
						list={stories.data}
						onRemoveItem={handleRemoveStory}
					/>
				)}
			</StyledListContainer>
			<hr />
		</StyledContainer>
	);
};

export default App;
export { storiesReducer, SearchForm, InputWithLabel, List };
