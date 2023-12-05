import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';

interface NavigationButtonProps {
	user: any;
	path: string;
	label: string;
}

const NavigationButton: FC<NavigationButtonProps> = ({user, path, label}) => {
	const navigate = useNavigate();

	return (
		user && (
			<button
				type="button"
				className="mx-2 px-4 py-2 sm:w-full transition w-fit bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange border border-white"
				onClick={() => navigate(path)}
			>
				{label}
			</button>
		)
	);
};

export default NavigationButton;
