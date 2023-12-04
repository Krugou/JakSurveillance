import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import AttendanceStatsTable from '../../../../components/main/course/attendance/AttendanceStatsTable';
import apiHooks from '../../../../hooks/ApiHooks';
import {
	exportStatsTableToExcel,
	exportStatsTableToPdf,
} from '../../../../utils/exportData';

interface Course {
	name: string;
	code: string;
	courseid: number;
	// Include other properties of course here
}

interface AttendanceCount {
	name: string;
	selectedTopics: string | string[];
	percentage: number;
	count: number; // Add this line
	topicname: string; // Add this line
}

interface TopicAttendance {
	topicname: string;
	attendanceCounts: AttendanceCount[];
}

const TeacherCourseStats = () => {
	const [showTable, setShowTable] = useState(false);
	const {courseid} = useParams<{courseid: string}>();
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [threshold, setThreshold] = useState(null);
	const [courses, setCourses] = useState<Course[]>([]);
	const [allAttendanceCounts, setAllAttendanceCounts] = useState<
		TopicAttendance[]
	>([]);

	// Get the attendance threshold % from the database
	const getThreshold = async () => {
		try {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const response = await apiHooks.getAttendanceThreshold(token);
			console.log(response, 'treshholdresponse');
			setThreshold(response.attendancethreshold);
		} catch (error) {
			console.log(error);
		}
	};

	// This function is called when the component is first rendered
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				// Fetch all courses using the token

				const response = await apiHooks.getAllCourses(token);
				console.log(response, 'response');
				// Set the fetched courses to the state
				setCourses(response);
			} catch (error) {
				// Show an error message if there's an error fetching courses
				toast.error('Error fetching courses');
			}
		};
		fetchCourses();
		getThreshold();
	}, []);
	console.log(courses, 'courses');

	// This function calculates the attendance for a single user on a single topic
	const sumUserAttendanceOnTopic = (users, userid, topicname) => {
		return users.filter(
			user =>
				user.userid === userid &&
				user.status === 1 &&
				(user.selectedParts && user.selectedParts.length > 0
					? user.selectedParts.some(
							part => part.topicname === topicname && user.topicname === topicname,
					  )
					: (!user.selectedParts || user.selectedParts.length === 0) &&
					  user.topicname === topicname),
		).length;
	};

	// This function calculates the attendance for all users on a single topic
	const calculateAttendanceForAllUsers = (users, lectures, topicname) => {
		const uniqueUserIds = [...new Set(users.map(user => user.userid))];
		const lecture = lectures.find(lecture => lecture.topicname === topicname);
		const lecture_count = lecture ? lecture.lecture_count : 0;

		// Calculate the attendance for each user
		const attendanceCounts = uniqueUserIds.map(userid => {
			const count = sumUserAttendanceOnTopic(users, userid, topicname);
			const user = users.find(user => user.userid === userid);
			const name = user ? `${user.last_name} ${user.first_name}` : 'Unknown User';
			// Get the selected topics for the user
			const selectedTopics =
				user && user.selectedParts && user.selectedParts.length > 0
					? user.selectedParts.map(part => part.topicname)
					: 'all';
			const percentage =
				lecture_count > 0
					? parseFloat(((count / lecture_count) * 100).toFixed(1))
					: 'No lectures'; // Calculate the percentage of attendance for the user on the topic if there are lectures
			return {
				name,
				count,
				topicname,
				percentage,
				selectedTopics,
			};
		});
		return attendanceCounts;
	};
	// This function calculates the attendance for all users on all topics
	const calculateAttendanceForAllTopics = (users, lectures) => {
		return lectures.map(lecture => {
			const attendanceCounts = calculateAttendanceForAllUsers(
				users,
				lectures,
				lecture.topicname,
			);
			return {
				topicname: lecture.topicname,
				attendanceCounts,
			};
		});
	};

	// This function is called when a course is selected
	const handleCourseSelect = async (value: string | null) => {
		if (!value) {
			return;
		}
		// Find the selected course from the courses array
		const selectedCourse = courses.find(
			course => `${course.name} ${course.code}` === value,
		);
		// If the selected course is found, fetch the course details
		if (selectedCourse) {
			try {
				setSelectedCourse(selectedCourse); // Add this line

				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseDetails = await apiHooks.getDetailsByCourseId(
					selectedCourse.courseid.toString(),
					token,
				);

				console.log(courseDetails);

				// Calculate the attendance for all users on all topics for the selected course
				const allAttendanceCounts = calculateAttendanceForAllTopics(
					courseDetails.users,
					courseDetails.lectures,
				);
				setAllAttendanceCounts(allAttendanceCounts);
				setShowTable(true);
				console.log(allAttendanceCounts, 'all attendancescounts');
			} catch (error) {
				toast.error('Error fetching course details');
				console.log(error);
			}
		}
	};

	// This function is called when the courseid changes in the url (when a course is selected)
	useEffect(() => {
		if (courseid) {
			const selectedCourse = courses.find(
				course => course.courseid.toString() === courseid,
			);
			if (selectedCourse) {
				handleCourseSelect(`${selectedCourse.name} ${selectedCourse.code}`);
			}
		}
	}, [courseid, courses]);

	const handlePdfExport = () => {
		if (!selectedCourse) {
			toast.error('No course selected');
			return;
		}
		exportStatsTableToPdf(allAttendanceCounts, selectedCourse);
	};
	const handleExcelExport = () => {
		exportStatsTableToExcel(allAttendanceCounts, selectedCourse);
	};
	return (
		<>
			<h1 className="text-center text-2xl mb-2 bg-white p-3 rounded-md">
				{' '}
				Attendance Statistics per course{' '}
			</h1>
			<div className="2xl:w-2/3 w-full bg-white p-4 ">
				<div className="flex justify-between sm:justify-around">
					<Tooltip title="Print to pdf">
						<button
							onClick={handlePdfExport}
							className="bg-metropoliaMainOrange text-white p-2 rounded"
						>
							<PrintIcon fontSize="large" />
						</button>
					</Tooltip>
					<Autocomplete
						className="sm:w-[20em] w-1/2"
						freeSolo
						options={courses.map(course => `${course.name} ${course.code}`)}
						onChange={(_, value) => handleCourseSelect(value)}
						value={
							selectedCourse ? `${selectedCourse.name} ${selectedCourse.code}` : null
						}
						renderInput={params => (
							<TextField
								{...params}
								label="Search courses"
								margin="normal"
								variant="outlined"
							/>
						)}
					/>
					<Tooltip title="Export to Excel">
						<button
							onClick={handleExcelExport}
							className="bg-metropoliaMainOrange text-white p-2 rounded"
						>
							<GetAppIcon fontSize="large" />
						</button>
					</Tooltip>
				</div>
				{showTable && (
					<AttendanceStatsTable
						allAttendanceCounts={allAttendanceCounts}
						threshold={threshold}
					/>
				)}
			</div>
		</>
	);
};

export default TeacherCourseStats;
