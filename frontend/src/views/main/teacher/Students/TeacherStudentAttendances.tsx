import React from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../../hooks/ApiHooks';
import {FormControl, MenuItem, Select, Tooltip} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AttendanceTable from '../../../../components/main/course/attendance/AttendanceTable';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import PrintIcon from '@mui/icons-material/Print';
import metropolia_logo from '../../../../assets/images/metropolia_s_oranssi_en.png';
import * as XLSX from 'xlsx';
import GetAppIcon from '@mui/icons-material/GetApp';
import {toast} from 'react-toastify';
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
	}, [usercourseid]);

	// If the attendance data is not available, return a loading message
	if (!attendanceData) {
		return <div>Loading...</div>;
	}

	// Function to handle sort option change
	const handleChange = event => {
		setSortOption(event.target.value);
	};

	// Function to create tables for PDF or Excel
	const createTables = mode => {
		let tableData;
		const tableHeaders = [
			'Date',
			'Student',
			'Teacher',
			'Time of Day',
			'Topic',
			'Status',
		];
		// If mode is 'pdf', set the table headers and data accordingly
		if (mode === 'pdf') {
			tableData = filteredAttendanceData.map(attendance => [
				new Date(attendance.start_date).toLocaleDateString(),
				student ? `${student.first_name} ${student.last_name}` : '',
				attendance.teacher,
				attendance.timeofday,
				attendance.topicname,
				attendance.status === 1 ? 'Present' : 'Absent',
			]);
		} else if (mode === 'excel') {
			// If mode is 'excel', set the table headers and data accordingly

			tableData = filteredAttendanceData.map(attendance => ({
				Date: new Date(attendance.start_date).toLocaleDateString(),
				Student: student ? `${student.first_name} ${student.last_name}` : '',
				Teacher: attendance.teacher,
				'Time of Day': attendance.timeofday,
				Topic: attendance.topicname,
				Status: attendance.status === 1 ? 'Present' : 'Absent',
			}));
		}
		return {tableHeaders, tableData};
	};

	// Function to export the attendance data to PDF
	const exportToPDF = () => {
		const doc = new jsPDF();
		const imgWidth = 180; // Set the width as per your requirement
		const imgHeight = (imgWidth * 1267) / 4961; // Calculate the height based on the aspect ratio
		const imgX = 15; // Position the image X pixels from the left
		const imgY = 10; // Position the image Y pixels from the top

		// Add the Metropolia logo to the PDF
		doc.addImage(metropolia_logo, 'PNG', imgX, imgY, imgWidth, imgHeight);

		// Create the table
		const {tableHeaders, tableData} = createTables('pdf');

		// Add the table to the PDF
		autoTable(doc, {
			head: [tableHeaders],
			body: tableData,
			startY: 90, // start the table below the title

			didDrawPage: data => {
				// Add header
				doc.setFontSize(20);
				doc.setTextColor(40); // Set text color to black
				doc.setFont('helvetica', 'normal'); // Set font
				// Add the course name and student name to the PDF
				doc.text(
					`${attendanceData[0].name} attendance for ${student?.first_name} ${student?.last_name}`,
					data.settings.margin.left,
					75,
				);
				doc.text(`Topics: ${sortOption}`, data.settings.margin.left, 85);
			},
		});
		// Save the PDF
		doc.save(`${student?.first_name} ${student?.last_name}'s attendance.pdf`);
		toast.success(
			`${student?.first_name} ${student?.last_name}'s attendance PDF for topics: ${sortOption} downloaded successfully. `,
			{
				position: toast.POSITION.TOP_CENTER, // position the toast at the top center
				autoClose: 7000, // Display the toast for 7 seconds
			},
		);
	};

	// Function to export the attendance data to Excel
	const exportToExcel = () => {
		// Create the table
		const {tableHeaders, tableData} = createTables('excel');
		// Create a worksheet
		const ws = XLSX.utils.json_to_sheet(tableData, {header: tableHeaders});
		// Create a workbook
		const wb = XLSX.utils.book_new();
		// Add the worksheet to the workbook
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		// Save the workbook
		XLSX.writeFile(
			wb,
			`${student?.first_name} ${student?.last_name}_${attendanceData[0].name}_${sortOption} attendance.xlsx`,
		);
		toast.success(
			`${student?.first_name} ${student?.last_name}'s attendance EXCEL for topics: ${sortOption} downloaded successfully. `,
			{
				position: toast.POSITION.TOP_CENTER, // position the toast at the top center
				autoClose: 7000, // Display the toast for 7 secondss
			},
		);
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

	// Filter the attendance data based on the search term and the selected sort option
	const filteredAttendanceData = attendanceData.filter(
		attendance =>
			new Date(attendance.start_date).toLocaleDateString().includes(searchTerm) &&
			(sortOption === 'All Topics' || attendance.topicname === sortOption),
	);
	if (attendanceData.length > 0) {
		return (
			<div className="overflow-x-auto flex flex-col border-x border-t">
				<h1 className="text-xl sm:text-4xl font-bold mt-2 mb-8 text-center">
					{student?.first_name + ' ' + student?.last_name}'s attendance in course:{' '}
					{attendanceData[0].name}
				</h1>
				<div className="flex items-center justify-around flex-wrap">
					<input
						type="text"
						placeholder="Search by date"
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-1/6 mt-10 p-4 m-2 border border-black rounded"
					/>
					<Tooltip title="Print to pdf">
						<button onClick={exportToPDF}>
							<PrintIcon />
						</button>
					</Tooltip>
					<Tooltip title="Export to Excel">
						<button onClick={exportToExcel}>
							<GetAppIcon />
						</button>
					</Tooltip>
					<FormControl className="md:w-1/4 mt-2 md:mt-0">
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
					</FormControl>
				</div>
				<AttendanceTable
					filteredAttendanceData={filteredAttendanceData}
					student={student}
				/>
			</div>
		);
	} else {
		return <div className="text-center text-3xl m-10">No Data available</div>;
	}
};

export default TeacherStudentCourseAttendance;
