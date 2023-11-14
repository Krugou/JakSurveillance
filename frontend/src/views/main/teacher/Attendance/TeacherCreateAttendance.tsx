import {formatISO} from 'date-fns';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from "../../../../components/main/background/background";
const CreateAttendance: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [courses, setCourses] = useState<Course[]>([]);
	const [date, setDate] = useState<Date | Date[]>(new Date());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<string>('');
	const [selectedSession, setSelectedSession] = useState<string>(
		courses.length > 0 ? courses[0].courseid : '',
	);
	const [selectedParticipant, setSelectedParticipant] = useState<string>('');
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

	const inputRef = useRef<HTMLInputElement | null>(null);
	// test data

	interface Reservation {
		startDate: string;
	}
	interface Course {
		// existing properties...
		codes: string; // replace CodeType with the actual type of `codes`
		email: string;
	}
	useEffect(() => {
		if (selectedCourse) {
			apihooks.getCourseReservations(selectedCourse).then(data => {
				const dates = data.reservations.map(
					(reservation: Reservation) => new Date(reservation.startDate),
				);
				setHighlightedDates(dates);
			});
		}
	}, [selectedCourse]);

	useEffect(() => {
		if (calendarOpen) {
			inputRef.current?.focus();
		}
	}, [calendarOpen]);
	useEffect(() => {
		if (user) {
			apihooks.getAllCoursesByInstructorEmail(user.email).then(data => {
				setCourses(data);
			});
		}
	}, []);
	const toggleCalendar = () => {
		setCalendarOpen(prev => !prev);
	};
	const tileClassName = ({date, view}: {date: Date; view: string}) => {
		// Add class to dates in the month view only
		if (view === 'month') {
			// Check if a date React-Calendar wants to check is on the list of dates to highlight
			if (
				highlightedDates.find(
					dDate =>
						formatISO(dDate, {representation: 'date'}) ===
						formatISO(date, {representation: 'date'}),
				)
			) {
				return 'highlight';
			}
		}
		return ''; // default return value
	};
	useEffect(() => {}, [selectedCourse]);
	const timeOfDay = ['am', 'pm'];
	const handleDateChangeCalendar = (
		value: Date | Date[] | null | [Date | null, Date | null],
	) => {
		if (value) {
			let date: Date | null = null;
			if (Array.isArray(value)) {
				date = value[0];
			} else {
				date = value;
			}

			if (date) {
				const formattedDate = formatISO(date, {representation: 'date'});
				const isHighlighted = highlightedDates.some(
					dDate => formatISO(dDate, {representation: 'date'}) === formattedDate,
				);

				if (isHighlighted) {
					setDate(date);
					const hours = date.getHours();
					setSelectedLocation(hours < 12 ? 'am' : 'pm');
					setCalendarOpen(false);
				}
			}
		}
	};
	useEffect(() => {
		if (courses.length > 0) {
			setSelectedCourse(courses[0]);
			setSelectedParticipant(courses[0].topic_names.split(',')[0]);
		}
	}, [courses]);

	const handleOpenAttendance = async () => {
		if (Array.isArray(date)) {
			console.error(`Cannot create attendance for multiple dates`);
			return;
		}

		if (!selectedLocation) {
			console.error(`Time of day not selected`);
			return;
		}

		const start_date = new Date(date);
		start_date.setHours(selectedLocation === 'am' ? 10 : 14, 30, 0, 0);

		const end_date = new Date(date);
		end_date.setHours(selectedLocation === 'am' ? 13 : 17, 30, 0, 0);

		try {
			let response;
			if (selectedCourse !== null) {
				response = await apihooks.createClass(
					selectedParticipant,
					selectedCourse,
					date,
					date,
					selectedLocation,
				);
			}
			const {classid} = response;
			navigate(`/teacher/attendance/${classid}`);
			console.log(`Class created successfully with classid ${classid}`);
		} catch (error) {
			console.error(`Error creating class: ${error}`);
		}
	};
	interface Course {
		name: string;
		code: string;
		courseid: string | (() => string);
		topic_names: string;
		// include other properties of selectedCourse here
	}

	return (
		<BackgroundContainer>
		<div className="flex flex-col items-center rounded-lg justify-center h-1/2 sm:p-5 p-2 bg-gray-100">
			<h1 className="text-lg sm:text-2xl font-bold p-2 mb-8 mt-5">
				Fill in to open the attendance collection
			</h1>
			<div className="flex w-full justify-center m-auto">
			<div className="flex sm:w-1/4 w-1/2 flex-col gap-5">
				<label className="text-xl flex justify-end" htmlFor="course">Course :</label>
				<label className="text-xl flex justify-end" htmlFor="topic">Topic :</label>
			</div>
			<div className="w-full sm:w-1/2 lg:w-2/3 flex flex-col gap-3">
				<select
					id="course"
					className="block w-3/4 h-8 ml-5"
					value={selectedSession}
					onChange={e => {
						const selectedCourseId = e.target.value;
						console.log(
							'🚀 ~ file: TeacherCreateAttendance.tsx:110 ~ selectedCourseId:',
							selectedCourseId,
						);
						const newValue = parseInt(selectedCourseId, 10) - 1;
						setSelectedSession(selectedCourseId);
						setSelectedCourse(courses[newValue] || null);
					}}
				>
					{Array.isArray(courses) &&
						courses.map(course => {
							// Ensure courseid is a string or number
							const courseId =
								typeof course.courseid === 'function'
									? course.courseid()
									: course.courseid;

							// Ensure course has name and code properties
							const courseName = course.name || 'No Name';
							const courseCode = course.code || 'No Code';

							// Ensure courseId, courseName, and courseCode are not empty
							if (!courseId || !courseName || !courseCode) {
								console.error('Invalid course data:', course);
								return null; // Skip this course
							}

							return (
								<option key={courseId} value={courseId}>
									{courseName + ' | ' + courseCode}
								</option>
							);
						})}
				</select>
				<select
					id="topic"
					className="block w-3/4 h-8 ml-5 mt-1"
					value={selectedParticipant}
					onChange={e => {
						setSelectedParticipant(e.target.value);
					}}
				>
					{selectedCourse &&
						selectedCourse.topic_names &&
						selectedCourse.topic_names.split(',').map((topic: string) => (
							<option key={topic} value={topic}>
								{topic}
							</option>
						))}
				</select>
			</div>
			</div>
			<div className="w-4/5 mt-10 h-1 bg-metropoliaMainOrange rounded-md"></div>
			<h2 className="mt-2 text-xl p-4">Select desired date</h2>
			<div className="text-md sm:text-xl mb-5">
				<div className="relative">
					<input
						ref={inputRef}
						type="text"
						aria-label="Date"
						className="py-2 text-center pl-4 pr-4 rounded-xl border focus:ring focus:ring-metropoliaSecondaryOrange focus:outline-none"
						value={Array.isArray(date) ? 'Multiple Dates' : date.toDateString()}
						onClick={toggleCalendar}
						onChange={e => setDate(new Date(e.target.value))}
					/>
					{calendarOpen && (
						<div className="absolute top-12 left-0 z-10">
							<Calendar
								onChange={handleDateChangeCalendar}
								tileClassName={tileClassName}
							/>
						</div>
					)}
				</div>

				<div className="relative mt-5">
					<select
						title="Time of Day" // Add this line
						value={selectedLocation}
						onChange={e => setSelectedLocation(e.target.value)}
						className="block text-center appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline"
					>
						<option value="">Time of day</option>
						{timeOfDay.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			</div>
			<button
				className="bg-metropoliaMainOrange w-2/4 hover:hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 px-4 m-4 rounded focus:outline-none focus:shadow-outline"
				onClick={handleOpenAttendance}
			>
				Open
			</button>
		</div>
		</BackgroundContainer>
	);
};

export default CreateAttendance;
