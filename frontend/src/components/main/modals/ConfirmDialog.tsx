import React from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from '@mui/material';

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
			<DialogTitle id="confirm-dialog">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="confirm-dialog-description">
					{children}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					No
				</Button>
				<Button onClick={handleConfirm} color="primary" autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
