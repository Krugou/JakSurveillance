import React from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Props for the GeneralLinkButton component.
 */
interface GeneralLinkButtonProps {
	path: string;
	text: string;
}
/**
 * A button component that navigates to a specified path when clicked.
 */
const GeneralLinkButton: React.FC<GeneralLinkButtonProps> = ({path, text}) => {
	const navigate = useNavigate();
	return (
		<button
			className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
			onClick={() => navigate(path)}
		>
			{text}
		</button>
	);
};

export default GeneralLinkButton;
