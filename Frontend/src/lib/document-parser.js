// [FRONTEND] Resume Document Text Extractor | Extracts text from plain/MD files & FlateDecode/ToUnicode PDFs via backend zlib/Gemini fallback
import { apiFetch } from "@/lib/api";

export function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function looksLikePdfMetadataNoise(text) {
    if (!text) return true;
    const markers = (
        text.match(/\/(?:Type|FontDescriptor|FlateDecode|Catalog|Pages|Creator|Producer|ModDate|CreationDate|XObject|MediaBox|Resources|Filter|Length)\b|endobj|endstream|%PDF-/g) || []
    ).length;
    if (markers >= 2) return true;
    const alphaWords = (text.match(/[A-Za-z]{2,}/g) || []).length;
    return alphaWords < 15;
}

export async function extractTextFromFile(file) {
    const fileName = file.name;
    const fileSizeFormatted = formatFileSize(file.size);
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    // 1. Plain text and markdown files
    if (["txt", "md", "csv", "json", "rtf"].includes(extension)) {
        try {
            const text = await file.text();
            const cleaned = cleanExtractedText(text);
            return {
                success: true,
                text: cleaned,
                wordCount: countWords(cleaned),
                characterCount: cleaned.length,
                fileName,
                fileSizeFormatted,
            };
        } catch (err) {
            return {
                success: false,
                text: "",
                wordCount: 0,
                characterCount: 0,
                fileName,
                fileSizeFormatted,
                warning: `Could not read text file: ${err.message}`,
            };
        }
    }

    // 2. PDF Files: try uncompressed BT/ET locally first, then server-side FlateDecode zlib + ToUnicode CMap + Gemini PDF OCR
    if (extension === "pdf") {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const localText = cleanExtractedText(extractUncompressedBtBlocks(arrayBuffer));
            if (localText.length >= 120 && !looksLikePdfMetadataNoise(localText)) {
                return {
                    success: true,
                    text: localText,
                    wordCount: countWords(localText),
                    characterCount: localText.length,
                    fileName,
                    fileSizeFormatted,
                };
            }

            // Use backend Node zlib / CMap / Gemini multimodal PDF extractor for compressed PDFs (LaTeX, Word, Chrome)
            const pdfBase64 = arrayBufferToBase64(arrayBuffer);
            const res = await apiFetch("/api/ai-resume-analyser/parse-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdfBase64, fileName }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success && data.text) {
                const cleaned = cleanExtractedText(data.text);
                if (!looksLikePdfMetadataNoise(cleaned)) {
                    return {
                        success: true,
                        text: cleaned,
                        wordCount: countWords(cleaned),
                        characterCount: cleaned.length,
                        fileName,
                        fileSizeFormatted,
                        method: data.method,
                    };
                }
            }

            return {
                success: false,
                text: "",
                wordCount: 0,
                characterCount: 0,
                fileName,
                fileSizeFormatted,
                warning:
                    data.error ||
                    "Could not extract readable text from this PDF (it may be image-only or encrypted). Please paste your resume text into the preview box below.",
            };
        } catch {
            return {
                success: false,
                text: "",
                wordCount: 0,
                characterCount: 0,
                fileName,
                fileSizeFormatted,
                warning: "Could not parse PDF content. Please paste your resume text directly below.",
            };
        }
    }

    // 3. Fallback for other plain formats
    try {
        const raw = await file.text();
        const cleaned = cleanExtractedText(raw);
        if (cleaned.length > 30 && !looksLikePdfMetadataNoise(cleaned)) {
            return {
                success: true,
                text: cleaned,
                wordCount: countWords(cleaned),
                characterCount: cleaned.length,
                fileName,
                fileSizeFormatted,
            };
        }
    } catch {
        // Ignore fallback failure
    }

    return {
        success: false,
        text: "",
        wordCount: 0,
        characterCount: 0,
        fileName,
        fileSizeFormatted,
        warning: `Unsupported file format (.${extension}). Please paste your resume text directly or upload a .pdf / .txt file.`,
    };
}

function extractUncompressedBtBlocks(buffer) {
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(bytes);
    const textSegments = [];
    const btBlocks = rawString.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
        for (const match of tjMatches) {
            const inner = match.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
            if (inner.trim().length > 0) textSegments.push(unescapePdfString(inner));
        }
        const tjArrayMatches = block.match(/\[(.*?)\]\s*TJ/g) || [];
        for (const match of tjArrayMatches) {
            const stringsInArray = match.match(/\((.*?)\)/g) || [];
            for (const s of stringsInArray) {
                const inner = s.replace(/^\(/, "").replace(/\)$/, "");
                if (inner.trim().length > 0) textSegments.push(unescapePdfString(inner));
            }
        }
    }
    return textSegments.join(" ");
}

function unescapePdfString(str) {
    return str
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\b/g, "")
        .replace(/\\f/g, "")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\");
}

function cleanExtractedText(text) {
    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n\s*\n+/g, "\n\n")
        .trim();
}

function countWords(str) {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).length;
}
