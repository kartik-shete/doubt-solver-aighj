import React from 'react';
import { Settings as SettingsIcon, X, Globe, Palette } from 'lucide-react';

const Settings = ({ isOpen, onClose, language, setLanguage }) => {
    if (!isOpen) return null;

    const languages = [
        { id: 'English', label: 'English', description: 'Standard technical explanations' },
        { id: 'Hinglish', label: 'Hinglish', description: 'Hindi + English mix for easy understanding' }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="backdrop"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="glass-card animate-fade-in"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '400px',
                    zIndex: 50,
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-lg)',
                        borderBottom: '1px solid var(--border-default)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <SettingsIcon size={20} color="var(--color-primary)" />
                        <h2 className="text-heading" style={{ fontSize: '1.25rem' }}>Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        style={{ width: '36px', height: '36px' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--space-lg)' }}>
                    {/* Language Selection */}
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                            <Globe size={16} color="var(--color-secondary)" />
                            <span className="text-body" style={{ fontWeight: 600 }}>Response Language</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setLanguage(lang.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--space-md)',
                                        borderRadius: 'var(--radius-md)',
                                        border: language === lang.id
                                            ? '2px solid var(--color-primary)'
                                            : '1px solid var(--border-default)',
                                        background: language === lang.id
                                            ? 'rgba(138, 180, 248, 0.1)'
                                            : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                color: language === lang.id ? 'var(--color-primary)' : 'var(--text-primary)',
                                                marginBottom: '2px'
                                            }}
                                        >
                                            {lang.label}
                                        </div>
                                        <div className="text-small">{lang.description}</div>
                                    </div>

                                    {language === lang.id && (
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--color-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div
                        style={{
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(138, 180, 248, 0.1)',
                            border: '1px solid rgba(138, 180, 248, 0.2)'
                        }}
                    >
                        <p className="text-small" style={{ color: 'var(--color-primary)' }}>
                            💡 <strong>Tip:</strong> Hinglish mode explains complex concepts using Hindi words mixed with English technical terms - perfect for GATE and semester exam preparation!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
