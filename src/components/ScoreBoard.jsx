import React from 'react';
import { SUITS } from '../constants/rules';
import { Card } from './Card';
import { Volume2, VolumeX, BookOpen, RotateCcw, Swords, Flame, Layers, Home, Zap, Wifi } from 'lucide-react';

export function ScoreBoard({
  round,
  totalRounds,
  teamARoundPoints,
  teamBRoundPoints,
  teamACumulativePoints,
  teamBCumulativePoints,
  trumpCard,
  initiativeTeam,
  drawDeckCount,
  discardDeckCount,
  modeConfig,
  rhythmConfig,
  isMuted,
  onToggleMute,
  onOpenQuickGuide,
  onOpenFullManual,
  onRestartGame,
  onBackToMenu,
  isMultiplayer = false,
  roomCode = '',
  mySlotId = '',
}) {
  const trumpSuit = trumpCard ? SUITS[trumpCard.suit] : null;
  const is1v1 = modeConfig?.id === '1v1';

  return (
    <header className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo, Modo y Ronda */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMenu}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
              title="Volver al Menú Principal"
            >
              <Home className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-100 uppercase flex items-center gap-1.5 flex-wrap">
                <span>Frentes de Guerra</span>
                <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded border border-slate-700">
                  {modeConfig?.name}
                </span>
                {isMultiplayer && (
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5 text-indigo-400" />
                    <span>{roomCode}</span>
                    <span className="text-emerald-400">({mySlotId})</span>
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="text-amber-400">Ronda {round}</span> de {totalRounds} ({rhythmConfig?.name})
              </div>
            </div>
          </div>
        </div>

        {/* Marcador Principal de Rondas y Puntos Acumulados */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-1.5">
          {/* Rondas Ganadas */}
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              {is1v1 ? 'Tú vs Rival' : 'Equipo A vs Equipo B'}
            </span>
            <div className="text-base sm:text-lg font-black font-mono leading-none mt-0.5">
              <span className="text-emerald-400">{teamARoundPoints}</span>
              <span className="text-slate-600 mx-1.5">-</span>
              <span className="text-rose-400">{teamBRoundPoints}</span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          {/* Puntos Acumulados */}
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Acumulados
            </span>
            <div className="text-xs sm:text-sm font-bold font-mono text-slate-300 leading-none mt-0.5">
              <span className="text-emerald-300">{teamACumulativePoints}</span>
              <span className="text-slate-600 mx-1">/</span>
              <span className="text-rose-300">{teamBCumulativePoints}</span>
            </div>
          </div>
        </div>

        {/* Palo Triunfo */}
        {trumpCard && (
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl px-3 py-1 shadow-lg">
            <div className="scale-75 origin-left -mr-4">
              <Card card={trumpCard} isTrump compact />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-amber-400" /> Triunfo
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {trumpSuit?.name} <span className="text-amber-400 font-bold">(+2 pts)</span>
              </div>
            </div>
          </div>
        )}

        {/* Mazos e Iniciativa */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Mazo: <strong className="text-slate-200 font-mono">{drawDeckCount}</strong></span>
            <span className="text-slate-700">|</span>
            <span>Descarte: <strong className="text-slate-200 font-mono">{discardDeckCount}</strong></span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <span>Iniciativa: </span>
            <strong className={initiativeTeam === 'teamA' ? 'text-emerald-400' : 'text-rose-400'}>
              {initiativeTeam === 'teamA' ? (is1v1 ? 'Tuya' : 'Equipo A') : (is1v1 ? 'Rival' : 'Equipo B')}
            </strong>
          </div>
        </div>

        {/* Botones de Utilidad */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Guía Rápida */}
          <button
            onClick={onOpenQuickGuide}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition flex items-center gap-1 text-xs font-bold"
            title="Abrir Guía Rápida de Mesa"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Guía Rápida</span>
          </button>

          {/* Manual Completo */}
          <button
            onClick={onOpenFullManual}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
            title="Ver Reglamento Oficial Completo"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Manual</span>
          </button>

          <button
            onClick={onRestartGame}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 transition"
            title="Reiniciar Partida"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
