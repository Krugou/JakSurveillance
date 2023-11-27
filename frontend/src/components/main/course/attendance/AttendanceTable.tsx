import React from 'react';

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
		<div className="overflow-x-auto border-x border-t m-6">
			<table className="table-auto w-full">
				<thead className="border-b">
					<tr className="bg-gray-100">
						<th className="text-left p-4 font-medium underline">Date</th>
						{student && (
							<th className="text-left p-4 font-medium underline">Student:</th>
						)}
						<th className="text-left p-4 font-medium underline">Teacher</th>
						<th className="text-left p-4 font-medium underline">Time of Day</th>
						<th className="text-left p-4 font-medium underline">Topic</th>
						<th className="text-left p-4 font-medium underline">Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredAttendanceData.map((attendance, index) => (
						<tr
							key={index}
							className={`border-b hover:bg-gray-50 ${
								attendance.status === 0
									? 'bg-metropoliaSupportRed'
									: 'bg-metropoliaTrendGreen'
							}`}
						>
							<td className="p-4">
								{new Date(attendance.start_date).toLocaleDateString()}
							</td>
							{student && (
								<td className="p-4">
									{student.first_name} {student.last_name}
								</td>
							)}
							<td className="p-4">{attendance.teacher}</td>
							<td className="p-4">{attendance.timeofday}</td>
							<td className="p-4">{attendance.topicname}</td>
							<td className="p-4">{attendance.status === 1 ? 'Present' : 'Absent'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AttendanceTable;
