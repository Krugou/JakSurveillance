import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

/**
 * lecture interface represents the structure of a lecture.
 * It includes properties for the teacher's name, start date, and time of day.
 */
interface lecture {
	teacher: string;
	start_date: string;
	timeofday: string;
	code: string;
	topicname: string;
}
/**
 * DeleteLectureModalProps interface represents the structure of the DeleteLectureModal props.
 * It includes properties for the modal's open state, close function, delete function, close lecture function, and the lecture to be deleted.
 */
interface DeleteLectureModalProps {
	open: boolean;
	onClose?: () => void;
	onDelete: () => void;
	onCloseLecture?: () => void;
	lecture?: lecture;
}
/**
 * DeleteLectureModal component.
 * This component is responsible for displaying a modal that allows users to delete a lecture.
 * It uses the open, onClose, onDelete, onCloseLecture, and lecture props to determine the current state of the modal and to handle user interactions.
 * The modal contains a title, a description of the lecture to be deleted, and two buttons: one to delete the lecture and one to close the lecture.
 *
 * @param {DeleteLectureModalProps} props The props that define the state and behavior of the modal.
 * @returns {JSX.Element} The rendered DeleteLectureModal component.
 */
const DeleteLectureModal: React.FC<DeleteLectureModalProps> = ({
	open,
	onClose,
	onDelete,
	lecture,
	onCloseLecture,
}) => {
	console.log(lecture);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle
				className="bg-metropoliaMainOrange text-white p-4"
				id="alert-dialog-title"
			>
				{'Deal with previous lecture first'}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<strong className="text-lg pt-4 font-bold mb-4">
						There is already an open lecture for this course.
					</strong>
				</DialogContentText>
				<ul className="list-disc list-inside mb-4">
					<li>
						Date:{' '}
						{lecture?.start_date
							? new Date(lecture?.start_date).toLocaleDateString()
							: ''}
					</li>
					<li>Time of day: {lecture?.timeofday}</li>
					<li>Teacher Email: {lecture?.teacher} </li>
					<li>Course Code: {lecture?.code} </li>

					<li>Topic Name: {lecture?.topicname} </li>
				</ul>
				<DialogContentText id="alert-dialog-description">
					<strong className="text-lg font-bold mb-4">
						Do you want to Delete it or Finish it?
					</strong>{' '}
					<br />
					Finishing the lecture involves recording attendance for all remaining
					students who are not yet marked as attended by setting them as "not
					attended." Deleting, on the other hand, means completely removing the
					lecture from the database.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<button
					className="bg-metropoliaMainOrange sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSecondaryOrange text-white font-bold rounded"
					onClick={onClose}
				>
					Close this window
				</button>
				<button
					className="bg-metropoliaSupportRed sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSupportSecondaryRed text-white font-bold rounded"
					onClick={onDelete}
					autoFocus
				>
					Delete previous lecture
				</button>
				<button
					className="bg-metropoliaTrendGreen sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaMainGrey text-white font-bold rounded"
					onClick={onCloseLecture}
					autoFocus
				>
					Finish previous lecture
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteLectureModal;
