import React, {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import Attendees from '../../../../components/main/course/attendance/Attendees';
import CourseStudents from '../../../../components/main/course/attendance/CourseStudents';
import apiHooks from '../../../../hooks/ApiHooks';
const AttendanceRoom: React.FC = () => {
	const {classid} = useParams<{classid: string}>();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<string[]>([]);
	const [courseStudents, setCourseStudents] = useState<Student[]>([]);
	const [serverMessage, setServerMessage] = useState('');

	interface Student {
		studentnumber: string;
		first_name: string;
		last_name: string;
		userid: number;
	}
	const [hashValue, setHashValue] = useState('');
	const handleClassFinished = () => {
		const dateToday = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const studentnumbers = courseStudents.map(student => student.studentnumber);
		if (classid) {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			apiHooks.finishClass(dateToday, studentnumbers, classid, token);
		}
	};
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

			newSocket.emit('createAttendanceCollection', classid);
			newSocket.on('getallstudentsinclass', courseStudents => {
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
					classid,
					servertime,
					arrayOfStudents,
					courseStudents,
				) => {
					setHashValue(hash + '/' + classid);
					setArrayOfStudents(arrayOfStudents);
					setServerMessage(
						' change time: ' +
							changeTime +
							' classid: ' +
							classid +
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
	}, [classid]);

	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	return (
		<div className="flex flex-col w-full h-full p-10 bg-gray-100">
			<div className="flex flex-row justify-between items-start">
				<div className="flex flex-row w-1/2 ">
					<QRCode
						size={256}
						value={hashValue}
						viewBox={`0 0 256 256`}
						className="w-1/2 h-auto "
					/>

					<Attendees arrayOfStudents={arrayOfStudents} />
				</div>
				<h2 className="text-xl">
					{arrayOfStudents.length + '/' + courseStudents.length}
				</h2>
			</div>
			<button
				onClick={handleClassFinished}
				className="bg-blue-500 p-5 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Finish class
			</button>
			<CourseStudents coursestudents={courseStudents} />
			<div className="flex flex-col ">
				<div className="h-auto mx-auto max-w-10 w-full">{serverMessage}</div>
			</div>
		</div>
	);
};

export default AttendanceRoom;
