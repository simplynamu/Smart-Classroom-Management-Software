// const Attendance = require('../models/attendanceSchema');

// exports.markAttendance = async (req, res) => {
//     const { studentId, classId, subjectId, schoolId } = req.body;

//     try {
//         const today = new Date();
//         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//         // Check if attendance already exists for today
//         const alreadyMarked = await Attendance.findOne({
//             studentId,
//             classId,
//             subjectId,
//             schoolId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });

//         if (alreadyMarked) {
//             return res.status(400).json({ message: "Attendance already marked for today." });
//         }

//         const attendance = new Attendance({
//             studentId,
//             classId,
//             subjectId,
//             schoolId,
//             date: new Date(),
//             status: "Present"
//         });

//         await attendance.save();

//         res.status(200).json({ message: "Attendance marked successfully." });
//     } catch (error) {
//         console.error("Attendance error:", error);
//         res.status(500).json({ message: "Failed to mark attendance." });
//     }
// };




// mine
// const Attendance = require('../models/attendanceSchema');
// const Student = require('../models/studentSchema'); // Needed to fetch QR code fields

// exports.markAttendance = async (req, res) => {
//     const { qrCode, classId, subjectId, schoolId } = req.body;

//     try {
//         if (!qrCode) {
//             return res.status(400).json({ message: "QR Code is required." });
//         }

//         // ✅ Find student with matching QR code
//         const student = await Student.findOne({ qrCodeValue: qrCode });

//         if (!student) {
//             return res.status(404).json({ message: "Invalid or expired QR code." });
//         }

//         const now = new Date();

//         // ✅ Check QR expiration
//         if (!student.qrCodeExpiresAt || student.qrCodeExpiresAt < now) {
//             return res.status(400).json({ message: "QR code has expired." });
//         }

//         // ✅ Check if attendance already marked for today
//         const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(now.setHours(23, 59, 59, 999));

//         const alreadyMarked = await Attendance.findOne({
//             studentId: student._id,
//             classId,
//             subjectId,
//             schoolId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });

//         if (alreadyMarked) {
//             return res.status(400).json({ message: "Attendance already marked for today." });
//         }

//         // ✅ Mark attendance
//         const attendance = new Attendance({
//             studentId: student._id,
//             classId,
//             subjectId,
//             schoolId,
//             date: new Date(),
//             status: "Present"
//         });

//         await attendance.save();

//         // ✅ Invalidate the QR code after use
//         student.qrCodeValue = null;
//         student.qrCodeExpiresAt = null;
//         await student.save();

//         res.status(200).json({ message: "Attendance marked successfully." });

//     } catch (error) {
//         console.error("Attendance marking failed:", error);
//         res.status(500).json({ message: "Internal server error while marking attendance." });
//     }
// };

const Attendance = require('../models/attendanceSchema.js');
const Student = require('../models/studentSchema.js');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, schoolId } = req.body;

    if (!studentId || !classId || !schoolId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    const existingRecord = await Attendance.findOne({
      studentId,
      classId,
      schoolId,
      date: today,
    });

    if (existingRecord) {
      return res.status(409).json({ success: false, message: "Attendance already marked for today" });
    }

    const newAttendance = new Attendance({
      studentId,
      classId,
      schoolId,
      date: today,
      status: 'Present',
    });

    await newAttendance.save();

    res.status(201).json({ success: true, message: "Attendance marked successfully" });

  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
