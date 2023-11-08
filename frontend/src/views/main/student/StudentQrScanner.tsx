import {QrScanner} from '@yudiel/react-qr-scanner';
import React, {useCallback, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
const StudentQrScanner: React.FC = () => {
	const [successState, setSuccessState] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [counter, setCounter] = useState(20);
	const onNewScanResult = useCallback(
		(decodedText: string) => {
			// Handle the scan result here
			const [secureHash, classid] = decodedText.split('/');
			// Create a new socket connection if one does not already exist
			if (!socket) {
				// const newSocket = io('http://localhost:3002', {
				// 	transports: ['websocket'],
				// });
				const newSocket = io('/', {
					path: '/api/socket.io',
					transports: ['websocket'],
				});
				setSocket(newSocket);
				newSocket.on('connect', () => {
					console.log('Socket connected');
				});

				// Emit the 'inputThatStudentHasArrivedToClass' event to the server
				if (!scanned) {
					console.log('scanned');
					console.log('secureHash', secureHash);
					console.log('classid', classid);
					const studentId = Math.floor(Math.random() * 50) + 1; // replace with your student id
					const unixtime = Date.now();
					newSocket.emit(
						'inputThatStudentHasArrivedToClass',
						secureHash,
						studentId,
						unixtime,
						classid,
					);

					setScanned(true);
				}
				newSocket.on('youhavebeensavedintoclass', studentId => {
					setSuccessState(true);
					setShouldRender(false);
					console.log('You have been saved into class', studentId);
				});
				newSocket.on('inputThatStudentHasArrivedToClassTooSlow', studentId2 => {
					setSuccessState(false);
					setShouldRender(true);
					console.log('inputThatStudentHasArrivedToClassTooSlow', studentId2);
				});
			}
		},
		[scanned],
	);
	const [shouldRender, setShouldRender] = useState(true);
	const handleScanError = (error?: Error) => {
		console.log(error?.message);
	};
	const onResetClick = useCallback(() => {
		setScanned(false);
		setShouldRender(false);
		setTimeout(() => setShouldRender(true), 0);
		setSuccessState(false);
	}, []);
	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);
	useEffect(() => {
		if (successState && counter > 0) {
			const timer = setTimeout(() => setCounter(counter - 1), 1000);
			return () => clearTimeout(timer);
		}
		if (counter === 0) {
			// todo change this to the correct url
			window.location.href = 'student/qr';
		}
		// Return an empty function when there's nothing to clean up
		return () => {};
	}, [successState, counter]);
	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen">
				{successState ? (
					<p className="text-3xl font-bold mb-4">
						You can leave this site now redirecting in {counter} seconds
					</p>
				) : (
					<p className="text-3xl font-bold mb-4">Scan QR code to get attendance</p>
				)}
				<div className="flex justify-center">
					{successState && <p className="text-green-500 font-bold">Success</p>}
					{!successState && scanned && (
						<p className="text-red-500 font-bold">Failure</p>
					)}
				</div>
				{shouldRender && (
					<QrScanner onDecode={onNewScanResult} onError={handleScanError} />
				)}
			</div>
			<div className="flex justify-center">
				<button
					className="bg-blue-500 m-2 p-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={onResetClick}
				>
					Try again or reset
				</button>
			</div>
		</>
	);
};

export default StudentQrScanner;
