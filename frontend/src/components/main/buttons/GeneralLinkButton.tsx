import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GeneralLinkButtonProps {
	path: string;
	text: string;
}

const GeneralLinkButton: React.FC<GeneralLinkButtonProps> = ({path, text}) => {
	const navigate = useNavigate();
	return (
		<button
			className="bg-metropoliaMainOrange transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
			onClick={() => navigate(path)}
		>
			{text}
		</button>
	);
};

export default GeneralLinkButton;
