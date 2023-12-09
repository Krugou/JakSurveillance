import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

/**
 * lecture interface represents the structure of a lecture.
 * It includes properties for the teacher's name, start date, and time of day.
 */
interface lecture {
	teacher: string;
	start_date: string;
	timeofday: string;
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
}) => (
	<Dialog
		open={open}
		onClose={onClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">
			{'Deal with previous lecture first'}
		</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				{`There is already an open lecture for this course by ${
					lecture?.teacher
				} at ${
					lecture?.start_date
						? new Date(lecture?.start_date).toLocaleDateString()
						: ''
				} time of day:  ${
					lecture?.timeofday
				}.  Do you want to delete it or close it?`}
				<br />
				<br />
				{`Closing means counting the lecture's attendance and deleting means completely deleting it's attendance.`}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={onDelete} autoFocus>
				Delete Previous
			</Button>
			<Button onClick={onCloseLecture} autoFocus>
				CLOSE Previous
			</Button>
		</DialogActions>
	</Dialog>
);

export default DeleteLectureModal;
