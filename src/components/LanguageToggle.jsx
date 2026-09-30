import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle({ compact = false, className = '' }) {
  const { language, toggleLanguage } = useLanguage();
  const isEn = language === 'en';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/80 to-slate-900 hover:from-cyan-900 hover:to-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-slate-200 transition flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-cyan-500/10 cursor-pointer ${className}`}
        title={isEn ? 'Cambiar idioma a Español' : 'Switch language to English'}
        aria-label={isEn ? 'Cambiar idioma a Español' : 'Switch language to English'}
      >
        <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-mono text-[10px] font-black tracking-wider flex items-center gap-1">
          <span className={!isEn ? 'text-cyan-300 font-black' : 'text-slate-500'}>ES</span>
          <span className="text-slate-600">/</span>
          <span className={isEn ? 'text-cyan-300 font-black' : 'text-slate-500'}>EN</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-cyan-950/70 hover:from-cyan-900/80 hover:via-slate-800 hover:to-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 text-slate-200 transition flex items-center gap-2 text-xs font-bold shadow-md shadow-cyan-500/15 cursor-pointer ring-1 ring-cyan-500/20 hover:scale-105 active:scale-95 ${className}`}
      title={isEn ? 'Cambiar idioma a Español' : 'Switch language to English'}
      aria-label={isEn ? 'Cambiar idioma a Español' : 'Switch language to English'}
    >
      <Languages className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
      <span className="font-bold text-slate-300">
        {isEn ? 'Language:' : 'Idioma:'}
      </span>
      <div className="flex items-center gap-1 font-mono text-[11px] font-black uppercase bg-slate-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/40">
        <span className={!isEn ? 'text-cyan-300 underline underline-offset-2' : 'text-slate-500'}>ES</span>
        <span className="text-slate-600">|</span>
        <span className={isEn ? 'text-cyan-300 underline underline-offset-2' : 'text-slate-500'}>EN</span>
      </div>
    </button>
  );
}
