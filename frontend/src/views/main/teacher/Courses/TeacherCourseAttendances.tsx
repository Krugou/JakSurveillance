import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../../hooks/ApiHooks';
import AttendanceTable from '../../../../components/main/course/attendance/AttendanceTable';
const TeacherCourseAttendances: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [lecturesAndTheirAttendances, setLecturesAndTheirAttendances] = useState<
		any[]
	>([]); // [lecture, [attendances]
	const {id: courseId} = useParams();

	useEffect(() => {
		const fetchAttendances = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getLecturesAndAttendances(courseId, token);
				console.log(response, 'response');
				setLecturesAndTheirAttendances(response);
			} catch (error) {
				console.log(error);
			}
		};
		fetchAttendances();
	}, [courseId]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};
	const lectureStartDates = lecturesAndTheirAttendances.map(lecture =>
		new Date(lecture.start_date).toLocaleDateString(),
	);

	const filteredAttendances = selectedDate
		? lecturesAndTheirAttendances
				.filter(
					lecture =>
						new Date(lecture.start_date).toDateString() ===
						selectedDate.toDateString(),
				)
				.map(lecture => ({
					...lecture,
					timeofday: lecture.timeofday,
					teacher: lecture.teacher,
					topicname: lecture.topicname,
					name: lecture.name,
					email: lecture.email,
					first_name: lecture.first_name,
					last_name: lecture.last_name,
					studentnumber: lecture.studentnumber,
				}))
		: [];
	console.log(filteredAttendances, 'fitlered');
	return (
		<div className="w-full">
			<h1 className="text-center text-3xl font-bold">
				Teacher Course Attendances
			</h1>
			<div className="flex justify-center m-4">
				<Calendar
					className="w-1/2"
					onChange={handleDateChange}
					value={selectedDate}
					tileContent={({date}) => {
						const calendarDate = new Date(date).toLocaleDateString();

						const isLectureStartDate = lectureStartDates.includes(calendarDate);

						// If it is, add a custom class to the tile
						return isLectureStartDate ? (
							<div className="bg-yellow-300 h-full w-full"></div>
						) : null;
					}}
				/>
			</div>
			{selectedDate && (
				<div>
					<h2>Attendances for {selectedDate.toLocaleDateString()}</h2>
					{filteredAttendances.length > 0 ? (
						<AttendanceTable
							filteredAttendanceData={filteredAttendances}
							allAttendances={true}
						/>
					) : (
						<p>No attendances found for {selectedDate.toDateString()}</p>
					)}
				</div>
			)}
		</div>
	);
};

export default TeacherCourseAttendances;
