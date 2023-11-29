import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {toast} from 'react-toastify';
import metropolia_logo from '../assets/images/metropolia_s_oranssi_en.png';
// Function to create tables for PDF or Excel
const createTables = (mode?, filteredAttendanceData?, student?) => {
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

export const exportToPDF = (filteredAttendanceData, student, sortOption) => {
	const doc = new jsPDF();
	const imgWidth = 180;
	const imgHeight = (imgWidth * 1267) / 4961;
	const imgX = 15;
	const imgY = 10;
	doc.addImage(metropolia_logo, 'PNG', imgX, imgY, imgWidth, imgHeight);

	const {tableHeaders, tableData} = createTables(
		'pdf',
		filteredAttendanceData,
		student,
	);

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
				`${filteredAttendanceData[0].name} attendance for ${student?.first_name} ${student?.last_name}`,
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
export const exportToExcel = (filteredAttendanceData, student, sortOption) => {
	// Create the table
	const {tableHeaders, tableData} = createTables(
		'excel',
		filteredAttendanceData,
		student,
	);
	// Create a worksheet
	const ws = XLSX.utils.json_to_sheet(tableData, {header: tableHeaders});
	// Create a workbook
	const wb = XLSX.utils.book_new();
	// Add the worksheet to the workbook
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

	// Save the workbook
	XLSX.writeFile(
		wb,
		`${student?.first_name} ${student?.last_name}_${filteredAttendanceData[0].name}_${sortOption} attendance.xlsx`,
	);
	toast.success(
		`${student?.first_name} ${student?.last_name}'s attendance EXCEL for topics: ${sortOption} downloaded successfully. `,
		{
			position: toast.POSITION.TOP_CENTER, // position the toast at the top center
			autoClose: 7000, // Display the toast for 7 secondss
		},
	);
};
