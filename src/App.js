import React from "react";
import axios from "axios";
import { ReactComponent as Check } from "./check.svg";
import { ReactComponent as SearchIcon } from "./search.svg";
//using fontAwesome Icons:
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

//styled css components:
import {
	StyledContainer,
	StyledHeadlinePrimary,
	StyledItem,
	StyledColumn,
	StyledButtonLarge,
	StyledButtonSmall,
	StyledSearchForm,
	StyledLabel,
	StyledInput,
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
			console.log("A");
			localStorage.setItem("key", value);
		}
	}, [value, key]);

	return [value, setValue];
};

const getSumComments = (stories) => {
	console.log("C");
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
	console.log("B: App");

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

	const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
		return (
			<StyledSearchForm onSubmit={handleSearchSubmit}>
				<InputWithLabel
					label="search"
					value={searchTerm}
					onInputChange={onSearchInput}
					isFocused
				>
					<SearchIcon height="20px" width="20px" />
				</InputWithLabel>
				<StyledButtonLarge type="submit" disabled={!searchTerm}>
					<FontAwesomeIcon icon={faArrowRight} />
				</StyledButtonLarge>
			</StyledSearchForm>
		);
	};

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
			{stories.isError && <p>Error Occurred.</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}

			<hr />
		</StyledContainer>
	);
};

const InputWithLabel = ({
	id,
	value,
	type = "text",
	onInputChange,
	isFocused,
	children,
}) => {
	const inputRef = React.useRef();

	React.useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused]);

	return (
		<>
			<StyledLabel htmlFor={id}>{children}</StyledLabel>
			&nbsp;
			<StyledInput
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				ref={inputRef}
			/>
		</>
	);
};

const List = React.memo(({ list, onRemoveItem }) =>
	list.map((item) => (
		<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
	))
);

const Item = ({ item, onRemoveItem }) => {
	return (
		<StyledItem>
			<StyledColumn width="40%">
				<a href={item.url}>{item.title}</a>
			</StyledColumn>
			<StyledColumn width="30%">{item.author}</StyledColumn>
			<StyledColumn width="10%">{item.num_comments}</StyledColumn>
			<StyledColumn width="10%">{item.points}</StyledColumn>
			<StyledColumn width="10%">
				<StyledButtonSmall
					type="button"
					onClick={() => onRemoveItem(item)}
				>
					<Check height="18px" width="18px" />
				</StyledButtonSmall>
			</StyledColumn>
		</StyledItem>
	);
};

export default App;
