import CircularProgress from '@mui/material/CircularProgress';

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import apiHooks from '../../../hooks/ApiHooks';
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
		},
	},
};
/**
 * AdminStats component.
 * This component is responsible for rendering a chart of user counts by role for an admin.
 * It fetches the user data from the API, and allows the admin to toggle the display of the chart.
 * If the data is loading, it renders a loading spinner.
 *
 * @returns {JSX.Element} The rendered AdminStats component.
 */

const AdminStats = () => {
	const [userData, setUserData] = useState(null);
	const [lectureData, setLectureData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			const rows = await apiHooks.getRoleCounts(token);
			const roleNames = rows.map(row => row.role_name);
			const userCounts = rows.map(row => row.user_count);
			setUserData({
				labels: roleNames,
				datasets: [
					{
						label: 'User Counts',
						data: userCounts,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
						hidden: false,
					},
				],
			});

			const lectureAttendanceCounts = await apiHooks.getLectureAndAttendanceCount(
				token,
			);
			const labels = Object.keys(lectureAttendanceCounts).map(label => {
				if (label === 'notattended') {
					return 'Not Attended';
				}
				return label.charAt(0).toUpperCase() + label.slice(1);
			});
			const data = Object.values(lectureAttendanceCounts) as number[];
			setLectureData({
				labels: labels,
				datasets: [
					{
						label: 'Counts',
						data: data,
						backgroundColor: 'rgba(255, 25, 2, 0.6)',
						hidden: false,
					},
				],
			});
		};

		fetchData();
	}, []);

	if (!userData || !lectureData) {
		return <CircularProgress />;
	}

	return (
		<div className="flex flex-col items-center justify-center bg-white p-5 w-1/2">
			<h2 className="mb-4 text-xl">Admin Stats</h2>
			<Bar options={options} data={userData} />
			<Bar options={options} data={lectureData} />
		</div>
	);
};

export default AdminStats;
