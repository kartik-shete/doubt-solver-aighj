import React from 'react';
import { X, BookOpen, Trash2, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SavedNotes = ({ isOpen, onClose, notes, deleteNote, downloadPdf }) => {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="backdrop"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    maxWidth: '420px',
                    background: 'var(--bg-base)',
                    borderLeft: '1px solid var(--border-default)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform var(--transition-normal)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-lg)',
                        borderBottom: '1px solid var(--border-default)',
                        background: 'var(--bg-surface)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <BookOpen size={20} color="var(--color-secondary)" />
                        <h2 className="text-heading" style={{ fontSize: '1.25rem' }}>Saved Notes</h2>
                        <span
                            className="badge"
                            style={{ marginLeft: 'var(--space-sm)' }}
                        >
                            {notes.length}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        style={{ width: '36px', height: '36px' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Notes List */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 'var(--space-md)'
                    }}
                >
                    {notes.length === 0 ? (
                        /* Empty State */
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center',
                                padding: 'var(--space-xl)'
                            }}
                        >
                            <FileText size={48} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 'var(--space-md)' }} />
                            <h3 className="text-body" style={{ marginBottom: 'var(--space-sm)' }}>No saved notes yet</h3>
                            <p className="text-small">
                                When you find a helpful solution, click "Save" to store it here for quick access.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="glass-card animate-fade-in"
                                    style={{
                                        padding: 'var(--space-md)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    {/* Note Header */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: 'var(--space-sm)'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4
                                                className="text-body"
                                                style={{
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {note.question}
                                            </h4>
                                            <p className="text-small">
                                                {new Date(note.timestamp).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '4px', marginLeft: 'var(--space-sm)' }}>
                                            <button
                                                onClick={() => downloadPdf(note.answer)}
                                                className="btn-icon"
                                                style={{ width: '32px', height: '32px' }}
                                                title="Download PDF"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="btn-icon"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    color: 'var(--color-error)'
                                                }}
                                                title="Delete Note"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Note Content Preview */}
                                    <div
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: 'var(--space-sm)',
                                            maxHeight: '120px',
                                            overflowY: 'auto',
                                            fontSize: '12px'
                                        }}
                                    >
                                        <div className="prose" style={{ fontSize: '12px' }}>
                                            <ReactMarkdown>
                                                {note.answer.length > 300
                                                    ? note.answer.slice(0, 300) + '...'
                                                    : note.answer
                                                }
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SavedNotes;
