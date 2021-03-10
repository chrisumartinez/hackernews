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
	new Promise((resolve) =>
		setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
	);

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

const App = () => {
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

	//Hook to setState of stories:
	const [stories, setStories] = React.useState([]);

	//useEffect Hook to pull data into initialStories:
	// no dependency to pull data into initialStories:
	React.useEffect(() => {
		getAsyncStories().then((result) => {
			setStories(result.data.stories);
		});
	}, []);

	//filter by searchTerm:
	const searchedStories = stories.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	//function to remove a story from list of stories:
	const handleRemoveStory = (item) => {
		const newStories = stories.filter(
			(story) => item.objectID !== story.objectID
		);
		setStories(newStories);
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
			<List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
