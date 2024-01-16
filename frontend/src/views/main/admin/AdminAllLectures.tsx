import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';

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
}

const AdminAllLectures: React.FC = () => {
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterOpen, setFilterOpen] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
	const [action, setAction] = useState<'close' | 'delete' | null>(null);
	const {user} = useContext(UserContext);

	useEffect(() => {
		if (user) {
			setIsLoading(true);
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const getLectures = async () => {
				const result = await apiHooks.fetchAllLectures(token);
				console.log('🚀 ~ getLectures ~ result:', result);
				setLectures(result);
				setIsLoading(false);
			};
			getLectures();
		}
	}, [user]);

	if (isLoading) {
		return 'Loading...';
	}

	const filteredLectures = filterOpen
		? lectures.filter(lecture => lecture.state === 'open')
		: lectures;

	const handleDialogOpen = (lectureid: string, action: 'close' | 'delete') => {
		setSelectedLecture(lectureid);
		setAction(action);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setSelectedLecture(null);
		setAction(null);
		setDialogOpen(false);
	};

	const handleConfirm = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			return;
		}
		if (selectedLecture) {
			try {
				if (action === 'close') {
					await apiHooks.closeLectureByLectureId(selectedLecture, token);
					toast.success('Lecture closed successfully');
				} else if (action === 'delete') {
					await apiHooks.deleteLectureByLectureId(selectedLecture, token);
					toast.success('Lecture deleted successfully');
				}
				const result = await apiHooks.fetchAllLectures(token);
				setLectures(result);
			} catch (error) {
				toast.error('Failed to perform action');
			}
		}
		handleDialogClose();
	};

	return (
		<div className="relative lg:w-fit w-full">
			<Button variant="contained" onClick={() => setFilterOpen(!filterOpen)}>
				{filterOpen ? 'Show All Lectures' : 'Show Open Lectures Only'}
			</Button>
			<TableContainer className="relative bg-gray-100 h-[384px] overflow-auto">
				<Table className="table-auto">
					<TableHead className="sticky top-0 bg-white z-10">
						<TableRow>
							<TableCell>Lecture ID</TableCell>
							<TableCell>Date</TableCell>

							<TableCell>Teacher Email</TableCell>
							<TableCell>Time of Day</TableCell>
							<TableCell>Course name</TableCell>
							<TableCell>Course code</TableCell>
							<TableCell>Topic name</TableCell>
							<TableCell>Attendance ratio</TableCell>
							<TableCell>Actions</TableCell>
							<TableCell>State</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredLectures.map(lecture => (
							<TableRow
								key={lecture.lectureid}
								className="cursor-pointer hover:bg-gray-200"
							>
								<TableCell>{lecture.lectureid}</TableCell>
								<TableCell>{new Date(lecture.start_date).toLocaleString()}</TableCell>
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
											lecture.state === 'open'
												? 'text-metropoliaSupportRed'
												: 'text-metropoliaTrendGreen'
										}
									>
										{lecture.state}
									</span>
								</TableCell>
								<TableCell>
									{lecture.state === 'open' && (
										<>
											<Button
												variant="contained"
												color="primary"
												onClick={() =>
													handleDialogOpen(lecture.lectureid.toString(), 'close')
												}
											>
												Close
											</Button>
											<Button
												variant="contained"
												color="secondary"
												onClick={() =>
													handleDialogOpen(lecture.lectureid.toString(), 'delete')
												}
											>
												Delete
											</Button>
										</>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>{`Are you sure you want to ${action} the lecture?`}</DialogTitle>
				<DialogContent>
					<DialogContentText>This action cannot be undone.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirm} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdminAllLectures;
