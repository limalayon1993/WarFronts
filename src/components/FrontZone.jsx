import React from 'react';
import { Card } from './Card';
import { Lock, Zap, Swords } from 'lucide-react';

export function FrontZone({
  frontKey,
  frontInfo,
  teamACards = [], // Tropas del Equipo A
  teamBCards = [], // Tropas del Equipo B
  trumpSuit,
  isRoundOver = false,
  selectedCard = null,
  isPlayerTurn = false,
  maxFrontCards = 8,
  modeId = '1v1',
  viewerPlayerId = null,
  viewerTeam = 'teamA',
  onDeploy,
}) {
  const totalCards = teamACards.length + teamBCards.length;
  const isSaturated = totalCards >= maxFrontCards;
  const canDeploy = isPlayerTurn && !isSaturated && selectedCard;

  const isTeamMode = modeId !== '1v1';
  const isViewerTeamB = viewerTeam === 'teamB';

  const allyCards = isViewerTeamB ? teamBCards : teamACards;
  const enemyCards = isViewerTeamB ? teamACards : teamBCards;

  const allyLabel = isTeamMode 
    ? (isViewerTeamB ? 'Tu Equipo (B)' : 'Tu Equipo (A)') 
    : 'Tus Fuerzas';
  const allyColor = isViewerTeamB ? 'text-rose-400' : 'text-emerald-400';
  const allyBorder = isViewerTeamB ? 'border-rose-900/50 text-rose-400' : 'border-emerald-900/50 text-emerald-400';

  const enemyLabel = isTeamMode 
    ? (isViewerTeamB ? 'Equipo Rival (A)' : 'Equipo Rival (B)') 
    : 'Rival';
  const enemyColor = isViewerTeamB ? 'text-emerald-400' : 'text-rose-400';
  const enemyBorder = isViewerTeamB ? 'border-emerald-900/50 text-emerald-400' : 'border-rose-900/50 text-rose-400';

  return (
    <div
      onClick={() => {
        if (canDeploy) onDeploy(frontKey);
      }}
      className={`
        flex-1 flex flex-col justify-between rounded-xl p-3 sm:p-4 border transition-all duration-200 relative
        ${canDeploy ? 'cursor-pointer hover:border-amber-400 hover:bg-slate-800/80 ring-2 ring-amber-400/40' : ''}
        ${isSaturated ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-900/90 border-slate-700 shadow-xl'}
      `}
    >
      {/* Cabecera del Frente */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
            {frontInfo.name}
            {isSaturated && (
              <span className="bg-rose-950 text-rose-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-800 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> SATURADO
              </span>
            )}
          </h3>
          <span className="text-[11px] text-slate-400">{frontInfo.subtitle}</span>
        </div>

        {/* Límite territorial compartido dinámico (Capacidad física del frente) */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-medium text-slate-400">Capacidad</span>
          <div className="text-xs font-bold text-slate-200">
            <span className={totalCards >= maxFrontCards - 2 ? 'text-amber-400' : 'text-slate-100'}>{totalCards}</span>
            <span className="text-slate-500"> / {maxFrontCards}</span>
          </div>
        </div>
      </div>

      {/* Lado de Rivales (Arriba) */}
      <div className="my-2 min-h-[90px] flex flex-col justify-start">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className={`font-semibold ${enemyColor}`}>
            {enemyLabel}
          </span>
          <span className="font-mono text-xs text-slate-400">
            {enemyCards.length} {enemyCards.length === 1 ? 'carta' : 'cartas'}
          </span>
        </div>

        {/* Cartas del Rival */}
        <div className="flex flex-wrap gap-1 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-1.5 border border-slate-800/80">
          {enemyCards.length === 0 ? (
            <span className="text-[11px] text-slate-600 italic m-auto">Sin tropas enemigas</span>
          ) : (
            enemyCards.map((card, idx) => {
              const isOwner = Boolean(card.isOwner || (card.playedById && card.playedById === viewerPlayerId));
              return (
                <div key={`enemy-${idx}-${card.id}`} className="relative group">
                  <Card
                    card={card}
                    isShadow={card.isShadow}
                    isRevealed={isRoundOver}
                    isOwner={isOwner}
                    isTrump={card.suit === trumpSuit}
                    compact
                  />
                  {card.playedBy && (
                    <span className={`absolute -bottom-1 -right-1 bg-slate-900 text-[8px] font-bold px-1 rounded border ${enemyBorder}`}>
                      {card.playedBy}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Divisor Central / Balanza de Batalla táctica */}
      <div className="py-2 my-1 border-y border-slate-800/80 flex items-center justify-between bg-slate-950/60 px-3 rounded-lg">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <Swords className="w-3.5 h-3.5 text-amber-500/80" />
          <span>
            {isSaturated
              ? 'Límite alcanzado'
              : totalCards === 0
              ? 'Frente libre'
              : `${teamBCards.length} vs ${teamACards.length} tropas`}
          </span>
        </div>

        {/* Indicador de Acción al pasar el cursor */}
        {canDeploy ? (
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
            <Zap className="w-3 h-3" />
            <span>Desplegar tropa aquí</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono italic">
            Cálculo mental
          </span>
        )}
      </div>

      {/* Lado de Aliados / Propias Tropas (Abajo) */}
      <div className="my-2 min-h-[90px] flex flex-col justify-end">
        {/* Cartas de las Fuerzas Propias / Aliadas */}
        <div className="flex flex-wrap gap-1 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-1.5 border border-slate-800/80 mb-1.5">
          {allyCards.length === 0 ? (
            <span className="text-[11px] text-slate-600 italic m-auto">Despliega tus tropas aquí</span>
          ) : (
            allyCards.map((card, idx) => {
              const isOwner = Boolean(card.isOwner || (card.playedById && card.playedById === viewerPlayerId));
              return (
                <div key={`ally-${idx}-${card.id}`} className="relative group">
                  <Card
                    card={card}
                    isShadow={card.isShadow}
                    isRevealed={isRoundOver}
                    isOwner={isOwner}
                    isTrump={card.suit === trumpSuit}
                    compact
                  />
                  {card.playedBy && (
                    <span className={`absolute -bottom-1 -right-1 bg-slate-900 text-[8px] font-bold px-1 rounded border ${allyBorder}`}>
                      {card.playedBy}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pie de tropas propias */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className={`font-semibold ${allyColor}`}>
            {allyLabel}
          </span>
          <span className="font-mono text-xs text-slate-400">
            {allyCards.length} {allyCards.length === 1 ? 'carta' : 'cartas'}
          </span>
        </div>
      </div>
    </div>
  );
}
