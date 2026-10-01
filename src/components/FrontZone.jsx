import React from 'react';
import { Card } from './Card';
import { Lock, Swords } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getLocalizedFronts,
  getLocalizedSuits,
  sortFrontCards,
  analyzeCardSynergies,
  SUITS,
} from '../constants/rules';

export function FrontZone({
  frontKey,
  frontInfo,
  teamACards = [], // Tropas del Equipo A
  teamBCards = [], // Tropas del Equipo B
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
  const [hoveredCardId, setHoveredCardId] = React.useState(null);
  const [hoveredSynergyFilter, setHoveredSynergyFilter] = React.useState(null);

  const totalCards = teamACards.length + teamBCards.length;
  const isSaturated = totalCards >= maxFrontCards;
  const activeCard = selectedCard || draggingCard;
  const canDeploy = isPlayerTurn && !isSaturated && Boolean(activeCard);

  const isTeamMode = modeId !== '1v1';
  const isViewerTeamB = viewerTeam === 'teamB';

  const allyCards = isViewerTeamB ? teamBCards : teamACards;
  const enemyCards = isViewerTeamB ? teamACards : teamBCards;

  // 1. Ordenación de tropas: 1º Número ascendente, 2º Palo
  // Cartas sombras no reveladas permanecen fijas en su índice de colocación para no filtrar información
  const sortedAllyCards = React.useMemo(
    () => sortFrontCards(allyCards, isRoundOver),
    [allyCards, isRoundOver]
  );
  const sortedEnemyCards = React.useMemo(
    () => sortFrontCards(enemyCards, isRoundOver),
    [enemyCards, isRoundOver]
  );

  // 2. Análisis táctico de sinergias y formaciones activas
  const { frontScore: allyScore, cardSynergies: allySynergies } = React.useMemo(
    () => analyzeCardSynergies(allyCards, isRoundOver, language),
    [allyCards, isRoundOver, language]
  );
  const { frontScore: enemyScore, cardSynergies: enemySynergies } = React.useMemo(
    () => analyzeCardSynergies(enemyCards, isRoundOver, language),
    [enemyCards, isRoundOver, language]
  );

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

  // Lógica de iluminación y atenuación interactiva para conectar cartas en combos
  function checkCardHighlight(card, side) {
    const isAlly = side === 'ally';
    const synergies = isAlly ? allySynergies : enemySynergies;

    if (hoveredCardId) {
      if (card.id === hoveredCardId) return true;
      const hoveredSynergy = (isAlly ? allySynergies : enemySynergies)[hoveredCardId];
      if (hoveredSynergy?.partnerCardIds?.includes(card.id)) return true;
      return false;
    }

    if (hoveredSynergyFilter && hoveredSynergyFilter.side === side) {
      const syn = synergies[card.id];
      if (!syn) return false;
      if (hoveredSynergyFilter.type === 'trio' && syn.inTrio && card.base === hoveredSynergyFilter.value) return true;
      if (hoveredSynergyFilter.type === 'pair' && syn.inPair && card.base === hoveredSynergyFilter.value) return true;
      if (hoveredSynergyFilter.type === 'straight' && syn.inStraight && hoveredSynergyFilter.values?.includes(card.base)) return true;
      if (hoveredSynergyFilter.type === 'suit' && syn.inSuitSynergy && card.suit === hoveredSynergyFilter.value) return true;
    }

    return false;
  }

  function checkCardDimmed(card, side) {
    if (!hoveredCardId && !hoveredSynergyFilter) return false;
    return !checkCardHighlight(card, side);
  }

  // Renderiza las pastillas de formaciones activas de forma compacta y elegante
  function renderSynergyChips(score, side) {
    const chips = [];

    // Tríos
    (score.trios || []).forEach((trio, idx) => {
      const isHovered = hoveredSynergyFilter?.side === side && hoveredSynergyFilter?.type === 'trio' && hoveredSynergyFilter?.value === trio.base;
      chips.push(
        <span
          key={`trio-${trio.base}-${idx}`}
          onMouseEnter={() => setHoveredSynergyFilter({ side, type: 'trio', value: trio.base })}
          onMouseLeave={() => setHoveredSynergyFilter(null)}
          className={`inline-flex items-center gap-1 text-[9px] font-serif font-black px-1.5 py-0.5 rounded cursor-pointer transition-all border ${
            isHovered
              ? 'bg-purple-800 text-purple-100 border-purple-400 scale-105 shadow-md shadow-purple-900/60 ring-1 ring-purple-300'
              : 'bg-purple-950/80 text-purple-200 border-purple-700/60 hover:border-purple-400'
          }`}
          title={isEn ? `Trio of ${trio.rank}s` : `Trío de ${trio.rank}s`}
        >
          <span>✦ {isEn ? 'Trio' : 'Trío'} {trio.rank}</span>
        </span>
      );
    });

    // Parejas
    (score.pairs || []).forEach((pair, idx) => {
      const isHovered = hoveredSynergyFilter?.side === side && hoveredSynergyFilter?.type === 'pair' && hoveredSynergyFilter?.value === pair.base;
      chips.push(
        <span
          key={`pair-${pair.base}-${idx}`}
          onMouseEnter={() => setHoveredSynergyFilter({ side, type: 'pair', value: pair.base })}
          onMouseLeave={() => setHoveredSynergyFilter(null)}
          className={`inline-flex items-center gap-1 text-[9px] font-serif font-black px-1.5 py-0.5 rounded cursor-pointer transition-all border ${
            isHovered
              ? 'bg-amber-600 text-stone-950 border-amber-300 scale-105 shadow-md shadow-amber-900/60 ring-1 ring-amber-300'
              : 'bg-amber-950/80 text-amber-200 border-amber-600/60 hover:border-amber-400'
          }`}
          title={isEn ? `Pair of ${pair.rank}s` : `Pareja de ${pair.rank}s`}
        >
          <span>👥 {isEn ? 'Pair' : 'Par'} {pair.rank}</span>
        </span>
      );
    });

    // Escaleras
    (score.straights || []).forEach((straight, idx) => {
      const isHovered = hoveredSynergyFilter?.side === side && hoveredSynergyFilter?.type === 'straight' && hoveredSynergyFilter?.value === straight.label;
      chips.push(
        <span
          key={`straight-${straight.label}-${idx}`}
          onMouseEnter={() => setHoveredSynergyFilter({ side, type: 'straight', value: straight.label, values: straight.values })}
          onMouseLeave={() => setHoveredSynergyFilter(null)}
          className={`inline-flex items-center gap-1 text-[9px] font-serif font-black px-1.5 py-0.5 rounded cursor-pointer transition-all border ${
            isHovered
              ? 'bg-cyan-700 text-cyan-100 border-cyan-300 scale-105 shadow-md shadow-cyan-900/60 ring-1 ring-cyan-300'
              : 'bg-cyan-950/80 text-cyan-200 border-cyan-700/60 hover:border-cyan-400'
          }`}
          title={isEn ? `Straight ${straight.label}` : `Escalera ${straight.label}`}
        >
          <span>⚡ {isEn ? 'Str' : 'Esc'} {straight.label}</span>
        </span>
      );
    });

    // Sinergias de Palo
    Object.entries(score.synergiesBySuit || {}).forEach(([suit, data]) => {
      if (data.count >= 2) {
        const isRed = suit === 'hearts' || suit === 'diamonds';
        const isHovered = hoveredSynergyFilter?.side === side && hoveredSynergyFilter?.type === 'suit' && hoveredSynergyFilter?.value === suit;
        const suitSymbol = SUITS[suit]?.symbol || suit;
        chips.push(
          <span
            key={`suit-${suit}`}
            onMouseEnter={() => setHoveredSynergyFilter({ side, type: 'suit', value: suit })}
            onMouseLeave={() => setHoveredSynergyFilter(null)}
            className={`inline-flex items-center gap-1 text-[9px] font-serif font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all border ${
              isHovered
                ? 'bg-stone-800 text-amber-200 border-amber-300 scale-105 shadow-md ring-1 ring-amber-300'
                : 'bg-black/60 text-slate-300 border-amber-500/25 hover:border-amber-400/50'
            }`}
            title={`${getLocalizedSuits(language)[suit]?.name || SUITS[suit]?.name || suit} x${data.count}`}
          >
            <span className={isRed ? 'text-rose-400' : 'text-slate-200'}>{suitSymbol}x{data.count}</span>
          </span>
        );
      }
    });

    if (chips.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-1 mb-1.5 px-0.5 animate-fadeIn">
        {chips}
      </div>
    );
  }

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
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
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

        {/* Capacidad territorial */}
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
      <div className="my-1.5 min-h-[90px] flex flex-col justify-start">
        {/* Cabecera del Rival: Etiqueta y Conteo */}
        <div className="flex items-center justify-between text-[11px] mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold tracking-wider uppercase text-[10px] ${enemyColor}`}>
              {enemyLabel}
            </span>
            <span className="font-serif text-[10px] text-slate-400">
              ({enemyCards.length} {enemyCards.length === 1 ? ui.common.card : ui.common.cards})
            </span>
          </div>

          {enemyScore.hiddenCount > 0 && (
            <span
              className="bg-purple-950/70 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-serif font-bold tracking-wider uppercase flex items-center gap-0.5"
              title={isEn ? "Hidden shadow cards" : "Cartas sombras ocultas"}
            >
              <span>+{enemyScore.hiddenCount}</span>
              <span className="text-[8px]">{ui.game.card.shadowBadge}</span>
            </span>
          )}
        </div>

        {/* Pastillas de Formaciones Activas del Rival */}
        {renderSynergyChips(enemyScore, 'enemy')}

        {/* Cartas del Rival (Ordenadas: número y palo, con sombras fijas en su índice) */}
        <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 items-center min-h-[72px] bg-black/45 rounded-xl p-2.5 border border-amber-500/10 shadow-inner">
          {sortedEnemyCards.length === 0 ? (
            <span className="text-[11px] font-serif text-slate-500 italic m-auto">
              {isEn ? 'No enemy troops deployed' : 'Sin tropas enemigas desplegadas'}
            </span>
          ) : (
            sortedEnemyCards.map((card, idx) => {
              const isOwner = Boolean(card.isOwner || (card.playedById && card.playedById === viewerPlayerId));
              const isHighlighted = checkCardHighlight(card, 'enemy');
              const isDimmed = checkCardDimmed(card, 'enemy');
              const cardSynergy = enemySynergies[card.id];

              return (
                <div key={`enemy-${idx}-${card.id}`} className="relative group">
                  <Card
                    card={card}
                    isShadow={card.isShadow}
                    isRevealed={isRoundOver}
                    isOwner={isOwner}
                    isTeammate={false}
                    compact
                    synergy={cardSynergy}
                    isHighlighted={isHighlighted}
                    isDimmed={isDimmed}
                    onMouseEnter={() => {
                      if (!card.isShadow || isRoundOver) {
                        setHoveredCardId(card.id);
                      }
                    }}
                    onMouseLeave={() => setHoveredCardId(null)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Divisor Central / Balanza de Batalla táctica de Salón */}
      <div className="py-1.5 my-1 border-y border-amber-500/20 flex items-center justify-between bg-black/50 px-3 rounded-xl shadow-inner">
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
      <div className="my-1.5 min-h-[90px] flex flex-col justify-end">
        {/* Pastillas de Formaciones Activas de las Fuerzas Propias */}
        {renderSynergyChips(allyScore, 'ally')}

        {/* Cartas de las Fuerzas Propias / Aliadas (Ordenadas) */}
        <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 items-center min-h-[72px] bg-black/45 rounded-xl p-2.5 border border-amber-500/10 shadow-inner mb-1.5">
          {sortedAllyCards.length === 0 ? (
            <span className="text-[11px] font-serif text-slate-500 italic m-auto">
              {isEn ? 'Deploy your forces here' : 'Despliega tus fuerzas aquí'}
            </span>
          ) : (
            sortedAllyCards.map((card, idx) => {
              const isOwner = Boolean(card.isOwner || (card.playedById && card.playedById === viewerPlayerId));
              const isHighlighted = checkCardHighlight(card, 'ally');
              const isDimmed = checkCardDimmed(card, 'ally');
              const cardSynergy = allySynergies[card.id];

              return (
                <div key={`ally-${idx}-${card.id}`} className="relative group">
                  <Card
                    card={card}
                    isShadow={card.isShadow}
                    isRevealed={isRoundOver}
                    isOwner={isOwner}
                    isTeammate={true}
                    compact
                    synergy={cardSynergy}
                    isHighlighted={isHighlighted}
                    isDimmed={isDimmed}
                    onMouseEnter={() => {
                      setHoveredCardId(card.id);
                    }}
                    onMouseLeave={() => setHoveredCardId(null)}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Pie de tropas propias: Etiqueta y Conteo */}
        <div className="flex items-center justify-between text-[11px] px-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold tracking-wider uppercase text-[10px] ${allyColor}`}>
              {allyLabel}
            </span>
            <span className="font-serif text-[10px] text-slate-400">
              ({allyCards.length} {allyCards.length === 1 ? ui.common.card : ui.common.cards})
            </span>
          </div>

          {allyScore.hiddenCount > 0 && (
            <span
              className="bg-purple-950/70 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-serif font-bold tracking-wider uppercase flex items-center gap-0.5"
              title={isEn ? "Hidden shadow cards" : "Cartas sombras ocultas"}
            >
              <span>+{allyScore.hiddenCount}</span>
              <span className="text-[8px]">{ui.game.card.shadowBadge}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
