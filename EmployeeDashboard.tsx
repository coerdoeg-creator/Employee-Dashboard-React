import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Moon, 
  Sun, 
  Briefcase, 
  Eye, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Camera, 
  Save, 
  Trash2, 
  X, 
  Video, 
  Euro, 
  ChevronLeft, 
  Menu, 
  Upload, 
  Link as LinkIcon, 
  Key, 
  ShieldCheck, 
  MoreHorizontal, 
  ChevronDown, 
  Calendar, 
  Building2, 
  SendHorizontal, 
  Paperclip, 
  Image as ImageIcon, 
  File as FileIcon, 
  Share2,
  ToggleLeft,
  ToggleRight,
  Edit2,
  AlertCircle,
  UserCheck,
  Shield,
  Sparkles,
  Copy,
  Check,
  Zap,
  Award,
  ArrowUpCircle,
  CreditCard,
  MessageSquare,
  Package,
  CheckSquare,
  Users,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  BriefcaseBusiness,
  MessageCircle,
  Users2,
  CalendarDays,
  MapPinned,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  PlusSquare,
  ShieldAlert,
  Play,
  ReceiptText,
  BadgeCheck,
  HeartHandshake,
  Languages,
  Loader2,
  Gift,
  AlertTriangle,
  Trash,
  Car,
  CheckCircle2,
  EyeOff,
  Home,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import JobDetailPreview from './JobDetailPreview';

// --- Utility Functions ---
const getVideoEmbedUrl = (url: string) => {
  if (!url) return null;
  
  // YouTube Matching
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo Matching
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return null;
};

// --- Types ---
type Theme = 'dark' | 'light';
type View = 'dashboard' | 'company-profile' | 'create-job' | 'my-jobs' | 'candidates' | 'billing' | 'messages' | 'settings' | 'job-preview';

interface Activity {
  id: number;
  icon: React.ReactNode;
  color: string;
  text: string;
  time: string;
}

interface Message {
  id: number;
  sender: 'employer' | 'candidate';
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  candidateName: string;
  candidateInitials: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  photo?: string;
}

interface EmployerProfile {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  exactAddress: string;
  website: string;
  industry: string;
  logo: string;
  logoColor: string;
  theme: Theme;
  foundingYear?: string;
  teamSize?: string;
  description?: string;
  videoUrl?: string;
  gallery?: string[];
  benefits?: {
    housing: boolean;
    bureaucracy: boolean;
    whatsappApply: boolean;
  };
  whatsappNumber?: string;
  socialNetworks?: SocialLink[];
  recruitingTeam?: TeamMember[];
  billingCompanyName?: string;
  vatId?: string;
  billingStreet?: string;
  billingZip?: string;
  billingCity?: string;
  billingCountry?: string;
  accountingEmail?: string;
  culturePitch?: {
    reason1: string;
    reason2: string;
    reason3: string;
  };
  languages?: string[];
}

interface JobPosting {
  id: number;
  title: string;
  category: string;
  location: string;
  salary: string;
  salaryPeriod?: string;
  type: string;
  status: 'Aktiv' | 'Pausiert' | 'Abgelaufen';
  views: number;
  applications: number;
  postedDate: string;
  // Detailed fields for preview mapping
  experience?: string;
  languages?: { name: string; level: string }[];
  mobility?: string;
  workPermit?: string;
  salaryMin?: number;
  salaryMax?: number;
  benefits?: {
    housing: boolean;
    nieSupport: boolean;
    meals: boolean;
  };
  description?: string;
  videoUrl?: string;
  gallery?: string[];
}

interface CandidateApplication {
  id: number;
  name: string;
  jobTitle: string;
  initials: string;
  status: 'Neu' | 'Eingeladen' | 'Angenommen' | 'Abgelehnt';
  date: string;
  email: string;
  experience: string;
}

// --- Mock Data ---
const CHART_DATA = [
  { name: 'Mo', views: 400 },
  { name: 'Di', views: 700 },
  { name: 'Mi', views: 1200 },
  { name: 'Do', views: 900 },
  { name: 'Fr', views: 1500 },
  { name: 'Sa', views: 1100 },
  { name: 'So', views: 1300 },
];

const MOCK_JOBS: JobPosting[] = [
  { 
    id: 1, 
    title: 'Senior Product Designer', 
    category: 'Design', 
    location: 'Palma', 
    salary: '60.000€ - 80.000€', 
    salaryPeriod: 'pro Jahr',
    type: 'Vollzeit', 
    status: 'Aktiv', 
    views: 1240, 
    applications: 12, 
    postedDate: '12.05.2024',
    experience: '3-5 Jahre',
    languages: [{ name: 'Deutsch', level: 'Fließend' }, { name: 'Englisch', level: 'Verhandlungssicher' }],
    mobility: 'Führerschein',
    workPermit: 'Standard EU',
    salaryMin: 60000,
    salaryMax: 80000,
    benefits: { housing: false, nieSupport: true, meals: true },
    description: 'Wir suchen einen erfahrenen Designer für unsere Agentur in Palma.',
    gallery: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800']
  },
  { id: 2, title: 'Barman / Mixologist', category: 'Gastronomie', location: 'Andratx', salary: '2.500€ - 3.200€', salaryPeriod: 'pro Monat', type: 'Vollzeit', status: 'Aktiv', views: 890, applications: 45, postedDate: '15.05.2024' },
  { id: 3, title: 'Marketing Assistant', category: 'Marketing', location: 'Remote', salary: '1.800€', salaryPeriod: 'pro Monat', type: 'Teilzeit', status: 'Pausiert', views: 450, applications: 8, postedDate: '01.05.2024' },
];

const MOCK_CANDIDATES: CandidateApplication[] = [
  { id: 101, name: 'Lucas Meyer', jobTitle: 'Senior Product Designer', initials: 'LM', status: 'Neu', date: 'Heute', email: 'lucas@example.com', experience: '8 Jahre' },
  { id: 102, name: 'Maria Garcia', jobTitle: 'Barman / Mixologist', initials: 'MG', status: 'Eingeladen', date: 'Gestern', email: 'maria.g@web.de', experience: '4 Jahre' },
  { id: 103, name: 'Jan Schulze', jobTitle: 'Marketing Assistant', initials: 'JS', status: 'Neu', date: 'Vor 2 Tagen', email: 'j.schulze@gmail.com', experience: '1 Jahr' },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    candidateName: 'Lucas Meyer',
    candidateInitials: 'LM',
    lastMessage: 'Vielen Dank für die Einladung!',
    time: '14:20',
    unread: true,
    messages: [
      { id: 1, sender: 'employer', text: 'Hallo Lucas, wir haben dein Portfolio gesehen. Hast du Zeit für ein Call?', time: '10:00' },
      { id: 2, sender: 'candidate', text: 'Hallo! Ja, sehr gerne. Vielen Dank für die Einladung!', time: '14:20' }
    ]
  }
];

const DEFAULT_EMPLOYER: EmployerProfile = {
  companyName: "Mallorca Tech Solutions",
  contactPerson: "Marc Oliver",
  email: "m.oliver@mallorca-tech.es",
  phone: "+34 600 000 000",
  location: "Palma de Mallorca, Spain",
  exactAddress: "Carrer del Sindicat, 1, 07002 Palma",
  website: "https://mallorca-tech.es",
  industry: "Technologie / Software",
  logo: "",
  logoColor: "bg-blue-600",
  theme: 'light',
  foundingYear: "2018",
  teamSize: "11-50",
  description: "Mallorca Tech Solutions ist ein führender Anbieter für digitale Transformation im Mittelmeerraum. Wir verbinden mallorquinische Gastfreundschaft mit modernster Technologie.",
  gallery: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
  ],
  benefits: {
    housing: true,
    bureaucracy: true,
    whatsappApply: true,
  },
  whatsappNumber: "+34 611 222 333",
  socialNetworks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/mallorca-tech' },
    { platform: 'Instagram', url: 'https://instagram.com/mallorca_tech' }
  ],
  recruitingTeam: [
    { id: '1', name: 'Marc Oliver', role: 'Head of Recruiting', avatar: 'MO' },
    { id: '2', name: 'Elena Bosch', role: 'Talent Acquisition', avatar: 'EB' }
  ],
  videoUrl: "",
  billingCompanyName: "",
  vatId: "",
  billingStreet: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "Spanien",
  accountingEmail: "",
  culturePitch: {
    reason1: "",
    reason2: "",
    reason3: ""
  },
  languages: ["🇩🇪 Deutsch"]
};

// --- Helper Logic ---
interface ScoreDetail {
  id: string;
  label: string;
  points: number;
  isCompleted: boolean;
  suggestion: string;
}

const calculateProfileCompletion = (p: EmployerProfile): { total: number; details: ScoreDetail[] } => {
  const details: ScoreDetail[] = [
    { id: 'billing', label: "Rechnungsdaten", points: 30, isCompleted: !!(p.billingStreet && p.billingCity && p.billingZip && p.vatId && p.billingCompanyName), suggestion: "Offizielle Rechnungsdaten & USt-ID hinterlegen" },
    { id: 'logo', label: "Firmenlogo", points: 15, isCompleted: !!(p.logo && p.logo.length > 2), suggestion: "Eigenes Firmenlogo hochladen" },
    { id: 'description', label: "Über uns", points: 15, isCompleted: !!(p.description && p.description.length > 100), suggestion: "Ausführliche Firmenbeschreibung verfassen" },
    { id: 'benefits', label: "Mallorca-Benefits", points: 10, isCompleted: !!(p.benefits && (p.benefits.housing || p.benefits.bureaucracy || p.benefits.whatsappApply)), suggestion: "Lokale Mallorca-Benefits aktivieren" },
    { id: 'culture', label: "Sprachen & Kultur", points: 15, isCompleted: !!(p.languages && p.languages.length > 0 && p.culturePitch?.reason1), suggestion: "Sprachen & 'Warum wir?' Gründe angeben" },
    { id: 'team', label: "Team & Socials", points: 15, isCompleted: !!((p.recruitingTeam && p.recruitingTeam.length > 0) || (p.socialNetworks && p.socialNetworks.length > 0)), suggestion: "Recruiting-Team oder Social Media verknüpfen" },
  ];

  const total = details.reduce((acc, curr) => acc + (curr.isCompleted ? curr.points : 0), 0);
  return { total, details };
};

