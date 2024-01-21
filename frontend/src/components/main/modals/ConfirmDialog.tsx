import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import React from 'react';

interface ConfirmDialogProps {
	title: string;
	children: React.ReactNode;
	open: boolean;
	setOpen: (value: boolean) => void;
	onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	title,
	children,
	open,
	setOpen,
	onConfirm,
}) => {
	const handleClose = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="confirm-dialog">
			<DialogTitle
				className="bg-metropoliaMainOrange text-white p-4"
				id="confirm-dialog"
			>
				{title}
			</DialogTitle>
			<DialogContent>
				<DialogContentText className=" pt-2" id="confirm-dialog-description">
					{children}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<button
					className="bg-metropoliaMainOrange sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSecondaryOrange text-white font-bold rounded"
					onClick={handleClose}
				>
					No
				</button>
				<button
					className="bg-metropoliaSupportRed sm:w-fit transition h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSupportRed text-white font-bold rounded"
					onClick={handleConfirm}
					autoFocus
				>
					Yes
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
