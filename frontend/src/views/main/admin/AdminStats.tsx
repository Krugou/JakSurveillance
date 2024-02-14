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
	const [userStatistics, setUserStatistics] = useState<{
		labels: string[];
		datasets: ChartDataset<'bar', number[]>[];
	} | null>(null);
	const [attendanceStatistics, setAttendanceStatistics] = useState<
		number[] | null
	>(null);
	const [lectureStatistics, setLectureStatistics] = useState<{
		labels: string[];
		datasets: ChartDataset<'bar', number[]>[];
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [userStatisticsPercentage, setUserStatisticsPercentage] =
		useState<number>(0);

	const fetchUserStatistics = async (token: string) => {
		const roleCounts: RoleCount[] = await apiHooks.getRoleCounts(token);
		console.log('🚀 ~ fetchUserStatistics ~ roleCounts:', roleCounts);
		const roleNames = roleCounts.map(row => row.role_name);
		const userCounts = roleCounts.map(row => row.user_count);
		const studentCount =
			roleCounts.find(row => row.role_name === 'student')?.user_count || 0;
		const studentsLoggedCount =
			roleCounts.find(row => row.role_name === 'StudentsLogged')?.user_count || 0;
		const studentsLoggedPercentage = (studentsLoggedCount / studentCount) * 100;
		setUserStatisticsPercentage(studentsLoggedPercentage);
		setUserStatistics({
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
	};

	const fetchLectureStatistics = async (token: string) => {
		const lectureAttendanceCounts: LectureAttendanceCount =
			await apiHooks.getLectureAndAttendanceCount(token);
		const labels = Object.keys(lectureAttendanceCounts).map(label => {
			if (label === 'notattended') {
				return 'Not Attended';
			}
			return label.charAt(0).toUpperCase() + label.slice(1);
		});
		const data = Object.values(lectureAttendanceCounts) as number[];
		setAttendanceStatistics(data);
		setLectureStatistics({
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

	useEffect(() => {
		const fetchData = async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				setError('No token available');
				return;
			}

			try {
				await fetchUserStatistics(token);
				await fetchLectureStatistics(token);
			} catch (error) {
				setError('Failed to fetch data');
			}
		};

		fetchData();
	}, []);

	if (error) {
		return <p>{error}</p>;
	}

	if (!userStatistics || !lectureStatistics) {
		return <CircularProgress />;
	}

	return (
		<div className="flex flex-col items-center justify-center bg-white p-5 md:w-1/2 w-full">
			<h2 className="mb-4 text-2xl">Administrator Statistics</h2>
			<h2 className="mb-4 text-xl">User Statistics</h2>
			<p>{`Percentage of students who have logged in at least once: ${userStatisticsPercentage.toFixed(
				2,
			)}%`}</p>
			<div className="w-full">
				<Bar options={options} data={userStatistics} />
			</div>
			<h2 className="mb-4 text-xl">Attendance Statistics</h2>
			{attendanceStatistics && (
				<p>
					{`Total lectures: ${attendanceStatistics[0]}. Attendance ratio: ${(
						(attendanceStatistics[2] /
							(attendanceStatistics[2] + attendanceStatistics[1])) *
						100
					).toFixed(2)}%`}
				</p>
			)}
			<div className="w-full">
				<Bar options={options} data={lectureStatistics} />
			</div>
		</div>
	);
};

export default AdminStats;
