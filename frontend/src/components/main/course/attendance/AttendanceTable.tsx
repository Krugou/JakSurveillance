import React from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

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
interface AttendanceTableProps {
	filteredAttendanceData: Attendance[];
	student?: StudentInfo | null;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
	filteredAttendanceData,
	student,
}) => {
	return (
		<TableContainer className="overflow-x-auto border-x border-t m-6">
			<Table className="table-auto w-full">
				<TableHead className="border-b">
					<TableRow className="bg-gray-100">
						<TableCell className="text-left p-4 font-medium underline">
							Date
						</TableCell>
						{student && (
							<TableCell className="text-left p-4 font-medium underline">
								Student:
							</TableCell>
						)}
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
							<TableCell className="p-4">{attendance.teacher}</TableCell>
							<TableCell className="p-4">{attendance.timeofday}</TableCell>
							<TableCell className="p-4">{attendance.topicname}</TableCell>
							<TableCell className="p-4">
								{attendance.status === 1 ? 'Present' : 'Absent'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AttendanceTable;
