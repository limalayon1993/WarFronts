import React from 'react';
import { Trophy, Award, RefreshCw, Home, Swords, Flame, Sparkles, Clock, EyeOff, Scale, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function GameOverModal({
  isOpen,
  teamARoundPoints,
  teamBRoundPoints,
  teamAShadowsLeft = 0,
  teamBShadowsLeft = 0,
  isOvertimeMatch = false,
  roundHistory = [],
  modeId = '2v2',
  gameMode = 'competitive',
  onRestart,
  onBackToMenu,
  onPlayOvertime,
}) {
  const { isEn, ui } = useLanguage();
  const is1v1 = modeId === '1v1';
  const isCasual = gameMode === 'casual';

  if (!isOpen) return null;

  const teamALabel = is1v1 ? (isEn ? 'You (Duelist A)' : 'Tú (Duelista A)') : (isEn ? 'Allied Team (A)' : 'Equipo Aliado (A)');
  const teamBLabel = is1v1 ? (isEn ? 'Rival (Duelist B)' : 'Rival (Duelista B)') : (isEn ? 'Rival Team (B)' : 'Equipo Rival (B)');
  const teamAShort = is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A');
  const teamBShort = is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B');

  // Cálculo de métricas agregadas v2.1 a partir de roundHistory
  const stats = roundHistory.reduce(
    (acc, item) => {
      acc.teamABase += item.teamABasePts ?? 0;
      acc.teamBBase += item.teamBBasePts ?? 0;
      acc.teamASynergy += item.teamASynergyPts ?? 0;
      acc.teamBSynergy += item.teamBSynergyPts ?? 0;
      acc.teamASuit += item.teamASuitPts ?? 0;
      acc.teamBSuit += item.teamBSuitPts ?? 0;
      acc.teamAPair += item.teamAPairPts ?? 0;
      acc.teamBPair += item.teamBPairPts ?? 0;
      acc.teamAStraight += item.teamAStraightPts ?? 0;
      acc.teamBStraight += item.teamBStraightPts ?? 0;
      acc.teamATrio += item.teamATrioPts ?? 0;
      acc.teamBTrio += item.teamBTrioPts ?? 0;
      acc.teamANominalTieWins += item.teamANominalTieWins ?? 0;
      acc.teamBNominalTieWins += item.teamBNominalTieWins ?? 0;
      acc.teamAShadowsGenerated += item.teamAShadowsEarned ?? 0;
      acc.teamBShadowsGenerated += item.teamBShadowsEarned ?? 0;
      acc.teamAShadowsSpent += item.teamAShadowsSpent ?? 0;
      acc.teamBShadowsSpent += item.teamBShadowsSpent ?? 0;
      acc.teamAFrontsWon += item.teamAFrontWins ?? 0;
      acc.teamBFrontsWon += item.teamBFrontWins ?? 0;
      return acc;
    },
    {
      teamABase: 0,
      teamBBase: 0,
      teamASynergy: 0,
      teamBSynergy: 0,
      teamASuit: 0,
      teamBSuit: 0,
      teamAPair: 0,
      teamBPair: 0,
      teamAStraight: 0,
      teamBStraight: 0,
      teamATrio: 0,
      teamBTrio: 0,
      teamANominalTieWins: 0,
      teamBNominalTieWins: 0,
      teamAShadowsGenerated: 0,
      teamBShadowsGenerated: 0,
      teamAShadowsSpent: 0,
      teamBShadowsSpent: 0,
      teamAFrontsWon: 0,
      teamBFrontsWon: 0,
    }
  );

  // Asegurar consistencia matemática: Generadas = Gastadas + Ahorradas (en caso de partidas iniciadas en versiones previas)
  const teamAShadowsSaved = isCasual ? 0 : (teamAShadowsLeft ?? 0);
  const teamBShadowsSaved = isCasual ? 0 : (teamBShadowsLeft ?? 0);
  const teamAShadowsGenTotal = isCasual
    ? 0
    : Math.max(stats.teamAShadowsGenerated, stats.teamAShadowsSpent + teamAShadowsSaved);
  const teamBShadowsGenTotal = isCasual
    ? 0
    : Math.max(stats.teamBShadowsGenerated, stats.teamBShadowsSpent + teamBShadowsSaved);

  // Criterios Oficiales de Victoria y Desempate v2.1 (Sección 7 y Anexo 9):
  // - Modo Competitivo (y 1v1 Competitivo):
  //   1º Puntos de Ronda totales.
  //   2º 1.er Criterio de Desempate (Eficiencia de Sombras): Más Marcadores de Sombra sin gastar en el Fondo de Equipo.
  //   3º 2.º Criterio de Desempate (Prórroga): Si también empatan en Marcadores de Sombra restantes, Prórroga de 2 Rondas.
  // - Modo Casual (Party):
  //   1º Puntos de Ronda totales.
  //   2º Desempate Directo: Prórroga de 2 Rondas.
  let winner = null;
  let winReason = '';
  let decidedByShadowTiebreaker = false;

  if (teamARoundPoints > teamBRoundPoints) {
    winner = 'teamA';
    winReason = isOvertimeMatch
      ? (isEn
          ? `Victory in Overtime by Round Points (${teamARoundPoints} to ${teamBRoundPoints})`
          : `Victoria en Prórroga por Puntos de Ronda (${teamARoundPoints} a ${teamBRoundPoints})`)
      : ui.gameOver.winByRounds(teamARoundPoints, teamBRoundPoints);
  } else if (teamBRoundPoints > teamARoundPoints) {
    winner = 'teamB';
    winReason = isOvertimeMatch
      ? (isEn
          ? `Victory in Overtime by Round Points (${teamBRoundPoints} to ${teamARoundPoints})`
          : `Victoria en Prórroga por Puntos de Ronda (${teamBRoundPoints} a ${teamARoundPoints})`)
      : ui.gameOver.winByRounds(teamBRoundPoints, teamARoundPoints);
  } else if (!isCasual) {
    // 1.er Criterio de Desempate en Modo Competitivo: Eficiencia de Sombras
    if (teamAShadowsSaved > teamBShadowsSaved) {
      winner = 'teamA';
      decidedByShadowTiebreaker = true;
      winReason = isEn
        ? `Victory by Shadow Efficiency (Remaining Shadow Markers in Pool: ${teamAShadowsSaved} vs ${teamBShadowsSaved})`
        : `Victoria por Eficiencia de Sombras (Marcadores de Sombra restantes en el Fondo: ${teamAShadowsSaved} vs ${teamBShadowsSaved})`;
    } else if (teamBShadowsSaved > teamAShadowsSaved) {
      winner = 'teamB';
      decidedByShadowTiebreaker = true;
      winReason = isEn
        ? `Victory by Shadow Efficiency (Remaining Shadow Markers in Pool: ${teamBShadowsSaved} vs ${teamAShadowsSaved})`
        : `Victoria por Eficiencia de Sombras (Marcadores de Sombra restantes en el Fondo: ${teamBShadowsSaved} vs ${teamAShadowsSaved})`;
    } else {
      winner = 'tie';
      winReason = isEn
        ? `Tie in Round Points (${teamARoundPoints}-${teamBRoundPoints}) and Shadow Reserve (${teamAShadowsSaved}-${teamBShadowsSaved}). Regulated 2-Round Overtime!`
        : `Empate en Puntos de Ronda (${teamARoundPoints}-${teamBRoundPoints}) y en Reserva de Sombras (${teamAShadowsSaved}-${teamBShadowsSaved}). ¡Prórroga reglamentaria de 2 rondas!`;
    }
  } else {
    // Modo Casual: Empate en Puntos de Ronda va directo a Prórroga de 2 rondas
    winner = 'tie';
    winReason = isEn
      ? `Tie in Round Points (${teamARoundPoints}-${teamBRoundPoints}). Direct 2-Round Overtime!`
      : `Empate en Puntos de Ronda (${teamARoundPoints}-${teamBRoundPoints}). ¡Prórroga directa de 2 rondas!`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">
        {/* Cabecera Principal de Victoria */}
        <div
          className={`p-5 sm:p-7 text-center border-b shrink-0 ${
            winner === 'teamA'
              ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-800/50'
              : winner === 'teamB'
              ? 'bg-gradient-to-b from-rose-950/90 to-slate-900 border-rose-800/50'
              : 'bg-gradient-to-b from-amber-950/90 to-slate-900 border-amber-800/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-slate-950/60 border border-slate-700 shadow-inner">
            <Trophy
              className={`w-8 h-8 ${
                winner === 'teamA'
                  ? 'text-emerald-400'
                  : winner === 'teamB'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            />
          </div>

          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {ui.gameOver.matchFinished} • {isCasual ? (isEn ? 'Casual Mode v2.1' : 'Modo Casual v2.1') : (isEn ? 'Competitive Mode v2.1' : 'Modo Competitivo v2.1')}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {winner === 'teamA'
              ? (is1v1 ? ui.gameOver.victory1v1 : ui.gameOver.victoryTeamA)
              : winner === 'teamB'
              ? (is1v1 ? ui.gameOver.defeat1v1 : ui.gameOver.victoryTeamB)
              : ui.gameOver.drawTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">{winReason}</p>

          {/* Indicador destacado de Desempate por Eficiencia de Sombras o Victoria en Prórroga */}
          {(decidedByShadowTiebreaker || (isOvertimeMatch && winner !== 'tie')) && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {decidedByShadowTiebreaker && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/90 border border-purple-400/60 text-purple-200 text-xs font-bold shadow-lg">
                  <EyeOff className="w-3.5 h-3.5 text-purple-300" />
                  <span>
                    {isEn
                      ? `Victory by Shadow Efficiency (Remaining Shadow Markers in Pool: ${teamAShadowsSaved} vs ${teamBShadowsSaved})`
                      : `Victoria por Eficiencia de Sombras (Marcadores de Sombra restantes en el Fondo: ${teamAShadowsSaved} vs ${teamBShadowsSaved})`}
                  </span>
                </span>
              )}
              {isOvertimeMatch && winner !== 'tie' && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-amber-200 text-xs font-bold shadow-lg">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEn ? 'Victory in Overtime' : 'Victoria en Prórroga'}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cuerpo desplazable de estadísticas v2.1 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Marcador Principal de Puntos de Ronda */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-4 rounded-2xl border text-center ${
              winner === 'teamA'
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                : 'bg-slate-950/80 border-slate-800'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                {teamALabel}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
                {teamARoundPoints}
              </div>
              <span className="text-[11px] text-slate-400">
                {isEn ? 'Total Round Points' : 'Puntos de Ronda Totales'} ({stats.teamAFrontsWon} {isEn ? 'fronts won' : 'frentes ganados'})
              </span>
            </div>

            <div className={`p-4 rounded-2xl border text-center ${
              winner === 'teamB'
                ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                : 'bg-slate-950/80 border-slate-800'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
                {teamBLabel}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
                {teamBRoundPoints}
              </div>
              <span className="text-[11px] text-slate-400">
                {isEn ? 'Total Round Points' : 'Puntos de Ronda Totales'} ({stats.teamBFrontsWon} {isEn ? 'fronts won' : 'frentes ganados'})
              </span>
            </div>
          </div>

          {/* 2. Métricas Tácticas Destacadas v2.1 (Desempate Nominal, Eficiencia de Sombras y Sinergias) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* A. Frentes ganados por Desempate Nominal (Carta Alta 2..A) */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isEn ? 'Nominal Tiebreaker Wins' : 'Frentes por Desempate Nominal'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isEn
                    ? 'Tied fronts decided by the single highest nominal rank card (2 < 3 < ... < K < A).'
                    : 'Frentes empatados a puntos decididos gracias a tener la carta nominal más alta (2..A).'}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-around font-mono">
                <div className="text-center">
                  <span className="text-[10px] text-emerald-400 block font-sans font-bold">{teamAShort}</span>
                  <span className="text-lg font-black text-emerald-300">{stats.teamANominalTieWins}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] text-rose-400 block font-sans font-bold">{teamBShort}</span>
                  <span className="text-lg font-black text-rose-300">{stats.teamBNominalTieWins}</span>
                </div>
              </div>
            </div>

            {/* B. Eficiencia de Sombras (Modo Competitivo) */}
            <div className="bg-slate-950/80 border border-purple-500/35 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
                  <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isEn ? 'Shadow Efficiency' : 'Eficiencia de Sombras'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isCasual
                    ? (isEn
                        ? 'Casual Mode: 1 fixed personal shadow per player/round (non-cumulative). Spent in match:'
                        : 'Modo Casual: 1 sombra individual fija por jugador/ronda (no acumulable). Gastadas:')
                    : (isEn
                        ? 'Generated vs. Spent vs. Saved in Team Pool (1st Match Tiebreaker).'
                        : 'Sombras generadas vs. gastadas vs. ahorradas en el Fondo (1.er Desempate).')}
                </p>
              </div>
              {isCasual ? (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-around font-mono">
                  <div className="text-center">
                    <span className="text-[10px] text-emerald-400 block font-sans font-bold">{teamAShort}</span>
                    <span className="text-sm font-black text-purple-300">{stats.teamAShadowsSpent} 🌑 {isEn ? 'spent' : 'gastadas'}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-center">
                    <span className="text-[10px] text-rose-400 block font-sans font-bold">{teamBShort}</span>
                    <span className="text-sm font-black text-purple-300">{stats.teamBShadowsSpent} 🌑 {isEn ? 'spent' : 'gastadas'}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 font-sans">{isEn ? 'Generated:' : 'Generadas:'}</span>
                    <span>
                      <strong className="text-emerald-300">{teamAShadowsGenTotal}</strong>
                      <span className="text-slate-600 mx-1.5">vs</span>
                      <strong className="text-rose-300">{teamBShadowsGenTotal}</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 font-sans">{isEn ? 'Spent:' : 'Gastadas:'}</span>
                    <span>
                      <strong className="text-emerald-300">{stats.teamAShadowsSpent}</strong>
                      <span className="text-slate-600 mx-1.5">vs</span>
                      <strong className="text-rose-300">{stats.teamBShadowsSpent}</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-purple-950/50 border border-purple-500/30 rounded-lg px-2 py-1">
                    <span className="text-purple-200 font-sans font-bold">{isEn ? 'Saved (Pool):' : 'Ahorradas (Fondo):'}</span>
                    <span>
                      <strong className="text-emerald-300 text-xs">{teamAShadowsSaved} 🌑</strong>
                      <span className="text-slate-500 mx-1.5">vs</span>
                      <strong className="text-rose-300 text-xs">{teamBShadowsSaved} 🌑</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* C. Puntos generados por Sinergia de Equipo */}
            <div className="bg-slate-950/80 border border-cyan-500/35 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-1">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isEn ? 'Team Synergy Points' : 'Puntos por Sinergia de Equipo'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isEn
                    ? 'Extra points from combinations: Suit (+1/extra), Pair (+2), Straight (+4), Trio (+5).'
                    : 'Puntos extra por combinaciones: Palo (+1/extra), Pareja (+2), Escalera (+4), Trío (+5).'}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 rounded-lg px-2 py-1">
                  <span className="text-cyan-200 font-sans font-bold">{isEn ? 'Total Synergy:' : 'Total Sinergia:'}</span>
                  <span>
                    <strong className="text-emerald-300 text-xs">+{stats.teamASynergy}</strong>
                    <span className="text-slate-500 mx-1.5">vs</span>
                    <strong className="text-rose-300 text-xs">+{stats.teamBSynergy}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] px-1">
                  <span className="font-sans">{isEn ? 'Base (1–4 scale):' : 'Puntos Base (1–4):'}</span>
                  <span>
                    <strong className="text-slate-200">{stats.teamABase}</strong>
                    <span className="text-slate-600 mx-1">vs</span>
                    <strong className="text-slate-200">{stats.teamBBase}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-0.5 text-[9px] text-center">
                  <div className="bg-slate-900/90 rounded px-1 py-0.5 border border-slate-800" title={isEn ? 'Suit (+1/extra)' : 'Palo (+1/extra)'}>
                    <div className="text-indigo-300 font-sans font-bold">{isEn ? 'Suit' : 'Palo'}</div>
                    <div>+{stats.teamASuit}/+{stats.teamBSuit}</div>
                  </div>
                  <div className="bg-slate-900/90 rounded px-1 py-0.5 border border-slate-800" title={isEn ? 'Pair (+2)' : 'Pareja (+2)'}>
                    <div className="text-amber-300 font-sans font-bold">{isEn ? 'Pair' : 'Par'}</div>
                    <div>+{stats.teamAPair}/+{stats.teamBPair}</div>
                  </div>
                  <div className="bg-slate-900/90 rounded px-1 py-0.5 border border-slate-800" title={isEn ? 'Short Straight (+4)' : 'Escalera Corta (+4)'}>
                    <div className="text-emerald-300 font-sans font-bold">{isEn ? 'Str' : 'Esc'}</div>
                    <div>+{stats.teamAStraight}/+{stats.teamBStraight}</div>
                  </div>
                  <div className="bg-slate-900/90 rounded px-1 py-0.5 border border-slate-800" title={isEn ? 'Trio (+5)' : 'Trío (+5)'}>
                    <div className="text-rose-300 font-sans font-bold">{isEn ? 'Trio' : 'Trío'}</div>
                    <div>+{stats.teamATrio}/+{stats.teamBTrio}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Historial de Rondas con Desglose en la Nueva Escala Unificada (Base 1-4 + Sinergia) */}
          {roundHistory && roundHistory.length > 0 && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <span>
                  {isEn
                    ? 'Round-by-Round Breakdown (Unified Tactical Scale: Base 1–4 + Synergy)'
                    : 'Historial de Rondas (Escala Táctica Unificada: Base 1–4 + Sinergia)'}
                </span>
                <span className="text-amber-400 font-mono text-[10px]">
                  {isEn
                    ? 'Tie = +1 each • 2 Fronts = +2 • 3 Fronts (Sweep) = +3'
                    : 'Empate = +1 c/u • 2 Frentes = +2 • Pleno (3) = +3'}
                </span>
              </div>
              <div className="divide-y divide-slate-800/70 max-h-60 overflow-y-auto">
                {roundHistory.map((item, idx) => {
                  const fb = item.frontBreakdowns || {};
                  const nominalTiesInRound = (item.teamANominalTieWins || 0) + (item.teamBNominalTieWins || 0);
                  return (
                    <div
                      key={item.round || idx}
                      className="px-4 py-2.5 text-xs flex flex-col gap-1.5 hover:bg-slate-900/40 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            R{item.round}
                          </span>
                          {item.flagFallTeam ? (
                            <span className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-700/50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{isEn ? 'Flag Fall (00:00)' : 'Caída de Bandera (00:00)'}</span>
                            </span>
                          ) : item.winType === 'sweep' ? (
                            <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-400" />
                              <span>{isEn ? '3-Front Sweep!' : '¡Pleno 3 Frentes!'}</span>
                            </span>
                          ) : item.roundWinner === 'tie' ? (
                            <span className="text-[10px] bg-sky-950/70 text-sky-300 border border-sky-700/50 px-2 py-0.5 rounded font-semibold">
                              {isEn ? 'Tied Round' : 'Empate de Ronda'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>{isEn ? '2 Fronts Won' : 'Victoria 2 Frentes'}</span>
                            </span>
                          )}
                          {nominalTiesInRound > 0 && (
                            <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <Scale className="w-3 h-3 text-amber-400" />
                              <span>
                                {isEn
                                  ? `${nominalTiesInRound} Nominal Tiebreaker`
                                  : `${nominalTiesInRound} Desempate Nominal`}
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-slate-400">
                            {isEn ? 'Fronts:' : 'Frentes:'}{' '}
                            <strong className="text-emerald-400">{item.teamAFrontWins}</strong>-
                            <strong className="text-rose-400">{item.teamBFrontWins}</strong>
                          </span>
                          <span className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg font-bold">
                            <span className="text-emerald-400">+{item.teamAPoints}</span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className="text-rose-400">+{item.teamBPoints}</span>
                            <span className="text-[9px] text-slate-400 ml-1">{isEn ? 'Round Pts' : 'Pts Ronda'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Desglose de puntos Base (1-4) + Sinergia de la ronda y por frente */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 pl-1">
                        <div>
                          <span className="text-emerald-300 font-bold">{teamAShort}:</span>{' '}
                          <span>
                            {item.teamAScoreSum ?? 0} pts ({isEn ? 'Base' : 'Base'} {item.teamABasePts ?? 0} + {isEn ? 'Synergy' : 'Sinergia'} +{item.teamASynergyPts ?? 0})
                          </span>
                          <span className="mx-2 text-slate-600">•</span>
                          <span className="text-rose-300 font-bold">{teamBShort}:</span>{' '}
                          <span>
                            {item.teamBScoreSum ?? 0} pts ({isEn ? 'Base' : 'Base'} {item.teamBBasePts ?? 0} + {isEn ? 'Synergy' : 'Sinergia'} +{item.teamBSynergyPts ?? 0})
                          </span>
                        </div>

                        {fb.left && fb.center && fb.right && (
                          <div className="flex items-center gap-1.5 text-[9px]">
                            {[
                              { id: 'left', label: isEn ? 'L' : 'Izq' },
                              { id: 'center', label: isEn ? 'C' : 'Cen' },
                              { id: 'right', label: isEn ? 'R' : 'Der' },
                            ].map(f => {
                              const fData = fb[f.id];
                              if (!fData) return null;
                              return (
                                <span
                                  key={f.id}
                                  className="bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded"
                                  title={
                                    fData.wonByTiebreaker
                                      ? (isEn
                                          ? `Nominal Tiebreaker (${fData.tiebreakerWinnerRank} vs ${fData.tiebreakerLoserRank})`
                                          : `Desempate Nominal (${fData.tiebreakerWinnerRank} vs ${fData.tiebreakerLoserRank})`)
                                      : undefined
                                  }
                                >
                                  <strong className="text-slate-300">{f.label}:</strong>{' '}
                                  <span className="text-emerald-400">{fData.teamATotal}</span>-
                                  <span className="text-rose-400">{fData.teamBTotal}</span>
                                  {fData.wonByTiebreaker && (
                                    <span className="text-amber-300 ml-0.5 font-bold">
                                      ({fData.tiebreakerWinnerRank})
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regla de Desempate Oficial v2.1 */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
            <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              {isCasual ? (
                <span>
                  <strong className="text-emerald-300">{isEn ? 'Casual Mode Tiebreaker (v2.1):' : 'Desempate Modo Casual (v2.1):'}</strong>{' '}
                  {isEn
                    ? 'With no cumulative Team Shadow Pool, a tie in Round Points goes directly to a 2-Round Overtime.'
                    : 'Al no existir Fondo de Sombras acumulable de equipo, si hay empate en Puntos de Ronda se pasa directamente a disputar la Prórroga de 2 Rondas.'}
                </span>
              ) : (
                <span>
                  <strong className="text-amber-300">{isEn ? 'Competitive Mode Tiebreakers (v2.1):' : 'Criterios de Desempate Modo Competitivo (v2.1):'}</strong>{' '}
                  {isEn
                    ? '1st Criterion (Shadow Efficiency): Team with more unspent Shadow Markers remaining in their Team Pool at the end of the final round wins. 2nd Criterion: If also tied in remaining Shadow Markers, a 2-Round Overtime is played.'
                    : '1.er Criterio (Eficiencia de Sombras): Si hay empate en Puntos de Ronda totales, gana el equipo que conserve más Marcadores de Sombra sin gastar en su Fondo de Equipo. 2.º Criterio: Si también empatan en Marcadores de Sombra restantes, se disputa una Prórroga de 2 Rondas.'}
                </span>
              )}
            </div>
          </div>

          {/* Botones de Acción Final o Prórroga */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {winner === 'tie' && onPlayOvertime ? (
              <button
                onClick={onPlayOvertime}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>{ui.gameOver.overtimeBtn}</span>
              </button>
            ) : (
              <button
                onClick={onRestart}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{ui.gameOver.playAgainBtn}</span>
              </button>
            )}
            <button
              onClick={onBackToMenu}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{ui.gameOver.mainMenuBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
