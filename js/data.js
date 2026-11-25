/* PYXON website content. Source: Corporate Profile V17.4 (Global, EN), Solution Briefs V17 (Global, EN),
   PYXON Videos and Links 2026 V1, Website Content Split v1.1. Keep wording aligned with those files. */

window.PYX = {
  tagline: 'Intelligence Built for Reality.',
  email: 'info@pyxon.com',
  careersEmail: 'hr@pyxon.com',
  links: {
    labs: 'https://www.pyxon.ai/',
    youtube: 'https://www.youtube.com/@pyxonai',
    linkedin: 'https://www.linkedin.com/company/pyxon',
    balsam: 'https://benchmarks.ksaa.gov.sa/b/balsam/leaderboard/table-view?version=2',
    paper1: 'https://link.springer.com/chapter/10.1007/978-3-032-23271-7_18',
    paper2: 'https://link.springer.com/chapter/10.1007/978-3-032-23347-9_2',
    mpGov: 'https://marketplace.microsoft.com/en-us/product/pyxonsystems1777200786956.pyxongovinsight?tab=Overview',
    mpEdu: 'https://marketplace.microsoft.com/en-us/product/pyxonsystems1777200786956.pyxongedubridge?tab=Overview',
    aigp: 'https://www.pyxon.ai/aigp-exam'
  },

  /* Global presence: the world is the stage. No offices are named on the site. */
  cities: [
    /* major: larger dot and label */
    { city: 'London', lat: 51.51, lon: -0.13, major: 1 }, { city: 'New York', lat: 40.71, lon: -74.0, major: 1 },
    { city: 'Texas', lat: 30.27, lon: -97.74, major: 1 }, { city: 'Washington, D.C.', lat: 38.9, lon: -77.04, major: 1 },
    { city: 'Amman', lat: 31.95, lon: 35.93, major: 1 }, { city: 'Cairo', lat: 30.04, lon: 31.24, major: 1 },
    { city: 'Rabat', lat: 34.02, lon: -6.84, major: 1 }, { city: 'Casablanca', lat: 33.57, lon: -7.59, major: 1 },
    { city: 'Riyadh', lat: 24.71, lon: 46.68, major: 1 }, { city: 'Dubai', lat: 25.2, lon: 55.27, major: 1 },
    { city: 'Bangalore', lat: 12.97, lon: 77.59, major: 1 }, { city: 'Singapore', lat: 1.35, lon: 103.82, major: 1 },
    { city: 'Hong Kong', lat: 22.32, lon: 114.17, major: 1 }, { city: 'Tokyo', lat: 35.68, lon: 139.69, major: 1 },
    { city: 'Beijing', lat: 39.9, lon: 116.4, major: 1 }, { city: 'Paris', lat: 48.86, lon: 2.35, major: 1 },
    { city: 'Berlin', lat: 52.52, lon: 13.4, major: 1 }, { city: 'Sydney', lat: -33.87, lon: 151.21, major: 1 },
    { city: 'São Paulo', lat: -23.55, lon: -46.63, major: 1 }, { city: 'Johannesburg', lat: -26.2, lon: 28.05, major: 1 },
    { city: 'Abu Dhabi', lat: 24.45, lon: 54.38 }, { city: 'Doha', lat: 25.29, lon: 51.53 }, { city: 'Kuwait City', lat: 29.38, lon: 47.99 },
    { city: 'Manama', lat: 26.23, lon: 50.59 }, { city: 'Muscat', lat: 23.59, lon: 58.41 }, { city: 'Jeddah', lat: 21.49, lon: 39.19 },
    { city: 'Istanbul', lat: 41.01, lon: 28.98 }, { city: 'Madrid', lat: 40.42, lon: -3.7 }, { city: 'Rome', lat: 41.9, lon: 12.5 },
    { city: 'Amsterdam', lat: 52.37, lon: 4.9 }, { city: 'Frankfurt', lat: 50.11, lon: 8.68 }, { city: 'Zurich', lat: 47.38, lon: 8.54 },
    { city: 'Stockholm', lat: 59.33, lon: 18.07 }, { city: 'Toronto', lat: 43.65, lon: -79.38 }, { city: 'San Francisco', lat: 37.77, lon: -122.42 },
    { city: 'Mexico City', lat: 19.43, lon: -99.13 }, { city: 'Buenos Aires', lat: -34.6, lon: -58.38 }, { city: 'Lagos', lat: 6.52, lon: 3.38 },
    { city: 'Nairobi', lat: -1.29, lon: 36.82 }, { city: 'Mumbai', lat: 19.08, lon: 72.88 }, { city: 'New Delhi', lat: 28.61, lon: 77.21 },
    { city: 'Shanghai', lat: 31.23, lon: 121.47 }, { city: 'Seoul', lat: 37.57, lon: 126.98 }, { city: 'Jakarta', lat: -6.2, lon: 106.85 },
    { city: 'Kuala Lumpur', lat: 3.14, lon: 101.69 }
  ],
  worldClocks: [['London', 'Europe/London'], ['Dubai', 'Asia/Dubai'], ['Singapore', 'Asia/Singapore'], ['New York', 'America/New_York']],
  regions: [
    { name: 'Middle East and Africa', cities: 'Riyadh, Dubai, Abu Dhabi, Doha, Amman, Cairo, Rabat, Casablanca, Johannesburg' },
    { name: 'Europe', cities: 'London, Paris, Berlin, Frankfurt, Amsterdam, Istanbul' },
    { name: 'Asia Pacific', cities: 'Bangalore, Mumbai, Singapore, Hong Kong, Tokyo, Sydney' },
    { name: 'Americas', cities: 'New York, Washington, D.C., Texas, Toronto, São Paulo' }
  ],

  partners: [
    { id: 'microsoft', name: 'Microsoft', logo: 'assets/partners/microsoft.svg', role: 'Marketplace and cloud partner', text: 'Gov-Insight and Edu-Bridge are live on Microsoft Marketplace, so Microsoft customers worldwide can discover them and buy them through the Marketplace.', link: 'mpGov', linkText: 'See Gov-Insight on the Marketplace' },
    { id: 'aws', name: 'AWS', logo: 'assets/partners/aws.svg', role: 'Cloud partner', text: 'Run PYXON-Eye on AWS, in the cloud region where your data has to stay, next to the systems you already host there.' },
    { id: 'cohere', name: 'Cohere', logo: 'assets/partners/cohere.svg', role: 'Enterprise AI model partner', text: "Cohere's enterprise models and platform, together with PYXON's Arabic-first solutions, local deployment and regional expertise. Deployable in the cloud, on-premises or hybrid, for sovereign AI, regulated industries and commercial organisations." },
    { id: 'huawei', name: 'Huawei', logo: 'assets/partners/huawei.svg', role: 'Cloud and infrastructure partner', text: 'PYXON-Eye on Huawei Cloud and infrastructure, for governments and enterprises that build on Huawei technology.' }
  ],

  /* News: events attended and company news, newest first. cat: Events, Company, Research and Labs */
  news: [
    { date: 'November 2026', cat: 'Company', title: 'Meet PYXI, the falcon behind PYXON-Eye.', text: 'PYXON introduces PYXI, a small falcon who brings PYXON-Eye to life. His first story is a short video about a late night, a pile of reports and an answer that arrives with the sunrise. Watch until the end: he has something to say.', img: 'assets/pyxi/pyxi-fly.webp', video: 'pyxi-launch', needsPyxi: 1 },
    { date: 'November 2026', cat: 'Company', title: 'Gov-Insight and Edu-Bridge are live on Microsoft Marketplace.', text: 'Two PYXON solutions are now published on Microsoft Marketplace, discoverable by Microsoft customers worldwide, with procurement through the Marketplace.', img: 'assets/img/icon-govinsight.png', contain: 1, link: 'mpGov', linkText: 'View on Microsoft Marketplace' },
    { date: '6 to 7 October 2026', cat: 'Events', place: 'ADNEC, Abu Dhabi', title: 'PYXON at AI Everything, Abu Dhabi.', text: 'The PYXON team presented PYXON-Eye at AI Everything in Abu Dhabi, where The Loom, the PYXON-Eye brand video, made its debut.', img: 'assets/video/loom.webp', video: 'loom', yt: '_7J3R_PWp84' },
    { date: 'September 2026', cat: 'Research and Labs', title: 'A 1.5B Arabic model that leads the small models on Balsam.', text: "PYXON entered the Balsam Benchmark of the King Salman Global Academy for Arabic Language. Its 1.5B-parameter model scored ahead of much larger models in RAG tasks, leading the benchmark's small Arabic models.", img: 'assets/img/balsam-sphere.webp', link: 'balsam', linkText: 'See the Balsam leaderboard' },
    { date: 'September 2026', cat: 'Events', place: 'Riyadh', title: 'PYXON at the Saudi Warehousing and Logistics Expo.', text: 'The team met warehousing, logistics and supply chain leaders in Riyadh to talk about connected sites, fleets and stock, and how PYXON-Eye brings them into one view.', img: 'assets/video/iot.webp' },
    { date: '23 September 2026', cat: 'Company', title: 'Celebrating Saudi National Day.', text: 'A short 3D video from PYXON to mark Saudi National Day 2026.', img: 'assets/video/saudi-day.webp', video: 'saudi-day' },
    { date: '3 September 2026', cat: 'Events', place: 'LEAP 2026, Riyadh', title: 'PYXON and Cohere align at LEAP 2026.', text: "On the last day of LEAP, the PYXON and Cohere teams met to align on bringing Cohere's enterprise models together with PYXON's Arabic-first solutions and local deployment.", img: 'assets/partners/cohere.svg', contain: 1, link: '#partners', linkText: 'Our partners' },
    { date: '31 August to 3 September 2026', cat: 'Events', place: 'Riyadh Exhibition and Convention Center, Malham', title: 'PYXON exhibits at LEAP 2026 and DeepFest.', text: 'Four days in Riyadh with government and enterprise visitors, showing PYXON-Eye, the solution families and the work of PYXON AI Labs.', img: 'assets/video/leap.webp', video: 'leap' },
    { date: 'August 2026', cat: 'Research and Labs', title: 'PYXON txt2KG: documents in, knowledge graphs out.', text: 'An edge model on Ollama that turns document text into a structured Mermaid knowledge graph instead of chat prose, ready for RAG pipelines and legal document workflows.', img: 'assets/img/cubes-shelf.webp', url: 'https://ollama.com/enghamzasalem77/pyxon-txt2kg', linkText: 'PYXON txt2KG on Ollama' },
    { date: 'July 2026', cat: 'Research and Labs', title: 'PYXON SLLM v0: Arabic-first, on-device and free.', text: 'PYXON AI Labs released an Arabic-first small language model that runs entirely on edge devices. About 1.5B parameters, a 32K context window, free on Ollama.', img: 'assets/img/chess.webp', url: 'https://ollama.com/enghamzasalem77/pyxon-sllm-v0', linkText: 'PYXON SLLM v0 on Ollama' },
    { date: 'July 2026', cat: 'Research and Labs', title: 'Two PYXON papers published by Springer at AINA 2026.', text: 'One shows retrieval lifting small on-device models from as low as 20% to 100% accuracy on domain questions. The other maps prompt injection, which succeeded in over 84% of agent-based tests, and a new token drain attack.', img: 'assets/img/labs-flask.webp', link: 'paper1', linkText: 'Read the RAG paper on Springer' },
    { date: '23 July 2026', cat: 'Research and Labs', title: 'A free AIGP practice exam, built by PYXON.', text: '75 randomised questions for the IAPP AI Governance Professional certification, covering AI ethics, governance frameworks, security, risk and core machine learning. No account, no payment.', img: 'assets/img/key-hall.webp', link: 'aigp', linkText: 'Take the practice exam' },
    { date: 'July 2026', cat: 'Events', place: 'Khalifa University, Abu Dhabi', title: 'NotebookLM as Co-Researcher, a workshop at Khalifa University.', text: 'Dr. Hamza Salem led an interactive workshop for the researchers and management staff of RIC2D and ARIC on source-grounded AI: RAG versus traditional LLMs, citations for every claim, and making AI say "I don\'t know".', img: 'assets/news/khalifa.webp' }
  ],

  journey: [
    { stage: 'Stage 01', year: '2015', title: 'The company founded', text: 'An IT services provider, with research and development roots in London.' },
    { stage: 'Stage 02', year: '2023', title: 'PYXON Labs', text: 'Innovation center launched: scientists and architects building genuine AI.' },
    { stage: 'Stage 03', year: '2025', title: 'Rebranded and launched', text: 'Innovative AI solutions and services, on one AI-native framework.' }
  ],
  pillars: [
    { title: 'PYXON AI Technologies and Solutions', text: 'Genuine AI products and industry-specific solutions.' },
    { title: 'PYXON Partner Network', text: 'A global partnership program with Microsoft, AWS, Cohere and Huawei, reaching governments and enterprises in every region.' },
    { title: 'AI Professional Community and Research Labs', text: 'Scientists and architects driving genuine AI solutions and research.' }
  ],

  why: [
    { icon: 'shield', title: 'Sovereign by design', text: 'Runs entirely in your environment: on-premises, private cloud, hybrid or air-gapped. Data is read in place; nothing is copied, nothing leaves.' },
    { icon: 'context', title: 'Context, not just models', text: 'PYXON-CORE builds a governed context above your systems, so any AI model reasons on your reality with less data preparation and less compute.' },
    { icon: 'arabic', title: 'Arabic-first, benchmarked', text: 'PYXON AI Labs publishes original Arabic research that outperforms big-tech baselines in semantic search, on-device RAG and AI-text detection.' },
    { icon: 'stack', title: 'Ready-to-deploy vertical solutions', text: 'Gov-Insight, Edu-Bridge, Enterprise-Insight, IoT-Insight, PYXON-Shield and industry solutions, all on one engine, one governance and one set of connectors.' },
    { icon: 'swap', title: 'Model-agnostic and efficient', text: 'Local or cloud models, swappable at any time, compatible with the international AI players, and optimized for lower infrastructure and token load.' },
    { icon: 'globe', title: 'Global reach, global partners', text: 'Strong managed-service and Telco experience, and a global partner network with Microsoft, AWS, Cohere and Huawei that extends PYXON-Eye across models, devices and cloud.' }
  ],

  services: [
    { title: 'AI Enablement', text: 'Artificial Intelligence enablement across data and the business environment.' },
    { title: 'Deep enhancement', text: 'Deep enhancement and development on AI functions.' },
    { title: 'Industry-specific solutions', text: 'Purpose-built AI products designed for the realities of each sector and operating environment.' },
    { title: 'Local AI talent', text: 'Local AI talents and capacity building.' },
    { title: 'AI training', text: 'AI professional training programs.' }
  ],

  gap: [
    { title: 'Fragmented data landscape', text: 'Your information lives across silos, formats and source systems, with no single source of truth for AI to learn from.', img: 'assets/img/cubes-shelf.webp', alt: 'Two separate cubes on an oak shelf, unconnected' },
    { title: 'Integration and cleansing debt', text: 'Every new data source demands custom connectors, reconciliation and cleansing before a model can even begin to reason on it.', img: 'assets/img/loom-room.webp', alt: 'Raw thread spools waiting beside a loom' },
    { title: 'Purpose-built models, every time', text: 'Each business objective requires its own data model, designed, trained and validated from scratch.', img: 'assets/img/chess.webp', alt: 'A single chess move, planned from scratch' },
    { title: 'Language and cultural misalignment', text: 'Global AI is trained for other markets. It does not speak your language, understand your context, or reason inside your regulatory environment.', img: 'assets/img/gen-global.webp', alt: 'A porcelain globe wrapped in a blue ribbon' },
    { title: 'Talent, time and cost', text: 'Specialized AI engineers are scarce. Deployment cycles stretch into quarters. Budgets escalate long before value arrives.', img: 'assets/img/labs-flask.webp', alt: 'A glass flask in a quiet lab' },
    { title: 'Hardware and consumption cost', text: 'AI workloads demand powerful hardware and energy, so infrastructure and running costs climb before value arrives.', img: 'assets/img/balsam-sphere.webp', alt: 'Heavy stone spheres on a plinth' }
  ],

  layers: [
    { n: 'L4', name: 'AI Solutions', tag: 'Interface', sub: 'Domain intelligence solutions', text: 'Government, enterprises, education, smart solutions, cyber security, logistics and industry-specific platforms, delivered through PYXON Studio.' },
    { n: 'L3', name: 'Decision Agentic Interface', tag: 'Agents', sub: 'Agentic actions', text: 'AI agents that plan, reason and execute across your ecosystem, with human approval for sensitive actions.' },
    { n: 'L2', name: 'Data Understanding', tag: 'Understanding', sub: 'Build contextual data models', text: 'PYXON-CORE, the Contextual Intelligence and Reasoning Engine, builds contexts above every source.' },
    { n: 'L1', name: 'Data Connectivity', tag: 'Data', sub: 'Secured, governed and predefined connectors', text: 'Internal systems and external signals connected in place: data lakes, files, MCPs and APIs, national databases and more.' }
  ],

  capabilities: [
    { icon: 'cpu', title: 'Advanced processes', text: 'Enhanced reasoning, on-device RAG and intelligent data understanding.' },
    { icon: 'stack', title: 'Ready-to-deploy', text: 'A platform for generating industry-specific AI solutions and use cases.' },
    { icon: 'flow', title: 'Data orchestration', text: 'AI-powered data orchestration across every source.' },
    { icon: 'plug', title: 'Ready connectors', text: 'Ready data connectors for rapid integration.' },
    { icon: 'swap', title: 'Works with any LLM', text: 'Aligned with any LLM: local, cloud or hybrid, under your control.' },
    { icon: 'globe', title: 'External ingestion', text: 'Intelligent ingestion of external and published data sources.' },
    { icon: 'leaf', title: 'Lower consumption', text: 'Lower power consumption and lighter infrastructure requirements.' }
  ],

  core: [
    { from: 'Copied into pipelines and lakes before AI can use it', to: 'Read in place, governed, nothing retained', area: 'Data' },
    { from: 'One vendor, one model, a rebuild to change', to: 'Any model, swapped in without a rebuild', area: 'Models' },
    { from: 'Whole document sets sent to the model', to: 'A focused slice: fewer tokens, less hallucination', area: 'Tokens' },
    { from: 'GPU-bound at every step', to: 'CPU-first context and retrieval; GPU only where it earns it', area: 'Compute' }
  ],

  studio: [
    { title: 'Conversational workspace', text: 'Ask in Arabic or English, by voice or text. The answer comes with its sources.' },
    { title: 'Dashboards and evidence', text: 'Executive views where every figure is traced to the record behind it.' },
    { title: 'Agent approvals', text: 'Agents recommend and prepare; a named person approves sensitive actions.' },
    { title: 'Roles and audit', text: 'Role-based access, masking before any model, and a full audit trail.' }
  ],
  engine: [
    { title: 'Data connectivity', text: 'Ready connectors read databases, files, APIs and live signals in place, with nothing copied out.' },
    { title: 'PYXON-CORE context engine', text: 'Builds contextual data models and reasoning over your data, with on-device RAG.' },
    { title: 'Model and agent orchestration', text: 'Runs any LLM, local, cloud or hybrid, and coordinates agents and workflows.' },
    { title: 'Security and governance', text: 'Masking before any model, role-based access and a full audit trail.' }
  ],

  labsProducts: [
    { icon: 'shield', title: 'Governance Packages', text: 'Library and CLI for country-aware AI governance scoring, on SDAIA and UAE benchmarks.' },
    { icon: 'cpu', title: 'Small and RAG LLMs', text: 'Pyxon-SLLM-RAG-v3 (1.5B): Arabic-first RAG model, running on-device and fully offline.' },
    { icon: 'scan', title: 'Vision Model', text: 'pyxon-vision-ar: under 1.5B parameters, excelling at Arabic text and handwriting.' },
    { icon: 'wave', title: 'Arabic Text-to-Speech', text: 'Natural Arabic speech, including the Saudi dialect.' },
    { icon: 'flow', title: 'Embedding Models', text: 'General embedding models that outperform the top Arabic embedding models.' },
    { icon: 'eye', title: 'PYXON-Eye', text: 'The platform to build context for agentic AI, from your own data.' },
    { icon: 'note', title: 'PYXON Notebook', text: 'An offline AI notebook: research and reason over your documents, fully private.' },
    { icon: 'bot', title: 'PYXON Agent', text: 'PYXON Officer: an AI agent for quality assurance and web penetration testing.' }
  ],

  balsam: [
    { cat: 'Machine translation and transliteration', rows: [['PYXON SLLM RAG v3', 0.691, 1], ['GPT-5.2 Reasoning', 0.680], ['Claude Opus 4.5', 0.609], ['Jais 2 70B', 0.569]] },
    { cat: 'Summarisation', rows: [['PYXON SLLM RAG v3', 0.516, 1], ['GPT-5.2 Reasoning', 0.515], ['Claude Opus 4.5', 0.499], ['Jais 2 70B', 0.478]] },
    { cat: 'Program execution', rows: [['PYXON SLLM RAG v3', 0.694, 1], ['Llama 4 Maverick', 0.643], ['Jais 2 70B', 0.632], ['Claude Opus 4.5', 0.565]] }
  ],

  papers: [
    { status: 'Published', title: 'Enhancing Weak LLM Performance on Edge Devices Through Retrieval-Augmented Generation: A Benchmark Study', venue: 'AINA 2026, Springer, pp. 214 to 222', key: 'paper1', note: 'Small on-device models paired with RAG rose from as low as 20% to 100% accuracy on domain questions, without a bigger model.' },
    { status: 'Published', title: 'Adversarial Attacks on Large Language Model Applications: Prompt Injection and Token Drain Exploitation', venue: 'AINA 2026, Springer, pp. 16 to 27', key: 'paper2', note: 'How prompt injection and token drain work against LLM applications, and how to defend them.' },
    { status: 'In review', title: 'Policy to Controls: Scoring LLMs and RAG Systems for Country-Aware AI Governance', venue: 'PYXON AI Department with Innopolis University', note: 'Turns national AI policy into measurable controls for LLM and RAG deployments.' },
    { status: 'In review', title: "Improving Embedding Models' Semantic Search Using a PYXON Reasoning Model in Arabic", venue: 'PYXON AI Department with Innopolis University', note: 'A PYXON reasoning model that lifts the quality of Arabic semantic search.' },
    { status: 'In review', title: 'LLMs Do Not Get It: PYXON Benchmark for Arabic Poems', venue: 'PYXON AI Department with Kafrelsheikh University and Innopolis University', note: 'Where general LLMs fail on Arabic poetry: meter, rhyme and rhetoric.' }
  ],

  /* Videos. group decides the section on the Videos page; sol links a video to a solution page; needsPyxi waits for the PYXI file. */
  films: [
    { id: 'pyxi', group: 'PYXON and PYXON-Eye', title: 'Meet PYXI: Small wings. Big possibilities.', text: 'The first story of PYXI, the falcon behind PYXON-Eye.', poster: 'assets/pyxi/pyxi-fly.webp', loop: '', film: 'pyxi-launch', needsPyxi: 1 },
    { id: 'brand', group: 'PYXON and PYXON-Eye', title: 'The Loom: Intelligence Built for Reality', text: 'The PYXON brand video: contextual intelligence for the real world.', yt: '_7J3R_PWp84', poster: 'assets/video/loom.webp', loop: 'loom', film: 'loom' },
    { id: 'eye', group: 'PYXON and PYXON-Eye', title: 'PYXON-Eye: See Everything, Decide with Confidence', text: 'The PYXON-Eye platform, from data collection to agentic action.', yt: '0OAWAEbgK-o', poster: 'assets/video/eye.webp', loop: 'eye', film: 'eye' },
    { id: 'eye-ar', group: 'PYXON and PYXON-Eye', lang: 'AR', title: 'PYXON-Eye: Introduction, in Arabic', text: 'The PYXON-Eye introduction, narrated in Arabic.', poster: 'assets/video/eye-ar.webp', film: 'eye-ar' },
    { id: 'brand-film', group: 'PYXON and PYXON-Eye', title: 'PYXON-Eye: The Brand Video', text: 'Eleven systems, one context. The long-form PYXON-Eye brand video.', poster: 'assets/video/brand-film.webp', film: 'brand-film' },
    { id: 'gov', group: 'Solutions', sol: 'gov-insight', title: 'Gov-Insight: Decision Intelligence for Government', text: 'Decision intelligence for ministries, authorities and municipalities.', yt: 'Ma_SsGe4uPg', poster: 'assets/video/gov.webp', loop: 'gov', film: 'gov' },
    { id: 'edu', group: 'Solutions', sol: 'edu-bridge', title: 'Edu-Bridge by PYXON: The Intelligent University', text: 'Education intelligence that connects universities to the labour market.', yt: 'BQMk3Jp7pr8', poster: 'assets/video/edu.webp', loop: 'edu', film: 'edu' },
    { id: 'nabd', group: 'Solutions', sol: 'nabd', title: 'Nabd: The Connected Hospital', text: 'Patient journey intelligence, from the first call to recovery at home.', poster: 'assets/video/nabd.webp', loop: 'nabd', film: 'nabd' },
    { id: 'governance', group: 'Solutions', sol: 'pyxon-shield', title: 'Score AI Before You Deploy: PYXON Governance', text: 'Score AI systems against national policy before they go live.', yt: '2BEjTe-23qk', poster: 'assets/video/shield.webp', loop: 'shield', film: 'governance' },
    { id: 'construction', group: 'Solutions', sol: 'industry', title: 'From Chaos to Command: Engineering and Construction', text: 'Contextual intelligence for engineering and construction projects.', yt: 'KOPpHbfAH6k', poster: 'assets/video/construction.webp', loop: 'construction', film: 'construction' },
    { id: 'fmcg', group: 'Solutions', sol: 'industry', title: 'The Race Against Time: FMCG and Pharma', text: 'Contextual intelligence for FMCG and pharma operations.', yt: 'Fpjd5lUVmjo', poster: 'assets/video/fmcg.webp', loop: 'fmcg', film: 'fmcg' },
    { id: 'leap', group: 'Events and moments', title: 'PYXON at LEAP 2026', text: 'PYXON exhibiting at LEAP 2026 in Riyadh.', poster: 'assets/video/leap.webp', film: 'leap' },
    { id: 'saudi-day', group: 'Events and moments', title: 'Saudi National Day 2026', text: 'A short 3D video to mark Saudi National Day.', poster: 'assets/video/saudi-day.webp', film: 'saudi-day' },
  ],


  docs: {
    profiles: [
      { file: 'pyxon-corporate-profile-2026-en', title: 'Corporate Profile 2026', lang: 'EN', kind: 'Profile', pair: 'pyxon-corporate-profile-2026-ar' },
      { file: 'pyxon-one-pager-2026', title: 'PYXON One Pager', lang: 'EN', kind: 'Profile' }
    ],
    labs: [
      { file: 'pyxon-ai-labs-flyer', title: 'PYXON AI Labs Flyer', lang: 'EN', kind: 'Labs' }

    ]
  },

  /* Solutions. Every solution is "by PYXON-Eye". */
  solutions: [
    {
      id: 'gov-insight', name: 'Gov-Insight', short: 'Government', kicker: 'Government alignment intelligence',
      tagline: 'From national vision to measured delivery.',
      intro: 'Gov-Insight is alignment intelligence for government. It connects the national vision to what every entity actually delivers, and turns public feedback into the plan that closes the gap.',
      card: 'Strategic national intelligence, execution monitoring and cross-entity visibility.',
      glance: [['Built for', 'Ministries, authorities, municipalities and agencies'], ['Languages', 'Arabic and English, text, voice and handwriting'], ['Works with', 'The systems you already run. Nothing to replace.'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'An 8-week alignment pilot on one entity']],
      does: [['Decompose the vision', "Reads the national vision, its pillars, realisation programmes and the entity's own strategy, then turns them into measurable objectives with targets, horizons and owners."], ['Score every entity', 'One alignment index and six aspects that show where the entity is strong or thin. Every point traces to a project, an owner, a budget line and the objective it serves.'], ['Hear every channel', 'Paper forms, complaint systems, call centre, WhatsApp, social media and field inspections, read and routed. Root causes are clustered and linked to the project they affect.'], ['See the next crisis first', 'Recurrence, seasonality and sentiment feed a forward risk register. Each risk carries a likelihood, an impact, a window and a costed plan to act on it.']],
      stepsTitle: 'One map from the vision down to every project.',
      steps: [['Ingest the vision', 'Vision text, pillars, programmes, sector strategies and the entity plan, in Arabic and English.'], ['Extract objectives', 'Each objective with its target, horizon, owning pillar and programme.'], ['Map the portfolio', 'Projects, services, KPIs and budget lines matched to the objectives they serve.'], ['Score and find gaps', 'Weighted contribution per objective. Any objective with no owning project is flagged.']],
      changes: [['Reporting', 'Compiled by hand, once a quarter', 'A live scorecard with drill-down to project and owner'], ['Public feedback', 'Paper and legacy systems, largely unread', 'Every channel structured and routed to the owning department'], ['Risk', 'Found when the public escalates', 'A forward risk register with a costed plan, before the crisis']],
      also: ['One number the executive can act on, and six that say where', 'Ten-quarter trend tracking', 'Like-for-like peer benchmarks'],
      scorecard: { title: 'Entity scorecard', sample: 'Sample municipality', index: 72, delta: '+14 pts over 10 quarters', rows: [['Community vitality', 85], ['Urban landscape', 78], ['Digital transformation', 71], ['Service quality', 66], ['Economic enablement', 54], ['Sustainability', 47]] },
      marketplace: 'mpGov', icon: 'assets/img/icon-govinsight.png',
      loop: 'gov', film: 'gov', yt: 'Ma_SsGe4uPg', docs: ['gov-insight-brief-2026-en', 'gov-insight-brief-2026-ar']
    },
    {
      id: 'edu-bridge', name: 'Edu-Bridge', short: 'Education', kicker: 'Education intelligence',
      tagline: 'The next move, on evidence.',
      intro: 'Edu-Bridge is education intelligence for universities. It connects what campuses teach to what the labour market needs and what the nation prioritises, so every academic decision rests on evidence.',
      card: 'Aligns academic outcomes with labour-market demand and national priorities.',
      glance: [['Built for', 'Universities, colleges and education authorities'], ['Connects', 'SIS, LMS, admissions, curriculum, research and labour-market sources'], ['Languages', 'Arabic and English, by voice or text'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'A measured pilot on one decision']],
      surfacesTitle: 'Six surfaces. One view of the evidence.',
      does: [['Strategy Portal', 'Leadership: executive dashboard, ranking intelligence and peer benchmarks.'], ['Academic Planning', 'Deans: high-demand majors and syllabus relevance audits.'], ['Student Network', 'Students: career intelligence, a major finder and an AI advisor.'], ['University Network', 'Leadership: national alignment, workforce radar and placement.'], ['Research Intelligence', 'Researchers: a research graph from eight scholarly sources.'], ['AI Reporting', 'All roles: board-ready reports on demand, every figure cited.']],
      stepsTitle: 'A dean asks. Edu-Bridge shows its work.',
      steps: [['Ask and authorise', 'Voice or text, Arabic or English. Role and row access checked first.'], ['Contextualise and mask', 'Only the relevant slice is retrieved. Personal data is hidden before any model sees it.'], ['Route and reason', 'The right model, the right size, reasoning on focused context.'], ['Trace and act', 'Every answer cited and audited. An agent drafts the action for a person to approve.']],
      changes: [['Planning', "Programme decisions on intuition and last year's data", 'Evidence from campus, market and national sources, cited'], ['Reporting', 'Board reports compiled by hand', 'Board-ready reports on demand, every figure cited'], ['Curriculum', 'Syllabi reviewed every few years', 'Relevance audited against live skill demand'], ['Students', 'Generic advising', 'Career intelligence and an AI advisor for each profile']],
      agents: [['Curriculum Agent', 'Compares syllabi with live skill demand and drafts revisions.', 'Dean approves'], ['Intake Planning Agent', 'Reads demand forecasts against capacity per programme.', 'Committee approves'], ['Retention Agent', 'Spots completion risk early and targets outreach.', 'Staff approves'], ['Student Advisor Agent', 'Builds academic and career pathways from each profile.', 'Advisor in the loop'], ['Placement Agent', 'Matches students and graduates to roles employers post.', 'Office approves'], ['Research Next-Move Agent', 'Reads the literature and ranks what to publish next.', 'Researcher decides']],
      also: ['Ask once. Get the answer, and the evidence behind it.', 'Six governed AI agents', 'AI answers and AI reports'],
      marketplace: 'mpEdu', icon: 'assets/img/icon-edubridge.png',
      loop: 'edu', film: 'edu', yt: 'BQMk3Jp7pr8', docs: ['edu-bridge-brief-2026-en', 'edu-bridge-brief-2026-ar']
    },
    {
      id: 'enterprise-insight', name: 'Enterprise-Insight', short: 'Enterprise', kicker: 'Enterprise intelligence',
      tagline: 'One intelligence layer across the whole enterprise.',
      intro: 'Enterprise-Insight is unified intelligence across ERP, HR, finance, CRM, procurement and operations, combined with customer signals and external market data, so leadership sees performance, risk and opportunity in one place instead of eleven dashboards.',
      card: 'Operational, financial, customer and external signals in one real-time view.',
      glance: [['Built for', 'Large enterprises, banking, insurance, healthcare groups and institutional ecosystems'], ['Connects', 'ERP, CRM, HR systems, finance, procurement, operations and customer signals'], ['Languages', 'Arabic and English, by voice or text'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'A measured pilot on one decision']],
      does: [['Executive performance', 'Group, division and function performance against plan, live.'], ['Financial intelligence', 'Revenue, cost, margin and working-capital signals correlated across systems.'], ['Customer intelligence', 'Behaviour, churn risk and opportunity from CRM plus external signals.'], ['Operational analytics', 'Throughput, quality, utilisation and bottleneck detection.']],
      stepsTitle: 'From eleven dashboards to one picture.',
      steps: [['Connect', 'Bring together ERP, CRM, databases, APIs, documents, sensors and external sources, in place.'], ['Understand', 'Model entities, relationships and business context. Retrieve the evidence relevant to each question.'], ['Act', 'Deliver assistants, predictive insights, recommendations and controlled workflows, with approval where it matters.'], ['Reuse', 'Extend the same platform, integrations and domain intelligence across departments and use cases.']],
      changes: [['Reporting', 'Eleven dashboards, one per system', 'One governed view across all of them'], ['Month-end', 'Insight weeks after close', 'Performance against plan, live'], ['Risk', 'Found in the quarterly review', 'Correlated signals surface it earlier'], ['Customers', 'CRM alone', 'CRM plus external signals: churn risk and opportunity']],
      also: ['Faster month-end to insight. Fewer disconnected dashboards.', 'Every system, one view', 'Risks, trends and strategic opportunities'],
      image: 'assets/img/gen-enterprise.webp', imageFallback: 'assets/img/chess.webp', loop: 'enterprise',
      docs: ['enterprise-insight-brief-2026-en', 'enterprise-insight-brief-2026-ar']
    },
    {
      id: 'procure-insight', name: 'Procure-Insight', short: 'Procurement', kicker: 'Procurement intelligence',
      tagline: 'Smarter, faster and more transparent procurement.',
      intro: 'Procure-Insight is an AI procurement cockpit that connects spending, supplier risk, pricing signals and operational workflows, so sourcing decisions are made on evidence, routed transparently and defensible after the fact.',
      card: 'Spend, supplier risk and pricing signals, routed into transparent decisions.',
      glance: [['Built for', 'Chief procurement officers, category leads and shared-service centres'], ['Connects', 'ERP, P2P systems, contract repositories, supplier master, external pricing feeds, market indices, credit and risk data'], ['Languages', 'Arabic and English, by voice or text'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'A measured pilot on one category']],
      does: [['AI procurement workspace', 'One workspace for category managers, buyers and approvers.'], ['Dashboard overview', 'AI impact, savings pipeline and cycle-time visibility.'], ['Pricing intelligence', 'Should-cost and benchmark analysis against external market signals.'], ['Predictive supplier risk', 'Financial, delivery, concentration and geopolitical risk scoring, continuously, not annually.']],
      stepsTitle: 'Every sourcing decision, on evidence.',
      steps: [['Connect', 'ERP, P2P, contracts, supplier master and external pricing feeds, read in place.'], ['Understand', 'Spend, prices and supplier signals modelled into one context per category.'], ['Act', 'Should-cost, risk scores and recommendations routed into the procurement workflow.'], ['Reuse', 'The same layer serves every category, buyer and approver.']],
      changes: [['Supplier risk', 'Scored annually, if at all', 'Scored continuously across the supplier base'], ['Pricing', 'Negotiated from the last contract', 'Should-cost and benchmarks against market signals'], ['Decisions', 'Made in email threads', 'Routed transparently, defensible after the fact'], ['Spend', 'Visible system by system', 'Unified with external pricing signals in one view']],
      also: ['Lower unit cost. Shorter sourcing cycles. A continuous supplier risk view.', 'Spend and pricing signals in one view', 'Decisions routed into workflows'],
      image: 'assets/img/gen-procure.webp', docs: ['procure-insight-brief-2026-en', 'procure-insight-brief-2026-ar']
    },
    {
      id: 'nabd', name: 'Nabd Health-Insight', short: 'Healthcare', kicker: 'Patient journey intelligence', arabic: 'نبض',
      tagline: 'Every step of care, in one place.',
      intro: 'Nabd is patient journey intelligence for hospitals. It wraps one coordinated service layer around clinical care, from the first call to recovery at home, so no request, result or follow-up falls between teams.',
      card: 'One coordinated service layer around care, from the first call to recovery at home.',
      glance: [['Built for', 'Hospitals, clinics and health systems'], ['Channels', 'Voice, mobile, bedside QR and caregiver'], ['Languages', 'Arabic in local dialects and English, by voice or text'], ['Deployment', 'On-premises, private cloud or an in-country model endpoint'], ['Start', 'A measured pilot on one journey stage']],
      journeyTitle: 'Seven stages. One journey.',
      journey: [['Access', 'Answers and triages, day and night.'], ['Plan', 'Books, prepares and refills cancelled slots.'], ['Arrive', 'Routes the visit through lab, imaging and pharmacy.'], ['Encounter', 'Drafts the note while the clinician focuses.'], ['Recover', 'Shares results by safety tier and follows up.'], ['Continue', 'Keeps the care plan going at home.'], ['Improve', 'Measures, learns and adapts.']],
      stepsTitle: 'A patient calls. Nabd carries it through.',
      steps: [['Answer and verify', 'Voice or text, any hour. Identity checked first.'], ['Screen', 'Red-flag rules run before and after every response. Emergencies are routed at once.'], ['Hand over and book', 'A structured summary to the nurse. Slot and parking booked together.'], ['Follow up and record', 'Day 2, 7 and 30 check-ins, each with a named owner, time and outcome.']],
      approvals: ['Nurse confirms every triage decision', 'Doctor signs every clinical note', 'Clinician approves care-plan steps', 'Clinician approves abnormal-result wording', 'Nurse accepts parallel test orders'],
      also: ['Automation coordinates care. Clinicians decide.', 'Bedside requests with service targets', 'One activity history per patient'],
      image: 'assets/img/nabd-loom-phone.webp', loop: 'nabd', film: 'nabd',
      docs: ['nabd-brief-2026-en', 'nabd-brief-2026-ar']
    },
    {
      id: 'iot-insight', name: 'IoT-Insight', short: 'Smart operations', kicker: 'Operational intelligence',
      tagline: 'The operating layer above your data.',
      intro: 'IoT-Insight is a centralised AI layer that connects every source, analyses events in context and triggers the right action. It does not replace your existing platforms, it unifies them, turning raw sensor feeds into intelligent, automated, orchestrated operational action.',
      card: 'Distributed sensors and platforms unified into predictive, orchestrated action.',
      glance: [['Built for', 'Cities, campuses, plants, fleets and critical infrastructure that have platforms but not a single picture'], ['Connects', 'Cameras, meters, environmental sensors, gateways, PLCs, BMS, CAFM, fleets and enterprise systems'], ['Start anywhere', 'Visibility, alerting, recommendation, automation, prediction'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'A measured pilot on one site or one asset class']],
      does: [['Smart cities and facilities', 'Command centres, building intelligence, utilities monitoring, energy optimisation.'], ['Transportation and mobility', 'Traffic sensing, fleet tracking, telematics, route optimisation, depot operations.'], ['Industrial and critical operations', 'Asset health, worker safety, environmental monitoring, process anomalies.'], ['Logistics and supply chain', 'Asset tracking, warehouse visibility, cold chain, shipment exceptions.']],
      stepsTitle: 'From raw sensor feeds to orchestrated action.',
      steps: [['Connect', 'Devices, sensors, cameras, gateways, BMS, fleets and enterprise systems, through streaming ingestion and API connectors.'], ['Understand', 'Normalise data, correlate signals, detect anomalies and build operational context.'], ['Act', 'Push the decision into operations and assign the right team with accountability.'], ['Orchestrate', 'Workflow orchestration and closed-loop tracking, so every action is followed to its outcome.']],
      changes: [['Platforms', 'One console per vendor', 'One operating layer above them all'], ['Alerts', 'Raw alarms with no context', 'Correlated events with a recommended next action'], ['Maintenance', 'By calendar', 'Predictive, by condition and risk'], ['Response', 'Manual dispatch', 'Automated, assigned and tracked to closure']],
      matrix: [['Healthcare: RTLS', ['Infant safety', 'Medical assets tracking', 'Wander management', 'Staff duress alert', 'Senior living safety', 'Staff workflow']], ['Transportation', ['Fleet management', 'Tracking and telematics', 'School bus surveillance', 'Weigh in motion', 'Public transportation']], ['Industrial', ['Lone worker safety', 'Employee tracking', 'Emergency mustering', 'Forklift collision avoidance', 'Car damage detection']], ['Logistics', ['Smart lock solution', 'Route planning', 'Route optimization', 'Cold chain management']], ['Public Safety', ['Face recognition', 'Crowd management', 'Vehicle tracking', 'People tracking', 'ANPR', 'Policing solutions']], ['Smart City', ['BMS', 'Parking management', 'Traffic control', 'ANPR']], ['Airports and Ports', ['Airports safety solution', 'Ports safety solutions']]],
      also: ['It does not replace your platforms. It unifies them.', 'One dashboard for every device', 'Closed-loop tracking to closure'],
      image: 'assets/img/gen-iot.webp', imageFallback: 'assets/img/cubes-shelf.webp', loop: 'iot',
      docs: ['iot-insight-brief-2026-en', 'iot-insight-brief-2026-ar']
    },
    {
      id: 'pyxon-shield', name: 'PYXON-Shield and Governance', short: 'Cybersecurity', kicker: 'Unified cyber resilience and AI governance',
      tagline: 'One dashboard. Total visibility.',
      intro: 'PYXON-Shield is a unified platform to safeguard businesses from evolving cyber threats: AI-powered cybersecurity, compliance automation, data protection and AI governance, from device to cloud, on one actionable screen.',
      card: 'AI-powered cybersecurity, compliance automation and AI governance, device to cloud.',
      stats: [['360°', 'risk visibility'], ['100+', 'integrations'], ['24/7', 'oversight']],
      glance: [['Built for', 'CISOs, heads of risk and compliance, and managed service providers carrying too many consoles and not enough certainty'], ['One platform', 'Security, GRC, AI governance and compliance automation'], ['Connects', 'Networks, cloud, endpoints, identities, applications, data supply chain, SIEM and SBOM'], ['Compliance crosswalk', 'EU AI Act, NIST AI RMF, ISO 42001, MITRE ATLAS, OWASP LLM, ISO 27001, GDPR, HIPAA, PCI'], ['Deployment', 'On-premises and cloud assets, enterprise-grade and MSP-ready']],
      does: [['Vantage View', 'Central executive and operational dashboard for aggregated security, risk, compliance and remediation visibility.'], ['AICenturion', 'AI security and governance: discovery, model inventory, prompt inspection, output safety, access control and compliance mapping.'], ['Audify', 'Continuous compliance monitoring, evidence collection, policy enforcement, audit readiness and proactive notification.'], ['Haystack', 'The built-in SIEM for constant monitoring, through which third-party systems integrate seamlessly.']],
      stepsTitle: 'Connect. Manage. Comply. Remediate.',
      steps: [['Connect', 'More than 100 built-in integrations across networks, cloud, endpoints, identities and applications.'], ['Manage', 'Visualisation and configuration of the whole estate in Vantage View.'], ['Comply', 'Continuous compliance monitoring, evidence collection and policy enforcement.'], ['Remediate', 'Native remediation: risks ranked, remediated and accepted in one platform.']],
      changes: [['Consoles', 'Too many consoles, not enough certainty', 'One actionable screen for all security data'], ['Shadow AI', 'AI you did not know about', 'Automated discovery and a living inventory'], ['Compliance', 'Evidence gathered before each audit', 'Continuous monitoring and evidence collection, always on'], ['Risk', 'Ranked in spreadsheets', 'Ranked, remediated and accepted in one platform']],
      governance: { title: 'Score AI before you deploy.', text: 'PYXON Governance is a library and CLI for country-aware AI governance scoring. It tests LLMs and RAG systems against national AI rules, with live safety probes and policy evidence, on SDAIA and UAE benchmarks.', code: ['pip install pyxon-governance', 'npm install @pyxon/governance'] },
      also: ['Prove your AI is discovered, controlled and compliant.', 'LEO, the AI copilot for reports and responses', 'Cloud security posture across public, private and hybrid'],
      loop: 'shield', film: 'governance', yt: '2BEjTe-23qk',
      docs: ['pyxon-shield-brief-2026-en', 'pyxon-shield-brief-2026-ar']
    },
    {
      id: 'industry', name: 'Industry Intelligence', short: 'Industries', kicker: 'Sector solutions on PYXON-Eye',
      tagline: 'Tailored domain intelligence, on the same engine.',
      intro: 'Industry Intelligence is rapid generation of tailored domain solutions on PYXON-Eye. Each sector solution is built on the same engine, governance and connectors as every other PYXON solution, and adapted to the realities of the sector.',
      card: 'Construction, FMCG and pharma, energy, finance: tailored on the same engine.',
      glance: [['Built for', 'Contractors and PMOs, FMCG and pharmaceutical supply chains, utilities and critical infrastructure'], ['Also served', 'Healthcare, financial services, retail, logistics, manufacturing and smart cities'], ['Built on', 'PYXON-Eye with IoT-Insight, Procure-Insight, Enterprise-Insight and PYXON-Shield as the sector needs'], ['Deployment', 'On-premises, private cloud, hybrid or air-gapped'], ['Start', 'A measured pilot on one site, programme or product line']],
      sectors: [
        { name: 'Engineering and Construction', line: 'Every project, every risk, one view.', text: 'Cost and commitment control, schedule risk prediction, subcontractor performance, document and drawing intelligence.', loop: 'construction', film: 'construction', yt: 'KOPpHbfAH6k' },
        { name: 'FMCG and Pharma', line: 'From shelf signal to supply action.', text: 'Sell-in and sell-out reconciliation, availability and out-of-stock risk, trade promotion effectiveness, batch, serialisation and cold chain.', loop: 'fmcg', film: 'fmcg', yt: 'Fpjd5lUVmjo' },
        { name: 'Energy and Utilities', line: 'Asset health, before it fails.', text: 'Network and grid intelligence, predictive maintenance, outage and incident response, non-technical loss detection.', loop: 'hololab' },
        { name: 'Financial Services', line: 'Risk, fraud and customer insight in one layer.', text: 'Risk intelligence, fraud and anomaly detection, enterprise risk view and transaction monitoring, with defensible model governance.', image: 'assets/img/key-hall.webp' }
      ],
      stepsTitle: 'Discover, design, build, integrate, deploy, optimise.',
      steps: [['Discover and design', "The sector's systems, signals and decisions mapped into a solution design."], ['Build', 'Contexts, connectors and domain models assembled on PYXON-Eye.'], ['Integrate and test', 'Connected in place to the systems already in use, tested against a baseline.'], ['Deploy and optimise', 'Live in your environment, measured and tuned as the estate evolves.']],
      changes: [['Construction', 'Slip found in the monthly report', 'Early warning from progress, procurement and productivity data'], ['FMCG and pharma', "Forecast from last quarter's spreadsheet", 'Demand from sell-out and external signals'], ['Utilities', 'Maintenance by calendar', 'Condition-based intervention, failure risk scored per asset'], ['Any sector', 'A new model built from scratch', 'Tailored on the same engine, governance and connectors']],
      also: ['Built on the same engine, governance and connectors as every other solution.', 'Built with IoT-Insight and PYXON-Shield where the estate needs them', 'Shared capabilities: search and RAG, copilots, document intelligence, agentic workflows'],
      loop: 'construction', film: 'construction', yt: 'KOPpHbfAH6k',
      docs: ['industry-intelligence-brief-2026-en', 'industry-intelligence-brief-2026-ar']
    }
  ],

  pyxiLaunch: false,

  docTitles: {
    'gov-insight-brief-2026-en': ['Gov-Insight Solution Brief', 'EN'], 'gov-insight-brief-2026-ar': ['Gov-Insight Solution Brief', 'AR'],
    'edu-bridge-brief-2026-en': ['Edu-Bridge Solution Brief', 'EN'], 'edu-bridge-brief-2026-ar': ['Edu-Bridge Solution Brief', 'AR'],
    'enterprise-insight-brief-2026-en': ['Enterprise-Insight Solution Brief', 'EN'], 'enterprise-insight-brief-2026-ar': ['Enterprise-Insight Solution Brief', 'AR'],
    'procure-insight-brief-2026-en': ['Procure-Insight Solution Brief', 'EN'], 'procure-insight-brief-2026-ar': ['Procure-Insight Solution Brief', 'AR'],
    'nabd-brief-2026-en': ['Nabd Health-Insight Solution Brief', 'EN'], 'nabd-brief-2026-ar': ['Nabd Health-Insight Solution Brief', 'AR'],
    'iot-insight-brief-2026-en': ['IoT-Insight Solution Brief', 'EN'], 'iot-insight-brief-2026-ar': ['IoT-Insight Solution Brief', 'AR'],
    'pyxon-shield-brief-2026-en': ['PYXON-Shield and Governance Brief', 'EN'], 'pyxon-shield-brief-2026-ar': ['PYXON-Shield and Governance Brief', 'AR'],
    'industry-intelligence-brief-2026-en': ['Industry Intelligence Solution Brief', 'EN'], 'industry-intelligence-brief-2026-ar': ['Industry Intelligence Solution Brief', 'AR'],
    'pyxon-eye-brief-2026-en': ['PYXON-Eye Solution Brief', 'EN'], 'pyxon-eye-brief-2026-ar': ['PYXON-Eye Solution Brief', 'AR'], 'pyxon-eye-flyer': ['PYXON-Eye Flyer', 'EN'], 'pyxon-eye-sheet-3d': ['PYXON-Eye Sheet, 3D', 'EN'], 'pyxon-eye-sheet-2d': ['PYXON-Eye Sheet, 2D', 'EN']
  }
};

