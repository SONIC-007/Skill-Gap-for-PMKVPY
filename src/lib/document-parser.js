/**
 * Document extraction helper for candidate resumes & credentials.
 * Extracts clean textual content from text, markdown, and standard text-based PDF streams.
 */
export function formatFileSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
/**
 * Robust client-side text extraction from File object
 */
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
        }
        catch (err) {
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
    // 2. PDF Files
    if (extension === "pdf") {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const extractedText = extractTextFromPdfArrayBuffer(arrayBuffer);
            if (extractedText && extractedText.trim().length > 40) {
                const cleaned = cleanExtractedText(extractedText);
                return {
                    success: true,
                    text: cleaned,
                    wordCount: countWords(cleaned),
                    characterCount: cleaned.length,
                    fileName,
                    fileSizeFormatted,
                };
            }
            else {
                return {
                    success: false,
                    text: "",
                    wordCount: 0,
                    characterCount: 0,
                    fileName,
                    fileSizeFormatted,
                    warning: "This PDF appears to be a scanned image or uses encrypted font streams. Please copy and paste your resume text directly into the editor for accurate AI extraction.",
                };
            }
        }
        catch (err) {
            return {
                success: false,
                text: "",
                wordCount: 0,
                characterCount: 0,
                fileName,
                fileSizeFormatted,
                warning: "Could not parse PDF content. Please paste the resume text directly.",
            };
        }
    }
    // 3. Fallback for other files
    try {
        const raw = await file.text();
        const cleaned = cleanExtractedText(raw);
        if (cleaned.length > 30) {
            return {
                success: true,
                text: cleaned,
                wordCount: countWords(cleaned),
                characterCount: cleaned.length,
                fileName,
                fileSizeFormatted,
            };
        }
    }
    catch {
        // Ignore fallback failure
    }
    return {
        success: false,
        text: "",
        wordCount: 0,
        characterCount: 0,
        fileName,
        fileSizeFormatted,
        warning: `Unsupported file format (.${extension}). Please paste your resume text directly or upload a .txt / text-based .pdf document.`,
    };
}
/**
 * Extracts readable ASCII & UTF-8 text strings from PDF stream bytes
 */
function extractTextFromPdfArrayBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(bytes);
    const textSegments = [];
    // Match PDF text objects: BT ... ET blocks
    const btBlocks = rawString.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btBlocks) {
        // Look for (Text) Tj or [ (Text) ... ] TJ operators
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || [];
        for (const match of tjMatches) {
            const inner = match.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
            if (inner.trim().length > 0) {
                textSegments.push(unescapePdfString(inner));
            }
        }
        const tjArrayMatches = block.match(/\[(.*?)\]\s*TJ/g) || [];
        for (const match of tjArrayMatches) {
            const stringsInArray = match.match(/\((.*?)\)/g) || [];
            for (const s of stringsInArray) {
                const inner = s.replace(/^\(/, "").replace(/\)$/, "");
                if (inner.trim().length > 0) {
                    textSegments.push(unescapePdfString(inner));
                }
            }
        }
    }
    // Fallback: If BT blocks didn't yield enough, look for plain alphanumeric sentence chunks
    if (textSegments.join(" ").length < 60) {
        const chunks = rawString.match(/[A-Za-z0-9,.:;@_\-/\s]{8,}/g) || [];
        const validChunks = chunks
            .map((c) => c.trim())
            .filter((c) => c.length > 15 && !c.includes("<<") && !c.includes(">>") && !c.includes("obj"));
        return validChunks.join("\n");
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
    return text
        .replace(/\r\n/g, "\n")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // remove control characters
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n\s*\n+/g, "\n\n")
        .trim();
}
function countWords(str) {
    if (!str.trim())
        return 0;
    return str.trim().split(/\s+/).length;
}
