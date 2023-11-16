import React from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
import {FormControl, MenuItem, Select} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface Attendance {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	status: number;
}

const StudentCourseAttendance: React.FC = () => {
	const {usercourseid} = useParams<{usercourseid}>();
	const [sortOption, setSortOption] = useState('All');

	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAttendanceInfoByUsercourseid(
					usercourseid,
					token,
				);
				console.log(response, 'RESPONSE');
				setAttendanceData(response);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [usercourseid]);

	if (!attendanceData) {
		return <div>Loading...</div>;
	}

	const handleChange = event => {
		setSortOption(event.target.value);
		// Add sorting logic here
	};

	const uniqueTopics: string[] = Array.from(
		new Set(
			attendanceData.reduce((unique: string[], attendance) => {
				return unique.includes(attendance.topicname)
					? unique
					: [...unique, attendance.topicname];
			}, [] as string[]),
		),
	);

	console.log(uniqueTopics);
	const filteredAttendanceData = attendanceData.filter(
		attendance =>
			new Date(attendance.start_date).toLocaleDateString().includes(searchTerm) &&
			(sortOption === 'All' || attendance.topicname === sortOption),
	);
	return (
		<div className="overflow-x-auto flex flex-col border-x border-t">
			<h1 className="text-xl sm:text-4xl font-bold mt-2 mb-8 text-center">
				Attendance for Course {attendanceData[0].name}
			</h1>
			<div className="flex items-center justify-around flex-wrap">
				<input
					type="text"
					placeholder="Search by date"
					value={searchTerm}
					onChange={handleSearchChange}
					className="w-1/6 mt-10 p-4 m-2 border border-black rounded"
				/>
				<FormControl className="md:w-1/4 mt-2 md:mt-0">
					<label>Sort Topics:</label>
					<Select
						className="favorite-selector"
						value={sortOption}
						onChange={handleChange}
					>
						<MenuItem value="All">
							<div className="item-selector">
								<AutorenewIcon className="highest-star-selector-icon" />
								<span className="selector-text">All</span>
							</div>
						</MenuItem>
						{uniqueTopics.map(topic => (
							<MenuItem value={topic}>
								<div className="item-selector">
									<AutorenewIcon className="highest-star-selector-icon" />
									<span className="selector-text">{topic}</span>
								</div>
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className="overflow-x-auto border-x border-t m-6">
				<table className="table-auto w-full">
					<thead className="border-b">
						<tr className="bg-gray-100">
							<th className="text-left p-4 font-medium underline">Date</th>
							<th className="text-left p-4 font-medium underline">Duration</th>
							<th className="text-left p-4 font-medium underline">Time of Day</th>
							<th className="text-left p-4 font-medium underline">Topic</th>
							<th className="text-left p-4 font-medium underline">Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredAttendanceData.map((attendance, index) => (
							<tr
								key={index}
								className={`border-b hover:bg-gray-50 ${
									attendance.status === 0
										? 'bg-metropoliaSupportRed'
										: 'bg-metropoliaTrendGreen'
								}`}
							>
								<td className="p-4">
									{new Date(attendance.start_date).toLocaleDateString()}
								</td>
								<td className="p-4">unknown</td>
								<td className="p-4">{attendance.timeofday}</td>
								<td className="p-4">{attendance.topicname}</td>
								<td className="p-4">
									{attendance.status === 1 ? 'Present' : 'Absent'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StudentCourseAttendance;
