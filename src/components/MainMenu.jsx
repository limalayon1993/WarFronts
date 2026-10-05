import React, { useState } from 'react';
import {
  GAME_MODES,
  GAME_DURATIONS,
  TEAM_TIMES,
  TEAM_TIME_OPTIONS,
  getLocalizedModes,
  getLocalizedDurations,
  getLocalizedTimeOptions,
} from '../constants/rules';
import {
  Swords,
  Users,
  Clock,
  BookOpen,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Zap,
  Wifi,
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  GraduationCap,
  Timer,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function MainMenu({
  selectedMode,
  setSelectedMode,
  selectedRhythm,
  setSelectedRhythm,
  selectedTimeSpeed = 'medio',
  setSelectedTimeSpeed,
  onStartGame,
  onOpenMultiplayer,
  onOpenTutorial,
  onOpenQuickGuide,
  onOpenFullManual,
  isMuted,
  onToggleMute,
  initialView = 'landing',
}) {
  const { language, isEn, ui } = useLanguage();
  const localizedModes = getLocalizedModes(language);
  const localizedDurations = getLocalizedDurations(language);
  const localizedTimeOptions = getLocalizedTimeOptions(language);

  // 'landing' (2 botones principales) | 'bots' (configurar y crear partida contra bots)
  const [view, setView] = useState(initialView);

  const currentMode = localizedModes[selectedMode] || localizedModes['1v1'];
  const currentDuration = localizedDurations.find(d => d.rounds === selectedRhythm) || localizedDurations[1];
  const modeTimes = TEAM_TIMES[selectedMode] || TEAM_TIMES['2v2'];
  const currentTimeConfig = modeTimes[selectedTimeSpeed] || modeTimes['medio'];
  const currentTimeOption = localizedTimeOptions.find(t => t.id === selectedTimeSpeed) || localizedTimeOptions[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Elementos decorativos tácticos de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera superior común */}
      <header className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 z-10">
        {view === 'landing' ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-amber-500/20 shadow-lg">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                {isEn ? 'HQ Tactical Room' : 'Sala Táctica'}
              </span>
              <div className="text-sm font-bold text-slate-300">
                {isEn ? 'General Headquarters' : 'Cuartel General'}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-bold shadow cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{ui.common.backToMenu}</span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón de Silenciar */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title={isMuted ? ui.common.unmute : ui.common.mute}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Botón de Tutorial Guiado */}
          <button
            onClick={onOpenTutorial}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition flex items-center gap-1.5 text-xs font-bold shadow cursor-pointer"
            title={ui.common.tutorial}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{ui.common.tutorial}</span>
          </button>

          {/* Botón de Guía Rápida de Mesa */}
          <button
            onClick={onOpenQuickGuide}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 transition flex items-center gap-1.5 text-xs font-bold shadow cursor-pointer"
            title={ui.common.quickGuide}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{ui.common.quickGuide}</span>
          </button>

          {/* Botón de Manual Completo */}
          <button
            onClick={onOpenFullManual}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title={ui.common.fullManual}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{ui.common.fullManual}</span>
          </button>

          {/* Botón de Cambio de Idioma (ES / EN) al lado de Tutorial, Guía y Manual */}
          <LanguageToggle />
        </div>
      </header>

      {/* VISTA 1: MENÚ PRINCIPAL (3 BOTONES PRINCIPALES) */}
      {view === 'landing' && (
        <main className="max-w-5xl w-full mx-auto my-auto py-8 z-10 flex flex-col items-center">
          {/* Título y Presentación */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest mb-3 shadow-inner">
              <Swords className="w-3.5 h-3.5 text-amber-400" /> {ui.common.versionBadge}
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-widest text-gold-gradient uppercase drop-shadow-xl">
              {ui.common.gameTitle}
            </h1>

            <p className="text-xs sm:text-sm font-serif text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
              {ui.menu.subtitle}
            </p>

            <div className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full bg-black/60 border border-amber-500/25 text-[11px] font-serif font-bold uppercase tracking-widest text-amber-200/90 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {ui.menu.selectModePrompt}
            </div>
          </div>

          {/* Los 3 Botones Principales: Tutorial, Bots, Multijugador */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl w-full">
            {/* 1. Tutorial Guiado (2v2) */}
            <button
              type="button"
              onClick={onOpenTutorial}
              className="group relative flex flex-col justify-between text-left p-6 sm:p-7 rounded-3xl casino-panel hover:border-emerald-500/60 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-serif font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    {ui.menu.cards.tutorial.badge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 group-hover:text-emerald-300 transition-colors uppercase tracking-wide">
                  {ui.menu.cards.tutorial.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                  {ui.menu.cards.tutorial.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {ui.menu.cards.tutorial.tag}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? '2v2 Match' : 'Partida 2v2'}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Deterministic' : 'Sin azar'}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-500/15 flex items-center justify-between">
                <span className="text-xs font-serif font-black uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  {ui.menu.cards.tutorial.btn}
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* 2. Jugar con bots */}
            <button
              type="button"
              onClick={() => setView('bots')}
              className="group relative flex flex-col justify-between text-left p-6 sm:p-7 rounded-3xl casino-panel hover:border-amber-500/70 hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Bot className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-serif font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    {ui.menu.cards.bots.badge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                  {ui.menu.cards.bots.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                  {ui.menu.cards.bots.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? '1v1 — 4v4' : '1v1 a 4v4'}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Tactical AI' : 'IA Táctica'}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Instant Play' : 'Sin esperas'}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-500/15 flex items-center justify-between">
                <span className="text-xs font-serif font-black uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  {ui.menu.cards.bots.btn}
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/25 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* 3. Multijugador */}
            <button
              type="button"
              onClick={onOpenMultiplayer}
              className="group relative flex flex-col justify-between text-left p-6 sm:p-7 rounded-3xl casino-panel hover:border-indigo-400/70 hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Wifi className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-serif font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
                    {ui.menu.cards.multiplayer.badge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 group-hover:text-indigo-300 transition-colors uppercase tracking-wide">
                  {ui.menu.cards.multiplayer.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                  {ui.menu.cards.multiplayer.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Private Room' : 'Sala Privada'}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Up to 8 Players' : 'Hasta 8 Jugadores'}
                  </span>
                  <span className="text-[10px] font-serif font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-slate-300">
                    {isEn ? 'Live Table' : 'Mesa en Vivo'}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-500/15 flex items-center justify-between">
                <span className="text-xs font-serif font-black uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  {ui.menu.cards.multiplayer.btn}
                </span>
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* VISTA 2: CONFIGURACIÓN Y CREACIÓN DE PARTIDA CON BOTS */}
      {view === 'bots' && (
        <main className="max-w-6xl w-full mx-auto my-auto py-6 z-10 flex flex-col items-center">
          {/* Título de la Fase */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest mb-2 shadow-inner">
              <Bot className="w-3.5 h-3.5 text-amber-400" /> {isEn ? 'Local Match vs Bots' : 'Partida Local vs Bots'}
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-widest text-gold-gradient uppercase">
              {ui.menu.setup.title}
            </h2>

            <p className="text-xs sm:text-sm font-serif text-slate-300 mt-1 max-w-xl mx-auto leading-relaxed">
              {isEn
                ? 'Configure tactical combat format, team clock per round, and match duration.'
                : 'Configura el formato táctico de combate, el tiempo de equipo por ronda y la duración de la partida.'}
            </p>
          </div>

          {/* 1. SELECCIÓN DE FORMATO / MODO DE JUEGO */}
          <div className="w-full mb-7">
            <div className="flex items-center justify-between mb-3 px-1 font-serif">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step1}
              </span>
              <span className="text-xs text-slate-400">
                {isEn ? '1v1, 2v2, 3v3 and 4v4 with Tactical Intelligence' : '1v1, 2v2, 3v3 y 4v4 con Inteligencia Táctica'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.values(localizedModes).map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`
                      text-left rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between relative group cursor-pointer
                      ${isSelected
                        ? 'border-2 border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] shadow-[0_0_25px_rgba(212,175,55,0.35)] ring-2 ring-amber-400/40 -translate-y-1'
                        : 'border border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 opacity-75 hover:opacity-100'
                      }
                    `}
                  >
                    {/* Insignia de Barajas y Estado */}
                    <div className="flex items-center justify-between mb-3 gap-1">
                      {isSelected ? (
                        <span className="text-[10px] font-serif font-black px-2.5 py-0.5 rounded-full border bg-amber-500/25 text-amber-300 border-amber-400 flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3] text-amber-400" />
                          {isEn ? 'SELECTED' : 'SELECCIONADO'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-serif font-bold px-2 py-0.5 rounded-full border bg-black/50 text-slate-400 border-amber-500/20">
                          {mode.decks === 1 ? (isEn ? '1 Deck (52 cards)' : '1 Baraja (52 cartas)') : (isEn ? '2 Decks (104 cards)' : '2 Barajas (104 cartas)')}
                        </span>
                      )}

                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-amber-500/70'}`}>
                        {mode.totalPlayers} {isEn ? 'Players' : 'Jugadores'}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-xl font-serif font-black mb-1 flex items-center justify-between ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>
                        {mode.name}
                      </h3>
                      <p className="text-xs font-serif text-amber-400/90 font-semibold mb-2">{mode.subtitle}</p>
                      <p className="text-xs text-slate-300 leading-snug">{mode.description}</p>
                    </div>

                    {/* Resumen táctico inferior */}
                    <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-slate-400 font-serif">
                      <span>{isEn ? 'Front Cap:' : 'Límite Frente:'} <strong className="text-slate-200">{mode.maxFrontCards}</strong></span>
                      <span title={isEn ? 'Shadow Economy: Start at 0, earned per round (Win/Loss/Streak), continuous savings' : 'Economía de Sombras: Inician en 0, se cobran por ronda (Gana/Pierde/Racha), ahorro continuo'}>
                        {isEn ? 'Shadows (R1: 0):' : 'Sombras (R1: 0):'}{' '}
                        <strong className="text-purple-400 font-mono font-bold">
                          {mode.economy ? `+${mode.economy.win}/+${mode.economy.loss}/+${mode.economy.streak}` : (mode.id === '3v3' ? '+2/+3/+4' : mode.id === '4v4' ? '+2/+4/+5' : '+1/+2/+3')}
                        </strong>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECCIÓN DE TIEMPO DE EQUIPO (RELOJ COMPARTIDO) */}
          <div className="w-full mb-7">
            <div className="flex items-center justify-between mb-3 px-1 font-serif">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step3}
              </span>
              <span className="text-xs text-slate-400">
                {isEn ? 'Joint team time bank for each round' : 'Bolsa de tiempo conjunta por equipo para cada ronda'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {localizedTimeOptions.map((timeOpt) => {
                const isSelected = selectedTimeSpeed === timeOpt.id;
                const speedConfig = modeTimes[timeOpt.id];
                return (
                  <button
                    key={timeOpt.id}
                    type="button"
                    onClick={() => setSelectedTimeSpeed && setSelectedTimeSpeed(timeOpt.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer relative
                      ${isSelected
                        ? 'border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] ring-2 ring-amber-400/40 text-slate-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] -translate-y-0.5'
                        : 'border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 text-slate-300 opacity-75 hover:opacity-100'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-serif font-bold text-base ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>{timeOpt.name}</span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-serif font-black uppercase text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3] text-amber-400" />
                            {isEn ? 'ACTIVE' : 'ACTIVO'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-serif text-slate-400">{timeOpt.desc}</span>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border shadow-inner ${
                      isSelected
                        ? 'text-amber-300 bg-amber-500/20 border-amber-400'
                        : 'text-amber-400 bg-black/60 border-amber-500/25'
                    }`}>
                      {speedConfig?.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-serif text-slate-400 mt-2 px-1">
              {isEn
                ? 'Time is shared across the entire team and counts down during members\' turns. Resets to full value each round.'
                : 'El tiempo es compartido para todo el equipo y se consume durante los turnos de sus componentes. Se reinicia al valor completo en cada nueva ronda.'}
            </p>
          </div>

          {/* 3. SELECCIÓN DE DURACIÓN DE LA PARTIDA */}
          <div className="w-full mb-7">
            <div className="flex items-center justify-between mb-3 px-1 font-serif">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step2}
              </span>
              <span className="text-xs text-slate-400">
                {isEn ? 'Determines the total number of regular rounds to contest' : 'Determina el total de rondas reglamentarias a disputar'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {localizedDurations.map((dur) => {
                const isSelected = selectedRhythm === dur.rounds;
                return (
                  <button
                    key={dur.rounds}
                    type="button"
                    onClick={() => setSelectedRhythm(dur.rounds)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer relative
                      ${isSelected
                        ? 'border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] ring-2 ring-amber-400/40 text-slate-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] -translate-y-0.5'
                        : 'border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 text-slate-300 opacity-75 hover:opacity-100'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-serif font-bold text-base ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>{dur.name}</span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-serif font-black uppercase text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3] text-amber-400" />
                            {isEn ? 'ACTIVE' : 'ACTIVO'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-serif text-slate-400">{dur.desc}</span>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border ${
                      isSelected
                        ? 'text-amber-300 bg-amber-500/20 border-amber-400'
                        : 'text-slate-300 bg-black/60 border-amber-500/20'
                    }`}>
                      {dur.timeEst}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. RESUMEN DE LA CONFIGURACIÓN Y BOTÓN DE INICIAR */}
          <div className="w-full max-w-4xl casino-panel rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-serif font-bold text-amber-400 tracking-wider block">
                {isEn ? 'Selected Configuration' : 'Configuración Seleccionada'}
              </span>
              <div className="text-base font-serif font-black text-slate-100">
                {isEn
                  ? `Mode: ${currentMode.name} • Time: ${currentTimeConfig.label} (${currentTimeOption.name}) • Duration: ${currentDuration.name} (${currentDuration.rounds} Rounds)`
                  : `Modo ${currentMode.name} • Tiempo ${currentTimeConfig.label} (${currentTimeOption.name}) • Duración ${currentDuration.name} (${currentDuration.rounds} Rondas)`}
              </div>
              <div className="text-xs font-serif text-slate-400 mt-0.5">
                {isEn
                  ? 'You will play as commander in the allied squad against AI. Team clock resets every round.'
                  : 'Jugarás como comandante en el equipo aliado contra la IA. Reloj de equipo reiniciado cada ronda.'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              {/* Botón Volver */}
              <button
                type="button"
                onClick={() => setView('landing')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] text-slate-300 hover:text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/25 transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{ui.menu.setup.cancelBtn}</span>
              </button>

              {/* Botón Iniciar Partida vs Bots */}
              <button
                type="button"
                onClick={onStartGame}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{ui.menu.setup.startMatchBtn}</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Pie inferior común */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs font-serif text-slate-500 py-3 border-t border-amber-500/15 z-10 flex flex-wrap items-center justify-between gap-2">
        <span>{ui.menu.footer.rights}</span>
        <div className="flex items-center gap-3 text-slate-400">
          <button onClick={onOpenQuickGuide} className="hover:text-amber-400 transition cursor-pointer">{ui.common.quickGuide}</button>
          <span className="text-amber-500/30">•</span>
          <button onClick={onOpenFullManual} className="hover:text-amber-300 transition cursor-pointer">{ui.common.fullManual}</button>
        </div>
      </footer>
    </div>
  );
}
