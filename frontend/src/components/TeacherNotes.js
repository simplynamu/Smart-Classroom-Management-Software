import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeacherNotes.css';

const TeacherNotes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', subject: '', description: '', file: null });

  const getNotes = async () => {
    const res = await axios.get('http://localhost:5000/api/notes');
    setNotes(res.data);
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('subject', form.subject);
      data.append('description', form.description);
      data.append('uploadedBy', 'Teacher A'); // Replace with logged-in teacher
      data.append('file', form.file);
      await axios.post('http://localhost:5000/api/notes/upload', data);
      setForm({ title: '', subject: '', description: '', file: null });
      getNotes();
    } catch (error) {
      console.error("Error uploading note:", error);
      alert("Failed to upload note.");
    }
  };
  

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`);
    getNotes();
  };

  return (
    <div className="teacher-notes">
      <h2>Upload Notes</h2>
      <form onSubmit={handleUpload}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <select name="subject" onChange={handleChange} required>
          <option value="">Select Subject</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
        </select>
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
        <input type="file" name="file" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>

      <h3>Uploaded Notes</h3>
      {notes.map(note => (
        <div key={note._id} className="note-item">
          <h4>{note.title} {note.subject}</h4>
          <p>{note.description}</p>
          <br></br>
          {note.fileUrl && <a href={`/${note.fileUrl}`} target="_blank" rel="noreferrer"><button>Download</button></a>}
          &nbsp;&nbsp;&nbsp;
          <button onClick={() => handleDelete(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TeacherNotes;