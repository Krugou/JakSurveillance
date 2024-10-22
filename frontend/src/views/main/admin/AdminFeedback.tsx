import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';
interface FeedbackItem {
  feedbackId: number;
  text: string;
  timestamp: string;
  topic: string;
  userid: number;
  email: string;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic === '' ? null : topic);
  };
  useEffect(() => {
    setLoading(true);
    const token: string | null = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token available');
    }
    apiHooks
      .getUserFeedback(token)
      .then((response) => {
        setFeedback(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      });
  }, []);
  const handleClickOpen = (feedbackId: number) => {
    setOpen(true);
    setDeleteId(feedbackId);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await handleDelete(deleteId);
    }
    setOpen(false);
  };
  const handleDelete = async (feedbackId: number) => {
    setLoading(true);
    const token: string | null = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token available');
    }
    try {
      await apiHooks.deleteUserFeedback(feedbackId, token);
      setFeedback(
        feedback.filter((item: FeedbackItem) => item.feedbackId !== feedbackId),
      );
      setLoading(false);
      toast.success('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setLoading(false);
      toast.error('Error deleting feedback');
    }
  };

  return (
    <div className='w-full bg-white'>
      <h1 className='p-3 m-auto mb-10 text-3xl font-bold text-center rounded-lg w-fit'>
        Feedback
      </h1>
      <div className='flex flex-col justify-center p-4 m-auto bg-white rounded-lg 2xl:w-1/3 md:w-2/3 w-fit'>
        <div className='flex flex-col items-center justify-center m-2'>
          <p className='mb-2 text-xl text-center'>
            Filter feedback by topic below:
          </p>
          <select
            title='Select topic'
            className='w-2/3 p-2 my-2 text-xl font-bold text-white rounded cursor-pointer bg-metropoliaTrendGreen focus:outline-none focus:shadow-outline'
            onChange={(e) => handleTopicChange(e.target.value)}>
            <option value=''>All</option>
            {feedback &&
              [...new Set(feedback.map((item) => item.topic))].map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
          </select>
        </div>
        <div className='max-h-[25em] pl-5 pr-5 pb-5 overflow-y-scroll'>
          {loading ? (
            <CircularProgress />
          ) : feedback.length > 0 ? (
            feedback
              .filter(
                (item) =>
                  selectedTopic === null || item.topic === selectedTopic,
              )
              .map((item: FeedbackItem) => (
                <Accordion
                  key={item.feedbackId}
                  style={{backgroundColor: '#ff5000', color: '#F5F5F5'}}
                  className='w-full mb-5'>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    className='border border-white'>
                    <Typography>
                      {item.topic} - {item.email}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className='text-black bg-white'>
                    <Typography className='break-words'>{item.text}</Typography>
                    <div className='flex justify-end'>
                      <button
                        className='p-2 m-2 font-bold text-white transition rounded bg-metropoliaSupportRed hover:hover:bg-metropoliaSupportSecondaryRed focus:outline-none focus:shadow-outline'
                        onClick={() => handleClickOpen(item.feedbackId)}>
                        Delete
                      </button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))
          ) : (
            <p className='text-center'>
              No feedback has been provided yet. Stay tuned!
            </p>
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>
            <DialogTitle id='alert-dialog-title'>
              {'Confirm Delete'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Are you sure you want to delete this feedback?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button
                className='p-2 m-2 font-bold text-white transition rounded bg-metropoliaMainOrange hover:hover:bg-metropoliaSecondaryOrange focus:outline-none focus:shadow-outline'
                onClick={handleClose}>
                Cancel
              </button>
              <button
                className='p-2 m-2 font-bold text-white transition rounded bg-metropoliaSupportRed hover:hover:bg-metropoliaSupportSecondaryRed focus:outline-none focus:shadow-outline'
                onClick={handleConfirmDelete}
                autoFocus>
                Delete
              </button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
