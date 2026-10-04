import React from 'react';
import { User, Bot, EyeOff, ChevronRight, Clock, Timer } from 'lucide-react';
import { formatClockTime } from '../constants/rules';
import { useLanguage } from '../context/LanguageContext';

export function TurnStrip({
  players = [],
  activePlayerIndex,
  currentTurnPlayerId,
  isBotThinking,
  teamAClock = 200,
  teamBClock = 200,
  teamAShadowsLeft = 2,
  teamBShadowsLeft = 2,
  modeId = '2v2',
}) {
  const { language, isEn, ui } = useLanguage();
  const activePlayer = players.find(p => p.id === currentTurnPlayerId) || players[activePlayerIndex];
  const activeTeam = activePlayer?.team || 'teamA';
  const is1v1 = modeId === '1v1';

  return (
    <div className="bg-[#07090e]/95 border-b border-amber-500/20 px-3 sm:px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs font-serif shadow-md">
      {/* Indicador del turno activo y Reloj Dual de Equipo */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Reloj Dual de Equipo (Dual Precision Tournament Clock) */}
        <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-2xl border border-amber-500/30 shadow-inner">
          {/* Reloj Equipo A */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border font-mono transition-all duration-200 ${
              activeTeam === 'teamA'
                ? teamAClock <= 10
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-pulse'
                  : teamAClock <= 20
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                  : 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-1 ring-emerald-500/40 shadow-emerald-500/20 shadow-md'
                : 'bg-black/40 border-stone-800/80 text-stone-500 opacity-60'
            }`}
            title={isEn ? `Clock for ${is1v1 ? 'your squad (A)' : 'Allied Squad (A)'}` : `Reloj de ${is1v1 ? 'tu equipo (A)' : 'Equipo Aliado (A)'}`}
          >
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-serif uppercase font-bold tracking-widest opacity-80 leading-none">
                {is1v1 ? ui.game.turnStrip.youA : ui.game.turnStrip.teamA}
              </span>
              <span className="text-xs sm:text-sm font-mono font-black leading-tight tracking-tight">
                {formatClockTime(teamAClock)}
              </span>
            </div>
            {/* Fondo de Sombras del Equipo A */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-purple-500/40 bg-purple-950/60 text-purple-300 ml-0.5"
              title={ui.game.turnStrip.teamShadowsTitle ? ui.game.turnStrip.teamShadowsTitle(is1v1 ? (isEn ? 'Your' : 'Tu') : (isEn ? 'Team A' : 'Equipo A'), teamAShadowsLeft) : `${teamAShadowsLeft}`}
            >
              <EyeOff className="w-2.5 h-2.5 text-purple-400" />
              <span className="font-mono text-[10px] font-bold">{teamAShadowsLeft}</span>
            </div>
            {activeTeam === 'teamA' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <span className="text-amber-500/40 text-[9px] font-serif font-black px-0.5">VS</span>

          {/* Reloj Equipo B */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border font-mono transition-all duration-200 ${
              activeTeam === 'teamB'
                ? teamBClock <= 10
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-pulse'
                  : teamBClock <= 20
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                  : 'bg-rose-950/90 border-rose-400 text-rose-300 ring-1 ring-rose-500/40 shadow-rose-500/20 shadow-md'
                : 'bg-black/40 border-stone-800/80 text-stone-500 opacity-60'
            }`}
            title={isEn ? `Clock for ${is1v1 ? 'rival (B)' : 'Rival Squad (B)'}` : `Reloj de ${is1v1 ? 'rival (B)' : 'Equipo Rival (B)'}`}
          >
            {activeTeam === 'teamB' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            )}
            {/* Fondo de Sombras del Equipo B */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-purple-500/40 bg-purple-950/60 text-purple-300 mr-0.5"
              title={ui.game.turnStrip.teamShadowsTitle ? ui.game.turnStrip.teamShadowsTitle(is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B'), teamBShadowsLeft) : `${teamBShadowsLeft}`}
            >
              <EyeOff className="w-2.5 h-2.5 text-purple-400" />
              <span className="font-mono text-[10px] font-bold">{teamBShadowsLeft}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-serif uppercase font-bold tracking-widest opacity-80 leading-none">
                {is1v1 ? ui.game.turnStrip.rivalB : ui.game.turnStrip.teamB}
              </span>
              <span className="text-xs sm:text-sm font-mono font-black leading-tight tracking-tight">
                {formatClockTime(teamBClock)}
              </span>
            </div>
          </div>
        </div>

        {/* Turno actual */}
        <div className="flex items-center gap-2 font-serif">
          <div className={`w-2 h-2 rounded-full animate-ping ${
            activePlayer?.team === 'teamA' ? 'bg-emerald-400' : 'bg-rose-400'
          }`} />
          <span className="text-slate-300 text-xs">
            {ui.game.turnStrip.turnLabel}{' '}
            <strong className={activePlayer?.team === 'teamA' ? 'text-emerald-400' : 'text-rose-400'}>
              {activePlayer?.name}
            </strong>{' '}
            {activePlayer?.isHuman ? (
              <span className="text-amber-400 font-bold ml-1 tracking-wider uppercase text-[11px]">
                {ui.game.turnStrip.yourTurnPrompt}
              </span>
            ) : (
              <span className="text-amber-400/80 italic ml-1 inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {ui.game.turnStrip.botThinking}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Tira secuencial de turnos de jugadores */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
        {players.map((player, idx) => {
          const isActive = player.id === currentTurnPlayerId;
          const isTeamA = player.team === 'teamA';

          return (
            <React.Fragment key={player.id}>
              <div
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all text-[11px] font-serif shrink-0
                  ${isActive
                    ? isTeamA
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/50 shadow-md font-bold'
                      : 'bg-rose-950/80 border-rose-400 text-rose-200 ring-1 ring-rose-500/50 shadow-md font-bold'
                    : 'bg-[#0d121a]/80 border-amber-500/15 text-slate-400'
                  }
                `}
              >
                {player.isHuman ? (
                  <User className="w-3 h-3 text-amber-400" />
                ) : (
                  <Bot className={`w-3 h-3 ${isTeamA ? 'text-emerald-400' : 'text-rose-400'}`} />
                )}
                <span>{player.name}</span>
                {idx === 0 && (
                  <span
                    className="text-[8px] font-serif font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 tracking-wider"
                    title={isEn ? "Opens the round attacking (Team with Initiative)" : "Abre la ronda atacando (Equipo con Iniciativa)"}
                  >
                    {isEn ? '1st' : '1º'}
                  </span>
                )}
                <span className="font-mono text-[10px] text-amber-500/60 font-semibold">
                  ({player.hand.length})
                </span>
              </div>
              {idx < players.length - 1 && (
                <ChevronRight className="w-3 h-3 text-amber-500/30 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
