import React, {useCallback} from 'react';
import {io} from 'socket.io-client';
import Html5QrcodePlugin from '../../../components/Html5QrcodePlugin';
const socket = io('http://localhost:3002/');

const StudentQrScanner: React.FC = () => {
	const onNewScanResult = useCallback((decodedText: string) => {
		// Handle the scan result here
		console.log(decodedText);
		const [secureHash, classid] = decodedText.split('/');
		// Emit the 'inputThatStudentHasArrivedToClass' event to the server
		const studentId = '123123'; // replace with your student id
		const unixtime = Date.now();
		socket.emit(
			'inputThatStudentHasArrivedToClass',
			secureHash,
			studentId,
			unixtime,
			classid,
		);
	}, []);

	return (
		<div>
			<Html5QrcodePlugin
				fps={10}
				qrbox={250}
				disableFlip={false}
				qrCodeSuccessCallback={onNewScanResult}
			/>
		</div>
	);
};

export default StudentQrScanner;
