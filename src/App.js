import React from "react";

const initialStories = [
	{
		title: "React",
		url: "https://reactjs.org/",
		author: "Jordan Walke",
		num_comments: 3,
		points: 4,
		objectID: 0,
	},
	{
		title: "Redux",
		url: "https://redux.js.org/",
		author: "Dan Abramov, Andrew Clark",
		num_comments: 2,
		points: 5,
		objectID: 1,
	},
];

// Function to grab async data, returns a promise
const getAsyncStories = () =>
	// new Promise((resolve) =>
	// 	setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
	// );
	new Promise((resolve, reject) => setTimeout(reject, 2000));

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
	//Callback Handler for SearchTerm:
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	//useEffect Hook to pull data into initialStories:
	// no dependency to pull data into initialStories:
	React.useEffect(() => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });

		getAsyncStories()
			.then((result) => {
				dispatchStories({
					type: "STORIES_FETCH_SUCCESS",
					payload: result.data.stories,
				});
			})
			.catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
	}, []);

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
				onInputChange={handleSearch}
				isFocused
			>
				<strong>Search:</strong>
			</InputWithLabel>
			<hr />
			{stories.isError && <p>Error Occurred.</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
