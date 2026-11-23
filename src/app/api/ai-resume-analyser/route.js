import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import JobRole from "@/models/JobRole";
import TrainingCourse from "@/models/TrainingCourse";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

function extractSkillsFromText(text) {
    const normalized = text.toLowerCase();
    const results = [];
    for (const [skillName, keywords] of Object.entries(SKILL_KEYWORDS_MAP)) {
        let matchCount = 0;
        let foundSnippet = "";
        for (const kw of keywords) {
            const idx = normalized.indexOf(kw.toLowerCase());
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
            if (normalized.includes(kw.toLowerCase())) {
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

// Google Gemini AI SDK generative analysis
async function analyzeWithGemini(resumeText, jobTitle, targetRequirements, jdText, apiKey) {
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveKey) return null;

    const prompt = `You are an expert AI Career and Skill Gap Evaluator aligned with India's PMKVY 4.0 and National Skills Qualifications Framework (NSQF).
Target Job: ${jobTitle}
${jdText ? `Target Job Description snippet: ${jdText.substring(0, 500)}` : ""}
Required Skills to evaluate: ${JSON.stringify(targetRequirements.map((t) => t.skillName))}

Candidate Resume:
${resumeText.substring(0, 3500)}

Analyze this candidate resume against the required statutory skills.
Respond ONLY with a valid JSON object strictly matching this schema:
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

    try {
        const genAI = new GoogleGenerativeAI(effectiveKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        });

        const result = await model.generateContent(prompt);
        const text = result?.response?.text();
        if (text) {
            return JSON.parse(text);
        }
    } catch (sdkError) {
        console.warn("[Gemini SDK Warning] Falling back to direct API endpoint:", sdkError.message);
        try {
            // Direct REST endpoint fallback
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.1,
                            responseMimeType: "application/json",
                        },
                    }),
                }
            );
            if (res.ok) {
                const data = await res.json();
                const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (contentText) return JSON.parse(contentText);
            }
        } catch (restError) {
            console.error("[Gemini REST Error]", restError);
        }
    }
    return null;
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

            // B. Try Prisma SQLite if not found via Mongoose
            if (!dbRole && jobRoleId) {
                try {
                    dbRole = await prisma.jobRole.findUnique({
                        where: { id: jobRoleId },
                        include: {
                            skillRequirements: {
                                include: { skill: true },
                            },
                        },
                    });
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

        // Fallback if targetMode is LINKEDIN or no requirements were resolved
        if (targetRequirements.length === 0) {
            const jdText = jobDescriptionText || (linkedinUrl ? `Target Job posting at: ${linkedinUrl}` : "");
            const parsedJD = parseJobDescription(jdText);
            targetJobTitle = parsedJD.title || "Industry Job Benchmark";
            targetJobCode = linkedinUrl
                ? `Industry Benchmark (Source: ${linkedinUrl.includes("linkedin.com") ? "LinkedIn Talent Solutions" : "Indeed / Web"})`
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
        const geminiResult = await analyzeWithGemini(
            resumeText,
            targetJobTitle,
            targetRequirements,
            jobDescriptionText || linkedinUrl,
            apiKey
        );

        const candidateExtracted = extractSkillsFromText(resumeText);
        const candidateSkillMap = new Map(candidateExtracted.map((cs) => [cs.skillName, cs]));

        const evaluatedSkills = [];
        let matchedCount = 0;
        let criticalGapCount = 0;
        let enhancementCount = 0;
        let totalScoreSum = 0;
        let totalRequiredSum = 0;

        if (geminiResult && Array.isArray(geminiResult.skills)) {
            const geminiSkillMap = new Map(geminiResult.skills.map((s) => [s.skillName, s]));

            for (const req of targetRequirements) {
                const geminiSkill = geminiSkillMap.get(req.skillName);
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
            ? "Google Gemini 1.5 Flash (Generative AI)"
            : "PMKVY National Occupational Standards Engine (Local)";

        const diagnostic = {
            matchPercentage,
            readinessGrade,
            targetJobTitle,
            targetJobCode,
            targetNSQF,
            sectorCouncil,
            engineUsed,
            isGeminiPowered: Boolean(geminiResult),
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
