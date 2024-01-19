import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {CircularProgress} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {formatISO} from 'date-fns';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import DeleteLectureModal from '../../../../components/main/modals/DeleteLectureModal';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';
/**
 * CreateLecture component.
 * This component is responsible for rendering the lecture creation view for a teacher.
 * It provides functionality for the teacher to select a course, select a topic, select a date and time, and create a lecture.
 * Additionally, it provides functionality for the teacher to delete a lecture.
 */
const CreateLecture: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [courses, setCourses] = useState<Course[]>([]);
	const [allCourses, setAllCourses] = useState<Course[]>([]);
	const [date, setDate] = useState<Date | Date[]>(new Date());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const timeOfDay = ['am', 'pm'];
	const currentHour = new Date().getHours();
	const defaultTimeOfDay = currentHour < 12 ? timeOfDay[0] : timeOfDay[1];
	const [selectedTimeOfDay, setSelectedTimeOfDay] =
		useState<string>(defaultTimeOfDay);
	const [selectedSession, setSelectedSession] = useState<string>(
		courses.length > 0 ? courses[0].courseid : '',
	);
	/**
	 * OpenLecture interface.
	 * This interface defines the shape of an OpenLecture object.
	 */
	interface OpenLecture {
		id: string;
		lectureid: string;
		courseid: string;
		teacher: string;
		start_date: string;
		timeofday: string;
	}
	const [loading, setLoading] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState<string>('');
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [openLectures, setOpenLectures] = useState<OpenLecture[]>([]);
	const [showEndedCourses, setShowEndedCourses] = useState(false);
	// const [openDataText, setOpenDataText] = useState('');

	/**
	 * Reservation interface.
	 * This interface defines the shape of a Reservation object.
	 */
	interface Reservation {
		startDate: string;
	}
	/**
	 * Course interface.
	 * This interface defines the shape of a Course object.
	 */
	interface Course {
		codes: string;
		email: string;
		end_date: string;
	}
	const findNextLecture = reservations => {
		// Get current date
		const now = new Date();
		// Find the next upcoming lecture
		const nextLecture = reservations.find(
			lecture =>
				(new Date(lecture.startDate) <= now && now <= new Date(lecture.endDate)) ||
				new Date(lecture.startDate) > now,
		);
		console.log('🚀 ~ findNextLecture ~ nextLecture:', nextLecture);

		// Check if the current time falls within the start and end time of the lecture
		if (
			nextLecture &&
			new Date(nextLecture.startDate) <= now &&
			now <= new Date(nextLecture.endDate)
		) {
			const room = nextLecture.resources.find(
				resource => resource.type === 'room',
			);

			return ` ${nextLecture.subject}, Room: ${room?.code}`;
		} else if (nextLecture) {
			const room = nextLecture.resources.find(
				resource => resource.type === 'room',
			);
			return `${nextLecture.subject},  Room: ${room?.code} `;
		} else {
			return '';
		}
	};

	useEffect(() => {
		if (selectedCourse) {
			console.log('🚀 ~ useEffect ~ selectedCourse:', selectedCourse);
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			apihooks.getCourseReservations(selectedCourse, token).then(data => {
				const dates = data.reservations.map(
					(reservation: Reservation) => new Date(reservation.startDate),
				);
				setHighlightedDates(dates);
				const newText = findNextLecture(data.reservations);
				console.log('🚀 ~ apihooks.getCourseReservations ~ newText:', newText);
				// setOpenDataText(newText);
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
			try {
				setLoading(true);
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}

				apihooks.getAllCoursesByInstructorEmail(user.email, token).then(data => {
					setAllCourses(data);

					const currentCourses = data.filter(
						course =>
							new Date(course.end_date).setHours(0, 0, 0, 0) >=
							new Date().setHours(0, 0, 0, 0),
					);

					setCourses(currentCourses);
					setLoading(false);
					setSelectedCourse(currentCourses[0]);
					setSelectedTopic(currentCourses[0].topic_names.split(',')[0]);
				});
			} catch (error) {
				console.error(error);
			}
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
		return '';
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

		try {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				toast.error('No token available');
				throw new Error('No token available');
			}
			const responseOpenLectures = await apihooks.getOpenLecturesByCourseid(
				selectedCourse?.courseid,

				token,
			);
			console.log(
				'🚀 ~ file: TeacherCreateLecture.tsx:139 ~ handleOpenAttendance ~ responseOpenLectures:',
				responseOpenLectures,
			);

			if (responseOpenLectures.length > 0) {
				setOpenLectures(responseOpenLectures);
				setDeleteModalOpen(true);
				return;
			}
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

			const response = await apihooks.CreateLecture(
				selectedTopic,
				selectedCourse,
				start_date,
				end_date,
				selectedTimeOfDay,
				state,
				token,
			);
			console.log(
				'🚀 ~ file: TeacherCreateLecture.tsx:155 ~ handleOpenAttendance ~ response:',
				response,
			);

			if (!response || !response.lectureInfo) {
				toast.error('Error creating lecture');
				throw new Error('Error creating lecture');
			}

			const lectureid = response.lectureInfo.lectureid;
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

	const handleDelete = (lectureid: string) => {
		// Delete the open lecture here
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			throw new Error('No token available');
		}
		try {
			apihooks.deleteLectureByLectureId(lectureid, token);
		} catch (error) {
			toast.error(`Error deleting lecture: ${error}`);
			console.error(`Error deleting lecture: ${error}`);
		}
		setDeleteModalOpen(false);
	};

	const closeLecture = async (lectureid: string) => {
		// Close the open lecture here
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			throw new Error('No token available');
		}
		try {
			await apihooks.closeLectureByLectureId(lectureid, token);
		} catch (error) {
			toast.error(`Error closing lecture: ${error}`);
			console.error(`Error closing lecture: ${error}`);
		}
		setDeleteModalOpen(false);
	};

	return (
		<div className="w-full">
			{loading ? (
				<CircularProgress />
			) : (
				<>
					{openLectures.map(lecture => (
						<DeleteLectureModal
							key={lecture.lectureid}
							open={deleteModalOpen}
							lecture={lecture}
							onClose={() => setDeleteModalOpen(false)}
							onCloseLecture={() => closeLecture(lecture.lectureid)}
							onDelete={() => handleDelete(lecture.lectureid)}
						/>
					))}
					<div className="flex m-auto flex-col 2xl:w-3/6  lg:w-4/6 w-full items-center rounded-lg justify-center sm:p-5 p-1 bg-gray-100">
						<h1 className="text-lg sm:text-2xl font-bold p-2 mb-8 mt-5">
							Create new lecture
						</h1>

						<div className="flex w-full justify-center">
							<div className="flex w-1/4 flex-col gap-3 sm:gap-5">
								<label className="sm:text-xl text-md flex justify-end" htmlFor="course">
									<div className="flex items-center">
										<Tooltip
											title={
												showEndedCourses ? 'Hide ended courses' : 'Show ended courses'
											}
											placement="top"
										>
											<IconButton
												className="mb-4"
												onClick={() => {
													const filteredCourses = showEndedCourses
														? allCourses.filter(
																course =>
																	new Date(course.end_date).setHours(0, 0, 0, 0) >=
																	new Date().setHours(0, 0, 0, 0),
														  )
														: allCourses;

													setShowEndedCourses(!showEndedCourses);
													setCourses(filteredCourses);
												}}
											>
												{showEndedCourses ? <VisibilityOffIcon /> : <VisibilityIcon />}
											</IconButton>
										</Tooltip>
										Course :
									</div>
								</label>
								<label className="sm:text-xl text-md flex justify-end" htmlFor="topic">
									Topic :
								</label>
							</div>
							<div className="w-3/4 sm:w-4/5 lg:w-11/12 flex flex-col gap-3">
								<select
									title="Click to pick course"
									id="course"
									className="block h-8 cursor-pointer sm:ml-5 ml-1 mr-3 mt-1"
									value={selectedSession}
									onClick={() => {
										if (courses.length === 0) {
											toast.error('You have no courses or all your courses have ended');
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
										setSelectedTopic(
											courses[selectedIndex] && courses[selectedIndex].topic_names
												? courses[selectedIndex].topic_names.split(',')[0]
												: '',
										);
										console.log(
											'🚀 ~ file: TeacherCreateLecture.tsx:208 ~ courses[selectedIndex]:',
											courses[selectedIndex],
										);
									}}
								>
									{Array.isArray(courses) &&
										courses.map((course, index) => {
											const courseId =
												typeof course.courseid === 'function'
													? course.courseid()
													: course.courseid;

											const courseName = course.name || 'No Name';
											const courseCode = course.code || 'No Code';

											if (!courseId || !courseName || !courseCode) {
												console.error('Invalid course data:', course);
												return null;
											}

											return (
												<option key={index} value={index}>
													{courseName + ' | ' + courseCode}
												</option>
											);
										})}
								</select>
								<select
									title=" Click to pick topic for the lecture"
									id="topic"
									className="block h-8 cursor-pointer mr-3 sm:ml-5 ml-1 sm:mt-2 mt-none"
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
									title="Click to open calendar"
									ref={inputRef}
									type="text"
									aria-label="Date"
									className="py-2 text-center pl-4 pr-4 rounded-xl cursor-pointer border focus:ring focus:ring-metropoliaSecondaryOrange focus:outline-none"
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
									title="Select time of Day"
									value={selectedTimeOfDay}
									onChange={e => setSelectedTimeOfDay(e.target.value)}
									className="block text-center cursor-pointer appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline"
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
							title={`Open Attendance gathering for ${selectedCourse?.name} - ${selectedCourse?.code} - ${selectedTopic} `}
							className="bg-metropoliaMainOrange w-2/4 hover:hover:bg-metropoliaSecondaryOrange transition text-white font-bold py-2 px-4 m-4 rounded focus:outline-none focus:shadow-outline"
							onClick={handleOpenAttendance}
						>
							Open
						</button>
						{/* {openDataText ? (
							<>
								<div className="m-1 p-1">
									<h2 className="mt-1 text-lg  p-1">
										Open data result selected course's current or next subject:
									</h2>
									<p className="p-1">{openDataText}</p>
								</div>
							</>
						) : (
							<p></p>
						)} */}
					</div>
				</>
			)}
		</div>
	);
};

export default CreateLecture;
