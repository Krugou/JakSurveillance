import React from 'react';
import '../../../src/index.css';
import Logo from '../../components/Logo';
import StartViewButton from '../../components/main/buttons/StartViewButton';
const StartView = () => {
	return (
		<div className="flex flex-col items-center justify-center logo-container border-metropoliaMainOrange border-t-4 pt-10">
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
