import React from 'react';

import {
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import {toast} from 'react-toastify';
import ApiHooks from '../../../../hooks/ApiHooks';

interface Attendance {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	teacher: string;
	status: number;
}

interface AttendanceFromTeacher {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	teacher: string;
	status: number;
	usercourseid: number;
	email: string;
	first_name: string;
	last_name: string;
	studentnumber: string;
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
interface AttendanceTableProps {
	filteredAttendanceData: Attendance[] | AttendanceFromTeacher[];
	student?: StudentInfo | null;
	allAttendances?: boolean;
	usercourseId?: number;
	updateView?: () => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
	filteredAttendanceData,
	student,
	allAttendances,
	updateView,
}) => {
	const handleStatusChange = async (newStatus: number, attendanceid?) => {
		try {
			const token: string | null = localStorage.getItem('userToken');

			// Update the status in the database
			await ApiHooks.updateAttendanceStatus(attendanceid, newStatus, token);

			// You can add a toast notification or any other feedback here
			toast.success('Attendance status updated successfully');
			updateView && updateView();
		} catch (error) {
			// Handle error
			console.error(error);
			toast.error('Failed to update attendance status');
		}
	};

	return (
		<TableContainer className="overflow-x-auto border-gray-300 border-x border-t max-h-[20em] mt-5 mb-5 rounded-lg shadow">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHead className="bg-gray-50">
					<TableRow>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Date
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Student
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Teacher
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Time of Day
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Topic
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className="bg-white divide-y divide-gray-200">
					{filteredAttendanceData.map((attendance, index) => (
						<TableRow
							key={index}
							className={`border-b hover:bg-gray-50 ${
								attendance.status === 0 ? 'bg-red-200' : 'bg-green-200'
							}`}
						>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{new Date(attendance.start_date).toLocaleDateString()}
							</TableCell>
							{student && (
								<TableCell className="px-6 py-4 whitespace-nowrap">
									{student.last_name} {student.first_name}
								</TableCell>
							)}
							{allAttendances && (
								<TableCell className="px-6 py-4 whitespace-nowrap">
									{attendance.last_name} {attendance.first_name}
								</TableCell>
							)}
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{attendance.teacher}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{attendance.timeofday}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{attendance.topicname}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								<Select
									value={attendance.status}
									onChange={e =>
										handleStatusChange(e.target.value as number, attendance.attendanceid)
									}
								>
									<MenuItem value={0}>Absent</MenuItem>
									<MenuItem value={1}>Present</MenuItem>
								</Select>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AttendanceTable;
