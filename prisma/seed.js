"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Starting PMKVY Skill Gap Analyser database seeding...");
    // Clean existing data
    await prisma.learningProgress.deleteMany();
    await prisma.courseEnrollment.deleteMany();
    await prisma.courseSkill.deleteMany();
    await prisma.trainingCourse.deleteMany();
    await prisma.assessmentResponse.deleteMany();
    await prisma.assessmentQuestion.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.candidateSkill.deleteMany();
    await prisma.jobSkillRequirement.deleteMany();
    await prisma.jobRole.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.candidateProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log("Existing data cleared.");
    // 1. Create Users
    const adminPassword = await bcryptjs_1.default.hash("admin123", 12);
    const candidatePassword = await bcryptjs_1.default.hash("candidate123", 12);
    const admin = await prisma.user.create({
        data: {
            name: "PMKVY Administrator",
            email: "admin@pmkvy.com",
            password: adminPassword,
            role: "ADMIN",
            profile: {
                create: {
                    bio: "National Skill Development Corporation Administrator for PMKVY Skill Gap Analyser platform.",
                    location: "New Delhi, India",
                },
            },
        },
    });
    const candidate = await prisma.user.create({
        data: {
            name: "Rahul Sharma",
            email: "candidate@pmkvy.com",
            password: candidatePassword,
            role: "CANDIDATE",
            profile: {
                create: {
                    phone: "+91 9876543210",
                    education: "Bachelor of Technology in Computer Science",
                    experience: "1 Year",
                    location: "Jaipur, Rajasthan",
                    desiredCareerField: "Web Development",
                    targetJobRole: "Full Stack Developer",
                    bio: "Passionate aspiring software engineer looking to upskill and transition into modern full stack cloud development.",
                },
            },
        },
    });
    console.log("Created admin and demo candidate.");
    // 2. Create Skills (35+ skills across 7 domains, technical & soft)
    const skillsData = [
        // Web Development
        { name: "HTML5 & Modern CSS", category: "TECHNICAL", domain: "Web Development", description: "Semantic markup, CSS Grid, Flexbox, responsive web design" },
        { name: "JavaScript (ES6+)", category: "TECHNICAL", domain: "Web Development", description: "Asynchronous programming, closures, DOM manipulation, APIs" },
        { name: "TypeScript", category: "TECHNICAL", domain: "Web Development", description: "Static typing, generics, interfaces, strict mode development" },
        { name: "React.js & Next.js", category: "TECHNICAL", domain: "Web Development", description: "Hooks, server components, state management, client routing" },
        { name: "Node.js & Express", category: "TECHNICAL", domain: "Web Development", description: "RESTful API creation, middleware, backend routing, server runtime" },
        { name: "SQL & Relational Databases", category: "TECHNICAL", domain: "Web Development", description: "Schema design, joins, indexing, query optimization" },
        // Data Science
        { name: "Python for Data Analysis", category: "TECHNICAL", domain: "Data Science", description: "Data structures, NumPy, Pandas, data wrangling" },
        { name: "Data Visualization (Tableau/PowerBI)", category: "TECHNICAL", domain: "Data Science", description: "Dashboard design, charts, statistical visualisations" },
        { name: "Statistical Modeling & Probability", category: "TECHNICAL", domain: "Data Science", description: "Hypothesis testing, regression, distributions" },
        { name: "Big Data Processing (PySpark)", category: "TECHNICAL", domain: "Data Science", description: "Distributed dataframes, large scale ETL pipelines" },
        // Artificial Intelligence
        { name: "Machine Learning Algorithms", category: "TECHNICAL", domain: "Artificial Intelligence", description: "Supervised, unsupervised algorithms, scikit-learn" },
        { name: "Deep Learning & Neural Networks", category: "TECHNICAL", domain: "Artificial Intelligence", description: "PyTorch, TensorFlow, CNNs, Transformers, LLMs" },
        { name: "Natural Language Processing (NLP)", category: "TECHNICAL", domain: "Artificial Intelligence", description: "Tokenization, embeddings, vector databases, RAG" },
        { name: "Computer Vision", category: "TECHNICAL", domain: "Artificial Intelligence", description: "OpenCV, image classification, object detection" },
        // Cybersecurity
        { name: "Network Security & Protocols", category: "TECHNICAL", domain: "Cybersecurity", description: "TCP/IP, firewalls, VPNs, IDS/IPS, packet inspection" },
        { name: "Ethical Hacking & Penetration Testing", category: "TECHNICAL", domain: "Cybersecurity", description: "OWASP Top 10, Kali Linux, vulnerability scanning" },
        { name: "Applied Cryptography & PKI", category: "TECHNICAL", domain: "Cybersecurity", description: "Symmetric/asymmetric encryption, hashing, SSL/TLS" },
        { name: "Incident Response & SIEM", category: "TECHNICAL", domain: "Cybersecurity", description: "Log analysis, threat detection, Splunk, SOC workflows" },
        // Cloud Computing
        { name: "Cloud Architecture (AWS/Azure)", category: "TECHNICAL", domain: "Cloud Computing", description: "Compute, storage, IAM, VPC, serverless architecture" },
        { name: "Containerization & Docker", category: "TECHNICAL", domain: "Cloud Computing", description: "Dockerfiles, multi-stage builds, container networking" },
        { name: "Kubernetes Orchestration", category: "TECHNICAL", domain: "Cloud Computing", description: "Pods, services, deployments, ingress, Helm charts" },
        { name: "CI/CD Pipeline Automation", category: "TECHNICAL", domain: "Cloud Computing", description: "GitHub Actions, automated testing, continuous delivery" },
        // Digital Marketing
        { name: "Search Engine Optimization (SEO)", category: "TECHNICAL", domain: "Digital Marketing", description: "On-page, technical SEO, keyword research, Core Web Vitals" },
        { name: "Performance Marketing & SEM", category: "TECHNICAL", domain: "Digital Marketing", description: "Google Ads, Meta Ads, audience targeting, ROAS" },
        { name: "Web Analytics & GA4", category: "TECHNICAL", domain: "Digital Marketing", description: "Conversion tracking, funnel analysis, event monitoring" },
        { name: "Content Strategy & Copywriting", category: "TECHNICAL", domain: "Digital Marketing", description: "Editorial planning, brand voice, conversion copywriting" },
        // Electric Vehicle Technology
        { name: "EV Powertrain Systems", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "Electric motors, inverters, power electronics, motor control" },
        { name: "Battery Management Systems (BMS)", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "Cell balancing, thermal management, state of charge (SoC)" },
        { name: "CAN Bus Protocol & Diagnostics", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "Automotive communication networks, ECU diagnostics" },
        { name: "EV Charging Infrastructure", category: "TECHNICAL", domain: "Electric Vehicle Technology", description: "AC/DC fast charging standards, grid integration, CCS" },
        // Soft Skills (Common across domains)
        { name: "Technical Communication", category: "SOFT", domain: "General", description: "Articulating technical concepts clearly to diverse stakeholders" },
        { name: "Problem Solving & Analytical Thinking", category: "SOFT", domain: "General", description: "Deconstructing complex challenges systematically" },
        { name: "Team Collaboration & Agile Delivery", category: "SOFT", domain: "General", description: "Scrum ceremonies, cross-functional collaboration, code review" },
        { name: "Adaptability & Continuous Learning", category: "SOFT", domain: "General", description: "Embracing new frameworks, rapid skill acquisition" },
        { name: "Time & Project Management", category: "SOFT", domain: "General", description: "Prioritization, milestone planning, deadline adherence" },
    ];
    const createdSkills = {};
    for (const s of skillsData) {
        const skill = await prisma.skill.create({ data: s });
        createdSkills[s.name] = skill;
    }
    console.log(`Created ${Object.keys(createdSkills).length} skills.`);
    // 3. Create Job Roles (10 roles across 7 domains)
    const jobRolesData = [
        {
            title: "Full Stack Developer",
            domain: "Web Development",
            description: "Builds modern responsive web applications end-to-end using React, Node.js, and SQL databases.",
            minExperience: "0-2 Years",
            avgSalary: "₹6,50,000 - ₹12,00,000",
            demandLevel: "Very High",
            requirements: [
                { skill: "HTML5 & Modern CSS", required: 90, importance: "Required" },
                { skill: "JavaScript (ES6+)", required: 90, importance: "Required" },
                { skill: "TypeScript", required: 80, importance: "Required" },
                { skill: "React.js & Next.js", required: 85, importance: "Required" },
                { skill: "Node.js & Express", required: 80, importance: "Required" },
                { skill: "SQL & Relational Databases", required: 70, importance: "Required" },
                { skill: "Problem Solving & Analytical Thinking", required: 85, importance: "Required" },
                { skill: "Team Collaboration & Agile Delivery", required: 75, importance: "Preferred" },
            ],
        },
        {
            title: "Frontend Specialist",
            domain: "Web Development",
            description: "Designs and engineers high-performance web user interfaces with modern React frameworks.",
            minExperience: "0-1 Years",
            avgSalary: "₹5,50,000 - ₹10,00,000",
            demandLevel: "High",
            requirements: [
                { skill: "HTML5 & Modern CSS", required: 95, importance: "Required" },
                { skill: "JavaScript (ES6+)", required: 90, importance: "Required" },
                { skill: "React.js & Next.js", required: 90, importance: "Required" },
                { skill: "TypeScript", required: 75, importance: "Required" },
                { skill: "Technical Communication", required: 70, importance: "Preferred" },
            ],
        },
        {
            title: "Data Analyst",
            domain: "Data Science",
            description: "Translates complex data sets into actionable business insights and executive visual dashboards.",
            minExperience: "0-2 Years",
            avgSalary: "₹5,00,000 - ₹9,50,000",
            demandLevel: "High",
            requirements: [
                { skill: "Python for Data Analysis", required: 85, importance: "Required" },
                { skill: "SQL & Relational Databases", required: 90, importance: "Required" },
                { skill: "Data Visualization (Tableau/PowerBI)", required: 85, importance: "Required" },
                { skill: "Statistical Modeling & Probability", required: 75, importance: "Required" },
                { skill: "Technical Communication", required: 80, importance: "Required" },
            ],
        },
        {
            title: "Machine Learning Engineer",
            domain: "Artificial Intelligence",
            description: "Builds, trains, and deploys predictive and generative machine learning models to production.",
            minExperience: "1-3 Years",
            avgSalary: "₹9,00,000 - ₹18,00,000",
            demandLevel: "Very High",
            requirements: [
                { skill: "Python for Data Analysis", required: 90, importance: "Required" },
                { skill: "Machine Learning Algorithms", required: 90, importance: "Required" },
                { skill: "Deep Learning & Neural Networks", required: 85, importance: "Required" },
                { skill: "Statistical Modeling & Probability", required: 80, importance: "Required" },
                { skill: "Natural Language Processing (NLP)", required: 75, importance: "Preferred" },
                { skill: "Problem Solving & Analytical Thinking", required: 90, importance: "Required" },
            ],
        },
        {
            title: "AI Solutions Architect",
            domain: "Artificial Intelligence",
            description: "Architects enterprise AI solutions leveraging LLMs, computer vision, and neural network pipelines.",
            minExperience: "3-5 Years",
            avgSalary: "₹15,00,000 - ₹28,00,000",
            demandLevel: "High",
            requirements: [
                { skill: "Machine Learning Algorithms", required: 90, importance: "Required" },
                { skill: "Deep Learning & Neural Networks", required: 90, importance: "Required" },
                { skill: "Natural Language Processing (NLP)", required: 85, importance: "Required" },
                { skill: "Cloud Architecture (AWS/Azure)", required: 80, importance: "Required" },
                { skill: "Technical Communication", required: 85, importance: "Required" },
            ],
        },
        {
            title: "Cyber Security Analyst",
            domain: "Cybersecurity",
            description: "Protects enterprise infrastructure, identifies vulnerabilities, and monitors security incidents.",
            minExperience: "0-2 Years",
            avgSalary: "₹6,00,000 - ₹11,50,000",
            demandLevel: "Very High",
            requirements: [
                { skill: "Network Security & Protocols", required: 90, importance: "Required" },
                { skill: "Ethical Hacking & Penetration Testing", required: 85, importance: "Required" },
                { skill: "Incident Response & SIEM", required: 80, importance: "Required" },
                { skill: "Applied Cryptography & PKI", required: 75, importance: "Required" },
                { skill: "Problem Solving & Analytical Thinking", required: 85, importance: "Required" },
            ],
        },
        {
            title: "Cloud Solutions Architect",
            domain: "Cloud Computing",
            description: "Designs scalable, fault-tolerant, and secure cloud environments on major hyper-scalers.",
            minExperience: "2-4 Years",
            avgSalary: "₹12,00,000 - ₹22,00,000",
            demandLevel: "Very High",
            requirements: [
                { skill: "Cloud Architecture (AWS/Azure)", required: 95, importance: "Required" },
                { skill: "Containerization & Docker", required: 85, importance: "Required" },
                { skill: "Kubernetes Orchestration", required: 85, importance: "Required" },
                { skill: "CI/CD Pipeline Automation", required: 80, importance: "Required" },
                { skill: "Team Collaboration & Agile Delivery", required: 80, importance: "Preferred" },
            ],
        },
        {
            title: "DevOps Engineer",
            domain: "Cloud Computing",
            description: "Bridges development and operations through automated testing, deployment, and infrastructure as code.",
            minExperience: "1-3 Years",
            avgSalary: "₹8,00,000 - ₹15,00,000",
            demandLevel: "Very High",
            requirements: [
                { skill: "Containerization & Docker", required: 90, importance: "Required" },
                { skill: "Kubernetes Orchestration", required: 80, importance: "Required" },
                { skill: "CI/CD Pipeline Automation", required: 90, importance: "Required" },
                { skill: "Cloud Architecture (AWS/Azure)", required: 80, importance: "Required" },
                { skill: "Problem Solving & Analytical Thinking", required: 80, importance: "Required" },
            ],
        },
        {
            title: "Digital Marketing Specialist",
            domain: "Digital Marketing",
            description: "Executes omnichannel digital campaigns, drives organic search traffic, and manages ad spend.",
            minExperience: "0-2 Years",
            avgSalary: "₹4,50,000 - ₹8,50,000",
            demandLevel: "High",
            requirements: [
                { skill: "Search Engine Optimization (SEO)", required: 90, importance: "Required" },
                { skill: "Performance Marketing & SEM", required: 85, importance: "Required" },
                { skill: "Web Analytics & GA4", required: 85, importance: "Required" },
                { skill: "Content Strategy & Copywriting", required: 80, importance: "Required" },
                { skill: "Technical Communication", required: 75, importance: "Preferred" },
            ],
        },
        {
            title: "EV Powertrain & Battery Engineer",
            domain: "Electric Vehicle Technology",
            description: "Designs, tests, and optimizes electric vehicle battery packs, BMS, and motor control electronics.",
            minExperience: "1-3 Years",
            avgSalary: "₹7,50,000 - ₹14,00,000",
            demandLevel: "High",
            requirements: [
                { skill: "EV Powertrain Systems", required: 90, importance: "Required" },
                { skill: "Battery Management Systems (BMS)", required: 90, importance: "Required" },
                { skill: "CAN Bus Protocol & Diagnostics", required: 85, importance: "Required" },
                { skill: "EV Charging Infrastructure", required: 75, importance: "Preferred" },
                { skill: "Problem Solving & Analytical Thinking", required: 85, importance: "Required" },
            ],
        },
    ];
    const createdJobRoles = {};
    for (const jr of jobRolesData) {
        const jobRole = await prisma.jobRole.create({
            data: {
                title: jr.title,
                domain: jr.domain,
                description: jr.description,
                minExperience: jr.minExperience,
                avgSalary: jr.avgSalary,
                demandLevel: jr.demandLevel,
            },
        });
        createdJobRoles[jr.title] = jobRole;
        for (const req of jr.requirements) {
            const skill = createdSkills[req.skill];
            if (skill) {
                await prisma.jobSkillRequirement.create({
                    data: {
                        jobRoleId: jobRole.id,
                        skillId: skill.id,
                        requiredProficiency: req.required,
                        importance: req.importance,
                    },
                });
            }
        }
    }
    console.log(`Created ${Object.keys(createdJobRoles).length} job roles with requirements.`);
    // 4. Create Assessment Questions for Skills (Rating and MCQ)
    for (const [skillName, skill] of Object.entries(createdSkills)) {
        // Self-assessment rating question
        await prisma.assessmentQuestion.create({
            data: {
                skillId: skill.id,
                question: `How would you rate your hands-on proficiency and practical confidence in ${skillName}?`,
                type: "RATING",
                difficulty: "INTERMEDIATE",
            },
        });
        // Domain-specific technical knowledge MCQ
        let mcqQuestion = `Which statement best describes standard industry best practices for ${skillName}?`;
        let options = JSON.stringify([
            "Following modular, test-driven design principles with documentation",
            "Writing quick scripts without considering error boundaries",
            "Relying solely on external defaults without configuration",
            "Ignoring performance benchmarks until post-release"
        ]);
        if (skillName.includes("HTML")) {
            mcqQuestion = "Which HTML5 semantic element is most suitable for encapsulating independent, self-contained content?";
            options = JSON.stringify(["<article>", "<section>", "<div>", "<aside>"]);
        }
        else if (skillName.includes("JavaScript")) {
            mcqQuestion = "In modern JavaScript (ES6+), what is the key difference between 'const' and 'let' regarding object mutation?";
            options = JSON.stringify([
                "const prevents reassignment of the binding, but allows mutating the object properties",
                "const automatically deep freezes the object values",
                "let creates read-only variables within block scopes",
                "const variables are hoisted while let variables are not"
            ]);
        }
        else if (skillName.includes("React")) {
            mcqQuestion = "When should you use the useEffect hook with an empty dependency array in React?";
            options = JSON.stringify([
                "To run side effects exactly once after the initial render",
                "To update the component whenever any state changes",
                "To prevent child components from re-rendering",
                "To define synchronous calculations during render"
            ]);
        }
        else if (skillName.includes("Python")) {
            mcqQuestion = "Which Pandas function is optimized for combining two DataFrames along a specific axis?";
            options = JSON.stringify(["pd.concat()", "pd.join_all()", "pd.combine_series()", "pd.aggregate()"]);
        }
        else if (skillName.includes("Docker")) {
            mcqQuestion = "What is the primary benefit of multi-stage Docker builds?";
            options = JSON.stringify([
                "Producing drastically smaller final images by discarding build-time tooling",
                "Running containers in parallel during build time",
                "Bypassing the Docker daemon requirements",
                "Auto-scaling containers in Kubernetes pods"
            ]);
        }
        await prisma.assessmentQuestion.create({
            data: {
                skillId: skill.id,
                question: mcqQuestion,
                type: "MCQ",
                options,
                correctAnswer: "0",
                difficulty: "INTERMEDIATE",
            },
        });
    }
    console.log("Created assessment questions for all skills.");
    // 5. Create 18 PMKVY-Aligned Training Courses (Clearly labeled demo/sample data)
    const coursesData = [
        {
            name: "Modern Full Stack Web Engineering with React & Node.js",
            description: "[DEMO COURSE] Comprehensive curriculum covering responsive layouts, asynchronous JavaScript, React hooks, and Express REST APIs.",
            provider: "PMKVY Partner: National Institute of Electronics & IT (NIELIT)",
            difficulty: "INTERMEDIATE",
            duration: "16 Weeks (320 Hours)",
            eligibility: "12th Pass / Diploma or Graduate with basic computing knowledge",
            category: "Web Development",
            jobRoleTitle: "Full Stack Developer",
            skills: ["HTML5 & Modern CSS", "JavaScript (ES6+)", "TypeScript", "React.js & Next.js", "Node.js & Express", "SQL & Relational Databases"],
        },
        {
            name: "Front-End Web UI Developer Certification",
            description: "[DEMO COURSE] Master responsive design, Tailwind CSS, component architecture, and state management for client applications.",
            provider: "PMKVY Partner: Sector Skill Council for IT-ITeS (NASSCOM)",
            difficulty: "BEGINNER",
            duration: "12 Weeks (240 Hours)",
            eligibility: "10th / 12th Pass with basic computer familiarity",
            category: "Web Development",
            jobRoleTitle: "Frontend Specialist",
            skills: ["HTML5 & Modern CSS", "JavaScript (ES6+)", "React.js & Next.js"],
        },
        {
            name: "Data Analytics & Business Intelligence with Python & PowerBI",
            description: "[DEMO COURSE] End-to-end data preparation, statistical exploration, SQL data modeling, and interactive visualization dashboard development.",
            provider: "PMKVY Partner: National Skill Training Institute (NSTI)",
            difficulty: "BEGINNER",
            duration: "14 Weeks (280 Hours)",
            eligibility: "Graduate in Science, Commerce, or Engineering",
            category: "Data Science",
            jobRoleTitle: "Data Analyst",
            skills: ["Python for Data Analysis", "SQL & Relational Databases", "Data Visualization (Tableau/PowerBI)", "Statistical Modeling & Probability"],
        },
        {
            name: "Applied Machine Learning & Deep Neural Networks",
            description: "[DEMO COURSE] Mathematical foundations of machine learning, regression, classification, PyTorch deep learning, and transformer architectures.",
            provider: "PMKVY Partner: Centre for Development of Advanced Computing (C-DAC)",
            difficulty: "ADVANCED",
            duration: "20 Weeks (400 Hours)",
            eligibility: "B.E. / B.Tech / MCA or equivalent with linear algebra knowledge",
            category: "Artificial Intelligence",
            jobRoleTitle: "Machine Learning Engineer",
            skills: ["Python for Data Analysis", "Machine Learning Algorithms", "Deep Learning & Neural Networks", "Natural Language Processing (NLP)"],
        },
        {
            name: "Generative AI & LLM Application Engineering",
            description: "[DEMO COURSE] Prompt engineering, LangChain, vector retrieval (RAG), and fine-tuning open-source foundation models for enterprise use cases.",
            provider: "PMKVY Partner: AI Skill Mission India",
            difficulty: "ADVANCED",
            duration: "10 Weeks (200 Hours)",
            eligibility: "Prior Python and Machine Learning foundational experience",
            category: "Artificial Intelligence",
            jobRoleTitle: "AI Solutions Architect",
            skills: ["Machine Learning Algorithms", "Natural Language Processing (NLP)", "Deep Learning & Neural Networks"],
        },
        {
            name: "Cyber Defense & Infrastructure Security Analyst",
            description: "[DEMO COURSE] Hands-on network defense, firewall configuration, intrusion detection, penetration testing methodologies, and SOC incident triage.",
            provider: "PMKVY Partner: Data Security Council of India (DSCI)",
            difficulty: "INTERMEDIATE",
            duration: "16 Weeks (320 Hours)",
            eligibility: "Diploma or Degree in Computer Science, IT, or Electronics",
            category: "Cybersecurity",
            jobRoleTitle: "Cyber Security Analyst",
            skills: ["Network Security & Protocols", "Ethical Hacking & Penetration Testing", "Incident Response & SIEM", "Applied Cryptography & PKI"],
        },
        {
            name: "Cloud Solutions Architect Masterclass (AWS & Azure)",
            description: "[DEMO COURSE] Cloud adoption framework, multi-region architecture, high availability, VPC networking, and IAM security governance.",
            provider: "PMKVY Partner: Telecom Sector Skill Council (TSSC)",
            difficulty: "INTERMEDIATE",
            duration: "14 Weeks (280 Hours)",
            eligibility: "Degree in Computer Science or IT with networking fundamentals",
            category: "Cloud Computing",
            jobRoleTitle: "Cloud Solutions Architect",
            skills: ["Cloud Architecture (AWS/Azure)", "Containerization & Docker", "CI/CD Pipeline Automation"],
        },
        {
            name: "Cloud-Native DevOps & Kubernetes Engineering",
            description: "[DEMO COURSE] Containerizing microservices, declarative Kubernetes manifests, GitOps with ArgoCD, and automated CI/CD pipelines.",
            provider: "PMKVY Partner: NIELIT New Delhi",
            difficulty: "ADVANCED",
            duration: "16 Weeks (320 Hours)",
            eligibility: "Working familiarity with Linux and basic container concepts",
            category: "Cloud Computing",
            jobRoleTitle: "DevOps Engineer",
            skills: ["Containerization & Docker", "Kubernetes Orchestration", "CI/CD Pipeline Automation", "Cloud Architecture (AWS/Azure)"],
        },
        {
            name: "Performance Digital Marketing & Search Optimization",
            description: "[DEMO COURSE] Technical SEO audits, paid search campaigns, conversion rate optimization, Google Analytics 4 tracking, and brand storytelling.",
            provider: "PMKVY Partner: Media & Entertainment Skills Council (MESC)",
            difficulty: "BEGINNER",
            duration: "10 Weeks (200 Hours)",
            eligibility: "12th Pass / Graduate in any discipline",
            category: "Digital Marketing",
            jobRoleTitle: "Digital Marketing Specialist",
            skills: ["Search Engine Optimization (SEO)", "Performance Marketing & SEM", "Web Analytics & GA4", "Content Strategy & Copywriting"],
        },
        {
            name: "Electric Vehicle Powertrain & BMS Engineering",
            description: "[DEMO COURSE] Traction motors, battery pack architecture, active cell balancing, thermal runaway prevention, and CAN bus diagnostics.",
            provider: "PMKVY Partner: Automotive Skills Development Council (ASDC)",
            difficulty: "INTERMEDIATE",
            duration: "18 Weeks (360 Hours)",
            eligibility: "Diploma / Degree in Mechanical, Electrical, or Automobile Engineering",
            category: "Electric Vehicle Technology",
            jobRoleTitle: "EV Powertrain & Battery Engineer",
            skills: ["EV Powertrain Systems", "Battery Management Systems (BMS)", "CAN Bus Protocol & Diagnostics", "EV Charging Infrastructure"],
        },
        {
            name: "EV Charging Infrastructure & Smart Grid Integration",
            description: "[DEMO COURSE] Fast charging protocols (CCS, CHAdeMO), safety standards, smart metering, and battery swapping station deployment.",
            provider: "PMKVY Partner: Power Sector Skill Council (PSSC)",
            difficulty: "BEGINNER",
            duration: "8 Weeks (160 Hours)",
            eligibility: "ITI / Diploma in Electrical Engineering",
            category: "Electric Vehicle Technology",
            jobRoleTitle: "EV Powertrain & Battery Engineer",
            skills: ["EV Charging Infrastructure", "CAN Bus Protocol & Diagnostics"],
        },
        {
            name: "Professional Workplace Communication & Agile Collaboration",
            description: "[DEMO COURSE] Essential professional competencies: active listening, cross-functional standups, technical documentation, and stakeholder presentations.",
            provider: "PMKVY Partner: Management & Entrepreneurship and Professional Skills Council (MEPSC)",
            difficulty: "BEGINNER",
            duration: "6 Weeks (120 Hours)",
            eligibility: "Open to all enrolled PMKVY candidates",
            category: "Soft Skills",
            skills: ["Technical Communication", "Team Collaboration & Agile Delivery", "Adaptability & Continuous Learning", "Time & Project Management"],
        },
        {
            name: "Foundations of JavaScript & Asynchronous Programming",
            description: "[DEMO COURSE] Core JS foundations, promises, async/await, closures, prototypes, and browser runtime APIs for junior developers.",
            provider: "PMKVY Partner: NASSCOM FutureSkills",
            difficulty: "BEGINNER",
            duration: "8 Weeks (160 Hours)",
            eligibility: "Basic computer familiarity",
            category: "Web Development",
            jobRoleTitle: "Frontend Specialist",
            skills: ["JavaScript (ES6+)", "HTML5 & Modern CSS"],
        },
        {
            name: "Practical Relational Database Design & Advanced SQL",
            description: "[DEMO COURSE] Relational algebra, normalization (1NF-3NF), window functions, indexing strategies, and database transaction locks.",
            provider: "PMKVY Partner: NIELIT Calicut",
            difficulty: "INTERMEDIATE",
            duration: "8 Weeks (160 Hours)",
            eligibility: "Basic familiarity with spreadsheets or programming",
            category: "Data Science",
            jobRoleTitle: "Data Analyst",
            skills: ["SQL & Relational Databases", "Problem Solving & Analytical Thinking"],
        },
        {
            name: "Ethical Hacking & Web Application Security (OWASP Top 10)",
            description: "[DEMO COURSE] Hands-on exploitation techniques, SQL injection, cross-site scripting (XSS), authentication bypass, and defensive remediation.",
            provider: "PMKVY Partner: DSCI Center of Excellence",
            difficulty: "INTERMEDIATE",
            duration: "12 Weeks (240 Hours)",
            eligibility: "Basic networking and web development awareness",
            category: "Cybersecurity",
            jobRoleTitle: "Cyber Security Analyst",
            skills: ["Ethical Hacking & Penetration Testing", "Network Security & Protocols"],
        },
    ];
    for (const c of coursesData) {
        const jobRole = c.jobRoleTitle ? createdJobRoles[c.jobRoleTitle] : null;
        const course = await prisma.trainingCourse.create({
            data: {
                name: c.name,
                description: c.description,
                provider: c.provider,
                difficulty: c.difficulty,
                duration: c.duration,
                eligibility: c.eligibility,
                category: c.category,
                isDemo: true,
                jobRoleId: jobRole ? jobRole.id : null,
            },
        });
        for (const skillName of c.skills) {
            const skill = createdSkills[skillName];
            if (skill) {
                await prisma.courseSkill.create({
                    data: {
                        courseId: course.id,
                        skillId: skill.id,
                    },
                });
            }
        }
    }
    console.log(`Created ${coursesData.length} training courses with skill mappings.`);
    // 6. Seed Demo Candidate with Assessment & Assessed Skills
    // Example matching the prompt's example:
    // Required: HTML: 90, CSS: 80, JavaScript: 90, React: 85, SQL: 70
    // Candidate: HTML: 80, CSS: 60, JavaScript: 40, React: 20, SQL: 50
    const fullStackRole = createdJobRoles["Full Stack Developer"];
    const candidateSkillsData = [
        { skill: "HTML5 & Modern CSS", prof: 70 },
        { skill: "JavaScript (ES6+)", prof: 45 },
        { skill: "TypeScript", prof: 35 },
        { skill: "React.js & Next.js", prof: 30 },
        { skill: "Node.js & Express", prof: 40 },
        { skill: "SQL & Relational Databases", prof: 50 },
        { skill: "Problem Solving & Analytical Thinking", prof: 65 },
        { skill: "Team Collaboration & Agile Delivery", prof: 70 },
        { skill: "Technical Communication", prof: 60 },
    ];
    for (const cs of candidateSkillsData) {
        const skill = createdSkills[cs.skill];
        if (skill) {
            await prisma.candidateSkill.create({
                data: {
                    userId: candidate.id,
                    skillId: skill.id,
                    proficiency: cs.prof,
                    verified: true,
                    lastAssessedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            });
            // Also create progress entries over the past 30 days
            await prisma.learningProgress.create({
                data: {
                    userId: candidate.id,
                    skillName: skill.name,
                    proficiency: Math.max(10, cs.prof - 20),
                    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                },
            });
            await prisma.learningProgress.create({
                data: {
                    userId: candidate.id,
                    skillName: skill.name,
                    proficiency: Math.max(15, cs.prof - 10),
                    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                },
            });
            await prisma.learningProgress.create({
                data: {
                    userId: candidate.id,
                    skillName: skill.name,
                    proficiency: cs.prof,
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                },
            });
        }
    }
    // Calculate assessment skill gap for Full Stack Developer
    // Skill Gap = (Required - Candidate) / Required * 100
    let totalGap = 0;
    let count = 0;
    for (const req of fullStackRole ? jobRolesData[0].requirements : []) {
        const cs = candidateSkillsData.find(c => c.skill === req.skill);
        const candidateProf = cs ? cs.prof : 0;
        const gap = Math.max(0, ((req.required - candidateProf) / req.required) * 100);
        totalGap += gap;
        count++;
    }
    const overallGap = count > 0 ? Math.round((totalGap / count) * 100) / 100 : 42.5;
    const assessment = await prisma.assessment.create({
        data: {
            userId: candidate.id,
            jobRoleId: fullStackRole.id,
            score: Math.round(100 - overallGap),
            skillGap: overallGap,
            status: "COMPLETED",
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
    });
    // Seed sample course enrollments for candidate
    const firstCourse = await prisma.trainingCourse.findFirst({
        where: { name: { contains: "Modern Full Stack" } },
    });
    if (firstCourse) {
        await prisma.courseEnrollment.create({
            data: {
                userId: candidate.id,
                courseId: firstCourse.id,
                status: "IN_PROGRESS",
                progress: 45,
                enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            },
        });
    }
    const secondCourse = await prisma.trainingCourse.findFirst({
        where: { name: { contains: "Front-End Web UI" } },
    });
    if (secondCourse) {
        await prisma.courseEnrollment.create({
            data: {
                userId: candidate.id,
                courseId: secondCourse.id,
                status: "COMPLETED",
                progress: 100,
                enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
        });
    }
    console.log("Seeded demo assessment and course enrollments for Rahul Sharma.");
    console.log("Seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
