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
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const getLectures = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const result = await apiHooks.fetchAllLectures(token);
		const sortedLectures = result.sort((a, b) => {
			return sortOrder === 'asc'
				? a.lectureid - b.lectureid
				: b.lectureid - a.lectureid;
		});
		setLectures(sortedLectures);
		setIsLoading(false);
	};

	useEffect(() => {
		if (user) {
			setIsLoading(true);
			getLectures();
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			setIsLoading(true);
			getLectures();
		}
	}, [user, sortOrder]);

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
				const sortedLectures = result.sort(
					(a, b) =>
						new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
				);
				setLectures(sortedLectures);
			} catch (error) {
				toast.error('Failed to perform action');
			}
		}
		handleDialogClose();
	};
	const toggleSortOrder = () => {
		setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
	};

	return (
		<div className="relative xl:w-fit w-full bg-white p-5 rounded-lg">
			<div className="space-x-2 mt-4 mb-4">
				<button
					onClick={() => setFilterOpen(!filterOpen)}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{filterOpen ? 'Show All Lectures' : 'Show Open Lectures Only'}
				</button>
				<button
					onClick={toggleSortOrder}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{sortOrder === 'asc' ? 'Sort by Newest' : 'Sort by Oldest'}
				</button>
			</div>
			<TableContainer className="relative bg-gray-100 h-[384px] overflow-auto">
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
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredLectures.map(lecture => (
							<TableRow key={lecture.lectureid} className=" hover:bg-gray-200">
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
								<TableCell>
									{lecture.state === 'open' && (
										<>
											<div className="flex gap-1">
												<button
													color="success"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'close')
													}
													className="bg-metropoliaTrendGreen h-fit transition hover:hover:bg-green-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Close
												</button>
												<button
													color="error"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'delete')
													}
													className="bg-metropoliaSupportRed h-fit transition hover:hover:bg-red-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Delete
												</button>
											</div>
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
