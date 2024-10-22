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
    <Dialog open={open} onClose={handleClose} aria-labelledby='confirm-dialog'>
      <DialogTitle
        className='p-4 text-white bg-metropoliaMainOrange'
        id='confirm-dialog'>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className='pt-2 ' id='confirm-dialog-description'>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaMainOrange sm:w-fit h-fit hover:bg-metropoliaSecondaryOrange'
          onClick={handleClose}>
          No
        </button>
        <button
          className='w-full p-2 mt-4 text-sm font-bold text-white transition rounded bg-metropoliaSupportRed sm:w-fit h-fit hover:bg-metropoliaSupportRed'
          onClick={handleConfirm}
          autoFocus>
          Yes
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
