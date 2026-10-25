import React from 'react';
import {
  X,
  Zap,
  Users,
  Clock,
  ShieldAlert,
  Sparkles,
  Flame,
  Scale,
  Swords,
  Layers,
  Trophy,
  BookOpen,
  Check,
  TrendingUp,
  EyeOff,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function QuickGuideModal({ isOpen, onClose }) {
  const { guideT, ui } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#07090e] border border-amber-500/30 w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden text-slate-100">
        {/* Cabecera de la Guía Rápida de Mesa */}
        <div className="px-6 py-4 bg-gradient-to-r from-black via-[#111622] to-black border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-black tracking-widest uppercase text-gold-gradient">
                  {guideT.title}
                </h2>
                <span className="text-[9px] bg-black/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-serif font-black uppercase tracking-wider">
                  {guideT.badge}
                </span>
              </div>
              <p className="text-xs font-serif text-slate-400">
                {guideT.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-300 font-serif">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Swords className="w-3.5 h-3.5 text-amber-400" /> {guideT.headerSummary.fronts}
              </span>
              <span className="text-amber-500/30">•</span>
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> {guideT.headerSummary.scoring}
              </span>
              <span className="text-amber-500/30">•</span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <EyeOff className="w-3.5 h-3.5 text-purple-400" /> {guideT.headerSummary.shadows}
              </span>
              {guideT.headerSummary.casual && (
                <>
                  <span className="text-amber-500/30">•</span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    🎉 {guideT.headerSummary.casual}
                  </span>
                </>
              )}
            </div>
            <LanguageToggle compact />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-black/60 border border-transparent hover:border-amber-500/30 transition cursor-pointer"
              title={guideT.closeBtn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel visual de 4 Bloques Principales + Anexo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Fila 1: Especificaciones por Modo y Resolución de Empates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* BLOQUE 1: ESPECIFICACIONES Y LÍMITES POR MODO */}
            <div className="casino-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" /> {guideT.block1.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{guideT.block1.formatTag}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  {/* Modo 2v2 */}
                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-serif font-bold text-amber-300 flex items-center justify-center gap-1">
                        <span>{guideT.block1.mode2v2.title}</span>
                        <span className="text-slate-400 font-normal">{guideT.block1.mode2v2.players}</span>
                      </div>
                      <div className="text-lg font-serif font-black text-slate-100 my-0.5">{guideT.block1.mode2v2.limit}</div>
                      <div className="text-[10px] text-rose-400 font-serif font-semibold">{guideT.block1.mode2v2.limitLabel}</div>
                      <div className="text-[10px] text-slate-300 mt-1 pt-1 border-t border-amber-500/15 font-serif">
                        {guideT.block1.mode2v2.detail}
                      </div>
                      {guideT.block1.mode2v2.economy && (
                        <div className="my-1.5 bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/30 text-[10px] font-serif">
                          <div className="flex items-center justify-between text-purple-200 font-bold">
                            <span>{guideT.block1.mode2v2.economy.win}</span>
                            <span>{guideT.block1.mode2v2.economy.loss}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-300 font-semibold mt-0.5">
                            <span>{guideT.block1.mode2v2.economy.streak}</span>
                            <span>{guideT.block1.mode2v2.economy.tie}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1 bg-black/70 py-0.5 px-1 rounded border border-emerald-900/40">
                      {guideT.block1.mode2v2.clock}
                    </div>
                  </div>

                  {/* Modo 3v3 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                        <span>{guideT.block1.mode3v3.title}</span>
                        <span className="text-slate-500 font-normal">{guideT.block1.mode3v3.players}</span>
                      </div>
                      <div className="text-lg font-black text-slate-100 my-0.5">{guideT.block1.mode3v3.limit}</div>
                      <div className="text-[10px] text-rose-400 font-semibold">{guideT.block1.mode3v3.limitLabel}</div>
                      <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-850">
                        {guideT.block1.mode3v3.detail}
                      </div>
                      {guideT.block1.mode3v3.economy && (
                        <div className="my-1.5 bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/30 text-[10px] font-serif">
                          <div className="flex items-center justify-between text-purple-200 font-bold">
                            <span>{guideT.block1.mode3v3.economy.win}</span>
                            <span>{guideT.block1.mode3v3.economy.loss}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-300 font-semibold mt-0.5">
                            <span>{guideT.block1.mode3v3.economy.streak}</span>
                            <span>{guideT.block1.mode3v3.economy.tie}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1 bg-slate-900 py-0.5 px-1 rounded">
                      {guideT.block1.mode3v3.clock}
                    </div>
                  </div>

                  {/* Modo 4v4 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                        <span>{guideT.block1.mode4v4.title}</span>
                        <span className="text-slate-500 font-normal">{guideT.block1.mode4v4.players}</span>
                      </div>
                      <div className="text-lg font-black text-slate-100 my-0.5">{guideT.block1.mode4v4.limit}</div>
                      <div className="text-[10px] text-rose-400 font-semibold">{guideT.block1.mode4v4.limitLabel}</div>
                      <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-850">
                        {guideT.block1.mode4v4.detail}
                      </div>
                      {guideT.block1.mode4v4.economy && (
                        <div className="my-1.5 bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/30 text-[10px] font-serif">
                          <div className="flex items-center justify-between text-purple-200 font-bold">
                            <span>{guideT.block1.mode4v4.economy.win}</span>
                            <span>{guideT.block1.mode4v4.economy.loss}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-300 font-semibold mt-0.5">
                            <span>{guideT.block1.mode4v4.economy.streak}</span>
                            <span>{guideT.block1.mode4v4.economy.tie}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1 bg-slate-900 py-0.5 px-1 rounded">
                      {guideT.block1.mode4v4.clock}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {guideT.block1.economyNotice && (
                    <div className="flex items-start gap-2 bg-purple-950/40 p-2 rounded-xl border border-purple-500/30 text-purple-200 font-serif">
                      <EyeOff className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{guideT.block1.economyNotice}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      {guideT.block1.saturationNotice}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {guideT.block1.initiativeNotice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>{guideT.block1.matchSummary}</span>
                <span className="text-emerald-400 font-bold">{guideT.block1.winSummary}</span>
              </div>
            </div>

            {/* BLOQUE 2: PUNTUACIÓN DE RONDA Y DESEMPATES */}
            <div className="casino-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4" /> {guideT.block2.title}
                  </h3>
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    {guideT.block2.tag}
                  </span>
                </div>

                {/* Escala Visual de Puntos de Ronda (1, 2 y 3 Puntos) */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-sky-950/35 p-2.5 rounded-xl border border-sky-500/35 flex flex-col justify-center">
                    <span className="text-[9px] font-serif font-bold uppercase tracking-wider text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded mx-auto mb-1">
                      {guideT.block2.ptsTieBadge}
                    </span>
                    <div className="text-base sm:text-lg font-serif font-black text-sky-200">{guideT.block2.ptsTieVal}</div>
                    <div className="text-[10px] font-serif font-semibold text-sky-300/90 mt-0.5">{guideT.block2.ptsTieSub}</div>
                  </div>

                  <div className="bg-emerald-950/35 p-2.5 rounded-xl border border-emerald-500/35 flex flex-col justify-center">
                    <span className="text-[9px] font-serif font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded mx-auto mb-1">
                      {guideT.block2.ptsStdBadge}
                    </span>
                    <div className="text-base sm:text-lg font-serif font-black text-emerald-200">{guideT.block2.ptsStdVal}</div>
                    <div className="text-[10px] font-serif font-semibold text-emerald-300/90 mt-0.5">{guideT.block2.ptsStdSub}</div>
                  </div>

                  <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/45 flex flex-col justify-center shadow-[0_0_15px_rgba(245,158,11,0.12)]">
                    <span className="text-[9px] font-serif font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded mx-auto mb-1">
                      {guideT.block2.ptsSweepBadge}
                    </span>
                    <div className="text-base sm:text-lg font-serif font-black text-amber-200">{guideT.block2.ptsSweepVal}</div>
                    <div className="text-[10px] font-serif font-semibold text-amber-300/90 mt-0.5">{guideT.block2.ptsSweepSub}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Criterio 1: Desempate en Puntaje de Frente */}
                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 font-serif font-black flex items-center justify-center shrink-0 text-xs border border-amber-500/40">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-100 font-serif block">{guideT.block2.crit1Title}</strong>
                      <span className="text-slate-300 font-serif text-[11px]">
                        {guideT.block2.crit1Desc}
                      </span>
                    </div>
                  </div>

                  {/* Criterio 2: Victoria de Partida y Desempates Finales */}
                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 font-serif font-black flex items-center justify-center shrink-0 text-xs border border-amber-500/40">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-100 font-serif block">{guideT.block2.crit2Title}</strong>
                      <div className="text-[11px] text-slate-300 font-serif space-y-0.5 mt-0.5">
                        <div>• <strong className="text-emerald-300">{guideT.block2.crit2Sub1}</strong></div>
                        <div>• <strong className="text-amber-300">{guideT.block2.crit2Sub2}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-500/15 flex items-center gap-2 text-[11px] text-slate-400 bg-black/50 px-2.5 py-1.5 rounded-xl border border-amber-500/10">
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-serif">{guideT.block2.continuousDeck}</span>
              </div>
            </div>
          </div>

          {/* Fila 2: Las 4 Fases de la Ronda */}
          <div className="casino-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 mb-3">
              <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> {guideT.block3.title}
              </h3>
              <span className="text-[10px] bg-black/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                {guideT.block3.subtitleTag}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Fase 1 */}
              <div className="bg-black/60 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-black text-amber-400">{guideT.block3.phase1.badge}</span>
                  <span className="text-[9px] bg-black/80 text-amber-300/80 border border-amber-500/20 px-1 rounded uppercase font-serif">{guideT.block3.phase1.tag}</span>
                </div>
                <h4 className="text-xs font-serif font-bold text-slate-200 mb-1">{guideT.block3.phase1.title}</h4>
                <ul className="text-[11px] text-slate-300 font-serif space-y-1">
                  <li>• {guideT.block3.phase1.p1}</li>
                  <li>• {guideT.block3.phase1.p2}</li>
                  <li>• {guideT.block3.phase1.p3}</li>
                </ul>
                <div className="text-[9px] text-slate-400 font-serif mt-2 italic">{guideT.block3.phase1.footer}</div>
              </div>

              {/* Fase 2 */}
              <div className="bg-black/60 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-black text-amber-400">{guideT.block3.phase2.badge}</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded font-mono">{guideT.block3.phase2.tag}</span>
                </div>
                <h4 className="text-xs font-serif font-bold text-slate-200 mb-1">{guideT.block3.phase2.title}</h4>
                <ul className="text-[11px] text-slate-300 font-serif space-y-1">
                  <li>• {guideT.block3.phase2.p1}</li>
                  <li className="text-rose-300 font-semibold">• {guideT.block3.phase2.p2}</li>
                </ul>
                <div className="text-[9px] text-slate-400 font-serif mt-2 italic">{guideT.block3.phase2.footer}</div>
              </div>

              {/* Fase 3 */}
              <div className="bg-black/60 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-black text-amber-400">{guideT.block3.phase3.badge}</span>
                  <span className="text-[9px] bg-black/80 text-amber-300/80 border border-amber-500/20 px-1 rounded uppercase font-serif">{guideT.block3.phase3.tag}</span>
                </div>
                <h4 className="text-xs font-serif font-bold text-slate-200 mb-1">{guideT.block3.phase3.title}</h4>
                <ul className="text-[11px] text-slate-300 font-serif space-y-1">
                  <li>• {guideT.block3.phase3.p1}</li>
                  <li className="text-purple-300 font-semibold">• {guideT.block3.phase3.p2}</li>
                </ul>
                <div className="text-[9px] text-slate-400 font-serif mt-2 italic">{guideT.block3.phase3.footer}</div>
              </div>

              {/* Fase 4 */}
              <div className="bg-black/60 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-black text-amber-400">{guideT.block3.phase4.badge}</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 rounded font-mono">{guideT.block3.phase4.tag}</span>
                </div>
                <h4 className="text-xs font-serif font-bold text-slate-200 mb-1">{guideT.block3.phase4.title}</h4>
                <ul className="text-[11px] text-slate-300 font-serif space-y-1">
                  <li>• {guideT.block3.phase4.p1}</li>
                  <li className="text-purple-300 font-semibold">• {guideT.block3.phase4.p2}</li>
                  <li className="text-rose-400 font-semibold">• {guideT.block3.phase4.p3}</li>
                </ul>
                <div className="text-[9px] text-slate-400 font-serif mt-2 italic">{guideT.block3.phase4.footer}</div>
              </div>
            </div>

            {/* Tras completar el despliegue */}
            <div className="mt-3 bg-black/50 p-2.5 rounded-xl border border-amber-500/15 flex flex-wrap items-center justify-between text-xs text-slate-300 font-serif gap-2">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {guideT.block3.postDeploy.title}
              </span>
              <span>{guideT.block3.postDeploy.s1}</span>
              <span>{guideT.block3.postDeploy.s2}</span>
              <span className="text-emerald-400 font-bold">{guideT.block3.postDeploy.s3}</span>
              {guideT.block3.postDeploy.s4 && (
                <span className="text-purple-300 font-bold">{guideT.block3.postDeploy.s4}</span>
              )}
            </div>
          </div>

          {/* Fila 3: Cálculo de Fuerza y Anexo 1v1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* BLOQUE 4: CÁLCULO DE FUERZA POR FRENTE */}
            <div className="casino-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> {guideT.block4.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{guideT.block4.tag}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-[10px] uppercase font-serif font-bold text-amber-300/80 block mb-1">{guideT.block4.numericTitle}</span>
                    <strong className="text-xs text-slate-100 font-serif block">{guideT.block4.nominalValue}</strong>
                    <p className="text-[11px] text-slate-300 font-serif mt-1">
                      {guideT.block4.numericDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-[10px] uppercase font-serif font-bold text-amber-300/80 block mb-1">{guideT.block4.figuresTitle}</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-400">
                      <span>J=11</span> <span>Q=12</span> <span>K=13</span> <span className="text-emerald-400 font-black">A=14</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-serif mt-1">
                      {guideT.block4.aceDesc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/25">
                    <div className="flex items-center gap-1 text-[10px] font-serif font-bold text-amber-300 uppercase mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" /> {guideT.block4.synergyTitle}
                    </div>
                    <strong className="text-sm font-serif text-amber-200 block">{guideT.block4.synergyBonus}</strong>
                    <p className="text-[10px] text-slate-300 font-serif mt-0.5">
                      {guideT.block4.synergyDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/25">
                    <div className="flex items-center gap-1 text-[10px] font-serif font-bold text-sky-300 uppercase mb-0.5">
                      <Users className="w-3 h-3 text-sky-400" /> {guideT.block4.pairTitle}
                    </div>
                    <strong className="text-sm font-serif text-sky-200 block">{guideT.block4.pairBonus}</strong>
                    <p className="text-[10px] text-slate-300 font-serif mt-0.5">
                      {guideT.block4.pairDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/25">
                    <div className="flex items-center gap-1 text-[10px] font-serif font-bold text-emerald-300 uppercase mb-0.5">
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> {guideT.block4.straightTitle}
                    </div>
                    <strong className="text-sm font-serif text-emerald-200 block">{guideT.block4.straightBonus}</strong>
                    <p className="text-[10px] text-slate-300 font-serif mt-0.5">
                      {guideT.block4.straightDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/25">
                    <div className="flex items-center gap-1 text-[10px] font-serif font-bold text-rose-300 uppercase mb-0.5">
                      <Flame className="w-3 h-3 text-rose-400" /> {guideT.block4.trioTitle}
                    </div>
                    <strong className="text-sm font-serif text-rose-200 block">{guideT.block4.trioBonus}</strong>
                    <p className="text-[10px] text-slate-300 font-serif mt-0.5">
                      {guideT.block4.trioDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-500/15 text-[11px] text-center font-serif text-slate-400">
                {guideT.block4.formula}
              </div>
            </div>

            {/* ANEXO: MODO DUELO 1V1 (EL ESPEJO DEL 2V2) */}
            <div className="casino-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Swords className="w-4 h-4" /> {guideT.block5.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{guideT.block5.tag}</span>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20 mb-3">
                  <div className="text-[11px] text-slate-200 font-serif font-semibold mb-1">{guideT.block5.sub1Title}</div>
                  <div className="text-[10px] text-slate-400 font-serif mb-2">{guideT.block5.sub1Desc}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
                    <div className="bg-black/70 p-1.5 rounded-lg border border-amber-500/20">
                      <span className="text-[9px] text-slate-400 font-serif block">{guideT.block5.deckLabel}</span>
                      <strong className="text-slate-100 text-[11px] font-serif">{guideT.block5.deckVal}</strong>
                    </div>
                    <div className="bg-black/70 p-1.5 rounded-lg border border-amber-500/20">
                      <span className="text-[9px] text-slate-400 font-serif block">{guideT.block5.handLabel}</span>
                      <strong className="text-slate-100 text-[11px] font-serif">{guideT.block5.handVal}</strong>
                    </div>
                    <div className="bg-black/70 p-1.5 rounded-lg border border-amber-500/20">
                      <span className="text-[9px] text-slate-400 font-serif block">{guideT.block5.frontLimitLabel}</span>
                      <strong className="text-slate-100 text-[11px] font-serif">{guideT.block5.frontLimitVal}</strong>
                    </div>
                    <div className="bg-black/70 p-1.5 rounded-lg border border-amber-500/20">
                      <span className="text-[9px] text-slate-400 font-serif block">{guideT.block5.shadowsLabel}</span>
                      <strong className="text-purple-300 text-[11px] font-serif">{guideT.block5.shadowsVal}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold bg-black/70 py-1 px-2 rounded-lg text-center border border-emerald-900/40 mt-2">
                    {guideT.block5.clock1v1}
                  </div>
                </div>

                <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/20 text-[11px] text-slate-300 font-serif space-y-1.5">
                  <div className="font-semibold text-slate-100 mb-0.5 flex items-center justify-between">
                    <span>{guideT.block5.sub2Title}</span>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">{guideT.block5.sub2Tag}</span>
                  </div>
                  <div>• {guideT.block5.p1}</div>
                  <div>• {guideT.block5.p2}</div>
                  <div>• {guideT.block5.p3}</div>
                  <div>• {guideT.block5.p4}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-slate-400 font-serif">
                <span>{guideT.block5.footerDeck}</span>
                <span className="text-amber-300 font-bold">{guideT.block5.footerMode}</span>
              </div>
            </div>
          </div>

          {/* Fila 4: Anexo Modo Casual (Party / Amigos) */}
          {guideT.block6 && (
            <div className="casino-panel rounded-2xl p-4 sm:p-5 border border-amber-500/40 bg-gradient-to-b from-amber-950/25 via-[#0b0e17] to-orange-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/25 pb-2.5 mb-3.5">
                <h3 className="text-xs sm:text-sm font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>🎉</span> {guideT.block6.title}
                </h3>
                <span className="text-[10px] text-amber-300 bg-amber-500/15 border border-amber-500/35 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">
                  {guideT.block6.tag}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* 1. Escala Comprimida */}
                <div className="lg:col-span-7 bg-black/60 p-3 rounded-xl border border-amber-500/25 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-serif font-bold text-amber-300">
                        🧮 {guideT.block6.scaleTitle}
                      </span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                        {guideT.block6.scaleBadge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5">
                      {guideT.block6.baseCards.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/90 border border-amber-500/25 rounded-lg p-2 text-center"
                        >
                          <span className="text-[10px] text-slate-400 font-serif block">{item.label}</span>
                          <strong className="text-xs sm:text-sm font-serif font-black text-amber-300">{item.val}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {guideT.block6.synergies.map((syn, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-serif font-bold text-slate-200">{syn.title}</span>
                            <span className="text-xs font-mono font-black text-amber-400">{syn.bonus}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-serif mt-0.5">{syn.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-amber-500/20 text-[10px] text-amber-200/90 font-serif">
                    • {guideT.block6.frontTieNote}
                  </div>
                </div>

                {/* 2, 3 y 4: Sombra fija, Reloj 20s y Desempate directo */}
                <div className="lg:col-span-5 flex flex-col gap-2 justify-between">
                  <div className="bg-black/60 p-2.5 rounded-xl border border-purple-500/30">
                    <div className="text-xs font-serif font-bold text-purple-300 mb-0.5">
                      🌑 {guideT.block6.shadowTitle}
                    </div>
                    <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                      {guideT.block6.shadowDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-amber-500/30">
                    <div className="text-xs font-serif font-bold text-amber-300 mb-0.5">
                      ⏱️ {guideT.block6.clockTitle}
                    </div>
                    <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                      {guideT.block6.clockDesc}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
                    <div className="text-xs font-serif font-bold text-emerald-300 mb-0.5">
                      🏆 {guideT.block6.overtimeTitle}
                    </div>
                    <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                      {guideT.block6.overtimeDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nota de Versión Digital */}
              <div className="mt-3 bg-emerald-950/35 border border-emerald-500/40 rounded-xl p-2.5 flex items-start gap-2 text-xs font-serif">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">{guideT.block6.digitalNoteTitle} </strong>
                  <span className="text-slate-200">{guideT.block6.digitalNoteDesc}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie con botón de cerrar */}
        <div className="px-6 py-3 border-t border-amber-500/20 bg-gradient-to-r from-black via-[#111622] to-black flex items-center justify-between">
          <span className="text-xs text-slate-400 font-serif">
            {guideT.footerNote}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-serif font-black text-xs uppercase tracking-widest shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            {guideT.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
