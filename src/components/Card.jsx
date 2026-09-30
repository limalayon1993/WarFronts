import React from 'react';
import { SUITS } from '../constants/rules';
import { useLanguage } from '../context/LanguageContext';

export function Card({
  card,
  isShadow = false,
  isRevealed = false,
  isOwner = false,
  isSelected = false,
  isTrump = false,
  isPlayable = false,
  compact = false,
  onClick,
  onDragStart,
  onDragEnd,
}) {
  const { ui } = useLanguage();
  const suitInfo = card ? SUITS[card.suit] : null;
  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';

  // Si es una carta de sombra no revelada:
  if (isShadow && !isRevealed) {
    // Si NO es la persona que la lanzó (rivales Y compañeros de equipo):
    // Solo ven el reverso oscuro y solemne de la carta sombra de alta gama
    if (!isOwner) {
      return (
        <div
          onClick={isPlayable ? onClick : undefined}
          className={`
            relative rounded-lg transition-all duration-200 select-none
            casino-shadow-back flex flex-col items-center justify-center
            ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34'}
            ${isSelected ? 'ring-2 ring-purple-400 scale-105 shadow-purple-900/50 shadow-xl' : ''}
            ${isPlayable ? 'cursor-pointer hover:border-purple-400 hover:-translate-y-1' : ''}
          `}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-purple-500/40 bg-black/60 flex flex-col items-center justify-center p-0.5 text-center shadow-inner">
            <span className="text-[8px] sm:text-[9px] font-serif font-black text-purple-300 tracking-wider">S</span>
          </div>
          <span className="text-[7px] sm:text-[8px] font-serif font-bold text-purple-300/80 tracking-widest uppercase mt-1">
            {ui.game.card.shadowBadge}
          </span>
        </div>
      );
    }

    // Si SÍ es la persona que la lanzó (isOwner === true):
    // La persona que la lanza SÍ puede ver su propia carta con el sello de Sombra Privada
    return (
      <div
        onClick={isPlayable ? onClick : undefined}
        className={`
          relative rounded-lg transition-all duration-150 select-none
          ${isTrump ? 'casino-card-face-trump border-2 border-purple-600/80 ring-1 ring-amber-400/50' : 'casino-card-face border-2 border-purple-600/70'}
          ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34'}
          ${isSelected ? 'ring-2 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''}
          ${isPlayable ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-lg' : ''}
        `}
      >
        {/* Insignia de Palo Triunfo */}
        {isTrump && (
          <div className="absolute -top-2 -right-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 text-[8px] font-serif font-black px-1.5 py-0.5 rounded shadow-md z-20 pointer-events-none tracking-tight">
            +2
          </div>
        )}

        {/* Sello de Sombra propia */}
        <div className="absolute -top-2 -left-1.5 bg-purple-950 text-purple-200 border border-purple-600/60 text-[7px] font-serif font-bold px-1.5 py-0.5 rounded shadow z-20 pointer-events-none tracking-wider uppercase">
          {ui.game.card.shadowBadge}
        </div>

        {/* Contenedor interno recortado al borde redondeado de la carta */}
        <div className={`w-full h-full overflow-hidden rounded-[inherit] relative flex flex-col justify-between ${compact ? 'p-1' : 'p-1.5 sm:p-2'}`}>
          {/* Esquina superior izquierda */}
          <div className={`flex flex-col items-center leading-none self-start z-10 ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
            <span className={`font-serif font-black tracking-tight leading-none ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
              {card.rank}
            </span>
            <span className={`leading-none mt-0.5 ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm md:text-base'}`}>
              {suitInfo?.symbol}
            </span>
          </div>

          {/* Centro de la carta */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
            <span className={`${compact ? 'text-base sm:text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} opacity-90 select-none`}>
              {suitInfo?.symbol}
            </span>
          </div>

          {/* Esquina inferior derecha (invertida, solo en cartas no compactas para evitar solapamiento con el nombre) */}
          {!compact && (
            <div className={`flex flex-col items-center leading-none self-end rotate-180 z-10 ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
              <span className="font-serif font-black tracking-tight leading-none text-sm sm:text-base md:text-lg">
                {card.rank}
              </span>
              <span className="leading-none mt-0.5 text-xs sm:text-sm md:text-base">
                {suitInfo?.symbol}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Carta boca abajo genérica (ej. mano oculta de rival/bot o no revelada en mazo)
  if (!card || card.isHidden || !card.rank || card.rank === '?') {
    return (
      <div
        className={`
          relative rounded-lg casino-card-back flex items-center justify-center select-none transition-transform
          ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34'}
        `}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-amber-500/30 bg-black/60 flex items-center justify-center shadow-inner">
          <span className="text-[9px] font-serif font-black text-amber-400/80">W</span>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable={isPlayable}
      onDragStart={isPlayable ? onDragStart : undefined}
      onDragEnd={isPlayable ? onDragEnd : undefined}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative rounded-lg transition-all duration-150 select-none
        ${isTrump ? 'casino-card-face-trump border border-amber-400/60' : 'casino-card-face border border-stone-300'}
        ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34'}
        ${isSelected ? 'ring-2 ring-amber-400 scale-105 shadow-[0_10px_25px_rgba(212,175,55,0.3)] -translate-y-2' : ''}
        ${isPlayable ? 'cursor-grab active:cursor-grabbing hover:-translate-y-1.5 hover:shadow-lg' : ''}
        ${isRevealed && isShadow ? 'ring-2 ring-purple-500' : ''}
      `}
    >
      {/* Insignia de Palo Triunfo */}
      {isTrump && (
        <div className="absolute -top-2 -right-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 text-[8px] font-serif font-black px-1.5 py-0.5 rounded shadow-md z-20 pointer-events-none tracking-tight">
          +2
        </div>
      )}

      {/* Indicador de Carta Sombra que ha sido revelada */}
      {isRevealed && isShadow && (
        <div className="absolute -top-2 -left-1.5 bg-purple-950 text-purple-200 border border-purple-600/60 text-[7px] font-serif font-bold px-1.5 py-0.5 rounded shadow z-20 pointer-events-none tracking-wider uppercase">
          {ui.game.card.revealedBadge}
        </div>
      )}

      {/* Contenedor interno recortado al borde redondeado de la carta */}
      <div className={`w-full h-full overflow-hidden rounded-[inherit] relative flex flex-col justify-between ${compact ? 'p-1' : 'p-1.5 sm:p-2'}`}>
        {/* Esquina superior izquierda */}
        <div className={`flex flex-col items-center leading-none self-start z-10 ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
          <span className={`font-serif font-black tracking-tight leading-none ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
            {card.rank}
          </span>
          <span className={`leading-none mt-0.5 ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm md:text-base'}`}>
            {suitInfo?.symbol}
          </span>
        </div>

        {/* Centro de la carta */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
          <span className={`${compact ? 'text-base sm:text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} opacity-90 select-none`}>
            {suitInfo?.symbol}
          </span>
        </div>

        {/* Esquina inferior derecha (invertida, solo en cartas grandes para no estorbar en el tablero) */}
        {!compact && (
          <div className={`flex flex-col items-center leading-none self-end rotate-180 z-10 ${isRed ? 'text-rose-700' : 'text-stone-900'}`}>
            <span className="font-serif font-black tracking-tight leading-none text-sm sm:text-base md:text-lg">
              {card.rank}
            </span>
            <span className="leading-none mt-0.5 text-xs sm:text-sm md:text-base">
              {suitInfo?.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
