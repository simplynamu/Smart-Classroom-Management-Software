import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentNotes.css';

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [subject, setSubject] = useState('');

  const getNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes');
      console.log("Fetched notes:", res.data); // 🔍 LOG HERE

      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes.");
    }
  };
  

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = subject ? notes.filter(n => n.subject === subject) : notes;

  return (
    <div className="student-notes">
      <h2>Study Notes</h2>
      <select onChange={(e) => setSubject(e.target.value)}>
        <option value="">All Subjects</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="English">English</option>
      </select>

      {filteredNotes.length === 0 && <p>No notes available for this subject.</p>}
{/* 
      {filteredNotes.map(note => (
        <div key={note._id} className="note-card">
          <h4>{note.title} - {note.subject}</h4>
          <p>{note.description}</p>
          {note.fileUrl && <a href={/${note.fileUrl}} target="_blank" rel="noreferrer">View</a>}
        </div>
      ))} */}

{filteredNotes.map(note => (
  <div key={note._id} className="note-card">
    <h4>{note.title} - {note.subject}</h4>
    <p>{note.description}</p>
    {note.fileUrl && (
      // <a
      //   href={/${note.fileUrl.replace(/\\/g, '/')}}
      //   target="_blank"
      //   rel="noreferrer"
      // >
      // View
      // </a>
      <a href={`http://localhost:5000/${note.fileUrl.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer">View</a>
    )}
  </div>
))}

    </div>
  );
};

export default StudentNotes;