//working qr chetan
// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import axios from "axios";
// import { Box, Typography, Button } from '@mui/material';

// const TeacherQRScanner = () => {
//   const [scanResult, setScanResult] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");

//   const handleScan = async (result) => {
//     if (result?.text && result.text !== scanResult) {
//       const qrCodeValue = result.text;
//       setScanResult(qrCodeValue);

//       try {
//         // Step 1: Get student by QR code
//         const studentRes = await axios.get(`http://localhost:5000/Student/StudentQRScan?random=${qrCodeValue}`);
//         const { _id, sclassName, school } = studentRes.data.student;

//         // Step 2: Mark attendance
//         const attendanceRes = await axios.post("http://localhost:5000/Attendance/mark", {
//           studentId: _id,
//           classId: sclassName,
//           schoolId: school,
//           status: "Present",
//         });

//         if (attendanceRes.data.success) {
//           setStatusMessage("✅ Attendance marked successfully!");
//         } else {
//           setStatusMessage("❌ Failed to mark attendance.");
//         }
//       } catch (error) {
//         console.error("Error during scan:", error);
//         setStatusMessage("⚠️ Error occurred while marking attendance.");
//       }
//     }
//   };

//   return (
//     <Box sx={{ textAlign: 'center', mt: 4 }}>
//         <Typography variant="h5" gutterBottom>Scan Student QR</Typography>
//         <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
//             <QrReader
//                 constraints={{ facingMode: 'environment' }}
//                 onResult={handleScan}
//                 containerStyle={{ width: '100%' }}
//             />
//         </Box>
//         {scanResult && (
//             <>
//                 <Typography variant="body1" sx={{ mt: 2 }}>Scanned: {scanResult}</Typography>
//                 <Typography variant="body2" color="success.main">{statusMessage}</Typography>
//             </>
//         )}
//     </Box>
//    );
// };

// export default TeacherQRScanner;



// working qr final with reloading 
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { Box, Typography, Button } from '@mui/material';

const TeacherQRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [scannerActive, setScannerActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleScan = async (result) => {
    if (scannerActive && result?.text && result.text !== scanResult) {
      setScannerActive(false); // Pause scanning
      setShowPopup(true); // Show result message

      const qrCodeValue = result.text;
      setScanResult(qrCodeValue);

      try {
        const studentRes = await axios.get(`http://localhost:5000/Student/StudentQRScan?random=${qrCodeValue}`);
        const { _id, sclassName, school } = studentRes.data.student;

        const attendanceRes = await axios.post("http://localhost:5000/Attendance/mark", {
          studentId: _id,
          classId: sclassName,
          schoolId: school,
          status: "Present",
        });

        setStatusMessage(attendanceRes.data.success ? "✅ Attendance marked successfully!" : "❌ Failed to mark attendance.");
      } catch (error) {
        setStatusMessage("⚠️ Error occurred while marking attendance.");
      }
    }
  };

  const handleScanNext = () => {
    // Refresh the page to restart scanning
    window.location.reload();
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Scan Student QR</Typography>
      <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        {scannerActive && (
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            containerStyle={{ width: '100%' }}
          />
        )}
      </Box>
      {showPopup && (
        <Box sx={{ mt: 2, p: 2, border: "1px solid", borderRadius: 2 }}>
          <Typography variant="body1">Scanned: {scanResult}</Typography>
          <Typography variant="body2" color="success.main">{statusMessage}</Typography>
          <Button variant="contained" color="primary" onClick={handleScanNext} sx={{ mt: 2 }}>
            Scan Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TeacherQRScanner;