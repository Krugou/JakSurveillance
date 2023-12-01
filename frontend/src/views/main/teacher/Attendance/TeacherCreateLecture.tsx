import {CircularProgress} from '@mui/material';
import {formatISO} from 'date-fns';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';
const CreateLecture: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [courses, setCourses] = useState<Course[]>([]);
	const [date, setDate] = useState<Date | Date[]>(new Date());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const timeOfDay = ['am', 'pm'];

	const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>(
		timeOfDay[0],
	);
	const [selectedSession, setSelectedSession] = useState<string>(
		courses.length > 0 ? courses[0].courseid : '',
	);
	const [loading, setLoading] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState<string>('');
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
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			apihooks.getCourseReservations(selectedCourse, token).then(data => {
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
			setLoading(true);
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			apihooks.getAllCoursesByInstructorEmail(user.email, token).then(data => {
				setCourses(data);
				setLoading(false);
				setSelectedCourse(data[0]);
				setSelectedTopic(data[0].topic_names.split(',')[0]);
			});
		}
	}, [user]);
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
				setDate(date);
				const hours = date.getHours();
				setSelectedTimeOfDay(hours < 12 ? 'am' : 'pm');
				setCalendarOpen(false);
			}
		}
	};

	const handleOpenAttendance = async () => {
		const state = 'open';

		if (Array.isArray(date)) {
			toast.error(`Cannot create attendance for multiple dates`);
			return;
		}

		if (!selectedTimeOfDay) {
			toast.error(`Time of day not selected`);
			return;
		}

		if (!selectedTopic || !selectedCourse) {
			toast.error(`Topic or course not selected`);
			return;
		}

		const start_date = new Date(date);
		start_date.setHours(selectedTimeOfDay === 'am' ? 10 : 14, 30, 0, 0);

		const end_date = new Date(date);
		end_date.setHours(selectedTimeOfDay === 'am' ? 13 : 17, 30, 0, 0);

		try {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				toast.error('No token available');
				throw new Error('No token available');
			}

			const response = await apihooks.CreateLecture(
				selectedTopic,
				selectedCourse,
				start_date,
				end_date,
				selectedTimeOfDay,
				state,
				token,
			);

			if (!response || !response.lectureid) {
				toast.error('Error creating lecture');
				throw new Error('Error creating lecture');
			}

			const {lectureid} = response;
			navigate(`/teacher/attendance/${lectureid}`);
			toast.success(`Lecture created successfully with lectureid ${lectureid}`);
			console.log(`Lecture created successfully with lectureid ${lectureid}`);
		} catch (error) {
			toast.error(`Error creating lecture: ${error}`);
			console.error(`Error creating lecture: ${error}`);
		}
	};
	interface Course {
		name: string;
		code: string;
		courseid: string | (() => string);
		topic_names: string;
	}

	return (
		<div className="w-full">
			{loading ? (
				<CircularProgress />
			) : (
				<div className="flex m-auto flex-col 2xl:w-2/6 sm:w-4/5 lg:w-3/5 md:w-3/5 w-full items-center rounded-lg justify-center sm:p-5 p-1 bg-orange-100">
					<h1 className="text-lg sm:text-2xl font-bold p-2 mb-8 mt-5">
						Create new lecture
					</h1>
					<div className="flex w-full justify-center">
						<div className="flex w-1/4 flex-col gap-5">
							<label className="sm:text-xl text-md flex justify-end" htmlFor="course">
								Course :
							</label>
							<label className="sm:text-xl text-md flex justify-end" htmlFor="topic">
								Topic :
							</label>
						</div>
						<div className="w-3/4 sm:w-4/5 lg:w-11/12 flex flex-col gap-3">
							<select
								title="Course"
								id="course"
								className="block h-8 sm:ml-5 ml-1 mr-3"
								value={selectedSession}
								onClick={() => {
									if (courses.length === 0) {
										toast.error('You have no courses');
									}
								}}
								onChange={e => {
									const selectedIndex = e.target.value;
									console.log(
										'🚀 ~ file: TeacherCreateLecture.tsx:205 ~ selectedIndex:',
										selectedIndex,
									);
									setSelectedSession(selectedIndex);
									setSelectedCourse(courses[selectedIndex] || null);
									console.log(
										'🚀 ~ file: TeacherCreateLecture.tsx:208 ~ courses[selectedIndex]:',
										courses[selectedIndex],
									);
								}}
							>
								{Array.isArray(courses) &&
									courses.map((course, index) => {
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
											<option key={index} value={index}>
												{courseName + ' | ' + courseCode}
											</option>
										);
									})}
							</select>
							<select
								title="Topic"
								id="topic"
								className="block h-8 mr-3 sm:ml-5 ml-1 sm:mt-1 mt-none"
								value={selectedTopic}
								onChange={e => {
									setSelectedTopic(e.target.value);
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
					<h2 className="mt-2 text-xl p-4">Select desired date and time of day</h2>
					<div className="text-md sm:text-xl mb-5">
						<div className="relative">
							<input
								title="Date"
								ref={inputRef}
								type="text"
								aria-label="Date"
								className="py-2 text-center pl-4 pr-4 rounded-xl border focus:ring focus:ring-metropoliaSecondaryOrange focus:outline-none"
								value={Array.isArray(date) ? 'Multiple Dates' : date.toDateString()}
								onClick={toggleCalendar}
								onChange={e => setDate(new Date(e.target.value))}
							/>
							{calendarOpen && (
								<div className="absolute top-12 right-0 sm:text-sm text-lg left-0 z-10">
									<Calendar
										onChange={handleDateChangeCalendar}
										tileClassName={tileClassName}
										onClickDay={date => setDate(date)}
									/>
								</div>
							)}
						</div>

						<div className="relative mt-5">
							<select
								aria-label="Time of Day"
								title="Time of Day"
								value={selectedTimeOfDay}
								onChange={e => setSelectedTimeOfDay(e.target.value)}
								className="block text-center appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline"
							>
								{timeOfDay.map(option => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
					<button
						aria-label="Open Attendance"
						title="Open Attendance"
						className="bg-metropoliaMainOrange w-2/4 hover:hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 px-4 m-4 rounded focus:outline-none focus:shadow-outline"
						onClick={handleOpenAttendance}
					>
						Open
					</button>
				</div>
			)}
		</div>
	);
};

export default CreateLecture;
