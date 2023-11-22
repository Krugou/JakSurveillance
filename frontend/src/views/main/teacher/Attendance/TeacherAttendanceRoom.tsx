import {CircularProgress} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import io, {Socket} from 'socket.io-client';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import Attendees from '../../../../components/main/course/attendance/Attendees';
import CourseStudents from '../../../../components/main/course/attendance/CourseStudents';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
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
	const [loading, setLoading] = useState(false);

	interface Student {
		studentnumber: string;
		first_name: string;
		last_name: string;
		userid: number;
	}
	const [hashValue, setHashValue] = useState('');

	useEffect(() => {
		if (!user) {
			toast.error('No user information available');
			return;
		}

		if (!lectureid) {
			toast.error('No lecture ID provided');
			return;
		}

		const token: string | null = localStorage.getItem('userToken');

		if (!token) {
			toast.error('No token available');
			return;
		}

		// Set loading to true at the start of the data fetch
		setLoading(true);

		apiHooks
			.getLectureInfo(lectureid, token)
			.then(info => {
				if (info.state === 'closed') {
					toast.error('Lecture is already closed');
					navigate('/teacher/mainview');
					return;
				}
				setCourseCode(info.code);
				setCourseName(info.name);
				setTopicname(info.topicname);
				toast.success('Lecture info retrieved successfully');

				// Set loading to false when the data fetch is done
				setLoading(false);
			})
			.catch(error => {
				console.error('Error getting lecture info:', error);
				toast.error('Error getting lecture info');

				// Set loading to false even if there was an error
				setLoading(false);
			});
	}, [lectureid]);
	useEffect(() => {
		if (!socket) {
			const socketURL =
				import.meta.env.MODE === 'development' ? 'http://localhost:3002' : '/';
			const socketPath =
				import.meta.env.MODE === 'development' ? '' : '/api/socket.io';

			const newSocket = io(socketURL, {
				path: socketPath,
				transports: ['websocket'],
			});
			setSocket(newSocket);
			newSocket.on('connect', () => {
				console.log('Socket connected');
			});

			newSocket.emit('createAttendanceCollection', lectureid);
			newSocket.on('lecturestarted', (checklectureid, timeout) => {
				if (checklectureid === lectureid) {
					setCountdown(timeout / 1000); // convert milliseconds to seconds
				}
			});
			newSocket.on('lecturefinished', checklectureid => {
				if (checklectureid === lectureid) {
					toast.success('Lecture finished');
					navigate('/teacher/mainview');
				}
			});
			newSocket.on('getallstudentsinlecture', courseStudents => {
				setCourseStudents(courseStudents);
			});
			newSocket.on('updatecoursestudents', courseStudents => {
				setCourseStudents(courseStudents);
			});
			newSocket.on(
				'updateAttendanceCollectionData',
				(hash, lectureid, arrayOfStudents, courseStudents) => {
					setHashValue(hash + '/' + lectureid);
					setArrayOfStudents(arrayOfStudents);

					setCourseStudents(courseStudents);
				},
			);
			newSocket.on('disconnect', () => {
				console.log('Disconnected from the server');
			});
		}
	}, [lectureid]);

	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);
	const handleLectureFinished = () => {
		if (!socket) {
			toast.error('Socket is not connected');
			return;
		}

		socket.emit('lecturefinishedwithbutton', lectureid);
	};
	useEffect(() => {
		let intervalId;

		if (countdown !== null && countdown > 0) {
			intervalId = setInterval(() => {
				setCountdown(countdown - 1);
			}, 1000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [countdown]);
	return (
		<BackgroundContainer>
			{loading ? (
				<CircularProgress />
			) : (
				<div className="flex flex-col w-full xl:w-4/5 2xl:w-1/2 h-full p-5 bg-gray-100">
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
							<QRCode
								size={256}
								value={hashValue}
								viewBox={`0 0 256 256`}
								className="md:w-[20em] w-full h-full"
							/>

							<Attendees arrayOfStudents={arrayOfStudents} />
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
					<CourseStudents coursestudents={courseStudents} />
					</div>
				</div>
			)}
		</BackgroundContainer>
	);
};

export default AttendanceRoom;
