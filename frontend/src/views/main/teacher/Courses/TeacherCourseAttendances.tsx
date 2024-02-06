import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import React, {useContext, useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import {useNavigate, useParams} from 'react-router-dom';
import AttendanceTable from '../../../../components/main/course/attendance/AttendanceTable';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
import {exportToExcel, exportToPDF} from '../../../../utils/exportData';
/**
 * TeacherCourseAttendances component.
 * This component is responsible for rendering the attendance view for a course for a teacher.
 * It fetches the lectures and their attendances and provides functionality for the teacher to filter the attendances based on a selected date, print the attendances to a PDF, export the attendances to an Excel file, and navigate to the attendance statistics view.
 */
const TeacherCourseAttendances: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const [lecturesAndTheirAttendances, setLecturesAndTheirAttendances] = useState<
		any[]
	>([]); // [lecture, [attendances]
	const {id: courseId} = useParams();
	const {update, setUpdate} = useContext(UserContext);
	const {user} = useContext(UserContext);
	const userEmail = user?.email;
	const [showOwnAttendances, setShowOwnAttendances] = useState(true);

	const navigate = useNavigate();
	// Fetch the lectures and their attendances
	useEffect(() => {
		const fetchAttendances = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getLecturesAndAttendances(courseId, token);
				console.log(response, 'response');
				// Set the lectures and their attendances
				setLecturesAndTheirAttendances(response);
			} catch (error) {
				console.log(error);
			}
		};
		fetchAttendances();
	}, [courseId, update]);

	// Function to handle date change
	const handleDateChange = date => {
		setSelectedDate(date);
	};

	// Map the lecture start dates to an array
	const lectureStartDates = lecturesAndTheirAttendances.map(lecture =>
		new Date(lecture.start_date).toLocaleDateString(),
	);

	// Filter the attendances based on the selected date
	const filteredAttendances = selectedDate
		? lecturesAndTheirAttendances
				.filter(
					lecture =>
						(new Date(lecture.start_date).toDateString() ===
							selectedDate.toDateString() &&
							!showOwnAttendances) ||
						lecture.teacher === userEmail,
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
		: [showOwnAttendances];
	const handleToggleOwnAttendances = () => {
		setShowOwnAttendances(!showOwnAttendances);
	};
	// Function to handle printing to pdf
	const handlePrintToPdf = () => {
		exportToPDF(filteredAttendances);
	};

	// Function to handle exporting to excel
	const handleExportToExcel = () => {
		exportToExcel(filteredAttendances);
	};

	const updateView = () => {
		setUpdate(!update);
	};

	return (
		<div className="lg:w-fit w-full p-4 bg-gray-100 rounded-lg">
			<h1 className="text-center text-3xl font-bold mb-5">
				Teacher Course Attendances
			</h1>
			<div className="flex justify-center m-4 ">
				<div className="flex flex-col sm:flex-row items-center justify-around sm:space-x-4">
					<div className="w-full sm:w-1/2 lg:w-1/3">
						<h2 className="text-center bg-metropoliaSecondaryOrange text-white p-2">
							Find attendances based on day
						</h2>
						<Calendar
							className="w-full sm:mb-0 mb-4"
							onChange={handleDateChange}
							value={selectedDate}
							tileContent={({date}) => {
								const calendarDate = new Date(date).toLocaleDateString();
								const isLectureStartDate = lectureStartDates.includes(calendarDate);
								return isLectureStartDate ? (
									<div className="bg-yellow-300 h-full w-full"></div>
								) : null;
							}}
						/>
					</div>
					<div className="flex items-center">
						<Button
							variant="contained"
							color="primary"
							startIcon={<ShowChartIcon />}
							className="mt-4 h-fit sm:mt-0"
							onClick={() => navigate(`/teacher/courses/stats/${courseId}`)}
						>
							Attendance statistics
						</Button>
					</div>
				</div>
			</div>
			{selectedDate && (
				<div className="bg-white p-5 w-full m-auto">
					{filteredAttendances.length > 0 ? (
						<>
							<div className="flex justify-around mt-4 ">
								<Tooltip title="Print to pdf">
									<button
										onClick={handlePrintToPdf}
										className="bg-metropoliaMainOrange text-white p-2 rounded"
										title="Print to pdf"
									>
										<PrintIcon fontSize="large" />
									</button>
								</Tooltip>
								<div className="flex flex-col">
									<h2 className="text-center text-2xl">
										Attendances for {selectedDate.toLocaleDateString()}
									</h2>
									{user?.role !== 'student' && (
										<button
											className="bg-metropoliaMainOrange m-2 text-white p-2 rounded"
											onClick={handleToggleOwnAttendances}
										>
											{showOwnAttendances
												? 'Show all lecture attendances for this course today'
												: 'Show own lecture attendances for this course today'}
										</button>
									)}
								</div>
								<Tooltip title="Export to Excel">
									<button
										onClick={handleExportToExcel}
										className="bg-metropoliaMainOrange text-white p-2 rounded"
										title="Export to Excel"
									>
										<GetAppIcon fontSize="large" />
									</button>
								</Tooltip>
							</div>

							<AttendanceTable
								filteredAttendanceData={filteredAttendances}
								allAttendances={true}
								updateView={updateView}
							/>
						</>
					) : (
						<div className="flex justify-center mt-4">
							<p className="text-xl">
								No attendances found for {selectedDate.toDateString()}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TeacherCourseAttendances;
