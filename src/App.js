import React from "react";
import axios from "axios";
import "./App.css";

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

	//
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	};

	const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
		return (
			<form onSubmit={onSearchSubmit} className="search-form">
				<InputWithLabel
					label="search"
					value={searchTerm}
					onInputChange={onSearchInput}
					isFocused
				>
					<strong>Search:</strong>
				</InputWithLabel>
				<button
					type="submit"
					className="button button_large"
					disabled={!searchTerm}
				>
					Submit
				</button>
			</form>
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
		<div className="container">
			<h1 className="headline-primary">My Hacker Stories</h1>
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
			<label htmlFor={id} className="label">
				{children}
			</label>
			&nbsp;
			<input
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				ref={inputRef}
				className="input"
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
		<div className="item">
			<span style={{ width: "40%" }}>
				<a href={item.url}>{item.title}</a>
			</span>
			<span style={{ width: "30%" }}>{item.author}</span>
			<span style={{ width: "10%" }}>{item.num_comments}</span>
			<span style={{ width: "10%" }}>{item.points}</span>
			<span>
				<button
					type="button"
					className="button button_small"
					onClick={() => onRemoveItem(item)}
				>
					Dismiss
				</button>
			</span>
		</div>
	);
};

export default App;
