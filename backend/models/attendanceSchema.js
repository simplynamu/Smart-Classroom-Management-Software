const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: false
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
        default: 'Present'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);


// my
// const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//     studentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'student',
//         required: true
//     },
//     classId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'sclass',
//         required: true
//     },
//     subjectId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'subject',
//         required: true
//     },
//     schoolId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'admin',
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true,
//         default: () => new Date(new Date().setHours(0, 0, 0, 0)) // 🕒 Only date (no time)
//     },
//     status: {
//         type: String,
//         enum: ['Present', 'Absent'],
//         required: true,
//         default: 'Present'
//     },
//     scannedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'teacher',
//         default: null // 🧑‍🏫 So we know which teacher scanned it
//     }
// }, {
//     timestamps: true
// });

// // ⚠️ To prevent duplicate attendance for same student, same subject, same day
// attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

// module.exports = mongoose.model('Attendance', attendanceSchema);
