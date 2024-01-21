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
			<DialogTitle className="bg-metropoliaMainOrange text-white p-4">
				Hey, you found the secret instructions on this page!
			</DialogTitle>
			<DialogContent>
				<p className="mb-4 mt-2">
					Please read the instructions stated in them thoroughly before executing any
					actions.
				</p>
				<ol className="list-decimal list-inside space-y-4">
					<li>
						If you want to extend the timer beyond the currently set time via server
						settings, refresh the timer by pressing the Back button on your browser.
						Subsequently, press the Forward button to reset the timer and refresh the
						server connection used by the QR code changer. This process involves going
						back to the previous page and returning; it's the sole method to extend
						the timer, configured through server settings by the admin role.
					</li>
					<li>
						To reposition the bottom list of students, click and hold the
						mouse/touchpad button, then drag it sideways to reveal additional student
						names that may be hidden from view if necessary.
					</li>
					<li>
						Avoid navigating away from this page, except when refreshing as indicated
						in the first option, or closing your internet connection, as doing so may
						lead to QR updates failure or lost connection with the server. This is
						crucial to ensure everything works as intended.
					</li>
					<li>
						Complete the lecture by clicking the "Finish Lecture" button. This action
						will mark the remaining students in the bottom list as "not attended."
					</li>
					<li>
						To cancel the lecture, simply press the "Cancel Lecture" button. This
						action will delete the lecture from the database.
					</li>
				</ol>
			</DialogContent>
			<DialogActions>
				<button
					className="bg-metropoliaMainOrange sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSecondaryOrange text-white font-bold rounded"
					onClick={() => setDialogOpen(false)}
				>
					Close
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default AttendanceInstructions;
