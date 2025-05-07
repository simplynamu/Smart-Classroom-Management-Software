import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCode } from 'qrcode.react';

const QRCodeGenerator = ({ studentId }) => {
  const [qrValue, setQRValue] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Student/StudentQR?studentId=${studentId}`
        );
        if (response.data.success) {
          setQRValue(response.data.qrCode.toString());
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    };

    fetchQRCode();
  }, [studentId]);

  return (
    <div>
      <h2>Student QR Code</h2>
      {qrValue ? (
        <>
          <QRCode value={qrValue} size={200} />
          <p>Code: {qrValue}</p>
        </>
      ) : (
        <p>Generating QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
