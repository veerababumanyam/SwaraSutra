
import React, { useState, useEffect } from 'react';
import {
    Users, Briefcase, Award, Globe, Shield,
    Cpu, Activity, Zap, Layers, Network,
    Code2, Database, Terminal, Lock, Workflow,
    ChevronRight, ExternalLink, Mail, MapPin, Phone,
    BrainCircuit, Cloud
} from 'lucide-react';
import { GlassButton } from './ui/GlassButton';

// ── Types ──
interface ExperienceNode {
    id: string;
    role: string;
    company: string;
    logo: string;
    period: string;
    location: string;
    description: string[];
    tech?: string[];
}

interface SkillCluster {
    category: string;
    skills: string[];
    icon: React.ElementType;
}

// ── Configuration Data (From Resume) ──
const EXPERIENCE_DATA: ExperienceNode[] = [
    {
        id: 'eon-current',
        role: 'Global Enterprise Architect',
        company: 'E.ON',
        logo: 'https://logo.clearbit.com/eon.com',
        period: 'Sep 2019 - Present',
        location: 'Essen, Germany',
        description: [
            'Pioneered the strategic integration of Autonomous AI Agents into the enterprise core.',
            'Architected comprehensive AI Governance Frameworks, ensuring LLM safety and ethical scalability.',
            'Developed high-impact Proof-of-Concept AI agents for Microsoft Copilot, leveraging advanced RAG pipelines.',
            'Executed a Zero Trust security paradigm (Zscaler, Illumio), effectively neutralizing lateral movement risks.'
        ],
        tech: ['AI Agents', 'LLMs', 'RAG', 'Azure', 'Zero Trust', 'Zscaler']
    },
    {
        id: 'infosys',
        role: 'Senior Technology Architect',
        company: 'Infosys Ltd',
        logo: 'https://logo.clearbit.com/infosys.com',
        period: 'Feb 2016 - Aug 2019',
        location: 'Global',
        description: [
            'Orchestrated Enterprise Architecture transformation, aligning technology with critical business drivers.',
            'Directed complex technology mergers and carve-outs, enabling seamless business acquisitions.',
            'Revolutionized LAN/WAN infrastructure, achieving a 30% reduction in system downtime through optimization.'
        ],
        tech: ['Enterprise Arch', 'Mergers & Acquisitions', 'Network Security']
    },
    {
        id: 'wipro',
        role: 'Solution Architect',
        company: 'Wipro Technologies',
        logo: 'https://logo.clearbit.com/wipro.com',
        period: 'Jul 2014 - Jan 2016',
        location: 'Global',
        description: [
            'Engineered a robust, high-performance IT infrastructure frame work for global scalability.',
            'Designed and deployed a cost-saving UCaaS platform, reducing operational expenses by 25%.',
            'Commended for leading a 15-member elite team in critical Cisco UCS and VMware migration projects.'
        ],
        tech: ['UCaaS', 'Cisco UCS', 'VMware', 'Cloud Migration']
    },
    {
        id: 'cisco',
        role: 'Solution Architect & Support Engineer',
        company: 'Cisco Systems',
        logo: 'https://logo.clearbit.com/cisco.com',
        period: 'Feb 2011 - Jul 2014',
        location: 'Global',
        description: [
            'Championed complex support orchestrations for Cisco Unified Communications Systems globally.',
            'Served as a trusted advisor to top 200 enterprise clients (Accenture, JPMC, AT&T) within the critical HTTS UC Team.',
            'Consistently exceeded SLA targets and drove profitability through strategic technical planning.'
        ],
        tech: ['Cisco UC', 'VoIP', 'Network Design', 'HTTS']
    }
];

const SKILL_CLUSTERS: SkillCluster[] = [
    {
        category: 'Generative AI Engineering',
        icon: BrainCircuit,
        skills: ['AI Agents', 'LLMs', 'Generative AI', 'GenAI Engineering', 'RAG Pipelines', 'AI Semantics', 'Vector Databases']
    },
    {
        category: 'AI Platforms',
        icon: Workflow,
        skills: ['Microsoft Copilot Studio', 'Agent 365', 'swarasutra', 'Databricks Mosaic AI', 'SAP Jules', 'LangChain', 'CrewAI', 'PydanticAI']
    },
    {
        category: 'Data & Governance',
        icon: Database,
        skills: ['Data Science', 'Data Strategy', 'Data Governance', 'AI Governance', 'Strategic Planning']
    },
    {
        category: 'Cloud Infrastructure',
        icon: Cloud,
        skills: ['Azure (Expert)', 'Hybrid Cloud', 'Zero Trust Security', 'Kubernetes', 'Docker', 'Aviatrix']
    }
];



