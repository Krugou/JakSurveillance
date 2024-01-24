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

import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
	courseid: string;
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
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
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

			const intervalId = setInterval(() => {
				getLectures();
			}, 120000); // calls getLectures every 120 seconds

			// clear interval on component unmount
			return () => clearInterval(intervalId);
		}
	}, [user, sortOrder]);

	if (isLoading) {
		return <CircularProgress />;
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
					toast.success('Lecture closed successfully ' + selectedLecture);
				} else if (action === 'delete') {
					await apiHooks.deleteLectureByLectureId(selectedLecture, token);
					toast.success('Lecture deleted successfully ' + selectedLecture);
				}
				const result = await apiHooks.fetchAllLectures(token);
				const sortedLectures = result.sort((a, b) => {
					return sortOrder === 'asc'
						? a.lectureid - b.lectureid
						: b.lectureid - a.lectureid;
				});
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
	const handleRowClick = (courseId: string, lectureId: string) => {
		navigate(`./${courseId}/${lectureId}`);
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
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{isExpanded ? 'Shrink Table' : 'Expand to full'}
				</button>
			</div>
			<TableContainer
				className={`relative bg-gray-100 overflow-auto ${
					isExpanded ? 'h-screen' : 'h-[384px]'
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
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredLectures.length > 0 ? (
							filteredLectures.map(lecture => (
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
									<TableCell>
										<div className="flex gap-1">
											<button
												color="primary"
												onClick={() =>
													handleRowClick(lecture.courseid, lecture.lectureid.toString())
												}
												className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
											>
												Details
											</button>
											{lecture.state === 'open' && (
												<button
													color="success"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'close')
													}
													className="bg-metropoliaTrendGreen h-fit transition hover:hover:bg-green-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Close
												</button>
											)}
											{(lecture.state === 'open' || lecture.state === 'closed') && (
												<button
													color="error"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'delete')
													}
													className="bg-metropoliaSupportRed h-fit transition hover:hover:bg-red-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Delete
												</button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align="center">
									{filterOpen ? 'No data available in open state' : 'No data available'}
								</TableCell>
							</TableRow>
						)}
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
