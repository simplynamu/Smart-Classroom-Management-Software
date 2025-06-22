const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  fileUrl: String,
  uploadedBy: String,
});

module.exports = mongoose.model('Note', noteSchema);