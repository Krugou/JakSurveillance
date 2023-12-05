import {CircularProgress} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import io, {Socket} from 'socket.io-client';
import Attendees from '../../../../components/main/course/attendance/Attendees';
import CourseStudents from '../../../../components/main/course/attendance/CourseStudents';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
/**
 * AttendanceRoom component.
 * This component is responsible for managing the attendance room for a lecture.
 * It handles the socket connections, fetches the lecture info, and manages the countdown for the lecture.
 * It also displays the QR code for the lecture, the list of attendees, and the list of students in the course.
 * @component
 */
interface Student {
	studentnumber: string;
	first_name: string;
	last_name: string;
	userid: number;
}
const AttendanceRoom: React.FC = () => {
	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const {lectureid} = useParams<{lectureid: string}>();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<string[]>([]);
	const [courseStudents, setCourseStudents] = useState<Student[]>([]);
	const [countdown, setCountdown] = useState<null | number>(null);
	const [courseName, setCourseName] = useState('');
	const [courseCode, setCourseCode] = useState('');
	const [topicname, setTopicname] = useState('');
	const [loading, setLoading] = useState(true);
	const [hashValue, setHashValue] = useState('');
	const [courseId, setCourseId] = useState('');
	const [dataLoaded, setDataLoaded] = useState(false);
	const [hashDataReceived, setHashDataReceived] = useState(false);
	/**
	 * useEffect hook for fetching lecture info.
	 * This hook is run when the component mounts and whenever the lectureid changes.
	 * It fetches the lecture info from the API and sets the course code, course name, and topic name.
	 * It also handles any errors that may occur during the fetch.
	 */
	useEffect(() => {
		// Check if user information is available
		if (!user) {
			// If not, display an error message and exit the function
			toast.error('No user information available');
			return;
		}

		// Check if a lecture ID is provided
		if (!lectureid) {
			// If not, display an error message and exit the function
			toast.error('No lecture ID provided');
			return;
		}

		// Retrieve the user token from local storage
		const token: string | null = localStorage.getItem('userToken');

		// Check if the token is available
		if (!token) {
			// If not, display an error message and exit the function
			toast.error('No token available');
			return;
		}

		// Call the API to get the lecture info
		apiHooks
			.getLectureInfo(lectureid, token)
			.then(info => {
				setCourseId(info.courseid);
				// Check if the lecture is already closed
				if (info.state === 'closed') {
					// If so, display an error message, navigate to the main view, and exit the function
					toast.error('Lecture is already closed');
					navigate('/teacher/mainview');
					return;
				}
				// Set the course code, course name, and topic name from the lecture info
				setCourseCode(info.code);
				setCourseName(info.name);
				setTopicname(info.topicname);
				// Display a success message
				toast.success('Lecture info retrieved successfully');

				// Set loading to false when the data fetch is done
				setLoading(false);
				setDataLoaded(true);
			})
			.catch(error => {
				// Log the error and display an error message
				console.error('Error getting lecture info:', error);
				toast.error('Error getting lecture info');

				// Set loading to false even if there was an error
				setLoading(false);
			});
	}, [lectureid]); // This effect depends on the lectureid variable
	useEffect(() => {
		console.log('courseId:', courseId);
	}, [courseId]);
	/**
	 * useEffect hook for managing socket connections.
	 * This hook is run when the component mounts and whenever the lectureid changes.
	 * It creates a new socket connection and sets up various event listeners for the socket.
	 * It also emits a 'createAttendanceCollection' event with the lectureid.
	 */
	useEffect(() => {
		// If the socket is not already connected

		if (!socket) {
			// Determine the socket URL and path based on the environment

			const socketURL =
				import.meta.env.MODE === 'development' ? 'http://localhost:3002' : '/';
			const socketPath =
				import.meta.env.MODE === 'development' ? '' : '/api/socket.io';

			const newSocket = io(socketURL, {
				path: socketPath,
				transports: ['websocket'],
			});
			// Set the socket state
			setSocket(newSocket);
			// Log when the socket is connected
			newSocket.on('connect', () => {
				console.log('Socket connected');
			});
			// Emit a 'createAttendanceCollection' event with the lectureid
			newSocket.emit('createAttendanceCollection', lectureid);
			// When the lecture starts, set the countdown
			newSocket.on('lecturestarted', (checklectureid, timeout) => {
				if (checklectureid === lectureid) {
					setCountdown(timeout / 1000); // convert milliseconds to seconds
				}
			});

			// When receiving the list of all students in the lecture, update the state
			newSocket.on('getallstudentsinlecture', courseStudents => {
				setCourseStudents(courseStudents);
			});
			// When the list of students in the course is updated, update the state
			newSocket.on('updatecoursestudents', courseStudents => {
				setCourseStudents(courseStudents);
			});
			// When the attendance collection data is updated, update the state
			newSocket.on(
				'updateAttendanceCollectionData',
				(hash, lectureid, arrayOfStudents, courseStudents) => {
					setHashDataReceived(true);
					setHashValue(hash + '/' + lectureid);
					setArrayOfStudents(arrayOfStudents);

					setCourseStudents(courseStudents);
				},
			);
			// When a student is inserted manually, display a success message
			newSocket.on('manualstudentinsertSuccess', lectureid => {
				if (lectureid === lectureid) {
					toast.success('Student inserted successfully');
				}
			});
			// When a student is inserted manually, display an error message
			newSocket.on('manualstudentinsertError', lectureid => {
				if (lectureid === lectureid) {
					toast.error('Error inserting student');
				}
			});
			// When a student is inserted manually, display an error message if the student number is empty
			newSocket.on('manualstudentinsertFailedEmpty', lectureid => {
				if (lectureid === lectureid) {
					toast.error('Student number is empty');
				}
			});
			newSocket.on('manualStudentRemoveFailedEmpty', lectureid => {
				if (lectureid === lectureid) {
					toast.error('Student number is empty');
				}
			});
			newSocket.on('manualStudentRemoveSuccess', lectureid => {
				if (lectureid === lectureid) {
					toast.success('Student removed successfully');
				}
			});
			newSocket.on('manualStudentRemoveError', lectureid => {
				if (lectureid === lectureid) {
					toast.error('Error removing student');
				}
			});
			// When a student is inserted manually, display an error message if the student number is invalid
			newSocket.on('disconnect', () => {
				console.log('Disconnected from the server');
			});
		}
	}, [lectureid]); // This effect depends on the lectureid variable

	/**
	 * useEffect hook for disconnecting the socket when the component unmounts.
	 * This hook is run when the component mounts and whenever the socket changes.
	 * It returns a cleanup function that disconnects the socket when the component unmounts.
	 */
	useEffect(() => {
		// Return a cleanup function
		return () => {
			// If the socket is defined
			if (socket) {
				// if (arrayOfStudents.length === 0) {
				// 	socket.emit('lecturenotused', lectureid);
				// }
				// Disconnect the socket when the component unmounts
				socket.disconnect();

				// If there are no more students, emit a "lecture not used" event
			}
		};
	}, [socket]); // This effect depends on the socket variable

	useEffect(() => {
		if (dataLoaded) {
			// Only start listening for the event if data has been loaded
			if (socket) {
				// When the lecture is finished, display a success message and navigate to the attendance view
				socket.on('lecturefinished', checklectureid => {
					console.log('lecturefinished');
					if (checklectureid === lectureid) {
						toast.success('Lecture finished');
						if (courseId) {
							navigate(`/teacher/courses/attendances/${courseId}`);
						} else {
							console.error('courseId is not set');
						}
					}
				});
			}
		}
	}, [dataLoaded]);
	/**
	 * Function to handle the 'Finish Lecture' button click.
	 * This function emits a 'lecturefinishedwithbutton' event with the lectureid.
	 */
	const handleLectureFinished = () => {
		// Check if the socket is connected
		if (!socket) {
			// If the socket is not connected, display an error message and exit the function
			toast.error('Socket is not connected');
			return;
		}

		// If the socket is connected, emit a 'lecturefinishedwithbutton' event with the lectureid
		socket.emit('lecturefinishedwithbutton', lectureid);
	};
	/**
	 * useEffect hook for managing the countdown.
	 * This hook is run when the component mounts and whenever the countdown changes.
	 * It starts a timer that decreases the countdown by 1 every second if the countdown is greater than 0.
	 * It returns a cleanup function that clears the timer when the component unmounts.
	 */
	useEffect(() => {
		// Declare a variable to hold the ID of the timer
		let intervalId;

		// If countdown is not null and is greater than 0
		if (countdown !== null && countdown > 0) {
			// Start a timer that decreases the countdown by 1 every second
			intervalId = setInterval(() => {
				setCountdown(countdown - 1);
			}, 1000);
		}

		// Return a cleanup function that clears the timer when the component unmounts
		return () => {
			// If the timer ID is defined, clear the timer
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [countdown]); // This effect depends on the countdown variable

	return (
		<div className="w-full">
			{loading ? (
				<CircularProgress />
			) : (
				<div className="flex flex-col m-auto w-full xl:w-4/5 2xl:w-2/3 h-full p-5 bg-gray-100">
					<div>
						<h1 className="text-2xl pb-5 font-bold">
							{courseName} - {courseCode} - {topicname} -{' '}
							{countdown !== null
								? `${Math.floor(countdown / 60)} minutes ${countdown % 60} seconds`
								: 'Loading...'}
						</h1>
					</div>
					<div className="flex flex-col-reverse sm:flex-row justify-between items-start">
						<div className="flex sm:flex-row items-center flex-col-reverse w-full ">
							{!hashDataReceived ? (
								<div className="flex items-center justify-center w-full h-full">
									<CircularProgress />
								</div>
							) : (
								<QRCode
									size={256}
									value={hashValue}
									viewBox={`0 0 256 256`}
									className="w-full 2xl:w-[50em] sm:w-[20em] lg:w-full h-full"
								/>
							)}

							<Attendees
								arrayOfStudents={arrayOfStudents}
								socket={socket}
								lectureid={lectureid}
							/>
						</div>
						<h2 className="text-2xl ml-2">
							<label className="text-metropoliaTrendGreen">
								{arrayOfStudents.length}
							</label>
							/
							<label className="text-metropoliaSupportRed">
								{courseStudents.length}
							</label>
						</h2>
					</div>
					<div className="flex sm:flex-row-reverse flex-col gap-5 items-center justify-end">
						<button
							onClick={handleLectureFinished}
							className="bg-metropoliaMainOrange sm:w-fit h-fit p-2 mt-4 text-sm w-full hover:bg-metropoliaSecondaryOrange text-white font-bold rounded"
						>
							Finish Lecture
						</button>
						{lectureid && (
							<CourseStudents
								coursestudents={courseStudents}
								socket={socket}
								lectureid={lectureid}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default AttendanceRoom;
