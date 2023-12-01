import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

interface AttendanceCount {
	name: string;
	count: number;
	topicname: string;
	percentage: number;
	selectedTopics: string | string[]; // Add this line
}
interface AttendanceStats {
	topicname: string;
	attendanceCounts: AttendanceCount[];
}

interface AttendanceStatsTableProps {
	allAttendanceCounts: AttendanceStats[];
}

const AttendanceStatsTable: React.FC<AttendanceStatsTableProps> = ({
	allAttendanceCounts,
}) => {
	const topics = allAttendanceCounts.map(item => item.topicname);

	return (
		<TableContainer className="overflow-x-auto border-gray-300 border-x border-t mt-5 mb-5 rounded-lg shadow">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHead className="bg-gray-50">
					<TableRow>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Student
						</TableCell>
						<TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Selected Topics
						</TableCell>
						{topics.map((topic, index) => (
							<TableCell
								key={index}
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								{topic}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className="bg-white divide-y divide-gray-200">
					{allAttendanceCounts[0]?.attendanceCounts.map((count, i) => (
						<TableRow key={i} className="border-b hover:bg-gray-50">
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{count.name}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{Array.isArray(count.selectedTopics)
									? count.selectedTopics.map(topic => topic.topicname).join(', ')
									: count.selectedTopics}
							</TableCell>
							{allAttendanceCounts.map((item, index) => (
								<TableCell key={index} className="px-6 py-4 whitespace-nowrap">
									{item.attendanceCounts[i]?.percentage}%
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AttendanceStatsTable;
