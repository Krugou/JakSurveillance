import React, { useState } from 'react';

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
import { toast } from 'react-toastify';
import ApiHooks from "../../../../hooks/ApiHooks";
import {useParams} from "react-router-dom";

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
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
															 filteredAttendanceData,
															 student,
															 allAttendances,
	usercourseId,
														 }) => {
	const [attendanceData, setAttendanceData] = useState<Attendance[]>(
		filteredAttendanceData,
	);

	const handleStatusChange = async (index: number, newStatus: number) => {
		try {
			console.log(usercourseId)
			const token: string | null = localStorage.getItem('userToken');
			const updatedAttendanceData = [...attendanceData];
			updatedAttendanceData[index].status = newStatus;
			setAttendanceData(updatedAttendanceData);
			// Update the status in the database
			await ApiHooks.updateAttendanceStatus(usercourseId, newStatus, token);

			// You can add a toast notification or any other feedback here
			toast.success('Attendance status updated successfully');
		} catch (error) {
			// Handle error
			console.error(error);
			toast.error('Failed to update attendance status');
		}
	};

	return (
		<TableContainer className="overflow-x-auto border-x border-t m-6">
			<Table className="table-auto w-full">
				<TableHead className="border-b">
					<TableRow className="bg-gray-100">
						<TableCell className="text-left p-4 font-medium underline">
							Date
						</TableCell>
							<TableCell className="text-left p-4 font-medium underline">
								Student:
							</TableCell>
						<TableCell className="text-left p-4 font-medium underline">
							Teacher
						</TableCell>
						<TableCell className="text-left p-4 font-medium underline">
							Time of Day
						</TableCell>
						<TableCell className="text-left p-4 font-medium underline">
							Topic
						</TableCell>
						<TableCell className="text-left p-4 font-medium underline">
							Status
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredAttendanceData.map((attendance, index) => (
						<TableRow
							key={index}
							className={`border-b hover:bg-gray-50 ${
								attendance.status === 0
									? 'bg-metropoliaSupportRed'
									: 'bg-metropoliaTrendGreen'
							}`}
						>
							<TableCell className="p-4">
								{new Date(attendance.start_date).toLocaleDateString()}
							</TableCell>
							{student && (
								<TableCell className="p-4">
									{student.first_name} {student.last_name}
								</TableCell>
							)}
							{allAttendances && (
								<TableCell className="p-4">
									{attendance.first_name} {attendance.last_name}
								</TableCell>
							)}
							<TableCell className="p-4">{attendance.teacher}</TableCell>
							<TableCell className="p-4">{attendance.timeofday}</TableCell>
							<TableCell className="p-4">{attendance.topicname}</TableCell>
							<TableCell className="p-4">
								<Select
									value={attendance.status}
									onChange={(e) => handleStatusChange(index, e.target.value as number)}
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