const VerifiedBadge = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <div className={`inline-flex items-center justify-center bg-blue-500 rounded-full p-0.5 shadow-sm ${className}`} title="Verifizierter Top Employer">
    <Check size={size - 4} className="text-white stroke-[4]" />
  </div>
);

// --- Components ---
const LogoDisplay = ({ profile, sizeClasses = "w-full h-full", textClasses = "text-white font-black" }: { profile: EmployerProfile, sizeClasses?: string, textClasses?: string }) => {
  const hasImage = profile.logo && profile.logo.length > 5;
  const initial = (profile.companyName || "F")[0].toUpperCase();
  
  if (hasImage) {
    return <img src={profile.logo} className={`${sizeClasses} object-cover`} alt="Company Logo" />;
  }
  
  return (
    <div className={`${sizeClasses} ${profile.logoColor || 'bg-blue-600'} flex items-center justify-center`}>
      <span className={textClasses}>{initial}</span>
    </div>
  );
};

const Logo = ({ theme, isExpanded, isVerified, profile }: { theme: Theme, isExpanded: boolean, isVerified: boolean, profile: EmployerProfile }) => {
  const isDark = theme === 'dark';
  const pinColor = isDark ? "#FFFFFF" : "#3b82f6";
  const primaryTextColor = isDark ? "#FFFFFF" : "#3b82f6";
  const secondaryTextColor = isDark ? "#FFFFFF" : "#1a1a1a";

  return (
    <div className={`flex items-center overflow-hidden select-none transition-all duration-300 ${isExpanded ? 'space-x-3' : 'justify-center space-x-0'}`}>
      <div className="min-w-[40px] flex justify-center relative">
        <svg width="34" height="38" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
          <path d="M18 0C8.05888 0 0 8.05888 0 18C0 26.3333 10 38.6667 18 42C26 38.6667 36 26.3333 36 18C36 8.05888 27.9411 0 18 0Z" fill={pinColor}/>
          <circle cx="18" cy="18" r="7" fill={isDark ? "#1a1a1a" : "#FFFFFF"}/>
        </svg>
        {isVerified && !isExpanded && (
          <div className="absolute -top-1 -right-1">
            <VerifiedBadge size={14} />
          </div>
        )}
      </div>
      <div className={`flex flex-col transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-[-20px] pointer-events-none absolute'}`}>
        <span className="text-[18px] font-[900] leading-none tracking-tighter uppercase italic" style={{ color: primaryTextColor }}>MALLORCA</span>
        <span className="text-[12px] font-[700] font-sans leading-none tracking-[0.15em] uppercase" style={{ color: secondaryTextColor }}>BUSINESS</span>
      </div>
    </div>
  );
};

