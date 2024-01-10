import DangerousIcon from '@mui/icons-material/Dangerous';
import DoneIcon from '@mui/icons-material/Done';
import React, {useEffect, useState} from 'react';
import Logo from '../../components/Logo';
import StartViewButton from '../../components/main/buttons/StartViewButton';
import {baseUrl} from '../../hooks/ApiHooks';

// Interface for the expected response from the server
interface ServerResponse {
	builddate: string;
}

/**
 * StartView component.
 * This component is responsible for rendering the start view of the application.
 * It displays the application logo, a start view button, and some information about the current build.
 */
const StartView = () => {
	const [isServerOnline, setIsServerOnline] = useState(false);
	const [newestVersion, setNewestVersion] = useState(true);

	useEffect(() => {
		fetch(baseUrl + 'metrostation/')
			.then(response => response.json() as Promise<ServerResponse>)
			.then(data => {
				const builddate = data.builddate;
				if (builddate === import.meta.env.VITE_REACT_APP_BUILD_DATE) {
					setNewestVersion(true);
				}
				setIsServerOnline(true);
			})
			.catch(() => setIsServerOnline(false));
	}, []);

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
					<p>{isServerOnline ? <DoneIcon /> : <DangerousIcon />} </p>
				</>
			) : (
				<>
					<p>
						Version: {newestVersion ? <DoneIcon /> : <DangerousIcon />} Api:{' '}
						{isServerOnline ? <DoneIcon /> : <DangerousIcon />}{' '}
					</p>
				</>
			)}
		</div>
	);
};

export default StartView;
