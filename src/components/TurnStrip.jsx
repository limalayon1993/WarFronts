import React from 'react';
import { User, Bot, EyeOff, ChevronRight, Clock, Timer } from 'lucide-react';
import { formatClockTime } from '../constants/rules';

export function TurnStrip({
  players = [],
  activePlayerIndex,
  currentTurnPlayerId,
  isBotThinking,
  teamAClock = 200,
  teamBClock = 200,
  modeId = '2v2',
}) {
  const activePlayer = players.find(p => p.id === currentTurnPlayerId) || players[activePlayerIndex];
  const activeTeam = activePlayer?.team || 'teamA';
  const is1v1 = modeId === '1v1';

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
      {/* Indicador del turno activo y Reloj Dual de Equipo */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Reloj Dual de Equipo (Dual Chess Clock) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          {/* Reloj Equipo A */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition-all duration-200 ${
              activeTeam === 'teamA'
                ? teamAClock <= 10
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-pulse'
                  : teamAClock <= 20
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                  : 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/20 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
            }`}
            title={`Reloj de ${is1v1 ? 'tu equipo (A)' : 'Equipo Aliado (A)'}`}
          >
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase font-bold tracking-wider opacity-80 leading-none">
                {is1v1 ? 'Tú (A)' : 'Equipo A'}
              </span>
              <span className="text-xs sm:text-sm font-black leading-tight">
                {formatClockTime(teamAClock)}
              </span>
            </div>
            {activeTeam === 'teamA' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <span className="text-slate-600 text-[10px] font-bold px-0.5">VS</span>

          {/* Reloj Equipo B */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition-all duration-200 ${
              activeTeam === 'teamB'
                ? teamBClock <= 10
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-pulse'
                  : teamBClock <= 20
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                  : 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-500/20 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
            }`}
            title={`Reloj de ${is1v1 ? 'rival (B)' : 'Equipo Rival (B)'}`}
          >
            {activeTeam === 'teamB' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            )}
            <div className="flex flex-col text-right">
              <span className="text-[8px] uppercase font-bold tracking-wider opacity-80 leading-none">
                {is1v1 ? 'Rival (B)' : 'Equipo B'}
              </span>
              <span className="text-xs sm:text-sm font-black leading-tight">
                {formatClockTime(teamBClock)}
              </span>
            </div>
          </div>
        </div>

        {/* Turno actual */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full animate-ping ${
            activePlayer?.team === 'teamA' ? 'bg-emerald-400' : 'bg-rose-400'
          }`} />
          <span className="font-semibold text-slate-200 text-xs">
            Turno:{' '}
            <strong className={activePlayer?.team === 'teamA' ? 'text-emerald-400' : 'text-rose-400'}>
              {activePlayer?.name}
            </strong>{' '}
            {activePlayer?.isHuman ? (
              <span className="text-amber-400 font-bold ml-1">
                — ¡Elige tu carta y frente!
              </span>
            ) : (
              <span className="text-amber-400/90 italic ml-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                pensando jugada táctica...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Tira secuencial de turnos de jugadores */}
      <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
        {players.map((player, idx) => {
          const isActive = player.id === currentTurnPlayerId;
          const isTeamA = player.team === 'teamA';

          return (
            <React.Fragment key={player.id}>
              <div
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium shrink-0
                  ${isActive
                    ? isTeamA
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 shadow-md font-bold'
                      : 'bg-rose-950/80 border-rose-400 text-rose-200 ring-2 ring-rose-500/50 shadow-md font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
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
                    className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0"
                    title="Abre la ronda atacando (Equipo con Iniciativa)"
                  >
                    1º Ataque
                  </span>
                )}
                <span className="font-mono text-[10px] text-slate-500">
                  ({player.hand.length})
                </span>
                {player.shadowsLeft > 0 && (
                  <EyeOff className="w-2.5 h-2.5 text-purple-400" title="Sombras restantes" />
                )}
              </div>
              {idx < players.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
