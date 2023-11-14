import React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
interface Attendance {
	date: string;
	present: boolean;
}

const StudentCourseAttendance: React.FC = () => {
	const {usercourseid} = useParams<{usercourseid}>();
	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				alert(usercourseid);
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

	return (
		<div>
			<h1>Attendance for Course {usercourseid}</h1>
			<ul>
				{attendanceData.map((attendance, index) => (
					<li key={index}>
						<p>Status: {attendance.status}</p>
						<p>Start Date: {new Date(attendance.start_date).toLocaleDateString()}</p>
						<p>End Date: {new Date(attendance.end_date).toLocaleDateString()}</p>
						<p>Time of Day: {attendance.timeofday}</p>
						<p>Topic Name: {attendance.topicname}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default StudentCourseAttendance;
