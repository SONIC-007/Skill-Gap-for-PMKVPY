// [BACKEND] Pure-Node FlateDecode PDF Text Extractor + Gemini PDF Multimodal Fallback | Used by: routes/resumeAnalyser.js
import zlib from "node:zlib";

function unescapePdfString(str) {
    return String(str || "")
        .replace(/\\(\r\n|\r|\n)/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\b/g, "")
        .replace(/\\f/g, "")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\")
        .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

function decodeHexToCodePoints(hexStr) {
    const clean = hexStr.replace(/\s+/g, "");
    if (!clean) return "";
    if (clean.length >= 4 && clean.length % 4 === 0 && /^00[2-7]/.test(clean)) {
        // UTF-16BE / 2-byte glyph codes common in PDF streams
        let out = "";
        for (let i = 0; i < clean.length; i += 4) {
            const code = parseInt(clean.slice(i, i + 4), 16);
            if (code >= 32 && code <= 126) out += String.fromCharCode(code);
            else if (code === 10 || code === 13) out += "\n";
        }
        return out;
    }
    let ascii = "";
    for (let i = 0; i < clean.length; i += 2) {
        const b = parseInt(clean.slice(i, i + 2), 16);
        if (b >= 32 && b <= 126) ascii += String.fromCharCode(b);
    }
    return ascii;
}

function parseToUnicodeCmaps(streams) {
    const cmap = new Map();
    for (const text of streams) {
        if (!text.includes("begincmap") && !text.includes("beginbfchar") && !text.includes("beginbfrange")) {
            continue;
        }
        const bfCharBlocks = text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g);
        for (const block of bfCharBlocks) {
            const pairs = block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g);
            for (const pair of pairs) {
                const srcHex = pair[1].toUpperCase();
                const dstHex = pair[2];
                let decoded = "";
                for (let i = 0; i < dstHex.length; i += 4) {
                    const cp = parseInt(dstHex.slice(i, i + 4), 16);
                    if (!Number.isNaN(cp) && cp > 0) decoded += String.fromCodePoint(cp);
                }
                if (decoded) cmap.set(srcHex, decoded);
            }
        }
        const bfRangeBlocks = text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g);
        for (const block of bfRangeBlocks) {
            const ranges = block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g);
            for (const r of ranges) {
                const start = parseInt(r[1], 16);
                const end = parseInt(r[2], 16);
                const targetStart = parseInt(r[3], 16);
                const width = r[1].length;
                if (end - start <= 256) {
                    for (let code = start; code <= end; code++) {
                        const key = code.toString(16).toUpperCase().padStart(width, "0");
                        const cp = targetStart + (code - start);
                        if (cp >= 32) cmap.set(key, String.fromCodePoint(cp));
                    }
                }
            }
        }
    }
    return cmap;
}

function decodeHexUsingCmap(hexStr, cmap) {
    const clean = hexStr.replace(/\s+/g, "").toUpperCase();
    if (!clean) return "";
    if (cmap && cmap.size > 0) {
        const sampleKey = cmap.keys().next().value;
        const unit = sampleKey ? sampleKey.length : 4;
        if (clean.length % unit === 0) {
            let mapped = "";
            let hits = 0;
            for (let i = 0; i < clean.length; i += unit) {
                const chunk = clean.slice(i, i + unit);
                const ch = cmap.get(chunk);
                if (ch) {
                    mapped += ch;
                    hits++;
                }
            }
            if (hits > 0) return mapped;
        }
    }
    return decodeHexToCodePoints(clean);
}

