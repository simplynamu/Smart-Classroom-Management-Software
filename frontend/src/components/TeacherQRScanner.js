import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';

const TeacherQRScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = async (data) => {
    if (data && data !== scannedData) {
      setScannedData(data);
      try {
        const response = await axios.post('http://localhost:5000/attendance/mark', {
          qrCodeValue: data,
          subjectId: "REPLACE_SUBJECT_ID",   // ✅ Replace dynamically later
          teacherId: "REPLACE_TEACHER_ID"    // ✅ Replace dynamically later
        });

        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to mark attendance');
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error: ", err);
  };

  return (
    <div>
      <h2>Scan Student QR</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{scannedData && `Scanned: ${scannedData}`}</p>
      <p>{message}</p>
    </div>
  );
};

export default TeacherQRScanner;
