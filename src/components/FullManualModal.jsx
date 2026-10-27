import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Printer,
  Swords,
  Layers,
  Clock,
  EyeOff,
  Trophy,
  Scale,
  UserCheck,
  PartyPopper,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Reglamento Oficial Completo v2.1 — Frentes de Guerra
 * Contenido íntegro y exacto del documento "REGLAMENTO OFICIAL: FRENTES DE GUERRA v2.1 (Sistema Unificado)"
 */
export function FullManualModal({ isOpen, onClose }) {
  const { manual, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  function handlePrint() {
    setActiveTab('all');
    setTimeout(() => {
      window.print();
    }, 100);
  }

  const tabs = [
    { id: 'all', label: manual.tabs.all },
    { id: 'c1', label: manual.tabs.c1 },
    { id: 'c2', label: manual.tabs.c2 },
    { id: 'c3', label: manual.tabs.c3 },
    { id: 'c4', label: manual.tabs.c4 },
    { id: 'c5', label: manual.tabs.c5 },
    { id: 'c6', label: manual.tabs.c6 },
    { id: 'c7', label: manual.tabs.c7 },
    { id: 'c8', label: manual.tabs.c8 },
    { id: 'c9', label: manual.tabs.c9 },
  ];

  const showSection = (id) => activeTab === 'all' || activeTab === id;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #full-manual-printable,
          #full-manual-printable * {
            visibility: visible;
          }
          #full-manual-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #0f172a !important;
            padding: 16px 24px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:rounded-none print:border-none">
        {/* Cabecera Superior */}
        <div className="no-print px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                {manual.headerTitle}
              </h2>
              <p className="text-[11px] text-slate-400">{manual.headerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{manual.printBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title={manual.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación por Capítulos */}
        <div className="no-print px-4 sm:px-6 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Documento Oficial v2.1 */}
        <div
          id="full-manual-printable"
          className="p-5 sm:p-8 overflow-y-auto space-y-7 text-slate-200 text-xs sm:text-sm leading-relaxed"
        >
          {/* Portada del Documento */}
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {manual.coverTitle}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-400 mt-1">
              {manual.coverVersion}
            </p>
          </div>

          {/* 1. INTRODUCCIÓN Y OBJETIVO */}
          {showSection('c1') && (
            <section className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '1. INTRODUCTION AND OBJECTIVE' : '1. INTRODUCCIÓN Y OBJETIVO'}
              </h2>
              <p>
                {isEn ? (
                  <>
                    <strong>WarFronts</strong> is a tactical team card game (2v2, 3v3, and 4v4, plus 1v1 mode in annex) based on zone control, imperfect information, strategic deduction, and teamwork without micromanagement.
                  </>
                ) : (
                  <>
                    <strong>Frentes de Guerra</strong> es un juego táctico de cartas por equipos (2v2, 3v3 y 4v4, además de modo 1v1 en anexo) basado en el control de zonas, la información imperfecta, la deducción estratégica y el trabajo en equipo sin microgestión.
                  </>
                )}
              </p>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li>
                  <strong className="text-white">
                    {isEn ? 'Match Objective:' : 'Objetivo de la Partida:'}
                  </strong>{' '}
                  {isEn ? (
                    <>
                      The match is played over a fixed even number of Rounds to guarantee equal opportunity in initiative rotation. The team that obtains the highest total of <strong>Round Points</strong> at the end of all rounds is declared the winner. In case of a tie in Round Points at the end of the match, the winner is decided by the reserve of leftover Shadow Markers or, if the tie persists, by a 2-round Overtime (see Section 7).
                    </>
                  ) : (
                    <>
                      La partida se disputa a un total fijo de Rondas pares para garantizar la igualdad de oportunidades en la rotación de iniciativa. El equipo que obtenga la mayor cantidad de <strong>Puntos de Ronda</strong> al finalizar todas las rondas se declara vencedor. En caso de empate en Puntos de Ronda al término de la partida, el ganador se resolverá mediante la reserva de Marcadores de Sombra sobrantes o, de persistir la igualdad, mediante una Prórroga de 2 rondas (ver Sección 7).
                    </>
                  )}
                </li>
                <li>
                  <strong className="text-white">
                    {isEn ? 'Official Durations:' : 'Duraciones Oficiales:'}
                  </strong>
                  <ul className="pl-6 mt-1 space-y-1 list-circle text-slate-300">
                    <li>{isEn ? 'Short: 4 rounds.' : 'Corta: 4 rondas.'}</li>
                    <li>{isEn ? 'Medium: 6 rounds.' : 'Mediana: 6 rondas.'}</li>
                    <li>{isEn ? 'Long: 8 rounds.' : 'Larga: 8 rondas.'}</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">
                    {isEn ? 'Round Objective:' : 'Objetivo de la Ronda:'}
                  </strong>{' '}
                  {isEn
                    ? 'Outscore the rival team in the total score of the War Fronts (Left, Center, and Right) at the end of deployment to earn as many Round Points as possible (1, 2, or 3 points depending on conquered fronts).'
                    : 'Superar al equipo rival en la puntuación total de los Frentes de Guerra (Izquierdo, Central y Derecho) al finalizar el despliegue para obtener la mayor cantidad de Puntos de Ronda posibles (1, 2 o 3 puntos según los frentes conquistados).'}
                </li>
              </ul>
            </section>
          )}

          {/* 2. MATERIALES Y GESTIÓN DE MAZOS */}
          {showSection('c2') && (
            <section className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '2. MATERIALS AND DECK MANAGEMENT' : '2. MATERIALES Y GESTIÓN DE MAZOS'}
              </h2>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li>
                  <strong className="text-white">{isEn ? 'Players:' : 'Jugadores:'}</strong>{' '}
                  {isEn ? '1v1 (see Annex 8), 2v2, 3v3, or 4v4.' : '1v1 (ver Anexo 8), 2v2, 3v3 o 4v4.'}
                </li>
                <li>
                  <strong className="text-white">
                    {isEn ? 'Decks (Standard Poker without jokers):' : 'Barajas (Póker estándar sin comodines/jokers):'}
                  </strong>
                  <ul className="pl-6 mt-1 space-y-1">
                    <li>
                      <strong className="text-slate-200">{isEn ? '1v1 and 2v2 Matches:' : 'Partidas 1v1 y 2v2:'}</strong>{' '}
                      {isEn ? '1 Standard Deck (52 cards).' : '1 Baraja estándar (52 cartas).'}
                    </li>
                    <li>
                      <strong className="text-slate-200">{isEn ? '3v3 and 4v4 Matches:' : 'Partidas 3v3 y 4v4:'}</strong>{' '}
                      {isEn ? '2 Standard Decks combined and shuffled (104 cards).' : '2 Barajas estándar combinadas y mezcladas (104 cartas).'}
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Additional Components:' : 'Componentes Adicionales:'}</strong>
                  <ul className="pl-6 mt-1 space-y-1.5">
                    <li>
                      <strong className="text-slate-200">{isEn ? '1 Initiative Token.' : '1 Ficha de Iniciativa.'}</strong>
                    </li>
                    <li>
                      <strong className="text-slate-200">{isEn ? 'Shadow Markers:' : 'Marcadores de Sombra:'}</strong>{' '}
                      {isEn
                        ? 'These markers form the Team Shadow Pool, managed as a continuous economic resource. They can be coins, stones, dice, tokens, or paper. Players do not need to hold them physically; they can stay in the shared team reserve and be placed whenever a member uses one.'
                        : 'Estos marcadores forman el Fondo de Sombras del Equipo, el cual se gestiona como un recurso económico continuo. Pueden ser monedas, piedras, dados, fichas o papel. No tienen por qué tenerlos físicamente los jugadores que van a usarlos; pueden estar en la reserva común del equipo y colocarse cada vez que un miembro hace uso de uno de ellos.'}
                    </li>
                    <li>
                      <strong className="text-slate-200">{isEn ? 'Round Points Marker:' : 'Marcador de Puntos de Ronda:'}</strong>{' '}
                      {isEn
                        ? 'Tokens, dice, or digital scoreboard to track only the Round Points won by each team (1, 2, or 3 points per round). There is no need to write down numerical front sums on paper.'
                        : 'Fichas, dados o marcador digital para llevar únicamente el conteo de los Puntos de Ronda ganados por cada equipo (1, 2 o 3 puntos por ronda). No es necesario anotar sumas numéricas de los frentes en papel.'}
                    </li>
                    <li>
                      <strong className="text-slate-200">{isEn ? '1 Dual Timer (Physical or Digital):' : '1 Cronómetro dual (Físico o Digital):'}</strong>{' '}
                      {isEn
                        ? 'A standard dual timer with two buttons (Team A vs. Team B) capable of independent countdown per team.'
                        : 'Un cronómetro dual estándar con dos pulsadores (Equipo A vs. Equipo B) capaz de realizar cuenta regresiva independiente por equipo.'}
                    </li>
                  </ul>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <h3 className="text-xs sm:text-sm font-black text-teal-400 uppercase">
                  {isEn ? 'Main Deck & Discard Pile Management' : 'Gestión del Mazo Principal y Pozo de Descartes'}
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>
                    <strong className="text-white">{isEn ? 'Main Deck (Draw Pile):' : 'Mazo Principal (Mazo de Robo):'}</strong>{' '}
                    {isEn
                      ? 'The face-down pile from which cards are dealt to players.'
                      : 'Es la pila boca abajo de donde se reparten las cartas a los jugadores.'}
                  </li>
                  <li>
                    <strong className="text-white">{isEn ? 'Discard Pile:' : 'Pozo de Descartes:'}</strong>{' '}
                    {isEn
                      ? 'Face-up pile on the side of the table where all cards played on the fronts are placed at the end of a round.'
                      : 'Pila boca arriba a un lado de la mesa donde se colocan todas las cartas jugadas en los frentes al terminar una ronda.'}
                  </li>
                  <li>
                    <strong className="text-white">{isEn ? 'Continuity & Card Counting Rule:' : 'Regla de Continuidad y Conteo de Cartas:'}</strong>{' '}
                    {isEn
                      ? 'Cards played in a round are NOT reshuffled at the end of that round; they remain in the discard pile. This allows players to perform strategic counting of high cards and potential combinations.'
                      : 'Las cartas jugadas en una ronda NO se rebarajan al finalizar dicha ronda; permanecen en el pozo de descartes. Esto permite a los jugadores realizar un conteo estratégico de cartas altas y posibles combinaciones.'}
                  </li>
                  <li>
                    <strong className="text-white">{isEn ? 'Reshuffle on Exhaustion:' : 'Rebarajado por Agotamiento:'}</strong>{' '}
                    {isEn
                      ? 'When the Main Deck does not have enough cards to deal to each player at the start of a round, take the entire Discard Pile, shuffle thoroughly, and form a new Main Deck.'
                      : 'Cuando el Mazo Principal no tenga suficientes cartas para repartir a cada jugador al inicio de una ronda, se toma todo el Pozo de Descartes, se baraja minuciosamente y se forma un nuevo Mazo Principal.'}
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* 3. DISPOSICIÓN, TIEMPO Y DETERMINACIÓN DE INICIATIVA */}
          {showSection('c3') && (
            <section className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '3. TABLE LAYOUT, TIMERS AND INITIATIVE' : '3. DISPOSICIÓN, TIEMPO Y DETERMINACIÓN DE INICIATIVA'}
              </h2>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li>
                  <strong className="text-white">{isEn ? 'Table Layout:' : 'Disposición de la Mesa:'}</strong>{' '}
                  {isEn
                    ? '3 zones are delimited in the center of the table: Left Front, Center Front, and Right Front. The Main Deck and Discard Pile are placed to the side.'
                    : 'Se delimitan 3 zonas en el centro de la mesa: Frente Izquierdo, Frente Central y Frente Derecho. El Mazo Principal y el Pozo de Descartes se ubican a un costado.'}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Timers by Format:' : 'Tiempos por Formato:'}</strong>{' '}
                  {isEn
                    ? 'Time is shared by the entire team, not individual, so the seconds used by each team member during their turn are subtracted from the team clock. There are three game paces (Fast, Medium, and Slow):'
                    : 'El tiempo es compartido para todo el equipo, no individual, por lo que los segundos que consuma cada componente del equipo durante su turno se restan al reloj de equipo. Existen tres ritmos de juego (Rápido, Medio y Lento):'}
                  <ul className="pl-6 mt-1.5 space-y-1 font-mono text-xs text-amber-200">
                    <li>• 1v1: {isEn ? 'Fast' : 'Rápido'} = 1m 40s (100s) / {isEn ? 'Medium' : 'Medio'} = 3m 20s (200s) / {isEn ? 'Slow' : 'Lento'} = 5m 00s (300s)</li>
                    <li>• 2v2: {isEn ? 'Fast' : 'Rápido'} = 1m 40s (100s) / {isEn ? 'Medium' : 'Medio'} = 3m 20s (200s) / {isEn ? 'Slow' : 'Lento'} = 5m 00s (300s)</li>
                    <li>• 3v3: {isEn ? 'Fast' : 'Rápido'} = 2m 30s (150s) / {isEn ? 'Medium' : 'Medio'} = 5m 00s (300s) / {isEn ? 'Slow' : 'Lento'} = 7m 30s (450s)</li>
                    <li>• 4v4: {isEn ? 'Fast' : 'Rápido'} = 3m 20s (200s) / {isEn ? 'Medium' : 'Medio'} = 6m 40s (400s) / {isEn ? 'Slow' : 'Lento'} = 10m 00s (600s)</li>
                    <li className="font-sans text-slate-400 italic">
                      {isEn
                        ? '• Management Note: The team clock resets to its full value at the start of each new round. Leftover time from a round does not carry over.'
                        : '• Nota de Gestión: El reloj de equipo se reinicia al valor completo al inicio de cada nueva ronda. El tiempo sobrante de una ronda no se acumula para las siguientes.'}
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Initial Initiative (Deck Cut):' : 'Determinación de la Iniciativa Inicial (Corte de Baraja):'}</strong>{' '}
                  {isEn
                    ? 'Before starting Round 1, one representative from each team draws a card from the deck. The team that draws the card of higher nominal hierarchy (2 < 3 < … < K < A) receives the Initiative Token. The drawn cards are then returned to the deck and it is shuffled completely.'
                    : 'Antes de iniciar la Ronda 1, un representante de cada equipo roba una carta del mazo. El equipo que obtenga la carta de mayor jerarquía nominal (2 < 3 < … < K < A) recibe la Ficha de Iniciativa. A continuación, las cartas utilizadas se devuelven al mazo y este se vuelve a barajar completamente.'}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Initiative Rotation:' : 'Rotación de Iniciativa:'}</strong>{' '}
                  {isEn
                    ? 'Starting from Round 2, the Initiative Token rotates automatically to the opposing team at the start of each round, regardless of who won the previous round.'
                    : 'A partir de la Ronda 2, la Ficha de Iniciativa rota automáticamente al equipo contrario al inicio de cada ronda, independientemente de quién haya ganado la ronda anterior.'}
                </li>
              </ul>
            </section>
          )}

          {/* 4. CONCEPTOS CLAVE Y VALORES (ESCALA TÁCTICA UNIFICADA) */}
          {showSection('c4') && (
            <section className="space-y-4 bg-slate-950/60 border border-emerald-500/35 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-emerald-400 uppercase tracking-wide border-l-4 border-emerald-500 pl-3">
                {isEn
                  ? '4. KEY CONCEPTS AND VALUES (UNIFIED TACTICAL SCALE)'
                  : '4. CONCEPTOS CLAVE Y VALORES (ESCALA TÁCTICA UNIFICADA)'}
              </h2>
              <p>
                {isEn
                  ? 'To win a front, each team sums the Base Value of the cards played on it plus Synergy Bonuses. This scale is designed to offer maximum strategic depth with instant mental calculation at the table.'
                  : 'Para ganar un frente, se suma el Valor Base de las cartas jugadas en él por cada equipo más las Bonificaciones por Sinergia. Esta escala está diseñada para ofrecer máxima profundidad estratégica con un cálculo mental instantáneo en mesa.'}
              </p>

              {/* Valor Base de las Cartas (Todos los Modos) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-sky-400 uppercase">
                  {isEn ? 'Base Card Values (All Modes)' : 'Valor Base de las Cartas (Todos los Modos)'}
                </h3>
                <ul className="space-y-1 list-disc list-inside text-slate-200 font-medium">
                  <li>
                    <strong>{isEn ? 'Low Cards (2 to 6):' : 'Cartas Bajas (del 2 al 6):'}</strong>{' '}
                    <span className="text-emerald-400 font-bold">{isEn ? 'Worth 1 point.' : 'Valen 1 punto.'}</span>
                  </li>
                  <li>
                    <strong>{isEn ? 'Mid Cards (7 to 10):' : 'Cartas Medias (del 7 al 10):'}</strong>{' '}
                    <span className="text-emerald-400 font-bold">{isEn ? 'Worth 2 points.' : 'Valen 2 puntos.'}</span>
                  </li>
                  <li>
                    <strong>{isEn ? 'Figures (J, Q, K):' : 'Figuras (J, Q, K):'}</strong>{' '}
                    <span className="text-emerald-400 font-bold">{isEn ? 'Worth 3 points.' : 'Valen 3 puntos.'}</span>
                  </li>
                  <li>
                    <strong>{isEn ? 'Ace (A):' : 'As (A):'}</strong>{' '}
                    <span className="text-emerald-400 font-bold">{isEn ? 'Worth 4 points.' : 'Vale 4 puntos.'}</span>
                  </li>
                </ul>
                <p className="text-xs text-amber-200/90 italic pt-1">
                  <strong>
                    {isEn
                      ? '• Importance of Nominal Hierarchy (2 < 3 < … < K < A):'
                      : '• Importancia de la Jerarquía Nominal (2 < 3 < … < K < A):'}
                  </strong>{' '}
                  {isEn
                    ? 'Even though several cards share the same Base Value in points (for example, a 6 and a 2 are both worth 1 point, or a King and a Jack are both worth 3 points), they keep their nominal hierarchy intact to form Straights, Pairs/Trios, and automatically decide any point tie on a front in favor of the highest card (see Section 6).'
                    : 'Aunque varias cartas compartan el mismo Valor Base en puntos (por ejemplo, un 6 y un 2 valen 1 punto, o un Rey y una Jota valen 3 puntos), conservan intacta su jerarquía nominal para formar Escaleras, Parejas/Tríos y decidir automáticamente a favor de la carta más alta cualquier empate a puntos en un frente (ver Sección 6).'}
                </p>
              </div>

              {/* Bonificaciones por Sinergia (Todos los Modos) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-sky-400 uppercase">
                  {isEn ? 'Synergy Bonuses (All Modes)' : 'Bonificaciones por Sinergia (Todos los Modos)'}
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-200">
                  <li>
                    <strong>{isEn ? 'Suit Synergy (Color):' : 'Sinergia de Palo (Color):'}</strong>{' '}
                    <strong className="text-emerald-400">{isEn ? '+1 Point' : '+1 Punto'}</strong>{' '}
                    {isEn
                      ? 'for each additional card of the same suit on the front (e.g., 2 cards of the same suit add +1 point; 3 cards add +2 points; 4 cards add +3 points, with no maximum cap).'
                      : 'por cada carta adicional del mismo palo en el frente (ej. 2 cartas del mismo palo suman +1 punto; 3 cartas suman +2 puntos; 4 cartas suman +3 puntos, sin límite máximo).'}
                  </li>
                  <li>
                    <strong>{isEn ? 'Pair:' : 'Pareja:'}</strong>{' '}
                    <strong className="text-emerald-400">{isEn ? '+2 Points' : '+2 Puntos'}</strong>{' '}
                    {isEn ? '(2 cards of the same number or letter).' : '(2 cartas del mismo número o letra).'}
                  </li>
                  <li>
                    <strong>{isEn ? 'Short Straight:' : 'Escalera Corta:'}</strong>{' '}
                    <strong className="text-emerald-400">{isEn ? '+4 Points' : '+4 Puntos'}</strong>{' '}
                    {isEn ? '(3 cards of consecutive nominal rank, e.g., 5-6-7 or J-Q-K).' : '(3 cartas de valor nominal consecutivo, ej. 5-6-7 o J-Q-K).'}
                  </li>
                  <li>
                    <strong>{isEn ? 'Trio:' : 'Trío:'}</strong>{' '}
                    <strong className="text-emerald-400">{isEn ? '+5 Points' : '+5 Puntos'}</strong>{' '}
                    {isEn
                      ? '(3 cards of the same number or letter). Clarification: Forming a Trio automatically cancels the Pair bonus for those same cards; you cannot add +5 from the Trio and +2 from the Pair for the same three cards.'
                      : '(3 cartas del mismo número o letra). Aclaración: Formar un Trío anula automáticamente la bonificación de la Pareja de esas mismas cartas; no se pueden sumar los +5 del Trío y los +2 de la Pareja por las mismas tres cartas.'}
                  </li>
                </ul>
              </div>

              {/* Las Cartas de Sombra y el Fondo de Equipo */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-purple-400 uppercase">
                  {isEn ? 'Shadow Cards and the Team Pool' : 'Las Cartas de Sombra y el Fondo de Equipo'}
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>
                    {isEn
                      ? 'Both teams start the first round of the match with zero (0) markers in their Shadow Pool.'
                      : 'Ambos equipos inician la primera ronda de la partida con cero (0) marcadores en su Fondo de Sombras.'}
                  </li>
                  <li>
                    {isEn
                      ? 'During the Tactical Phase, the team decides how many markers from its accumulated reserve it wants to spend that round and distributes them freely among its players according to strategy. Unused markers are kept in the Team Pool for future rounds. A player may receive multiple markers (playing several face-down cards that round) or none.'
                      : 'Durante la Fase de Táctica, el equipo decide cuántos marcadores de su reserva acumulada desea gastar en esa ronda y los reparte libremente entre sus jugadores según su estrategia. Los marcadores no utilizados se conservan en el Fondo de Equipo para rondas futuras. Un jugador puede recibir múltiples marcadores (pudiendo jugar varias cartas boca abajo en esa ronda) o no recibir ninguno.'}
                  </li>
                  <li>
                    <strong className="text-white">
                      {isEn ? 'Silent Show to Teammates (Teammate Peek):' : 'Muestra en Silencio al Equipo (Vistazo de Compañero):'}
                    </strong>{' '}
                    {isEn
                      ? 'Cards played as Shadow remain hidden only from the rival team. When a player decides to play a Shadow Card, before placing it face-down on the chosen front, they must silently show it to their teammates (ensuring the rival team does not see it). Additionally, any player may secretly check the value and suit of Shadow Cards already played by their teammates on the table.'
                      : 'Las cartas jugadas como Sombra permanecerán ocultas únicamente para el equipo rival. En el momento en que un jugador decide jugar una Carta de Sombra, antes de colocarla boca abajo en el frente elegido, debe mostrársela en silencio a sus compañeros de equipo (cuidando de que el equipo rival no la vea). Adicionalmente, cualquier jugador podrá consultar en secreto el valor y palo de las Cartas Sombra ya jugadas por sus compañeros en la mesa si necesita recordarlas.'}
                  </li>
                  <li>
                    <strong className="text-white">
                      {isEn ? 'Using the Shadow Marker (Anti-Cheat Control):' : 'Uso del Marcador de Sombra (Control Anti-trampas):'}
                    </strong>{' '}
                    {isEn
                      ? 'When a player places a card face-down, they must place on top of it or hand over one of the Shadow Markers previously assigned to the team. This guarantees full transparency over how many hidden cards the team has left to play.'
                      : 'En el momento en que un jugador coloca una carta boca abajo, debe situar sobre ella o entregar uno de los Marcadores de Sombra asignados al equipo previamente. Esto garantiza transparencia total sobre cuántas cartas ocultas le quedan por jugar al equipo.'}
                  </li>
                </ul>
              </div>

              {/* Límite Territorial Compartido por Frente */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                <h3 className="text-xs sm:text-sm font-black text-teal-400 uppercase">
                  {isEn ? 'Shared Territorial Limit per Front' : 'Límite Territorial Compartido por Frente'}
                </h3>
                <p className="text-slate-300">
                  {isEn
                    ? 'A maximum total number of slots per Front is established for the sum of cards from both teams: • 1v1 and 2v2 Matches: Maximum 8 cards total per Front. • 3v3 Matches: Maximum 12 cards total per Front. • 4v4 Matches: Maximum 16 cards total per Front. • Closure Rule (Saturation): As soon as a Front reaches this limit with the sum of cards from both teams, it becomes saturated and no more cards can be placed on it for the rest of the round.'
                    : 'Se establece un número máximo de casillas en total por Frente para la suma de las cartas de ambos equipos: • Partidas 1v1 y 2v2: Máximo 8 cartas en total por Frente. • Partidas 3v3: Máximo 12 cartas en total por Frente. • Partidas 4v4: Máximo 16 cartas en total por Frente. • Regla de Cierre (Saturación): En cuanto un Frente alcanza dicho límite con la suma de las cartas de ambos equipos, queda saturado y no se pueden colocar más cartas en él durante el resto de la ronda.'}
                </p>
              </div>
            </section>
          )}

          {/* 5. ESTRUCTURA PASO A PASO DE LA RONDA */}
          {showSection('c5') && (
            <section className="space-y-4 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '5. STEP-BY-STEP ROUND STRUCTURE' : '5. ESTRUCTURA PASO A PASO DE LA RONDA'}
              </h2>
              <p>
                {isEn
                  ? 'Each round is strictly divided into the following sequential phases:'
                  : 'Cada ronda se divide estrictamente en las siguientes fases secuenciales:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* FASE 1 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-sky-300 uppercase">
                    {isEn ? 'PHASE 1: Preparation and Initiative' : 'FASE 1: Preparación e Iniciativa'}
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>
                      {isEn
                        ? 'If the Main Deck does not have enough cards, reshuffle the Discard Pile to form the new deck.'
                        : 'Si el Mazo Principal no tiene suficientes cartas, se rebaraja el Pozo de Descartes para formar el nuevo mazo.'}
                    </li>
                    <li>
                      {isEn
                        ? 'Teams check their accumulated Shadow Pool. In Round 1, this pool is strictly zero (0) for both sides.'
                        : 'Los equipos revisan su Fondo de Sombras acumulado. En la Ronda 1, este fondo es estrictamente cero (0) para ambos bandos.'}
                    </li>
                    <li>
                      {isEn
                        ? 'The Initiative Token is handed to the corresponding team and clocks are reset.'
                        : 'Se entrega la Ficha de Iniciativa al equipo correspondiente y se reinician los relojes.'}
                    </li>
                  </ol>
                </div>

                {/* FASE 2 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                    {isEn ? 'PHASE 2: Team Tactics (Clock: Strict 30s - NO CARDS IN HAND)' : 'FASE 2: Táctica de Equipo (Reloj: 30s Estrictos - SIN CARTAS EN MANO)'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong className="text-white">{isEn ? 'Full Free Communication:' : 'Comunicación Total Libre:'}</strong>{' '}
                      {isEn
                        ? 'Teams have 30 seconds to talk and coordinate general strategy before receiving cards.'
                        : 'Los equipos disponen de 30 segundos para hablar y coordinar su estrategia general antes de recibir sus cartas.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Macro Strategy:' : 'Estrategia Macro:'}</strong>{' '}
                      {isEn
                        ? 'Plan zone priorities and decide how many shadow markers from the accumulated pool to invest this round or save for future rounds.'
                        : 'Se planifica la distribución de las zonas (“Ataquemos fuerte Centro e Izquierda”, “Busquemos el Pleno de 3 frentes”) y se decide cuántos marcadores de sombra del fondo acumulado se invertirán en esta ronda o cuántos se ahorrarán para futuras rondas.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Anti-Alpha Player Guarantee:' : 'Garantía Anti-Jugador Alfa:'}</strong>{' '}
                      {isEn
                        ? 'With no cards in hand yet, it is impossible for one player to dictate exact plays to teammates.'
                        : 'Al no tener aún las cartas en mano, es imposible que un jugador ordene las jugadas exactas a sus compañeros.'}
                    </li>
                  </ul>
                </div>

                {/* FASE 3 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-rose-300 uppercase">
                    {isEn ? 'PHASE 3: Dealing Cards' : 'FASE 3: Reparto de Cartas'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      {isEn
                        ? 'Immediately after the Tactical Phase ends, the dealer deals 5 cards face-down to each player from the Main Deck.'
                        : 'Inmediatamente al terminar la Fase de Táctica, el repartidor entrega 5 cartas boca abajo a cada jugador del Mazo Principal.'}
                    </li>
                    <li className="text-rose-200 font-semibold">
                      {isEn
                        ? 'Speaking or making signals is strictly forbidden from this instant.'
                        : 'Está estrictamente prohibido hablar o hacer señas desde este instante.'}
                    </li>
                  </ul>
                </div>

                {/* FASE 4 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-emerald-300 uppercase">
                    {isEn ? 'PHASE 4: Deployment (Absolute Silence)' : 'FASE 4: Despliegue (Silencio Absoluto)'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong className="text-white">{isEn ? 'Turn Order & Interleaving:' : 'Orden de Turnos e Intercalado:'}</strong>{' '}
                      {isEn
                        ? 'Starts with a player from the team holding Initiative. Turns alternate strictly 1 by 1 between both teams (A1 → B1 → A2 → B2…) until all players have placed their 5 cards.'
                        : 'Inicia un jugador del equipo con la Ficha de Iniciativa. Los turnos se alternan estrictamente 1 a 1 entre jugadores de ambos equipos de forma fija (A1 → B1 → A2 → B2…) hasta que todos los jugadores hayan colocado sus 5 cartas.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Single Turn Action:' : 'Acción Única del Turno:'}</strong>{' '}
                      {isEn
                        ? 'On their turn, the player MUST place exactly ONE (1) card on any of the 3 Fronts that has not reached the Shared Territorial Limit, then press the clock.'
                        : 'En su turno, el jugador DEBE colocar exactamente UNA (1) carta en cualquiera de los 3 Frentes que no haya alcanzado el Límite Territorial Compartido. No se permite jugar 2 cartas en un mismo turno ni pasar el turno. Cuando se coloca la carta, se pulsa el cronómetro para activar el tiempo del equipo rival.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Loss on Time (Flag Fall):' : 'Derrota por Tiempo (Caída de Bandera):'}</strong>{' '}
                      {isEn
                        ? 'If a team’s clock reaches 00:00 before completing its turns, the round ends instantaneously. The infringing team loses the round automatically and the rival team scores +2 Round Points directly, unless at that instant the rival already had a higher score on all 3 fronts and had played all its cards, in which case it scores +3 Round Points.'
                        : 'Si el reloj de un equipo llega a 00:00 antes de completar sus turnos: la ronda finaliza de manera instantánea. El equipo infractor pierde la ronda automáticamente y el equipo rival suma +2 Puntos de Ronda (victoria estándar) de forma directa, salvo que en ese instante ya tuviera mayor puntuación en los 3 frentes y el rival hubiera jugado todas sus cartas, en cuyo caso sumaría +3 Puntos de Ronda.'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* TRAS COMPLETAR EL DESPLIEGUE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-teal-400 uppercase">
                  {isEn ? 'AFTER COMPLETING DEPLOYMENT:' : 'TRAS COMPLETAR EL DESPLIEGUE:'}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    <strong className="text-white">{isEn ? 'Revelation:' : 'Revelación:'}</strong>{' '}
                    {isEn
                      ? 'Flip all Shadow Cards face-up to make them visible to the rival team and spectators.'
                      : 'Voltear todas las Cartas Sombra para hacerlas visibles al equipo rival y a los espectadores.'}
                  </li>
                  <li>
                    <strong className="text-white">
                      {isEn ? 'Fast Sum per Front (2-Step Visual Grouping):' : 'Suma Rápida por Frente (Agrupación Visual en 2 Pasos):'}
                    </strong>{' '}
                    {isEn
                      ? 'On each of the 3 Fronts, each team first sums the Base Value of its cards (1, 2, 3, or 4 points) and then slightly slides forward the cards that trigger Synergy Bonuses (+1 per additional suit card, +2 per Pair, +4 per Short Straight, or +5 per Trio) to sum the total at a glance.'
                      : 'En cada uno de los 3 Frentes, cada equipo suma primero el Valor Base de sus cartas (1, 2, 3 o 4 puntos) y a continuación desliza ligeramente hacia delante las cartas que activen Bonificaciones por Sinergia (+1 por palo adicional, +2 por Pareja, +4 por Escalera Corta o +5 por Trío) para sumar el total de un vistazo.'}
                  </li>
                  <li>
                    <strong className="text-white">{isEn ? 'Round Points Allocation:' : 'Asignación de Puntos de Ronda:'}</strong>
                    <ul className="pl-6 mt-1 space-y-1 list-disc text-slate-300">
                      <li>
                        <strong className="text-sky-300">{isEn ? 'Round Tie:' : 'Empate en la Ronda'}</strong>{' '}
                        {isEn
                          ? '(e.g., each team wins 1 front and the third is Void, or all 3 fronts are Void): +1 Round Point for each team.'
                          : '(ej. cada equipo gana 1 frente y el tercero queda Nulo, o los 3 frentes quedan Nulos): +1 Punto de Ronda para cada equipo.'}
                      </li>
                      <li>
                        <strong className="text-emerald-300">{isEn ? '2-Front Victory:' : 'Victoria por 2 Frentes'}</strong>{' '}
                        {isEn
                          ? '(win 2 of the 3 fronts): +2 Round Points for the winning team (0 for the loser).'
                          : '(ganar 2 de los 3 frentes): +2 Puntos de Ronda para el equipo ganador (0 para el perdedor).'}
                      </li>
                      <li>
                        <strong className="text-amber-300">{isEn ? '3-Front Victory / “Sweep”:' : 'Victoria por 3 Frentes / “Pleno”'}</strong>{' '}
                        {isEn
                          ? '(win all 3 fronts simultaneously): +3 Round Points for the winning team (0 for the loser).'
                          : '(ganar los 3 frentes simultáneamente): +3 Puntos de Ronda para el equipo ganador (0 para el perdedor).'}
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">{isEn ? 'Economy Income (Shadows):' : 'Ingresos de Economía (Sombras):'}</strong>{' '}
                    {isEn
                      ? 'After determining the round result, each team receives new Shadow Markers added immediately to its Team Pool for subsequent rounds:'
                      : 'Tras determinar el resultado de la ronda, cada equipo recibe nuevos Marcadores de Sombra que se añaden inmediatamente a su Fondo de Equipo para las siguientes rondas:'}
                    <ul className="pl-6 mt-1 space-y-1 list-disc text-purple-200">
                      <li>
                        <strong>{isEn ? '1v1 and 2v2 Format:' : 'Formato 1v1 y 2v2:'}</strong>{' '}
                        {isEn
                          ? 'Winning Team (+1), Losing Team (+2), Loser on a streak of 2 or more consecutive losses (+3). Round Tie (+1 to both).'
                          : 'Equipo Ganador (+1), Equipo Perdedor (+2), Perdedor en racha de 2 o más derrotas consecutivas (+3). Empate de Ronda (+1 a ambos).'}
                      </li>
                      <li>
                        <strong>{isEn ? '3v3 Format:' : 'Formato 3v3:'}</strong>{' '}
                        {isEn
                          ? 'Winning Team (+2), Losing Team (+3), Loser on a streak of 2 or more consecutive losses (+4). Round Tie (+2 to both).'
                          : 'Equipo Ganador (+2), Equipo Perdedor (+3), Perdedor en racha de 2 o más derrotas consecutivas (+4). Empate de Ronda (+2 a ambos).'}
                      </li>
                      <li>
                        <strong>{isEn ? '4v4 Format:' : 'Formato 4v4:'}</strong>{' '}
                        {isEn
                          ? 'Winning Team (+2), Losing Team (+4), Loser on a streak of 2 or more consecutive losses (+5). Round Tie (+2 to both).'
                          : 'Equipo Ganador (+2), Equipo Perdedor (+4), Perdedor en racha de 2 o más derrotas consecutivas (+5). Empate de Ronda (+2 a ambos).'}
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>
          )}

          {/* 6. RESOLUCIÓN DE EMPATES Y VACÍOS LEGALES */}
          {showSection('c6') && (
            <section className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '6. TIE RESOLUTION AND EDGE CASES' : '6. RESOLUCIÓN DE EMPATES Y VACÍOS LEGALES'}
              </h2>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li>
                  <strong className="text-white">{isEn ? 'Tie on a Front:' : 'Empate en un Frente:'}</strong>{' '}
                  {isEn ? (
                    <>
                      If both teams tie in exact score on a Front, the tiebreaker on that front is won by the team holding the <strong>single card of highest nominal hierarchy (2 &lt; 3 &lt; … &lt; K &lt; A)</strong> played on it. If the tie persists (both teams have the exact same highest card on that front), the Front is declared <strong>Void</strong> (nobody wins that front).
                    </>
                  ) : (
                    <>
                      Si ambos equipos igualan en puntaje exacto en un Frente, el desempate en ese frente lo gana el equipo que posea la <strong>carta individual de mayor jerarquía nominal (2 &lt; 3 &lt; … &lt; K &lt; A)</strong> jugada en él. Si el empate persiste (ambos equipos tienen exactamente la misma carta máxima en ese frente), el Frente se declara <strong>Nulo</strong> (nadie gana ese frente).
                    </>
                  )}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Tie in the Round:' : 'Empate en la Ronda:'}</strong>{' '}
                  {isEn
                    ? 'If the round ends tied in conquered fronts (e.g., Team A wins Left, Team B wins Right, and Center is Void), both teams receive +1 Round Point and collect the shadow economy corresponding to a Round Tie. (Note: If due to a double void front one team wins 1 to 0, it counts as a standard victory of +2 Round Points).'
                    : 'Si la ronda concluye igualada en frentes conquistados (ej. Equipo A gana Izquierda, Equipo B gana Derecha y el Centro es Nulo), ambos equipos reciben +1 Punto de Ronda y cobran la economía de sombras correspondiente a Empate de Ronda. (Nota: Si por doble frente nulo un equipo gana 1 a 0, se considera victoria estándar de +2 Puntos de Ronda).'}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Shadow Card Infraction:' : 'Infracción de Carta de Sombra:'}</strong>{' '}
                  {isEn
                    ? 'If a player attempts to play a card face-down when no Shadow Markers are available, the card must be flipped immediately and remain exposed face-up on the table.'
                    : 'Si un jugador intenta jugar una carta boca abajo cuando no le corresponden Marcadores de Sombra, la carta debe voltearse inmediatamente y quedar expuesta boca arriba en la mesa.'}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Irregular Clock Press:' : 'Pulsación Irregular del Reloj:'}</strong>{' '}
                  {isEn
                    ? 'A player cannot press the timer before definitively releasing the card onto the chosen front.'
                    : 'Un jugador no puede pulsar el cronómetro antes de haber soltado la carta de forma definitiva en el frente elegido. Si lo hace, el tiempo seguirá corriendo para su equipo hasta que la carta esté correctamente depositada.'}
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'Loss Streak Reset:' : 'Reinicio de Racha de Derrotas:'}</strong>{' '}
                  {isEn
                    ? 'If a team collecting the maximum shadow bonus from a loss streak wins a round (2 or 3 points) or ties it (1 point each), its streak resets immediately. Its next loss counts as the first.'
                    : 'Si un equipo que está cobrando el bono máximo de sombras por racha de derrotas logra ganar una ronda (2 o 3 puntos) o empatarla (1 punto para cada equipo), su racha se reinicia instantáneamente. Su siguiente derrota contará como la primera.'}
                </li>
              </ul>
            </section>
          )}

          {/* 7. FIN DE LA PARTIDA Y CRITERIOS DE DESEMPATE */}
          {showSection('c7') && (
            <section className="space-y-3 bg-slate-950/60 border border-amber-500/40 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wide border-l-4 border-amber-500 pl-3">
                {isEn ? '7. END OF MATCH AND TIEBREAKER CRITERIA' : '7. FIN DE LA PARTIDA Y CRITERIOS DE DESEMPATE'}
              </h2>
              <ul className="space-y-2.5 list-disc list-inside text-slate-300">
                <li>
                  <strong className="text-white">{isEn ? 'Direct Victory:' : 'Victoria Directa:'}</strong>{' '}
                  {isEn
                    ? 'After playing the agreed even number of rounds (4, 6, or 8 rounds), all Round Points obtained are summed. The team with the higher total score wins the match.'
                    : 'Tras disputar el total de rondas pares acordadas (4, 6 u 8 rondas), se suman todos los Puntos de Ronda obtenidos. El equipo con mayor puntuación total obtiene la victoria.'}
                </li>
                <li>
                  <strong className="text-purple-300">
                    {isEn ? 'First Tiebreaker Criterion (Shadow Efficiency):' : 'Primer Criterio de Desempate (Eficiencia de Sombras):'}
                  </strong>{' '}
                  {isEn ? (
                    <>
                      If the match ends tied in total Round Points, the winner is the team that retains <strong>more unspent Shadow Markers in its Team Pool</strong> at the end of the final round (rewarding resource management efficiency).
                    </>
                  ) : (
                    <>
                      Si la partida concluye empatada en Puntos de Ronda totales, se declara vencedor al equipo que conserve <strong>mayor cantidad de Marcadores de Sombra sin gastar en su Fondo de Equipo</strong> al término de la última ronda (premiando la eficiencia en la gestión de recursos).
                    </>
                  )}
                </li>
                <li>
                  <strong className="text-amber-300">
                    {isEn ? 'Second Tiebreaker Criterion (2-Round Overtime):' : 'Segundo Criterio de Desempate (Prórroga de 2 Rondas):'}
                  </strong>{' '}
                  {isEn ? (
                    <>
                      If the tie persists in Shadow Markers (or in Casual Mode where there is no cumulative Team Pool), <strong>2 additional Overtime Rounds</strong> are played (maintaining initiative rotation) to guarantee equal starting opportunity.
                    </>
                  ) : (
                    <>
                      En el caso de que persista el empate en Marcadores de Sombra (o en el Modo Casual donde no existe Fondo de Equipo acumulable), se jugarán <strong>2 Rondas de Prórroga</strong> adicionales (manteniendo la rotación de iniciativa) para garantizar igualdad de salida.
                    </>
                  )}
                </li>
              </ul>
            </section>
          )}

          {/* 8. ANEXO: MODO DE JUEGO 1v1 */}
          {showSection('c8') && (
            <section className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-sky-400 uppercase tracking-wide border-l-4 border-sky-500 pl-3">
                {isEn ? '8. ANNEX: 1v1 GAME MODE' : '8. ANEXO: MODO DE JUEGO 1v1'}
              </h2>
              <p>
                {isEn
                  ? 'The general rules of Competitive Mode remain intact, applying only the following specific adaptations for 1 vs 1 matches:'
                  : 'Las reglas generales del Modo Competitivo se mantienen intactas, aplicando únicamente las siguientes adaptaciones específicas para partidas de 1 contra 1:'}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>
                  <strong className="text-white">
                    {isEn ? 'Mathematical and Mechanical Adjustments (The 2v2 Mirror):' : 'Ajustes Matemáticos y Mecánicos (El Espejo del 2v2):'}
                  </strong>{' '}
                  {isEn
                    ? 'To maintain slot tension and mathematical viability, 1v1 mode mechanically simulates a 2v2:'
                    : 'Para mantener la tensión de los espacios y la viabilidad matemática, el modo 1v1 simula mecánicamente un 2v2:'}
                  <ul className="pl-6 mt-1 space-y-1 list-disc text-slate-300">
                    <li>
                      <strong className="text-white">{isEn ? 'Deck:' : 'Baraja:'}</strong>{' '}
                      {isEn ? '1 Standard Deck (52 cards).' : '1 Baraja estándar (52 cartas).'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Player Hand:' : 'Mano del Jugador:'}</strong>{' '}
                      {isEn ? '10 cards per player (instead of 5).' : '10 cartas por jugador (en lugar de 5).'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Shared Territorial Limit:' : 'Límite Territorial Compartido:'}</strong>{' '}
                      {isEn ? 'Maximum 8 cards total per Front summing both players’ cards.' : 'Máximo 8 cartas en total por Frente sumando las cartas de ambos jugadores.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Clock Management in 1v1:' : 'Gestión del Reloj en 1v1:'}</strong>{' '}
                      {isEn
                        ? 'The individual player assumes all 10 turns of their side, using the full time pool (1m 40s Fast / 3m 20s Medium / 5m 00s Slow) to alternate plays against the rival, pressing the clock after each of their 10 placed cards.'
                        : 'El jugador individual asume los 10 turnos de su bando, disponiendo de la bolsa de tiempo completa (1m 40s Rápido / 3m 20s Medio / 5m 00s Lento) para alternar sus jugadas frente al rival, pulsando el reloj tras cada una de sus 10 cartas colocadas.'}
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">{isEn ? 'The 4 Round Phases:' : 'Las 4 Fases de la Ronda:'}</strong>{' '}
                  {isEn
                    ? 'Played identically to other modes, using the 30 seconds of the Tactical Phase to mentally plan strategy and Shadow Pool management before receiving the 10 cards.'
                    : 'Se desarrollan igual que en los otros modos, utilizando los 30 segundos de la Fase de Táctica para planificar mentalmente la estrategia y la gestión del Fondo de Sombras antes de recibir las 10 cartas.'}
                </li>
              </ol>
            </section>
          )}

          {/* 9. ANEXO: MODO CASUAL (PARTY / AMIGOS) — SOLO LAS 3 DIFERENCIAS EXCLUSIVAS */}
          {showSection('c9') && (
            <section className="space-y-4 bg-slate-950/60 border border-emerald-500/40 rounded-2xl p-5">
              <h2 className="text-base sm:text-lg font-black text-emerald-400 uppercase tracking-wide border-l-4 border-emerald-500 pl-3">
                {isEn ? '9. ANNEX: CASUAL MODE (PARTY / FRIENDS)' : '9. ANEXO: MODO CASUAL (PARTY / AMIGOS)'}
              </h2>
              <p className="text-slate-200">
                {isEn ? (
                  <>
                    Casual Mode uses the exact <strong>same rules, phases, card values (1 to 4 points), synergy bonuses (+1, +2, +4, +5), and round scoring (1, 2, and 3 points)</strong> of Competitive Mode, applying <strong>only the following 3 modifications</strong> to simplify resource management and turn tempo:
                  </>
                ) : (
                  <>
                    El Modo Casual utiliza exactamente las <strong>mismas reglas, fases, valores de cartas (1 a 4 puntos), bonificaciones de sinergia (+1, +2, +4, +5) y puntuación de ronda (1, 2 y 3 puntos)</strong> del Modo Competitivo, aplicando <strong>únicamente las siguientes 3 modificaciones</strong> para simplificar la gestión de recursos y el ritmo de turno:
                  </>
                )}
              </p>

              <div className="space-y-3">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-teal-400">
                    {isEn ? '1. Fixed Individual Shadow Card Management' : '1. Gestión Individual Fija de Cartas Sombra'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong className="text-white">{isEn ? 'Fixed Marker per Round:' : 'Marcador Fijo por Ronda:'}</strong>{' '}
                      {isEn
                        ? 'The shared Team Shadow Pool and post-round income are removed. Instead, each player has exactly one (1) Shadow Marker per round to play one card face-down (keeping the rule of silently showing it to teammates before placing it).'
                        : 'Se suprime el Fondo de Sombras compartido del equipo y los ingresos posronda. En su lugar, cada jugador dispone exactamente de un (1) Marcador de Sombra por ronda para jugar una carta boca abajo (manteniendo la regla de mostrársela en silencio a sus compañeros antes de colocarla).'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Non-Transferable and Non-Cumulative:' : 'Uso Intransferible y No Acumulable:'}</strong>{' '}
                      {isEn
                        ? 'The marker is strictly personal and cannot be given to a teammate or saved for later rounds. At the start of each new round, each player again has their single marker.'
                        : 'El marcador es estrictamente personal y no puede cederse a otro compañero ni acumularse para rondas posteriores. Al inicio de cada nueva ronda, cada jugador vuelve a disponer de su único marcador.'}
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-teal-400">
                    {isEn ? '2. Individual Turn Timer (No Team Clock)' : '2. Tiempo de Turno Individual (Sin Reloj de Equipo)'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong className="text-white">{isEn ? 'Fixed 20 Seconds per Play:' : 'Tiempo Fijo de 20 Segundos por Jugada:'}</strong>{' '}
                      {isEn
                        ? 'The shared dual team timer is eliminated. Each player has a fixed limit of 20 seconds per turn to place their card.'
                        : 'Se elimina el cronómetro dual compartido. Cada jugador dispone de un límite fijo de 20 segundos por turno para colocar su carta.'}
                    </li>
                    <li>
                      <strong className="text-white">{isEn ? 'Time Infraction (Auto-play):' : 'Infracción por Tiempo (Auto-play):'}</strong>{' '}
                      {isEn
                        ? 'If a player exhausts their 20 seconds without placing a card, they must immediately play (or the system automatically plays in the digital version) the first available card in their hand, placing it face-up on the valid (unsaturated) front that currently has the fewest cards.'
                        : 'Si un jugador agota sus 20 segundos sin haber colocado una carta, debe jugar de manera inmediata (o el sistema jugará automáticamente en la versión digital) la primera carta disponible de su mano, colocándola boca arriba en el frente válido (no saturado) que contenga menos cartas en ese momento.'}
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-teal-400">
                    {isEn ? '3. Direct Match Tiebreaker' : '3. Desempate Directo de Partida'}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      {isEn ? (
                        <>
                          Since there is no cumulative Team Shadow Pool, if there is a tie in Round Points at the end of the regulation rounds, the match goes directly to a <strong>2-Round Overtime</strong>.
                        </>
                      ) : (
                        <>
                          Al no existir un Fondo de Sombras acumulable de equipo, si al finalizar las rondas reglamentarias hay empate en Puntos de Ronda, se pasa directamente a disputar la <strong>Prórroga de 2 Rondas</strong>.
                        </>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="no-print px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">{manual.footerInfo}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {manual.footerBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
