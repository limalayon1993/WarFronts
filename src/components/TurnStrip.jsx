import React from 'react';
import { User, Bot, EyeOff, ChevronRight, Clock } from 'lucide-react';

export function TurnStrip({
  players,
  activePlayerIndex,
  currentTurnPlayerId,
  isBotThinking,
  turnTimer,
}) {
  const activePlayer = players.find(p => p.id === currentTurnPlayerId) || players[activePlayerIndex];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      {/* Indicador del turno activo y reloj oficial */}
      <div className="flex items-center gap-2.5">
        <div className={`w-3 h-3 rounded-full animate-ping ${
          activePlayer?.team === 'teamA' ? 'bg-emerald-400' : 'bg-rose-400'
        }`} />
        <span className="font-semibold text-slate-200">
          Turno actual:{' '}
          <strong className={activePlayer?.team === 'teamA' ? 'text-emerald-400' : 'text-rose-400'}>
            {activePlayer?.name}
          </strong>{' '}
          {activePlayer?.isHuman ? (
            <span className="text-amber-400 font-bold ml-1">
              — ¡Selecciona tu carta y el frente a disputar!
            </span>
          ) : isBotThinking ? (
            <span className="text-slate-400 italic ml-1">
              pensando táctica de equipo...
            </span>
          ) : (
            <span className="text-slate-400 italic ml-1">
              desplegando...
            </span>
          )}
        </span>

        {/* Reloj oficial por turno (15s con penalización de descarte) */}
        {typeof turnTimer === 'number' && (
          <div
            className={`flex items-center gap-1 font-mono font-black text-xs px-2 py-0.5 rounded border transition ${
              turnTimer <= 5
                ? 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-slate-950 text-amber-400 border-slate-700'
            }`}
            title="Reloj reglamentario por turno"
          >
            <Clock className="w-3 h-3" />
            <span>{turnTimer}s</span>
          </div>
        )}
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