export const ArchitectProfile = () => {
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30 overflow-x-hidden pb-20">

            {/* ── Background Effects ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-24">

                {/* ── HERO: Holographic Identity ── */}
                <section className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="relative group perspective-1000 mt-10 md:mt-0">
                        {/* ── Neural Halo Effect ── */}

                        {/* ── Crystalline Aperture Effect ── */}

                        {/* 1. Focused Spotlight (Behind) */}
                        <div className="absolute inset-4 bg-cyan-500/40 blur-[50px] rounded-full animate-pulse" />

                        {/* 2. Rotating Lens Ring (The Aperture) */}
                        <svg className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)] animate-[spin_20s_linear_infinite] pointer-events-none opacity-100" viewBox="0 0 200 200">
                            {/* Outer geometric marks - THICKER */}
                            <circle cx="100" cy="100" r="98" fill="none" stroke="url(#crystal-gradient)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.8" />
                            {/* Inner precision ring - THICKER */}
                            <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="2" strokeDasharray="40 120" opacity="0.5" strokeLinecap="square" />
                            <defs>
                                <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
                                    <stop offset="100%" stopColor="white" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* 3. Satellite Orbiter (Active Motion) */}
                        <div className="absolute inset-[-50px] w-[calc(100%+100px)] h-[calc(100%+100px)] animate-[spin_10s_linear_infinite] pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                        </div>

                        {/* ── Image Container (High Definition) ── */}
                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-float bg-black/5 ring-1 ring-white/10 z-10">
                            <img
                                src="/assets/veera_profile.jpg"
                                alt="Veera Babu Manyam"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-110 contrast-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Veera+Manyam&background=0D8ABC&color=fff&size=256';
                                }}
                            />
                            {/* Sharp Specular Highlight */}
                            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
                            {/* Cinematic Shine (Subtle) */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
                        </div>

                        {/* ── Status Batch ── */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 glass-interactive px-5 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-xl shadow-cyan-500/10 z-20 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-foreground/90">System Active</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-2">
                                <Shield className="w-3 h-3" />
                                Architectural Core
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-cinema tracking-tighter text-foreground">
                                Veera Babu<br /><span className="text-cyan-600 dark:text-cyan-400">Manyam</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl">
                                Global Enterprise Architect & AI Strategist designing the digital nervous systems of tomorrow's enterprises.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <GlassButton variant="primary" className="gap-2" onClick={() => window.open('https://linkedin.com/in/vmanyam', '_blank')}>
                                <Activity className="w-4 h-4" />
                                Connect Neural Link
                            </GlassButton>
                            <GlassButton variant="ghost" className="gap-2" onClick={() => window.open('mailto:veerababumanyam@gmail.com')}>
                                <Mail className="w-4 h-4" />
                                Transmission
                            </GlassButton>
                        </div>
                    </div>
                </section>

                {/* ── METRICS: Core Competencies ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SKILL_CLUSTERS.map((cluster, idx) => (
                        <div
                            key={idx}
                            className="glass-bordered p-6 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                                <cluster.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{cluster.category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {cluster.skills.map((skill) => (
                                    <span key={skill} className="px-2 py-1 rounded-md bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-white/5">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* ── TIMELINE: Neural Pathways ── */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black font-cinema uppercase tracking-widest flex items-center gap-3">
                            <Network className="w-8 h-8 text-cyan-500" />
                            Neural Pathways
                        </h2>
                        <div className="h-px bg-border flex-1" />
                    </div>

                    <div className="relative border-l-2 border-cyan-500/20 ml-4 md:ml-10 space-y-12 pl-8 md:pl-12 py-4">
                        {EXPERIENCE_DATA.map((node, idx) => (
                            <div key={node.id} className="relative group">
                                {/* Node Point */}
                                <div className={`
                  absolute -left-[41px] md:-left-[59px] top-0 w-6 h-6 rounded-full border-4 border-background 
                  ${idx === 0 ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}
                  z-10 transition-colors duration-300 group-hover:bg-cyan-400
                `} />

                                <div className="glass-thick p-6 md:p-8 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                                        {/* Logo Container */}
                                        <div className="hidden md:flex shrink-0 w-14 h-14 rounded-xl bg-white/5 p-2 glass-bordered items-center justify-center overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                                            <img
                                                src={node.logo}
                                                alt={`${node.company} Logo`}
                                                className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                            <Briefcase className="hidden w-6 h-6 text-muted-foreground" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                        {node.role}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-muted-foreground font-medium mt-1">
                                                        <span className="md:hidden"><Briefcase className="w-4 h-4 inline mr-1" /></span>
                                                        {node.company}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:items-end gap-1 text-sm text-muted-foreground/80 font-mono">
                                                    <span>{node.period}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {node.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {node.description.map((desc, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm md:text-base leading-relaxed text-muted-foreground">
                                                <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0 mt-1" />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t border-white/10 pt-4 flex flex-wrap gap-2">
                                        {node.tech?.map(t => (
                                            <span key={t} className="px-2.5 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FOOTER: System Specs ── */}
                <section className="glass-bordered rounded-3xl p-8 md:p-12 text-center space-y-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/25">
                        <Award className="w-8 h-8" />
                    </div>

                    <h2 className="text-3xl font-bold">Protocol Certifications</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                        {['TOGAF 9.2', 'Certified Management 3.0', 'Azure Solutions Architect (AZ-305)', 'Azure Administrator (AZ-104)', 'Cisco CCVP', 'Cisco CCNA', 'VMware Certified Professional', 'ITIL V3 Foundation'].map(cert => (
                            <div key={cert} className="px-4 py-2 rounded-lg bg-background border border-border shadow-sm text-sm font-semibold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                {cert}
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};
