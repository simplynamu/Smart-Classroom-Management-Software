// import React, { useState } from 'react';
// import axios from 'axios';

// const GenerateQRButton = () => {
//     const [qrCode, setQRCode] = useState(null);

//     const handleGenerateQR = async () => {
//         const studentId = localStorage.getItem("studentId");
//         console.log("Student ID:", studentId);
//         try {
//             const res = await axios.get(`http://localhost:5000/Student/StudentQR?studentId=${studentId}`);
//             setQRCode(res.data.qrCode);
//         } catch (err) {
//             console.error("QR Code generation failed", err);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleGenerateQR}>Generate QR Code</button>
//             {qrCode && <p>Your QR Code Value: {qrCode}</p>}
//         </div>
//     );
// };

// export default GenerateQRButton;

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ Updated here

const GenerateQRButton = () => {
    const [qrValue, setQrValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateQR = async () => {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
            alert("Student ID not found.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/Student/StudentQR?studentId=${studentId}`);
            const data = response.data;

            if (data && data.qrCodeValue) {
                setQrValue(data.qrCodeValue);
            } else {
                alert("QR Code value not returned");
            }

        } catch (error) {
            console.error("Error generating QR:", error);
            alert("Error generating QR");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button onClick={handleGenerateQR} variant="contained" color="primary">
                {loading ? "Generating..." : "Generate QR Code"}
            </Button>

            {qrValue && (
                <Box mt={2}>
                    <Typography variant="h6">Scan this QR Code:</Typography>
                    <QRCodeCanvas value={qrValue.toString()} size={128} />
                </Box>
            )}
        </Box>
    );
};

export default GenerateQRButton;
