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

const StopWatch = () => {
	const [isOn, setIsOn] = React.useState(false);
	const [timer, setTimer] = React.useState(0);

	React.useEffect(() => {
		let interval;
		if (isOn) {
			interval = setInterval(() => setTimer((timer) => timer + 1), 1000);
		}

		return () => clearInterval(interval);
	}, [isOn]);

	const onReset = () => {
		setIsOn(false);
		setTimer(0);
	};

	return (
		<div>
			{timer}

			{!isOn && (
				<button type="button" onClick={() => setIsOn(true)}>
					Start
				</button>
			)}

			{isOn && (
				<button type="button" onClick={() => setIsOn(false)}>
					Stop
				</button>
			)}

			<button type="button" onClick={() => onReset()}>
				Reset
			</button>
		</div>
	);
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

			<Search onSearch={handleSearch} search={searchTerm} />

			<hr />
			<List list={searchedStories} />
			<hr />
			<StopWatch />
		</div>
	);
};

const Search = (props) => {
	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input
				id="search"
				type="text"
				value={props.search}
				onChange={props.onSearch}
			/>
		</div>
	);
};

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
