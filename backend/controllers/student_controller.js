const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Attendance = require('../models/attendanceSchema');


// mine 
 const generateQRCode = async (req, res) => {
     try {
       const { studentId } = req.query; // Assuming you're sending studentId in the request body
  
       if (!studentId) {
         return res.status(400).json({ success: false, message: "Student ID is required" });
       }
  
       const qrCodeValue = Math.floor(Math.random() * 1000000);  //Random 6-digit number
       console.log("Generated QR:", qrCodeValue);
  
       const updatedStudent = await Student.findByIdAndUpdate(
         studentId,
         { qrCodeValue: qrCodeValue.toString() },
         { new: true }
       );
  
       if (!updatedStudent) {
         return res.status(404).json({ success: false, message: "Student not found" });
       }
  
       res.status(200).json({ success: true, qrCodeValue: qrCodeValue });
     } catch (error) {
       console.error("QR Error:", error);
       res.status(500).json({ success: false, error: error.message });
     }
};

// mine -chetan get id's  from api

// Get student data by random QR code number

// const getStudentByRandomNumber = async (req, res) => {
//   try {
//     const { random } = req.query;

//     if (!random) {
//       return res.status(400).json({ success: false, message: "Random number is required" });
//     }

//     const student = await Student.findOne({ qrCodeValue: random });

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     res.status(200).json({ success: true, student });
//   } catch (error) {
//     console.error("Error scanning QR:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


const getStudentByRandomNumber = async (req, res) => {
  try {
    const { random } = req.query;

    if (!random) {
      return res.status(400).json({ success: false, message: "Random number is required" });
    }

    const student = await Student.findOne({ qrCodeValue: random });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Only send selected fields
    const filteredStudent = {
      _id: student._id,
      name: student.name,
      sclassName: student.sclassName,
      school: student.school,
      qrCodeValue: student.qrCodeValue,
      qrCodeExpiresAt: student.qrCodeExpiresAt
    };

    res.status(200).json({ success: true, student: filteredStudent });
  } catch (error) {
    console.error("Error finding student by QR code:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};





const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// const generateQRCode = async (req, res) => {
//     const studentId = req.user._id; // from authMiddleware

//     try {
//         const randomCode = Math.random().toString(36).substring(2, 10);
//         const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds from now

//         const student = await Student.findByIdAndUpdate(
//             studentId,
//             {
//                 qrCodeValue: randomCode,
//                 qrCodeExpiresAt: expiresAt
//             },
//             { new: true }
//         );

//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         return res.status(200).json({
//             qrCode: randomCode,
//             expiresAt: student.qrCodeExpiresAt
//         });

//     } catch (error) {
//         console.error("QR Generation Error:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };



const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    generateQRCode,
    getStudentByRandomNumber,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};