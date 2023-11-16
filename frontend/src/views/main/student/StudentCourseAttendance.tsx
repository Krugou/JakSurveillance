import React from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
import {FormControl, MenuItem, Select} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// Interface for the attendance data
interface Attendance {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	teacher: string;
	status: number;
}

const StudentCourseAttendance: React.FC = () => {
	// Get the usercourseid from the url
	const {usercourseid} = useParams<{usercourseid}>();

	// State to keep track of the sort option
	const [sortOption, setSortOption] = useState('All');

	// State to keep track of the attendance data
	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);

	// State to keep track of the search term
	const [searchTerm, setSearchTerm] = useState('');

	// Function to handle search term change
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};
	// Fetch attendance data for the course
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

	// If the attendance data is not available, return a loading message
	if (!attendanceData) {
		return <div>Loading...</div>;
	}

	// Function to handle sort option change
	const handleChange = event => {
		setSortOption(event.target.value);
	};

	// Create an array of unique topics from the attendance data
	const uniqueTopics: string[] = Array.from(
		new Set(
			attendanceData.reduce((unique: string[], attendance) => {
				// If the topic name is already in the unique array, return the array as is
				// Otherwise, add the topic name to the unique array
				return unique.includes(attendance.topicname)
					? unique
					: [...unique, attendance.topicname];
			}, [] as string[]),
		),
	);

	// Filter the attendance data based on the search term and the selected sort option
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
							<th className="text-left p-4 font-medium underline">Teacher</th>
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
								<td className="p-4">{attendance.teacher}</td>
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
