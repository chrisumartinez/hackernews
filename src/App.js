import React from "react";
import logo from "./logo.svg";
import "./App.css";

const title = "React";

function getTitle(title) {
	return title;
}

const App = () => {
	return (
		<div>
			<h1>Hello {getTitle("React")}</h1>

			<label htmlFor="search">Search: </label>
			<input id="search" type="text" />
		</div>
	);
};

export default App;
