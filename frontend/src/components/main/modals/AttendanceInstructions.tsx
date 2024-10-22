import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import React from 'react';

interface AttendanceInstructionsProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const AttendanceInstructions: React.FC<AttendanceInstructionsProps> = ({
  dialogOpen,
  setDialogOpen,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle className='p-4 text-white bg-metropoliaMainOrange'>
        Hey, you found the secret instructions on this page!
      </DialogTitle>
      <DialogContent>
        <p className='mt-2 mb-4'>
          Please read the instructions stated in them thoroughly before
          executing any actions.
        </p>
        <ol className='space-y-4 list-decimal list-inside'>
          <li>
            To extend the overall auto-finish timer, refresh the timer by
            pressing the "Reset Timer" button, considering the auto-finish time
            set in the server settings. This will reload the page and internally
            update the timer through the server background service.
          </li>
          <li>
            To reposition the bottom list of students, click and hold on the
            names of the students using the mouse/touchpad button. Then, drag it
            sideways to reveal additional student names that may be hidden from
            view if necessary.
          </li>
          <li>
            Avoid navigating away from this page, except when refreshing as
            indicated in the first option, or closing your internet connection,
            as doing so may lead to QR updates failure or lost connection with
            the server. This is crucial to ensure everything works as intended.
          </li>
          <li>
            Manual student attendance insertion can be performed by clicking on
            the student names on the page. Clicking on names in the bottom list
            marks students as 'Attended.' Clicking on names in the right-side
            list marks students as 'Not Attended,' and they will then return to
            the bottom list.
          </li>
          <li>
            Complete the lecture by clicking the "Finish Lecture" button. This
            action will mark the remaining students in the bottom list as "not
            attended."
          </li>

          <li>
            To cancel the lecture, simply press the "Cancel Lecture" button.
            This action will delete the lecture from the database.
          </li>
        </ol>
      </DialogContent>
      <DialogActions>
        <button
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaMainOrange sm:w-fit h-fit hover:bg-metropoliaSecondaryOrange'
          onClick={() => setDialogOpen(false)}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceInstructions;
