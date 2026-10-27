import React from 'react';
import {
  X,
  Printer,
  Swords,
  Clock,
  EyeOff,
  Trophy,
  Sparkles,
  Flame,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Scale,
  PartyPopper,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Guía Rápida Oficial v2.1 — Hoja de Referencia Táctica de Mesa (1 Página)
 * Réplica exacta del documento oficial adjunto "Guía Rápida de Mesa v2.1 (Escala Táctica Unificada)"
 */
export function QuickGuideModal({ isOpen, onClose }) {
  const { guide, isEn } = useLanguage();

  if (!isOpen) return null;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:block">
      {/* Estilos dedicados de impresión a 1 sola hoja A4 apaisada o vertical compacta */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #quick-guide-printable,
          #quick-guide-printable * {
            visibility: visible;
          }
          #quick-guide-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            max-height: 100%;
            margin: 0;
            padding: 10px 14px !important;
            background: #0b0f17 !important;
            color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 5mm;
          }
        }
      `}</style>

      <div className="bg-[#090d14] border border-slate-700/80 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:rounded-none print:border-none">
        {/* Barra de herramientas superior (Oculta al imprimir) */}
        <div className="no-print px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {guide.headerTitle}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                {guide.headerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{guide.printBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title={guide.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido Imprimible de la Hoja de Referencia v2.1 */}
        <div
          id="quick-guide-printable"
          className="p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#090d14] text-slate-100 text-xs"
        >
          {/* Cabecera Oficial de la Hoja v2.1 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400 shrink-0" />
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  {guide.sheetTitle}
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {guide.sheetSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{guide.badgeRoundPts}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-purple-400" />
                <span>{guide.badgeShadow}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>{guide.badgeScale}</span>
              </span>
            </div>
          </div>

          {/* Fila Superior: 1. Especificaciones, Límites, Tiempos y Economía + 2. Puntuación de Ronda y Desempates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* 1. ESPECIFICACIONES, LÍMITES, TIEMPOS Y ECONOMÍA */}
            <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <span>⚙️ {guide.sec1.title}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[guide.sec1.m2v2, guide.sec1.m3v3, guide.sec1.m4v4].map((m, i) => (
                    <div
                      key={i}
                      className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1"
                    >
                      <div className="text-[10px] font-bold text-sky-400 uppercase">{m.name}</div>
                      <div className="text-xs font-black text-white">{m.limit}</div>
                      <div className="text-[10px] text-slate-300">🃏 {m.deck}</div>
                      <div className="text-[10px] text-purple-300 font-medium">🌑 {m.shadows}</div>
                      <div className="text-[10px] text-amber-300 font-mono">⏱️ {m.clock}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
                <div>
                  <strong className="text-rose-300">🛑 {guide.sec1.satLabel}</strong> {guide.sec1.satDesc}
                </div>
                <div>
                  <strong className="text-sky-300">🔄 {guide.sec1.initLabel}</strong> {guide.sec1.initDesc}
                </div>
              </div>
            </div>

            {/* 2. PUNTUACIÓN DE RONDA Y DESEMPATES (SIN PAPEL) */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <span>🏆 {guide.sec2.title}</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">{guide.sec2.tieRound}</div>
                    <div className="text-sm font-black text-sky-300 mt-0.5">{guide.sec2.tiePts}</div>
                    <div className="text-[9px] text-slate-400">{guide.sec2.tieSub}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-2">
                    <div className="text-[9px] font-bold text-emerald-300 uppercase">{guide.sec2.win2}</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">{guide.sec2.win2Pts}</div>
                    <div className="text-[9px] text-slate-400">{guide.sec2.win2Sub}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-2">
                    <div className="text-[9px] font-bold text-amber-300 uppercase">{guide.sec2.win3}</div>
                    <div className="text-sm font-black text-amber-400 mt-0.5">{guide.sec2.win3Pts}</div>
                    <div className="text-[9px] text-slate-400">{guide.sec2.win3Sub}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                  <strong className="text-white">{guide.sec2.frontTieTitle}</strong> {guide.sec2.frontTieDesc}
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 space-y-0.5">
                  <div>
                    <strong className="text-white">{guide.sec2.matchTieTitle}</strong> {guide.sec2.matchTieSub}
                  </div>
                  <div className="text-purple-300 font-medium">{guide.sec2.matchTie1}</div>
                  <div className="text-amber-300 font-medium">{guide.sec2.matchTie2}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fila Media: 3. LAS 4 FASES DE LA RONDA (SECUENCIA INFLEXIBLE) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-sky-400 mb-2.5 flex items-center gap-1.5">
              <span>⏱️ {guide.sec3.title}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1">
                <div className="text-xs font-black text-sky-300">{guide.sec3.p1Title}</div>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li>{guide.sec3.p1b1}</li>
                  <li>{guide.sec3.p1b2}</li>
                  <li>{guide.sec3.p1b3}</li>
                </ul>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1">
                <div className="text-xs font-black text-amber-300">{guide.sec3.p2Title}</div>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li>{guide.sec3.p2b1}</li>
                  <li>{guide.sec3.p2b2}</li>
                </ul>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1">
                <div className="text-xs font-black text-rose-300">{guide.sec3.p3Title}</div>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li>{guide.sec3.p3b1}</li>
                  <li className="text-rose-200 font-semibold">{guide.sec3.p3b2}</li>
                </ul>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1">
                <div className="text-xs font-black text-emerald-300">{guide.sec3.p4Title}</div>
                <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  <li>{guide.sec3.p4b1}</li>
                  <li>{guide.sec3.p4b2}</li>
                  <li>{guide.sec3.p4b3}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fila Inferior: 4. FUERZA POR FRENTE (ESCALA OFICIAL UNIFICADA) + ANEXO 8 (1V1) + ANEXO 9 (MODO CASUAL: SOLO CAMBIOS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* 4. FUERZA POR FRENTE (ESCALA OFICIAL UNIFICADA) */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-emerald-500/35 rounded-2xl p-3.5 space-y-2.5">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>📊 {guide.sec4.title}</span>
              </h3>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <div className="text-[10px] font-bold text-sky-300 uppercase mb-1">
                  {guide.sec4.baseTitle}
                </div>
                <div className="text-xs font-black text-white font-mono">
                  {guide.sec4.baseDesc}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                  <strong className="text-amber-300">⚜️ {guide.sec4.suitLabel}</strong>{' '}
                  <strong className="text-emerald-400">{guide.sec4.suitPts}</strong>{' '}
                  <span className="text-slate-300">{guide.sec4.suitDesc}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                  <strong className="text-cyan-300">⚡ {guide.sec4.straightLabel}</strong>{' '}
                  <strong className="text-emerald-400">{guide.sec4.straightPts}</strong>{' '}
                  <span className="text-slate-300">{guide.sec4.straightDesc}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                  <strong className="text-amber-200">👥 {guide.sec4.pairLabel}</strong>{' '}
                  <strong className="text-emerald-400">{guide.sec4.pairPts}</strong>{' '}
                  <span className="text-slate-300">{guide.sec4.pairDesc}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                  <strong className="text-rose-300">🔥 {guide.sec4.trioLabel}</strong>{' '}
                  <strong className="text-emerald-400">{guide.sec4.trioPts}</strong>{' '}
                  <span className="text-slate-300">{guide.sec4.trioDesc}</span>
                </div>
              </div>
            </div>

            {/* ANEXO 8: MODO DUELO 1V1 */}
            <div className="lg:col-span-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <span>🗡️ {guide.annex8.title}</span>
              </h3>
              <div className="text-[11px] font-bold text-slate-300">
                {guide.annex8.subtitle}
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                <li>
                  <strong className="text-white">{guide.annex8.b1Label}</strong> {guide.annex8.b1Desc}
                </li>
                <li>
                  <strong className="text-white">{guide.annex8.b2Label}</strong> {guide.annex8.b2Desc}
                </li>
                <li>{guide.annex8.b3Desc}</li>
              </ul>
            </div>

            {/* ANEXO 9: MODO CASUAL (SOLO CAMBIOS) */}
            <div className="lg:col-span-4 bg-slate-950/90 border border-amber-500/35 rounded-2xl p-3.5 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>🎉 {guide.annex9.title}</span>
              </h3>
              <div className="text-[11px] font-bold text-sky-300">
                {guide.annex9.subtitle}
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li>
                  <strong className="text-white">• {guide.annex9.b1Label}</strong> {guide.annex9.b1Desc}
                </li>
                <li>
                  <strong className="text-white">• {guide.annex9.b2Label}</strong> {guide.annex9.b2Desc}
                </li>
                <li>
                  <strong className="text-white">• {guide.annex9.b3Label}</strong> {guide.annex9.b3Desc}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pie del Modal (Oculto al imprimir) */}
        <div className="no-print px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            {isEn
              ? 'Frentes de Guerra v2.1 — Unified Tactical Scale (Competitive & Casual)'
              : 'Frentes de Guerra v2.1 — Escala Táctica Unificada (Competitivo y Casual)'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {guide.footerUnderstandBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
