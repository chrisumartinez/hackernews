import React from "react";
import { sortBy } from "lodash";

import {
	StyledItem,
	StyledColumn,
	StyledButtonSmall,
	StyledSortContainer,
	StyledListContainer,
	StyledSortColumn,
	StyledSortButton,
} from "./styled_components";
import { ReactComponent as Check } from "./check.svg";

const List = ({ list, onRemoveItem }) => {
	//sortHook:
	const [sort, setSort] = React.useState({
		sortKey: "None",
		isReverse: false,
	});

	const handleSort = (sortKey) => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse;

		setSort({ sortKey, isReverse });
	};

	const SORTS = {
		None: (list) => list,
		TITLE: (list) => sortBy(list, "title"),
		AUTHOR: (list) => sortBy(list, "author"),
		COMMENTS: (list) => sortBy(list, "comments"),
		POINTS: (list) => sortBy(list, "points").reverse(),
	};

	const sortFunction = SORTS[sort.sortKey];

	const sortedList = sort.isReverse
		? sortFunction(list).reverse()
		: sortFunction(list);

	return (
		<StyledListContainer>
			<StyledSortContainer>
				<StyledSortColumn width="40%">
					<StyledSortButton
						width="40%"
						type="button"
						onClick={() => handleSort("TITLE")}
					>
						Title
					</StyledSortButton>
				</StyledSortColumn>
				<StyledSortColumn width="30%">
					{" "}
					<StyledSortButton
						width="30%"
						type="button"
						onClick={() => handleSort("AUTHOR")}
					>
						Author
					</StyledSortButton>
				</StyledSortColumn>
				<StyledSortColumn width="10%">
					{" "}
					<StyledSortButton
						width="10%"
						type="button"
						onClick={() => handleSort("COMMENTS")}
					>
						Comments
					</StyledSortButton>
				</StyledSortColumn>
				<StyledSortColumn width="10%">
					{" "}
					<StyledSortButton
						width="10%"
						type="button"
						onClick={() => handleSort("POINTS")}
					>
						Points
					</StyledSortButton>
				</StyledSortColumn>
				<StyledSortColumn width="10%">Actions</StyledSortColumn>
			</StyledSortContainer>
			{sortedList.map((item) => (
				<Item
					key={item.objectID}
					item={item}
					onRemoveItem={onRemoveItem}
				/>
			))}
		</StyledListContainer>
	);
};

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
					Dismiss
				</StyledButtonSmall>
			</StyledColumn>
		</StyledItem>
	);
};

export default List;
