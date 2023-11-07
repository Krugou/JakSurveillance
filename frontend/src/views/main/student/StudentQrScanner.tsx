import {QrScanner} from '@yudiel/react-qr-scanner';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
const StudentQrScanner: React.FC = () => {
	const [successState, setSuccessState] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

	const onNewScanResult = useCallback(
		(decodedText: string) => {
			// Handle the scan result here
			const [secureHash, classid] = decodedText.split('/');
			// Create a new socket connection if one does not already exist
			if (!socket) {
				const newSocket = io('http://localhost:3002', {
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
					console.log('inputThatStudentHasArrivedToClassTooSlow', studentId2);
				});
			}
		},
		[scanned],
	);
	const [shouldRender, setShouldRender] = useState(true);
	const handleScanError: OnErrorFunction = (error?: Error) => {
		setSuccessState(false);
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
	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen">
				<p className="text-3xl font-bold mb-4">Scan QR code to get attendance</p>
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
