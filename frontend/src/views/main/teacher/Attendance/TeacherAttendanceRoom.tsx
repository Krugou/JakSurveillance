import React, {useContext, useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import io, {Socket} from 'socket.io-client';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import Attendees from '../../../../components/main/course/attendance/Attendees';
import CourseStudents from '../../../../components/main/course/attendance/CourseStudents';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
const AttendanceRoom: React.FC = () => {
	const {user} = useContext(UserContext);
	const {lectureid} = useParams<{lectureid: string}>();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<string[]>([]);
	const [courseStudents, setCourseStudents] = useState<Student[]>([]);
	const [serverMessage, setServerMessage] = useState('');
	const [countdown, setCountdown] = useState<null | number>(null);
	const [courseName, setCourseName] = useState('');
	const [courseCode, setCourseCode] = useState('');
	const [topicname, setTopicname] = useState('');

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

		apiHooks
			.getLectureInfo(lectureid, token)

			.then(info => {
				setCourseCode(info.code);
				setCourseName(info.name);
				setTopicname(info.topicname);
				toast.success('Lecture info retrieved successfully');
			})
			.catch(error => {
				console.error('Error getting lecture info:', error);
				toast.error('Error getting lecture info');
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
					console.log('lecture started: ' + checklectureid + timeout);
					setCountdown(timeout / 1000); // convert milliseconds to seconds
				}
			});
			newSocket.on('getallstudentsinlecture', courseStudents => {
				setCourseStudents(courseStudents);
			});
			newSocket.on('updatecoursestudents', courseStudents => {
				console.log(
					'🚀 ~ file: TeacherAttendanceRoom.tsx:54 ~ useEffect ~ courseStudents:',
					courseStudents,
				);
				setCourseStudents(courseStudents);
			});
			newSocket.on(
				'updateAttendanceCollectionData',
				(
					hash,
					changeTime,
					lectureid,
					servertime,
					arrayOfStudents,
					courseStudents,
				) => {
					setHashValue(hash + '/' + lectureid);
					setArrayOfStudents(arrayOfStudents);
					setServerMessage(
						' change time: ' +
							changeTime +
							' lectureid: ' +
							lectureid +
							' server time: ' +
							servertime,
					);
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

		if (countdown > 0) {
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
			<div className="flex flex-col w-full xl:w-4/5 2xl:w-3/4 h-full p-5 bg-gray-100">
				<div>
					<h1 className="text-4xl font-bold">
						{courseName} - {courseCode} - {topicname} - {Math.floor(countdown / 60)}{' '}
						minutes {countdown % 60} seconds
					</h1>
				</div>
				<div className="flex flex-col-reverse sm:flex-row justify-between items-start">
					<div className="flex sm:flex-row items-center flex-col-reverse w-full ">
						<QRCode
							size={256}
							value={hashValue}
							viewBox={`0 0 256 256`}
							className="md:w-[32em] w-full h-full"
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
				<button
					onClick={handleLectureFinished}
					className="bg-metropoliaMainOrange sm:w-fit w-full mt-5 p-5 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 px-4 rounded"
				>
					Finish Lecture
				</button>
				<CourseStudents coursestudents={courseStudents} />
				<div className="flex flex-col ">
					<div className="h-auto mx-auto max-w-10 w-full">{serverMessage}</div>
				</div>
			</div>
		</BackgroundContainer>
	);
};

export default AttendanceRoom;
