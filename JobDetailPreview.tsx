
import React from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  Languages, 
  Car, 
  ShieldCheck, 
  Home, 
  HeartHandshake, 
  Utensils, 
  Euro, 
  Play, 
  Share2,
  Sparkles,
  Award
} from 'lucide-react';

interface JobData {
  title: string;
  industry: string;
  type: string;
  location: string;
  experience: string;
  languages: { name: string; level: string }[];
  mobility: string;
  workPermit: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: string;
  benefits: {
    housing: boolean;
    nieSupport: boolean;
    meals: boolean;
  };
  description: string;
  videoUrl?: string;
  gallery?: string[];
}

interface JobDetailPreviewProps {
  jobData: JobData;
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const getVideoEmbedUrl = (url: string) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

const JobDetailPreview: React.FC<JobDetailPreviewProps> = ({ jobData, onBack, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const embedUrl = jobData.videoUrl ? getVideoEmbedUrl(jobData.videoUrl) : null;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#f0f4f8] text-slate-900'}`}>
      
      {/* FIXED HEADER */}
      <header className={`h-24 px-8 md:px-12 flex items-center justify-between z-50 shrink-0 border-b ${isDark ? 'bg-[#1a1a1a]/80 backdrop-blur-md border-white/5' : 'bg-white/80 backdrop-blur-md border-slate-200 shadow-sm'}`}>
        <div className="flex items-center space-x-6 overflow-hidden">
          {/* Mock Logo */}
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
             <Briefcase size={28} />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter truncate">{jobData.title}</h2>
            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-blue-500">
               <span className="flex items-center space-x-1">
                 <MapPin size={12} />
                 <span>Mallorca, {jobData.location}</span>
               </span>
               <span className="opacity-30">•</span>
               <span>{jobData.industry}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <button className={`p-3 rounded-2xl hidden md:block transition-all ${isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <Share2 size={22} />
           </button>
           <button 
            onClick={onBack}
            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
           >
              <X size={24} />
           </button>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN (70%) */}
          <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Description Section */}
            <section className={`p-8 md:p-10 rounded-[3rem] ${isDark ? 'glass-panel' : 'bg-white shadow-xl border border-slate-100'}`}>
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center space-x-2">
                 <Sparkles size={16} />
                 <span>Stellenbeschreibung</span>
               </h3>
               <p className="text-sm md:text-base leading-relaxed text-gray-500 font-medium whitespace-pre-wrap">
                 {jobData.description}
               </p>
            </section>

            {/* Video Player Section */}
            {embedUrl && (
              <section className={`p-2 rounded-[3rem] overflow-hidden shadow-2xl ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'}`}>
                <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden">
                   <iframe 
                    title="Job Video"
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                   />
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {jobData.gallery && jobData.gallery.length > 0 && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-8 px-4">Fotos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobData.gallery.map((url, idx) => (
                    <div key={idx} className="aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-xl group border border-white/5">
                      <img 
                        src={url} 
                        alt={`Gallery ${idx}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN (30%) - Sidebar */}
          <aside className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            
            {/* Salary Card */}
            <div className={`p-8 rounded-[2.5rem] ${isDark ? 'glass-panel border-blue-500/20' : 'bg-white shadow-xl border border-slate-100'}`}>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 italic">Vergütungsmodell</h4>
               <div className="flex items-center space-x-2 mb-2">
                 <Euro className="text-blue-500" size={24} />
                 <div className="text-4xl font-black text-blue-600 leading-none flex items-center">
                    <span>{jobData.salaryMin.toLocaleString()}</span>
                    <span className="mx-2 text-2xl font-black opacity-30 leading-none flex items-center mt-1">–</span>
                    <span>{jobData.salaryMax.toLocaleString()}</span>
                 </div>
               </div>
               <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Brutto {jobData.salaryPeriod}
               </p>
               
               <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span className="text-gray-500">Anstellung:</span>
                     <span className="text-blue-500">{jobData.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                     <span className="text-gray-500">Erfahrung:</span>
                     <span className="text-blue-500">{jobData.experience}</span>
                  </div>
               </div>
            </div>

            {/* Mallorca Essentials Sidebar */}
            <div className={`p-8 rounded-[2.5rem] border-2 ${isDark ? 'bg-blue-600/5 border-blue-600/20 shadow-2xl shadow-blue-900/10' : 'bg-blue-50 border-blue-100 shadow-xl'}`}>
               <h3 className="text-lg font-black uppercase tracking-widest text-blue-600 mb-8 italic flex items-center space-x-2">
                 <Award size={20} />
                 <span>MALLORCA ESSENTIALS</span>
               </h3>
               
               <div className="space-y-8">
                  {/* Languages */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center space-x-2">
                      <Languages size={14} className="text-blue-500" />
                      <span>Sprach-Matching</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {jobData.languages.map((l, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/10 text-white' : 'bg-white text-blue-600 shadow-sm border border-blue-100'}`}>
                          {l.name} <span className="opacity-50 ml-1">({l.level})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Housing */}
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${jobData.benefits.housing ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/10 text-gray-500 opacity-50'}`}>
                        <Home size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Wohnraum</p>
                        <p className="text-sm font-bold uppercase">{jobData.benefits.housing ? 'Unterkunft vorhanden' : 'Keine Unterkunft'}</p>
                     </div>
                  </div>

                  {/* NIE Support */}
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${jobData.benefits.nieSupport ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/10 text-gray-500 opacity-50'}`}>
                        <HeartHandshake size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Bürokratie-Hilfe</p>
                        <p className="text-sm font-bold uppercase">{jobData.benefits.nieSupport ? 'NIE Support inklusive' : 'Eigenverantwortlich'}</p>
                     </div>
                  </div>

                  {/* Mobility */}
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${jobData.mobility ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-500/10 text-gray-500 opacity-50'}`}>
                        <Car size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Mobilität</p>
                        <p className="text-sm font-bold uppercase truncate max-w-[200px]">{jobData.mobility || 'Nicht erforderlich'}</p>
                     </div>
                  </div>

                  {/* Work Permit */}
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${jobData.workPermit ? 'bg-indigo-500/20 text-indigo-500' : 'bg-gray-500/10 text-gray-500 opacity-50'}`}>
                        <ShieldCheck size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Arbeitserlaubnis</p>
                        <p className="text-sm font-bold uppercase">{jobData.workPermit || 'Standard EU'}</p>
                     </div>
                  </div>

                  {/* Meals */}
                  <div className="flex items-center space-x-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${jobData.benefits.meals ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/10 text-gray-500 opacity-50'}`}>
                        <Utensils size={22} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Verpflegung</p>
                        <p className="text-sm font-bold uppercase">{jobData.benefits.meals ? 'Personalessen inkl.' : 'Selbstverpflegung'}</p>
                     </div>
                  </div>
               </div>

               <div className="mt-10 p-5 rounded-2xl bg-white/5 text-center">
                  <p className="text-[9px] font-black uppercase text-gray-500 leading-relaxed">
                     Mallorca Top Jobs nutzt diese Faktoren, um dich exklusiv mit den besten Kandidaten zu matchen.
                  </p>
               </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPreview;
