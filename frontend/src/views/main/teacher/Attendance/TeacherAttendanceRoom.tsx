import React, {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import io from 'socket.io-client';
const AttendanceRoom: React.FC = () => {
	const {classid} = useParams<{classid: string}>();
	const [servertime, setServertime] = useState('');
	const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<any[]>([]);

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
	return (
		<div className="flex flex-col w-full m-auto items-center justify-center h-1/2 p-10 bg-gray-100">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Attendance</h1>
			<div className="flex w-1/3 gap-10">
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
				<div className="text-md sm:text-xl mb-4">
					<h2 className="text-lg font-bold mb-2">List of Attendees:</h2>
					<p>Number of Attendees: {arrayOfStudents.length +1}</p>
					<ol className="list-decimal pl-5">
						{arrayOfStudents.map((student, index) => (
							<li key={index}>{student}</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
};

export default AttendanceRoom;
