import React, { useState, useRef, useCallback } from 'react';
import {
    Upload, FileText, Play, Pause, Sparkles, ChevronRight,
    Download, RefreshCw, X, CheckCircle, BookOpen, Zap,
    Brain, Layout, Shield, BarChart, Palette, Monitor, Layers
} from 'lucide-react';
import './AIStudyTools.css';

// ── Mock cheatsheet data generator ──────────────────────────────────────────
const CHEATSHEET_TOPICS = [
    {
        id: 1, color: 'purple', icon: Brain,
        title: 'Core Concepts',
        points: [
            'Fundamental principles and definitions',
            'Key terminology and vocabulary',
            'Historical context and background',
            'Theoretical frameworks overview'
        ]
    },
    {
        id: 2, color: 'blue', icon: Layout,
        title: 'Structure & Architecture',
        points: [
            'System design patterns',
            'Component relationships',
            'Data flow diagrams',
            'Layer responsibilities'
        ]
    },
    {
        id: 3, color: 'orange', icon: Zap,
        title: 'Key Algorithms',
        points: [
            'Time complexity: O(n log n)',
            'Space complexity analysis',
            'Optimization strategies',
            'Edge case handling'
        ]
    },
    {
        id: 4, color: 'green', icon: Shield,
        title: 'Best Practices',
        points: [
            'Coding standards and conventions',
            'Error handling patterns',
            'Performance optimization tips',
            'Security considerations'
        ]
    },
    {
        id: 5, color: 'red', icon: BarChart,
        title: 'Important Formulas',
        points: [
            'Core equations and derivations',
            'Statistical measures',
            'Conversion factors',
            'Quick reference tables'
        ]
    },
    {
        id: 6, color: 'teal', icon: Layers,
        title: 'Quick Summary',
        points: [
            '3 key takeaways from this document',
            'Most frequently tested concepts',
            'Common interview questions',
            'Further reading recommendations'
        ]
    }
];

const TRANSCRIPT_LINES = [
    "Welcome! In this AI-generated explanation, we'll walk through the key concepts from your document.",
    "Starting with the foundational principles — understanding the core structure is essential before diving deeper.",
    "The architecture follows a layered approach, where each component has a clearly defined responsibility.",
    "Key algorithms in this material emphasize efficiency. Always consider time and space complexity trade-offs.",
    "Best practices highlighted include proper error handling, modular design, and consistent naming conventions.",
    "Finally, the summary section ties everything together. Focus on the bolded terms for revision.",
];

