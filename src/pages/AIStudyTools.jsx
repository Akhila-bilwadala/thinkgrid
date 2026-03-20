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
    const [phase, setPhase] = useState('idle'); // idle | dragging | ready | generating | done
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
        return ['pdf', 'ppt', 'pptx'].includes(ext);
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

    const handleGenerate = () => {
        setPhase('generating');
        setProgress(0);
        setActiveLine(0);

        // Animate progress bar over ~3.5s
        let p = 0;
        progressIntervalRef.current = setInterval(() => {
            p += Math.random() * 8 + 3;
            if (p >= 100) {
                p = 100;
                clearInterval(progressIntervalRef.current);
                setTimeout(() => {
                    setProgress(100);
                    setPhase('done');
                    setIsPlaying(true);
                    startTranscript();
                }, 400);
            }
            setProgress(Math.min(p, 100));
        }, 120);
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
                        <p className="ast-dropzone-sub">or click to browse — PDF, PPT, PPTX supported</p>
                        <div className="ast-dropzone-formats">
                            <span className="ast-fmt-tag pdf">PDF</span>
                            <span className="ast-fmt-tag ppt">PPT</span>
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
                    <button className="ast-generate-btn" onClick={handleGenerate}>
                        <Sparkles size={18} />
                        Generate Explanation &amp; Cheatsheet
                        <ChevronRight size={18} />
                    </button>
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
                <>
                    <div className="ast-section animate-up">
                        <div className="ast-section-label">
                            <span className="ast-step-num done">2</span>
                            <h2>Video Explanation</h2>
                        </div>
                        <div className="ast-video-panel">
                            <div className="ast-video-screen">
                                <div className="ast-video-bg-pattern" />
                                <div className="ast-video-center">
                                    <button
                                        className={`ast-play-btn ${isPlaying ? 'playing' : ''}`}
                                        onClick={() => setIsPlaying(p => !p)}
                                    >
                                        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                                    </button>
                                    <p className="ast-video-label">
                                        {file?.name.replace(/\.[^/.]+$/, '') || 'Document'} — AI Explanation
                                    </p>
                                </div>
                                <div className="ast-video-badge">
                                    <Sparkles size={12} /> AI Generated
                                </div>
                            </div>
                            <div className="ast-transcript">
                                <p className="ast-transcript-heading">📝 Auto Transcript</p>
                                <div className="ast-transcript-lines">
                                    {TRANSCRIPT_LINES.map((line, i) => (
                                        <p
                                            key={i}
                                            className={`ast-transcript-line ${i === activeLine ? 'active' : i < activeLine ? 'past' : ''}`}
                                        >
                                            <span className="ast-tl-num">{String(i + 1).padStart(2, '0')}</span>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Cheatsheet ── */}
                    <div className="ast-section animate-up">
                        <div className="ast-section-label">
                            <span className="ast-step-num done">3</span>
                            <h2>AI-Generated Cheatsheet</h2>
                            <div className="ast-section-actions">
                                <button className="ast-action-btn" onClick={handleReset}>
                                    <RefreshCw size={15} /> New Document
                                </button>
                                <button className="ast-action-btn primary" onClick={handleDownloadCheatsheet}>
                                    <Download size={15} /> Download
                                </button>
                            </div>
                        </div>

                        <div className="ast-cheat-header">
                            <FileText size={16} />
                            <span>{file?.name}</span>
                        </div>

                        <div className="ast-cheat-grid">
                            {CHEATSHEET_TOPICS.map((topic) => {
                                const Icon = topic.icon;
                                return (
                                    <div key={topic.id} className={`ast-cheat-card color-${topic.color}`}>
                                        <div className="ast-cheat-card-head">
                                            <div className="ast-cheat-icon">
                                                <Icon size={18} />
                                            </div>
                                            <h3 className="ast-cheat-title">{topic.title}</h3>
                                        </div>
                                        <ul className="ast-cheat-list">
                                            {topic.points.map((pt, i) => (
                                                <li key={i}>
                                                    <span className="ast-bullet" />
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
