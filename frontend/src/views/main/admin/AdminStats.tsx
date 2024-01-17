import {Button, Stack} from '@mui/material';
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
import React, {useState} from 'react';
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
	type ChartData = {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			backgroundColor: string;
			hidden: boolean;
		}[];
	};

	const [chartData, setChartData] = useState<ChartData>({
		labels: [],
		datasets: [],
	});
	const [loading, setLoading] = useState(false);

	const fetchUserData = async () => {
		setLoading(true);
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const rows = await apiHooks.getRoleCounts(token);

		const roleNames = rows.map(row => row.role_name);
		const userCounts = rows.map(row => row.user_count);

		setChartData({
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

		setLoading(false);
	};

	const fetchLectureAttendanceData = async () => {
		setLoading(true);
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
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

		setChartData({
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

		setLoading(false);
	};

	if (loading) {
		return <CircularProgress />;
	}
	return (
		<div className="flex flex-col items-center justify-center bg-white p-5 w-1/2">
			<h2 className="mb-4 text-xl">Admin Stats</h2>
			<div className="flex">
				<Stack direction="row" spacing={2}>
					<Button variant="contained" color="primary" onClick={fetchUserData}>
						Show User Count
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={fetchLectureAttendanceData}
					>
						Show Lecture and Attendance Count
					</Button>
				</Stack>
			</div>
			<Bar options={options} data={chartData} />
		</div>
	);
};

export default AdminStats;
