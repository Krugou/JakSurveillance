import DangerousIcon from '@mui/icons-material/Dangerous';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
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
	const [newestVersion, setNewestVersion] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(baseUrl + 'metrostation/')
			.then(response => response.json() as Promise<ServerResponse>)
			.then(data => {
				const builddate = data.builddate;
				if (builddate === import.meta.env.VITE_REACT_APP_BUILD_DATE) {
					setNewestVersion(true);
				}
				setLoading(false);
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
			{loading === true ? (
				<CircularProgress />
			) : import.meta.env.MODE === 'development' ? (
				<>
					<p>Development mode</p>
					<p> no PWA </p>
					<p> Api: {isServerOnline ? <DoneIcon /> : <DangerousIcon />} </p>
				</>
			) : (
				<>
					<p className="animate-bounce font-medium text-xl ">
						{isServerOnline
							? ''
							: 'You are not connected to Metropolia internal network'}
					</p>
					{isServerOnline && (
						<p>
							Version: {newestVersion ? <DoneIcon /> : <DangerousIcon />} Api:{' '}
							{isServerOnline ? <DoneIcon /> : <DangerousIcon />}{' '}
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default StartView;
