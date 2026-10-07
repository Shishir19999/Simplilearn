/* Catalog data for the demo site. All figures are illustrative sample content. */
(function () {
  "use strict";

  var CATEGORIES = [
    { id: "data", name: "Data Science & Business Analytics" },
    { id: "ai", name: "AI & Machine Learning" },
    { id: "pm", name: "Project Management" },
    { id: "cyber", name: "Cyber Security" },
    { id: "cloud", name: "Cloud Computing" },
    { id: "devops", name: "DevOps" },
    { id: "biz", name: "Business and Leadership" },
    { id: "quality", name: "Quality Management" },
    { id: "dev", name: "Software Development" },
    { id: "agile", name: "Agile and Scrum" },
    { id: "itsm", name: "IT Service and Architecture" },
    { id: "marketing", name: "Digital Marketing" },
    { id: "bigdata", name: "Big Data" }
  ];

  var IMG = {
    caltech: "img/caltech office.avif",
    purdue: "img/purdue office.avif",
    umass: "img/umass-building.avif",
    none: ""
  };
  var LOGO = {
    caltech: "img/caltech-logo.svg",
    purdue: "img/purdue-logo.svg",
    umass: "img/umass-logo.svg",
    ibm: "img/ibm-logo.svg",
    azure: "img/azure-logo.svg",
    axelos: "img/axel-logo.png",
    cissp: "img/cissp logo.png",
    aws: "img/AWS.svg",
    microsoft: "img/Miscrosoft.svg",
    brown: "img/Brown.svg",
    wharton: "img/Wharton.svg",
    ucsd: "img/UCSD.svg"
  };

  // weeks = total duration, cohort = days from today until the next cohort starts
  var COURSES = [
    {
      id: "pgp-ai-ml", title: "Post Graduate Program in AI and Machine Learning", category: "ai",
      provider: "Caltech CTME", level: "Intermediate", weeks: 44, format: "Live online", price: 4500,
      rating: 4.6, ratings: 18240, learners: 31800, popular: true, cohort: 21, image: IMG.caltech, logo: LOGO.caltech,
      summary: "A university-led program covering machine learning, deep learning, NLP and generative AI, finished with a capstone built on real data.",
      highlights: ["Program completion certificate from Caltech CTME", "Caltech CTME Circle membership"],
      skills: ["Python", "scikit-learn", "TensorFlow", "NLP", "Generative AI"],
      modules: ["Python for data work", "Supervised and unsupervised learning", "Deep learning and computer vision", "Natural language processing", "Generative AI and capstone"]
    },
    {
      id: "pgp-pm", title: "Post Graduate Program in Project Management", category: "pm",
      provider: "UMass Amherst", level: "Intermediate", weeks: 44, format: "Live online", price: 3800,
      rating: 4.5, ratings: 9420, learners: 22100, popular: true, cohort: 14, image: IMG.umass, logo: LOGO.umass,
      summary: "Build planning, risk and stakeholder skills and prepare for PMP and CAPM with applied project simulations.",
      highlights: ["Post graduate certificate and alumni association membership", "Exam preparation for PMP and CAPM"],
      skills: ["Scope planning", "Risk management", "Stakeholder communication", "Agile delivery"],
      modules: ["Project management foundations", "Planning and scheduling", "Risk and quality", "Agile and hybrid delivery", "Capstone simulation"]
    },
    {
      id: "itil-4", title: "ITIL 4 Foundation", category: "itsm",
      provider: "AXELOS", level: "Beginner", weeks: 4, format: "Self-paced", price: 349,
      rating: 4.6, ratings: 21488, learners: 26400, popular: true, cohort: 3, image: IMG.none, logo: LOGO.axelos,
      summary: "Learn the service value system and the four dimensions of service management, then sit the foundation exam.",
      highlights: ["19 PDUs for self-paced learning", "22 PDUs for the online classroom flexi pass"],
      skills: ["Service value system", "Continual improvement", "Incident management"],
      modules: ["Key concepts of service management", "The four dimensions", "Service value chain", "ITIL practices", "Mock exams"]
    },
    {
      id: "pgp-cloud", title: "Post Graduate Program in Cloud Computing", category: "cloud",
      provider: "Caltech CTME", level: "Intermediate", weeks: 44, format: "Live online", price: 4200,
      rating: 4.5, ratings: 7210, learners: 14900, popular: true, cohort: 28, image: IMG.caltech, logo: LOGO.caltech,
      summary: "Design, secure and operate workloads on the major cloud platforms with hands-on labs and a multi-cloud capstone.",
      highlights: ["Caltech CTME post graduate certificate", "Up to 15 CEUs from Caltech CTME"],
      skills: ["AWS", "Azure", "Kubernetes", "Infrastructure as code"],
      modules: ["Cloud fundamentals", "Compute, storage and networking", "Containers and orchestration", "Security and governance", "Multi-cloud capstone"]
    },
    {
      id: "business-analyst", title: "Business Analyst Master's Program", category: "data",
      provider: "IBM", level: "Beginner", weeks: 26, format: "Live online", price: 1999,
      rating: 4.5, ratings: 73355, learners: 39600, popular: true, cohort: 10, image: IMG.none, logo: LOGO.ibm,
      summary: "Learn requirements gathering, process modelling and data analysis with 11 industry tools.",
      highlights: ["11 tools and a rigorous curriculum", "Master's certificate"],
      skills: ["Requirements analysis", "SQL", "Tableau", "Excel", "Process modelling"],
      modules: ["Business analysis essentials", "Requirements and documentation", "Data analysis with SQL and Excel", "Dashboards and storytelling", "Capstone project"]
    },
    {
      id: "cissp", title: "CISSP - Certified Information Systems Security Professional", category: "cyber",
      provider: "ISC2 prep", level: "Advanced", weeks: 8, format: "Live online", price: 1199,
      rating: 4.3, ratings: 3647, learners: 10600, popular: true, cohort: 6, image: IMG.none, logo: LOGO.cissp,
      summary: "Cover all eight CISSP domains with practice exams, led by instructors with field experience in security leadership.",
      highlights: ["Exam voucher included", "Eight domain deep dives"],
      skills: ["Risk management", "Security architecture", "Identity and access", "Security operations"],
      modules: ["Security and risk management", "Asset and communications security", "Security architecture and engineering", "Identity and access management", "Operations and software security"]
    },
    {
      id: "pgp-data-science", title: "Post Graduate Program in Data Science", category: "data",
      provider: "Purdue University", level: "Intermediate", weeks: 44, format: "Live online", price: 4000,
      rating: 4.5, ratings: 15880, learners: 28300, popular: true, cohort: 18, image: IMG.purdue, logo: LOGO.purdue,
      summary: "Master Python, statistics, machine learning and visualisation through masterclasses and three domain capstones.",
      highlights: ["Masterclasses by Purdue faculty and IBM experts", "Capstone projects in 3 domains"],
      skills: ["Python", "Statistics", "Machine learning", "Power BI"],
      modules: ["Python and statistics", "Data wrangling and visualisation", "Machine learning", "Big data tooling", "Capstone projects"]
    },
    {
      id: "azure-architect", title: "Azure Cloud Architect Master's Program", category: "cloud",
      provider: "Microsoft", level: "Advanced", weeks: 22, format: "Live online", price: 1799,
      rating: 4.6, ratings: 10023, learners: 22700, popular: true, cohort: 12, image: IMG.none, logo: LOGO.azure,
      summary: "Prepare for the Azure administrator and architect exams while designing resilient solutions across six tools.",
      highlights: ["6 tools and a rigorous curriculum", "Master's certificate"],
      skills: ["Azure networking", "Identity", "Cost governance", "Disaster recovery"],
      modules: ["Azure administration", "Networking and identity", "Storage and data platforms", "Architecture design", "Exam readiness"]
    },
    {
      id: "gen-ai", title: "Applied Generative AI Specialization", category: "ai",
      provider: "Purdue University", level: "Intermediate", weeks: 16, format: "Live online", price: 2300,
      rating: 4.7, ratings: 4120, learners: 12700, popular: false, cohort: 9, image: IMG.purdue, logo: LOGO.purdue,
      summary: "Learn prompt design, retrieval pipelines and evaluation to ship reliable generative AI features.",
      highlights: ["Hands-on labs with leading model APIs", "Capstone: build a retrieval assistant"],
      skills: ["Prompt design", "Retrieval pipelines", "Evaluation", "Responsible AI"],
      modules: ["Foundations of generative models", "Prompt engineering", "Retrieval and vector search", "Evaluation and safety", "Capstone"]
    },
    {
      id: "deep-learning", title: "Deep Learning with Keras and TensorFlow", category: "ai",
      provider: "Simplilearn Labs", level: "Advanced", weeks: 6, format: "Self-paced", price: 549,
      rating: 4.4, ratings: 6890, learners: 9800, popular: false, cohort: 2, image: IMG.none, logo: LOGO.ibm,
      summary: "Train and tune neural networks for images and sequences using notebooks you can reuse at work.",
      highlights: ["12 guided notebooks", "Model deployment walkthrough"],
      skills: ["Keras", "TensorFlow", "CNNs", "RNNs"],
      modules: ["Neural network basics", "Convolutional networks", "Sequence models", "Transfer learning", "Deploying models"]
    },
    {
      id: "pmp", title: "PMP Certification Training", category: "pm",
      provider: "PMI aligned", level: "Intermediate", weeks: 6, format: "Live online", price: 899,
      rating: 4.6, ratings: 25730, learners: 41200, popular: true, cohort: 5, image: IMG.none, logo: LOGO.axelos,
      summary: "Thirty-five contact hours, mock exams and coaching to help you prepare for the PMP exam.",
      highlights: ["35 contact hours", "Four full-length mock exams"],
      skills: ["Process groups", "Predictive and agile", "Business environment"],
      modules: ["People domain", "Process domain", "Business environment domain", "Exam strategy", "Mock exams"]
    },
    {
      id: "ceh", title: "Certified Ethical Hacker Prep", category: "cyber",
      provider: "EC-Council aligned", level: "Intermediate", weeks: 5, format: "Live online", price: 999,
      rating: 4.4, ratings: 5120, learners: 8700, popular: false, cohort: 8, image: IMG.none, logo: LOGO.cissp,
      summary: "Practise reconnaissance, exploitation and reporting in guided cyber range labs.",
      highlights: ["Virtual lab access for 6 months", "Exam readiness assessment"],
      skills: ["Penetration testing", "Network scanning", "Web app security"],
      modules: ["Footprinting and reconnaissance", "Scanning and enumeration", "System hacking", "Web application attacks", "Reporting"]
    },
    {
      id: "soc-analyst", title: "Security Operations Analyst Bootcamp", category: "cyber",
      provider: "Simplilearn Labs", level: "Beginner", weeks: 20, format: "Live online", price: 2100,
      rating: 4.5, ratings: 2310, learners: 5400, popular: false, cohort: 16, image: IMG.none, logo: LOGO.microsoft,
      summary: "Monitor, triage and respond to alerts using SIEM tooling and a playbook-driven approach.",
      highlights: ["SIEM lab environment", "Incident response tabletop"],
      skills: ["SIEM", "Threat hunting", "Incident response"],
      modules: ["Security foundations", "Log analysis", "Detection engineering", "Incident response", "Capstone"]
    },
    {
      id: "aws-architect", title: "AWS Solutions Architect Associate", category: "cloud",
      provider: "AWS aligned", level: "Intermediate", weeks: 8, format: "Self-paced", price: 649,
      rating: 4.7, ratings: 14390, learners: 24300, popular: true, cohort: 1, image: IMG.none, logo: LOGO.aws,
      summary: "Design secure and cost-aware architectures and prepare for the associate level exam.",
      highlights: ["Lab sandbox included", "Practice exam bank"],
      skills: ["EC2", "S3", "VPC", "IAM", "Well-Architected"],
      modules: ["Core services", "Networking with VPC", "Storage and databases", "Security and identity", "Exam practice"]
    },
    {
      id: "devops-engineer", title: "DevOps Engineer Master's Program", category: "devops",
      provider: "Purdue University", level: "Intermediate", weeks: 32, format: "Live online", price: 2700,
      rating: 4.5, ratings: 8650, learners: 17200, popular: true, cohort: 20, image: IMG.purdue, logo: LOGO.purdue,
      summary: "Automate build, test and release pipelines with containers, Git and infrastructure as code.",
      highlights: ["Jenkins, Docker and Kubernetes labs", "Capstone: ship a service end to end"],
      skills: ["Git", "CI/CD", "Docker", "Terraform", "Monitoring"],
      modules: ["Version control and CI", "Containers", "Orchestration", "Infrastructure as code", "Observability"]
    },
    {
      id: "kubernetes", title: "Kubernetes Administration Essentials", category: "devops",
      provider: "Simplilearn Labs", level: "Advanced", weeks: 4, format: "Self-paced", price: 399,
      rating: 4.4, ratings: 2980, learners: 6100, popular: false, cohort: 4, image: IMG.none, logo: LOGO.azure,
      summary: "Operate clusters with confidence: workloads, networking, storage and troubleshooting.",
      highlights: ["Six hands-on cluster labs", "Troubleshooting drills"],
      skills: ["kubectl", "Helm", "Networking", "Storage"],
      modules: ["Cluster architecture", "Workloads and scheduling", "Networking and ingress", "Storage", "Troubleshooting"]
    },
    {
      id: "exec-leadership", title: "Executive Leadership Program", category: "biz",
      provider: "Wharton aligned", level: "Advanced", weeks: 12, format: "Live online", price: 3200,
      rating: 4.6, ratings: 1840, learners: 3900, popular: false, cohort: 25, image: IMG.umass, logo: LOGO.wharton,
      summary: "Lead through change with frameworks for strategy, team performance and decision making.",
      highlights: ["Peer cohort of senior managers", "Personal leadership plan"],
      skills: ["Strategy", "Change leadership", "Coaching", "Decision making"],
      modules: ["Leading yourself", "Leading teams", "Strategy execution", "Managing change", "Leadership plan"]
    },
    {
      id: "product-management", title: "Product Management Certificate", category: "biz",
      provider: "UMass Amherst", level: "Beginner", weeks: 20, format: "Live online", price: 2400,
      rating: 4.5, ratings: 3260, learners: 7600, popular: false, cohort: 11, image: IMG.umass, logo: LOGO.umass,
      summary: "Go from discovery to launch: customer research, roadmaps, metrics and stakeholder management.",
      highlights: ["Build a product case study", "Mentor feedback on your portfolio"],
      skills: ["Discovery", "Roadmapping", "Metrics", "Prioritisation"],
      modules: ["Product thinking", "Customer discovery", "Roadmaps and prioritisation", "Metrics", "Launch portfolio"]
    },
    {
      id: "six-sigma-green", title: "Lean Six Sigma Green Belt", category: "quality",
      provider: "IASSC aligned", level: "Beginner", weeks: 5, format: "Self-paced", price: 499,
      rating: 4.5, ratings: 11940, learners: 19500, popular: false, cohort: 2, image: IMG.none, logo: LOGO.brown,
      summary: "Apply DMAIC to reduce defects and variation, with project templates you can use immediately.",
      highlights: ["Two real-world projects", "Exam voucher available"],
      skills: ["DMAIC", "Process mapping", "Statistical analysis"],
      modules: ["Define", "Measure", "Analyze", "Improve", "Control"]
    },
    {
      id: "six-sigma-black", title: "Lean Six Sigma Black Belt", category: "quality",
      provider: "IASSC aligned", level: "Advanced", weeks: 14, format: "Live online", price: 1499,
      rating: 4.4, ratings: 4880, learners: 8200, popular: false, cohort: 15, image: IMG.none, logo: LOGO.brown,
      summary: "Lead cross-functional improvement projects using advanced statistics and change management.",
      highlights: ["Advanced statistical tooling", "Project coaching"],
      skills: ["Design of experiments", "Regression", "Change management"],
      modules: ["Leading improvement", "Advanced measurement", "Hypothesis testing", "Design of experiments", "Sustaining gains"]
    },
    {
      id: "full-stack", title: "Full Stack Developer Program", category: "dev",
      provider: "Purdue University", level: "Beginner", weeks: 36, format: "Live online", price: 3100,
      rating: 4.6, ratings: 9770, learners: 20800, popular: true, cohort: 13, image: IMG.purdue, logo: LOGO.purdue,
      summary: "Learn HTML, CSS, JavaScript, Node.js and databases by building and deploying real applications.",
      highlights: ["Eight portfolio projects", "Career services support"],
      skills: ["JavaScript", "React", "Node.js", "SQL"],
      modules: ["Web foundations", "JavaScript in depth", "Front-end frameworks", "Back-end services", "Deployment and capstone"]
    },
    {
      id: "java-dev", title: "Java Developer Certification", category: "dev",
      provider: "Simplilearn Labs", level: "Beginner", weeks: 10, format: "Self-paced", price: 579,
      rating: 4.4, ratings: 7540, learners: 12900, popular: false, cohort: 3, image: IMG.none, logo: LOGO.ibm,
      summary: "From syntax to Spring: write, test and package Java services.",
      highlights: ["Project-based assessments", "Spring Boot module"],
      skills: ["Java", "OOP", "Spring Boot", "JUnit"],
      modules: ["Java basics", "Object-oriented design", "Collections and streams", "Spring Boot", "Testing"]
    },
    {
      id: "csm", title: "Certified ScrumMaster (CSM)", category: "agile",
      provider: "Scrum Alliance aligned", level: "Beginner", weeks: 2, format: "Live online", price: 799,
      rating: 4.7, ratings: 17800, learners: 29700, popular: true, cohort: 4, image: IMG.none, logo: LOGO.ucsd,
      summary: "Two live days covering the Scrum framework, team coaching and facilitation techniques.",
      highlights: ["16 hours of live instruction", "Certification exam guidance"],
      skills: ["Scrum events", "Backlog refinement", "Facilitation"],
      modules: ["Agile mindset", "Scrum roles and events", "Backlog and estimation", "Coaching the team"]
    },
    {
      id: "safe-agilist", title: "SAFe Agilist Certification", category: "agile",
      provider: "Scaled Agile aligned", level: "Intermediate", weeks: 2, format: "Live online", price: 899,
      rating: 4.5, ratings: 5210, learners: 9100, popular: false, cohort: 7, image: IMG.none, logo: LOGO.ucsd,
      summary: "Scale agile across teams with lean portfolio, program increment planning and value streams.",
      highlights: ["Two-day instructor-led course", "Exam preparation"],
      skills: ["PI planning", "Value streams", "Lean portfolio"],
      modules: ["Lean-agile leadership", "Value streams", "Program increments", "Portfolio level"]
    },
    {
      id: "togaf", title: "TOGAF Enterprise Architecture", category: "itsm",
      provider: "Open Group aligned", level: "Advanced", weeks: 6, format: "Live online", price: 1099,
      rating: 4.3, ratings: 2150, learners: 4800, popular: false, cohort: 19, image: IMG.none, logo: LOGO.axelos,
      summary: "Apply the architecture development method to align business strategy and technology.",
      highlights: ["Two-level exam preparation", "Case study workshop"],
      skills: ["ADM", "Architecture governance", "Capability planning"],
      modules: ["Foundations", "Architecture development method", "Governance", "Content framework", "Exam practice"]
    },
    {
      id: "digital-marketing", title: "Digital Marketing Professional Certificate", category: "marketing",
      provider: "Purdue University", level: "Beginner", weeks: 24, format: "Live online", price: 2200,
      rating: 4.5, ratings: 6310, learners: 13400, popular: true, cohort: 17, image: IMG.purdue, logo: LOGO.purdue,
      summary: "Plan and measure campaigns across search, social, email and analytics.",
      highlights: ["Run a live campaign", "Tools: GA4, Ads, CRM"],
      skills: ["SEO", "Paid media", "Email marketing", "Analytics"],
      modules: ["Marketing strategy", "Search and content", "Paid and social", "Email and automation", "Analytics and reporting"]
    },
    {
      id: "seo-essentials", title: "SEO and Content Strategy Essentials", category: "marketing",
      provider: "Simplilearn Labs", level: "Beginner", weeks: 3, format: "Self-paced", price: 199,
      rating: 4.3, ratings: 3420, learners: 6700, popular: false, cohort: 1, image: IMG.none, logo: LOGO.microsoft,
      summary: "Research keywords, plan content clusters and improve technical SEO fundamentals.",
      highlights: ["Keyword research templates", "Site audit checklist"],
      skills: ["Keyword research", "On-page SEO", "Content planning"],
      modules: ["How search works", "Keyword research", "On-page and technical SEO", "Content planning"]
    },
    {
      id: "big-data-engineer", title: "Big Data Engineer Master's Program", category: "bigdata",
      provider: "IBM", level: "Advanced", weeks: 30, format: "Live online", price: 2500,
      rating: 4.4, ratings: 8120, learners: 15600, popular: false, cohort: 22, image: IMG.none, logo: LOGO.ibm,
      summary: "Build batch and streaming pipelines with Spark, Kafka and modern lakehouse tooling.",
      highlights: ["Hands-on Spark and Kafka labs", "Capstone: streaming pipeline"],
      skills: ["Spark", "Kafka", "Hive", "Data modelling"],
      modules: ["Distributed systems", "Spark in depth", "Streaming with Kafka", "Data lakes", "Capstone"]
    },
    {
      id: "hadoop-spark", title: "Big Data Hadoop and Spark Developer", category: "bigdata",
      provider: "Simplilearn Labs", level: "Intermediate", weeks: 7, format: "Self-paced", price: 629,
      rating: 4.5, ratings: 12480, learners: 18300, popular: false, cohort: 2, image: IMG.none, logo: LOGO.ibm,
      summary: "Process large datasets with HDFS, MapReduce and Spark using guided practice clusters.",
      highlights: ["Practice cluster access", "Four industry projects"],
      skills: ["HDFS", "MapReduce", "Spark SQL"],
      modules: ["Hadoop ecosystem", "MapReduce", "Spark core", "Spark SQL", "Projects"]
    }
  ];

  var TESTIMONIALS = [
    { name: "Priya Nair", role: "Data Analyst, retail", course: "Post Graduate Program in Data Science", quote: "The capstone gave me a project I could walk through in interviews. I moved from reporting to a modelling role within five months of finishing." },
    { name: "Daniel Okafor", role: "Cloud Engineer", course: "AWS Solutions Architect Associate", quote: "Short, practical labs and a solid practice exam bank. I passed on my first attempt and my team now asks me to review designs." },
    { name: "Marta Kowalski", role: "Project Manager, logistics", course: "PMP Certification Training", quote: "Live sessions with real scheduling scenarios made the exam material stick. The mock exams matched the real thing closely." },
    { name: "Arjun Mehta", role: "Software Engineer", course: "Full Stack Developer Program", quote: "Mentor reviews on every project helped me fix habits early. I shipped my first production feature during the course." },
    { name: "Lena Fischer", role: "Security Analyst", course: "Security Operations Analyst Bootcamp", quote: "The incident response tabletop was the best part. It felt like the first week on the job, minus the pressure." }
  ];

  window.SL = window.SL || {};
  window.SL.data = { CATEGORIES: CATEGORIES, COURSES: COURSES, TESTIMONIALS: TESTIMONIALS };
})();
