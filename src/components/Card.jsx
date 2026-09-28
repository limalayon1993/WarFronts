import React from 'react';
import { SUITS } from '../constants/rules';
import { Shield, Sparkles, EyeOff } from 'lucide-react';

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
}) {
  const suitInfo = card ? SUITS[card.suit] : null;
  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';

  // Si es una carta de sombra no revelada:
  if (isShadow && !isRevealed) {
    // Si NO es la persona que la lanzó (rivales Y compañeros de equipo):
    // Solo ven el reverso oscuro y misterioso de la carta sombra
    if (!isOwner) {
      return (
        <div
          onClick={isPlayable ? onClick : undefined}
          className={`
            relative rounded-lg transition-all duration-200 select-none
            bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950
            border-2 border-indigo-600/70 shadow-lg flex flex-col items-center justify-center
            ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34'}
            ${isSelected ? 'ring-4 ring-purple-400 scale-105' : ''}
            ${isPlayable ? 'cursor-pointer hover:border-indigo-400 hover:-translate-y-1' : ''}
          `}
        >
          <div className="absolute inset-1 rounded border border-indigo-500/20 bg-indigo-950/40 flex flex-col items-center justify-center p-1 text-center">
            <EyeOff className="w-5 h-5 text-indigo-400/80 mb-0.5 animate-pulse" />
            <span className="text-[9px] font-bold text-indigo-300 tracking-wider uppercase">Sombra</span>
            <span className="text-[7px] text-slate-500 hidden sm:block">Oculta</span>
          </div>
        </div>
      );
    }

    // Si SÍ es la persona que la lanzó (isOwner === true):
    // La persona que la lanza SÍ puede ver su propia carta con el indicador "TU SOMBRA"
    return (
      <div
        onClick={isPlayable ? onClick : undefined}
        className={`
          relative rounded-lg transition-all duration-150 select-none flex flex-col justify-between
          ${isTrump 
            ? 'bg-amber-50 border-2 border-purple-500 ring-2 ring-purple-500/70 shadow-purple-900/40 shadow-lg' 
            : 'bg-zinc-100 border-2 border-purple-500 ring-2 ring-purple-500/70 shadow-purple-900/40 shadow-lg'}
          ${compact ? 'w-12 h-16 sm:w-14 sm:h-20 p-1' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34 p-1.5 sm:p-2'}
          ${isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''}
          ${isPlayable ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-lg' : ''}
        `}
      >
        {/* Insignia de Palo Triunfo */}
        {isTrump && (
          <div className="absolute -top-2 -right-2 bg-amber-500 text-zinc-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10">
            <Sparkles className="w-2.5 h-2.5" />
            +2
          </div>
        )}

        {/* Esquina superior izquierda */}
        <div className={`flex flex-col items-center leading-none ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
          <span className={`font-black tracking-tighter ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
            {card.rank}
          </span>
          <span className={`${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {suitInfo?.symbol}
          </span>
        </div>

        {/* Centro de la carta */}
        <div className={`flex flex-col items-center justify-center ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
          <span className={`${compact ? 'text-base sm:text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} opacity-90`}>
            {suitInfo?.symbol}
          </span>
        </div>

        {/* Esquina inferior derecha (invertida) */}
        <div className={`flex flex-col items-center leading-none rotate-180 ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
          <span className={`font-black tracking-tighter ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
            {card.rank}
          </span>
          <span className={`${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {suitInfo?.symbol}
          </span>
        </div>
      </div>
    );
  }

  // Carta boca abajo genérica (ej. mano oculta del bot)
  if (!card) {
    return (
      <div
        className={`
          relative rounded-lg bg-gradient-to-br from-slate-800 to-slate-950
          border border-slate-700 shadow-md flex items-center justify-center
          ${compact ? 'w-12 h-16 sm:w-14 sm:h-20' : 'w-16 h-24 sm:w-20 sm:h-28'}
        `}
      >
        <Shield className="w-4 h-4 text-slate-600" />
      </div>
    );
  }

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative rounded-lg transition-all duration-150 select-none flex flex-col justify-between
        ${isTrump 
          ? 'bg-amber-50 border-2 border-amber-500 shadow-amber-500/20 shadow-lg' 
          : 'bg-zinc-100 border border-zinc-300 shadow-md'}
        ${compact ? 'w-12 h-16 sm:w-14 sm:h-20 p-1' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34 p-1.5 sm:p-2'}
        ${isSelected ? 'ring-4 ring-amber-400 scale-105 shadow-xl -translate-y-2' : ''}
        ${isPlayable ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-lg' : ''}
        ${isRevealed && isShadow ? 'ring-2 ring-purple-500 animate-bounce' : ''}
      `}
    >
      {/* Insignia de Palo Triunfo */}
      {isTrump && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-zinc-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10">
          <Sparkles className="w-2.5 h-2.5" />
          +2
        </div>
      )}

      {/* Indicador de Carta Sombra que ha sido revelada */}
      {isRevealed && isShadow && (
        <div className="absolute -top-2 -left-2 bg-purple-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow z-10">
          REVELADA
        </div>
      )}

      {/* Esquina superior izquierda */}
      <div className={`flex flex-col items-center leading-none ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
        <span className={`font-black tracking-tighter ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
          {card.rank}
        </span>
        <span className={`${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
          {suitInfo?.symbol}
        </span>
      </div>

      {/* Centro de la carta */}
      <div className={`flex items-center justify-center ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
        <span className={`${compact ? 'text-base sm:text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} opacity-90`}>
          {suitInfo?.symbol}
        </span>
      </div>

      {/* Esquina inferior derecha (invertida) */}
      <div className={`flex flex-col items-center leading-none rotate-180 ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
        <span className={`font-black tracking-tighter ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
          {card.rank}
        </span>
        <span className={`${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
          {suitInfo?.symbol}
        </span>
      </div>
    </div>
  );
}
