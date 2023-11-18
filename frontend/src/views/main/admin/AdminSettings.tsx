import {
	Button,
	CircularProgress,
	Container,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import apiHooks from '../../../hooks/ApiHooks';
const AdminSettings = () => {
	const [settings, setSettings] = useState(null);
	const [speedofhash, setSpeedofhash] = useState(0);
	const [leewayspeed, setLeewayspeed] = useState(0);

	useEffect(() => {
		const fetchSettings = async () => {
			const serverSettings = await apiHooks.fetchServerSettings();
			setSpeedofhash(serverSettings.speedofhash);
			setLeewayspeed(serverSettings.leewayspeed);
			setSettings(serverSettings);
		};

		fetchSettings();
	}, []);

	const handleUpdate = async () => {
		const updatedSettings = await apiHooks.updateServerSettings(
			speedofhash,
			leewayspeed,
		);
		setSettings(updatedSettings);
	};

	if (!settings) {
		return (
			<div className="flex items-center justify-center h-screen">
				<CircularProgress />
			</div>
		);
	}

	return (
		<Container maxWidth="md" className="my-8 p-4 md:p-8">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h4" className="mb-4">
						Admin Settings
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						type="number"
						value={speedofhash}
						onChange={e => setSpeedofhash(Number(e.target.value))}
						label="Speed of Hash"
						variant="outlined"
						fullWidth
						className="mb-4"
						inputProps={{step: 100}}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						type="number"
						value={leewayspeed}
						onChange={e => setLeewayspeed(Number(e.target.value))}
						label="Hash speed multiplier for network catch-up"
						variant="outlined"
						fullWidth
						className="mb-4"
					/>
				</Grid>
				<Grid item xs={12}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleUpdate}
						fullWidth
					>
						Update Settings
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
};

export default AdminSettings;
