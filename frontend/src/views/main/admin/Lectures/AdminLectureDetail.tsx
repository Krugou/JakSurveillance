import {
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

const AdminLectureDetail = () => {
	type DataType = {
		code: string;
		teacher: string;
		topicname: string;
		start_date: string;
		timeofday: string;
		attendanceid: number;
		usercourseid: number;
		first_name: string;
		last_name: string;
		status: number;
		// Add other properties as needed
	}[];

	const [data, setData] = useState<DataType | null>(null);
	const [loading, setLoading] = useState(true);
	const {user} = useContext(UserContext);
	const {courseId, lectureId} = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				if (!courseId || !lectureId) {
					toast.error('Course ID or Lecture ID is not available');
					throw new Error('Course ID or Lecture ID is not available');
				}
				const response = await apiHooks.fetchAttendances(
					token,
					courseId,
					lectureId,
				);
				console.log('🚀 ~ fetchData ~ response:', response);
				if (!response || response.length === 0) {
					toast.info('No data found for this lecture, wait until students attend');
				} else {
					toast.success('Attendances of lecture fetched successfully');
					setData(response);
				}
				setLoading(false);
			} catch (error) {
				toast.error('Error fetching attendances');
				setLoading(false);
			}
		};

		fetchData();
	}, [courseId, lectureId, user]);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div className="bg-metropoliaSupportWhite m-4 p-4">
			<Typography variant="h6" component="h2" gutterBottom>
				Lecture ID: {lectureId} - {data && data[0].code} - {data && data[0].teacher}{' '}
				- {data && data[0].topicname} -{' '}
				{data && new Date(data[0].start_date).toLocaleDateString()} -{' '}
				{data && data[0].timeofday}
			</Typography>
			<TableContainer
				component={Paper}
				style={{maxHeight: '500px', overflow: 'auto'}}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Attendance ID</TableCell>
							<TableCell>User Course ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data &&
							data.map((item, index: number) => (
								<TableRow
									key={index}
									className={
										item.status === 1
											? 'bg-metropoliaTrendGreen '
											: 'bg-metropoliaSupportRed '
									}
								>
									<TableCell style={{color: 'white'}}>{item.attendanceid}</TableCell>
									<TableCell style={{color: 'white'}}>{item.usercourseid}</TableCell>
									<TableCell style={{color: 'white'}}>
										{item.first_name} {item.last_name}
									</TableCell>
									<TableCell style={{color: 'white'}}>
										{item.status === 1 ? 'Present' : 'Not Present'}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default AdminLectureDetail;
