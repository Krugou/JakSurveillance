import React from 'react';
import Logo from '../../components/Logo';
import StartViewButton from '../../components/main/buttons/StartViewButton';
/**
 * StartView component.
 * This component is responsible for rendering the start view of the application.
 * It displays the application logo, a start view button, and some information about the current build.
 */
const StartView = () => {
	return (
		<div className="flex flex-col items-center justify-center logo-container pt-10">
			<Logo />
			<div className="flex flex-col md:flex-row items-center m-4 p-4">
				<StartViewButton />
			</div>

			{import.meta.env.MODE === 'development' ? (
				<>
					<p>Development mode</p>
					<p> no PWA </p>
				</>
			) : (
				<p>Build date: {import.meta.env.VITE_REACT_APP_BUILD_DATE}</p>
			)}
		</div>
	);
};

export default StartView;
