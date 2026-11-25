import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import JobRole from "@/models/JobRole";
import TrainingCourse from "@/models/TrainingCourse";

// Standard National Occupational Standards (NOS) codes mapped to skills
const SKILL_NOS_REGISTRY = {
    // Web Development (IT-ITeS SSC / NASSCOM)
    "HTML5 & Modern CSS": { nosCode: "SSC/N0501", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "JavaScript (ES6+)": { nosCode: "SSC/N0502", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    TypeScript: { nosCode: "SSC/N0503", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "React.js & Next.js": { nosCode: "SSC/N0508", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Node.js & Express": { nosCode: "SSC/N0512", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "SQL & Relational Databases": { nosCode: "SSC/N8104", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    // Data Science (IT-ITeS SSC)
    "Python for Data Analysis": { nosCode: "SSC/N2101", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Data Visualization (Tableau/PowerBI)": { nosCode: "SSC/N2104", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "Statistical Modeling & Probability": { nosCode: "SSC/N2105", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Big Data Processing (PySpark)": { nosCode: "SSC/N2108", defaultImportance: "Recommended", sector: "IT-ITeS (NASSCOM)" },
    // AI & Machine Learning
    "Machine Learning Algorithms": { nosCode: "SSC/N8101", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Deep Learning & Neural Networks": { nosCode: "SSC/N8102", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "Natural Language Processing (NLP)": { nosCode: "SSC/N8103", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "Computer Vision": { nosCode: "SSC/N8105", defaultImportance: "Recommended", sector: "IT-ITeS (NASSCOM)" },
    // Cybersecurity
    "Network Security & Protocols": { nosCode: "SSC/N0901", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Ethical Hacking & Penetration Testing": { nosCode: "SSC/N0904", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Applied Cryptography & PKI": { nosCode: "SSC/N0907", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "Incident Response & SIEM": { nosCode: "SSC/N0910", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    // Cloud Computing & DevOps
    "Cloud Architecture (AWS/Azure)": { nosCode: "SSC/N0702", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Containerization & Docker": { nosCode: "SSC/N0705", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    "Kubernetes Orchestration": { nosCode: "SSC/N0707", defaultImportance: "Required", sector: "IT-ITeS (NASSCOM)" },
    "CI/CD Pipeline Automation": { nosCode: "SSC/N0708", defaultImportance: "Mandatory", sector: "IT-ITeS (NASSCOM)" },
    // Electric Vehicle Technology (ASDC)
    "High Voltage EV Safety & ISO 6469": { nosCode: "ELE/N9801", defaultImportance: "Mandatory", sector: "Automotive (ASDC)" },
    "Battery Management Systems (BMS)": { nosCode: "ELE/N9812", defaultImportance: "Mandatory", sector: "Automotive (ASDC)" },
    "EV Powertrain & Motor Drives": { nosCode: "ELE/N9818", defaultImportance: "Mandatory", sector: "Automotive (ASDC)" },
    "CAN Bus & J1939 Vehicle Diagnostics": { nosCode: "ELE/N9815", defaultImportance: "Mandatory", sector: "Automotive (ASDC)" },
    "Thermal Runaway Mitigation": { nosCode: "ELE/N9820", defaultImportance: "Required", sector: "Automotive (ASDC)" },
};

const QP_CATALOG = {
    "web development": {
        code: "SSC/Q0508 - v2.0",
        title: "Full Stack Web Developer",
        nsqfLevel: "NSQF Level 5",
        ssc: "IT-ITeS Sector Skills Council (NASSCOM)",
    },
    "data science": {
        code: "SSC/Q2101 - v1.0",
        title: "Junior Data Analyst & Scientist",
        nsqfLevel: "NSQF Level 6",
        ssc: "IT-ITeS Sector Skills Council (NASSCOM)",
    },
    "electric vehicle technology": {
        code: "ELE/Q9802 - v2.0",
        title: "EV Powertrain & Battery Diagnostics Specialist",
        nsqfLevel: "NSQF Level 5",
        ssc: "Automotive Skills Development Council (ASDC)",
    },
    "artificial intelligence": {
        code: "SSC/Q8101 - v2.0",
        title: "AI & Machine Learning Specialist",
        nsqfLevel: "NSQF Level 7",
        ssc: "IT-ITeS Sector Skills Council (NASSCOM)",
    },
    cybersecurity: {
        code: "SSC/Q0901 - v2.0",
        title: "Cyber Security Analyst",
        nsqfLevel: "NSQF Level 5",
        ssc: "IT-ITeS Sector Skills Council (NASSCOM)",
    },
    "cloud computing": {
        code: "SSC/Q0702 - v1.0",
        title: "Cloud Infrastructure Architect & DevOps",
        nsqfLevel: "NSQF Level 6",
        ssc: "IT-ITeS Sector Skills Council (NASSCOM)",
    },
};

const SKILL_KEYWORDS_MAP = {
    "HTML5 & Modern CSS": ["html", "html5", "css", "css3", "flexbox", "grid", "tailwind", "sass", "bootstrap", "responsive design"],
    "JavaScript (ES6+)": ["javascript", "js", "es6", "es2015", "typescript", "vanilla js", "frontend"],
    TypeScript: ["typescript", "ts", "type system", "generics", "interfaces"],
    "React.js & Next.js": ["react", "react.js", "reactjs", "next.js", "nextjs", "redux", "jsx", "tsx", "hooks"],
    "Node.js & Express": ["node", "node.js", "nodejs", "express", "express.js", "backend", "api", "rest api", "fastify"],
    "SQL & Relational Databases": ["sql", "mysql", "postgresql", "postgres", "sqlite", "relational database", "queries", "joins", "prisma"],
    "Python for Data Analysis": ["python", "pandas", "numpy", "jupyter", "data analysis", "eda", "data wrangling"],
    "Data Visualization (Tableau/PowerBI)": ["tableau", "power bi", "powerbi", "matplotlib", "seaborn", "dashboard", "charts", "data visualization"],
    "Statistical Modeling & Probability": ["statistics", "probability", "statistical modeling", "hypothesis testing", "regression", "distributions"],
    "Big Data Processing (PySpark)": ["spark", "pyspark", "hadoop", "big data", "etl", "data pipeline", "databricks"],
    "Machine Learning Algorithms": ["machine learning", "ml", "scikit-learn", "sklearn", "classification", "clustering", "random forest", "svm"],
    "Deep Learning & Neural Networks": ["deep learning", "neural networks", "pytorch", "tensorflow", "keras", "cnn", "transformer", "llm"],
    "Natural Language Processing (NLP)": ["nlp", "natural language processing", "text mining", "tokenization", "embeddings", "bert", "gpt", "rag"],
    "Computer Vision": ["computer vision", "opencv", "image processing", "object detection", "yolo", "cnn"],
    "Network Security & Protocols": ["network security", "tcp/ip", "firewalls", "vpn", "ids", "ips", "wireshark", "dns", "subnets"],
    "Ethical Hacking & Penetration Testing": ["ethical hacking", "penetration testing", "pentest", "kali linux", "metasploit", "owasp", "burp suite"],
    "Applied Cryptography & PKI": ["cryptography", "encryption", "hashing", "rsa", "aes", "pki", "ssl", "tls", "certificates"],
    "Incident Response & SIEM": ["siem", "splunk", "soc", "incident response", "log analysis", "threat detection", "qradar"],
    "Cloud Architecture (AWS/Azure)": ["aws", "azure", "gcp", "cloud", "ec2", "s3", "iam", "vpc", "lambda", "cloud computing"],
    "Containerization & Docker": ["docker", "container", "containerization", "dockerfile", "docker-compose"],
    "Kubernetes Orchestration": ["kubernetes", "k8s", "helm", "pods", "ingress", "cluster management"],
    "CI/CD Pipeline Automation": ["ci/cd", "ci cd", "github actions", "jenkins", "gitlab ci", "continuous integration", "deployment pipeline"],
    "High Voltage EV Safety & ISO 6469": ["high voltage", "ev safety", "iso 6469", "nfpa 79", "electrical safety", "ppe", "arc flash"],
    "Battery Management Systems (BMS)": ["bms", "battery management", "cell balancing", "lithium-ion", "soc", "soh", "battery pack"],
    "EV Powertrain & Motor Drives": ["powertrain", "electric motor", "bldc", "pmsm", "inverter", "regenerative braking", "motor drive"],
    "CAN Bus & J1939 Vehicle Diagnostics": ["can bus", "j1939", "obd", "obd-ii", "automotive diagnostics", "telemetry", "ecu", "oscilloscope"],
    "Thermal Runaway Mitigation": ["thermal runaway", "thermal management", "cooling loop", "liquid cooling", "battery cooling", "heat sink"],
};

function findBoundedKeywordIndex(normalizedText, keyword) {
    const clean = String(keyword || "").trim().toLowerCase();
    if (!clean) return -1;
    const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-z0-9+])${escaped}(?:$|[^a-z0-9+])`, "i");
    const match = regex.exec(normalizedText);
    return match ? match.index : -1;
}

function extractSkillsFromText(text) {
    const normalized = text.toLowerCase();
    const results = [];
    for (const [skillName, keywords] of Object.entries(SKILL_KEYWORDS_MAP)) {
        let matchCount = 0;
        let foundSnippet = "";
        for (const kw of keywords) {
            const idx = findBoundedKeywordIndex(normalized, kw);
            if (idx !== -1) {
                matchCount++;
                if (!foundSnippet) {
                    const start = Math.max(0, idx - 45);
                    const end = Math.min(text.length, idx + kw.length + 55);
                    foundSnippet = "..." + text.substring(start, end).replace(/\s+/g, " ").trim() + "...";
                }
            }
        }
        if (matchCount > 0) {
            const proficiency = matchCount >= 3 ? 90 : matchCount === 2 ? 80 : 70;
            results.push({
                skillName,
                proficiency,
                snippet: foundSnippet,
            });
        }
    }
    return results;
}

function parseJobDescription(jdText) {
    const lines = jdText.split("\n").map((l) => l.trim()).filter(Boolean);
    const title = lines[0] ? lines[0].substring(0, 60) : "Corporate Job Posting";
    const detectedSkills = [];
    const normalized = jdText.toLowerCase();
    for (const [skillName, keywords] of Object.entries(SKILL_KEYWORDS_MAP)) {
        for (const kw of keywords) {
            if (findBoundedKeywordIndex(normalized, kw) !== -1) {
                if (!detectedSkills.includes(skillName)) {
                    detectedSkills.push(skillName);
                }
                break;
            }
        }
    }
    let minExp = "1-3 Years";
    if (normalized.includes("5+ years") || normalized.includes("5 years") || normalized.includes("senior")) {
        minExp = "5+ Years";
    } else if (normalized.includes("3+ years") || normalized.includes("3 years") || normalized.includes("mid-level")) {
        minExp = "3-5 Years";
    } else if (normalized.includes("fresher") || normalized.includes("entry level") || normalized.includes("0-1 year")) {
        minExp = "0-1 Year (Entry Level)";
    }
    return {
        title,
        skills: detectedSkills.length > 0
            ? detectedSkills
            : ["JavaScript (ES6+)", "React.js & Next.js", "Node.js & Express", "SQL & Relational Databases"],
        minExp,
    };
}

function isPrivateOrReservedIp(ip) {
    if (!ip) return true;
    const normalized = ip.toLowerCase();
    if (normalized === "::1" || normalized === "::" || normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) {
        return true;
    }
    const ipv4Match = normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
    if (net.isIPv4(ipv4Match)) {
        const parts = ipv4Match.split(".").map(Number);
        const [a, b] = parts;
        if (a === 0 || a === 10 || a === 127) return true;
        if (a === 169 && b === 254) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
        if (a === 100 && b >= 64 && b <= 127) return true;
        return false;
    }
    return !net.isIPv6(normalized);
}

async function validatePublicHttpUrl(rawUrl) {
    let parsed;
    try {
        parsed = new URL(rawUrl.trim());
    } catch {
        return { valid: false, reason: "invalid_url" };
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { valid: false, reason: "unsupported_protocol" };
    }
    if (parsed.username || parsed.password) {
        return { valid: false, reason: "credentials_disallowed" };
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) {
        return { valid: false, reason: "private_host" };
    }
    if (net.isIP(host)) {
        if (isPrivateOrReservedIp(host)) {
            return { valid: false, reason: "private_ip" };
        }
        return { valid: true, url: parsed.toString(), host };
    }
    try {
        const resolved = await dns.lookup(host, { all: true });
        if (!resolved.length || resolved.some((entry) => isPrivateOrReservedIp(entry.address))) {
            return { valid: false, reason: "private_dns_target" };
        }
        return { valid: true, url: parsed.toString(), host };
    } catch {
        return { valid: false, reason: "dns_failed" };
    }
}

function decodeHtmlEntities(text) {
    return (text || "")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&nbsp;/gi, " ");
}

function stripHtmlTags(html) {
    return decodeHtmlEntities(
        (html || "")
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
            .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
            .replace(/<[^>]+>/g, " ")
    )
        .replace(/\s+/g, " ")
        .trim();
}

function extractJobTextFromHtml(html) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescMatch =
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);

    let structuredJobText = "";
    let structuredTitle = "";
    const ldScripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of ldScripts) {
        try {
            const parsed = JSON.parse(match[1].trim());
            const items = Array.isArray(parsed) ? parsed : [parsed, ...(Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [])];
            for (const item of items) {
                const t = item?.["@type"];
                const isJob = t === "JobPosting" || (Array.isArray(t) && t.includes("JobPosting"));
                if (isJob) {
                    if (item.title && !structuredTitle) structuredTitle = String(item.title);
                    const pieces = [
                        item.title ? `Title: ${item.title}` : "",
                        item.hiringOrganization?.name ? `Company: ${item.hiringOrganization.name}` : "",
                        item.skills ? `Skills: ${Array.isArray(item.skills) ? item.skills.join(", ") : item.skills}` : "",
                        item.qualifications ? `Qualifications: ${stripHtmlTags(String(item.qualifications))}` : "",
                        item.description ? `Description: ${stripHtmlTags(String(item.description))}` : "",
                    ].filter(Boolean);
                    structuredJobText += pieces.join("\n") + "\n";
                }
            }
        } catch {
            // Ignore malformed JSON-LD blocks
        }
    }

    const fetchedTitle = decodeHtmlEntities(structuredTitle || ogTitleMatch?.[1] || titleMatch?.[1] || "").trim();
    const metaDesc = decodeHtmlEntities(metaDescMatch?.[1] || "").trim();
    const bodyText = stripHtmlTags(html).slice(0, 3200);
    const combined = [fetchedTitle, metaDesc, structuredJobText.trim(), bodyText]
        .filter(Boolean)
        .join("\n")
        .slice(0, 4000);

    const lower = combined.toLowerCase();
    const looksGated =
        lower.includes("authwall") ||
        lower.includes("sign in to view") ||
        lower.includes("join linkedin") ||
        lower.includes("verify you are human") ||
        lower.includes("enable javascript and cookies");

    return {
        fetchedTitle: fetchedTitle.slice(0, 140),
        extractedText: combined,
        looksGated,
    };
}

async function fetchJobPostingFromUrl(rawUrl) {
    if (!rawUrl || !rawUrl.trim()) {
        return { fetchStatus: "none", fetchedTitle: "", extractedText: "", host: "" };
    }

    let currentUrl = rawUrl.trim();
    for (let hop = 0; hop < 2; hop++) {
        const check = await validatePublicHttpUrl(currentUrl);
        if (!check.valid) {
            return { fetchStatus: "unavailable", fetchedTitle: "", extractedText: "", host: "", reason: check.reason };
        }
        try {
            const res = await fetch(check.url, {
                method: "GET",
                redirect: "manual",
                signal: AbortSignal.timeout(2500),
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; PMKVY-SkillGapAnalyser/1.0)",
                    Accept: "text/html,application/xhtml+xml,text/plain;q=0.9",
                },
            });

            if (res.status >= 300 && res.status < 400) {
                const location = res.headers.get("location");
                if (!location) break;
                const nextUrl = new URL(location, check.url).toString();
                if (nextUrl.toLowerCase().includes("authwall") || nextUrl.toLowerCase().includes("/login")) {
                    return { fetchStatus: "gated", fetchedTitle: "", extractedText: "", host: check.host };
                }
                currentUrl = nextUrl;
                continue;
            }

            if (res.status === 401 || res.status === 403 || res.status === 429 || res.status === 999) {
                return { fetchStatus: "gated", fetchedTitle: "", extractedText: "", host: check.host };
            }

            if (!res.ok) {
                return { fetchStatus: "unavailable", fetchedTitle: "", extractedText: "", host: check.host };
            }

            const reader = res.body?.getReader();
            let rawHtml = "";
            if (reader) {
                const decoder = new TextDecoder();
                let bytes = 0;
                while (bytes < 250 * 1024) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    bytes += value.byteLength;
                    rawHtml += decoder.decode(value, { stream: true });
                }
                reader.cancel().catch(() => {});
            } else {
                rawHtml = (await res.text()).slice(0, 250 * 1024);
            }

            const parsed = extractJobTextFromHtml(rawHtml);
            if (parsed.looksGated || parsed.extractedText.length < 120) {
                return {
                    fetchStatus: "gated",
                    fetchedTitle: parsed.fetchedTitle,
                    extractedText: parsed.extractedText,
                    host: check.host,
                };
            }

            return {
                fetchStatus: "fetched",
                fetchedTitle: parsed.fetchedTitle,
                extractedText: parsed.extractedText,
                host: check.host,
            };
        } catch {
            return { fetchStatus: "unavailable", fetchedTitle: "", extractedText: "", host: check.host };
        }
    }

    return { fetchStatus: "gated", fetchedTitle: "", extractedText: "", host: "" };
}

const GEMINI_FLASH_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite",
    "gemma-4-31b-it",
    "gemma-4-26b-a4b-it",
    "gemini-3.8-flash",
];

function parseGeminiJson(rawText) {
    if (!rawText || typeof rawText !== "string") return null;
    const cleaned = rawText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start !== -1 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        return null;
    }
}

// Google Gemini AI generative analysis (bounded per-model timeouts across active Flash/Gemma models)
async function analyzeWithGemini({
    resumeText,
    jobTitle,
    targetRequirements,
    jdText,
    jobUrl,
    isJobLinkMode,
    apiKey,
}) {
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveKey) return null;

    const prompt = isJobLinkMode
        ? `You are an expert AI Career and Skill Gap Evaluator aligned with India's PMKVY 4.0 and National Skills Qualifications Framework (NSQF).
Evaluate the Candidate Resume against the Target Job Posting provided via URL and/or description.

Target Job URL: ${jobUrl || "Not provided"}
Target Job Context & Extracted Content:
${(jdText || jobTitle || "General Industry Role").substring(0, 3800)}

Candidate Resume:
${resumeText.substring(0, 3500)}

Instructions:
1. Determine the specific role title ("targetJobTitle") and industry domain ("sectorCouncil") from the Job URL slug and Job Description/content.
2. Extract the 6 to 8 most essential technical and workplace competencies required for this specific job.
3. Grade the candidate strictly from evidence present in their resume (0 if not evidenced).
4. Respond ONLY with a valid JSON object matching this schema (no markdown or commentary):
{
  "targetJobTitle": "string",
  "sectorCouncil": "string (e.g. IT-ITeS / Data / Automotive / Cloud)",
  "targetNSQF": "string (e.g. Industry Benchmark — NSQF Level 5 eq.)",
  "matchPercentage": number (0 to 100),
  "readinessGrade": "High Readiness" | "Moderate Readiness" | "Significant Gap",
  "advisoryMessage": "string providing concise, actionable upskilling guidance",
  "skills": [
    {
      "skillName": "string naming the required skill",
      "nosCode": "string (matching NOS code if known or IND/SPEC)",
      "requiredProficiency": number (60 to 95),
      "importance": "Mandatory" | "Required" | "Preferred",
      "candidateProficiency": number (0 to 100 based on resume evidence),
      "status": "MATCHED" | "CRITICAL_GAP" | "ENHANCEMENT_NEEDED",
      "resumeEvidence": "verbatim proof snippet or explicit gap explanation"
    }
  ]
}`
        : `You are an expert AI Career and Skill Gap Evaluator aligned with India's PMKVY 4.0 and National Skills Qualifications Framework (NSQF).
Target Job: ${jobTitle}
${jdText ? `Target Job Description snippet: ${jdText.substring(0, 500)}` : ""}
Required Skills to evaluate: ${JSON.stringify(targetRequirements.map((t) => t.skillName))}

Candidate Resume:
${resumeText.substring(0, 3500)}

Analyze this candidate resume against the required statutory skills.
Respond ONLY with a valid JSON object strictly matching this schema (no markdown or commentary):
{
  "matchPercentage": number,
  "readinessGrade": "High Readiness" | "Moderate Readiness" | "Significant Gap",
  "advisoryMessage": "string providing actionable guidance aligned with PMKVY 4.0",
  "skills": [
    {
      "skillName": "string matching one of the required skills",
      "candidateProficiency": number (0 to 100 based on resume evidence),
      "status": "MATCHED" | "CRITICAL_GAP" | "ENHANCEMENT_NEEDED",
      "resumeEvidence": "verbatim quote or concise summary of proof from the resume"
    }
  ]
}`;

    const aiDeadline = Date.now() + 18000;

    for (const modelName of GEMINI_FLASH_MODELS) {
        const remainingMs = aiDeadline - Date.now();
        if (remainingMs < 1500) break;

        const isGemma = modelName.startsWith("gemma");
        const generationConfig = isGemma
            ? { temperature: 0.1 }
            : { temperature: 0.1, responseMimeType: "application/json" };

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveKey}`,
                {
                    method: "POST",
                    signal: AbortSignal.timeout(Math.min(6000, remainingMs)),
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                        generationConfig,
                    }),
                }
            );
            if (res.ok) {
                const data = await res.json();
                const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = parseGeminiJson(contentText);
                if (parsed) {
                    return { ...parsed, _modelUsed: modelName };
                }
            } else {
                console.warn(`[Gemini API ${res.status} - ${modelName}]`);
            }
        } catch (err) {
            console.warn(`[Gemini Timeout/Error - ${modelName}]`, err.message);
        }
    }

    return null;
}

export async function GET() {
    let jobRoles = [];
    try {
        await connectToDatabase();
        const mongoRoles = await JobRole.find()
            .populate({
                path: "skillRequirements",
                populate: { path: "skill" },
            })
            .sort({ title: 1 })
            .lean();

        if (mongoRoles && mongoRoles.length > 0) {
            jobRoles = mongoRoles.map((r) => ({
                id: r._id.toString(),
                title: r.title,
                domain: r.domain,
                description: r.description,
                demandLevel: r.demandLevel,
                skillRequirements: (r.skillRequirements || []).map((sr) => ({
                    id: sr._id?.toString(),
                    requiredProficiency: sr.requiredProficiency,
                    importance: sr.importance,
                    skill: sr.skill
                        ? { id: sr.skill._id?.toString(), name: sr.skill.name }
                        : null,
                })),
            }));
        }
    } catch {
        // Fallback to Prisma
    }

    if (jobRoles.length === 0) {
        try {
            const prismaRoles = await prisma.jobRole.findMany({
                include: {
                    skillRequirements: { include: { skill: true } },
                },
                orderBy: { title: "asc" },
            });
            jobRoles = prismaRoles.map((r) => ({
                id: r.id,
                title: r.title,
                domain: r.domain,
                description: r.description,
                demandLevel: r.demandLevel,
                skillRequirements: (r.skillRequirements || []).map((sr) => ({
                    id: sr.id,
                    requiredProficiency: sr.requiredProficiency,
                    importance: sr.importance,
                    skill: sr.skill ? { id: sr.skill.id, name: sr.skill.name } : null,
                })),
            }));
        } catch (err) {
            console.warn("[AI Analyser GET roles error]", err.message);
        }
    }

    return NextResponse.json({
        jobRoles,
        aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            resumeText,
            targetMode = "QP_NOS",
            jobRoleId,
            linkedinUrl,
            jobDescriptionText,
            domain = "Web Development",
            apiKey, // Allows user to supply their Gemini API key directly from UI or env
        } = body;

        if (!resumeText || resumeText.trim().length < 15) {
            return NextResponse.json({ error: "Please provide a valid resume text or document content." }, { status: 400 });
        }

        // 1. Fetch or Parse Target Job Requirements (Check Mongoose first, then Prisma)
        let targetJobTitle = "Target Job Role";
        let targetJobCode = "QP-NOS: SSC/Q0508 - v2.0";
        let targetNSQF = "NSQF Level 5";
        let sectorCouncil = "IT-ITeS Sector Skills Council (NASSCOM)";
        let targetRequirements = [];

        if (targetMode === "QP_NOS") {
            let dbRole = null;
            // A. Try Mongoose / MongoDB
            try {
                await connectToDatabase();
                if (jobRoleId && jobRoleId.match(/^[0-9a-fA-F]{24}$/)) {
                    dbRole = await JobRole.findById(jobRoleId).populate({
                        path: "skillRequirements",
                        populate: { path: "skill" },
                    }).lean();
                } else {
                    dbRole = await JobRole.findOne().populate({
                        path: "skillRequirements",
                        populate: { path: "skill" },
                    }).lean();
                }
            } catch {
                // Ignore Mongo error and fallback to Prisma
            }

            // B. Try Prisma if not found via Mongoose
            if (!dbRole) {
                try {
                    if (jobRoleId) {
                        dbRole = await prisma.jobRole.findUnique({
                            where: { id: jobRoleId },
                            include: { skillRequirements: { include: { skill: true } } },
                        });
                    }
                    if (!dbRole) {
                        dbRole = await prisma.jobRole.findFirst({
                            where: domain ? { domain } : undefined,
                            include: { skillRequirements: { include: { skill: true } } },
                        });
                    }
                    if (!dbRole) {
                        dbRole = await prisma.jobRole.findFirst({
                            include: { skillRequirements: { include: { skill: true } } },
                        });
                    }
                } catch {
                    // Ignore
                }
            }

            if (dbRole) {
                targetJobTitle = dbRole.title;
                const normalizedDomain = (dbRole.domain || "Web Development").toLowerCase().trim();
                const catalogInfo = QP_CATALOG[normalizedDomain] || {
                    code: `QP-NOS: ${(dbRole.domain || "TECH").toUpperCase()}/Q0101`,
                    title: dbRole.title,
                    nsqfLevel: "NSQF Level 5",
                    ssc: `${dbRole.domain} Sector Skill Council`,
                };
                targetJobCode = catalogInfo.code;
                targetNSQF = catalogInfo.nsqfLevel;
                sectorCouncil = catalogInfo.ssc;

                const requirements = dbRole.skillRequirements || [];
                targetRequirements = requirements.map((sr) => ({
                    skillName: sr.skill?.name || "Core Technical Competency",
                    requiredProficiency: sr.requiredProficiency || 75,
                    importance: sr.importance || "Mandatory",
                }));
            }
        }

        const isJobLinkFlow = targetMode === "LINKEDIN" || Boolean(linkedinUrl?.trim()) || (Boolean(jobDescriptionText?.trim()) && targetRequirements.length === 0);
        let fetchedJob = { fetchStatus: "none", fetchedTitle: "", extractedText: "", host: "" };

        if (linkedinUrl && linkedinUrl.trim()) {
            const isLinkedInWithJd = linkedinUrl.toLowerCase().includes("linkedin.com") && (jobDescriptionText || "").trim().length > 80;
            if (isLinkedInWithJd) {
                fetchedJob = { fetchStatus: "gated", fetchedTitle: "", extractedText: "", host: "www.linkedin.com" };
            } else {
                fetchedJob = await fetchJobPostingFromUrl(linkedinUrl);
            }
        }

        const rawTitleSource = (jobDescriptionText || "").trim() || fetchedJob.fetchedTitle || fetchedJob.extractedText || linkedinUrl || "";
        const combinedJobContext = [
            fetchedJob.fetchedTitle ? `Posting Title: ${fetchedJob.fetchedTitle}` : "",
            jobDescriptionText ? `${jobDescriptionText}` : "",
            fetchedJob.extractedText ? `Fetched Job Webpage Content:\n${fetchedJob.extractedText}` : "",
            linkedinUrl ? `Job URL: ${linkedinUrl}` : "",
        ]
            .filter(Boolean)
            .join("\n\n");

        // Fallback / Job Link requirement resolution when not bound to a specific QP-NOS role
        if (isJobLinkFlow || targetRequirements.length === 0) {
            const parsedJD = parseJobDescription(rawTitleSource);
            targetJobTitle = fetchedJob.fetchedTitle || parsedJD.title || "Industry Job Benchmark";
            targetJobCode = linkedinUrl
                ? `Job URL (${fetchedJob.host || (linkedinUrl.includes("linkedin.com") ? "LinkedIn" : "Web Posting")})`
                : "Corporate Technical Specification";
            targetNSQF = "Industry Benchmark (NSQF Level 5-6 equivalent)";
            sectorCouncil = "Cross-Industry Technical Benchmark";
            targetRequirements = parsedJD.skills.map((s) => ({
                skillName: s,
                requiredProficiency: 75,
                importance: "Mandatory",
            }));
        }

        // 2. Run Google Gemini Generative AI Analysis (or fallback to Local NOS NLP)
        const geminiResult = await analyzeWithGemini({
            resumeText,
            jobTitle: targetJobTitle,
            targetRequirements,
            jdText: combinedJobContext || jobDescriptionText || linkedinUrl,
            jobUrl: linkedinUrl,
            isJobLinkMode: isJobLinkFlow,
            apiKey,
        });

        if (isJobLinkFlow && geminiResult) {
            if (geminiResult.targetJobTitle) targetJobTitle = geminiResult.targetJobTitle;
            if (geminiResult.sectorCouncil) sectorCouncil = geminiResult.sectorCouncil;
            if (geminiResult.targetNSQF) targetNSQF = geminiResult.targetNSQF;
        }

        const candidateExtracted = extractSkillsFromText(resumeText);
        const candidateSkillMap = new Map(candidateExtracted.map((cs) => [cs.skillName, cs]));

        const evaluatedSkills = [];
        let matchedCount = 0;
        let criticalGapCount = 0;
        let enhancementCount = 0;
        let totalScoreSum = 0;
        let totalRequiredSum = 0;

        if (isJobLinkFlow && geminiResult && Array.isArray(geminiResult.skills) && geminiResult.skills.length > 0) {
            for (const gSkill of geminiResult.skills) {
                const skillName = gSkill?.skillName || "Required Competency";
                const requiredLevel = typeof gSkill?.requiredProficiency === "number"
                    ? Math.min(100, Math.max(50, gSkill.requiredProficiency))
                    : 75;
                const assessedLevel = typeof gSkill?.candidateProficiency === "number"
                    ? Math.min(100, Math.max(0, gSkill.candidateProficiency))
                    : 0;
                const deficit = Math.max(0, requiredLevel - assessedLevel);

                const status = assessedLevel >= requiredLevel ? "MATCHED" : assessedLevel > 0 ? "ENHANCEMENT_NEEDED" : "CRITICAL_GAP";
                if (status === "MATCHED") matchedCount++;
                else if (status === "ENHANCEMENT_NEEDED") enhancementCount++;
                else criticalGapCount++;

                totalScoreSum += Math.min(assessedLevel, requiredLevel);
                totalRequiredSum += requiredLevel;

                const nosMeta = SKILL_NOS_REGISTRY[skillName] || {
                    nosCode: gSkill?.nosCode || "IND/SPEC",
                    defaultImportance: "Required",
                };

                evaluatedSkills.push({
                    skillName,
                    nosCode: gSkill?.nosCode || nosMeta.nosCode,
                    requiredProficiency: requiredLevel,
                    candidateProficiency: assessedLevel,
                    deficit,
                    status,
                    statusLabel: status === "MATCHED"
                        ? "Verified Match"
                        : status === "ENHANCEMENT_NEEDED"
                            ? `Needs Work (-${deficit}%)`
                            : `Critical Gap (-${deficit}%)`,
                    importance: gSkill?.importance || nosMeta.defaultImportance,
                    resumeEvidence: gSkill?.resumeEvidence || "No direct evidence found in candidate resume.",
                });
            }
        } else if (geminiResult && Array.isArray(geminiResult.skills)) {
            const geminiSkillMap = new Map(geminiResult.skills.map((s) => [String(s.skillName || "").toLowerCase(), s]));

            for (const req of targetRequirements) {
                const geminiSkill = geminiSkillMap.get(String(req.skillName || "").toLowerCase());
                const requiredLevel = req.requiredProficiency;
                const assessedLevel = typeof geminiSkill?.candidateProficiency === "number"
                    ? Math.min(100, Math.max(0, geminiSkill.candidateProficiency))
                    : 0;
                const deficit = Math.max(0, requiredLevel - assessedLevel);

                let status = assessedLevel >= requiredLevel ? "MATCHED" : assessedLevel > 0 ? "ENHANCEMENT_NEEDED" : "CRITICAL_GAP";
                if (status === "MATCHED") matchedCount++;
                else if (status === "ENHANCEMENT_NEEDED") enhancementCount++;
                else criticalGapCount++;

                totalScoreSum += Math.min(assessedLevel, requiredLevel);
                totalRequiredSum += requiredLevel;

                const nosMeta = SKILL_NOS_REGISTRY[req.skillName] || { nosCode: "NOS/G9001", defaultImportance: "Required" };

                evaluatedSkills.push({
                    skillName: req.skillName,
                    nosCode: nosMeta.nosCode,
                    requiredProficiency: requiredLevel,
                    candidateProficiency: assessedLevel,
                    deficit,
                    status,
                    statusLabel: status === "MATCHED"
                        ? "Verified Match"
                        : status === "ENHANCEMENT_NEEDED"
                            ? `Needs Work (-${deficit}%)`
                            : `Critical Gap (-${deficit}%)`,
                    importance: req.importance || nosMeta.defaultImportance,
                    resumeEvidence: geminiSkill?.resumeEvidence || "No mention found in candidate resume.",
                });
            }
        } else {
            // Local Built-in NLP Taxonomy Matcher
            for (const req of targetRequirements) {
                const candidateData = candidateSkillMap.get(req.skillName);
                const assessedLevel = candidateData ? candidateData.proficiency : 0;
                const requiredLevel = req.requiredProficiency;
                const deficit = Math.max(0, requiredLevel - assessedLevel);

                totalScoreSum += Math.min(assessedLevel, requiredLevel);
                totalRequiredSum += requiredLevel;

                let status;
                let statusLabel;
                if (assessedLevel >= requiredLevel) {
                    status = "MATCHED";
                    statusLabel = "Verified Match";
                    matchedCount++;
                } else if (assessedLevel > 0) {
                    status = "ENHANCEMENT_NEEDED";
                    statusLabel = `Needs Enhancement (-${deficit}%)`;
                    enhancementCount++;
                } else {
                    status = "CRITICAL_GAP";
                    statusLabel = `Critical Gap (-${deficit}%)`;
                    criticalGapCount++;
                }

                const nosMeta = SKILL_NOS_REGISTRY[req.skillName] || { nosCode: "NOS/G9001", defaultImportance: "Required" };

                evaluatedSkills.push({
                    skillName: req.skillName,
                    nosCode: nosMeta.nosCode,
                    requiredProficiency: requiredLevel,
                    candidateProficiency: assessedLevel,
                    deficit,
                    status,
                    statusLabel,
                    importance: req.importance || nosMeta.defaultImportance,
                    resumeEvidence: candidateData ? candidateData.snippet : "No evidence or mention found in uploaded resume.",
                });
            }
        }

        const matchPercentage = typeof geminiResult?.matchPercentage === "number"
            ? geminiResult.matchPercentage
            : (totalRequiredSum > 0 ? Math.round((totalScoreSum / totalRequiredSum) * 100) : 50);

        // 3. Fetch Recommended PMKVY Bridge Courses (Mongoose first, then Prisma)
        const criticalSkillNames = evaluatedSkills
            .filter((s) => s.status === "CRITICAL_GAP" || s.status === "ENHANCEMENT_NEEDED")
            .map((s) => s.skillName);

        let dbCourses = [];
        try {
            await connectToDatabase();
            const mongoCourses = await TrainingCourse.find().limit(12).populate({
                path: "courseSkills",
                populate: { path: "skill" },
            }).lean();
            if (mongoCourses && mongoCourses.length > 0) {
                dbCourses = mongoCourses;
            }
        } catch {
            // Fallback to Prisma
        }

        if (dbCourses.length === 0) {
            try {
                dbCourses = await prisma.trainingCourse.findMany({
                    include: {
                        courseSkills: {
                            include: { skill: true },
                        },
                    },
                    take: 12,
                });
            } catch {
                // Ignore
            }
        }

        const recommendedCourses = dbCourses
            .map((course) => {
                const skillsArray = course.courseSkills || [];
                const coveredMissingSkills = skillsArray
                    .map((cs) => cs.skill?.name)
                    .filter((name) => name && criticalSkillNames.includes(name));

                return {
                    id: course._id ? course._id.toString() : course.id,
                    name: course.name,
                    provider: course.provider || "National Skill Development Corporation (NSDC)",
                    duration: course.duration || "45 Hours",
                    difficulty: course.difficulty,
                    category: course.category || domain,
                    skillsAddressed: coveredMissingSkills,
                    relevanceScore: coveredMissingSkills.length,
                    isGovtCertified: true,
                    subsidyStatus: "100% Free under PMKVY 4.0 (Skill India)",
                    stipend: "Eligible for ₹4,000 Direct Benefit Transfer (DBT)",
                    officialPortalUrl: "https://www.skillindiadigital.gov.in",
                };
            })
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3);

        // 4. Generate Official NSQF Narrative & Advisory
        let readinessGrade = geminiResult?.readinessGrade || "High Readiness";
        let advisoryMessage = geminiResult?.advisoryMessage ||
            "Your resume demonstrates strong foundational alignment with this role. A brief PMKVY certification will complete your qualification.";

        if (!geminiResult) {
            if (matchPercentage < 50) {
                readinessGrade = "Significant Gap";
                advisoryMessage =
                    "Your resume has high potential, but lacks several mandatory statutory competencies for this specific role. Enrolling in PMKVY bridge training is strongly advised before corporate applications.";
            } else if (matchPercentage < 75) {
                readinessGrade = "Moderate Readiness";
                advisoryMessage =
                    "You possess core transferable skills. To clear industry recruitment screening, focus on closing the critical deficits highlighted below.";
            }
        }

        const engineUsed = geminiResult
            ? `Google Gemini AI (${geminiResult._modelUsed || "Flash"})`
            : "PMKVY National Occupational Standards Engine (Local)";

        const diagnostic = {
            matchPercentage,
            readinessGrade,
            targetJobTitle,
            targetJobCode,
            targetNSQF,
            sectorCouncil,
            engineUsed,
            geminiModel: geminiResult?._modelUsed || null,
            isGeminiPowered: Boolean(geminiResult),
            jobSourceInfo: {
                mode: targetMode,
                url: linkedinUrl || null,
                fetchStatus: fetchedJob.fetchStatus,
                fetchedTitle: fetchedJob.fetchedTitle || null,
            },
            summaryMetrics: {
                totalEvaluated: evaluatedSkills.length,
                matchedVerified: matchedCount,
                criticalGaps: criticalGapCount,
                enhancementsNeeded: enhancementCount,
            },
            advisory: {
                headline: `${matchPercentage}% Match — ${readinessGrade}`,
                message: advisoryMessage,
                statutoryNotice: `Under National Skills Qualifications Framework (NSQF) norms, candidate must remediate critical deficits prior to statutory trade endorsement.`,
            },
            skillsMatrix: evaluatedSkills,
            recommendedCourses,
            extractedResumeSkills: candidateExtracted.map((c) => c.skillName),
        };

        return NextResponse.json({
            success: true,
            diagnostic,
        });
    } catch (error) {
        console.error("AI Resume Analyser error:", error);
        return NextResponse.json({ error: "Failed to process resume analysis: " + error.message }, { status: 500 });
    }
}