/* Legal pages: wording from the live pyxon.com Privacy Notice and Terms of Use (last updated 01 May 2026). */
window.PYX.legal = {
  privacy: {
    title: 'Privacy Policy', updated: '01 May 2026',
    intro: ['PYXON is committed to protecting personal data and respecting privacy regulations. This Privacy Policy explains how we collect, use, store, disclose, and protect personal data collected through our website, platform, and related services.'],
    sections: [
      { h: 'Data Controller', p: ['The data controller responsible for processing personal data under this Privacy Policy is:', 'Company Name: PYXON'] },
      { h: 'Personal Data We Collect', p: ['A. Information you provide directly:'], ul: ['Full name', 'Email address', 'Mobile or telephone number', 'Company name', 'Job title / position', 'Username and login credentials', 'Information submitted through contact forms, demo requests, support requests, and newsletter subscriptions'],
        p2: ['B. Information collected automatically:'], ul2: ['IP address', 'Browser type and version', 'Device information and operating system', 'Website usage data, access logs, and session data', 'Cookies and similar technologies'] },
      { h: 'Purposes of Processing', p: ['We process personal data for the following purposes:'], ul: ['Responding to inquiries and contact requests', 'Managing demo requests and business opportunities', 'Creating and managing accounts', 'Providing access to our services or platform', 'Customer support and technical assistance', 'Account security and fraud prevention', 'Internal analytics and service improvement', 'Website administration and troubleshooting', 'Sending newsletters, updates, and marketing communications', 'Compliance with legal and regulatory obligations'] },
      { h: 'Legal Basis for Processing', p: ['Personal data is processed based on one or more of the following legal grounds:'], ul: ['Consent from the data subject where required', 'Compliance with legal or regulatory obligations'] },
      { h: 'Cookies and Similar Technologies', p: ['We use cookies and similar technologies to:'], ul: ['Maintain login sessions', 'Remember user preferences', 'Analyse website traffic and usage', 'Improve website functionality and performance', 'Enhance security and user experience'] },
      { h: 'Marketing Communications', p: ['Where users subscribe to newsletters or marketing communications, we may send relevant updates, product announcements, and business communications.'] },
      { h: 'Sharing of Personal Data', p: ['We may share personal data only where necessary with:'], ul: ['Hosting and cloud service providers', 'IT and technical support providers', 'Analytics providers', 'CRM and communication service providers', 'Professional advisers', 'Regulatory, governmental, or judicial authorities where required by law'] },
      { h: 'Data Retention', p: ['We retain personal data only for as long as necessary to fulfil the purposes outlined in this Privacy Policy, satisfy contractual or legal obligations, resolve disputes, and protect legitimate business interests.'] },
      { h: 'Data Subject Rights', p: ['Subject to applicable law, data subjects may have the right to:'], ul: ['Request access to personal data', 'Request correction or update of inaccurate or incomplete data', 'Request deletion of personal data where legally permissible', 'Withdraw consent where processing is based on consent', 'Request information regarding processing activities, where applicable'] },
      { h: 'Data Security', p: ['We implement reasonable technical, organizational, and administrative safeguards designed to protect personal data against unauthorized access, disclosure, alteration, loss, misuse, and destruction. However, no internet-based system can be guaranteed as completely secure.'] },
      { h: 'Third-Party Links', p: ['Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of third-party sites.'] },
      { h: 'Changes to this Privacy Policy', p: ['We may amend or update this Privacy Policy from time to time. Continued use of our services following any update constitutes acceptance of the revised Policy.'] },
      { h: 'General Provisions', p: ['Visitors agree to receive product updates, newsletters, and marketing communications from PYXON. This Policy (including any contractual or non-contractual rights or obligations arising out of or in connection with it) shall be governed by and construed in accordance with the applicable laws and regulations, and the parties agree to submit to the exclusive jurisdiction of the competent courts. This Policy is executed in English. In the event of any conflict between language versions, the English version shall prevail.'] },
      { h: 'Contact Us', p: ['For privacy-related inquiries, requests, or complaints, please contact:'], contact: true }
    ]
  },
  terms: {
    title: 'Terms of Use', updated: '01 May 2026',
    intro: ['Welcome to PYXON. These Terms of Use ("Terms") govern your access to and use of our website, platform, applications, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.'],
    sections: [
      { h: 'Eligibility', p: ['Your use of the Services must comply with all applicable laws and regulations in the relevant country.'] },
      { h: 'Permitted Use', p: ['You may use the Services solely for legitimate business and informational purposes in accordance with these Terms.', 'You agree not to:'], ul: ['Use the Services for unlawful, fraudulent, or unauthorized purposes', 'Attempt unauthorized access to systems, accounts, or networks', 'Interfere with website functionality, servers, or security features', 'Upload malware, harmful code, or malicious content', 'Scrape, copy, harvest, or systematically extract website content or data without authorization', 'Use the Services in a way that may damage, disable, or impair functionality'] },
      { h: 'Account Registration and Security', ul: ['Users are responsible for maintaining confidentiality of login credentials', 'Users are responsible for all activities conducted under their accounts', 'Users must promptly notify us of suspected unauthorized access or security incidents'], p2: ['We reserve the right to suspend or terminate accounts where misuse or security concerns arise.'] },
      { h: 'Intellectual Property', p: ['All content, materials, software, trademarks, logos, designs, text, graphics, and technology made available through the Services are owned by or licensed to PYXON unless otherwise stated. Nothing in these Terms grants users any ownership rights or licenses except the limited access rights necessary to use the Services.', 'Users may not copy, reproduce, modify, distribute, reverse engineer, republish, or commercially exploit any part of the Services without prior written permission.'] },
      { h: 'User Content and Submissions', ul: ['Users retain ownership of their submitted content', 'Users grant us the right to use submitted information as reasonably necessary to provide Services, respond to requests, or manage business communications', 'Users are solely responsible for ensuring submitted content is lawful and does not infringe third-party rights'] },
      { h: 'Third-Party Links and Services', p: ['The Services may include links to third-party websites, tools, or services. We do not control and are not responsible for third-party content, security, availability, privacy practices, or accuracy.'] },
      { h: 'Disclaimer', p: ['The Services are provided on an "as is" and "as available" basis. To the maximum extent permitted by law, PYXON makes no warranties, representations, or guarantees regarding availability, accuracy, reliability, security, fitness for a particular purpose, non-infringement, or uninterrupted or error-free operation.'] },
      { h: 'Limitation of Liability', p: ['To the fullest extent permitted by applicable law, PYXON, its affiliates, directors, officers, employees, and licensors shall not be liable for any indirect, incidental, consequential, special, punitive, or business-related damages, including:'], ul: ['Loss of profits', 'Loss of business opportunities', 'Loss of data', 'Business interruption', 'Reputational harm'], p2: ['arising out of or related to use of or inability to use the Services.'] },
      { h: 'Indemnification', p: ['Users agree to indemnify, defend, and hold harmless PYXON and its affiliates from claims, liabilities, losses, damages, and expenses arising from:'], ul: ['Breach of these Terms', 'Misuse of the Services', 'Violation of applicable laws', 'Infringement of third-party rights'] },
      { h: 'Suspension and Termination', p: ['At our discretion, where users violate these Terms, create security risks, or engage in unlawful conduct, we reserve the right to restrict, suspend, or terminate access to the Services.'] },
      { h: 'Privacy', p: ['Use of personal data is governed by our <a href="#privacy">Privacy Policy</a>, available separately on this website.'] },
      { h: 'Modifications', p: ['We may revise or update these Terms from time to time. Updated versions will be posted on this page with a revised effective date. Continued use of the Services following updates constitutes acceptance of the revised Terms.'] },
      { h: 'Governing Law and Jurisdiction', p: ['These Terms shall be governed by and construed in accordance with the laws of the concerned country. Any disputes arising from or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the competent courts of the concerned country.'] },
      { h: 'Contact Us', p: ['For inquiries relating to these Terms, please contact:'], contact: true }
    ]
  }
};

