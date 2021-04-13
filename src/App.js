import React from "react";
import axios from "axios";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
//custom hook:
const useSemiPersistentState = (key, initialState) => {
	//Hook to set any value:
	const [value, setValue] = React.useState(
		localStorage.getItem("key") || initialState
	);

	//Handling Search Side-Effect using useEffect Hook:
	React.useEffect(() => {
		localStorage.setItem("key", value);
	}, [value, key]);

	return [value, setValue];
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

	//Callback Handler for SearchTerm:
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	//
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = () => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
	};

	//Standalone function for data fetching
	//Instead of having it private in the useEffect Hook, it is now a outside public function:
	const handleFetchStories = React.useCallback(() => {
		if (!searchTerm) return;

		dispatchStories({ type: "STORIES_FETCH_INIT" });

		//JS: Use fetch() function to retrieve data from API_ENDPOINT: (fetch() => Browser's native fetch function)
		//Axios: Third Party Library, Alternative to fetch()
		axios // `${variable}strings to concatenate strings and string vars
			.get(url)
			.then((result) => {
				dispatchStories({
					type: "STORIES_FETCH_SUCCESS",
					payload: result.data.hits,
				}); //run our logic with successful payload
			})
			.catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" })); //if no payload, fire reducer logic for failure
	}, [url]);

	//useEffect Hook to pull data from function handleFetchStories(), dependant on function handleFetchStories()
	React.useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	//filter by searchTerm:
	const searchedStories = stories.data.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

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
		<div>
			<h1>My Hacker Stories</h1>

			<InputWithLabel
				label="search"
				value={searchTerm}
				onInputChange={handleSearchInput}
				isFocused
			>
				<strong>Search:</strong>
			</InputWithLabel>
			<button
				type="button"
				disabled={!searchTerm}
				onClick={handleSearchSubmit}
			>
				Submit
			</button>
			<hr />
			{stories.isError && <p>Error Occurred.</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}

			<hr />
		</div>
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
			<label htmlFor={id}>{children}</label>
			&nbsp;
			<input
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				ref={inputRef}
			/>
		</>
	);
};

const List = ({ list, onRemoveItem }) =>
	list.map((item) => (
		<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
	));

const Item = ({ item, onRemoveItem }) => {
	return (
		<div>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button type="button" onClick={() => onRemoveItem(item)}>
					Dismiss
				</button>
			</span>
		</div>
	);
};

export default App;
