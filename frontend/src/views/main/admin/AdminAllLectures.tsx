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
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
import {toast} from 'react-toastify';

interface Lecture {
	lectureid: number;
	start_date: string;
	end_date: string;
	teacherid: number;
	timeofday: string;
	courseid: number;
	state: string;
	topicid: number;
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
			<TableContainer className="relative bg-gray-100">
				<Table className="table-auto">
					<TableHead className="sticky top-0 bg-white z-10">
						<TableRow>
							<TableCell>Lecture ID</TableCell>
							<TableCell>Start Date</TableCell>
							<TableCell>End Date</TableCell>
							<TableCell>Teacher ID</TableCell>
							<TableCell>Time of Day</TableCell>
							<TableCell>Course ID</TableCell>
							<TableCell>State</TableCell>
							<TableCell>Topic ID</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredLectures.map(lecture => (
							<TableRow
								key={lecture.lectureid}
								className="cursor-pointer hover:bg-gray-200"
							>
								<TableCell>{lecture.lectureid}</TableCell>
								<TableCell>{lecture.start_date}</TableCell>
								<TableCell>{lecture.end_date}</TableCell>
								<TableCell>{lecture.teacherid}</TableCell>
								<TableCell>{lecture.timeofday}</TableCell>
								<TableCell>{lecture.courseid}</TableCell>
								<TableCell>{lecture.state}</TableCell>
								<TableCell>{lecture.topicid}</TableCell>
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
