import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

interface Lecture {
	lectureid: number;
	start_date: string;
	attended: number;
	notattended: number;
	teacheremail: string;
	timeofday: string;
	coursename: string;
	state: string;
	topicname: string;
	coursecode: string;
	courseid: string;
}

const TeacherLectures: React.FC = () => {
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const {user} = useContext(UserContext);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const getLectures = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		if (user) {
			const result = await apiHooks.fetchTeacherOwnLectures(user.userid, token);
			const sortedLectures = result.sort((a, b) => {
				return sortOrder === 'asc'
					? a.lectureid - b.lectureid
					: b.lectureid - a.lectureid;
			});
			setLectures(sortedLectures);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			setIsLoading(true);
			getLectures();
		}
	}, [user]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div className="relative xl:w-fit w-full bg-white p-5 rounded-lg">
			<h1>Your lectures</h1>
			<div className="space-x-2 mt-4 mb-4"></div>
			<TableContainer
				className={`relative bg-gray-100 overflow-auto h-[384px]
				}`}
			>
				<Table className="table-auto">
					<TableHead className="sticky border-t-2 border-black top-0 bg-white z-10">
						<TableRow>
							<TableCell>Lecture ID</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Teacher Email</TableCell>
							<TableCell>Time of Day</TableCell>
							<TableCell>Course name</TableCell>
							<TableCell>Course code</TableCell>
							<TableCell>Topic name</TableCell>
							<TableCell>Attendance ratio</TableCell>
							<TableCell>State</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{lectures.length > 0 ? (
							lectures.map(lecture => (
								<TableRow key={lecture.lectureid} className=" hover:bg-gray-200">
									<TableCell>{lecture.lectureid}</TableCell>
									<TableCell>
										{new Date(lecture.start_date).toLocaleDateString()}
									</TableCell>
									<TableCell>{lecture.teacheremail}</TableCell>
									<TableCell>{lecture.timeofday}</TableCell>
									<TableCell>{lecture.coursename}</TableCell>
									<TableCell>{lecture.coursecode}</TableCell>
									<TableCell>{lecture.topicname}</TableCell>
									<TableCell>
										<span className="text-metropoliaTrendGreen">{lecture.attended}</span>/
										<span className="text-metropoliaSupportRed">
											{lecture.notattended}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={
												lecture.state === 'open' &&
												new Date(lecture.start_date).getTime() <
													Date.now() - 24 * 60 * 60 * 1000
													? 'text-metropoliaSupportRed'
													: 'text-metropoliaTrendGreen'
											}
										>
											{lecture.state}
										</span>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align="center">
									{'No data available'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeacherLectures;
