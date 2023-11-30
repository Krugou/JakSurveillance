import {Button} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import apiHooks from '../../../hooks/ApiHooks';
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);
const AdminStats = () => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: '',
				data: [],
				backgroundColor: '',
			},
		],
	});
	const [loading, setLoading] = useState(true);
	const [showUserData, setShowUserData] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			// Get the token
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const rows = await apiHooks.getRoleCounts(token);
			console.log('🚀 ~ file: AdminStats.tsx:16 ~ fetchData ~ rows:', rows);

			// Extract role names and user counts from the rows
			const roleNames = rows.map(row => row.role_name);
			const userCounts = rows.map(row => row.user_count);

			// Create the chart data
			const data = {
				labels: roleNames,
				datasets: [
					{
						label: 'User Count',
						data: userCounts,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
					},
				],
			};

			setChartData(data);
			setLoading(false);
		};

		fetchData();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div className="flex flex-col items-center justify-center bg-white w-1/2">
			<h2 className="mb-4">Admin Stats</h2>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setShowUserData(!showUserData)}
			>
				Show User Count
			</Button>
			{showUserData && <Line data={chartData} />}
		</div>
	);
};

export default AdminStats;
