import React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

interface Attendance {
	date: string;
	present: boolean;
}

const StudentCourseAttendance: React.FC = () => {
	const {usercourseid} = useParams<{usercourseid: string}>();
	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);

	useEffect(() => {
		// Replace this with your actual fetch call
		fetch(`/api/attendance/${usercourseid}`)
			.then(response => response.json())
			.then(data => setAttendanceData(data))
			.catch(error => console.error('Error:', error));
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
						{attendance.date}: {attendance.present ? 'Present' : 'Absent'}
					</li>
				))}
			</ul>
		</div>
	);
};

export default StudentCourseAttendance;
