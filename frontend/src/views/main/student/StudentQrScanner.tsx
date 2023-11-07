import React, {useCallback, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import Html5QrcodePlugin from '../../../components/Html5QrcodePlugin';

const StudentQrScanner: React.FC = () => {
	const socketRef = useRef<Socket | null>(null);
	const [scanned, setScanned] = useState(false);

	const onNewScanResult = useCallback(
		(decodedText: string) => {
			// Handle the scan result here
			console.log(decodedText);

			// Create a new socket connection if one does not already exist
			if (!socketRef.current) {
				socketRef.current = io('http://localhost:3002/');
				socketRef.current.on('connect', () => {
					console.log('Socket connected');
				});
			}

			// Emit the 'inputThatStudentHasArrivedToClass' event to the server
			if (!scanned) {
				const secureHash = decodedText; // replace with your secure hash
				const studentId = '123123'; // replace with your student id
				const unixtime = Date.now();
				const classid = '456456'; // replace with your class id
				socketRef.current.emit(
					'inputThatStudentHasArrivedToClass',
					secureHash,
					studentId,
					unixtime,
					classid,
				);
				console.log('ok');
				setScanned(true);
			}
		},
		[scanned],
	);

	return (
		<div>
			<Html5QrcodePlugin
				fps={10}
				qrbox={250}
				disableFlip={false}
				qrCodeSuccessCallback={onNewScanResult}
				aspectRatio={1}
			/>
		</div>
	);
};

export default StudentQrScanner;
