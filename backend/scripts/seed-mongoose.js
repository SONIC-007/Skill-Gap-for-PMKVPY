import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
    connectToDatabase,
    User,
    CandidateProfile,
    Skill,
    JobRole,
    JobSkillRequirement,
    CandidateSkill,
    TrainingCourse,
    CourseSkill,
    CourseEnrollment,
    Assessment,
    AssessmentQuestion,
    AssessmentResponse,
    LearningProgress,
} from "../src/models/index.js";

async function seed() {
    await connectToDatabase();
    console.log("Connected to MongoDB. Clearing existing collections...");

    await Promise.all([
        AssessmentResponse.deleteMany({}),
        Assessment.deleteMany({}),
        AssessmentQuestion.deleteMany({}),
        LearningProgress.deleteMany({}),
        CourseEnrollment.deleteMany({}),
        CourseSkill.deleteMany({}),
        TrainingCourse.deleteMany({}),
        CandidateSkill.deleteMany({}),
        JobSkillRequirement.deleteMany({}),
        JobRole.deleteMany({}),
        Skill.deleteMany({}),
        CandidateProfile.deleteMany({}),
        User.deleteMany({}),
    ]);

    const adminPassword = await bcrypt.hash("admin123", 10);
    const candidatePassword = await bcrypt.hash("candidate123", 10);

    const admin = await User.create({
        name: "PMKVY Administrator",
        email: "admin@pmkvy.com",
        password: adminPassword,
        role: "ADMIN",
    });

    await CandidateProfile.create({
        userId: admin._id,
        bio: "National Skill Development Corporation Administrator for PMKVY Skill Gap Analyser platform.",
        location: "New Delhi, India",
    });

    const candidate = await User.create({
        name: "Rahul Sharma",
        email: "candidate@pmkvy.com",
        password: candidatePassword,
        role: "CANDIDATE",
    });

    await CandidateProfile.create({
        userId: candidate._id,
        phone: "+91 9876543210",
        education: "Bachelor of Technology in Computer Science",
        experience: "1 Year",
        location: "Jaipur, Rajasthan",
        desiredCareerField: "Web Development",
        targetJobRole: "Full Stack Web Developer",
        bio: "Passionate aspiring software engineer looking to upskill and transition into modern full stack cloud development.",
    });

    const skillsList = [
        { name: "HTML5 & Modern CSS", category: "TECHNICAL", domain: "Web Development", description: "Semantic markup, CSS Grid, Flexbox, responsive web design" },
        { name: "JavaScript (ES6+)", category: "TECHNICAL", domain: "Web Development", description: "Asynchronous programming, closures, DOM manipulation, APIs" },
        { name: "TypeScript", category: "TECHNICAL", domain: "Web Development", description: "Static typing, generics, interfaces, strict mode development" },
        { name: "React.js & Next.js", category: "TECHNICAL", domain: "Web Development", description: "Hooks, server components, state management, client routing" },
        { name: "Node.js & Express", category: "TECHNICAL", domain: "Web Development", description: "RESTful API creation, middleware, backend routing, server runtime" },
        { name: "SQL & Relational Databases", category: "TECHNICAL", domain: "Web Development", description: "Schema design, joins, indexing, query optimization" },
        { name: "Python for Data Analysis", category: "TECHNICAL", domain: "Data Science", description: "Data structures, NumPy, Pandas, data wrangling" },
        { name: "Data Visualization (Tableau/PowerBI)", category: "TECHNICAL", domain: "Data Science", description: "Dashboard design, charts, statistical visualisations" },
        { name: "Statistical Modeling & Probability", category: "TECHNICAL", domain: "Data Science", description: "Hypothesis testing, regression, distributions" },
        { name: "Big Data Processing (PySpark)", category: "TECHNICAL", domain: "Data Science", description: "Distributed dataframes, large scale ETL pipelines" },
        { name: "Machine Learning Algorithms", category: "TECHNICAL", domain: "Artificial Intelligence", description: "Supervised, unsupervised algorithms, scikit-learn" },
        { name: "Deep Learning & Neural Networks", category: "TECHNICAL", domain: "Artificial Intelligence", description: "PyTorch, TensorFlow, CNNs, Transformers, LLMs" },
        { name: "Natural Language Processing (NLP)", category: "TECHNICAL", domain: "Artificial Intelligence", description: "Tokenization, embeddings, vector databases, RAG" },
        { name: "Computer Vision", category: "TECHNICAL", domain: "Artificial Intelligence", description: "OpenCV, image classification, object detection" },
        { name: "Network Security & Protocols", category: "TECHNICAL", domain: "Cybersecurity", description: "TCP/IP, firewalls, VPNs, IDS/IPS, packet inspection" },
        { name: "Ethical Hacking & Penetration Testing", category: "TECHNICAL", domain: "Cybersecurity", description: "OWASP Top 10, Kali Linux, vulnerability scanning" },
        { name: "Applied Cryptography & PKI", category: "TECHNICAL", domain: "Cybersecurity", description: "Symmetric/asymmetric encryption, hashing, SSL/TLS" },
        { name: "Incident Response & SIEM", category: "TECHNICAL", domain: "Cybersecurity", description: "Log analysis, threat detection, Splunk, SOC workflows" },
        { name: "Cloud Architecture (AWS/Azure)", category: "TECHNICAL", domain: "Cloud Computing", description: "Compute, storage, IAM, VPC, serverless architecture" },
        { name: "Containerization & Docker", category: "TECHNICAL", domain: "Cloud Computing", description: "Dockerfiles, multi-stage builds, container networking" },
        { name: "Kubernetes Orchestration", category: "TECHNICAL", domain: "Cloud Computing", description: "Pods, services, deployments, ingress, Helm charts" },
        { name: "CI/CD Pipeline Automation", category: "TECHNICAL", domain: "Cloud Computing", description: "GitHub Actions, automated testing, continuous delivery" },
        { name: "High Voltage EV Safety & ISO 6469", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "Electrical safety protocols, ISO 6469 compliance, high voltage PPE" },
        { name: "Battery Management Systems (BMS)", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "Cell balancing, thermal management, state of charge (SoC)" },
        { name: "EV Powertrain & Motor Drives", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "PMSM, BLDC motor drives, regenerative braking, inverter tuning" },
        { name: "CAN Bus & J1939 Vehicle Diagnostics", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "CAN-bus analyzers, OBD-II telemetry, J1939 troubleshooting" },
        { name: "Technical Communication", category: "SOFT", domain: "General", description: "Articulating technical concepts clearly to diverse stakeholders" },
        { name: "Critical Problem Solving", category: "SOFT", domain: "General", description: "Structured analytical thinking, root cause analysis" },
    ];

    const skillDocs = await Skill.insertMany(skillsList);
    const skillMap = new Map(skillDocs.map((s) => [s.name, s._id]));
    console.log(`Seeded ${skillDocs.length} Skills.`);

    for (const s of skillDocs) {
        await AssessmentQuestion.create({
            skillId: s._id,
            question: `How would you rate your hands-on proficiency and practical confidence in ${s.name}?`,
            type: "RATING",
            difficulty: "INTERMEDIATE",
        });

        let mcqQuestion = `Which statement best describes standard industry best practices for ${s.name}?`;
        let options = JSON.stringify([
            "Following modular, test-driven design principles with documentation",
            "Writing quick scripts without considering error boundaries",
            "Relying solely on external defaults without configuration",
            "Ignoring performance benchmarks until post-release",
        ]);
        if (s.name.includes("HTML")) {
            mcqQuestion = "Which HTML5 semantic element is most suitable for encapsulating independent, self-contained content?";
            options = JSON.stringify(["<article>", "<section>", "<div>", "<aside>"]);
        } else if (s.name.includes("JavaScript")) {
            mcqQuestion = "In modern JavaScript (ES6+), what is the key difference between 'const' and 'let' regarding object mutation?";
            options = JSON.stringify([
                "const prevents reassignment of the binding, but allows mutating the object properties",
                "const automatically deep freezes the object values",
                "let creates read-only variables within block scopes",
                "const variables are hoisted while let variables are not",
            ]);
        } else if (s.name.includes("React")) {
            mcqQuestion = "When should you use the useEffect hook with an empty dependency array in React?";
            options = JSON.stringify([
                "To run side effects exactly once after the initial render",
                "To update the component whenever any state changes",
                "To prevent child components from re-rendering",
                "To define synchronous calculations during render",
            ]);
        } else if (s.name.includes("Python")) {
            mcqQuestion = "Which Pandas function is optimized for combining two DataFrames along a specific axis?";
            options = JSON.stringify(["pd.concat()", "pd.join_all()", "pd.combine_series()", "pd.aggregate()"]);
        } else if (s.name.includes("Docker")) {
            mcqQuestion = "What is the primary benefit of multi-stage Docker builds?";
            options = JSON.stringify([
                "Producing drastically smaller final images by discarding build-time tooling",
                "Running containers in parallel during build time",
                "Bypassing the Docker daemon requirements",
                "Auto-scaling containers in Kubernetes pods",
            ]);
        }
        await AssessmentQuestion.create({
            skillId: s._id,
            question: mcqQuestion,
            type: "MCQ",
            options,
            correctAnswer: "0",
            difficulty: "INTERMEDIATE",
        });
    }
    console.log("Seeded AssessmentQuestions for all skills.");

    const jobRolesData = [
        {
            title: "Full Stack Web Developer",
            domain: "Web Development",
            description: "Build robust, scalable client-server applications and APIs aligned with NSQF Level 5 (SSC/Q0508).",
            minExperience: "0-2 Years",
            avgSalary: "₹5.5 - 9.0 LPA",
            demandLevel: "High",
            skills: [
                { name: "HTML5 & Modern CSS", proficiency: 85, importance: "Mandatory" },
                { name: "JavaScript (ES6+)", proficiency: 85, importance: "Mandatory" },
                { name: "React.js & Next.js", proficiency: 80, importance: "Mandatory" },
                { name: "Node.js & Express", proficiency: 80, importance: "Mandatory" },
                { name: "SQL & Relational Databases", proficiency: 75, importance: "Mandatory" },
                { name: "TypeScript", proficiency: 70, importance: "Required" },
            ],
        },
        {
            title: "Junior Data Analyst & Scientist",
            domain: "Data Science",
            description: "Analyze complex business datasets and create predictive models aligned with NSQF Level 6 (SSC/Q2101).",
            minExperience: "0-1 Years",
            avgSalary: "₹5.0 - 8.5 LPA",
            demandLevel: "High",
            skills: [
                { name: "Python for Data Analysis", proficiency: 85, importance: "Mandatory" },
                { name: "Data Visualization (Tableau/PowerBI)", proficiency: 80, importance: "Mandatory" },
                { name: "Statistical Modeling & Probability", proficiency: 75, importance: "Mandatory" },
                { name: "SQL & Relational Databases", proficiency: 80, importance: "Mandatory" },
            ],
        },
        {
            title: "AI & Machine Learning Specialist",
            domain: "Artificial Intelligence",
            description: "Design and implement machine learning, deep learning, and generative AI models aligned with NSQF Level 7 (SSC/Q8101).",
            minExperience: "1-3 Years",
            avgSalary: "₹8.0 - 14.0 LPA",
            demandLevel: "Critical",
            skills: [
                { name: "Python for Data Analysis", proficiency: 90, importance: "Mandatory" },
                { name: "Machine Learning Algorithms", proficiency: 85, importance: "Mandatory" },
                { name: "Deep Learning & Neural Networks", proficiency: 80, importance: "Mandatory" },
                { name: "Natural Language Processing (NLP)", proficiency: 75, importance: "Required" },
            ],
        },
        {
            title: "Cyber Security Analyst",
            domain: "Cybersecurity",
            description: "Protect organizational networks and investigate threats aligned with NSQF Level 5 (SSC/Q0901).",
            minExperience: "1-2 Years",
            avgSalary: "₹6.0 - 10.0 LPA",
            demandLevel: "High",
            skills: [
                { name: "Network Security & Protocols", proficiency: 85, importance: "Mandatory" },
                { name: "Ethical Hacking & Penetration Testing", proficiency: 80, importance: "Mandatory" },
                { name: "Applied Cryptography & PKI", proficiency: 75, importance: "Required" },
                { name: "Incident Response & SIEM", proficiency: 80, importance: "Mandatory" },
            ],
        },
        {
            title: "Cloud Infrastructure Architect & DevOps",
            domain: "Cloud Computing",
            description: "Automate delivery pipelines and scale cloud-native microservices aligned with NSQF Level 6 (SSC/Q0702).",
            minExperience: "1-3 Years",
            avgSalary: "₹7.5 - 12.0 LPA",
            demandLevel: "High",
            skills: [
                { name: "Cloud Architecture (AWS/Azure)", proficiency: 85, importance: "Mandatory" },
                { name: "Containerization & Docker", proficiency: 80, importance: "Mandatory" },
                { name: "Kubernetes Orchestration", proficiency: 75, importance: "Required" },
                { name: "CI/CD Pipeline Automation", proficiency: 80, importance: "Mandatory" },
            ],
        },
        {
            title: "EV Powertrain & Battery Diagnostics Specialist",
            domain: "Electric Vehicle Technology",
            description: "Diagnose and service high-voltage lithium battery systems and EV drives aligned with NSQF Level 5 (ELE/Q9802).",
            minExperience: "0-2 Years",
            avgSalary: "₹4.5 - 7.5 LPA",
            demandLevel: "High",
            skills: [
                { name: "High Voltage EV Safety & ISO 6469", proficiency: 90, importance: "Mandatory" },
                { name: "Battery Management Systems (BMS)", proficiency: 85, importance: "Mandatory" },
                { name: "EV Powertrain & Motor Drives", proficiency: 80, importance: "Mandatory" },
                { name: "CAN Bus & J1939 Vehicle Diagnostics", proficiency: 80, importance: "Mandatory" },
            ],
        },
    ];

    let fullStackRoleDoc = null;
    for (const r of jobRolesData) {
        const roleDoc = await JobRole.create({
            title: r.title,
            domain: r.domain,
            description: r.description,
            minExperience: r.minExperience,
            avgSalary: r.avgSalary,
            demandLevel: r.demandLevel,
        });
        if (!fullStackRoleDoc) fullStackRoleDoc = roleDoc;

        for (const reqItem of r.skills) {
            const skillId = skillMap.get(reqItem.name);
            if (skillId) {
                await JobSkillRequirement.create({
                    jobRoleId: roleDoc._id,
                    skillId,
                    requiredProficiency: reqItem.proficiency,
                    importance: reqItem.importance,
                });
            }
        }
    }

    const coursesData = [
        {
            name: "PMKVY 4.0: Modern Full Stack Web Engineering",
            description: "Official government-subsidized bridge certification covering React.js, Next.js, Node.js REST APIs, and database engineering.",
            provider: "IT-ITeS Sector Skills Council (NASSCOM)",
            difficulty: "INTERMEDIATE",
            duration: "60 Hours",
            eligibility: "Basic programming or STEM graduate",
            category: "Web Development",
            skills: ["HTML5 & Modern CSS", "JavaScript (ES6+)", "React.js & Next.js", "Node.js & Express", "SQL & Relational Databases"],
        },
        {
            name: "NSDC Certificate in Python & Big Data Analytics",
            description: "Hands-on data analytics course with automated business dashboards, SQL, and statistical modeling.",
            provider: "National Skill Development Corporation (NSDC)",
            difficulty: "BEGINNER",
            duration: "45 Hours",
            eligibility: "Any degree holder",
            category: "Data Science",
            skills: ["Python for Data Analysis", "Data Visualization (Tableau/PowerBI)", "Statistical Modeling & Probability", "SQL & Relational Databases"],
        },
        {
            name: "Skill India: Applied AI, LLMs & Machine Learning",
            description: "Advanced NSQF-aligned specialization in deep learning, transformer architectures, and generative AI prompt engineering.",
            provider: "FutureSkills Prime (MeitY)",
            difficulty: "ADVANCED",
            duration: "75 Hours",
            eligibility: "Python familiarity",
            category: "Artificial Intelligence",
            skills: ["Machine Learning Algorithms", "Deep Learning & Neural Networks", "Natural Language Processing (NLP)", "Python for Data Analysis"],
        },
        {
            name: "PMKVY Electric Vehicle Powertrain & BMS Masterclass",
            description: "Automotive Skills Development Council certified practical training in High Voltage safety, BMS diagnostics, and CAN bus telemetry.",
            provider: "Automotive Skills Development Council (ASDC)",
            difficulty: "INTERMEDIATE",
            duration: "50 Hours",
            eligibility: "Diploma / ITI / B.Tech (Electrical/Mechanical/Automobile)",
            category: "Electric Vehicle Technology",
            skills: ["High Voltage EV Safety & ISO 6469", "Battery Management Systems (BMS)", "EV Powertrain & Motor Drives", "CAN Bus & J1939 Vehicle Diagnostics"],
        },
        {
            name: "Cloud Architecture & Docker Kubernetes Practitioner",
            description: "Accelerated cloud engineering course covering AWS, Azure, microservices containerization, and automated CI/CD pipelines.",
            provider: "IT-ITeS Sector Skills Council (NASSCOM)",
            difficulty: "INTERMEDIATE",
            duration: "50 Hours",
            eligibility: "Basic Linux & Networking",
            category: "Cloud Computing",
            skills: ["Cloud Architecture (AWS/Azure)", "Containerization & Docker", "Kubernetes Orchestration", "CI/CD Pipeline Automation"],
        },
        {
            name: "Ethical Hacking & Web Application Security (OWASP Top 10)",
            description: "Hands-on defensive remediation, penetration testing, network protocols, and SIEM threat workflows.",
            provider: "DSCI Center of Excellence (PMKVY Partner)",
            difficulty: "INTERMEDIATE",
            duration: "60 Hours",
            eligibility: "Basic networking and web development awareness",
            category: "Cybersecurity",
            skills: ["Ethical Hacking & Penetration Testing", "Network Security & Protocols", "Incident Response & SIEM"],
        },
    ];

    let firstCourseDoc = null;
    for (const c of coursesData) {
        const courseDoc = await TrainingCourse.create({
            name: c.name,
            description: c.description,
            provider: c.provider,
            difficulty: c.difficulty,
            duration: c.duration,
            eligibility: c.eligibility,
            category: c.category,
            jobRoleId: fullStackRoleDoc?._id || null,
        });
        if (!firstCourseDoc) firstCourseDoc = courseDoc;

        for (const sName of c.skills) {
            const skillId = skillMap.get(sName);
            if (skillId) {
                await CourseSkill.create({
                    courseId: courseDoc._id,
                    skillId,
                });
            }
        }
    }

    const demoSkills = [
        { name: "HTML5 & Modern CSS", proficiency: 75, verified: true },
        { name: "JavaScript (ES6+)", proficiency: 55, verified: true },
        { name: "React.js & Next.js", proficiency: 40, verified: false },
        { name: "Node.js & Express", proficiency: 45, verified: false },
        { name: "SQL & Relational Databases", proficiency: 50, verified: false },
    ];

    for (const ds of demoSkills) {
        const skillId = skillMap.get(ds.name);
        if (skillId) {
            await CandidateSkill.create({
                userId: candidate._id,
                skillId,
                proficiency: ds.proficiency,
                verified: ds.verified,
                lastAssessedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            });

            await LearningProgress.create({
                userId: candidate._id,
                skillName: ds.name,
                proficiency: Math.max(15, ds.proficiency - 20),
                date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            });
            await LearningProgress.create({
                userId: candidate._id,
                skillName: ds.name,
                proficiency: ds.proficiency,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            });
        }
    }

    if (fullStackRoleDoc) {
        await Assessment.create({
            userId: candidate._id,
            jobRoleId: fullStackRoleDoc._id,
            score: 62,
            skillGap: 38,
            status: "COMPLETED",
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        });
    }

    if (firstCourseDoc) {
        await CourseEnrollment.create({
            userId: candidate._id,
            courseId: firstCourseDoc._id,
            status: "IN_PROGRESS",
            progress: 45,
            enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        });
    }

    console.log("MongoDB Seeding Completed Successfully.");
    console.log("  Candidate: candidate@pmkvy.com / candidate123");
    console.log("  Admin:     admin@pmkvy.com / admin123");

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("MongoDB seeding error:", err);
    process.exit(1);
});
