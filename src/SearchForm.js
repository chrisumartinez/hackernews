import { StyledButtonLarge, StyledSearchForm } from "./styled_components.js";
import InputWithLabel from "./InputWithLabel.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as SearchIcon } from "./search.svg";
import React from "react";

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
	return (
		<StyledSearchForm onSubmit={onSearchSubmit}>
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
				Submit
			</StyledButtonLarge>
		</StyledSearchForm>
	);
};

export default SearchForm;
