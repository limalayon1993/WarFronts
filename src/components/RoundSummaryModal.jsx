import React from 'react';
import {
  FRONTS,
  resolveFrontWinner,
  calculateFrontScore,
  getLocalizedFronts,
  sortFrontCards,
  analyzeCardSynergies,
} from '../constants/rules';
import { Card } from './Card';
import { ArrowRight, Award, Clock, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function RoundSummaryModal({
  isOpen,
  round,
  totalRounds,
  fronts,
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
    const sortedTeamACards = sortFrontCards(teamACards, true);
    const sortedTeamBCards = sortFrontCards(teamBCards, true);
    const { frontScore: teamAScore, cardSynergies: teamACardSynergies } = analyzeCardSynergies(teamACards, true, language);
    const { frontScore: teamBScore, cardSynergies: teamBCardSynergies } = analyzeCardSynergies(teamBCards, true, language);
    const resolution = resolveFrontWinner(teamACards, teamBCards, language);
    const localizedFront = localizedFronts[idx] || front;

    return {
      front: localizedFront,
      teamACards: sortedTeamACards,
      teamBCards: sortedTeamBCards,
      teamAScore,
      teamBScore,
      teamACardSynergies,
      teamBCardSynergies,
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
      <div className="bg-[#07090e] border border-amber-500/30 w-full max-w-4xl lg:max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {frontResults.map(({ front, teamACards, teamBCards, teamAScore, teamBScore, teamACardSynergies, teamBCardSynergies, winner, reason }) => (
              <div
                key={front.id}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all bg-[#080b12] shadow-xl ${
                  flagFallTeam
                    ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                    : winner === 'teamA'
                    ? 'border-sky-500/40 shadow-sky-950/20 ring-1 ring-sky-500/20'
                    : winner === 'teamB'
                    ? 'border-amber-500/40 shadow-amber-950/20 ring-1 ring-amber-500/20'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Información General del Frente (Fuera de los recuadros de equipo) */}
                  <div className="pb-2.5 mb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-100">{front.name}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        flagFallTeam
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : winner === 'teamA' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                          winner === 'teamB' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {flagFallTeam
                          ? (isEn ? 'Saved Points' : 'Puntos Salvados')
                          : winner === 'teamA' ? (is1v1 ? (isEn ? 'Victory (You)' : 'Victoria (Tú)') : (isEn ? 'Team A' : 'Equipo A')) : winner === 'teamB' ? (is1v1 ? (isEn ? 'Rival Won' : 'Victoria Rival') : (isEn ? 'Team B' : 'Equipo B')) : (isEn ? 'Tie' : 'Nulo')}
                      </span>
                    </div>

                    {/* Comparación General del Frente */}
                    <div className="text-center py-1.5 px-2 bg-black/60 rounded-xl border border-slate-800">
                      <div className="text-xl font-black font-mono flex items-center justify-center gap-2">
                        <span className="text-sky-400">{teamAScore.total}</span>
                        <span className="text-slate-500 text-xs uppercase font-serif">vs</span>
                        <span className="text-amber-400">{teamBScore.total}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {flagFallTeam ? (isEn ? 'Points from cards played before flag fall' : 'Puntos de cartas jugadas hasta la caída de bandera') : reason}
                      </div>
                    </div>
                  </div>

                  {/* Dos Recuadros de Equipos Separados y Opacos */}
                  <div className="space-y-2.5">
                    {/* Recuadro 1: Equipo Rival B (Ámbar / Bronce Opaco) */}
                    <div className="bg-[#16120c] border border-amber-700/40 rounded-xl p-2.5 shadow-md flex flex-col justify-between">
                      <div>
                        {/* Cabecera del Equipo B con Puntuación Propia */}
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-700/30">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-amber-300 font-bold">
                              {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')}
                            </span>
                            <span className="text-[10px] text-amber-400/60 font-mono">
                              ({teamBCards.length} {teamBCards.length === 1 ? ui.common.card : ui.common.cards})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-950/90 border border-amber-600/60 px-2 py-0.5 rounded-lg shadow-inner">
                            <span className="text-[9px] uppercase font-bold text-amber-400/80 font-serif">Pts:</span>
                            <span className="text-xs font-black font-mono text-amber-200">{teamBScore.total}</span>
                          </div>
                        </div>

                        {/* Cartas del Equipo Rival B */}
                        <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 py-1 min-h-[68px] items-center">
                          {teamBCards.length === 0 ? (
                            <span className="text-[11px] text-slate-600 italic m-auto">
                              {isEn ? 'No enemy troops' : 'Sin tropas rivales'}
                            </span>
                          ) : (
                            teamBCards.map((c, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <Card card={c} isShadow={c.isShadow} isRevealed={true} compact synergy={teamBCardSynergies?.[c.id]} />
                                {c.playedBy && (
                                  <span className="mt-1 bg-slate-950 text-amber-300 text-[8px] font-bold px-1.5 py-0.2 rounded shadow border border-amber-700/50 whitespace-nowrap max-w-[56px] truncate text-center">
                                    {c.playedBy}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Desglose de puntuación Rival B */}
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-amber-700/25 text-[9px] font-mono">
                        <span className="bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                          Base: {teamBScore.baseTotal}
                        </span>
                        {teamBScore.suitSynergyTotal > 0 && (
                          <span className="bg-indigo-950/90 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/60" title={isEn ? "Suit Synergy (+5 each)" : "Sinergia de Palo (+5 c/u)"}>
                            {isEn ? 'Suit' : 'Palo'} +{teamBScore.suitSynergyTotal}
                          </span>
                        )}
                        {teamBScore.pairTotal > 0 && (
                          <span className="bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/60" title={isEn ? "Pair (+10)" : "Pareja (+10)"}>
                            {isEn ? 'Pair' : 'Pareja'} +{teamBScore.pairTotal}
                          </span>
                        )}
                        {teamBScore.straightTotal > 0 && (
                          <span className="bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/60" title={isEn ? "Short Straight (+15)" : "Escalera Corta (+15)"}>
                            {isEn ? 'Straight' : 'Escalera'} +{teamBScore.straightTotal}
                          </span>
                        )}
                        {teamBScore.trioTotal > 0 && (
                          <span className="bg-rose-950/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/60" title={isEn ? "Trio (+20)" : "Trío (+20)"}>
                            {isEn ? 'Trio' : 'Trío'} +{teamBScore.trioTotal}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Recuadro 2: Equipo Aliado A (Azul Zafiro Opaco) */}
                    <div className="bg-[#0b1320] border border-sky-700/40 rounded-xl p-2.5 shadow-md flex flex-col justify-between">
                      <div>
                        {/* Cabecera del Equipo A con Puntuación Propia */}
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-sky-700/30">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-sky-300 font-bold">
                              {is1v1 ? (isEn ? 'Your Forces' : 'Tus Fuerzas') : (isEn ? 'Team A (Allies)' : 'Equipo A (Aliados)')}
                            </span>
                            <span className="text-[10px] text-sky-400/60 font-mono">
                              ({teamACards.length} {teamACards.length === 1 ? ui.common.card : ui.common.cards})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-sky-950/90 border border-sky-600/60 px-2 py-0.5 rounded-lg shadow-inner">
                            <span className="text-[9px] uppercase font-bold text-sky-400/80 font-serif">Pts:</span>
                            <span className="text-xs font-black font-mono text-sky-200">{teamAScore.total}</span>
                          </div>
                        </div>

                        {/* Cartas del Equipo Aliado A */}
                        <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 py-1 min-h-[68px] items-center">
                          {teamACards.length === 0 ? (
                            <span className="text-[11px] text-slate-600 italic m-auto">
                              {isEn ? 'No allied troops' : 'Sin tropas aliadas'}
                            </span>
                          ) : (
                            teamACards.map((c, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <Card card={c} isShadow={c.isShadow} isRevealed={true} compact synergy={teamACardSynergies?.[c.id]} />
                                {c.playedBy && (
                                  <span className="mt-1 bg-slate-950 text-sky-300 text-[8px] font-bold px-1.5 py-0.2 rounded shadow border border-sky-700/50 whitespace-nowrap max-w-[56px] truncate text-center">
                                    {c.playedBy}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Desglose de puntuación Aliado A */}
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-sky-700/25 text-[9px] font-mono">
                        <span className="bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                          Base: {teamAScore.baseTotal}
                        </span>
                        {teamAScore.suitSynergyTotal > 0 && (
                          <span className="bg-indigo-950/90 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/60" title={isEn ? "Suit Synergy (+5 each)" : "Sinergia de Palo (+5 c/u)"}>
                            {isEn ? 'Suit' : 'Palo'} +{teamAScore.suitSynergyTotal}
                          </span>
                        )}
                        {teamAScore.pairTotal > 0 && (
                          <span className="bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/60" title={isEn ? "Pair (+10)" : "Pareja (+10)"}>
                            {isEn ? 'Pair' : 'Pareja'} +{teamAScore.pairTotal}
                          </span>
                        )}
                        {teamAScore.straightTotal > 0 && (
                          <span className="bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/60" title={isEn ? "Short Straight (+15)" : "Escalera Corta (+15)"}>
                            {isEn ? 'Straight' : 'Escalera'} +{teamAScore.straightTotal}
                          </span>
                        )}
                        {teamAScore.trioTotal > 0 && (
                          <span className="bg-rose-950/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/60" title={isEn ? "Trio (+20)" : "Trío (+20)"}>
                            {isEn ? 'Trio' : 'Trío'} +{teamAScore.trioTotal}
                          </span>
                        )}
                      </div>
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
              <span className="text-sky-400">+{roundPointsTeamA} {ui.common.pts}</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-amber-400">+{roundPointsTeamB} {ui.common.pts}</span>
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