export default function AIStudyTools() {
    const [phase, setPhase] = useState('idle'); // idle | dragging | ready | selecting | generating | done
    const [selectedAction, setSelectedAction] = useState(null);
    const [aiResult, setAiResult] = useState('');
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeLine, setActiveLine] = useState(0);
    const fileInputRef = useRef(null);
    const transcriptIntervalRef = useRef(null);
    const progressIntervalRef = useRef(null);

    // Drag handlers
    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setPhase(p => p === 'idle' ? 'dragging' : p);
    }, []);

    const onDragLeave = useCallback(() => {
        setPhase(p => p === 'dragging' ? 'idle' : p);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped && isValidFile(dropped)) {
            setFile(dropped);
            setPhase('ready');
        }
    }, []);

    const isValidFile = (f) => {
        const ext = f.name.split('.').pop().toLowerCase();
        return ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt'].includes(ext);
    };

    const handleFileInput = (e) => {
        const selected = e.target.files[0];
        if (selected && isValidFile(selected)) {
            setFile(selected);
            setPhase('ready');
        }
        e.target.value = null;
    };

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileExt = (f) => f?.name.split('.').pop().toUpperCase() || 'PDF';

    const handleGenerate = async (action) => {
        setSelectedAction(action);
        setPhase('generating');
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('action', action);

        try {
            // Simulated progress while waiting for real API
            const progInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + (Math.random() * 10), 95));
            }, 300);

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/process-document`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            clearInterval(progInterval);
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to analyze document');
            }

            const data = await res.json();
            setAiResult(data.result);
            setProgress(100);
            setPhase('done');
            
        } catch (err) {
            setError(err.message);
            setPhase('ready');
        }
    };

    const startTranscript = () => {
        let line = 0;
        transcriptIntervalRef.current = setInterval(() => {
            line++;
            if (line >= TRANSCRIPT_LINES.length) {
                clearInterval(transcriptIntervalRef.current);
                setIsPlaying(false);
            } else {
                setActiveLine(line);
            }
        }, 2800);
    };

    const handleReset = () => {
        clearInterval(progressIntervalRef.current);
        clearInterval(transcriptIntervalRef.current);
        setPhase('idle');
        setFile(null);
        setProgress(0);
        setIsPlaying(false);
        setActiveLine(0);
    };

    const handleDownloadCheatsheet = () => {
        // Creates a simple text cheatsheet for download
        const content = CHEATSHEET_TOPICS.map(t =>
            `## ${t.title}\n${t.points.map(p => `  • ${p}`).join('\n')}`
        ).join('\n\n');
        const blob = new Blob([`CHEATSHEET: ${file?.name || 'Document'}\n\nGenerated by ThinkGrid AI Study Tools\n${'='.repeat(50)}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cheatsheet.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="ast-container animate-up">

            {/* ── Hero Banner ── */}
            <div className="ast-hero">
                <div className="ast-hero-glow" />
                <div className="ast-hero-content">
                    <div className="ast-hero-badge">
                        <Sparkles size={14} />
                        <span>Powered by AI</span>
                    </div>
                    <h1 className="ast-hero-title">AI Study Tools</h1>
                    <p className="ast-hero-sub">
                        Upload any PDF or PowerPoint — get an instant video explanation
                        and a structured cheatsheet in seconds.
                    </p>
                </div>
                <div className="ast-hero-icons">
                    <div className="ast-hero-icon-bubble blue"><FileText size={22} /></div>
                    <div className="ast-hero-icon-bubble purple"><Brain size={22} /></div>
                    <div className="ast-hero-icon-bubble orange"><BookOpen size={22} /></div>
                </div>
            </div>

            {/* ── Upload Section ── */}
            <div className="ast-section">
                <div className="ast-section-label">
                    <span className="ast-step-num">1</span>
                    <h2>Upload Your Document</h2>
                </div>

                {(phase === 'idle' || phase === 'dragging') && (
                    <div
                        className={`ast-dropzone ${phase === 'dragging' ? 'dragging' : ''}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            style={{ display: 'none' }}
                            onChange={handleFileInput}
                        />
                        <div className="ast-dropzone-icon">
                            <Upload size={28} />
                        </div>
                        <p className="ast-dropzone-title">
                            {phase === 'dragging' ? 'Drop it here!' : 'Drag & drop your file'}
                        </p>
                        <p className="ast-dropzone-sub">or click to browse — PDF, Word, and PPT supported</p>
                        <div className="ast-dropzone-formats">
                            <span className="ast-fmt-tag pdf">PDF</span>
                            <span className="ast-fmt-tag docx">WORD</span>
                            <span className="ast-fmt-tag pptx">PPTX</span>
                        </div>
                    </div>
                )}

                {(phase === 'ready' || phase === 'generating' || phase === 'done') && (
                    <div className="ast-file-card">
                        <div className="ast-file-icon">
                            <FileText size={24} />
                        </div>
                        <div className="ast-file-info">
                            <span className="ast-file-name">{file?.name}</span>
                            <span className="ast-file-meta">
                                <span className="ast-fmt-tag pdf">{getFileExt(file)}</span>
                                {file && <span>{formatSize(file.size)}</span>}
                            </span>
                        </div>
                        {phase === 'done'
                            ? <CheckCircle size={22} className="ast-file-done-icon" />
                            : <button className="ast-file-remove" onClick={handleReset}><X size={18} /></button>
                        }
                    </div>
                )}

                {phase === 'ready' && (
                    <div className="ast-action-grid animate-up">
                        <button className="ast-action-card summarize" onClick={() => handleGenerate('summarize')}>
                            <div className="ast-action-icon"><FileText size={20} /></div>
                            <div className="ast-action-text">
                                <strong>Summarize</strong>
                                <span>Get a high-level overview</span>
                            </div>
                        </button>
                        <button className="ast-action-card cheatsheet" onClick={() => handleGenerate('cheatsheet')}>
                            <div className="ast-action-icon"><Zap size={20} /></div>
                            <div className="ast-action-text">
                                <strong>Cheat Sheet</strong>
                                <span>Dense exam-prep guide</span>
                            </div>
                        </button>
                        <button className="ast-action-card mindmap" onClick={() => handleGenerate('mindmap')}>
                            <div className="ast-action-icon"><Brain size={20} /></div>
                            <div className="ast-action-text">
                                <strong>Mindmap</strong>
                                <span>Hierarchical concepts</span>
                            </div>
                        </button>
                        <button className="ast-action-card doubts" onClick={() => handleGenerate('resolve_doubts')}>
                            <div className="ast-action-icon"><Sparkles size={20} /></div>
                            <div className="ast-action-text">
                                <strong>Resolve Doubts</strong>
                                <span>Conversational Q&amp;A</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* ── Generating Progress ── */}
            {phase === 'generating' && (
                <div className="ast-progress-panel animate-up">
                    <div className="ast-progress-header">
                        <div className="ast-spinner" />
                        <div>
                            <p className="ast-progress-title">AI is analyzing your document…</p>
                            <p className="ast-progress-sub">Extracting concepts, building video script, generating cheatsheet</p>
                        </div>
                    </div>
                    <div className="ast-progress-track">
                        <div className="ast-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="ast-progress-steps">
                        <span className={progress > 15 ? 'done' : ''}>📄 Parsing document</span>
                        <span className={progress > 40 ? 'done' : ''}>🧠 Understanding content</span>
                        <span className={progress > 65 ? 'done' : ''}>🎬 Generating video script</span>
                        <span className={progress > 88 ? 'done' : ''}>📋 Building cheatsheet</span>
                    </div>
                </div>
            )}

            {/* ── Video Explanation ── */}
            {phase === 'done' && (
                <div className="ast-result-full animate-up">
                    <div className="ast-section-label">
                        <span className="ast-step-num done">2</span>
                        <h2>AI Analysis Result</h2>
                        <div className="ast-section-actions">
                            <button className="ast-action-btn" onClick={handleReset}>
                                <RefreshCw size={15} /> New Document
                            </button>
                            <button className="ast-action-btn primary" onClick={() => {
                                const blob = new Blob([aiResult], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement( 'a');
                                a.href = url;
                                a.download = 'ai-study-guide.txt';
                                a.click();
                            }}>
                                <Download size={15} /> Download
                            </button>
                        </div>
                    </div>
                    
                    <div className="ast-result-card">
                        <div className="ast-result-header">
                            <Sparkles size={16} />
                            <span>{selectedAction?.replace('_', ' ').toUpperCase()} Result</span>
                        </div>
                        <div className="ast-result-content">
                            <pre className="ast-markdown-pre">
                                {aiResult}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
