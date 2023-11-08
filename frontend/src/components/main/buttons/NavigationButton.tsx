// NavigationButton.tsx
import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';

interface NavigationButtonProps {
	user: {role: string; username: string} | null;
	path: string;
	label: string;
}

const NavigationButton: FC<NavigationButtonProps> = ({user, path, label}) => {
	const navigate = useNavigate();

	return (
		user && (
			<button
				className="mx-2 px-2 w-full bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				onClick={() => navigate(path)}
			>
				{label}
			</button>
		)
	);
};

export default NavigationButton;
