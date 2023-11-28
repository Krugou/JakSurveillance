import React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditTopicsModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	courseName: string;
	newTopic: string;
	setNewTopic: (newTopic: string) => void;
	courseTopics: string[];
	setCourseTopics: (courseTopics: string[]) => void;
	modifiedTopics: string[];
	handleTopicChange: (topic: string) => void;
	handleDeleteTopic: (topic: string) => void;
	resetData: () => void;
}

const EditTopicsModal: React.FC<EditTopicsModalProps> = ({
	open,
	setOpen,
	courseName,
	newTopic,
	setNewTopic,
	courseTopics,
	setCourseTopics,
	modifiedTopics,
	handleTopicChange,
	handleDeleteTopic,
	resetData,
}) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			onClick={e => e.stopPropagation()}
		>
			<div className="p-4 bg-white rounded shadow-lg max-w-lg mx-auto mt-10">
				<h2 className="text-2xl mb-4">Edit Topics for {courseName}</h2>

				<TextField
					value={newTopic}
					onChange={e => setNewTopic(e.target.value)}
					label="New Topic"
					variant="outlined"
					className="mb-6"
					fullWidth
					required
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										if (newTopic.trim() !== '') {
											setCourseTopics([...courseTopics, newTopic]);
											setNewTopic('');
										}
									}}
								>
									<AddIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				{courseTopics.map((topic, index) => (
					<div key={index} className="flex items-center mb-2 mt-3">
						<Checkbox
							checked={modifiedTopics.includes(topic)}
							onChange={() => handleTopicChange(topic)}
						/>
						<p className="flex-grow">{topic}</p>
						<IconButton onClick={() => handleDeleteTopic(topic)}>
							<DeleteIcon />
						</IconButton>
					</div>
				))}
				<p className="text-sm text-gray-500 mb-4">
					Only checked topics will be included in the course, deleting them from the
					view will also exclude them.
				</p>
				<div className="flex justify-between mt-6">
					<Button
						variant="outlined"
						color="secondary"
						onClick={resetData}
						className="mr-10"
					>
						RESET
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default EditTopicsModal;
