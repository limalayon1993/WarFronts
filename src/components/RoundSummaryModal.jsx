import React from 'react';
import {
  FRONTS,
  resolveFrontWinner,
  calculateFrontScore,
  getLocalizedFronts,
  sortFrontCards,
  analyzeCardSynergies,
  calculateRoundEconomy,
  calculateRoundPoints,
} from '../constants/rules';
import { Card } from './Card';
import { ArrowRight, Award, Clock, CheckCircle2, Users, AlertTriangle, EyeOff, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function RoundSummaryModal({
  isOpen,
  round,
  totalRounds,
  fronts,
  modeId = '1v1',
  gameMode = 'competitive',
  onNextRound,
  isMultiplayer = false,
  readyPlayers = [],
  mySlotId = 'A1',
  players = [],
  countdown = 60,
  onToggleReady,
  flagFallTeam = null,
  lastRoundEconomy = null,
  teamAShadowsLeft = 0,
  teamBShadowsLeft = 0,
}) {
  const { language, isEn, ui } = useLanguage();
  if (!isOpen || !fronts || !fronts.left || !fronts.center || !fronts.right) return null;

  const is1v1 = modeId === '1v1';
  const isCasual = gameMode === 'casual';
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
    const { frontScore: teamAScore, cardSynergies: teamACardSynergies } = analyzeCardSynergies(teamACards, true, language, gameMode);
    const { frontScore: teamBScore, cardSynergies: teamBCardSynergies } = analyzeCardSynergies(teamBCards, true, language, gameMode);
    const resolution = resolveFrontWinner(teamACards, teamBCards, language, gameMode);
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

  const isFlagFallFullSweep = lastRoundEconomy?.winType === 'sweep' && Boolean(flagFallTeam);
  const roundScoring = calculateRoundPoints(teamAFrontWins, teamBFrontWins, flagFallTeam, isFlagFallFullSweep);
  const roundOutcome = lastRoundEconomy?.roundWinner || roundScoring.roundWinner || roundScoring.outcome || 'tie';
  const winType = lastRoundEconomy?.winType || roundScoring.winType;
  const teamAPtsEarned = lastRoundEconomy?.teamAPointsEarned ?? roundScoring.teamAPoints;
  const teamBPtsEarned = lastRoundEconomy?.teamBPointsEarned ?? roundScoring.teamBPoints;
  const winnerPtsEarned = roundOutcome === 'teamA' ? teamAPtsEarned : roundOutcome === 'teamB' ? teamBPtsEarned : 1;

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
                      <>Team clock for <strong className="text-rose-400">{is1v1 ? 'You' : 'Allied Team (A)'}</strong> ran out at <strong>00:00</strong>. The rival automatically receives <strong className="text-amber-400 font-bold">+{winnerPtsEarned} Round Points</strong>.</>
                    ) : (
                      <>El reloj de equipo del <strong className="text-rose-400">{is1v1 ? 'Tú' : 'Equipo Aliado (A)'}</strong> se agotó a <strong>00:00</strong>. El rival suma automáticamente <strong className="text-amber-400 font-bold">+{winnerPtsEarned} Puntos de Ronda</strong>.</>
                    )}
                  </span>
                ) : (
                  <span>
                    {isEn ? (
                      <>Team clock for <strong className="text-rose-400">{is1v1 ? 'Rival' : 'Rival Team (B)'}</strong> ran out at <strong>00:00</strong>. {is1v1 ? 'You' : 'Your team'} automatically receive <strong className="text-amber-400 font-bold">+{winnerPtsEarned} Round Points</strong>!</>
                    ) : (
                      <>El reloj de equipo del <strong className="text-rose-400">{is1v1 ? 'Rival' : 'Equipo Rival (B)'}</strong> se agotó a <strong>00:00</strong>. ¡{is1v1 ? 'Ganas' : 'Tu equipo gana'} automáticamente <strong className="text-amber-400 font-bold">+{winnerPtsEarned} Puntos de Ronda</strong>!</>
                    )}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {ui.summary.frontsWonLabel} <strong className="text-emerald-400">{teamAFrontWins}</strong> {is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A')} — <strong className="text-rose-400">{teamBFrontWins}</strong> {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')}
              <span className="mx-2 text-slate-600">•</span>
              {roundOutcome === 'tie' ? (
                <strong className="text-amber-300">
                  {isEn ? '+1 Round Point for EACH team (Tie)' : '+1 Punto de Ronda para CADA equipo (Empate)'}
                </strong>
              ) : winType === 'sweep' ? (
                <strong className="text-amber-300">
                  {isEn ? '🔥 3-Front Sweep! (+3 Round Points)' : '🔥 ¡Pleno de 3 Frentes! (+3 Puntos de Ronda)'}
                </strong>
              ) : (
                <strong className="text-emerald-300">
                  {isEn ? `+${winnerPtsEarned} Round Points (Standard Victory)` : `+${winnerPtsEarned} Puntos de Ronda (Victoria Estándar)`}
                </strong>
              )}
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
                    ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30'
                    : winner === 'teamA'
                    ? 'border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/30'
                    : winner === 'teamB'
                    ? 'border-rose-500/70 shadow-[0_0_25px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/30'
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
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : winner === 'teamA'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : winner === 'teamB'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {flagFallTeam
                          ? (isEn ? 'Saved Points' : 'Puntos Salvados')
                          : winner === 'teamA' ? (is1v1 ? (isEn ? 'Won' : 'Ganado') : (isEn ? 'Team A' : 'Equipo A')) : winner === 'teamB' ? (is1v1 ? (isEn ? 'Lost' : 'Perdido') : (isEn ? 'Team B' : 'Equipo B')) : (isEn ? 'Tie' : 'Nulo')}
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
                                <Card card={c} isShadow={c.isShadow} isRevealed={true} compact synergy={teamBCardSynergies?.[c.id]} gameMode={gameMode} />
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

                      {/* Desglose de puntuación Rival B (Escala Táctica Unificada v2.1) */}
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-amber-700/25 text-[9px] font-mono">
                        <span className="bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800" title={isEn ? "Base Points (1–4 scale)" : "Puntos Base (escala 1–4)"}>
                          Base: {teamBScore.baseTotal}
                        </span>
                        {teamBScore.suitSynergyTotal > 0 && (
                          <span className="bg-indigo-950/90 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/60" title={isEn ? "Suit Synergy (+1 pt per additional card of same suit)" : "Sinergia de Palo (+1 pt por cada carta adicional del mismo palo)"}>
                            {isEn ? 'Suit' : 'Palo'} +{teamBScore.suitSynergyTotal}
                          </span>
                        )}
                        {teamBScore.pairTotal > 0 && (
                          <span className="bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/60" title={isEn ? "Pair (+2 pts)" : "Pareja (+2 pts)"}>
                            {isEn ? 'Pair' : 'Pareja'} +{teamBScore.pairTotal}
                          </span>
                        )}
                        {teamBScore.straightTotal > 0 && (
                          <span className="bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/60" title={isEn ? "Short Straight (+4 pts)" : "Escalera Corta (+4 pts)"}>
                            {isEn ? 'Straight' : 'Escalera'} +{teamBScore.straightTotal}
                          </span>
                        )}
                        {teamBScore.trioTotal > 0 && (
                          <span className="bg-rose-950/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/60" title={isEn ? "Trio (+5 pts; cancels Pair)" : "Trío (+5 pts; anula Pareja)"}>
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
                                <Card card={c} isShadow={c.isShadow} isRevealed={true} compact synergy={teamACardSynergies?.[c.id]} gameMode={gameMode} />
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

                      {/* Desglose de puntuación Aliado A (Escala Táctica Unificada v2.1) */}
                      <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-sky-700/25 text-[9px] font-mono">
                        <span className="bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800" title={isEn ? "Base Points (1–4 scale)" : "Puntos Base (escala 1–4)"}>
                          Base: {teamAScore.baseTotal}
                        </span>
                        {teamAScore.suitSynergyTotal > 0 && (
                          <span className="bg-indigo-950/90 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/60" title={isEn ? "Suit Synergy (+1 pt per additional card of same suit)" : "Sinergia de Palo (+1 pt por cada carta adicional del mismo palo)"}>
                            {isEn ? 'Suit' : 'Palo'} +{teamAScore.suitSynergyTotal}
                          </span>
                        )}
                        {teamAScore.pairTotal > 0 && (
                          <span className="bg-amber-950/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/60" title={isEn ? "Pair (+2 pts)" : "Pareja (+2 pts)"}>
                            {isEn ? 'Pair' : 'Pareja'} +{teamAScore.pairTotal}
                          </span>
                        )}
                        {teamAScore.straightTotal > 0 && (
                          <span className="bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/60" title={isEn ? "Short Straight (+4 pts)" : "Escalera Corta (+4 pts)"}>
                            {isEn ? 'Straight' : 'Escalera'} +{teamAScore.straightTotal}
                          </span>
                        )}
                        {teamAScore.trioTotal > 0 && (
                          <span className="bg-rose-950/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/60" title={isEn ? "Trio (+5 pts; cancels Pair)" : "Trío (+5 pts; anula Pareja)"}>
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

          {/* 3. Asignación de Puntos de Ronda (Escala 1 / 2 / 3 Puntos) */}
          <div className="bg-slate-950/90 border border-amber-500/30 p-3.5 rounded-2xl text-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-serif font-black text-amber-300 uppercase tracking-wide">
                {isEn ? '3. Round Points Allocation (1, 2 & 3 Points Scale)' : '3. Asignación de Puntos de Ronda (Escala 1, 2 y 3 Puntos)'}
              </span>
              <span className="font-mono font-bold text-xs">
                <span className="text-sky-400">+{teamAPtsEarned} {isEn ? 'Round Pts' : 'Pts Ronda'} ({is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A')})</span>
                <span className="text-slate-600 mx-2">•</span>
                <span className="text-amber-400">+{teamBPtsEarned} {isEn ? 'Round Pts' : 'Pts Ronda'} ({is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')})</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className={`p-2 rounded-xl border transition ${
                roundOutcome === 'tie'
                  ? 'bg-sky-950/60 border-sky-400/70 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">{isEn ? 'Tie in Fronts' : 'Empate en Frentes'}</div>
                <div className="text-sm font-black font-mono text-sky-300 mt-0.5">{isEn ? '+1 Point EACH' : '+1 Punto C/U'}</div>
              </div>
              <div className={`p-2 rounded-xl border transition ${
                roundOutcome !== 'tie' && winnerPtsEarned === 2
                  ? 'bg-emerald-950/60 border-emerald-400/70 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">{isEn ? 'Standard Win (2 Fronts)' : 'Victoria Estándar (2 Frentes)'}</div>
                <div className="text-sm font-black font-mono text-emerald-300 mt-0.5">{isEn ? '+2 Points Winner' : '+2 Puntos Ganador'}</div>
              </div>
              <div className={`p-2 rounded-xl border transition ${
                roundOutcome !== 'tie' && winnerPtsEarned === 3
                  ? 'bg-amber-950/60 border-amber-400/70 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">{isEn ? 'Full Sweep (All 3 Fronts)' : 'Dominio Total / Pleno (3 Frentes)'}</div>
                <div className="text-sm font-black font-mono text-amber-300 mt-0.5">{isEn ? '+3 Points Winner' : '+3 Puntos Ganador'}</div>
              </div>
            </div>
          </div>

          {/*En Modo Casual se oculta el bloque de puntos acumulados y la economía compartida, mostrando la nota de reglas Casual */}
          {isCasual ? (
            <div className="bg-emerald-950/30 border border-emerald-500/35 p-4 rounded-2xl flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-black text-emerald-300 uppercase tracking-wide block mb-0.5">
                  {ui.summary.casualSummaryNoteTitle}
                </span>
                <span className="text-slate-300 leading-relaxed">
                  {ui.summary.casualSummaryNoteDesc}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* 4. Ingresos de Economía (Sombras) — Capítulo 5 y Guía Rápida v2.1 */}
              {(() => {
                const effectiveEcon = lastRoundEconomy || calculateRoundEconomy(modeId, roundOutcome, 0, 0);
                const teamAEarned = effectiveEcon.teamAEarned ?? 1;
                const teamBEarned = effectiveEcon.teamBEarned ?? 1;
                const teamAReason = effectiveEcon.teamAReason ?? 'win';
                const teamBReason = effectiveEcon.teamBReason ?? 'loss';
                const teamAPrev = effectiveEcon.teamAPrevBank ?? teamAShadowsLeft;
                const teamBPrev = effectiveEcon.teamBPrevBank ?? teamBShadowsLeft;
                const teamATotal = effectiveEcon.teamATotalBank ?? teamAShadowsLeft;
                const teamBTotal = effectiveEcon.teamBTotalBank ?? teamBShadowsLeft;

                function getReasonBadge(reason, earned) {
                  if (reason === 'win') {
                    return (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{isEn ? `Victory (+${earned})` : `Victoria (+${earned})`}</span>
                      </span>
                    );
                  }
                  if (reason === 'streak') {
                    return (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>{isEn ? `Loss Streak 2+ (+${earned})` : `Racha de Derrotas 2+ (+${earned})`}</span>
                      </span>
                    );
                  }
                  if (reason === 'loss') {
                    return (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span>{isEn ? `Defeat (+${earned})` : `Derrota (+${earned})`}</span>
                      </span>
                    );
                  }
                  return (
                    <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>{isEn ? `Tied Round (+${earned})` : `Empate de Ronda (+${earned})`}</span>
                    </span>
                  );
                }

                return (
                  <div className="bg-[#100d1c] border border-purple-500/35 rounded-2xl p-4 shadow-xl text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                          <EyeOff className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-serif font-black text-purple-200 text-xs sm:text-sm tracking-wide block uppercase">
                            {isEn ? '4. Shadow Economy & Team Pool (Official Rules v2.1)' : '4. Economía de Sombras y Fondo de Equipo (Reglamento v2.1)'}
                          </span>
                          <span className="text-[11px] text-purple-300/70">
                            {isEn
                              ? 'Unspent markers are preserved in the Team Pool (1st Match Tiebreaker: Shadow Efficiency). Streaks reset on win or tie.'
                              : 'Los marcadores sin gastar se conservan en el Fondo de Equipo (1.er Criterio de Desempate: Eficiencia de Sombras). La racha se reinicia al ganar o empatar.'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-purple-950/80 border border-purple-700/60 px-2.5 py-1 rounded-full text-purple-300">
                        {isEn ? 'Format Economy:' : 'Economía Formato:'} {modeId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Bando A (Aliados / Tú) */}
                      <div className="bg-[#0b1320] border border-sky-600/35 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sky-300 text-xs">
                            {is1v1 ? (isEn ? 'Your Reserve' : 'Tu Fondo') : (isEn ? 'Team A Reserve' : 'Fondo Equipo A')}
                          </span>
                          {getReasonBadge(teamAReason, teamAEarned)}
                        </div>
                        <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                          <span>
                            {isFinalRound
                              ? (isEn ? 'Unspent at match end:' : 'Sin gastar al cierre:')
                              : (isEn ? 'Income this round:' : 'Ingreso esta ronda:')}{' '}
                            <strong className="text-purple-300 font-bold">
                              {isFinalRound ? `${teamAPrev} 🌑` : `+${teamAEarned} 🌑`}
                            </strong>
                          </span>
                          <span>
                            {isFinalRound ? (isEn ? 'If Overtime:' : 'Si hay Prórroga:') : (isEn ? 'Next Round Bank:' : 'Fondo Siguiente Ronda:')}{' '}
                            <strong className="text-emerald-400 font-bold text-xs">{teamATotal} 🌑</strong>
                          </span>
                        </div>
                      </div>

                      {/* Bando B (Rival) */}
                      <div className="bg-[#16120c] border border-amber-600/35 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-amber-300 text-xs">
                            {is1v1 ? (isEn ? 'Rival Reserve' : 'Fondo Rival') : (isEn ? 'Team B Reserve' : 'Fondo Equipo B')}
                          </span>
                          {getReasonBadge(teamBReason, teamBEarned)}
                        </div>
                        <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                          <span>
                            {isFinalRound
                              ? (isEn ? 'Unspent at match end:' : 'Sin gastar al cierre:')
                              : (isEn ? 'Income this round:' : 'Ingreso esta ronda:')}{' '}
                            <strong className="text-purple-300 font-bold">
                              {isFinalRound ? `${teamBPrev} 🌑` : `+${teamBEarned} 🌑`}
                            </strong>
                          </span>
                          <span>
                            {isFinalRound ? (isEn ? 'If Overtime:' : 'Si hay Prórroga:') : (isEn ? 'Next Round Bank:' : 'Fondo Siguiente Ronda:')}{' '}
                            <strong className="text-amber-400 font-bold text-xs">{teamBTotal} 🌑</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
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
