import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';
interface FeedbackItem {
	feedbackId: number;
	text: string;
	timestamp: string;
	topic: string;
	userid: number;
}

const AdminFeedback = () => {
	const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const handleTopicChange = (topic: string) => {
		setSelectedTopic(topic === '' ? null : topic);
	};
	useEffect(() => {
		setLoading(true);
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		apiHooks
			.getUserFeedback(token)
			.then(response => {
				setFeedback(response);
				setLoading(false);
			})
			.catch(error => {
				console.error('Error fetching feedback:', error);
				setLoading(false);
			});
	}, []);
	const handleClickOpen = (feedbackId: number) => {
		setOpen(true);
		setDeleteId(feedbackId);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleConfirmDelete = async () => {
		if (deleteId !== null) {
			await handleDelete(deleteId);
		}
		setOpen(false);
	};
	const handleDelete = async (feedbackId: number) => {
		setLoading(true);
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		try {
			await apiHooks.deleteUserFeedback(feedbackId, token);
			setFeedback(
				feedback.filter((item: FeedbackItem) => item.feedbackId !== feedbackId),
			);
			setLoading(false);
			toast.success('Feedback deleted successfully');
		} catch (error) {
			console.error('Error deleting feedback:', error);
			setLoading(false);
			toast.error('Error deleting feedback');
		}
	};

	return (
		<div className="w-2/3 flex  flex-col justify-center">
			<div className="flex flex-col justify-center items-center m-2">
				<h1 className="text-3xl font-bold text-center my-4">Feedback</h1>
				<p className="text-lg text-center mb-4">Choose by to filter topic or All</p>
				<select
					title="Select topic"
					className="w-1/2 my-2 text-xl bg-metropoliaTrendGreen text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline"
					onChange={e => handleTopicChange(e.target.value)}
				>
					<option value="">All</option>
					{feedback &&
						[...new Set(feedback.map(item => item.topic))].map(topic => (
							<option key={topic} value={topic}>
								{topic}
							</option>
						))}
				</select>
			</div>
			{loading ? (
				<CircularProgress />
			) : (
				feedback &&
				feedback
					.filter(item => selectedTopic === null || item.topic === selectedTopic)
					.map((item: FeedbackItem) => (
						<Accordion
							key={item.feedbackId}
							style={{width: '100%', backgroundColor: '#53565a', color: '#F5F5F5'}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
								className="border border-black"
							>
								<Typography className="">{item.topic}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>{item.text}</Typography>
								<div className="flex justify-end">
									<button
										className="bg-metropoliaSupportRed  hover:hover:bg-metropoliaSupportSecondaryRed transition text-white font-bold p-2  m-2 rounded focus:outline-none focus:shadow-outline"
										onClick={() => handleClickOpen(item.feedbackId)}
									>
										Delete
									</button>
								</div>
							</AccordionDetails>
						</Accordion>
					))
			)}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this feedback?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<button
						className="bg-metropoliaMainOrange  hover:hover:bg-metropoliaSecondaryOrange transition text-white font-bold p-2  m-2 rounded focus:outline-none focus:shadow-outline"
						onClick={handleClose}
					>
						Cancel
					</button>
					<button
						className="bg-metropoliaSupportRed  hover:hover:bg-metropoliaSupportSecondaryRed transition text-white font-bold p-2  m-2 rounded focus:outline-none focus:shadow-outline"
						onClick={handleConfirmDelete}
						autoFocus
					>
						Delete
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdminFeedback;