const StatModule = ({ icon, label, value, color, theme }: { icon: React.ReactNode, label: string, value: string, color: string, theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-6 rounded-3xl flex items-center space-x-5 transition-all hover:translate-y-[-4px] hover:shadow-xl ${
      isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <div className={`text-3xl font-[900] tracking-tighter ${color}`}>{value}</div>
        <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{label}</div>
      </div>
    </div>
  );
};

const LaunchSpecialBox = ({ theme }: { theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`relative p-8 rounded-[2.5rem] overflow-hidden group border-2 border-amber-400/30 transition-all hover:shadow-2xl hover:shadow-amber-500/10 ${isDark ? 'glass-panel' : 'bg-white shadow-xl'}`}>
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 animate-pulse" />
       
       <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
                <Gift size={28} className="animate-bounce" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Launch Special</span>
                <h3 className={`text-2xl font-black uppercase tracking-tighter mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Startguthaben</h3>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-gray-500 uppercase block tracking-widest">Wert von</span>
             <span className="text-2xl font-black text-amber-500 italic">499€</span>
          </div>
       </div>

       <div className="space-y-4">
          <p className={`text-sm font-bold leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
             Willkommen bei Mallorca Business! Nutze <span className="text-blue-500">5 Premium Inserate</span> für 60 Tage völlig kostenlos.
          </p>
          
          <div className="space-y-2">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Slots genutzt</span>
                <span className="text-blue-500">0 / 5</span>
             </div>
             <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div className="w-[0%] h-full bg-blue-600 rounded-full" />
             </div>
          </div>
          
          <div className="pt-2 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
             <CheckCircle size={14} />
             <span>Aktiv bis 15. Juli 2024</span>
          </div>
       </div>
    </div>
  );
};

const Sidebar = ({ theme, currentView, setView, isExpanded, setIsExpanded, profile }: { 
  theme: Theme, 
  currentView: View, 
  setView: (v: View) => void,
  isExpanded: boolean,
  setIsExpanded: (v: boolean) => void,
  profile: EmployerProfile
}) => {
  const isDark = theme === 'dark';
  const { total: score } = useMemo(() => calculateProfileCompletion(profile), [profile]);
  const isVerified = score > 90;
  
  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { id: 'company-profile', icon: <Building2 size={22} />, label: 'Unternehmensprofil' },
    { id: 'create-job', icon: <PlusCircle size={22} />, label: 'Job erstellen' },
    { id: 'my-jobs', icon: <BriefcaseBusiness size={22} />, label: 'Meine Inserate' },
    { id: 'candidates', icon: <Users size={22} />, label: 'Kandidaten' },
    { id: 'billing', icon: <Package size={22} />, label: 'Pakete & Buchung' },
    { id: 'messages', icon: <MessageSquare size={22} />, label: 'Nachrichten' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Einstellungen' },
  ];

  return (
    <aside className={`sticky top-0 h-[calc(100vh-40px)] flex flex-col items-start z-50 transition-all duration-300 border-r rounded-[2.5rem] ${
      isExpanded ? 'w-72 pt-8 pb-10' : 'w-24 pt-5 pb-5'
    } ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
      
      <div className={`w-full flex items-center transition-all ${isExpanded ? 'px-5 mb-6' : 'px-0 justify-center mb-4'}`}>
        <div className="cursor-pointer" onClick={() => setView('dashboard')}>
          <Logo theme={theme} isExpanded={isExpanded} isVerified={isVerified} profile={profile} />
        </div>
      </div>

      <div className={`w-full px-3 flex justify-center transition-all ${isExpanded ? 'mb-8' : 'mb-2'}`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${!isExpanded ? 'justify-center' : ''} ${isDark ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-slate-50 text-slate-500 hover:text-blue-600'}`}
        >
          <div className="min-w-[24px] flex justify-center"><Menu size={20} /></div>
          <span className={`ml-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 translate-x-[-10px] pointer-events-none absolute'}`}>
            Menü einklappen
          </span>
        </button>
      </div>

      <nav className={`flex-1 w-full px-3 flex flex-col transition-all ${isExpanded ? 'space-y-1' : 'space-y-0.5'}`}>
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id as View)}
            className={`group relative flex items-center w-full p-3 rounded-xl transition-all duration-300 ${!isExpanded ? 'justify-center' : ''} ${
              currentView === item.id || (item.id === 'my-jobs' && currentView === 'job-preview')
                ? 'text-blue-500 bg-blue-500/10 font-black' 
                : isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <div className="min-w-[24px] flex justify-center transition-transform group-hover:scale-110">{item.icon}</div>
            <span className={`ml-4 text-sm transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px] pointer-events-none absolute'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className={`w-full transition-all duration-300 mt-auto ${isExpanded ? 'px-5 mb-4' : 'px-0 mb-2 flex flex-col items-center'}`}>
        <button 
          onClick={() => setView('settings')}
          className={`flex items-center w-full p-3 rounded-xl group transition-all ${!isExpanded ? 'justify-center' : ''} ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
        >
          <div className="w-10 h-10 min-w-[40px] rounded-full overflow-hidden border-2 border-blue-500/20 flex items-center justify-center bg-blue-600 text-white font-bold relative">
            <LogoDisplay profile={profile} textClasses="font-black text-xs" />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1">
                <VerifiedBadge size={14} />
              </div>
            )}
          </div>
          <div className={`ml-4 text-left transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100 translate-x-0 relative max-w-[140px]' : 'opacity-0 translate-x-[-10px] pointer-events-none absolute'}`}>
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold leading-none mb-1 truncate block max-w-full">{profile.companyName}</p>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Arbeitgeber</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

// --- Views ---

const DashboardHome = ({ theme, profile, onEditProfile }: { theme: Theme, profile: EmployerProfile, onEditProfile: () => void }) => {
  const isDark = theme === 'dark';
  const { total: completion } = useMemo(() => calculateProfileCompletion(profile), [profile]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Profil-Status-Widget */}
      {completion < 100 && (
        <div className={`p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-xl border transition-all duration-500 ${
          isDark ? 'glass-panel border-white/5' : 'bg-white border-slate-100'
        }`}>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
             <div className="relative w-32 h-32 flex items-center justify-center shrink-0 overflow-visible">
                <svg className="w-full h-full transform -rotate-90 overflow-visible p-2">
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-white/5" />
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * completion) / 100} strokeLinecap="round" className="text-blue-500 transition-all duration-1000 ease-out shadow-sm" />
                </svg>
                <span className="absolute text-2xl font-[900] tracking-tighter">{completion}%</span>
             </div>
             <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                   <Sparkles size={20} className="text-blue-500" />
                   <h4 className={`text-xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Employer-Ready Boost</h4>
                </div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-md">Vervollständige dein Profil für exzellente Sichtbarkeit und den Verifiziert-Haken!</p>
             </div>
          </div>
          <button 
            onClick={onEditProfile}
            className="mt-8 md:mt-0 px-12 py-5 bg-blue-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 flex items-center space-x-3"
          >
             <Edit2 size={18} />
             <span>Profil vervollständigen</span>
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatModule theme={theme} icon={<Briefcase size={24} />} label="Aktive Jobs" value="12" color="text-blue-500" />
        <StatModule theme={theme} icon={<FileText size={24} />} label="Bewerbungen gesamt" value="248" color="text-emerald-500" />
        <StatModule theme={theme} icon={<Eye size={24} />} label="Ansichten diese Woche" value="5.9k" color="text-amber-500" />
        
        <div className="sm:col-span-2 lg:col-span-1">
           <div className={`p-6 rounded-3xl flex items-center space-x-5 transition-all hover:translate-y-[-4px] border-2 border-amber-400/30 ${isDark ? 'glass-panel' : 'bg-white shadow-sm'}`}>
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500/10 shrink-0">
               <Gift size={24} className="text-amber-500" />
             </div>
             <div className="flex-1">
               <div className="flex items-center justify-between">
                  <div className="text-lg font-black tracking-tighter text-blue-500 leading-none">0 / 5</div>
                  <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Guthaben</span>
               </div>
               <div className={`text-[10px] uppercase tracking-[0.1em] font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Launch Special Free</div>
             </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`p-8 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Job-Views Trend</h3>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-gray-500">
                <TrendingUp size={14} className="text-emerald-500" />
                <span>+24% vs. letzte Woche</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6b7280' }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: '900' }} />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <LaunchSpecialBox theme={theme} />
        </div>

        <div className={`p-8 rounded-[3rem] flex flex-col ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <h3 className={`text-xl font-black uppercase tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Neueste Bewerber</h3>
          <div className="flex-1 space-y-6">
            {MOCK_CANDIDATES.map((cand) => (
              <div key={cand.id} className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                  {cand.initials}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight mb-1">{cand.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cand.jobTitle}</p>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{cand.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 rounded-2xl bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Alle Kandidaten</button>
        </div>
      </div>
    </div>
  );
};

const EmployerReadyScorecard = ({ theme, profile, onAnchorClick }: { theme: Theme, profile: EmployerProfile, onAnchorClick: (id: string) => void }) => {
  const isDark = theme === 'dark';
  const { total, details } = useMemo(() => calculateProfileCompletion(profile), [profile]);
  const incompleteSteps = details.filter(d => !d.isCompleted);

  return (
    <div className={`p-10 rounded-[3rem] mb-10 transition-all ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Award size={28} /></div>
          <div>
            <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Employer-Ready Score</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Optimiere dein Branding für exzellente Job-Matches</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-5xl font-black text-blue-600 leading-none">
            {total}<span className="text-sm text-gray-500 font-bold ml-1 uppercase tracking-widest">/100</span>
          </div>
          {total > 90 && (
            <div className="flex items-center space-x-1 mt-2 text-blue-500 animate-in slide-in-from-right-2">
              <VerifiedBadge size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">Top Employer Status</span>
            </div>
          )}
        </div>
      </div>

      <div className={`w-full h-5 rounded-full overflow-hidden mb-10 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-600/20"
          style={{ width: `${total}%` }}
        />
      </div>

      {incompleteSteps.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
             <ArrowUpCircle size={18} className="text-emerald-500" />
             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Nächste Schritte zur Optimierung</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incompleteSteps.slice(0, 3).map((step) => (
              <div 
                key={step.id} 
                onClick={() => onAnchorClick(step.id)}
                className={`p-6 rounded-[2rem] border-2 transition-all hover:scale-[1.02] cursor-pointer ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-slate-50 border-transparent hover:border-blue-500/30 shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{step.label}</span>
                   <span className="text-[10px] font-black text-emerald-500">+{step.points} PKT</span>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{step.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] animate-in zoom-in duration-500">
          <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
          <h4 className="text-xl font-black uppercase tracking-tighter text-emerald-500">Perfekt! Dein Profil ist Employer-Ready.</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Du hast den Top-Employer Badge erhalten.</p>
        </div>
      )}
    </div>
  );
};

const CompanyProfileView = ({ theme, profile, setProfile, onSave, isSaving, errors }: { 
  theme: Theme, 
  profile: EmployerProfile, 
  setProfile: (p: EmployerProfile) => void,
  onSave: () => void,
  isSaving: boolean,
  errors: string[]
}) => {
  const isDark = theme === 'dark';
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for auto-scrolling to sections
  const sectionRefs = {
    billing: useRef<HTMLElement>(null),
    logo: useRef<HTMLElement>(null),
    description: useRef<HTMLElement>(null),
    benefits: useRef<HTMLElement>(null),
    culture: useRef<HTMLElement>(null),
    team: useRef<HTMLElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    companyName: useRef<HTMLDivElement>(null),
    industry: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    billingCompanyName: useRef<HTMLDivElement>(null),
    vatId: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (id: string) => {
    const ref = sectionRefs[id as keyof typeof sectionRefs];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [socials, setSocials] = useState<SocialLink[]>(profile.socialNetworks || []);
  const [team, setTeam] = useState<TeamMember[]>(profile.recruitingTeam || []);
  const [gallery, setGallery] = useState<string[]>(profile.gallery || []);
  const [newSocialPlatform, setNewSocialPlatform] = useState("LinkedIn");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("");
  const [newTeamPhoto, setNewTeamPhoto] = useState<string | undefined>(undefined);

  const getClasses = (field: string) => {
    const hasError = errors.includes(field);
    return `w-full px-4 py-3 rounded-xl outline-none transition-all ${
      isDark 
        ? `bg-white/5 border ${hasError ? 'border-red-500' : 'border-white/10'} focus:bg-white/10 dark:focus:bg-gray-800 dark:focus:text-white focus:border-blue-500 text-white` 
        : `bg-slate-50 border ${hasError ? 'border-red-500' : 'border-slate-200'} focus:bg-white focus:border-blue-500 text-slate-800 shadow-sm`
    }`;
  };

  const labelClasses = `text-xs font-black uppercase tracking-widest mb-2.5 block ${isDark ? 'text-gray-500' : 'text-slate-400'}`;
  
  const Label = ({ children, field, required }: { children: React.ReactNode, field?: string, required?: boolean }) => (
    <label className={labelClasses}>
      {children} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const toggleBenefit = (key: keyof NonNullable<EmployerProfile['benefits']>) => {
    const currentBenefits = profile.benefits || { housing: false, bureaucracy: false, whatsappApply: false };
    setProfile({
      ...profile,
      benefits: { ...currentBenefits, [key]: !currentBenefits[key] }
    });
  };

  const addSocial = () => {
    if (newSocialUrl.trim()) {
      const updated = [...socials, { platform: newSocialPlatform, url: newSocialUrl }];
      setSocials(updated);
      setProfile({ ...profile, socialNetworks: updated });
      setNewSocialUrl("");
    }
  };

  const removeSocial = (idx: number) => {
    const updated = socials.filter((_, i) => i !== idx);
    setSocials(updated);
    setProfile({ ...profile, socialNetworks: updated });
  };

  const addTeamMember = () => {
    if (newTeamName.trim() && newTeamRole.trim()) {
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: newTeamName,
        role: newTeamRole,
        avatar: newTeamName.split(' ').map(n => n[0]).join('').toUpperCase(),
        photo: newTeamPhoto
      };
      const updated = [...team, newMember];
      setTeam(updated);
      setProfile({ ...profile, recruitingTeam: updated });
      setNewTeamName("");
      setNewTeamRole("");
      setNewTeamPhoto(undefined);
    }
  };

  const handleTeamPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTeamPhoto(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
      const updated = [...gallery, ...newUrls];
      setGallery(updated);
      setProfile({ ...profile, gallery: updated });
    }
  };

  const removeTeamMember = (id: string) => {
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    setProfile({ ...profile, recruitingTeam: updated });
  };

  const toggleLanguage = (lang: string) => {
    const current = profile.languages || [];
    const updated = current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang];
    setProfile({ ...profile, languages: updated });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProfile({ ...profile, logo: objectUrl });
    }
  };

  const deleteLogo = () => {
    setProfile({ ...profile, logo: "" });
  };

  const colorPresets = [
    { name: 'Blau', class: 'bg-blue-600' },
    { name: 'Grün', class: 'bg-emerald-500' },
    { name: 'Lila', class: 'bg-purple-600' },
    { name: 'Orange', class: 'bg-amber-500' },
    { name: 'Dunkelgrau', class: 'bg-slate-800' },
  ];

  const hasLogoImage = profile.logo && profile.logo.length > 5;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      
      {/* 0. Scorecard Integration */}
      <EmployerReadyScorecard theme={theme} profile={profile} onAnchorClick={scrollToSection} />

      {/* 1. Basis-Info & Details */}
      <section ref={sectionRefs.logo} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <Building2 className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Basis-Info & Details</h3>
        </div>
        
        <div className="flex flex-col items-center mb-10 pb-10 border-b border-white/5">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl overflow-hidden ${errors.includes('logo') ? 'ring-4 ring-red-500' : ''} transition-all duration-300`}>
               <LogoDisplay profile={profile} textClasses="font-black text-4xl" />
            </div>
            
            <div className="absolute bottom-[-10px] right-[-10px] flex space-x-2">
               {hasLogoImage && (
                 <button 
                   onClick={deleteLogo}
                   className="bg-red-500 p-2.5 rounded-2xl text-white shadow-lg border-4 border-[#0f0f0f] hover:scale-110 transition-all z-10"
                   title="Logo löschen"
                 >
                   <Trash size={16} />
                 </button>
               )}
               <button 
                 onClick={() => logoInputRef.current?.click()}
                 className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg border-4 border-[#0f0f0f] hover:scale-110 transition-all z-10"
                 title={hasLogoImage ? "Logo ändern" : "Logo hochladen"}
               >
                 <Camera size={18} />
               </button>
            </div>
            
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoChange}
            />
          </div>
          
          <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Unternehmenslogo <span className="text-red-500">*</span></p>

          {!hasLogoImage && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2">
               <p className="text-[9px] font-black uppercase text-center text-gray-400 mb-3 tracking-widest">Logo-Farbe wählen</p>
               <div className="flex space-x-3">
                  {colorPresets.map((color) => (
                    <button 
                      key={color.class}
                      onClick={() => setProfile({...profile, logoColor: color.class})}
                      className={`w-6 h-6 rounded-full ${color.class} border-2 ${profile.logoColor === color.class ? 'border-blue-500 scale-125' : 'border-transparent'} transition-all shadow-sm`}
                      title={color.name}
                    />
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={sectionRefs.companyName} className="md:col-span-2 lg:col-span-1">
            <Label field="companyName" required>Unternehmensname</Label>
            <input className={getClasses('companyName')} value={profile.companyName} onChange={e => setProfile({...profile, companyName: e.target.value})} />
          </div>
          <div ref={sectionRefs.industry} className="md:col-span-2 lg:col-span-1">
            <Label field="industry" required>Branche</Label>
            <input className={getClasses('industry')} value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} />
          </div>
          <div>
            <Label>Webseite</Label>
            <input className={getClasses('website')} value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gründungsjahr</Label>
              <input type="number" className={getClasses('foundingYear')} value={profile.foundingYear || ""} onChange={e => setProfile({...profile, foundingYear: e.target.value})} placeholder="z.B. 2010" />
            </div>
            <div>
              <Label>Teamgröße</Label>
              <select className={getClasses('teamSize')} value={profile.teamSize || ""} onChange={e => setProfile({...profile, teamSize: e.target.value})}>
                <option value="1-10">1-10 Mitarbeiter</option>
                <option value="11-50">11-50 Mitarbeiter</option>
                <option value="51-200">51-200 Mitarbeiter</option>
                <option value="201-500">201-500 Mitarbeiter</option>
                <option value="500+">500+ Mitarbeiter</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Warum wir? (Kultur-Pitch) */}
      <section ref={sectionRefs.culture} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <HeartHandshake className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Warum wir? (Kultur-Pitch)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Label>Grund 1</Label>
            <input className={getClasses('culturePitch')} value={profile.culturePitch?.reason1 || ""} onChange={e => setProfile({...profile, culturePitch: {...profile.culturePitch!, reason1: e.target.value}})} placeholder="z.B. Jeden Freitag BBQ" />
          </div>
          <div>
            <Label>Grund 2</Label>
            <input className={getClasses('culturePitch')} value={profile.culturePitch?.reason2 || ""} onChange={e => setProfile({...profile, culturePitch: {...profile.culturePitch!, reason2: e.target.value}})} placeholder="z.B. Hunde im Büro erlaubt" />
          </div>
          <div>
            <Label>Grund 3</Label>
            <input className={getClasses('culturePitch')} value={profile.culturePitch?.reason3 || ""} onChange={e => setProfile({...profile, culturePitch: {...profile.culturePitch!, reason3: e.target.value}})} placeholder="z.B. Top Provision / Boni" />
          </div>
        </div>
      </section>

      {/* 3. Unternehmens-Sprache */}
      <section className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <Languages className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Gesprochene Sprachen</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {["🇩🇪 Deutsch", "🇬🇧 Englisch", "🇪🇸 Spanisch", "🇫🇷 Französisch", "Catalán / Mallorquín"].map((lang) => (
            <button 
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 border-2 ${
                profile.languages?.includes(lang) 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                  : isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{lang}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Über uns (Rich Content) */}
      <section ref={sectionRefs.description} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <FileText className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Über uns</h3>
        </div>
        <div className="space-y-8">
          <div>
            <Label required>Firmenbeschreibung</Label>
            <textarea rows={6} className={`${getClasses('description')} resize-none`} value={profile.description || ""} onChange={e => setProfile({...profile, description: e.target.value})} placeholder="Erzählen Sie Ihre Geschichte... (mind. 20 Zeichen)" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Bildergalerie</Label>
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="text-[10px] font-black uppercase text-blue-500 flex items-center space-x-2 bg-blue-500/10 px-3 py-1.5 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
              >
                <Plus size={14} />
                <span>Fotos hochladen</span>
              </button>
              <input 
                type="file" 
                ref={galleryInputRef} 
                className="hidden" 
                multiple 
                accept="image/*" 
                onChange={handleGalleryUpload}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group border border-white/5 shadow-sm">
                  <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Gallery" />
                  <button onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {gallery.length < 8 && (
                <div 
                  onClick={() => galleryInputRef.current?.click()}
                  className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${isDark ? 'border-white/10 hover:border-blue-500 hover:bg-white/5' : 'border-slate-200 hover:border-blue-500 hover:bg-slate-50'}`}
                >
                  <ImageIcon size={24} className="text-gray-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Hinzufügen</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Unternehmens-Video */}
      <section className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <Play className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Unternehmens-Video</h3>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
             <Label>YouTube / Vimeo Link</Label>
             {profile.videoUrl && (
               <button 
                onClick={() => setProfile({...profile, videoUrl: ""})}
                className="flex items-center space-x-1.5 text-[9px] font-black uppercase text-red-400 hover:text-red-500 transition-colors"
               >
                  <Trash size={12} />
                  <span>Video entfernen</span>
               </button>
             )}
          </div>
          <div className="relative mb-6">
            <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className={`${getClasses('videoUrl')} pl-12`} value={profile.videoUrl || ""} onChange={e => setProfile({...profile, videoUrl: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          
          {profile.videoUrl && getVideoEmbedUrl(profile.videoUrl) && (
            <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10 mb-6">
               <iframe 
                 title="Company Video Preview"
                 src={getVideoEmbedUrl(profile.videoUrl)!}
                 className="w-full h-full border-0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
            </div>
          )}

          <div className={`p-4 rounded-2xl flex items-start space-x-3 ${isDark ? 'bg-blue-500/5' : 'bg-blue-50'}`}>
             <Sparkles size={16} className="text-blue-500 mt-0.5 shrink-0" />
             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-relaxed">
                Profitipp: Zeige dein Team in Action! Inserate mit Video erhalten deutlich mehr Bewerbungen.
             </p>
          </div>
        </div>
      </section>

      {/* 6. Mallorca-Benefits (Unsere USPs) */}
      <section ref={sectionRefs.benefits} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <Award className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Mallorca-Benefits (Unsere USPs)</h3>
        </div>
        
        <div className={`p-8 rounded-[2rem] space-y-6 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-blue-50/50 border border-blue-100 shadow-inner'}`}>
          <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><MapPin size={20} /></div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">Unterkunft vorhanden / Personalzimmer</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Hervorragendes Argument für Saisonkräfte</p>
              </div>
            </div>
            <button onClick={() => toggleBenefit('housing')} className={`p-2 transition-all ${profile.benefits?.housing ? 'text-blue-500' : 'text-gray-500'}`}>
              {profile.benefits?.housing ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><CheckSquare size={20} /></div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">Hilfe bei Behördengängen (NIE, etc.)</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Wir unterstützen beim Start auf Mallorca</p>
              </div>
            </div>
            <button onClick={() => toggleBenefit('bureaucracy')} className={`p-2 transition-all ${profile.benefits?.bureaucracy ? 'text-blue-500' : 'text-gray-500'}`}>
              {profile.benefits?.bureaucracy ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-600/10 text-emerald-600 rounded-2xl"><MessageCircle size={20} /></div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">WhatsApp-Bewerbung erlauben</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Bewerber können direkt Kontakt aufnehmen</p>
                </div>
              </div>
              <button onClick={() => toggleBenefit('whatsappApply')} className={`p-2 transition-all ${profile.benefits?.whatsappApply ? 'text-emerald-500' : 'text-gray-500'}`}>
                {profile.benefits?.whatsappApply ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>
            
            {profile.benefits?.whatsappApply && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <Label>WhatsApp Nummer für Bewerbungen</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                  <input className={`${getClasses('whatsappNumber')} pl-12 border-emerald-500/20`} value={profile.whatsappNumber || ""} onChange={e => setProfile({...profile, whatsappNumber: e.target.value})} placeholder="+34 ..." />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Social Media & Kontakt */}
      <section className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <MapPinned className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Social Media & Kontakt</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <Label>Social Media Links</Label>
              <div className="flex space-x-3 mb-4">
                <select className={`${getClasses('socialPlatform')} w-1/3`} value={newSocialPlatform} onChange={e => setNewSocialPlatform(e.target.value)}>
                  <option>LinkedIn</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>X</option>
                </select>
                <input className="flex-1 px-4 py-3 rounded-xl outline-none bg-slate-50 border border-slate-200 focus:bg-white dark:focus:bg-gray-800 dark:focus:text-white focus:border-blue-500 text-xs dark:bg-white/5 dark:border-white/10 dark:text-white" placeholder="Profil URL..." value={newSocialUrl} onChange={e => setNewSocialUrl(e.target.value)} />
                <button onClick={addSocial} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all"><Plus size={20} /></button>
              </div>
              <div className="space-y-2">
                {socials.map((net, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        {net.platform === 'LinkedIn' ? <Linkedin size={14} /> : net.platform === 'Instagram' ? <Instagram size={14} /> : net.platform === 'Facebook' ? <Facebook size={14} /> : <Twitter size={14} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{net.platform}</span>
                      <span className="text-[9px] text-gray-500 truncate max-w-[150px]">{net.url}</span>
                    </div>
                    <button onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div ref={sectionRefs.location}>
                <Label required>Anzeige-Ort (z.B. Palma)</Label>
                <input className={getClasses('location')} value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="Wo wird der Job angezeigt?" />
              </div>
              <div>
                <Label>Exakte Adresse (für Google Maps)</Label>
                <input className={getClasses('exactAddress')} value={profile.exactAddress || ""} onChange={e => setProfile({...profile, exactAddress: e.target.value})} placeholder="Straße, Hausnummer, PLZ, Ort" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Label>Google Maps Vorschau</Label>
            <div className={`rounded-[2.5rem] overflow-hidden border border-white/5 h-[300px] w-full relative group ${isDark ? 'bg-white/5' : 'bg-slate-50 shadow-inner'}`}>
              {profile.exactAddress ? (
                <iframe 
                  title="Google Maps Location"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg)' : 'none' }} 
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(profile.exactAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                  <MapPinned size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Adresse eingeben für Kartenansicht</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Unser Team */}
      <section ref={sectionRefs.team} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <Users2 className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Unser Team</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
             <div className={`p-6 rounded-[2rem] border-2 border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Mitglied hinzufügen</p>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                     <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-lg">
                           {newTeamPhoto ? (
                             <img src={newTeamPhoto} className="w-full h-full object-cover" alt="New Team Member" />
                           ) : (
                             <User size={32} className="text-white/50" />
                           )}
                        </div>
                        <button 
                          onClick={() => teamPhotoInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-[#0f0f0f] group-hover:scale-110 transition-all"
                        >
                          <Camera size={14} />
                        </button>
                        <input type="file" ref={teamPhotoInputRef} className="hidden" accept="image/*" onChange={handleTeamPhotoChange} />
                     </div>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <input className={getClasses('teamMember')} value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="z.B. Marc Oliver" />
                  </div>
                  <div>
                    <Label>Rolle</Label>
                    <input className={getClasses('teamRole')} value={newTeamRole} onChange={e => setNewTeamRole(e.target.value)} placeholder="z.B. Head of Recruiting" />
                  </div>
                  <button onClick={addTeamMember} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center space-x-2 shadow-sm">
                    <PlusSquare size={16} />
                    <span>Hinzufügen</span>
                  </button>
                </div>
             </div>
          </div>

          <div className="lg:col-span-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.id} className={`p-5 rounded-[2rem] border-2 transition-all hover:border-blue-500/30 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg overflow-hidden">
                             {member.photo ? <img src={member.photo} className="w-full h-full object-cover" alt={member.name} /> : member.avatar}
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-tight">{member.name}</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase">{member.role}</p>
                          </div>
                       </div>
                       <button onClick={() => removeTeamMember(member.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                   <div className="col-span-2 py-10 text-center opacity-30 border-2 border-dashed border-gray-500/10 rounded-[2rem]">
                      <Users2 size={32} className="mx-auto mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Keine Teammitglieder hinterlegt</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* 9. Rechnungsdaten (Intern) */}
      <section ref={sectionRefs.billing} className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-3 mb-10">
          <ReceiptText className="text-blue-500" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Rechnungsdaten (Intern)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={sectionRefs.billingCompanyName}>
            <Label required>Offizieller Firmenname</Label>
            <input className={getClasses('billingCompanyName')} value={profile.billingCompanyName || ""} onChange={e => setProfile({...profile, billingCompanyName: e.target.value})} placeholder="Firmenname for Rechnungen" />
          </div>
          <div ref={sectionRefs.vatId}>
            <Label required>Umsatzsteuer-ID / NIF</Label>
            <input className={getClasses('vatId')} value={profile.vatId || ""} onChange={e => setProfile({...profile, vatId: e.target.value})} placeholder="z.B. ESB12345678" />
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <Label required>Straße & Hausnummer</Label>
                <input className={getClasses('billingStreet')} value={profile.billingStreet || ""} onChange={e => setProfile({...profile, billingStreet: e.target.value})} placeholder="Mallorca Ave. 12" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <Label required>PLZ</Label>
                   <input className={getClasses('billingZip')} value={profile.billingZip || ""} onChange={e => setProfile({...profile, billingZip: e.target.value})} placeholder="07001" />
                </div>
                <div>
                   <Label required>Ort</Label>
                   <input className={getClasses('billingCity')} value={profile.billingCity || ""} onChange={e => setProfile({...profile, billingCity: e.target.value})} placeholder="Palma" />
                </div>
             </div>
          </div>

          <div>
             <Label required>Land</Label>
             <input className={getClasses('billingCountry')} value={profile.billingCountry || ""} onChange={e => setProfile({...profile, billingCountry: e.target.value})} placeholder="Spanien" />
          </div>

          <div className="md:col-span-1">
            <Label>Buchhaltungs-E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input className={`${getClasses('accountingEmail')} pl-12`} value={profile.accountingEmail || ""} onChange={e => setProfile({...profile, accountingEmail: e.target.value})} placeholder="rechnung@firma.de" />
            </div>
          </div>
        </div>
      </section>

      {/* Button Save */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center space-x-3 px-10 py-5 ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-500/30 active:scale-95 transition-all min-w-[240px] justify-center`}
        >
          {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          <span>{isSaving ? 'Speichert...' : 'Profil speichern'}</span>
        </button>
      </div>

    </div>
  );
};

// --- Multi-Step Job Creation Component ---
const CreateJobView = ({ 
  theme, 
  onShowToast, 
  onPublish, 
  formData, 
  setFormData, 
  isEditing,
  onCancelEdit
}: { 
  theme: Theme, 
  onShowToast: (msg: string, type: 'success' | 'warning' | 'error') => void, 
  onPublish: (data: any) => void,
  formData: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  isEditing: boolean,
  onCancelEdit: () => void
}) => {
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const matchingCount = 124;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { lang: 'Deutsch', level: 'Fließend' }]
    }));
  };

  const removeLanguage = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx)
    }));
  };

  const updateLanguage = (idx: number, field: 'lang' | 'level', value: string) => {
    const updated = [...formData.languages];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData(prev => ({ ...prev, languages: updated }));
  };

  const handlePublish = () => {
    onPublish(formData);
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 dark:focus:bg-gray-800 dark:focus:text-white' : 'bg-slate-50 border-slate-200'} outline-none focus:border-blue-500 text-sm transition-all`;
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block";
  
  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-12 px-2">
      {[
        { n: 1, l: 'Basis' },
        { n: 2, l: 'Anforderungen' },
        { n: 3, l: 'Benefits' },
        { n: 4, l: 'Review' }
      ].map((s) => (
        <div key={s.n} className="flex flex-col items-center flex-1 relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs z-10 transition-all duration-500 ${
            step >= s.n ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : isDark ? 'bg-white/5 text-gray-500' : 'bg-slate-100 text-slate-400'
          }`}>
            {step > s.n ? <Check size={16} strokeWidth={4} /> : s.n}
          </div>
          <span className={`mt-3 text-[9px] font-black uppercase tracking-widest transition-all ${
            step >= s.n ? 'text-blue-500' : 'text-gray-500'
          }`}>
            {s.l}
          </span>
          {s.n < 4 && (
            <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${
              step > s.n ? 'bg-blue-600' : isDark ? 'bg-white/5' : 'bg-slate-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const MatchingTicker = () => (
    <div className={`p-6 rounded-3xl border-2 border-dashed border-blue-500/30 animate-pulse ${isDark ? 'bg-blue-500/5' : 'bg-blue-50'}`}>
      <div className="flex items-center space-x-3 text-blue-500 mb-2">
        <Zap size={18} fill="currentColor" />
        <span className="text-[10px] font-black uppercase tracking-widest">Live-Matching-Check</span>
      </div>
      <p className="text-sm font-bold tracking-tight">
        Dein Inserat passt aktuell zu ca. <span className="text-blue-500 text-lg font-black">{matchingCount}</span> registrierten Bewerbern.
      </p>
    </div>
  );

  const previewJobData = useMemo(() => ({
    title: formData.title || 'Vorschau Inserat',
    industry: formData.category,
    type: formData.type,
    location: formData.region,
    experience: formData.experience,
    languages: formData.languages.map((l: any) => ({ name: l.lang, level: l.level })),
    mobility: formData.licenseRequired ? "Führerschein" : "",
    workPermit: formData.workPermitMandatory ? "EU / NIE" : "Nicht erforderlich",
    salaryMin: parseInt(formData.salaryFrom) || 0,
    salaryMax: parseInt(formData.salaryTo) || 0,
    salaryPeriod: formData.salaryPeriod,
    benefits: {
      housing: formData.benefitHousing,
      nieSupport: formData.benefitNie,
      meals: formData.benefitFood
    },
    description: formData.description,
    videoUrl: formData.videoUrl,
    gallery: formData.gallery
  }), [formData]);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!showPreview ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {isEditing ? 'Inserat bearbeiten' : 'Neues Inserat erstellen'}
            </h2>
            {isEditing && (
              <button 
                onClick={onCancelEdit}
                className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
              >
                Abbrechen & Zurück
              </button>
            )}
          </div>

          <ProgressBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              
              {step === 1 && (
                <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in slide-in-from-right-4 duration-300`}>
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><PlusCircle size={24} /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Basis-Informationen</h3>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <label className={labelClasses}>Job-Titel (inkl. m/w/d)</label>
                        <input className={inputClasses} placeholder="z.B. Erfahrener Koch (m/w/d) for Strandbar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">Profitipp: Inserate mit präzisen Titeln erhalten 40% mehr Klicks.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className={labelClasses}>Kategorie</label>
                           <select className={inputClasses} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                              <option>Gastronomie</option>
                              <option>Handwerk</option>
                              <option>Office & Verwaltung</option>
                              <option>Technik & Digital</option>
                              <option>Tourismus & Events</option>
                           </select>
                        </div>
                        <div>
                           <label className={labelClasses}>Anstellungsart</label>
                           <select className={inputClasses} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                              <option>Vollzeit</option>
                              <option>Teilzeit</option>
                              <option>Saisonarbeit</option>
                              <option>Befristet</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Region (Mallorca-Matching)</label>
                        <select className={inputClasses} value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                           <option>Palma</option>
                           <option>Südwest (Andratx, Calvià)</option>
                           <option>Nord (Alcudia, Pollença)</option>
                           <option>Ost (Cala Millor, Manacor)</option>
                           <option>Süd (Llucmajor, Santanyí)</option>
                           <option>Tramuntana (Sóller, Valldemossa)</option>
                        </select>
                     </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in slide-in-from-right-4 duration-300`}>
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Target size={24} /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Anforderungen & Matching</h3>
                  </div>
                  <div className="space-y-10">
                     <div>
                        <label className={labelClasses}>Erfahrung</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {['Einsteiger', '1-2 Jahre', '3-5 Jahre', 'Experte'].map((exp) => (
                             <button key={exp} onClick={() => setFormData({...formData, experience: exp})} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                               formData.experience === exp ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'bg-white/5 text-gray-500' : 'bg-slate-50 text-slate-500'
                             }`}>{exp}</button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <label className={labelClasses}>Benötigte Sprachen</label>
                           <button onClick={addLanguage} className="flex items-center space-x-1 text-[10px] font-black uppercase text-blue-500 hover:text-blue-400">
                              <Plus size={14} /> <span>Hinzufügen</span>
                           </button>
                        </div>
                        <div className="space-y-3">
                           {formData.languages.map((lang: any, idx: number) => (
                             <div key={idx} className={`p-4 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-2 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
                                <select className={`${inputClasses} !w-1/3`} value={lang.lang} onChange={e => updateLanguage(idx, 'lang', e.target.value)}>
                                   <option>Deutsch</option>
                                   <option>Spanisch</option>
                                   <option>Englisch</option>
                                   <option>Französisch</option>
                                   <option>Mallorquinisch</option>
                                </select>
                                <select className={`${inputClasses} !flex-1`} value={lang.level} onChange={e => updateLanguage(idx, 'level', e.target.value)}>
                                   <option>Basis (A1/A2)</option>
                                   <option>Fließend (B2/C1)</option>
                                   <option>Muttersprache</option>
                                </select>
                                <button onClick={() => removeLanguage(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash size={16} /></button>
                             </div>
                           ))}
                           {formData.languages.length === 0 && (
                             <p className="text-center py-6 text-[10px] font-bold text-gray-500 uppercase italic">Keine Sprachkenntnisse gefordert</p>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-white/5">
                        <div className="space-y-4">
                           <label className={labelClasses}>Mobilität</label>
                           <label className="flex items-center space-x-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.licenseRequired ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}>
                                 {formData.licenseRequired && <Check size={14} className="text-white" strokeWidth={4} />}
                              </div>
                              <input type="checkbox" className="hidden" checked={formData.licenseRequired} onChange={e => setFormData({...formData, licenseRequired: e.target.checked})} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Führerschein erforderlich</span>
                           </label>
                           <label className="flex items-center space-x-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.vehicleNeeded ? 'bg-blue-600 border-blue-600' : 'border-white/10'}`}>
                                 {formData.vehicleNeeded && <Check size={14} className="text-white" strokeWidth={4} />}
                              </div>
                              <input type="checkbox" className="hidden" checked={formData.vehicleNeeded} onChange={e => setFormData({...formData, vehicleNeeded: e.target.checked})} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Eigenes Fahrzeug notwendig</span>
                           </label>
                        </div>
                        <div className="space-y-4">
                           <label className={labelClasses}>Arbeitserlaubnis</label>
                           <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">EU / NIE Pflicht?</span>
                              <button onClick={() => setFormData({...formData, workPermitMandatory: !formData.workPermitMandatory})} className="text-blue-500">
                                 {formData.workPermitMandatory ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in slide-in-from-right-4 duration-300`}>
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Euro size={24} /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Benefits & Gehalt</h3>
                  </div>
                  <div className="space-y-10">
                     <div>
                        <label className={labelClasses}>Gehalt & Zeitraum</label>
                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="relative">
                                 <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                 <input type="number" className={`${inputClasses} pl-10`} placeholder="Min" value={formData.salaryFrom} onChange={e => setFormData({...formData, salaryFrom: e.target.value})} />
                              </div>
                              <div className="relative">
                                 <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                 <input type="number" className={`${inputClasses} pl-10`} placeholder="Max" value={formData.salaryTo} onChange={e => setFormData({...formData, salaryTo: e.target.value})} />
                              </div>
                           </div>
                           <div className="md:w-1/3">
                              <select 
                                className={inputClasses} 
                                value={formData.salaryPeriod} 
                                onChange={e => setFormData({...formData, salaryPeriod: e.target.value})}
                              >
                                 <option>pro Monat</option>
                                 <option>pro Jahr</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className={labelClasses}>Mallorca-Benefits (Matching-Trigger)</label>
                        <div className="grid grid-cols-1 gap-4">
                           <div className={`p-5 rounded-[2rem] flex items-center justify-between border-2 transition-all ${formData.benefitHousing ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'}`}>
                              <div className="flex items-center space-x-4">
                                 <div className={`p-2 rounded-xl ${formData.benefitHousing ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-gray-500'}`}><Home size={20} /></div>
                                 <div>
                                    <p className="text-xs font-black uppercase tracking-tight">Unterkunft wird gestellt</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Personalzimmer oder Wohnung inklusive</p>
                                 </div>
                              </div>
                              <button onClick={() => setFormData({...formData, benefitHousing: !formData.benefitHousing})} className="text-emerald-500">
                                 {formData.benefitHousing ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                              </button>
                           </div>

                           <div className={`p-5 rounded-[2rem] flex items-center justify-between border-2 transition-all ${formData.benefitNie ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'}`}>
                              <div className="flex items-center space-x-4">
                                 <div className={`p-2 rounded-xl ${formData.benefitNie ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-gray-500'}`}><ShieldCheck size={20} /></div>
                                 <div>
                                    <p className="text-xs font-black uppercase tracking-tight">Hilfe bei Behördengängen</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Unterstützung bei NIE / Anmeldung</p>
                                 </div>
                              </div>
                              <button onClick={() => setFormData({...formData, benefitNie: !formData.benefitNie})} className="text-emerald-500">
                                 {formData.benefitNie ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                              </button>
                           </div>

                           <div className={`p-5 rounded-[2rem] flex items-center justify-between border-2 transition-all ${formData.benefitFood ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'}`}>
                              <div className="flex items-center space-x-4">
                                 <div className={`p-2 rounded-xl ${formData.benefitFood ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-gray-500'}`}><HeartHandshake size={20} /></div>
                                 <div>
                                    <p className="text-xs font-black uppercase tracking-tight">Verpflegung inklusive</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Kostenlose Mahlzeiten während der Schicht</p>
                                 </div>
                              </div>
                              <button onClick={() => setFormData({...formData, benefitFood: !formData.benefitFood})} className="text-emerald-500">
                                 {formData.benefitFood ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in slide-in-from-right-4 duration-300`}>
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Edit2 size={24} /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Details & Media</h3>
                  </div>
                  <div className="space-y-10">
                     <div>
                        <label className={labelClasses}>Job-Beschreibung</label>
                        <textarea rows={8} className={`${inputClasses} resize-none`} placeholder="Erzählen Sie mehr über die Rolle..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className={labelClasses}>Video-URL (YouTube/Vimeo)</label>
                           <div className="relative">
                              <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input className={`${inputClasses} pl-10`} placeholder="Link einfügen..." value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                           </div>
                        </div>
                        <div>
                           <label className={labelClasses}>Job-Galerie</label>
                           <button className={`w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center space-x-2`}>
                              <ImageIcon size={16} /> <span>Fotos wählen</span>
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6">
                 <button 
                  onClick={prevStep} 
                  disabled={step === 1}
                  className={`px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center space-x-2 transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'
                  }`}
                 >
                    <ChevronLeft size={16} />
                    <span>Zurück</span>
                 </button>
                 
                 {step < 4 ? (
                   <button 
                    onClick={nextStep}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-95"
                   >
                      <span>Weiter zum nächsten Schritt</span>
                      <ChevronRight size={16} />
                   </button>
                 ) : (
                   <button 
                    onClick={() => setShowPreview(true)}
                    className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-blue-500 transition-all flex items-center space-x-3 shadow-2xl shadow-blue-600/30 active:scale-95"
                   >
                      <Eye size={20} />
                      <span>Vorschau & {isEditing ? 'Speichern' : 'Veröffentlichen'}</span>
                   </button>
                 )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <MatchingTicker />
               
               <div className={`p-8 rounded-[2.5rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6 italic">Deine Auswahl</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase">
                        <span>Basis</span>
                        {step > 1 ? <Check size={14} className="text-emerald-500" /> : <span>Warten...</span>}
                     </div>
                     <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase">
                        <span>Matching</span>
                        {step > 2 ? <Check size={14} className="text-emerald-500" /> : <span>Warten...</span>}
                     </div>
                     <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase">
                        <span>Verkauf</span>
                        {step > 3 ? <Check size={14} className="text-emerald-500" /> : <span>Warten...</span>}
                     </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5">
                     <div className="flex items-center space-x-3 text-amber-500 mb-2">
                        <AlertCircle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Pflichtfeld Check</span>
                     </div>
                     <p className="text-[9px] leading-relaxed text-gray-500 uppercase font-bold">Matching-relevante Felder sind mit einem Stern markiert. Eine gute Datenqualität sorgt für bessere Treffer im Pool.</p>
                  </div>
               </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative">
          <JobDetailPreview jobData={previewJobData} onBack={() => setShowPreview(false)} theme={theme} />
          {/* Action Overlay for Creation Mode */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] flex items-center space-x-6 animate-in slide-in-from-bottom-10 duration-700">
             <button 
              onClick={() => setShowPreview(false)}
              className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-[2rem] font-black uppercase text-xs tracking-widest border border-white/10 hover:bg-white/20 transition-all shadow-2xl"
             >
               Weiter bearbeiten
             </button>
             <button 
              onClick={handlePublish}
              className="px-12 py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-500 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.4)] active:scale-95 flex items-center space-x-3"
             >
               <CheckCircle2 size={24} />
               <span>{isEditing ? 'Änderungen speichern' : 'Inserat jetzt veröffentlichen'}</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MyJobsView = ({ theme, jobs, onToggleStatus, onDelete, onPreview, onEdit }: { theme: Theme, jobs: JobPosting[], onToggleStatus: (id: number) => void, onDelete: (id: number) => void, onPreview: (job: JobPosting) => void, onEdit: (job: JobPosting) => void }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel shadow-2xl' : 'bg-white border border-slate-200 shadow-sm'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
             <BriefcaseBusiness size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Meine Inserate</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verwalte deine aktiven Stellenausschreibungen</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-gray-500">Gesamt aktiv</p>
              <p className="text-xl font-black text-blue-500">{jobs.filter(j => j.status === 'Aktiv').length}</p>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Job-Titel & Details</th>
              <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Veröffentlicht</th>
              <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className={`group transition-all hover:translate-x-1 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'} rounded-[2rem]`}>
                <td className="px-6 py-6 rounded-l-[1.5rem]">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs ${isDark ? 'bg-white/10' : 'bg-white shadow-sm border border-slate-200'}`}>
                      <Briefcase size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm leading-none mb-1 text-blue-600 cursor-pointer" onClick={() => onPreview(job)}>{job.title}</p>
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                         <span className="flex items-center space-x-1"><MapPin size={10} className="text-blue-500" /> <span>Mallorca, {job.location}</span></span>
                         <span>•</span>
                         <span>{job.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-fit space-x-1.5 ${
                    job.status === 'Aktiv' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'Aktiv' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{job.status}</span>
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-500 uppercase">{job.postedDate}</span>
                    <div className="flex items-center space-x-2 mt-1 opacity-50">
                       <Eye size={12} />
                       <span className="text-[10px] font-bold">{job.views} Views</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 rounded-r-[1.5rem] text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => onPreview(job)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-white shadow-sm text-slate-500 hover:text-blue-600'}`} title="Vorschau">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit(job)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-white shadow-sm text-slate-500 hover:text-blue-600'}`} title="Bearbeiten">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(job.id)}
                      className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-white shadow-sm text-slate-500 hover:text-amber-600'}`} 
                      title={job.status === 'Aktiv' ? "Pausieren" : "Aktivieren"}
                    >
                      {job.status === 'Aktiv' ? <EyeOff size={18} /> : <Play size={18} />}
                    </button>
                    <button 
                      onClick={() => onDelete(job.id)}
                      className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-500' : 'hover:bg-white shadow-sm text-slate-500 hover:text-red-500'}`} 
                      title="Löschen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
               <tr>
                 <td colSpan={4} className="py-20 text-center">
                    <div className="opacity-20 flex flex-col items-center">
                       <Briefcase size={48} className="mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">Keine Inserate vorhanden</p>
                    </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CandidatesViewPlaceholder = ({ theme }: { theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center space-x-3 mb-10">
        <Users className="text-blue-500" />
        <h3 className="text-2xl font-black uppercase tracking-tighter">Kandidaten Pool</h3>
      </div>
      <div className="space-y-6">
        {MOCK_CANDIDATES.map((cand) => (
          <div key={cand.id} className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-slate-50 border-slate-200 hover:border-blue-500/30'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
                    {cand.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">{cand.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{cand.jobTitle}</p>
                    <div className="flex items-center space-x-3 mt-1">
                       <span className="text-[9px] font-black uppercase text-blue-500">{cand.date}</span>
                       <span className="text-[9px] font-black uppercase text-gray-400">• Exp: {cand.experience}</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center space-x-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    cand.status === 'Neu' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>{cand.status}</span>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-sm">Profil öffnen</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BillingViewPlaceholder = ({ theme }: { theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center space-x-3 mb-10">
        <Package className="text-blue-500" />
        <h3 className="text-2xl font-black uppercase tracking-tighter">Pakete & Buchung</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`p-10 rounded-[2.5rem] border-2 border-amber-400/30 relative overflow-hidden ${isDark ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
          <div className="absolute top-0 right-0 bg-amber-400 text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest">Active</div>
          <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Launch Special</h4>
          <p className="text-4xl font-black text-amber-500 mb-8">0€ <span className="text-xs text-gray-500">/ 60 TAGE</span></p>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center space-x-3 text-[10px] font-black uppercase text-gray-500"><Check size={14} className="text-emerald-500" /> <span>5 Premium Inserate</span></li>
            <li className="flex items-center space-x-3 text-[10px] font-black uppercase text-gray-500"><Check size={14} className="text-emerald-500" /> <span>Alle Recruiting Tools</span></li>
            <li className="flex items-center space-x-3 text-[10px] font-black uppercase text-gray-500"><Check size={14} className="text-emerald-500" /> <span>Messenger Flatrate</span></li>
          </ul>
          <button className="w-full py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Aktueller Plan</button>
        </div>
      </div>
    </div>
  );
};

const MessagesViewPlaceholder = ({ theme }: { theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-10 rounded-[3rem] h-[calc(100vh-250px)] flex flex-col ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center space-x-3 mb-10">
        <MessageSquare className="text-blue-500" />
        <h3 className="text-2xl font-black uppercase tracking-tighter">Messenger</h3>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
         <div className="w-full md:w-80 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_CONVERSATIONS.map((conv) => (
              <div key={conv.id} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${conv.unread ? 'border-blue-500 bg-blue-500/5' : isDark ? 'bg-white/5 border-transparent' : 'bg-slate-50 border-transparent'}`}>
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">{conv.candidateInitials}</div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-black uppercase tracking-tight truncate">{conv.candidateName}</p>
                        <span className="text-[8px] font-bold text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate font-bold uppercase">{conv.lastMessage}</p>
                   </div>
                </div>
              </div>
            ))}
         </div>
         <div className={`flex-1 flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
            <MessageCircle size={48} className="text-gray-400 mb-4 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Wählen Sie einen Kandidaten aus</p>
         </div>
      </div>
    </div>
  );
};

const SettingsViewPlaceholder = ({ theme }: { theme: Theme }) => {
  const isDark = theme === 'dark';
  const inputClasses = `w-full px-4 py-3 rounded-xl outline-none transition-all ${
    isDark ? 'bg-white/5 border border-white/10 dark:focus:bg-gray-800 dark:focus:text-white focus:border-blue-500 text-white' : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-slate-800 shadow-sm'
  }`;
  const labelClasses = `text-xs font-black uppercase tracking-widest mb-2.5 block ${isDark ? 'text-gray-500' : 'text-slate-400'}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="lg:col-span-8 space-y-8">
        <div className={`p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <div className="flex items-center space-x-3 mb-10">
            <Key className="text-blue-500" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Sicherheit</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Aktuelles Passwort</label>
              <input type="password" className={inputClasses} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClasses}>Neues Passwort</label>
                <input type="password" className={inputClasses} placeholder="Min. 8 Zeichen" />
              </div>
              <div>
                <label className={labelClasses}>Passwort bestätigen</label>
                <input type="password" className={inputClasses} placeholder="••••••••" />
              </div>
            </div>
            <button className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
              Passwort aktualisieren
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
         <div className={`p-8 rounded-[3rem] border-2 border-red-500/20 bg-red-500/5 ${isDark ? '' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center space-x-3 mb-6">
                <ShieldAlert className="text-red-500" />
                <h3 className="text-lg font-black uppercase tracking-tight text-red-500">Gefahrenzone</h3>
            </div>
            <p className="text-xs font-bold text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">Das Löschen des Kontos ist permanent und entfernt alle Inserate & Bewerberdaten.</p>
            <button className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Konto permanent löschen</button>
         </div>
      </div>
    </div>
  );
};

const Header = ({ theme, toggleTheme, currentView, profile }: { 
  theme: Theme, 
  toggleTheme: () => void, 
  currentView: View,
  profile: EmployerProfile
}) => {
  const isDark = theme === 'dark';
  const { total: score } = useMemo(() => calculateProfileCompletion(profile), [profile]);
  const isVerified = score > 90;
  const [showNotifications, setShowNotifications] = useState(false);

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'dashboard': return { title: "Dashboard Übersicht", subtitle: `Willkommen zurück, ${profile.contactPerson}!` };
      case 'company-profile': return { title: "Unternehmensprofil", subtitle: "Verwalten Sie Ihr öffentliches Branding." };
      case 'create-job': return { title: "Job erstellen", subtitle: "Veröffentlichen Sie ein neues Job-Inserat für Top-Talente." };
      case 'my-jobs': return { title: "Meine Inserate", subtitle: "Verwalten Sie Ihre aktiven und pausierten Jobs." };
      case 'candidates': return { title: "Kandidaten Pool", subtitle: "Sichten und verwalten Sie alle Bewerbungen." };
      case 'billing': return { title: "Pakete & Billing", subtitle: "Verwalten Sie Ihr Abo und Inserat-Kontingent." };
      case 'messages': return { title: "Messenger", subtitle: "Direkter Kontakt zu Ihren Bewerbern." };
      case 'settings': return { title: "Einstellungen", subtitle: "Sicherheit und Kontoverwaltung." };
      case 'job-preview': return { title: "Job-Vorschau", subtitle: "So sehen Bewerber Ihr Inserat." };
      default: return { title: "Employer Dashboard", subtitle: "" };
    }
  };

  const info = getHeaderInfo();

  return (
    <header className="h-20 px-12 flex items-center justify-between z-10 relative">
      <div className="max-w-[60%] animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex items-center space-x-2">
          <h1 className={`text-xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {info.title}
          </h1>
          {isVerified && <VerifiedBadge size={20} />}
        </div>
        <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} truncate`}>
          {info.subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group hidden md:block">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input placeholder="Suche..." className={`pl-4 pr-10 py-2 w-48 rounded-lg text-sm outline-none transition-all ${isDark ? 'bg-white/5 border border-white/10 dark:focus:bg-gray-800 dark:focus:text-white' : 'bg-slate-100 shadow-sm'} focus:border-blue-500`} />
        </div>
        <button onClick={toggleTheme} aria-label="Toggle Theme" className={`p-2 rounded-lg transition-colors ${isDark ? 'text-amber-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-500/10 transition-colors">
             <Bell size={20} className={isDark ? 'text-gray-400' : 'text-slate-600'} />
             <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#f0f4f8]"></span>
          </button>
          
          {showNotifications && (
            <div className={`absolute right-0 mt-4 w-72 rounded-3xl shadow-2xl z-50 animate-in zoom-in-95 duration-200 ${isDark ? 'glass-panel' : 'bg-white border border-slate-100'} p-4`}>
               <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Benachrichtigungen</span>
               </div>
               <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={14} /></div>
                     <div>
                        <p className="text-[10px] font-black leading-tight">Neue Bewerbung eingegangen</p>
                        <span className="text-[8px] text-gray-500 uppercase font-bold">Gerade eben</span>
                     </div>
                  </div>
                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Award size={14} /></div>
                     <div>
                        <p className="text-[10px] font-black leading-tight">Willkommen bei Mallorca Business</p>
                        <span className="text-[8px] text-gray-500 uppercase font-bold">Vor 2 Std.</span>
                     </div>
                  </div>
               </div>
               <button className="w-full mt-4 py-2 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Alle als gelesen markieren</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Main Dashboard Component ---
const EmployerDashboard = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setView] = useState<View>('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [profile, setProfile] = useState<EmployerProfile>(DEFAULT_EMPLOYER);
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [previewJob, setPreviewJob] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');
  const [errors, setErrors] = useState<string[]>([]);

  // Job Creation / Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    category: 'Gastronomie',
    type: 'Vollzeit',
    region: 'Palma',
    experience: '1-2 Jahre',
    languages: [] as { lang: string, level: string }[],
    licenseRequired: false,
    vehicleNeeded: false,
    workPermitMandatory: true,
    salaryFrom: '',
    salaryTo: '',
    salaryPeriod: 'pro Monat',
    benefitHousing: false,
    benefitNie: false,
    benefitFood: false,
    description: '',
    videoUrl: '',
    gallery: [] as string[]
  });

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  const handleShowToast = (msg: string, type: 'success' | 'warning' | 'error') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setJobFormData({
      title: '',
      category: 'Gastronomie',
      type: 'Vollzeit',
      region: 'Palma',
      experience: '1-2 Jahre',
      languages: [],
      licenseRequired: false,
      vehicleNeeded: false,
      workPermitMandatory: true,
      salaryFrom: '',
      salaryTo: '',
      salaryPeriod: 'pro Monat',
      benefitHousing: false,
      benefitNie: false,
      benefitFood: false,
      description: '',
      videoUrl: '',
      gallery: []
    });
    setIsEditing(false);
    setEditingJobId(null);
  };

  const handlePublishJob = (formData: any) => {
    if (isEditing && editingJobId !== null) {
      setJobs(prev => prev.map(job => {
        if (job.id === editingJobId) {
          return {
            ...job,
            title: formData.title,
            category: formData.category,
            location: formData.region,
            salary: `${formData.salaryFrom}€ - ${formData.salaryTo}€`,
            salaryPeriod: formData.salaryPeriod,
            type: formData.type,
            experience: formData.experience,
            languages: formData.languages.map((l: any) => ({ name: l.lang, level: l.level })),
            mobility: formData.licenseRequired ? "Führerschein" : "",
            workPermit: formData.workPermitMandatory ? "EU / NIE" : "Nicht erforderlich",
            salaryMin: parseInt(formData.salaryFrom) || 0,
            salaryMax: parseInt(formData.salaryTo) || 0,
            benefits: {
              housing: formData.benefitHousing,
              nieSupport: formData.benefitNie,
              meals: formData.benefitFood
            },
            description: formData.description,
            videoUrl: formData.videoUrl,
            gallery: formData.gallery
          };
        }
        return job;
      }));
      handleShowToast("Inserat erfolgreich aktualisiert!", "success");
    } else {
      const newJob: JobPosting = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        location: formData.region,
        salary: `${formData.salaryFrom}€ - ${formData.salaryTo}€`,
        salaryPeriod: formData.salaryPeriod,
        type: formData.type,
        status: 'Aktiv',
        views: 0,
        applications: 0,
        postedDate: new Date().toLocaleDateString('de-DE'),
        experience: formData.experience,
        languages: formData.languages.map((l: any) => ({ name: l.lang, level: l.level })),
        mobility: formData.licenseRequired ? "Führerschein" : "",
        workPermit: formData.workPermitMandatory ? "EU / NIE" : "Nicht erforderlich",
        salaryMin: parseInt(formData.salaryFrom) || 0,
        salaryMax: parseInt(formData.salaryTo) || 0,
        benefits: {
          housing: formData.benefitHousing,
          nieSupport: formData.benefitNie,
          meals: formData.benefitFood
        },
        description: formData.description,
        videoUrl: formData.videoUrl,
        gallery: formData.gallery
      };
      setJobs(prev => [newJob, ...prev]);
      handleShowToast("Stellenanzeige erfolgreich veröffentlicht!", "success");
    }
    resetForm();
    setView('my-jobs');
  };

  const handleEditJob = (job: JobPosting) => {
    // Helper to extract min/max from salary string if available
    const salaryMatch = job.salary.match(/(\d+\.?\d*)\D+(\d+\.?\d*)/);
    const sFrom = salaryMatch ? salaryMatch[1].replace('.', '') : "";
    const sTo = salaryMatch ? salaryMatch[2].replace('.', '') : "";

    setJobFormData({
      title: job.title,
      category: job.category,
      type: job.type,
      region: job.location,
      experience: job.experience || '1-2 Jahre',
      languages: job.languages?.map(l => ({ lang: l.name, level: l.level })) || [],
      licenseRequired: job.mobility === 'Führerschein',
      vehicleNeeded: false, // Default or map if exists
      workPermitMandatory: job.workPermit === 'Standard EU',
      salaryFrom: sFrom || job.salaryMin?.toString() || "",
      salaryTo: sTo || job.salaryMax?.toString() || "",
      salaryPeriod: job.salaryPeriod || 'pro Monat',
      benefitHousing: job.benefits?.housing || false,
      benefitNie: job.benefits?.nieSupport || false,
      benefitFood: job.benefits?.meals || false,
      description: job.description || "",
      videoUrl: job.videoUrl || "",
      gallery: job.gallery || []
    });
    setIsEditing(true);
    setEditingJobId(job.id);
    setView('create-job');
  };

  const handleDeleteJob = (id: number) => {
    if (window.confirm("Dieses Inserat permanent löschen?")) {
      setJobs(prev => prev.filter(job => job.id !== id));
      handleShowToast("Inserat wurde gelöscht.", "error");
    }
  };

  const handleToggleJobStatus = (id: number) => {
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        const newStatus = job.status === 'Aktiv' ? 'Pausiert' : 'Aktiv';
        handleShowToast(`Inserat wurde ${newStatus.toLowerCase()}.`, "warning");
        return { ...job, status: newStatus as 'Aktiv' | 'Pausiert' };
      }
      return job;
    }));
  };

  const handleOpenPreview = (job: JobPosting) => {
    const fullJobData = {
      title: job.title,
      industry: job.category,
      type: job.type,
      location: job.location,
      experience: job.experience || 'Nicht angegeben',
      languages: job.languages || [],
      mobility: job.mobility || '',
      workPermit: job.workPermit || '',
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      salaryPeriod: job.salaryPeriod || 'pro Jahr',
      benefits: job.benefits || { housing: false, nieSupport: false, meals: false },
      description: job.description || 'Keine Beschreibung verfügbar.',
      videoUrl: job.videoUrl,
      gallery: job.gallery || []
    };
    setPreviewJob(fullJobData);
    setView('job-preview');
  };

  const handleSaveProfile = () => {
    const newErrors: string[] = [];
    if (!profile.companyName) newErrors.push('companyName');
    if (!profile.industry) newErrors.push('industry');
    if (!profile.location) newErrors.push('location');
    if (!profile.logo || profile.logo.length < 5) newErrors.push('logo');
    if (!profile.description || profile.description.length < 20) newErrors.push('description');
    if (!profile.billingCompanyName) newErrors.push('billingCompanyName');
    if (!profile.vatId) newErrors.push('vatId');
    if (!profile.billingStreet) newErrors.push('billingStreet');
    if (!profile.billingZip) newErrors.push('billingZip');
    if (!profile.billingCity) newErrors.push('billingCity');

    setErrors(newErrors);
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      
      if (newErrors.length > 0) {
        setToastMessage("Profil gespeichert, aber unvollständig! Bitte ergänze die fehlenden Daten für volle Sichtbarkeit.");
        setToastType('warning');
      } else {
        setToastMessage("Profil erfolgreich aktualisiert!");
        setToastType('success');
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className={`h-screen flex transition-colors duration-500 p-5 ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#f0f4f8] text-slate-900'}`}>
      <Sidebar 
        theme={theme} 
        currentView={currentView} 
        setView={(v) => { 
          if (v !== 'create-job' && isEditing) resetForm();
          setView(v); 
        }} 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        profile={profile} 
      />
      <main className="flex-1 flex flex-col transition-all duration-300 ml-5 overflow-hidden">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          currentView={currentView} 
          profile={profile} 
        />
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {currentView === 'dashboard' && <DashboardHome theme={theme} profile={profile} onEditProfile={() => setView('company-profile')} />}
          {currentView === 'company-profile' && <CompanyProfileView theme={theme} profile={profile} setProfile={setProfile} onSave={handleSaveProfile} isSaving={isSaving} errors={errors} />}
          {currentView === 'create-job' && (
            <CreateJobView 
              theme={theme} 
              onShowToast={handleShowToast} 
              onPublish={handlePublishJob} 
              formData={jobFormData} 
              setFormData={setJobFormData}
              isEditing={isEditing}
              onCancelEdit={() => { resetForm(); setView('my-jobs'); }}
            />
          )}
          {currentView === 'my-jobs' && <MyJobsView theme={theme} jobs={jobs} onDelete={handleDeleteJob} onToggleStatus={handleToggleJobStatus} onPreview={handleOpenPreview} onEdit={handleEditJob} />}
          {currentView === 'candidates' && <CandidatesViewPlaceholder theme={theme} />}
          {currentView === 'billing' && <BillingViewPlaceholder theme={theme} />}
          {currentView === 'messages' && <MessagesViewPlaceholder theme={theme} />}
          {currentView === 'settings' && <SettingsViewPlaceholder theme={theme} />}
          {currentView === 'job-preview' && previewJob && (
            <JobDetailPreview jobData={previewJob} onBack={() => setView('my-jobs')} theme={theme} />
          )}
        </div>
      </main>

      {showToast && (
        <div className={`fixed top-24 right-5 z-50 ${
          toastType === 'success' ? 'bg-green-600' : toastType === 'warning' ? 'bg-amber-500' : 'bg-red-600'
        } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300`}>
           {toastType === 'success' ? <CheckCircle size={20} /> : toastType === 'warning' ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
           <span className="font-bold uppercase text-[10px] tracking-widest">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
