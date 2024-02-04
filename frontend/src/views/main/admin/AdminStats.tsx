import CircularProgress from '@mui/material/CircularProgress';
import {
	BarElement,
	CategoryScale,
	ChartDataset,
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

interface RoleCount {
	role_name: string;
	user_count: number;
}

interface LectureAttendanceCount {
	[key: string]: number;
}

const AdminStats = () => {
	const [userData, setUserData] = useState<{
		labels: string[];
		datasets: ChartDataset<'bar', number[]>[];
	} | null>(null);

	const [lectureData, setLectureData] = useState<{
		labels: string[];
		datasets: ChartDataset<'bar', number[]>[];
	} | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			const rows: RoleCount[] = await apiHooks.getRoleCounts(token);
			console.log('🚀 ~ fetchData ~ rows:', rows);
			const roleNames = rows.map(row => row.role_name);
			const userCounts = rows.map(row => row.user_count);
			console.log('🚀 ~ fetchData ~ userCounts:', userCounts);
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

			const lectureAttendanceCounts: LectureAttendanceCount =
				await apiHooks.getLectureAndAttendanceCount(token);
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
						label: 'Attendance Counts',
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
