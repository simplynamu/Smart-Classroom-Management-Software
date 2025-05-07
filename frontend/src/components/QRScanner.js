// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';
// import axios from 'axios';

// const QRScanner = () => {
//     const [scanResult, setScanResult] = useState('');
//     const [message, setMessage] = useState('');

//     const handleScan = async (data) => {
//         if (data && data !== scanResult) {
//             setScanResult(data);
//             try {
//                 const response = await axios.post('http://localhost:5000/attendance/mark', {
//                     qrCode: data,
//                 });
//                 setMessage(response.data.message);
//             } catch (error) {
//                 setMessage(error.response?.data?.message || "Failed to mark attendance");
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("QR Scan Error:", err);
//         setMessage("QR scan error");
//     };

//     return (
//         <div style={{ textAlign: 'center' }}>
//             <h2>Teacher QR Scanner</h2>
//             <QrReader
//                 delay={300}
//                 onError={handleError}
//                 onScan={handleScan}
//                 style={{ width: '300px', margin: 'auto' }}
//             />
//             <p><strong>Scanned Code:</strong> {scanResult}</p>
//             <p><strong>Status:</strong> {message}</p>
//         </div>
//     );
// };

// export default QRScanner;


// frontend/src/components/QRScanner.js
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [message, setMessage] = useState('');
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (result) => {
        if (result?.text && isScanning) {
            setIsScanning(false); // Prevent multiple triggers
            setScanResult(result.text);

            try {
                const { studentId, classId, subjectId, schoolId } = JSON.parse(result.text);

                const res = await axios.post('http://localhost:5000/Attendance/mark', {
                    studentId,
                    classId,
                    subjectId,
                    schoolId
                });

                setMessage(res.data.message || "Attendance marked.");
            } catch (error) {
                console.error(error);
                setMessage("Error scanning or marking attendance.");
            }

            // Reset after delay to allow re-scan
            setTimeout(() => {
                setScanResult(null);
                setMessage('');
                setIsScanning(true);
            }, 4000);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Scan Student QR</Typography>
            <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
                <QrReader
                    constraints={{ facingMode: 'environment' }}
                    onResult={handleScan}
                    containerStyle={{ width: '100%' }}
                />
            </Box>
            {scanResult && (
                <>
                    <Typography variant="body1" sx={{ mt: 2 }}>Scanned: {scanResult}</Typography>
                    <Typography variant="body2" color="success.main">{message}</Typography>
                </>
            )}
        </Box>
    );
};

export default QRScanner;
