import {QrScanner} from '@yudiel/react-qr-scanner';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import io, {Socket} from 'socket.io-client';
import {UserContext} from '../../../contexts/UserContext.tsx';
/**
 * StudentQrScanner component.
 *
 * This component is responsible for scanning QR codes for students. It performs the following operations:
 *
 * 1. Sets up a QR scanner.
 * 2. Decodes the scanned QR code and splits it into a secure hash and a lecture ID.
 * 3. Validates the decoded QR code.
 * 4. Sets up a WebSocket connection.
 * 5. Sends a message to the server indicating that the student has arrived at the lecture.
 * 6. Handles server responses, including successful scan and too slow scan.
 * 7. Navigates to the main view after a successful scan.
 *
 * @returns A JSX element representing the QR scanner component.
 */
const StudentQrScanner: React.FC = () => {
	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const [scanned, setScanned] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [loading, setLoading] = useState(false);
	const onNewScanResult = useCallback(
		(decodedText: string) => {
			setLoading(true);

			const [baseUrl, secureHash, lectureid] = decodedText.split('#');
			console.log('baseUrl', baseUrl);
			console.log('secureHash', secureHash);
			console.log('lectureid', lectureid);
			if (!secureHash || !lectureid || !baseUrl) {
				toast.error('Invalid QR code');
				setLoading(false);
				return;
			}
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

				if (!scanned) {
					console.log('scanned');
					console.log('secureHash', secureHash);
					console.log('lectureid', lectureid);
					let studentId;
					if (user && user.studentnumber) {
						studentId = user.studentnumber;
					} else {
						toast.error('No student number available');
						setLoading(false);
						return;
					}

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
				newSocket.on('youHaveBeenSavedIntoLecture', lectureid => {
					toast.success(`You have been saved into ${lectureid} lecture`);
					navigate('/student/mainview');
				});
				newSocket.on('inputThatStudentHasArrivedToLectureTooSlow', studentId2 => {
					toast.error('You were too slow, try again' + studentId2);
					setScanned(false);
				});
			}
			setLoading(false);
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
		toast.error('Error scanning QR code');
	};
	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : (
				user &&
				user.studentnumber && (
					<QrScanner
						onDecode={onNewScanResult}
						onError={handleError}
						scanDelay={200}
						hideCount={true}
					/>
				)
			)}
		</>
	);
};

export default StudentQrScanner;
