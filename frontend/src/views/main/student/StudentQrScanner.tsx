import React, { useCallback } from 'react';
import Html5QrcodePlugin from '../../../components/Html5QrcodePlugin';

const StudentQrScanner: React.FC = () => {
    const onNewScanResult = useCallback((decodedText: string, decodedResult: any) => {
        // Handle the scan result here
        console.log(decodedText);
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