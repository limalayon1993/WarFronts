import React, { useState } from 'react';
import { X, Shield, Swords, Sparkles, EyeOff, Trophy, Users, TrendingUp, Flame, Scale, PartyPopper } from 'lucide-react';
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
              {isEn ? 'Official Rules: WarFronts (v2.1 Unified)' : 'Reglamento Oficial: Frentes de Guerra (v2.1 Unificado)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Objective & Fronts' : 'Objetivo y Frentes'}
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'values'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Unified Scale & Synergies' : 'Escala Unificada y Sinergias'}
          </button>
          <button
            onClick={() => setActiveTab('shadows')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'shadows'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Shadows & Limits' : 'Sombra y Límites'}
          </button>
          <button
            onClick={() => setActiveTab('ties')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ties'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? 'Tiebreakers' : 'Desempates'}
          </button>
          <button
            onClick={() => setActiveTab('casual')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'casual'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isEn ? '🎉 Casual Mode (3 Changes)' : '🎉 Modo Casual (3 Cambios)'}
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
                    <>The match is contested across a fixed even number of rounds: <strong className="text-amber-400">Short (4 rounds)</strong>, <strong className="text-amber-400">Medium (6 rounds)</strong>, or <strong className="text-amber-400">Long (8 rounds)</strong>. The team obtaining the highest total of Round Points is declared victor. In case of a tie, the winner is decided by remaining unspent Shadow Markers in the Team Pool (Shadow Efficiency) or 2-round Overtime.</>
                  ) : (
                    <>La partida se disputa a un número fijo de rondas pares: <strong className="text-amber-400">Corta (4 rondas)</strong>, <strong className="text-amber-400">Mediana (6 rondas)</strong> o <strong className="text-amber-400">Larga (8 rondas)</strong>. El bando que obtenga la mayor cantidad de Puntos de Ronda se declara vencedor. En caso de empate, decide la reserva de marcadores de sombra sobrantes en el Fondo de Equipo o una Prórroga de 2 rondas.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-emerald-400" />
                  {isEn ? 'Round Scoring (1, 2 & 3 Points) & Team Clocks' : 'Puntuación por Ronda (1, 2 y 3 Puntos) y Reloj de Equipo'}
                </h3>
                <p>
                  {isEn ? (
                    <>Conquer the 3 WarFronts (Left, Center, and Right). At the end of deployment, Round Points are awarded: <strong className="text-sky-400">Tie in fronts (+1 Point for EACH team)</strong>, <strong className="text-emerald-400">Standard Victory — 2 fronts won (+2 Points)</strong>, or <strong className="text-amber-400">Full Sweep / "Pleno" — all 3 fronts won (+3 Points)</strong>.</>
                  ) : (
                    <>Conquista los 3 Frentes de Guerra (Izquierdo, Central y Derecho). Al terminar el despliegue, los Puntos de Ronda se reparten: <strong className="text-sky-400">Empate en la ronda (+1 Punto para CADA equipo)</strong>, <strong className="text-emerald-400">Victoria estándar — ganar 2 frentes (+2 Puntos)</strong> o <strong className="text-amber-400">Dominio Total / "Pleno" — ganar los 3 frentes (+3 Puntos)</strong>.</>
                  )}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {isEn ? (
                    <>In Competitive Mode, time is regulated by a <strong className="text-slate-200">Shared Team Clock</strong> (Fast, Medium, or Slow) consumed during teammates' turns. If a clock hits 00:00 (Flag Fall), the rival immediately wins the round (+2 Round Points, or +3 if already leading all 3 fronts with all rival cards played).</>
                  ) : (
                    <>En Modo Competitivo, el tiempo es un <strong className="text-slate-200">Reloj Compartido de Equipo</strong> (Rápido, Medio o Lento) que se consume durante los turnos de sus integrantes. Si un reloj llega a 00:00 (Caída de Bandera), el rival gana de inmediato la ronda (+2 Puntos de Ronda, o +3 si ya dominaba los 3 frentes habiendo jugado todas sus cartas).</>
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
                    <>Cards played are NOT reshuffled at round end; they remain in the discard pile. This allows strategic card counting of high ranks and suits already revealed.</>
                  ) : (
                    <>Las cartas jugadas NO se rebarajan al terminar cada ronda; van al pozo de descarte. Esto permite memorizar y contar cartas clave, figuras y palos que ya han salido.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30">
                <h3 className="font-bold text-emerald-400 mb-2">
                  {isEn ? 'Unified Tactical Scale (Base 1 to 4 Points — All Modes)' : 'Escala Táctica Unificada (Base 1 a 4 Puntos — Todos los Modos)'}
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                  <li className="bg-slate-900 p-2 rounded border border-slate-800 text-center font-medium"><strong>2, 3, 4, 5, 6</strong> = 1 pt</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800 text-center font-medium"><strong>7, 8, 9, 10</strong> = 2 pts</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800 text-center font-medium"><strong>J, Q, K</strong> = 3 pts</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800 text-center font-medium"><strong className="text-amber-400">As (A)</strong> = 4 pts</li>
                </ul>
                <p className="text-xs text-amber-200/90 italic">
                  {isEn
                    ? '• Nominal hierarchy (2 < 3 < ... < K < A) is preserved intact for forming straights, pairs/trios, and breaking front ties.'
                    : '• La jerarquía nominal (2 < 3 < ... < K < A) se conserva intacta para escaleras, parejas/tríos y desempate de frentes.'}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" /> {isEn ? 'Suit Synergy (+1 Point per Additional Card)' : 'Sinergia de Palo (+1 Punto por Carta Adicional)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>For each additional card of the same suit placed on a Front: 2 cards = <strong className="text-indigo-400">+1 pt</strong>, 3 cards = <strong className="text-indigo-400">+2 pts</strong>, 4 cards = <strong className="text-indigo-400">+3 pts</strong>, etc., with no cap.</>
                  ) : (
                    <>Por cada carta adicional del mismo palo en el frente: 2 cartas = <strong className="text-indigo-400">+1 pt</strong>, 3 cartas = <strong className="text-indigo-400">+2 pts</strong>, 4 cartas = <strong className="text-indigo-400">+3 pts</strong>, etc., sin límite máximo.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-amber-400">
                  <Users className="w-4 h-4" /> {isEn ? 'Pair (+2 Points)' : 'Pareja (+2 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Two cards of the same nominal rank on the same front grant a <strong className="text-amber-400">+2 points</strong> bonus.</>
                  ) : (
                    <>Dos cartas del mismo valor nominal en el mismo frente suman un bono de <strong className="text-amber-400">+2 puntos</strong>.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-cyan-400">
                  <TrendingUp className="w-4 h-4" /> {isEn ? 'Short Straight (+4 Points)' : 'Escalera Corta (+4 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Three cards of consecutive nominal rank on the same front grant a <strong className="text-cyan-400">+4 points</strong> bonus (e.g. 5-6-7 or J-Q-K).</>
                  ) : (
                    <>Tres cartas de valor nominal consecutivo en el mismo frente otorgan un bono de <strong className="text-cyan-400">+4 puntos</strong> (ej. 5-6-7 o J-Q-K).</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-rose-400">
                  <Flame className="w-4 h-4" /> {isEn ? 'Trio (+5 Points)' : 'Trío (+5 Puntos)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Three cards of the same nominal rank on the same front grant a <strong className="text-rose-400">+5 points</strong> bonus. Forming a Trio automatically cancels the Pair bonus for those same cards.</>
                  ) : (
                    <>Tres cartas del mismo valor nominal en el mismo frente suman un bono de <strong className="text-rose-400">+5 puntos</strong>. Formar un Trío anula automáticamente la bonificación de Pareja de esas mismas cartas.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shadows' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-purple-400">
                  <EyeOff className="w-4 h-4" /> {isEn ? 'Shadow Economy & Silent Show' : 'Economía de Sombras y Vistazo de Equipo'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>Both teams start Round 1 with <strong className="text-purple-400">0 Shadow Markers</strong>. At the end of each round, teams earn Shadow Markers into their shared pool based on the result (1v1/2v2: Win +1, Loss +2, Streak 2+ +3, Tie +1; 3v3: +2/+3/+4/+2; 4v4: +2/+4/+5/+2) with continuous saving across rounds. When playing a Shadow Card, it is shown silently to teammates before placing it face-down (visible to your entire team with a purple border), remaining hidden from opponents until round end.</>
                  ) : (
                    <>Ambos equipos inician la Ronda 1 con <strong className="text-purple-400">0 Marcadores de Sombra</strong>. Al final de cada ronda, los equipos cobran Marcadores de Sombra para su fondo común según el resultado (1v1/2v2: Gana +1, Pierde +2, Racha 2+ +3, Empate +1; 3v3: +2/+3/+4/+2; 4v4: +2/+4/+5/+2) con ahorro continuo entre rondas. Al jugar una Carta Sombra, se enseña en silencio al equipo antes de bajarla boca abajo (visible para tu equipo con borde morado), permaneciendo oculta para el rival hasta el final de la ronda.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">
                  {isEn ? 'Shared Front Limit (Saturation)' : 'Límite Territorial Compartido (Saturación)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>In 1v1 and 2v2 modes a <strong className="text-rose-400">maximum of 8 cards total per Front</strong> is enforced (12 in 3v3; 16 in 4v4), summing cards from both teams. Once full, the front is saturated and closes.</>
                  ) : (
                    <>En 1v1 y 2v2 se establece un <strong className="text-rose-400">máximo de 8 cartas en total por Frente</strong> (12 en 3v3; 16 en 4v4) sumando las cartas de ambos contrincantes. Al llenarse, queda saturado y se cierra.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ties' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  {isEn ? '1. Front Tiebreaker (Nominal Hierarchy)' : '1. Desempate en un Frente (Jerarquía Nominal)'}
                </h3>
                <p className="text-xs">
                  {isEn ? (
                    <>If both teams tie in exact score on a front, the front is won by the team holding the <strong className="text-amber-400">single card of highest nominal hierarchy (2 &lt; 3 &lt; ... &lt; K &lt; A)</strong> played on it. If the exact tie persists, the front is declared Void.</>
                  ) : (
                    <>Si ambos equipos igualan en puntaje exacto en un frente, gana el equipo que posea la <strong className="text-amber-400">carta individual de mayor jerarquía nominal (2 &lt; 3 &lt; ... &lt; K &lt; A)</strong> jugada en él. Si persiste el empate en carta máxima, el frente queda Nulo.</>
                  )}
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  {isEn ? '2. Match Tiebreaker (Shadow Efficiency / Overtime)' : '2. Desempate de Partida (Eficiencia de Sombras / Prórroga)'}
                </h3>
                <ul className="space-y-1.5 text-xs">
                  <li>
                    <strong className="text-purple-300">{isEn ? 'Competitive Mode:' : 'Modo Competitivo:'}</strong>{' '}
                    {isEn
                      ? '1st Criterion (Shadow Efficiency): The team that keeps more unspent Shadow Markers in its Team Pool at the end of the final round wins. 2nd Criterion: If still tied, play a 2-Round Overtime.'
                      : '1.er Criterio (Eficiencia de Sombras): Gana el equipo que conserve más Marcadores de Sombra sin gastar en su Fondo de Equipo al término de la última ronda. 2.º Criterio: Si persiste el empate, se disputan 2 Rondas de Prórroga.'}
                  </li>
                  <li>
                    <strong className="text-emerald-300">{isEn ? 'Casual Mode:' : 'Modo Casual:'}</strong>{' '}
                    {isEn
                      ? 'With no cumulative Team Pool, any tie in total Round Points goes directly to a 2-Round Overtime.'
                      : 'Al no existir Fondo de Sombras acumulable de equipo, cualquier empate en Puntos de Ronda va directamente a Prórroga de 2 rondas.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'casual' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/40">
                <h3 className="font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4" />
                  {isEn ? 'Casual Mode (Party / Friends) — 3 Exclusive Differences' : 'Modo Casual (Party / Amigos) — 3 Diferencias Exclusivas'}
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  {isEn
                    ? 'Uses the exact same rules, phases, card values (1 to 4 pts), and synergy bonuses (+1, +2, +4, +5) of Competitive Mode, applying only 3 adjustments:'
                    : 'Utiliza exactamente las mismas reglas, fases, valores de cartas (1 a 4 pts) y bonificaciones de sinergia (+1, +2, +4, +5) del Modo Competitivo, aplicando únicamente 3 modificaciones:'}
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <strong className="text-teal-300 block mb-0.5">
                      {isEn ? '1. Fixed Individual Shadow' : '1. Sombra Individual Fija'}
                    </strong>
                    <span>
                      {isEn
                        ? 'No shared team pool or post-round income; each player receives exactly 1 Shadow Marker per round (personal, non-transferable, non-cumulative).'
                        : 'No hay Fondo de Sombras de equipo ni ingresos posronda; cada jugador dispone de exactamente 1 Marcador de Sombra por ronda (personal, intransferible y no acumulable).'}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <strong className="text-teal-300 block mb-0.5">
                      {isEn ? '2. Fixed 20s Turn Timer (Auto-play)' : '2. Tiempo Fijo por Turno (20s con Auto-play)'}
                    </strong>
                    <span>
                      {isEn
                        ? 'No dual team clock; each player has 20 seconds per play. If time runs out (00:00), the system auto-plays the 1st card in hand face-up in the valid front with the fewest cards.'
                        : 'No hay reloj dual de equipo; cada jugador tiene 20 segundos por jugada. Si agota el tiempo, el sistema juega automáticamente la 1ª carta de su mano boca arriba en el frente válido con menos cartas.'}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <strong className="text-teal-300 block mb-0.5">
                      {isEn ? '3. Direct Match Tiebreaker' : '3. Desempate Directo de Partida'}
                    </strong>
                    <span>
                      {isEn
                        ? 'A final tie in Round Points goes directly to a 2-Round Overtime.'
                        : 'Empate final en Puntos de Ronda va directo a Prórroga de 2 rondas.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            {isEn ? 'Understood, return to battle' : 'Entendido, volver al combate'}
          </button>
        </div>
      </div>
    </div>
  );
}