function extractTextFromContentStreams(streams, cmap) {
    const lines = [];
    for (const content of streams) {
        const btBlocks = content.matchAll(/BT([\s\S]*?)ET/g);
        for (const blockMatch of btBlocks) {
            const block = blockMatch[1];
            const tokens = [];
            // Match (...) Tj, <hex> Tj, or [ (...) -20 <hex> ... ] TJ operators cleanly
            const opRegex = /(\[(?:[^[\]]|\([^)]*\)|<[^>]*>)*\]\s*TJ|\((?:\\.|[^\\)])*\)\s*Tj|<[0-9a-fA-F\s]+>\s*Tj|T\*|Td|TD)/g;
            for (const m of block.matchAll(opRegex)) {
                const expr = m[1].trim();
                if (expr === "T*" || expr === "Td" || expr === "TD") {
                    tokens.push("\n");
                    continue;
                }
                if (expr.endsWith("Tj")) {
                    if (expr.startsWith("<")) {
                        const innerHex = expr.slice(1, expr.lastIndexOf(">"));
                        tokens.push(decodeHexUsingCmap(innerHex, cmap));
                    } else if (expr.startsWith("(")) {
                        const inner = expr.slice(1, expr.lastIndexOf(")"));
                        tokens.push(unescapePdfString(inner));
                    }
                } else if (expr.endsWith("TJ")) {
                    const arrayBody = expr.slice(1, expr.lastIndexOf("]"));
                    const parts = arrayBody.matchAll(/\((?:\\.|[^\\)])*\)|<[0-9a-fA-F\s]+>|-?\d+(?:\.\d+)?/g);
                    for (const p of parts) {
                        const item = p[0];
                        if (item.startsWith("(")) {
                            tokens.push(unescapePdfString(item.slice(1, -1)));
                        } else if (item.startsWith("<")) {
                            tokens.push(decodeHexUsingCmap(item.slice(1, -1), cmap));
                        } else {
                            const kern = parseFloat(item);
                            if (kern < -120) tokens.push(" ");
                        }
                    }
                    tokens.push(" ");
                }
            }
            const joined = tokens.join("").replace(/[ \t]+/g, " ").trim();
            if (joined) lines.push(joined);
        }
    }
    return lines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function inflateAllPdfStreams(pdfBuffer) {
    const rawLatin1 = pdfBuffer.toString("latin1");
    const streams = [rawLatin1];
    let searchIdx = 0;

    while (searchIdx < pdfBuffer.length) {
        const streamPos = rawLatin1.indexOf("stream", searchIdx);
        if (streamPos === -1) break;

        let dataStart = streamPos + 6;
        if (rawLatin1[dataStart] === "\r" && rawLatin1[dataStart + 1] === "\n") {
            dataStart += 2;
        } else if (rawLatin1[dataStart] === "\n" || rawLatin1[dataStart] === "\r") {
            dataStart += 1;
        } else {
            searchIdx = streamPos + 6;
            continue;
        }

        const endPos = rawLatin1.indexOf("endstream", dataStart);
        if (endPos === -1) break;

        let dataEnd = endPos;
        if (rawLatin1[dataEnd - 1] === "\n") dataEnd--;
        if (rawLatin1[dataEnd - 1] === "\r") dataEnd--;

        if (dataEnd > dataStart) {
            const slice = pdfBuffer.subarray(dataStart, dataEnd);
            let decoded = null;
            try {
                decoded = zlib.inflateSync(slice).toString("latin1");
            } catch {
                try {
                    decoded = zlib.inflateRawSync(slice).toString("latin1");
                } catch {
                    decoded = slice.toString("latin1");
                }
            }
            if (decoded && decoded.length > 0) {
                streams.push(decoded);
            }
        }
        searchIdx = endPos + 9;
    }
    return streams;
}

async function extractPdfViaGemini(base64Data) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !base64Data) return "";

    const models = ["gemini-3-flash-preview", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];
    for (const model of models) {
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    signal: AbortSignal.timeout(15000),
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        inlineData: {
                                            mimeType: "application/pdf",
                                            data: base64Data,
                                        },
                                    },
                                    {
                                        text: "Extract ALL visible plain text from this resume PDF verbatim, preserving section headings (Skills, Projects, Experience, Education, Certificates) with clean line breaks. Return only the extracted resume text with no commentary.",
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0,
                        },
                    }),
                }
            );
            if (res.ok) {
                const json = await res.json();
                const out = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (out.trim().length > 80) return out.trim();
            }
        } catch {
            // Try next model cleanly
        }
    }
    return "";
}

export async function extractResumeTextFromPdfBuffer(pdfBuffer, { allowAiFallback = true } = {}) {
    if (!pdfBuffer || pdfBuffer.length === 0) {
        return { success: false, text: "", method: "none" };
    }

    const streams = inflateAllPdfStreams(pdfBuffer);
    const cmap = parseToUnicodeCmaps(streams);
    const localText = extractTextFromContentStreams(streams, cmap);

    const alphaWords = (localText.match(/[A-Za-z]{2,}/g) || []).length;
    if (localText.length >= 120 && alphaWords >= 18) {
        return {
            success: true,
            text: localText,
            method: cmap.size > 0 ? "zlib+cmap" : "zlib",
        };
    }

    if (allowAiFallback && pdfBuffer.length < 4 * 1024 * 1024) {
        const aiText = await extractPdfViaGemini(pdfBuffer.toString("base64"));
        if (aiText && aiText.length >= 80) {
            return {
                success: true,
                text: aiText,
                method: "gemini-pdf",
            };
        }
    }

    return {
        success: false,
        text: localText || "",
        method: "failed",
    };
}
