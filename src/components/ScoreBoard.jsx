import React from 'react';
import { SUITS, getLocalizedSuits, getLocalizedModes, getLocalizedDurations } from '../constants/rules';
import { Card } from './Card';
import { Volume2, VolumeX, BookOpen, RotateCcw, Swords, Flame, Layers, Home, Zap, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

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
  durationConfig,
  rhythmConfig,
  timeConfig,
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
  const { language, isEn, ui } = useLanguage();
  const localizedSuits = getLocalizedSuits(language);
  const localizedModes = getLocalizedModes(language);
  const localizedDurations = getLocalizedDurations(language);

  const trumpSuit = trumpCard ? localizedSuits[trumpCard.suit] : null;
  const is1v1 = modeConfig?.id === '1v1';
  const effectiveMode = localizedModes[modeConfig?.id] || modeConfig;
  const rawDuration = durationConfig || rhythmConfig;
  const effectiveDuration = localizedDurations.find(d => d.rounds === rawDuration?.rounds) || rawDuration;

  return (
    <header className="bg-[#07090e]/95 border-b border-amber-500/20 px-4 py-2.5 backdrop-blur-md shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo, Modo y Ronda */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] border border-amber-500/20 hover:border-amber-400/60 text-slate-400 hover:text-amber-300 transition shadow-sm"
              title={ui.common.backToMenu}
            >
              <Home className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-serif font-black tracking-widest uppercase flex items-center gap-1.5 flex-wrap">
                <span className="text-gold-gradient">{ui.common.gameTitle}</span>
                <span className="text-[9px] bg-black/60 text-amber-300/90 font-serif px-2 py-0.5 rounded border border-amber-500/30 tracking-wider">
                  {effectiveMode?.name}
                </span>
                {isMultiplayer && (
                  <span className="text-[9px] bg-black/60 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5 text-amber-400" />
                    <span>{roomCode}</span>
                    <span className="text-emerald-400">({mySlotId})</span>
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-xs font-serif text-slate-400">
                <span className="text-amber-400/90 font-bold">{ui.common.round} {round}</span> {ui.common.of} {totalRounds} ({effectiveDuration?.name})
                {timeConfig && (
                  <>
                    <span className="text-amber-500/40">•</span>
                    <span className="text-slate-300 font-mono text-[11px]">{timeConfig.label}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Marcador Principal de Rondas y Puntos Acumulados */}
        <div className="flex items-center gap-4 bg-black/60 border border-amber-500/25 rounded-2xl px-4 py-1.5 shadow-inner">
          {/* Rondas Ganadas */}
          <div className="text-center">
            <span className="text-[9px] uppercase font-serif font-bold text-amber-200/60 tracking-wider">
              {is1v1 ? ui.game.scoreboard.youVsRival : ui.game.scoreboard.teamAVsTeamB}
            </span>
            <div className="text-base sm:text-lg font-serif font-black leading-none mt-0.5">
              <span className="text-emerald-400">{teamARoundPoints}</span>
              <span className="text-amber-500/40 mx-1.5">-</span>
              <span className="text-rose-400">{teamBRoundPoints}</span>
            </div>
          </div>

          <div className="h-7 w-px bg-amber-500/20" />

          {/* Puntos Acumulados */}
          <div className="text-center">
            <span className="text-[9px] uppercase font-serif font-bold text-amber-200/60 tracking-wider">
              {ui.game.scoreboard.accumulated}
            </span>
            <div className="text-xs sm:text-sm font-serif font-bold text-slate-300 leading-none mt-0.5">
              <span className="text-emerald-300">{teamACumulativePoints}</span>
              <span className="text-amber-500/40 mx-1">/</span>
              <span className="text-rose-300">{teamBCumulativePoints}</span>
            </div>
          </div>
        </div>

        {/* Palo Triunfo */}
        {trumpCard && (
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-950/30 via-black/50 to-black/60 border border-amber-500/30 rounded-2xl px-3 py-1 shadow-lg">
            <div className="scale-75 origin-left -mr-4">
              <Card card={trumpCard} isTrump compact />
            </div>
            <div>
              <div className="text-[9px] font-serif font-black text-amber-400 uppercase tracking-widest">
                {isEn ? 'Trump Suit' : 'Triunfo'}
              </div>
              <div className="text-xs font-serif font-bold text-slate-200">
                {trumpSuit?.name} <span className="text-amber-400 text-[11px]">(+2 pts)</span>
              </div>
            </div>
          </div>
        )}

        {/* Mazos e Iniciativa */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 font-serif">
          <div className="flex items-center gap-1.5 bg-black/40 border border-amber-500/20 rounded-xl px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-amber-400/70" />
            <span>{ui.game.scoreboard.drawDeck} <strong className="text-slate-200 font-mono text-[11px]">{drawDeckCount}</strong></span>
            <span className="text-amber-500/30">|</span>
            <span>{ui.game.scoreboard.discardDeck} <strong className="text-slate-200 font-mono text-[11px]">{discardDeckCount}</strong></span>
          </div>

          <div className="bg-black/40 border border-amber-500/20 rounded-xl px-2.5 py-1" title={isEn ? "Team starting the attack in this round (Initiative)" : "Equipo que empieza atacando en esta ronda (Iniciativa)"}>
            <span>{ui.game.scoreboard.initiative} </span>
            <strong className={initiativeTeam === 'teamA' ? 'text-emerald-400' : 'text-rose-400'}>
              {initiativeTeam === 'teamA'
                ? (is1v1 ? ui.game.scoreboard.initiativeYours : ui.game.scoreboard.initiativeTeamA)
                : (is1v1 ? ui.game.scoreboard.initiativeRival : ui.game.scoreboard.initiativeTeamB)}
            </strong>
          </div>
        </div>

        {/* Botones de Utilidad */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] border border-amber-500/20 hover:border-amber-400/60 text-slate-300 hover:text-white transition shadow-sm"
            title={isMuted ? ui.common.unmute : ui.common.mute}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Guía Rápida */}
          <button
            onClick={onOpenQuickGuide}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/15 hover:from-amber-500/25 hover:to-amber-600/25 border border-amber-500/35 text-amber-300 transition flex items-center gap-1 text-xs font-serif font-bold tracking-wider uppercase shadow-sm"
            title={ui.common.quickGuide}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{ui.common.quickGuide}</span>
          </button>

          {/* Manual Completo */}
          <button
            onClick={onOpenFullManual}
            className="px-3 py-1.5 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] border border-amber-500/20 hover:border-amber-400/40 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-serif font-semibold tracking-wider uppercase shadow-sm"
            title={ui.common.fullManual}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{isEn ? 'Manual' : 'Manual'}</span>
          </button>

          {/* Botón de Cambio de Idioma */}
          <LanguageToggle compact />

          <button
            onClick={onRestartGame}
            className="p-2 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] border border-amber-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition shadow-sm"
            title={isEn ? 'Restart Match' : 'Reiniciar Partida'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
