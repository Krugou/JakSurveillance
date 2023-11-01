import React, { useCallback } from 'react';
import Html5QrcodePlugin from '../../../components/Html5QrcodePlugin';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3002/');

const StudentQrScanner: React.FC = () => {
    const onNewScanResult = useCallback((decodedText: string) => {
        // Handle the scan result here
        console.log(decodedText);

        // Emit the 'inputThatStudentHasArrivedToClass' event to the server
        const secureHash = decodedText; // replace with your secure hash
        const studentId = '123123'; // replace with your student id
        const unixtime = Date.now();
        socket.emit('inputThatStudentHasArrivedToClass', secureHash, studentId, unixtime);
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