import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Swords, RotateCcw, Home, Sparkles, Shield, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function GameOverModal({
  isOpen,
  teamARoundPoints,
  teamBRoundPoints,
  teamACumulativePoints,
  teamBCumulativePoints,
  roundHistory = [],
  modeId = '1v1',
  gameMode = 'competitive',
  onRestart,
  onBackToMenu,
  onPlayOvertime,
}) {
  const { isEn, ui } = useLanguage();
  const is1v1 = modeId === '1v1';
  const isCasual = gameMode === 'casual';
  const teamALabel = is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A');
  const teamBLabel = is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B');

  let winner = 'tie';
  let reason = '';

  if (teamARoundPoints > teamBRoundPoints) {
    winner = 'teamA';
    reason = is1v1 
      ? ui.gameOver.reasonRounds1v1Win(teamARoundPoints, teamBRoundPoints)
      : ui.gameOver.reasonRoundsTeamWin(teamARoundPoints, teamBRoundPoints);
  } else if (teamBRoundPoints > teamARoundPoints) {
    winner = 'teamB';
    reason = is1v1
      ? ui.gameOver.reasonRounds1v1Lose(teamBRoundPoints, teamARoundPoints)
      : ui.gameOver.reasonRoundsTeamLose(teamBRoundPoints, teamARoundPoints);
  } else if (isCasual) {
    // Modo Casual: Desempate directo por Prórroga de 2 rondas (sin puntos acumulados)
    winner = 'tie';
    reason = ui.gameOver.reasonCasualTieOvertime || ui.gameOver.reasonTieOvertime;
  } else {
    // Modo Competitivo: Empate en rondas -> Criterio de Puntos Acumulados
    if (teamACumulativePoints > teamBCumulativePoints) {
      winner = 'teamA';
      reason = ui.gameOver.reasonCumulativeWin(teamACumulativePoints, teamBCumulativePoints);
    } else if (teamBCumulativePoints > teamACumulativePoints) {
      winner = 'teamB';
      reason = ui.gameOver.reasonCumulativeLose(teamBCumulativePoints, teamACumulativePoints);
    } else {
      winner = 'tie';
      reason = ui.gameOver.reasonTieOvertime;
    }
  }

  useEffect(() => {
    if (isOpen && winner === 'teamA') {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  // Estadísticas desglosadas de la partida según la escala oficial (1, 2 y 3 Puntos de Ronda)
  const historyList = Array.isArray(roundHistory) ? roundHistory : [];
  const teamASweeps = historyList.filter(
    r => r.roundWinner === 'teamA' && (r.winType === 'full_sweep' || r.winType === 'flag_fall_sweep' || r.teamAPoints === 3)
  ).length;
  const teamBSweeps = historyList.filter(
    r => r.roundWinner === 'teamB' && (r.winType === 'full_sweep' || r.winType === 'flag_fall_sweep' || r.teamBPoints === 3)
  ).length;

  const teamAStandardWins = historyList.filter(
    r => r.roundWinner === 'teamA' && (r.winType === 'standard' || r.winType === 'flag_fall_standard' || r.teamAPoints === 2)
  ).length;
  const teamBStandardWins = historyList.filter(
    r => r.roundWinner === 'teamB' && (r.winType === 'standard' || r.winType === 'flag_fall_standard' || r.teamBPoints === 2)
  ).length;

  const tiedRoundsCount = historyList.filter(
    r => r.roundWinner === 'tie' || r.winType === 'tie' || (r.teamAPoints === 1 && r.teamBPoints === 1)
  ).length;

  const teamATotalFronts = historyList.reduce((acc, r) => acc + (r.teamAFrontWins || 0), 0);
  const teamBTotalFronts = historyList.reduce((acc, r) => acc + (r.teamBFrontWins || 0), 0);
  const teamATotalTablePts = historyList.reduce((acc, r) => acc + (r.teamAScoreSum || 0), 0);
  const teamBTotalTablePts = historyList.reduce((acc, r) => acc + (r.teamBScoreSum || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#07090e] border border-amber-500/35 w-full max-w-xl rounded-3xl shadow-2xl p-5 sm:p-7 text-center flex flex-col items-center my-auto max-h-[94vh] overflow-y-auto">
        {/* Icono trofeo o espadas */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-3 border shrink-0 ${
          winner === 'teamA'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
            : winner === 'teamB'
            ? 'bg-rose-950/40 text-rose-400 border-rose-500/50'
            : 'bg-black/60 text-slate-400 border-amber-500/20'
        }`}>
          {winner === 'teamA' ? <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400" /> : <Swords className="w-9 h-9 sm:w-10 sm:h-10 text-slate-400" />}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-serif font-black uppercase tracking-widest text-amber-400/80">
            {ui.gameOver.banner}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider border flex items-center gap-1 ${
            isCasual
              ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40'
              : 'bg-amber-950/40 text-amber-300 border-amber-500/35'
          }`}>
            {isCasual ? <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> : <Shield className="w-2.5 h-2.5 text-amber-400" />}
            {isCasual ? ui.game.scoreboard.casualBadge : ui.game.scoreboard.competitiveBadge}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gold-gradient uppercase tracking-wide mb-1.5">
          {winner === 'teamA' && (is1v1 ? ui.gameOver.supremeVictory : ui.gameOver.alliedVictory)}
          {winner === 'teamB' && (is1v1 ? ui.gameOver.defeat : ui.gameOver.rivalVictory)}
          {winner === 'tie' && ui.gameOver.historicDraw}
        </h2>

        <p className="text-xs sm:text-sm font-serif text-slate-300 max-w-md mb-4 font-medium leading-relaxed">
          {reason}
        </p>

        {/* Marcador final y desglose estadístico de la partida */}
        <div className="w-full casino-panel rounded-2xl p-4 mb-5 space-y-2.5 font-serif text-left">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {ui.gameOver.matchStatsTitle}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              <strong className="text-emerald-400">{teamALabel}</strong> vs <strong className="text-rose-400">{teamBLabel}</strong>
            </span>
          </div>

          {/* Puntos de Ronda Totales */}
          <div className="flex items-center justify-between text-xs text-slate-200 bg-black/40 px-3 py-2 rounded-xl border border-amber-500/25">
            <span className="font-bold">{ui.gameOver.roundsWonLabel}</span>
            <span className="font-mono font-black text-sm sm:text-base">
              <strong className="text-emerald-400">{teamARoundPoints}</strong> {ui.common.pts} — <strong className="text-rose-400">{teamBRoundPoints}</strong> {ui.common.pts}
            </span>
          </div>

          {/* Desglose por tipo de victoria de ronda: Plenos (+3), Estándar (+2), Empates (+1) y Frentes totales */}
          <div className="bg-black/30 rounded-xl p-3 border border-slate-800/80 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>🔥 {ui.gameOver.sweeps3FrontsLabel}</span>
              <span className="font-mono font-bold">
                <strong className="text-emerald-400">{teamASweeps}</strong> <span className="text-slate-500">({teamASweeps * 3} {ui.common.pts})</span>
                {' — '}
                <strong className="text-rose-400">{teamBSweeps}</strong> <span className="text-slate-500">({teamBSweeps * 3} {ui.common.pts})</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>⚔️ {ui.gameOver.standard2FrontsLabel}</span>
              <span className="font-mono font-bold">
                <strong className="text-emerald-400">{teamAStandardWins}</strong> <span className="text-slate-500">({teamAStandardWins * 2} {ui.common.pts})</span>
                {' — '}
                <strong className="text-rose-400">{teamBStandardWins}</strong> <span className="text-slate-500">({teamBStandardWins * 2} {ui.common.pts})</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>⚖️ {ui.gameOver.tiedRoundsLabel}</span>
              <span className="font-mono font-bold">
                <strong className="text-amber-300">{tiedRoundsCount}</strong>{' '}
                <span className="text-slate-500">(+{tiedRoundsCount} / +{tiedRoundsCount} {ui.common.pts})</span>
              </span>
            </div>

            <div className="h-px bg-slate-800/90" />

            <div className="flex items-center justify-between text-slate-300">
              <span>🛡️ {ui.gameOver.totalFrontsWonLabel}</span>
              <span className="font-mono font-bold">
                <strong className="text-emerald-400">{teamATotalFronts}</strong> — <strong className="text-rose-400">{teamBTotalFronts}</strong>
              </span>
            </div>
          </div>

          {/* Estadística específica de modalidad: Competitivo (Puntos Acumulados) vs Casual (Puntos en Frentes Escala 1-4) */}
          {!isCasual ? (
            <div className="flex items-center justify-between text-xs text-slate-300 bg-black/35 px-3 py-2 rounded-xl border border-amber-500/15">
              <span>{ui.gameOver.cumulativePointsLabel}</span>
              <span className="font-mono font-bold text-sm">
                <strong className="text-emerald-400">{teamACumulativePoints}</strong> {ui.common.pts} — <strong className="text-rose-400">{teamBCumulativePoints}</strong> {ui.common.pts}
              </span>
            </div>
          ) : (
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-cyan-200">
                <span>{ui.gameOver.casualTablePointsLabel}</span>
                <span className="font-mono font-bold text-sm">
                  <strong className="text-emerald-400">{teamATotalTablePts}</strong> {ui.common.pts} — <strong className="text-rose-400">{teamBTotalTablePts}</strong> {ui.common.pts}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {ui.gameOver.casualTiebreakerNote}
              </p>
            </div>
          )}

          {/* Historial ronda por ronda */}
          {historyList.length > 0 && (
            <div className="pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {ui.gameOver.roundHistoryTitle}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {historyList.map((r) => {
                  const isSweep = r.winType === 'full_sweep' || r.winType === 'flag_fall_sweep' || r.teamAPoints === 3 || r.teamBPoints === 3;
                  const isTie = r.roundWinner === 'tie' || r.winType === 'tie';
                  const badgeText = r.flagFallTeam
                    ? (isEn ? 'Flag Fall' : 'Caída Bandera')
                    : isSweep
                    ? (isEn ? '3-Front Sweep' : 'Pleno 3 Pozos')
                    : isTie
                    ? (isEn ? 'Tied Round' : 'Empate')
                    : (isEn ? '2 Fronts' : '2 Pozos');

                  return (
                    <div
                      key={r.round}
                      className={`rounded-lg px-2.5 py-1.5 border text-[10px] flex flex-col justify-between ${
                        r.roundWinner === 'teamA'
                          ? 'bg-emerald-950/25 border-emerald-500/35'
                          : r.roundWinner === 'teamB'
                          ? 'bg-rose-950/25 border-rose-500/35'
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-300">R{r.round}</span>
                        <span className="font-mono text-[11px]">
                          <strong className="text-emerald-400">+{r.teamAPoints}</strong>
                          <span className="text-slate-500">/</span>
                          <strong className="text-rose-400">+{r.teamBPoints}</strong> {ui.common.pts}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                        <span>{badgeText}</span>
                        <span className="font-mono">
                          {r.teamAFrontWins}-{r.teamBFrontWins}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="w-full flex flex-col gap-2.5">
          {winner === 'tie' && onPlayOvertime && (
            <button
              onClick={onPlayOvertime}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>{ui.gameOver.playOvertimeBtn}</span>
            </button>
          )}

          <div className="w-full flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-serif font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{ui.gameOver.playAgainBtn}</span>
            </button>

            <button
              onClick={onBackToMenu}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0d121c] hover:bg-[#151c2b] text-slate-300 hover:text-white border border-amber-500/25 font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>{ui.gameOver.returnMenuBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
