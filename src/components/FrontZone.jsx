import React from 'react';
import { Card } from './Card';
import { Lock, Swords } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedFronts } from '../constants/rules';

export function FrontZone({
  frontKey,
  frontInfo,
  teamACards = [], // Tropas del Equipo A
  teamBCards = [], // Tropas del Equipo B
  trumpSuit,
  isRoundOver = false,
  selectedCard = null,
  draggingCard = null,
  isPlayerTurn = false,
  maxFrontCards = 8,
  modeId = '1v1',
  viewerPlayerId = null,
  viewerTeam = 'teamA',
  onDeploy,
}) {
  const { language, isEn, ui } = useLanguage();
  const localizedFront = getLocalizedFronts(language).find(f => f.id === frontKey) || frontInfo;

  const [isDragOver, setIsDragOver] = React.useState(false);
  const totalCards = teamACards.length + teamBCards.length;
  const isSaturated = totalCards >= maxFrontCards;
  const activeCard = selectedCard || draggingCard;
  const canDeploy = isPlayerTurn && !isSaturated && Boolean(activeCard);

  const isTeamMode = modeId !== '1v1';
  const isViewerTeamB = viewerTeam === 'teamB';

  const allyCards = isViewerTeamB ? teamBCards : teamACards;
  const enemyCards = isViewerTeamB ? teamACards : teamBCards;

  const allyLabel = isTeamMode 
    ? (isViewerTeamB ? ui.game.front.yourTeamB : ui.game.front.yourTeamA) 
    : ui.game.front.yourForces;
  const allyColor = isViewerTeamB ? 'text-rose-400' : 'text-emerald-400';
  const allyBorder = isViewerTeamB ? 'border-rose-900/60 text-rose-300' : 'border-emerald-900/60 text-emerald-300';

  const enemyLabel = isTeamMode 
    ? (isViewerTeamB ? ui.game.front.enemyTeamA : ui.game.front.enemyTeamB) 
    : ui.game.front.enemyForces;
  const enemyColor = isViewerTeamB ? 'text-emerald-400' : 'text-rose-400';
  const enemyBorder = isViewerTeamB ? 'border-emerald-900/60 text-emerald-300' : 'border-rose-900/60 text-rose-300';

  return (
    <div
      onClick={() => {
        if (canDeploy) onDeploy(frontKey);
      }}
      onDragOver={(e) => {
        if (isPlayerTurn && !isSaturated) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (!isDragOver) setIsDragOver(true);
        }
      }}
      onDragEnter={(e) => {
        if (isPlayerTurn && !isSaturated) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!isPlayerTurn || isSaturated) return;
        const droppedCardId = e.dataTransfer.getData('text/plain') || draggingCard?.id || selectedCard?.id;
        if (droppedCardId) {
          onDeploy(frontKey, droppedCardId);
        }
      }}
      className={`
        flex-1 flex flex-col justify-between rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 relative
        ${isDragOver 
          ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400 scale-[1.01] shadow-[0_0_35px_rgba(212,175,55,0.4)]' 
          : canDeploy 
          ? 'cursor-pointer hover:border-amber-400/80 hover:bg-[#0c161f]/90 ring-1 ring-amber-400/30' 
          : ''}
        ${isSaturated 
          ? 'bg-[#0a0d14]/70 border-stone-800/80' 
          : 'casino-felt-table shadow-2xl'}
      `}
    >
      {/* Cabecera del Frente */}
      <div className="flex items-center justify-between pb-2.5 border-b border-amber-500/15">
        <div>
          <h3 className="text-sm sm:text-base font-serif font-black tracking-wide text-slate-100 flex items-center gap-1.5">
            {localizedFront.name}
            {isSaturated && (
              <span className="bg-rose-950/90 text-rose-300 text-[9px] font-serif font-bold px-2 py-0.5 rounded border border-rose-800/80 flex items-center gap-1 uppercase tracking-wider">
                <Lock className="w-2.5 h-2.5" /> {ui.game.front.saturated}
              </span>
            )}
          </h3>
          <span className="text-[10px] uppercase font-serif tracking-widest text-amber-400/70">{localizedFront.subtitle}</span>
        </div>

        {/* Límite territorial compartido dinámico (Capacidad física del frente) */}
        <div className="text-right bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <span className="text-[9px] uppercase font-serif font-bold text-amber-300/70 block tracking-wider">
            {isEn ? 'Capacity' : 'Capacidad'}
          </span>
          <div className="text-xs font-serif font-black text-slate-200">
            <span className={totalCards >= maxFrontCards - 2 ? 'text-amber-400' : 'text-slate-100'}>{totalCards}</span>
            <span className="text-slate-500"> / {maxFrontCards}</span>
          </div>
        </div>
      </div>

      {/* Lado de Rivales (Arriba) */}
      <div className="my-2 min-h-[90px] flex flex-col justify-start">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
          <span className={`font-serif font-bold tracking-wider uppercase text-[10px] ${enemyColor}`}>
            {enemyLabel}
          </span>
          <span className="font-serif text-[11px] text-slate-400">
            {enemyCards.length} {enemyCards.length === 1 ? ui.common.card : ui.common.cards}
          </span>
        </div>

        {/* Cartas del Rival */}
        <div className="flex flex-wrap gap-1.5 items-center min-h-[64px] bg-black/45 rounded-xl p-2 border border-amber-500/10 shadow-inner">
          {enemyCards.length === 0 ? (
            <span className="text-[11px] font-serif text-slate-500 italic m-auto">
              {isEn ? 'No enemy troops deployed' : 'Sin tropas enemigas desplegadas'}
            </span>
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
                    <span className={`absolute -bottom-1 -right-1 z-30 bg-black text-[9px] font-serif font-bold px-1.5 py-0.5 rounded shadow-lg border ${enemyBorder}`}>
                      {card.playedBy}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Divisor Central / Balanza de Batalla táctica de Salón */}
      <div className="py-2 my-1 border-y border-amber-500/20 flex items-center justify-between bg-black/50 px-3 rounded-xl shadow-inner">
        <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold text-amber-200/80">
          <Swords className="w-3.5 h-3.5 text-amber-400/80" />
          <span className="tracking-wide">
            {isSaturated
              ? (isEn ? 'Limit reached' : 'Límite alcanzado')
              : totalCards === 0
              ? (isEn ? 'Open line' : 'Frente abierto')
              : (isEn ? `${teamBCards.length} vs ${teamACards.length} troops` : `${teamBCards.length} vs ${teamACards.length} tropas`)}
          </span>
        </div>

        {/* Indicador de Acción al pasar el cursor o arrastrar */}
        {isDragOver ? (
          <div className="text-xs font-serif font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
            <span>{isEn ? 'Release to deploy' : 'Suelta para desplegar'}</span>
          </div>
        ) : canDeploy ? (
          <div className="text-xs font-serif font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider animate-pulse">
            <span>{isEn ? 'Deploy card here' : 'Desplegar carta aquí'}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-serif italic tracking-wider">
            {isEn ? 'Tactical assessment' : 'Cálculo de mesa'}
          </span>
        )}
      </div>

      {/* Lado de Aliados / Propias Tropas (Abajo) */}
      <div className="my-2 min-h-[90px] flex flex-col justify-end">
        {/* Cartas de las Fuerzas Propias / Aliadas */}
        <div className="flex flex-wrap gap-1.5 items-center min-h-[64px] bg-black/45 rounded-xl p-2 border border-amber-500/10 shadow-inner mb-1.5">
          {allyCards.length === 0 ? (
            <span className="text-[11px] font-serif text-slate-500 italic m-auto">
              {isEn ? 'Deploy your forces here' : 'Despliega tus fuerzas aquí'}
            </span>
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
                    <span className={`absolute -bottom-1 -right-1 z-30 bg-black text-[9px] font-serif font-bold px-1.5 py-0.5 rounded shadow-lg border ${allyBorder}`}>
                      {card.playedBy}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pie de tropas propias */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className={`font-serif font-bold tracking-wider uppercase text-[10px] ${allyColor}`}>
            {allyLabel}
          </span>
          <span className="font-serif text-[11px] text-slate-400">
            {allyCards.length} {allyCards.length === 1 ? ui.common.card : ui.common.cards}
          </span>
        </div>
      </div>
    </div>
  );
}
