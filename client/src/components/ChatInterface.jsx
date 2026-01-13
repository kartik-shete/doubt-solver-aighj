import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Loader2, Bot, User, Mic, MicOff, Image as ImageIcon, X, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatInterface = ({ language, saveNote, handleDownloadPdf }) => {
    // ============================================
    // STATE
    // ============================================
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello! 👋 I'm your AI Doubt Solver.\n\nI can help you with B.Tech engineering questions in **${language}**.\n\n- 📝 Type your question below\n- 🎤 Use voice input\n- 📷 Upload an image of a problem\n\nLet's get started!`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // ============================================
    // REFS
    // ============================================
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // ============================================
    // SPEECH RECOGNITION
    // ============================================
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Update input when transcript changes
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    // ============================================
    // HELPERS
    // ============================================
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ============================================
    // IMAGE HANDLERS
    // ============================================
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ============================================
    // VOICE HANDLERS
    // ============================================
    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({
                continuous: true,
                language: language === 'Hinglish' ? 'hi-IN' : 'en-US'
            });
        }
    };

    // ============================================
    // SUBMIT HANDLER (OPENAI)
    // ============================================
    const handleSolve = async () => {
        if (!input.trim() && !selectedImage) return;

        // Stop listening if active
        if (listening) SpeechRecognition.stopListening();

        // Create user message
        const userMessage = {
            role: 'user',
            content: input,
            image: imagePreview
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        clearImage();
        resetTranscript();
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

            if (!apiKey) {
                throw new Error("Missing API Key");
            }

            // Construct payload for GPT-4o
            const messagesPayload = [
                {
                    role: "system",
                    content: `You are an expert B.Tech engineering tutor. Provide detailed answers in ${language}. ${language === 'Hinglish' ? 'Use a mix of Hindi and English.' : ''} Format in Markdown.`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: input || "Explain this image related to engineering." }
                    ]
                }
            ];

            // Add image if present
            if (imagePreview) {
                messagesPayload[1].content.push({
                    type: "image_url",
                    image_url: {
                        url: imagePreview
                    }
                });
            }

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: messagesPayload,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "OpenAI API Error");
            }

            const data = await response.json();
            const answer = data.choices[0].message.content;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: answer
            }]);

        } catch (error) {
            console.error('Error:', error);
            let errorMessage = '❌ Sorry, I encountered an error.';

            if (error.message.includes('Missing API Key')) {
                errorMessage = `⚠️ **Missing API Key**\n\ প্লPlease add your OpenAI API Key in Netlify Settings as \`VITE_OPENAI_API_KEY\`.`;
            } else if (error.message.includes('401')) {
                errorMessage = `⚠️ **Invalid API Key**\n\nThe key provided is incorrect or expired. Please check \`VITE_OPENAI_API_KEY\` in Netlify.`;
            } else {
                errorMessage += `\n\nDebug: ${error.message}`;
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <div
            className="glass-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                background: 'transparent',
                border: 'none',
                borderRadius: 0
            }}
        >
            {/* ============================================
          MESSAGES AREA
          ============================================ */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 'var(--space-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-lg)'
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            gap: 'var(--space-md)',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: msg.role === 'user'
                                    ? 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))'
                                    : 'linear-gradient(135deg, var(--color-primary), #60A5FA)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            {msg.role === 'user' ? <User size={20} color="white" /> : <Bot size={20} color="white" />}
                        </div>

                        {/* Message Content */}
                        <div
                            style={{
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {/* Image Preview in Message */}
                            {msg.image && (
                                <img
                                    src={msg.image}
                                    alt="Uploaded"
                                    style={{
                                        maxWidth: '200px',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-sm)',
                                        border: '1px solid var(--border-default)'
                                    }}
                                />
                            )}

                            {/* Message Bubble */}
                            <div
                                className={msg.role === 'user' ? 'message-user' : 'message-assistant'}
                                style={{ padding: 'var(--space-md) var(--space-lg)' }}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="prose">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                )}
                            </div>

                            {/* Action Buttons for Assistant Messages */}
                            {msg.role === 'assistant' && index > 0 && (
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                    <button
                                        onClick={() => handleDownloadPdf(msg.content)}
                                        className="glass-button"
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                                    >
                                        <Download size={14} /> PDF
                                    </button>
                                    <button
                                        onClick={() => saveNote(messages[index - 1]?.content || 'Image Question', msg.content)}
                                        className="glass-button"
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                                    >
                                        <Save size={14} /> Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <div
                        className="animate-fade-in"
                        style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, var(--color-primary), #60A5FA)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Bot size={20} color="white" />
                        </div>
                        <div
                            className="message-assistant"
                            style={{
                                padding: 'var(--space-md) var(--space-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)'
                            }}
                        >
                            <Loader2 size={18} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                            <span className="text-secondary">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ============================================
          INPUT AREA
          ============================================ */}
            <div
                style={{
                    padding: 'var(--space-md)',
                    borderTop: '1px solid var(--border-default)',
                    background: 'rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Image Preview */}
                {imagePreview && (
                    <div style={{ marginBottom: 'var(--space-sm)', position: 'relative', display: 'inline-block' }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                height: '60px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-default)'
                            }}
                        />
                        <button
                            onClick={clearImage}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '20px',
                                height: '20px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-error)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={12} color="white" />
                        </button>
                    </div>
                )}

                {/* Input Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-sm)',
                    border: '1px solid var(--border-default)'
                }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={listening ? '🎤 Listening...' : 'Ask a doubt...'}
                        style={{
                            width: '100%',
                            minHeight: '48px',
                            maxHeight: '120px',
                            padding: 'var(--space-sm)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            resize: 'none',
                            outline: 'none',
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            lineHeight: 1.5
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSolve();
                            }
                        }}
                    />

                    {/* Toolbar Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Image Upload */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-icon"
                                style={{ width: '32px', height: '32px', padding: '6px' }}
                                title="Add Image"
                            >
                                <ImageIcon size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageSelect}
                            />

                            {/* Voice Input */}
                            {browserSupportsSpeechRecognition && (
                                <button
                                    onClick={toggleListening}
                                    className={`btn-icon ${listening ? 'active' : ''}`}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        padding: '6px',
                                        color: listening ? 'var(--color-error)' : 'inherit'
                                    }}
                                    title="Voice Input"
                                >
                                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                            )}
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={handleSolve}
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className="btn-primary"
                            style={{
                                width: '36px',
                                height: '36px',
                                padding: '0',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
