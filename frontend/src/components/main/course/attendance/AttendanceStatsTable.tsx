import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
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
	treshold: number | null;
}

const AttendanceStatsTable: React.FC<AttendanceStatsTableProps> = ({
	allAttendanceCounts,
	treshold,
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
					{allAttendanceCounts[0]?.attendanceCounts.map((student, i) => (
						<TableRow key={i} className="border-b hover:bg-gray-50">
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{student.name}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{Array.isArray(student.selectedTopics)
									? student.selectedTopics.join(', ')
									: student.selectedTopics}
							</TableCell>
							{allAttendanceCounts.map((item, index) => (
								<TableCell key={index}>
									{Array.isArray(student.selectedTopics) &&
									!student.selectedTopics.includes(item.topicname) &&
									typeof student.selectedTopics === 'string' &&
									student.selectedTopics !== 'all' ? (
										'N/A'
									) : item.attendanceCounts[i]?.percentage.toString() ===
									  'No lectures' ? (
										<Tooltip title="No lectures available for this topic">
											<InfoIcon />
										</Tooltip>
									) : (
										<div className="w-full h-4 rounded bg-gray-200 relative">
											<div
												className={`h-full rounded ${
													treshold !== null
														? item.attendanceCounts[i]?.percentage < treshold // if treshold is set, use it to determine the color
															? 'bg-metropoliaSupportRed'
															: 'bg-metropoliaSupportBlue'
														: item.attendanceCounts[i]?.percentage < 80
														? 'bg-metropoliaSupportRed'
														: 'bg-metropoliaSupportBlue'
												}`}
												style={{width: `${item.attendanceCounts[i]?.percentage}%`}}
											></div>
											<span className="absolute w-full text-center text-xs text-gray-800">
												{`${item.attendanceCounts[i]?.percentage}%`}
											</span>
										</div>
									)}
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
