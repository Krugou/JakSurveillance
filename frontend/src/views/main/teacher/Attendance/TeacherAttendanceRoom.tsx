import React, {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import {io} from 'socket.io-client';
const socket = io('http://localhost:3002/');
const AttendanceRoom: React.FC = () => {
	const {id} = useParams<{id: string}>();
	console.log('🚀 ~ file: TeacherAttendanceRoom.tsx:8 ~ classid:', id);
	const [hashValue, setHashValue] = useState('');
	const attendees = [
		'oppilas 1',
		'Oppilas 2',
		'Oppilas 3',
		'Oppilas 4',
		'Oppilas 5',
	]; // Replaced with real data
	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected to the server:', socket.id);
		});
		socket.emit('getCurrentHashForQrGenerator');
		socket.on(
			'getCurrentHashForQrGeneratorServingHashAndChangeTime',
			(hash, changeTime) => {
				setHashValue(hash);
				// console.log(hash);
				// console.log(changeTime);
			},
		);
	}, []);
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
					<p>Date</p>
				</div>
				<div className="text-md sm:text-xl mb-4">
					<h2 className="text-lg font-bold mb-2">List of Attendees:</h2>
					<ol className="list-decimal pl-5">
						{attendees.map((attendee, index) => (
							<li key={index}>{attendee}</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
};

export default AttendanceRoom;
