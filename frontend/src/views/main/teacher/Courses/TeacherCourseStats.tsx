import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import apiHooks from '../../../../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import AttendanceStatsTable from '../../../../components/main/course/attendance/AttendanceStatsTable';

interface Course {
	name: string;
	code: string;
	courseid: number;
	// Include other properties of course here
}

const TeacherCourseStats = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [allAttendanceCounts, setAllAttendanceCounts] = useState([]);
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAllCourses(token);
				console.log(response, 'response');
				setCourses(response);
			} catch (error) {
				toast.error('Error fetching courses');
				console.log(error);
			}
		};
		fetchCourses();
	}, []);
	console.log(courses, 'courses');

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

	const calculateAttendanceForAllUsers = (users, lectures, topicname) => {
		const uniqueUserIds = [...new Set(users.map(user => user.userid))];
		const lecture = lectures.find(lecture => lecture.topicname === topicname);
		const lecture_count = lecture ? lecture.lecture_count : 0;

		const attendanceCounts = uniqueUserIds.map(userid => {
			const count = sumUserAttendanceOnTopic(users, userid, topicname);
			const user = users.find(user => user.userid === userid);
			const name = user ? `${user.last_name} ${user.first_name}` : 'Unknown User';
			const percentage =
				lecture_count > 0
					? parseFloat(((count / lecture_count) * 100).toFixed(1))
					: 0;
			return {
				name,
				count,
				topicname,
				percentage,
			};
		});
		return attendanceCounts;
	};
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

	const handleCourseSelect = async (value: string | null) => {
		if (!value) {
			return;
		}
		const selectedCourse = courses.find(
			course => `${course.name} ${course.code}` === value,
		);
		if (selectedCourse) {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseDetails = await apiHooks.getDetailsByCourseId(
					selectedCourse.courseid.toString(),
					token,
				);

				console.log(courseDetails);

				// Usage:
				const topicname = 'eryteryt'; // Replace with the actual topicname
				const attendanceCounts = calculateAttendanceForAllUsers(
					courseDetails.users,
					courseDetails.lectures,
					topicname,
				);

				console.log(attendanceCounts);

				const allAttendanceCounts = calculateAttendanceForAllTopics(
					courseDetails.users,
					courseDetails.lectures,
				);
				setAllAttendanceCounts(allAttendanceCounts);
				console.log(allAttendanceCounts);
			} catch (error) {
				toast.error('Error fetching course details');
				console.log(error);
			}
		}
	};
	return (
		<div>
			<Autocomplete
				freeSolo
				options={courses.map(course => `${course.name} ${course.code}`)}
				onChange={(_, value) => handleCourseSelect(value)}
				renderInput={params => (
					<TextField
						{...params}
						label="Search courses"
						margin="normal"
						variant="outlined"
					/>
				)}
			/>
			<AttendanceStatsTable allAttendanceCounts={allAttendanceCounts} />
		</div>
	);
};

export default TeacherCourseStats;
