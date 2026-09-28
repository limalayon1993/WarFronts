import React, { useState } from 'react';
import { GAME_MODES, GAME_RHYTHMS } from '../constants/rules';
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
} from 'lucide-react';

export function MainMenu({
  selectedMode,
  setSelectedMode,
  selectedRhythm,
  setSelectedRhythm,
  onStartGame,
  onOpenMultiplayer,
  onOpenQuickGuide,
  onOpenFullManual,
  isMuted,
  onToggleMute,
  initialView = 'landing',
}) {
  // 'landing' (2 botones principales) | 'bots' (configurar y crear partida contra bots)
  const [view, setView] = useState(initialView);

  const currentMode = GAME_MODES[selectedMode];
  const currentRhythm = GAME_RHYTHMS.find(r => r.rounds === selectedRhythm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Elementos decorativos tácticos de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera superior común */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        {view === 'landing' ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-amber-500/20 shadow-lg">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">Sala Táctica</span>
              <div className="text-sm font-bold text-slate-300">Cuartel General</div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-bold shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Botón de Guía Rápida de Mesa */}
          <button
            onClick={onOpenQuickGuide}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 transition flex items-center gap-1.5 text-xs font-bold shadow"
            title="Abrir Hoja de Referencia Rápida"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Guía Rápida</span>
          </button>

          {/* Botón de Manual Completo */}
          <button
            onClick={onOpenFullManual}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            title="Ver Reglamento Oficial Completo"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Manual Completo</span>
          </button>
        </div>
      </header>

      {/* VISTA 1: MENÚ PRINCIPAL (2 BOTONES PRINCIPALES) */}
      {view === 'landing' && (
        <main className="max-w-5xl w-full mx-auto my-auto py-8 z-10 flex flex-col items-center">
          {/* Título y Presentación */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Versión Oficial 1.6 • Inteligencia Táctica
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-wider text-slate-100 uppercase drop-shadow-md">
              Frentes de Guerra
            </h1>

            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
              Juego táctico de cartas por control de zonas, información imperfecta y sinergias sin microgestión.
            </p>

            <div className="inline-flex items-center gap-2 mt-5 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Selecciona tu modalidad de juego
            </div>
          </div>

          {/* Los 2 Botones Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl w-full">
            {/* 1. Jugar con bots */}
            <button
              type="button"
              onClick={() => setView('bots')}
              className="group relative flex flex-col justify-between text-left p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/25 border border-slate-800 hover:border-amber-500/70 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Modo Local
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                  Jugar con bots
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  Enfréntate a la IA táctica en partidas individuales o por equipos. Selecciona el formato (1v1, 2v2, 3v3 o 4v4) y ritmo de rondas antes del despliegue.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    ⚡ 1v1, 2v2, 3v3 y 4v4
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    🤖 IA Adaptativa
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    ⏱ Sin esperas
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  Configurar Partida
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* 2. Multijugador */}
            <button
              type="button"
              onClick={onOpenMultiplayer}
              className="group relative flex flex-col justify-between text-left p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/25 border border-slate-800 hover:border-indigo-500/70 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                    <Wifi className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Online P2P
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 group-hover:text-indigo-300 transition-colors uppercase tracking-wide">
                  Multijugador
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  Crea una sala privada para invitar amigos o únete con un código de sala en tiempo real. Conexión directa jugador a jugador sin registros ni servidores.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    🌐 Código de Sala
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    👥 Hasta 8 Jugadores
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                    💬 Chat en Vivo
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  Crear o Unirse a Sala
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-3.5 h-3.5 text-amber-400" /> Partida Local vs Bots
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-wider text-slate-100 uppercase">
              Crear Partida con Bots
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              Configura el formato táctico de combate y el ritmo de rondas antes del despliegue en el frente.
            </p>
          </div>

          {/* 1. SELECCIÓN DE FORMATO / MODO DE JUEGO */}
          <div className="w-full mb-7">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> 1. Elige el Formato de Juego
              </span>
              <span className="text-xs text-slate-500">1v1, 2v2, 3v3 y 4v4 con Inteligencia Artificial</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.values(GAME_MODES).map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`
                      text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between relative group
                      ${isSelected
                        ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500 shadow-amber-500/10 shadow-xl ring-2 ring-amber-400/50 -translate-y-1'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                      }
                    `}
                  >
                    {/* Insignia de Barajas */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {mode.decks === 1 ? '1 Baraja (52 cartas)' : '2 Barajas (104 cartas)'}
                      </span>

                      <span className="text-xs font-mono font-bold text-slate-400">
                        {mode.totalPlayers} Jugadores
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-100 mb-1 flex items-center justify-between">
                        {mode.name}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-semibold mb-2">{mode.subtitle}</p>
                      <p className="text-xs text-slate-400 leading-snug">{mode.description}</p>
                    </div>

                    {/* Resumen táctico inferior */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Límite Frente: <strong className="text-slate-300">{mode.maxFrontCards}</strong></span>
                      <span>Sombras: <strong className="text-purple-400">{mode.shadowsPerPlayer}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECCIÓN DE RITMO DE PARTIDA */}
          <div className="w-full mb-7">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> 2. Elige el Ritmo de la Partida
              </span>
              <span className="text-xs text-slate-500">Determina el total de rondas a disputar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {GAME_RHYTHMS.map((rhythm) => {
                const isSelected = selectedRhythm === rhythm.rounds;
                return (
                  <button
                    key={rhythm.rounds}
                    type="button"
                    onClick={() => setSelectedRhythm(rhythm.rounds)}
                    className={`
                      p-4 rounded-xl border transition-all text-left flex items-center justify-between
                      ${isSelected
                        ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-400/40 text-slate-100 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{rhythm.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{rhythm.desc}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {rhythm.timeEst}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. RESUMEN DE LA CONFIGURACIÓN Y BOTÓN DE INICIAR */}
          <div className="w-full max-w-4xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block">
                Configuración Seleccionada
              </span>
              <div className="text-base font-black text-slate-100">
                Modo {currentMode.name} • Ritmo {currentRhythm.name} ({currentRhythm.rounds} Rondas)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Jugarás como comandante en el equipo aliado contra la IA.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              {/* Botón Volver */}
              <button
                type="button"
                onClick={() => setView('landing')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              {/* Botón Iniciar Partida vs Bots */}
              <button
                type="button"
                onClick={onStartGame}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-amber-500/25 shadow-xl transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Partida</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Pie inferior común */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-2 border-t border-slate-900 z-10 flex flex-wrap items-center justify-between gap-2">
        <span>Frentes de Guerra v1.6 — Edición Oficial Competitiva</span>
        <div className="flex items-center gap-3 text-slate-400">
          <button onClick={onOpenQuickGuide} className="hover:text-amber-400 transition">Guía Rápida de Mesa</button>
          <span>•</span>
          <button onClick={onOpenFullManual} className="hover:text-indigo-400 transition">Reglamento Completo</button>
        </div>
      </footer>
    </div>
  );
}
