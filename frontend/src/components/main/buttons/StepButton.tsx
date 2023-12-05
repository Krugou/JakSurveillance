import React from 'react';
interface StepButtonProps {
	text: string;
	type: 'button' | 'submit';
	onClick: () => void;
	marginTop?: string;
}

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
