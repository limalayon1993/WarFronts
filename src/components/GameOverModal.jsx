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
      <div className="bg-[#07090e] border border-amber-500/35 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Icono trofeo o espadas */}
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border ${
          winner === 'teamA'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
            : winner === 'teamB'
            ? 'bg-rose-950/40 text-rose-400 border-rose-500/50'
            : 'bg-black/60 text-slate-400 border-amber-500/20'
        }`}>
          {winner === 'teamA' ? <Trophy className="w-10 h-10 text-amber-400" /> : <Swords className="w-10 h-10 text-slate-400" />}
        </div>

        <span className="text-xs font-serif font-black uppercase tracking-widest text-amber-400/80 mb-1">
          {ui.gameOver.banner}
        </span>

        <h2 className="text-3xl font-serif font-black text-gold-gradient uppercase tracking-wide mb-2">
          {winner === 'teamA' && (is1v1 ? ui.gameOver.supremeVictory : ui.gameOver.alliedVictory)}
          {winner === 'teamB' && (is1v1 ? ui.gameOver.defeat : ui.gameOver.rivalVictory)}
          {winner === 'tie' && ui.gameOver.historicDraw}
        </h2>

        <p className="text-xs sm:text-sm font-serif text-slate-300 max-w-xs mb-6 font-medium leading-relaxed">
          {reason}
        </p>

        {/* Marcador final */}
        <div className="w-full casino-panel rounded-2xl p-4 mb-6 space-y-3 font-serif">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{ui.gameOver.roundsWonLabel}</span>
            <span className="font-mono font-bold text-sm">
              <strong className="text-emerald-400">{teamARoundPoints}</strong> {is1v1 ? (isEn ? 'You' : 'Tú') : (isEn ? 'Team A' : 'Equipo A')} — <strong className="text-rose-400">{teamBRoundPoints}</strong> {is1v1 ? (isEn ? 'Rival' : 'Rival') : (isEn ? 'Team B' : 'Equipo B')}
            </span>
          </div>

          <div className="h-px bg-amber-500/15" />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{ui.gameOver.cumulativePointsLabel}</span>
            <span className="font-mono font-bold text-sm">
              <strong className="text-emerald-400">{teamACumulativePoints}</strong> {ui.common.pts} — <strong className="text-rose-400">{teamBCumulativePoints}</strong> {ui.common.pts}
            </span>
          </div>
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