/* Careers page and company statements (carried over from the previous pyxon.com) */
window.PYX.vision = 'Rather than building isolated AI use cases, PYXON believes the future of AI lies in contextual intelligence platforms capable of rapidly generating domain-specific intelligence and replacing fragmented AI implementations with scalable, adaptive intelligence ecosystems.';
window.PYX.mission = { title: 'Empowering AI adoption. Accelerating smarter decisions.', text: 'To empower organizations with secure, AI-driven intelligence platforms that simplify AI adoption, accelerate intelligent operations, and transform complex data into faster, smarter, and more impactful decisions.' };
window.PYX.careers = {
  why: [
    ['Real systems, in production', 'From day one. The thing you work on this quarter ships next.'],
    ['A platform, not a single bet', 'An LLM-agnostic, multi-vertical platform. Not a single-product trap. Not a single-model bet.'],
    ['Global by design', 'Built to deploy in any country and to work with the world\'s technology.'],
    ['Autonomy by default', 'We trust the people we hire to figure it out.']
  ],
  ways: [
    ['Full-time roles', 'Engineering, AI research, product, design, business development, marketing and operations. If you have ever wanted to build infrastructure-grade AI, this is where you do it.'],
    ['PYXON Labs paid internship', 'For students and recent graduates. Real projects, real mentorship, real pay. Built into our roadmap, not bolted onto it. Cohorts open seasonally.'],
    ['Partner and advisor network', 'For senior operators and academics. If you want to shape what we build next, across government, enterprise or research, we would like to talk.']
  ]
};
