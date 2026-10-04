import React, { useState } from 'react';
import { X, Shield, Swords, Sparkles, EyeOff, Trophy, Users, TrendingUp, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function RulesModal({ isOpen, onClose }) {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">
              {isEn ? 'Official Rules: WarFronts (v1.6)' : 'Reglamento Oficial: Frentes de Guerra (v1.6)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Objective & Fronts' : 'Objetivo y Frentes'}
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'values'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Points & Synergies' : 'Puntos y Sinergias'}
          </button>
          <button
            onClick={() => setActiveTab('shadows')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'shadows'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Shadows & Limits' : 'Sombra y Límites'}
          </button>
          <button
            onClick={() => setActiveTab('ties')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'ties'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Tiebreakers' : 'Desempates'}
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  {isEn ? 'Objective & Match Durations' : 'Objetivo y Duraciones de Partida'}
                </h3>
                <p>
                  {isEn ? (
                    <>The match is contested across a fixed number of rounds depending on the chosen duration: <strong className="text-amber-400">Short (4 rounds)</strong>, <strong className="text-amber-400">Medium (6 rounds)</strong>, or <strong className="text-amber-400">Long (8 rounds)</strong>. The team winning the majority of round points is declared the victor. In case of a tie, cumulative points decide the match.</>
                  ) : (
                    <>La partida se disputa a un número fijo de rondas según la duración elegida: <strong className="text-amber-400">Corta (4 rondas)</strong>, <strong className="text-amber-400">Mediana (6 rondas)</strong> o <strong className="text-amber-400">Larga (8 rondas)</strong>. El bando que gane la mayoría de puntos de ronda se declara vencedor. En caso de empate, decide la puntuación acumulada.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-emerald-400" />
                  {isEn ? 'Round Goal & Team Clocks' : 'Objetivo de la Ronda y Reloj de Equipo'}
                </h3>
                <p>
                  {isEn ? (
                    <>Achieve the highest total numerical value in at least <strong className="text-emerald-400">2 of the 3 WarFronts</strong> (Left, Center, and Right) at the end of deployment.</>
                  ) : (
                    <>Obtener el mayor valor numérico total en al menos <strong className="text-emerald-400">2 de los 3 Frentes de Guerra</strong> (Izquierdo, Central y Derecho) al terminar el despliegue.</>
                  )}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {isEn ? (
                    <>Time is regulated by a <strong className="text-slate-200">Shared Team Clock</strong> (Fast, Medium, or Slow) consumed during teammates' turns and toggled to the rival after each play. If a clock hits 00:00 (Flag Fall), the rival immediately wins the round (+1 Point) and table points are tallied.</>
                  ) : (
                    <>El tiempo de juego es un <strong className="text-slate-200">Reloj Compartido de Equipo</strong> (Rápido, Medio o Lento) que se consume durante los turnos de sus integrantes y conmuta al rival tras cada carta jugada. Si un reloj llega a 00:00 (Caída de Bandera), el rival gana de inmediato la ronda (+1 Punto) y se contabilizan los puntos en mesa.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  {isEn ? 'Continuous Deck' : 'Continuidad del Mazo'}
                </h3>
                <p>
                  {isEn ? (
                    <>Played cards are NOT reshuffled at round end; they go to the discard pile. This allows strategic card counting of high ranks and suits already revealed.</>
                  ) : (
                    <>Las cartas jugadas NO se rebarajan al terminar cada ronda; van al pozo de descarte. Esto permite memorizar y contar cartas clave, figuras y palos que ya han salido.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">
                  {isEn ? 'Base Card Values' : 'Valores Base de las Cartas'}
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <li className="bg-slate-900 p-2 rounded border border-slate-800">{isEn ? 'Cards 2 to 10 = Face value' : 'Cartas 2 al 10 = Valor nominal'}</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'J (Jack)' : 'J (Jota)'}</strong> = 11 pts</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'Q (Queen)' : 'Q (Reina)'}</strong> = 12 pts</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'K (King)' : 'K (Rey)'}</strong> = 13 pts</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'A (Ace)' : 'A (As)'}</strong> = 14 pts</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" /> {isEn ? 'Suit Synergy (+5 Points)' : 'Sinergia de Palo (+5 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>For each additional card of the same suit placed on a Front, add a <strong className="text-indigo-400">+5 points</strong> bonus.</>
                  ) : (
                    <>Por cada carta adicional del mismo palo que coloques en un mismo Frente, sumas un bono de <strong className="text-indigo-400">+5 puntos</strong>.</>
                  )}
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>{isEn ? 'Example:' : 'Ejemplo:'}</em> {isEn ? '10♥ and K♥ in Center: 10 + 13 = 23 base + 5 synergy = 28 points. With 3 cards of the same suit add +10 pts, etc.' : '10♥ y K♥ en el centro: 10 + 13 = 23 base + 5 de sinergia = 28 puntos. Con 3 cartas del mismo palo sumas +10 pts, etc.'}
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-emerald-400">
                  <Users className="w-4 h-4" /> {isEn ? 'Pair (+10 Points)' : 'Pareja (+10 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Two cards of the same numerical rank on the same front grant a <strong className="text-emerald-400">+10 points</strong> bonus.</>
                  ) : (
                    <>Dos cartas del mismo valor numérico en el mismo frente suman un bono de <strong className="text-emerald-400">+10 puntos</strong>.</>
                  )}
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>{isEn ? 'Example:' : 'Ejemplo:'}</em> 8♠ + 8♦: 8 + 8 = 16 {isEn ? 'base' : 'base'} + 10 = <strong>26 {isEn ? 'points' : 'puntos'}</strong>.
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-amber-400">
                  <TrendingUp className="w-4 h-4" /> {isEn ? 'Short Straight (+15 Points)' : 'Escalera Corta (+15 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Three cards of consecutive values on the same front grant a <strong className="text-amber-400">+15 points</strong> bonus.</>
                  ) : (
                    <>Tres cartas de valores consecutivos en el mismo frente otorgan un bono de <strong className="text-amber-400">+15 puntos</strong>.</>
                  )}
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>{isEn ? 'Example:' : 'Ejemplo:'}</em> 4, 5, 6 (or J, Q, K, or Q, K, A): {isEn ? 'base sum + 15 points.' : 'suma los valores base + 15 puntos.'}
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-rose-400">
                  <Flame className="w-4 h-4" /> {isEn ? 'Trio (+20 Points)' : 'Trío (+20 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Three cards of the same numerical rank on the same front grant a <strong className="text-rose-400">+20 points</strong> bonus.</>
                  ) : (
                    <>Tres cartas del mismo valor numérico en el mismo frente suman un bono de <strong className="text-rose-400">+20 puntos</strong>.</>
                  )}
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-amber-300/90 font-medium">
                  <em>{isEn ? 'Official Clarification:' : 'Aclaración Oficial:'}</em> {isEn ? 'Forming a Trio automatically annuls the Pair bonus for those cards (the +20 of the Trio applies; they do not stack +20 and +10 for the same cards).' : 'Formar un Trío anula automáticamente la bonificación de la Pareja para esas cartas (se aplican los +20 del Trío, no se acumulan +20 y +10 por las mismas cartas).'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shadows' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-purple-400">
                  <EyeOff className="w-4 h-4" /> {isEn ? 'Shadow Cards (Face-Down)' : 'Cartas de Sombra (Boca Abajo)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>In 1v1 mode you have <strong className="text-purple-400">2 Shadow Markers</strong> per round. In team modes, Shadow Markers belong to the team as a shared pool: <strong className="text-purple-400">2 in 2v2, 3 in 3v3, and 4 in 4v4</strong>. Any player on the team can deploy cards face-down as long as the team has shadow markers remaining in its pool. Shadow cards remain concealed from opponents, but are <strong className="text-purple-300">completely visible to your entire team</strong> (highlighted with a purple border). Opponents will not know their rank or score until the round concludes.</>
                  ) : (
                    <>En el modo 1v1 dispones de <strong className="text-purple-400">2 Marcadores de Sombra</strong> por ronda. En los modos por equipos, las cartas sombra pertenecen al equipo y forman un fondo común: <strong className="text-purple-400">2 en 2v2, 3 en 3v3 y 4 en 4v4</strong>. Cualquier jugador del equipo puede jugar cartas boca abajo mientras al equipo le queden marcadores en su fondo. Las cartas sombra permanecen ocultas para el rival, pero son <strong className="text-purple-300">completamente visibles para todo tu equipo</strong> (rodeadas con un distintivo borde morado). Tu rival no sabrá qué carta es ni qué puntuación aporta hasta que concluya el despliegue de la ronda.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">
                  {isEn ? 'Shared Front Limit (Saturation)' : 'Límite Territorial Compartido (Saturación)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>In 1v1 and 2v2 modes a <strong className="text-rose-400">maximum of 8 cards total per Front</strong> is enforced, summing cards from both teams.</>
                  ) : (
                    <>En partidas 1v1 y 2v2 se establece un <strong className="text-rose-400">máximo de 8 cartas en total por Frente</strong> sumando las cartas de ambos contrincantes.</>
                  )}
                </p>
                <p className="text-xs mt-2 text-slate-400">
                  {isEn ? (
                    <>As soon as a Front reaches 8 cards, it becomes <em>saturated</em> and no further troops can be deployed there for the rest of the round.</>
                  ) : (
                    <>En cuanto un Frente alcanza 8 cartas, queda <em>saturado</em> y no se pueden jugar más tropas en él durante el resto de la ronda.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ties' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">
                  {isEn ? '1. Front Tiebreaker' : '1. Desempate en un Frente'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>If both sides tie in exact points on a front, the side holding the <strong className="text-amber-400">highest base-value card</strong> on that front wins it. If the exact tie persists, the front is declared Void.</>
                  ) : (
                    <>Si ambos jugadores igualan en puntuación exacta en un frente, lo gana quien posea la <strong className="text-amber-400">carta individual de mayor valor base</strong> en él. Si aún persiste el empate, el frente queda Nulo.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">
                  {isEn ? '2. Match Tiebreaker (Cumulative Points)' : '2. Desempate de la Partida (Puntos Acumulados)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>If round points are tied at match end (e.g. 2-2 or 3-3), the team with the <strong className="text-emerald-400">highest cumulative numerical score</strong> across all fronts wins the match.</>
                  ) : (
                    <>Si al terminar todas las rondas hay empate a rondas ganadas (ej. 2-2 o 3-3), gana el jugador que sume la <strong className="text-emerald-400">mayor cantidad de puntos numéricos acumulados</strong> a lo largo de toda la partida.</>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            {isEn ? 'Understood, return to battle' : 'Entendido, volver al combate'}
          </button>
        </div>
      </div>
    </div>
  );
}
