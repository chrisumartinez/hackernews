import { React } from "react";
import { StyledLabel, StyledInput } from "./styled_components";

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
			<StyledLabel htmlFor={id}>{children}</StyledLabel>
			&nbsp;
			<StyledInput
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				ref={inputRef}
			/>
		</>
	);
};

export default InputWithLabel;
