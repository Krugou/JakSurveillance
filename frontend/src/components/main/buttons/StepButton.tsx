import React from 'react';
/**
 * Props for the StepButton component.
 */
interface StepButtonProps {
	text: string;
	type: 'button' | 'submit';
	onClick: () => void;
	marginTop?: string;
}
/**
 * A button component that triggers a specified onClick function when clicked.
 * The button's text, type, and top margin can be customized.
 */
const StepButton: React.FC<StepButtonProps> = ({
	text,
	type,
	onClick,
	marginTop = 'mt-2',
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`w-40 h-fit p-2 ${marginTop} transition bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange`}
		>
			{text}
		</button>
	);
};

export default StepButton;
