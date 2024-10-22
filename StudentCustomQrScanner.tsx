import jsQR from 'jsqr';
import React, {useEffect, useRef, useState} from 'react';

const StudentCustomQrScanner = () => {
  const [qrCode, setQrCode] = useState('');
  const [zoom, setZoom] = useState(1);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({video: {facingMode: 'environment'}})
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error(err));

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    const scanQR = () => {
      context.save();
      context.scale(zoom, zoom);
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width / zoom,
        canvasRef.current.height / zoom,
      );
      context.restore();
      const imageData = context.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      if (qrCode) {
        setQrCode(qrCode.data);
      }
      requestAnimationFrame(scanQR);
    };
    scanQR();
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
  };

  return (
    <div>
      <video ref={videoRef} style={{display: 'none'}} />
      <canvas ref={canvasRef} style={{width: '100%'}} />
      <div>{qrCode}</div>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
    </div>
  );
};

export default StudentCustomQrScanner;
