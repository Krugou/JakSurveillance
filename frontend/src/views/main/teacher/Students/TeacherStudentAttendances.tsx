import React, {useContext} from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../../hooks/ApiHooks';
import {FormControl, MenuItem, Select, Tooltip} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AttendanceTable from '../../../../components/main/course/attendance/AttendanceTable';
import PrintIcon from '@mui/icons-material/Print';
import GetAppIcon from '@mui/icons-material/GetApp';
import {exportToExcel, exportToPDF} from '../../../../utils/exportData';
import {UserContext} from "../../../../contexts/UserContext";
// Interface for the attendance data
interface Attendance {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	teacher: string;
	status: number;
}
interface StudentInfo {
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	roleid: number;
	staff: number;
	studentnumber: string;
	userid: number;
	username: string;
	created_at: string;
	// Include other properties of student here
}

const TeacherStudentCourseAttendance: React.FC = () => {
	// Get the usercourseid from the url
	const {usercourseid} = useParams<{usercourseid}>();
	const {update, setUpdate} = useContext(UserContext);

	// State to keep track of the sort option
	const [sortOption, setSortOption] = useState('All Topics');
	// State to keep track of the attendance data
	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);

	const [student, setStudent] = useState<StudentInfo | null>(null); // Define the student state variable as a Student object

	// State to keep track of the search term
	const [searchTerm, setSearchTerm] = useState('');

	// Function to handle search term change
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Fetch attendance data for the course
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAttendanceInfoByUsercourseid(
					usercourseid,
					token,
				);
				setStudent(response[0]?.userinfo);

				console.log(response, 'RESPONSE');
				console.log(student, 'student');
				setAttendanceData(response);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [usercourseid, update]);

	// If the attendance data is not available, return a loading message
	if (!attendanceData) {
		return <div>Loading...</div>;
	}

	// Function to handle sort option change
	const handleChange = event => {
		setSortOption(event.target.value);
	};

	// Create an array of unique topics from the attendance data
	const uniqueTopics: string[] = Array.from(
		new Set(
			attendanceData.reduce((unique: string[], attendance) => {
				// If the topic name is already in the unique array, return the array as is
				// Otherwise, add the topic name to the unique array
				return unique.includes(attendance.topicname)
					? unique
					: [...unique, attendance.topicname];
			}, [] as string[]),
		),
	);

	// Function to handle export to PDF
	const handleExportToPDF = () => {
		exportToPDF(filteredAttendanceData, student, sortOption);
	};

	// Function to handle export to Excel
	const handleExportToExcel = () => {
		exportToExcel(filteredAttendanceData, student, sortOption);
	};

	// Filter the attendance data based on the search term and the selected sort option
	const filteredAttendanceData = attendanceData.filter(
		attendance =>
			new Date(attendance.start_date).toLocaleDateString().includes(searchTerm) &&
			(sortOption === 'All Topics' || attendance.topicname === sortOption),
	);

	const updateView = () => {
		setUpdate(!update);
	};

	if (attendanceData.length > 0) {
		return (
			<div className="flex w-full 2xl:w-10/12 flex-col bg-gray-100 p-5 rounded-lg">
				<h1 className="text-xl sm:text-3xl font-bold mt-2 mb-8 text-center">
					{student?.first_name + ' ' + student?.last_name}'s attendance in course:{' '}
					{attendanceData[0].name}
				</h1>
				<div className="flex md:flex-row flex-col items-center justify-around md:gap-0 gap-5 flex-wrap">
					<input
						type="text"
						placeholder="Search by date"
						value={searchTerm}
						onChange={handleSearchChange}
						className="md:w-[10em] p-4 m-2 border border-black rounded"
					/>
					<div className="flex md:gap-2 gap-10">
					<Tooltip title="Print to pdf">
						<button
							onClick={handleExportToPDF}
							className="bg-metropoliaMainOrange text-white p-2 rounded"
						>
							<PrintIcon fontSize="large" />
						</button>
					</Tooltip>
					<Tooltip title="Export to Excel">
						<button
							onClick={handleExportToExcel}
							className="bg-metropoliaMainOrange text-white p-2 rounded"
						>
							<GetAppIcon fontSize="large" />
						</button>
					</Tooltip>
					</div>
					<FormControl className="md:w-1/4 mt-2 md:mt-0">
						<div className="md:flex-none gap-3 flex md:items-none items-center">
						<label>Sort Topics:</label>
						<Select
							className="favorite-selector"
							value={sortOption}
							onChange={handleChange}
						>
							<MenuItem value="All Topics">
								<div className="item-selector">
									<AutorenewIcon className="highest-star-selector-icon" />
									<span className="selector-text">All Topics</span>
								</div>
							</MenuItem>
							{uniqueTopics.map((topic, index) => (
								<MenuItem key={index} value={topic}>
									<div className="item-selector">
										<AutorenewIcon className="highest-star-selector-icon" />
										<span className="selector-text">{topic}</span>
									</div>
								</MenuItem>
							))}
						</Select>
						</div>
					</FormControl>
				</div>
				<AttendanceTable
					filteredAttendanceData={filteredAttendanceData}
					student={student}
					updateView={updateView}
				/>
			</div>
		);
	} else {
		return <div className="text-center text-3xl m-10">No Data available</div>;
	}
};

export default TeacherStudentCourseAttendance;
