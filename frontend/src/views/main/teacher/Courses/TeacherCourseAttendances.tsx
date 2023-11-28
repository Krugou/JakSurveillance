import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../../hooks/ApiHooks';

const TeacherCourseAttendances: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [lectureDates, setLectureDates] = useState<Date[]>([]);
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
				console.log(response);
				const lectureDates = response.map(lecture => new Date(lecture.start_date));
				setLecturesAndTheirAttendances(response);
				setLectureDates(lectureDates);
			} catch (error) {
				console.log(error);
			}
		};
		fetchAttendances();
	}, [courseId]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};
	const filteredAttendances = selectedDate
		? lecturesAndTheirAttendances
				.filter(
					lecture =>
						new Date(lecture.start_date).toDateString() ===
						selectedDate.toDateString(),
				)
				.flatMap(lecture =>
					lecture.attendances.map(attendance => ({
						...attendance,
						timeofday: lecture.timeofday,
					})),
				)
		: [];
	console.log(filteredAttendances);
	return (
		<div className="w-full">
			<h1 className="text-center text-3xl font-bold">
				Teacher Course Attendances
			</h1>
			<Calendar
				className="w-full"
				onChange={handleDateChange}
				value={selectedDate}
				tileContent={({date}) => {
					const calendarDate = new Date(date).toLocaleDateString();

					const isLectureDate = lectureDates.some(lectureDate => {
						const utcLectureDate = lectureDate.toLocaleDateString();
						return utcLectureDate === calendarDate;
					});

					// If it is, add a custom class to the tile
					return isLectureDate ? (
						<div className="bg-yellow-300 h-full w-full"></div>
					) : null;
				}}
			/>
			{selectedDate && (
				<div>
					<h2>Attendances for {selectedDate.toLocaleDateString()}</h2>
					{filteredAttendances.length > 0 ? (
						<ul>
							{filteredAttendances.map((attendance, index) => (
								<li key={index}>{attendance.status}</li>
							))}
						</ul>
					) : (
						<p>No attendances found for {selectedDate.toDateString()}</p>
					)}
				</div>
			)}
		</div>
	);
};

export default TeacherCourseAttendances;
