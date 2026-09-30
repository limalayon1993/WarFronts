import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Swords, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function GameOverModal({
  isOpen,
  teamARoundPoints,
  teamBRoundPoints,
  teamACumulativePoints,
  teamBCumulativePoints,
  modeId = '1v1',
  onRestart,
  onBackToMenu,
  onPlayOvertime,
}) {
  const { isEn, ui } = useLanguage();
  const is1v1 = modeId === '1v1';
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
  } else {
    // Empate en rondas: Criterio de Puntos Acumulados
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Icono trofeo */}
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border ${
          winner === 'teamA'
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/20 shadow-xl'
            : winner === 'teamB'
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {winner === 'teamA' ? <Trophy className="w-10 h-10 animate-bounce" /> : <Swords className="w-10 h-10" />}
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
          {ui.gameOver.banner}
        </span>

        <h2 className="text-3xl font-black text-slate-100 uppercase tracking-wide mb-2">
          {winner === 'teamA' && (is1v1 ? ui.gameOver.supremeVictory : ui.gameOver.alliedVictory)}
          {winner === 'teamB' && (is1v1 ? ui.gameOver.defeat : ui.gameOver.rivalVictory)}
          {winner === 'tie' && ui.gameOver.historicDraw}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-6 font-medium">
          {reason}
        </p>

        {/* Marcador final */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{ui.gameOver.roundsWonLabel}</span>
            <span className="font-mono font-bold text-sm">
              <strong className="text-emerald-400">{teamARoundPoints}</strong> {is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A')} — <strong className="text-rose-400">{teamBRoundPoints}</strong> {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')}
            </span>
          </div>

          <div className="h-px bg-slate-800" />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{ui.gameOver.cumulativePointsLabel}</span>
            <span className="font-mono font-bold text-sm">
              <strong className="text-emerald-400">{teamACumulativePoints}</strong> {ui.common.pts} — <strong className="text-rose-400">{teamBCumulativePoints}</strong> {ui.common.pts}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="w-full flex flex-col gap-2">
          {winner === 'tie' && onPlayOvertime && (
            <button
              onClick={onPlayOvertime}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Swords className="w-4 h-4" />
              <span>{ui.gameOver.playOvertimeBtn}</span>
            </button>
          )}

          <div className="w-full flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{ui.gameOver.playAgainBtn}</span>
            </button>

            <button
              onClick={onBackToMenu}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
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
