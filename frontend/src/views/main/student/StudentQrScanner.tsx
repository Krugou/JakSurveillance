import {QrScanner} from '@yudiel/react-qr-scanner';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import io, {Socket} from 'socket.io-client';
import {UserContext} from '../../../contexts/UserContext.tsx';
const StudentQrScanner: React.FC = () => {
	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const [scanned, setScanned] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const onNewScanResult = useCallback(
		(decodedText: string) => {
			// Handle the scan result here
			const [secureHash, lectureid] = decodedText.split('/');
			// Create a new socket connection if one does not already exist
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

				// Emit the 'inputThatStudentHasArrivedToLecture' event to the server
				if (!scanned) {
					console.log('scanned');
					console.log('secureHash', secureHash);
					console.log('lectureid', lectureid);
					let studentId;
					if (user && user.studentnumber) {
						studentId = user.studentnumber;
					}
					console.log('🚀 ~ file: StudentQrScanner.tsx:41 ~ studentId:', studentId);

					const unixtime = Date.now();
					newSocket.emit(
						'inputThatStudentHasArrivedToLecture',
						secureHash,
						studentId,
						unixtime,
						lectureid,
					);

					setScanned(true);
				}
				newSocket.on('youhavebeensavedintolecture', studentId => {
					toast.success(`You have been saved into ${lectureid} lecture`);
					console.log('You have been saved into lecture', studentId);
					toast.success('redirecting to mainview');
					navigate('/student/mainview');
				});
				newSocket.on('inputThatStudentHasArrivedToLectureTooSlow', studentId2 => {
					toast.error('You were too slow, try again');
					console.log('inputThatStudentHasArrivedToLectureTooSlow', studentId2);
				});
			}
		},
		[scanned],
	);

	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	const handleError = (error: any) => {
		console.log('error', error);
	};
	return (
		<>
			{user && user.studentnumber && (
				<QrScanner
					onDecode={onNewScanResult}
					onError={handleError}
					scanDelay={200}
					hideCount={false}
				/>
			)}
		</>
	);
};

export default StudentQrScanner;
