import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
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
	userid: number;
	percentage: number;
	selectedTopics: string | string[]; // Add this line
}
interface AttendanceStats {
	topicname: string;
	attendanceCounts: AttendanceCount[];
}

interface AttendanceStudentData {
	attendance: {[key: string]: number};
	topics: string | string[];
}

interface AttendanceStatsTableProps {
	allAttendanceCounts?: AttendanceStats[];
	threshold: number | null;
	attendanceStudentData?: AttendanceStudentData;
	usercourseid?: number;
}

interface FetchedDataItem {
	last_name: string;
	first_name: string;
	topics: string[];
}

const AttendanceStatsTable: React.FC<AttendanceStatsTableProps> = ({
	allAttendanceCounts,
	threshold,
	attendanceStudentData,
	usercourseid,
}) => {
	const topics = allAttendanceCounts
		? allAttendanceCounts.map(item => item.topicname)
		: Object.keys(attendanceStudentData?.attendance || {});
	const [fetchedData, setFetchedData] = useState<FetchedDataItem | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (usercourseid) {
				try {
					const token = localStorage.getItem('userToken');
					if (!token) {
						throw new Error('No token available');
					}

					const response = await apiHooks.getStudentAndTopicsByUsercourseid(
						token,
						usercourseid,
					);
					setFetchedData(response);

					return response;
				} catch (error) {
					console.error('Error:', error);
				}
			}
		};

		fetchData();
	}, [usercourseid]);
	const {user} = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<TableContainer className="overflow-x-auto sm:max-h-[30em] h-fit overflow-y-scroll border-gray-300 border-x border-t mt-5 mb-5 rounded-lg shadow">
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
					{allAttendanceCounts &&
						allAttendanceCounts[0]?.attendanceCounts.map((student, i) => (
							<TableRow key={i} className="border-b hover:bg-gray-50">
								<TableCell
									className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-200"
									onClick={() => {
										navigate(`/${user?.role}/students/${student.userid}`);
									}}
								>
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
										!student.selectedTopics.includes(item.topicname) ? (
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
														item.attendanceCounts[i]?.percentage === 0
															? 'bg-metropoliaSupportRed'
															: threshold !== null
															? Number(item.attendanceCounts[i]?.percentage) <= threshold
																? 'bg-red-200'
																: 'bg-metropoliaSupportBlue'
															: Number(item.attendanceCounts[i]?.percentage) < 80
															? 'bg-red-200'
															: 'bg-metropoliaSupportBlue'
													}`}
													style={{
														width:
															item.attendanceCounts[i]?.percentage === 0
																? '100%'
																: `${item.attendanceCounts[i]?.percentage}%`,
													}}
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
					{attendanceStudentData && (
						<TableRow className="border-b hover:bg-gray-50">
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{fetchedData && `${fetchedData?.last_name} ${fetchedData?.first_name}`}
							</TableCell>
							<TableCell className="px-6 py-4 whitespace-nowrap">
								{fetchedData && Array.isArray(fetchedData?.topics)
									? fetchedData?.topics.join(', ')
									: fetchedData?.topics}
							</TableCell>
							{topics &&
								topics.map((topic, index) => (
									<TableCell key={index}>
										{attendanceStudentData.attendance &&
										attendanceStudentData.attendance[topic] === undefined ? (
											'N/A'
										) : (
											<div className="w-full h-4 rounded bg-gray-200 relative">
												<div
													className={`h-full rounded ${
														attendanceStudentData.attendance[topic] === 0
															? 'bg-metropoliaSupportRed'
															: threshold !== null
															? attendanceStudentData.attendance[topic] <= threshold
																? 'bg-red-200'
																: 'bg-metropoliaSupportBlue'
															: attendanceStudentData.attendance[topic] < 80
															? 'bg-red-200'
															: 'bg-metropoliaSupportBlue'
													}`}
													style={{
														width:
															attendanceStudentData.attendance[topic] === 0
																? '100%'
																: `${attendanceStudentData.attendance[topic]}%`,
													}}
												></div>
												<span className="absolute w-full text-center text-xs text-gray-800">
													{`${attendanceStudentData.attendance[topic]}%`}
												</span>
											</div>
										)}
									</TableCell>
								))}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AttendanceStatsTable;
