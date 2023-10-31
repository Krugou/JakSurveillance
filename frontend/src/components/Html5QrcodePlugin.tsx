// Html5QrcodePlugin.tsx

import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useRef } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: (decodedText: string, decodedResult: unknown) => void;
    qrCodeErrorCallback?: (errorMessage: string) => void;
}

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
    const html5QrcodeScanner = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const config = {
            fps: props.fps,
            qrbox: props.qrbox,
            aspectRatio: props.aspectRatio,
            disableFlip: props.disableFlip
        };

        const verbose = props.verbose === true;

        if (!props.qrCodeSuccessCallback) {
            throw new Error("qrCodeSuccessCallback is a required callback.");
        }

        html5QrcodeScanner.current = new Html5QrcodeScanner(
            qrcodeRegionId, config, verbose);
        html5QrcodeScanner.current.render(
            props.qrCodeSuccessCallback,
            props.qrCodeErrorCallback);

        return () => {
            if (html5QrcodeScanner.current) {
                html5QrcodeScanner.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [props]);

    return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;