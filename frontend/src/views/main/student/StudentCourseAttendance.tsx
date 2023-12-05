import React from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
import {FormControl, MenuItem, Select, Button} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttendanceTable from '../../../components/main/course/attendance/AttendanceTable';
import AttendanceStatsTable from '../../../components/main/course/attendance/AttendanceStatsTable';
import {useCourses} from '../../../hooks/courseHooks';
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

	const [showTable, setShowTable] = useState(true);

	// State to keep track of the search term
	const [searchTerm, setSearchTerm] = useState('');

	const {threshold} = useCourses();

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

	// Step 1: Create an object to hold the attendance counts for each topic
	const topicAttendanceCounts = {};

	// Step 2: Iterate over `attendanceData`
	attendanceData.forEach(item => {
		// If the `topicname` is not already a key in the object, add it
		if (!topicAttendanceCounts[item.topicname]) {
			topicAttendanceCounts[item.topicname] = {total: 0, attended: 0};
		}

		// Increment the `total` count for the topic
		topicAttendanceCounts[item.topicname].total += 1;

		// If the `status` is 1, increment the `attended` count for the topic
		if (item.status === 1) {
			topicAttendanceCounts[item.topicname].attended += 1;
		}
	});

	// Step 5: Calculate the attendance percentage for each topic
	const topicAttendancePercentages = {};
	for (const topic in topicAttendanceCounts) {
		const counts = topicAttendanceCounts[topic];
		topicAttendancePercentages[topic] = (counts.attended / counts.total) * 100;
	}

	const attendanceStudentData = {
		topics: uniqueTopics,
		attendance: topicAttendancePercentages,
	};
	// Filter the attendance data based on the search term and the selected sort option
	const filteredAttendanceData = attendanceData.filter(
		attendance =>
			new Date(attendance.start_date).toLocaleDateString().includes(searchTerm) &&
			(sortOption === 'All' || attendance.topicname === sortOption),
	);
	console.log(filteredAttendanceData, 'filteredAttendanceData');
	if (attendanceData.length > 0) {
		return (
			<div className="overflow-x-auto w-full bg-gray-100 p-10 flex flex-col border-x border-t">
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
							{uniqueTopics.map((topic, index) => (
								<MenuItem key={index} value={topic}>
									<div className="item-selector">
										<AutorenewIcon className="highest-star-selector-icon" />
										<span className="selector-text">{topic}</span>
									</div>
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="text-center">
					<Button
						variant="contained"
						color="primary"
						startIcon={<ShowChartIcon />}
						className="mt-4 sm:mt-0 w-1/3"
						onClick={() => setShowTable(!showTable)}
					>
						Attendance statistics
					</Button>
				</div>
				{showTable && (
					<AttendanceTable filteredAttendanceData={filteredAttendanceData} />
				)}
				{!showTable && (
					<AttendanceStatsTable
						attendanceStudentData={attendanceStudentData}
						threshold={threshold}
						usercourseid={usercourseid}
					/>
				)}
			</div>
		);
	} else {
		return <div className="text-center text-3xl m-10">No Data available</div>;
	}
};

export default StudentCourseAttendance;
