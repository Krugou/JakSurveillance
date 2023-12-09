import React from 'react';
import {useNavigate} from 'react-router-dom';
/**
 * A button component that navigates to the login page when clicked.
 */
const StartViewButton: React.FC = () => {
	const navigate = useNavigate();

	return (
		<button
			className="bg-metropoliaMainOrange transition hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-10 m-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl"
			onClick={() => navigate('/login')}
		>
			Login
		</button>
	);
};

export default StartViewButton;
