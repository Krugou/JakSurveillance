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
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle
        className='p-4 text-white bg-metropoliaMainOrange'
        id='alert-dialog-title'>
        {'Deal with previous lecture first'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <strong className='pt-4 mb-4 text-lg font-bold'>
            There is already an open lecture for this course.
          </strong>
        </DialogContentText>
        <ul className='mb-4 list-disc list-inside'>
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
        <DialogContentText id='alert-dialog-description'>
          <strong className='mb-4 text-lg font-bold'>
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
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaMainOrange sm:w-fit h-fit hover:bg-metropoliaSecondaryOrange'
          onClick={onClose}>
          Close this window
        </button>
        <button
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaSupportRed sm:w-fit h-fit hover:bg-metropoliaSupportSecondaryRed'
          onClick={onDelete}
          autoFocus>
          Delete previous lecture
        </button>
        <button
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaTrendGreen sm:w-fit h-fit hover:bg-metropoliaMainGrey'
          onClick={onCloseLecture}
          autoFocus>
          Finish previous lecture
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteLectureModal;
