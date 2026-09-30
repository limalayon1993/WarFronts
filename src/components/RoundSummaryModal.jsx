import React from 'react';
import { FRONTS, resolveFrontWinner, calculateFrontScore, getLocalizedFronts } from '../constants/rules';
import { Card } from './Card';
import { ArrowRight, Award, Clock, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function RoundSummaryModal({
  isOpen,
  round,
  totalRounds,
  fronts,
  trumpSuit,
  modeId = '1v1',
  onNextRound,
  isMultiplayer = false,
  readyPlayers = [],
  mySlotId = 'A1',
  players = [],
  countdown = 60,
  onToggleReady,
  flagFallTeam = null,
}) {
  const { language, isEn, ui } = useLanguage();
  if (!isOpen || !fronts || !fronts.left || !fronts.center || !fronts.right) return null;

  const is1v1 = modeId === '1v1';
  const humanPlayers = players.filter(p => Boolean(p.isHuman && !p.isBot));
  const isMeReady = readyPlayers.includes(mySlotId);
  const readyHumansCount = humanPlayers.filter(p => readyPlayers.includes(p.id)).length;
  const totalHumansCount = humanPlayers.length > 0 ? humanPlayers.length : 1;
  const localizedFronts = getLocalizedFronts(language);

  // Resolver cada frente
  const frontResults = FRONTS.map((front, idx) => {
    const teamACards = fronts[front.id].teamA;
    const teamBCards = fronts[front.id].teamB;
    const teamAScore = calculateFrontScore(teamACards, trumpSuit, true);
    const teamBScore = calculateFrontScore(teamBCards, trumpSuit, true);
    const resolution = resolveFrontWinner(teamACards, teamBCards, trumpSuit, language);
    const localizedFront = localizedFronts[idx] || front;

    return {
      front: localizedFront,
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
  if (flagFallTeam) {
    // Si la ronda acabó por Caída de Bandera (00:00), el ganador es DIRECTAMENTE el rival del equipo infractor
    roundOutcome = flagFallTeam === 'teamA' ? 'teamB' : 'teamA';
  } else if (teamAFrontWins >= 2) {
    roundOutcome = 'teamA';
  } else if (teamBFrontWins >= 2) {
    roundOutcome = 'teamB';
  }

  const roundPointsTeamA = frontResults.reduce((acc, r) => acc + r.teamAScore.total, 0);
  const roundPointsTeamB = frontResults.reduce((acc, r) => acc + r.teamBScore.total, 0);

  const isFinalRound = round >= totalRounds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#07090e] border border-amber-500/30 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Cabecera del resultado */}
        <div className={`px-6 py-5 border-b border-amber-500/20 text-center ${
          roundOutcome === 'teamA'
            ? 'bg-gradient-to-r from-emerald-950/60 via-[#0e141f] to-emerald-950/60'
            : roundOutcome === 'teamB'
            ? 'bg-gradient-to-r from-rose-950/60 via-[#0e141f] to-rose-950/60'
            : 'bg-gradient-to-r from-amber-950/60 via-[#0e141f] to-amber-950/60'
        }`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-widest mb-2 border ${
            flagFallTeam
              ? (roundOutcome === 'teamA'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40')
              : (roundOutcome === 'teamA'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : roundOutcome === 'teamB'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40')
          }`}>
            {flagFallTeam ? (
              <>
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                {ui.summary.flagFallTitle}
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-amber-400" />
                {ui.summary.resolutionTitle(round)}
              </>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gold-gradient uppercase tracking-wide">
            {flagFallTeam ? (
              roundOutcome === 'teamA'
                ? (is1v1 ? (isEn ? 'You Won the Round on Time!' : '¡Has Ganado la Ronda por Tiempo!') : (isEn ? 'Round Victory for Allied Team (A)!' : '¡Victoria de Ronda para el Equipo Aliado (A)!'))
                : (is1v1 ? (isEn ? 'Loss on Time: Your Clock Ran Out' : 'Derrota por Tiempo: Se Agotó tu Reloj') : (isEn ? 'Round Victory for Rival Team (B)' : 'Victoria de Ronda para el Equipo Rival (B)'))
            ) : (
              <>
                {roundOutcome === 'teamA' && (is1v1 ? ui.summary.victoryYou : ui.summary.victoryTeamA)}
                {roundOutcome === 'teamB' && (is1v1 ? ui.summary.victoryRival : ui.summary.victoryTeamB)}
                {roundOutcome === 'tie' && ui.summary.roundTied}
              </>
            )}
          </h2>

          {flagFallTeam ? (
            <div className="mt-2 text-xs sm:text-sm text-slate-300">
              <p>
                {flagFallTeam === 'teamA' ? (
                  <span>
                    {isEn ? (
                      <>Team clock for <strong className="text-rose-400">{is1v1 ? 'You' : 'Allied Team (A)'}</strong> ran out at <strong>00:00</strong>. The rival automatically receives <strong className="text-amber-400 font-bold">+1 Round Point</strong>.</>
                    ) : (
                      <>El reloj de equipo del <strong className="text-rose-400">{is1v1 ? 'Tú' : 'Equipo Aliado (A)'}</strong> se agotó a <strong>00:00</strong>. El rival suma automáticamente <strong className="text-amber-400 font-bold">+1 Punto de Ronda</strong>.</>
                    )}
                  </span>
                ) : (
                  <span>
                    {isEn ? (
                      <>Team clock for <strong className="text-rose-400">{is1v1 ? 'Rival' : 'Rival Team (B)'}</strong> ran out at <strong>00:00</strong>. {is1v1 ? 'You' : 'Your team'} automatically receive <strong className="text-amber-400 font-bold">+1 Round Point</strong>!</>
                    ) : (
                      <>El reloj de equipo del <strong className="text-rose-400">{is1v1 ? 'Rival' : 'Equipo Rival (B)'}</strong> se agotó a <strong>00:00</strong>. ¡{is1v1 ? 'Ganas' : 'Tu equipo gana'} automáticamente <strong className="text-amber-400 font-bold">+1 Punto de Ronda</strong>!</>
                    )}
                  </span>
                )}
              </p>
              <div className="mt-2.5 mx-auto max-w-xl px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] sm:text-xs text-amber-200 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Score Conservation (Chapter 5):' : 'Conservación de Puntos (Capítulo 5):'}</strong> {isEn ? 'Points of all cards deployed on fronts up to flag fall are tallied and preserved for cumulative score.' : 'Se computan y conservan al acumulado los puntos numéricos de todas las tropas colocadas en los frentes hasta el instante de la caída.'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {ui.summary.frontsWonLabel} <strong className="text-emerald-400">{teamAFrontWins}</strong> {is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A')} — <strong className="text-rose-400">{teamBFrontWins}</strong> {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')}
              {roundOutcome === 'teamA' && (isEn ? ' (+1 Round Point)' : ' (+1 Punto de Ronda)')}
              {roundOutcome === 'teamB' && (isEn ? ' (+1 Round Point)' : ' (+1 Punto de Ronda)')}
            </p>
          )}

          {/* Temporizador de 1 minuto e información de preparación */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 border border-slate-700 text-slate-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isEn ? 'Next round in:' : 'Siguiente ronda en:'}</span>
              <span className="font-mono font-bold text-amber-400">{countdown}s</span>
            </div>
            {isMultiplayer && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                readyHumansCount >= totalHumansCount
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                <Users className="w-3.5 h-3.5" />
                <span>{isEn ? 'Commanders ready:' : 'Comandantes listos:'} <strong>{readyHumansCount}/{totalHumansCount}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Desglose de los 3 Frentes con sombras reveladas */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {frontResults.map(({ front, teamACards, teamBCards, teamAScore, teamBScore, winner, reason }) => (
              <div
                key={front.id}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  flagFallTeam
                    ? 'bg-slate-950/60 border-slate-700/80'
                    : winner === 'teamA'
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
                      flagFallTeam
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : winner === 'teamA' ? 'bg-emerald-500/20 text-emerald-400' :
                        winner === 'teamB' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {flagFallTeam
                        ? (isEn ? 'Saved Points' : 'Puntos Salvados')
                        : winner === 'teamA' ? (is1v1 ? (isEn ? 'Won' : 'Ganado') : (isEn ? 'Team A' : 'Equipo A')) : winner === 'teamB' ? (is1v1 ? (isEn ? 'Lost' : 'Perdido') : (isEn ? 'Team B' : 'Equipo B')) : (isEn ? 'Tie' : 'Nulo')}
                    </span>
                  </div>

                  {/* Comparación numérica */}
                  <div className="my-3 text-center">
                    <div className="text-xl font-black font-mono">
                      <span className="text-emerald-400">{teamAScore.total}</span>
                      <span className="text-slate-600 text-sm mx-2">vs</span>
                      <span className="text-rose-400">{teamBScore.total}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {flagFallTeam ? (isEn ? 'Points from cards played before flag fall' : 'Puntos de cartas jugadas hasta la caída de bandera') : reason}
                    </div>
                  </div>

                  {/* Cartas del Equipo Rival B */}
                  <div className="mb-2">
                    <span className="text-[10px] text-rose-400/80 font-semibold block mb-1">
                      {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')} ({teamBCards.length} {teamBCards.length === 1 ? ui.common.card : ui.common.cards})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {teamBCards.map((c, i) => (
                        <div key={i} className="relative">
                          <Card card={c} isShadow={c.isShadow} isRevealed={true} compact />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 z-30 bg-slate-950 text-rose-300 text-[8px] font-bold px-1 py-0.2 rounded shadow-md border border-rose-900/50">
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
                      {is1v1 ? (isEn ? 'Your Forces' : 'Tus Fuerzas') : (isEn ? 'Team A (Allies)' : 'Equipo A (Aliados)')} ({teamACards.length} {teamACards.length === 1 ? ui.common.card : ui.common.cards})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {teamACards.map((c, i) => (
                        <div key={i} className="relative">
                          <Card card={c} isShadow={c.isShadow} isRevealed={true} compact />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 z-30 bg-slate-950 text-emerald-300 text-[8px] font-bold px-1 py-0.2 rounded shadow-md border border-emerald-900/50">
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
              <span className="font-bold text-slate-200 block">{ui.summary.cumulativeTitle}</span>
              <span className="text-slate-400">
                {flagFallTeam
                  ? (isEn ? 'Official conservation: Cumulative points from cards on table until flag fall' : 'Conservación oficial: Puntos numéricos de las cartas colocadas en mesa hasta la caída de bandera')
                  : ui.summary.cumulativeDesc}
              </span>
            </div>
            <div className="text-right font-mono font-bold text-sm">
              <span className="text-emerald-400">+{roundPointsTeamA} {ui.common.pts}</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-rose-400">+{roundPointsTeamB} {ui.common.pts}</span>
            </div>
          </div>
        </div>

        {/* Barra inferior de estado y acción */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Estado de preparación de los jugadores */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {isMultiplayer ? (
              <>
                <span className="text-slate-400 font-medium">{isEn ? 'Commanders:' : 'Comandantes:'}</span>
                {humanPlayers.map(p => {
                  const ready = readyPlayers.includes(p.id);
                  const isMe = p.id === mySlotId;
                  return (
                    <div
                      key={p.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                        ready
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-700/80 text-slate-400'
                      }`}
                    >
                      {ready ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400/70" />
                      )}
                      <span>{p.name} {isMe && (isEn ? '(You)' : '(Tú)')}</span>
                      <span className={`text-[10px] font-bold uppercase ${ready ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {ready ? (isEn ? 'Ready' : 'Listo') : (isEn ? 'Waiting' : 'Esperando')}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : (
              <span className="text-slate-400 text-xs">
                {isEn ? `Press to continue or wait ${countdown}s for auto-advance.` : `Pulsa para continuar o espera ${countdown}s para avance automático.`}
              </span>
            )}
          </div>

          {/* Botón de acción */}
          <div>
            {isMultiplayer ? (
              <button
                onClick={onToggleReady}
                className={`px-6 py-2.5 rounded-xl font-serif font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer ${
                  isMeReady
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 shadow-[0_4px_20px_rgba(212,175,55,0.35)]'
                }`}
              >
                {isMeReady ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isFinalRound ? (isEn ? 'Ready! Waiting for Results...' : '¡Listo! Esperando Resultados...') : (isEn ? 'Ready! Waiting for others...' : '¡Listo! Esperando a los demás...')}</span>
                  </>
                ) : (
                  <>
                    <span>{isFinalRound ? (isEn ? 'Ready for Final Results' : 'Listo para Resultados Finales') : (isEn ? `Next Round (Round ${round + 1})` : `Siguiente Ronda (Ronda ${round + 1})`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onNextRound}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition cursor-pointer"
              >
                <span>{isFinalRound ? ui.summary.viewGameOverBtn : (isEn ? `Start Round ${round + 1}` : `Comenzar Ronda ${round + 1}`)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
