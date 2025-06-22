const Note = require('../models/Note');
const path = require('path');
const fs = require('fs');

// Upload Note
exports.uploadNote = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // const note = new Note({
    //   title: req.body.title,
    //   description: req.body.description,
    //   subject: req.body.subject,
    //   fileUrl: /uploads/${req.file.filename},
    //   uploadedBy: req.user.id,
    // });
    const note = new Note({
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      uploadedBy: req.body.uploadedBy,
      fileUrl: req.file.path, // Ensure this field exists in the schema
    });
    const savednote = await note.save();
    console.log("Saved Note: ", savednote);
    res.status(201).json(savednote);
  } catch (err) {
    console.error('Error during note upload:', err); // Log the error for debugging
    res.status(500).json({ error: 'Error uploading note' });
  }
};

// Get Notes (filter by subject optional)
// exports.getNotes = async (req, res) => {
//   try {
//     const filter = req.query.subject ? { subject: req.query.subject } : {};
//     const notes = await Note.find(filter);
//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching notes' });
//   }
// };
// In noteController.js
exports.getNotes = async (req, res) => {
  try {
    const { subject } = req.query;
    let notes = await Note.find(subject ? { subject } : {});
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err });
  }
};


// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const filePath = path.join(__dirname, '..', note.fileUrl); // Adjusted for relative path
    fs.unlink(filePath, async (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete file from disk' });

      await Note.findByIdAndDelete(req.params.id);
      res.json({ message: 'Note and file deleted' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting note' });
  }
};