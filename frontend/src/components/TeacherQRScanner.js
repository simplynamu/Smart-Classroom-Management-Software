// import React, { useState } from 'react';
// import QrReader from 'react-qr-reader';
// import axios from 'axios';

// const TeacherQRScanner = () => {
//   const [scannedData, setScannedData] = useState('');
//   const [message, setMessage] = useState('');

//   const handleScan = async (data) => {
//     if (data && data !== scannedData) {
//       setScannedData(data);
//       try {
//         const response = await axios.post('http://localhost:5000/attendance/mark', {
//           qrCodeValue: data,
//           // subjectId: "REPLACE_SUBJECT_ID",   // ✅ Replace dynamically later
//           teacherId: "REPLACE_TEACHER_ID"    // ✅ Replace dynamically later
//         });

//         setMessage(response.data.message);
//       } catch (error) {
//         setMessage(error.response?.data?.message || 'Failed to mark attendance');
//       }
//     }
//   };

//   const handleError = (err) => {
//     console.error("QR Scan Error: ", err);
//   };

//   return (
//     <div>
//       <h2>Scan Student QR</h2>
//       <QrReader
//         delay={300}
//         onError={handleError}
//         onScan={handleScan}
//         style={{ width: '100%' }}
//       />
//       <p>{scannedData && `Scanned: ${scannedData}`}</p>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default TeacherQRScanner;


import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const TeacherQRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleScan = async (result) => {
    if (result?.text && result.text !== scanResult) {
      const qrCodeValue = result.text;
      setScanResult(qrCodeValue);

      try {
        // Step 1: Get student by QR code
        const studentRes = await axios.get(`http://localhost:5000/Student/StudentQRScan?random=${qrCodeValue}`);
        const { _id, sclassName, school } = studentRes.data.student;

        // Step 2: Mark attendance
        const attendanceRes = await axios.post("http://localhost:5000/Attendance/mark", {
          studentId: _id,
          classId: sclassName,
          schoolId: school,
          status: "Present",
        });

        if (attendanceRes.data.success) {
          setStatusMessage("✅ Attendance marked successfully!");
        } else {
          setStatusMessage("❌ Failed to mark attendance.");
        }
      } catch (error) {
        console.error("Error during scan:", error);
        setStatusMessage("⚠️ Error occurred while marking attendance.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Scan Student QR</h2>
      <QrReader
        onResult={(result) => handleScan(result)}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%" }}
      />
      <div className="mt-4 text-green-700 font-semibold">{statusMessage}</div>
    </div>
  );
};

export default TeacherQRScanner;
