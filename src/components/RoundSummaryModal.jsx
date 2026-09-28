import React from 'react';
import { FRONTS, resolveFrontWinner, calculateFrontScore } from '../constants/rules';
import { Card } from './Card';
import { ArrowRight, Award } from 'lucide-react';

export function RoundSummaryModal({
  isOpen,
  round,
  totalRounds,
  fronts,
  trumpSuit,
  modeId = '1v1',
  onNextRound,
}) {
  if (!isOpen) return null;

  const is1v1 = modeId === '1v1';

  // Resolver cada frente
  const frontResults = FRONTS.map(front => {
    const teamACards = fronts[front.id].teamA;
    const teamBCards = fronts[front.id].teamB;
    const teamAScore = calculateFrontScore(teamACards, trumpSuit, true);
    const teamBScore = calculateFrontScore(teamBCards, trumpSuit, true);
    const resolution = resolveFrontWinner(teamACards, teamBCards, trumpSuit);

    return {
      front,
      teamACards,
      teamBCards,
      teamAScore,
      teamBScore,
      winner: resolution.winner,
      reason: resolution.reason,
    };
  });

  const teamAFrontWins = frontResults.filter(r => r.winner === 'teamA').length;
  const teamBFrontWins = frontResults.filter(r => r.winner === 'teamB').length;

  let roundOutcome = 'tie';
  if (teamAFrontWins >= 2) {
    roundOutcome = 'teamA';
  } else if (teamBFrontWins >= 2) {
    roundOutcome = 'teamB';
  }

  const roundPointsTeamA = frontResults.reduce((acc, r) => acc + r.teamAScore.total, 0);
  const roundPointsTeamB = frontResults.reduce((acc, r) => acc + r.teamBScore.total, 0);

  const isFinalRound = round >= totalRounds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Cabecera del resultado */}
        <div className={`px-6 py-5 border-b border-slate-800 text-center ${
          roundOutcome === 'teamA'
            ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80'
            : roundOutcome === 'teamB'
            ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80'
            : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80'
        }`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
            roundOutcome === 'teamA'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : roundOutcome === 'teamB'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            <Award className="w-4 h-4" />
            Resolución de la Ronda {round}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide">
            {roundOutcome === 'teamA' && (is1v1 ? '¡Has Conquistado la Ronda!' : '¡Victoria de Ronda para el Equipo Aliado (A)!')}
            {roundOutcome === 'teamB' && (is1v1 ? 'El Rival ha Ganado la Ronda' : 'Victoria de Ronda para el Equipo Rival (B)')}
            {roundOutcome === 'tie' && 'Ronda Nula (Empate en Frentes)'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Frentes Ganados: <strong className="text-emerald-400">{teamAFrontWins}</strong> {is1v1 ? 'Tú' : 'Equipo A'} — <strong className="text-rose-400">{teamBFrontWins}</strong> {is1v1 ? 'Rival' : 'Equipo B'}
            {roundOutcome === 'teamA' && ' (+1 Punto de Ronda)'}
            {roundOutcome === 'teamB' && ' (+1 Punto de Ronda)'}
          </p>
        </div>

        {/* Desglose de los 3 Frentes con sombras reveladas */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {frontResults.map(({ front, teamACards, teamBCards, teamAScore, teamBScore, winner, reason }) => (
              <div
                key={front.id}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  winner === 'teamA'
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : winner === 'teamB'
                    ? 'bg-rose-950/30 border-rose-500/40'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-slate-200">{front.name}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                      winner === 'teamA' ? 'bg-emerald-500/20 text-emerald-400' :
                      winner === 'teamB' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {winner === 'teamA' ? (is1v1 ? 'Ganado' : 'Equipo A') : winner === 'teamB' ? (is1v1 ? 'Perdido' : 'Equipo B') : 'Nulo'}
                    </span>
                  </div>

                  {/* Comparación numérica */}
                  <div className="my-3 text-center">
                    <div className="text-xl font-black font-mono">
                      <span className="text-emerald-400">{teamAScore.total}</span>
                      <span className="text-slate-600 text-sm mx-2">vs</span>
                      <span className="text-rose-400">{teamBScore.total}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{reason}</div>
                  </div>

                  {/* Cartas del Equipo Rival B */}
                  <div className="mb-2">
                    <span className="text-[10px] text-rose-400/80 font-semibold block mb-1">
                      {is1v1 ? 'Rival' : 'Equipo B'} ({teamBCards.length} cartas)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {teamBCards.map((c, i) => (
                        <div key={i} className="relative">
                          <Card card={c} isShadow={c.isShadow} isRevealed={true} compact />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 bg-slate-950 text-rose-300 text-[7px] font-bold px-0.5 rounded">
                              {c.playedBy}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cartas del Equipo Aliado A */}
                  <div>
                    <span className="text-[10px] text-emerald-400/80 font-semibold block mb-1">
                      {is1v1 ? 'Tus Fuerzas' : 'Equipo A (Aliados)'} ({teamACards.length} cartas)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {teamACards.map((c, i) => (
                        <div key={i} className="relative">
                          <Card card={c} isShadow={c.isShadow} isRevealed={true} compact />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 bg-slate-950 text-emerald-300 text-[7px] font-bold px-0.5 rounded">
                              {c.playedBy}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suma de puntos acumulados */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-200 block">Puntos Numéricos Sumados al Acumulado:</span>
              <span className="text-slate-400">Puntos de todos los frentes para resolver posibles desempates globales</span>
            </div>
            <div className="text-right font-mono font-bold text-sm">
              <span className="text-emerald-400">+{roundPointsTeamA} pts</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-rose-400">+{roundPointsTeamB} pts</span>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onNextRound}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition"
          >
            <span>{isFinalRound ? 'Ver Resultados Finales' : `Comenzar Ronda ${round + 1}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
