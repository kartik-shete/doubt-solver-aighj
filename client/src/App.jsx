import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import SavedNotes from './components/SavedNotes';
import { BrainCircuit, Settings as SettingsIcon, BookOpen } from 'lucide-react';
import 'regenerator-runtime/runtime';
import { API_URL } from './config';

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [language, setLanguage] = useState('English');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);

  // ============================================
  // EFFECTS
  // ============================================
  // Load notes from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('doubtSolverNotes');
    if (saved) {
      try {
        setSavedNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notes:', e);
      }
    }
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  // Save a new note
  const handleSaveNote = (question, answer) => {
    const newNote = {
      id: Date.now(),
      question: question.slice(0, 100), // Truncate long questions
      answer,
      timestamp: new Date().toISOString()
    };
    const updatedNotes = [newNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem('doubtSolverNotes', JSON.stringify(updatedNotes));
    setIsNotesOpen(true); // Show notes panel on save
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    const updatedNotes = savedNotes.filter(note => note.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem('doubtSolverNotes', JSON.stringify(updatedNotes));
  };

  // Download as PDF (Client-Side)
  const handleDownloadPdf = (content) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Doubt Solution", 20, 20);

      // Add Content
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);

      // Split text to fit page width
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, 40);

      // Save
      doc.save(`solution-${Date.now()}.pdf`);
    }).catch(err => {
      console.error("Failed to load jsPDF", err);
      alert("Failed to generate PDF. Please try again.");
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      className="app-container"
      style={{
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: 'var(--bg-dark)'
      }}
    >
      {/* Background Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(138, 180, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          right: '-200px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(197, 138, 249, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* ============================================
          HEADER
          ============================================ */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 20px rgba(138, 180, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BrainCircuit size={26} color="white" />
          </div>
          <div>
            <h1
              className="text-gradient text-heading"
              style={{ marginBottom: '2px' }}
            >
              Doubt Solver AI
            </h1>
            <p className="text-small">
              B.Tech Engineering Tutor • {language}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Saved Notes Button */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="btn-icon"
            title="Saved Notes"
            style={{ position: 'relative' }}
          >
            <BookOpen size={20} color="var(--color-secondary)" />
            {savedNotes.length > 0 && (
              <span
                className="badge"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px'
                }}
              >
                {savedNotes.length > 9 ? '9+' : savedNotes.length}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn-icon"
            title="Settings"
          >
            <SettingsIcon size={20} color="var(--text-secondary)" />
          </button>
        </div>
      </header>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <main
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          padding: '0 1rem',
          overflow: 'hidden'
        }}
      >
        <ChatInterface
          language={language}
          saveNote={handleSaveNote}
          handleDownloadPdf={handleDownloadPdf}
        />
      </main>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer
        className="text-small"
        style={{
          textAlign: 'center',
          zIndex: 10,
          opacity: 0.8,
          marginTop: 'auto',
          paddingBottom: '1rem',
          color: 'var(--text-secondary)'
        }}
      >
        Made by Kartik Shete • B.Tech Engineering Resource
      </footer>

      {/* ============================================
          MODALS & OVERLAYS
          ============================================ */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
      />

      <SavedNotes
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={savedNotes}
        deleteNote={handleDeleteNote}
        downloadPdf={handleDownloadPdf}
      />
    </div>
  );
}

export default App;
