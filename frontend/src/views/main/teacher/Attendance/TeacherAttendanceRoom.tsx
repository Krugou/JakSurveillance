import React, {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import Attendees from '../../../../components/main/course/attendance/Attendees';
const AttendanceRoom: React.FC = () => {
	const {classid} = useParams<{classid: string}>();
	const [servertime, setServertime] = useState('');
	const [socket, setSocket] = useState<Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<string[]>([]);

	const [hashValue, setHashValue] = useState('');

	useEffect(() => {
		if (!socket) {
			const newSocket = io('http://localhost:3002', {
				transports: ['websocket'],
			});
			setSocket(newSocket);
			newSocket.on('connect', () => {
				console.log('Socket connected');
			});

			newSocket.emit('getCurrentHashForQrGenerator', classid);
			newSocket.on(
				'getCurrentHashForQrGeneratorServingHashAndChangeTime',
				(hash, changeTime, classid, servertime, arrayOfStudents) => {
					console.log('changetime', changeTime);
					setHashValue(hash + '/' + classid);
					setArrayOfStudents(arrayOfStudents);

					setServertime(
						new Date(servertime).toLocaleString(undefined, {
							dateStyle: 'full',
							timeStyle: 'medium',
						}),
					);
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
	const arrayOfStudentstest = ['test1', 'test2'];
	return (
		<div className="flex flex-col w-full m-auto items-center justify-center h-full p-10 bg-gray-100">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Attendance</h1>
			<div className="flex w-1/2 gap-10">
				<div className="flex flex-col w-2/3">
					<div className="h-auto mx-auto max-w-10 w-full">
						<QRCode
							size={256}
							style={{height: 'auto', maxWidth: '100%', width: '100%'}}
							value={hashValue}
							viewBox={`0 0 256 256`}
						/>
					</div>
					{servertime && <p className="text-sm">Server time: {servertime}</p>}
				</div>
				<Attendees arrayOfStudents={arrayOfStudents} />
				<Attendees arrayOfStudents={arrayOfStudentstest} />
			</div>
		</div>
	);
};

export default AttendanceRoom;
