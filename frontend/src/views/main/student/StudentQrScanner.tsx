import {QrScanner} from '@yudiel/react-qr-scanner';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import {UserContext} from '../../../contexts/UserContext.tsx';
const StudentQrScanner: React.FC = () => {
	const {user} = useContext(UserContext);
	const [successState, setSuccessState] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [counter, setCounter] = useState(20);
	const [errorMessage, setErrorMessage] = useState('Error');
	console.log('errorMessage', errorMessage);
	const onNewScanResult = useCallback(
		(decodedText: string) => {
			// Handle the scan result here
			const [secureHash, classid] = decodedText.split('/');
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

				// Emit the 'inputThatStudentHasArrivedToClass' event to the server
				if (!scanned) {
					console.log('scanned');
					console.log('secureHash', secureHash);
					console.log('classid', classid);
					let studentId;

					studentId = user.studentnumber;
					console.log('🚀 ~ file: StudentQrScanner.tsx:41 ~ studentId:', studentId);

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
			window.location.href = 'mainview';
		}
		// Return an empty function when there's nothing to clean up
		return () => {};
	}, [successState, counter]);
	const handleError = (error: any) => {
		console.log('error', error);
		setErrorMessage(error.message);
	};
	return (
		<>
			{user && user.studentnumber && (
				<div className="flex flex-col items-center justify-center w-1/2 m-auto  ">
					{successState ? (
						<p className="text-3xl font-bold mb-4">
							You can leave this site now redirecting in {counter} seconds
						</p>
					) : (
						<p className="text-xl font-bold mb-4">Scan QR code to get attendance</p>
					)}
					<div className="flex justify-center">
						{successState && <p className="text-green-500 font-bold">Success</p>}
						{!successState && scanned && (
							<p className="text-red-500 font-bold">Failure</p>
						)}
					</div>

					{shouldRender && (
						<QrScanner
							onDecode={onNewScanResult}
							onError={handleError}
							scanDelay={2000}
							hideCount={false}
						/>
					)}

					<button
						className="bg-blue-500 m-2 p-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={onResetClick}
					>
						Try again or reset
					</button>
				</div>
			)}
		</>
	);
};

export default StudentQrScanner;
