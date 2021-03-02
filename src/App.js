import React from "react";

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

	const stories = [
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

	//filter by searchTerm:
	const searchedStories = stories.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div>
			<h1>My Hacker Stories</h1>

			<InputWithLabel
				id="search"
				label="search"
				value={searchTerm}
				onInputChange={handleSearch}
			/>
			<hr />
			<List list={searchedStories} />
			<hr />
		</div>
	);
};

const InputWithLabel = ({ id, label, value, type = "text", onInputChange }) => (
	<>
		<label htmlFor={id}>{label}</label>
		&nbsp;
		<input id={id} type={type} value={value} onChange={onInputChange} />
	</>
);

const List = ({ list }) =>
	list.map((item) => <Item key={item.objectID} item={item} />);

const Item = ({ item }) => (
	<div>
		<span>
			<a href={item.url}>{item.title}</a>
		</span>
		<span>{item.author}</span>
		<span>{item.num_comments}</span>
		<span>{item.points}</span>
	</div>
);

export default App;
