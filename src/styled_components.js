import styled from "styled-components";

export const StyledContainer = styled.div`
	height: 100vw;
	padding: 20px;

	background-color: #ff9d00;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23000' stroke-width='66.7' stroke-opacity='0.05' %3E%3Ccircle fill='%23ff9d00' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23fb8d17' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23f47d24' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%23ed6e2d' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23e35f34' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23d85239' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23cc453e' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23be3941' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23b02f43' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23a02644' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23901e44' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23801843' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%236f1341' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%235e0f3d' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%234e0c38' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%233e0933' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%232e062c' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23210024' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E");
	background-attachment: fixed;
	background-size: cover;

	color: #171212;
`;

export const StyledHeadlinePrimary = styled.h1`
	font-size: 48px;
	font-weight: 400;
	letter-spacing: 2px;
	backdrop-filter: blur(6px);
	background-color: rgba(255, 255, 255, 0.3);
	font-family: "Victor Mono";
`;

export const StyledItem = styled.div`
	display: flex;
	align-items: center;
	padding-bottom: 5px;
	font-family: "Victor Mono";
	font-weight: 500;
	font-size: 21px;
`;

export const StyledColumn = styled.span`
	padding: 0 5px;
	white-space: nowrap;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	a {
		color: inherit;
	}

	width: ${(props) => props.width};
`;

export const StyledButton = styled.button`
	background: transparent;
	border: 1px solid #171212;
	padding: 5px;
	cursor: pointer;

	transition: all 0.1s ease-in;

	&:hover {
		background: #171212;
		color: #ffffff;
	}
`;

export const StyledButtonSmall = styled(StyledButton)`
	padding: 5px;
	padding-left: 5px;
	font-family: "Victor Mono";
	font-size: 18px;
	margin-right: 10px;

	&:hover {
		fill: #ffffff;
		stroke: #ffffff;
	}
`;

export const StyledButtonLarge = styled(StyledButton)`
	padding: 10px;
	font-family: "Victor Mono";
	font-size: 18px;
`;

export const StyledSearchForm = styled.form`
	padding: 10px 0 20px 0;
	backdrop-filter: blur(6px);
	background-color: rgba(255, 255, 255, 0.3);
	font-family: "Victor Mono";
`;

export const StyledLabel = styled.label`
	border-top: 1px solid #171212;
	border-left: 1px solid #171212;
	padding-left: 5px;
	font-size: 24px;
`;

export const StyledInput = styled.input`
	border: none;
	border-bottom: 1px solid #171212;
	background-color: transparent;
	font-size: 24px;
`;

export const StyledListContainer = styled.div`
	backdrop-filter: blur(0.5rem);
	background-color: rgba(255, 255, 255, 0.3);
`;

export const StyledSortContainer = styled.div`
	backdrop-filter: blur(0.5rem);
	background-color: rgba(255, 255, 255, 0.3);
	display: flex;
`;

export const StyledSortButton = styled(StyledButton)`
	width = ${(props) => props.width};
	font-family: "Victor Mono";
	font-size: 18px;
`;

export const StyledSortActiveButton = styled(StyledButton)`
width = ${(props) => props.width};
font-family: "Victor Mono";
font-size: 18px;
color: orange;

`;

export const StyledSortColumn = styled.span`
	padding: 0 5px;
	white-space: nowrap;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-family: "Victor Mono";
	font-size: 24px;

	a {
		color: inherit;
	}

	width: ${(props) => props.width};
`;
