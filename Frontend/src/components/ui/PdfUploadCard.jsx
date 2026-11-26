"use client";
// [FRONTEND] Lavender Dashed PDF Upload Card | Inspired by user's upload UI reference
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Reusable custom SVG trio of fanned file icons matching the reference screenshot.
 */
function DocumentTrioIcon({ className = "" }) {
    return (
        <svg
            viewBox="0 0 120 74"
            fill="none"
            aria-hidden="true"
            className={`w-24 h-16 mx-auto transition-transform duration-300 group-hover:scale-105 ${className}`}
        >
            {/* Left tilted document */}
            <g transform="translate(18, 12) rotate(-14)">
                <rect x="0" y="0" width="32" height="40" rx="4" fill="#FFFFFF" stroke="#27272A" strokeWidth="1.6" />
                <path d="M21 0V11H32" stroke="#27272A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="23" r="6.5" stroke="#7367F0" strokeWidth="1.5" />
                <path d="M14.5 20.5L19 23L14.5 25.5V20.5Z" fill="#7367F0" />
            </g>

            {/* Right tilted document */}
            <g transform="translate(70, 6) rotate(13)">
                <rect x="0" y="0" width="32" height="40" rx="4" fill="#FFFFFF" stroke="#27272A" strokeWidth="1.6" />
                <path d="M21 0V11H32" stroke="#27272A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 19H22M10 24H19M10 29H16" stroke="#7367F0" strokeWidth="1.6" strokeLinecap="round" />
            </g>

            {/* Center crisp PDF/Resume document */}
            <g transform="translate(41, 8)">
                <rect x="0" y="0" width="38" height="48" rx="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
                <path d="M26 0V12H38" stroke="#18181B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 36L16.5 26L22 33L26 28.5L31 36H9Z" stroke="#7367F0" strokeWidth="1.6" strokeLinejoin="round" fill="#F3F2FF" />
                <circle cx="14.5" cy="18.5" r="2.5" stroke="#7367F0" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

export function PdfUploadCard({
    fileInputRef,
    onFileSelect,
    onFileChange,
    onTrigger,
    uploadedFileMeta,
    accept = ".pdf,.txt,.md,.rtf,.json,.csv",
    buttonLabel = "Upload",
    compact = false,
}) {
    const [dragActive, setDragActive] = useState(false);

    const handleTrigger = () => {
        if (onTrigger) {
            onTrigger();
            return;
        }
        fileInputRef?.current?.click();
    };

    return (
        <div
            className={`rounded-[24px] bg-white border border-[#ECEBFE] shadow-[0_24px_60px_-18px_rgba(115,103,240,0.24)] ${
                compact ? "p-3.5" : "p-4 sm:p-5"
            }`}
        >
            {/* Dashed Lavender Inner Drop Zone */}
            <div
                onClick={handleTrigger}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && onFileSelect) onFileSelect(file);
                }}
                className={`group rounded-[18px] border-2 border-dashed text-center transition-all duration-200 cursor-pointer ${
                    dragActive
                        ? "border-[#7367F0] bg-[#F3F2FF]"
                        : "border-[#D8D6FE] hover:border-[#7367F0] bg-[#FAFAFF] hover:bg-[#F5F4FF]/75"
                } ${compact ? "px-4 py-5" : "px-5 py-7 sm:py-8"}`}
            >
                {fileInputRef && (
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept={accept}
                        className="hidden"
                    />
                )}

                <DocumentTrioIcon className="mb-2.5" />

                <div className="font-display text-[17px] sm:text-[19px] font-bold tracking-tight text-[#1E1E24] leading-snug max-w-xs mx-auto">
                    Drag &amp; drop <span className="text-[#7367F0]">PDF</span>,{" "}
                    <span className="text-[#7367F0]">TXT</span>, or{" "}
                    <span className="text-[#7367F0]">Markdown</span> resume
                </div>

                <p className="mt-1.5 text-[12.5px] text-[#52525B]">
                    or{" "}
                    <span className="text-[#7367F0] font-medium underline underline-offset-4">
                        browse files
                    </span>{" "}
                    on your computer
                </p>

                {uploadedFileMeta && (
                    <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#A7F3D0] text-[12px] shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                        <span className="font-medium text-[#111113] truncate max-w-[180px]">
                            {uploadedFileMeta.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#52525B]">
                            ({uploadedFileMeta.size})
                        </span>
                    </div>
                )}
            </div>

            {/* Centered Violet Pill Upload Button */}
            <div className="mt-4 flex justify-center">
                <button
                    type="button"
                    onClick={handleTrigger}
                    className="px-9 py-2.5 rounded-full bg-[#7367F0] hover:bg-[#6256E5] active:scale-[0.98] text-white text-[13.5px] font-semibold tracking-tight shadow-[0_10px_24px_-6px_rgba(115,103,240,0.55)] transition-all cursor-pointer"
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
}
