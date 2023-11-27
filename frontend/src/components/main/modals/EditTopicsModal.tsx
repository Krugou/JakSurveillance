import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
} from '@mui/material';

import React, {useState} from 'react';

interface EditTopicsModalProps {
	isOpen: boolean;
	handleClose: () => void;
}

const EditTopicsModal: React.FC<EditTopicsModalProps> = ({
	isOpen,
	handleClose,
}) => {
	const [topics, setTopics] = useState('');

	const handleSubmit = event => {
		event.preventDefault();
		// Handle the form submission here
		// For example, you could call an API to update the topics
		console.log(topics);
		handleClose();
	};

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>Edit Topics</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Topics"
						type="text"
						fullWidth
						value={topics}
						onChange={e => setTopics(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button type="submit">Save</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditTopicsModal;
