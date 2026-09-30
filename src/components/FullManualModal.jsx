import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ChevronRight,
  Swords,
  Layers,
  Scale,
  Clock,
  Sparkles,
  Flame,
  EyeOff,
  AlertTriangle,
  Award,
  Trophy,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function FullManualModal({ isOpen, onClose }) {
  const { isEn, manualT } = useLanguage();
  const [activeSection, setActiveSection] = useState('sec1');

  if (!isOpen) return null;

  const sections = manualT.sections;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn text-slate-100">
      <div className="bg-[#07090e] border border-amber-500/30 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">
        {/* Cabecera del Manual Completo */}
        <div className="px-6 py-4 bg-gradient-to-r from-black via-[#111622] to-black border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-black tracking-widest uppercase text-gold-gradient">
                  {manualT.headerTitle}
                </h2>
                <span className="text-[9px] bg-black/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-serif font-black uppercase tracking-wider">
                  {manualT.headerVersion}
                </span>
              </div>
              <p className="text-xs font-serif text-slate-400">
                {manualT.headerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle compact />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-black/60 border border-transparent hover:border-amber-500/30 transition cursor-pointer"
              title={manualT.closeBtn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Manual con Navegación Lateral y Contenido */}
        <div className="flex-1 flex overflow-hidden">
          {/* Barra Lateral de Secciones */}
          <aside className="w-64 border-r border-slate-800 bg-slate-950/80 p-3 hidden sm:flex flex-col justify-between overflow-y-auto shrink-0">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-2">
                {manualT.tocTitle}
              </span>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    activeSection === sec.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">
                    <strong className="text-amber-400 mr-1.5">{sec.num}.</strong>
                    {sec.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 mt-4">
              <span className="font-bold text-slate-200 block mb-1">{manualT.officialNoteTitle}</span>
              {manualT.officialNoteText}
            </div>
          </aside>

          {/* Selector de pestañas para móvil */}
          <div className="sm:hidden flex overflow-x-auto border-b border-slate-800 p-2 gap-1 bg-slate-950">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  activeSection === sec.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isEn ? `Ch. ${sec.num}` : `Cap. ${sec.num}`}
              </button>
            ))}
          </div>

          {/* Área de Lectura del Contenido */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 leading-relaxed text-sm text-slate-300 bg-slate-950">
            {/* SECCIÓN 1: INTRODUCCIÓN Y OBJETIVO */}
            {activeSection === 'sec1' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 1' : 'Capítulo 1'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '1. Introduction & Objective' : '1. Introducción y Objetivo'}
                  </h3>
                </div>

                <p className="text-slate-300">
                  {isEn ? (
                    <><strong className="text-slate-100">WarFronts</strong> is a tactical team card game based on zone control, imperfect information, strategic deduction, and teamwork without micromanagement.</>
                  ) : (
                    <><strong className="text-slate-100">Frentes de Guerra</strong> es un juego táctico de cartas por equipos basado en el control de zonas, la información imperfecta, la deducción estratégica y el trabajo en equipo sin microgestión.</>
                  )}
                </p>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    {isEn ? 'Match Objective' : 'Objetivo de la Partida'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>The match is contested over a <strong className="text-slate-100">fixed total of Rounds</strong>. The team securing the most round points is declared the victor. In the event of a tie upon completing all rounds, the match will be resolved via the <strong className="text-emerald-400">cumulative score</strong> criterion (total points scored in every round).</>
                    ) : (
                      <>La partida se disputa a un <strong className="text-slate-100">total fijo de Rondas</strong>. El equipo que obtenga la mayoría de puntos de ronda se declara vencedor. En caso de empate al finalizar las rondas, la partida se resolverá mediante el criterio de <strong className="text-emerald-400">puntuación acumulada</strong> (puntos totales en cada ronda).</>
                    )}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      {isEn ? 'Official match durations are as follows:' : 'Las duraciones oficiales de partida son las siguientes:'}
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">{isEn ? 'Short:' : 'Corta:'}</strong>
                        {isEn ? '4 rounds.' : '4 rondas.'}
                      </li>
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">{isEn ? 'Medium:' : 'Mediana:'}</strong>
                        {isEn ? '6 rounds.' : '6 rondas.'}
                      </li>
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">{isEn ? 'Long:' : 'Larga:'}</strong>
                        {isEn ? '8 rounds.' : '8 rondas.'}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-emerald-400" />
                    {isEn ? 'Round Objective' : 'Objetivo de la Ronda'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>Achieve the highest total numerical value on <strong className="text-emerald-400">at least 2 of the 3 War Fronts</strong> (Left, Center, and Right) upon conclusion of deployment.</>
                    ) : (
                      <>Obtener el mayor valor numérico total en <strong className="text-emerald-400">al menos 2 de los 3 Frentes de Guerra</strong> (Izquierdo, Central y Derecho) al finalizar el despliegue.</>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: MATERIALES Y GESTIÓN DE MAZOS */}
            {activeSection === 'sec2' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 2' : 'Capítulo 2'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '2. Materials & Deck Management' : '2. Materiales y Gestión de Mazos'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-100">
                    {isEn ? 'Official Components:' : 'Componentes Oficiales:'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>{isEn ? 'Players:' : 'Jugadores:'}</strong> {isEn ? '1v1 (see annex), 2v2, 3v3, or 4v4.' : '1v1 (ver anexo), 2v2, 3v3 o 4v4.'}
                    </li>
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>{isEn ? 'Decks (Standard poker decks without jokers):' : 'Barajas (Póker estándar sin comodines/jokers):'}</strong>
                      <div className="mt-1 text-slate-400 space-y-0.5">
                        <div>• <strong>{isEn ? '2v2 Matches:' : 'Partidas 2v2:'}</strong> {isEn ? '1 standard deck (52 cards).' : '1 Baraja estándar (52 cartas).'}</div>
                        <div>• <strong>{isEn ? '3v3 and 4v4 Matches:' : 'Partidas 3v3 y 4v4:'}</strong> {isEn ? '2 standard decks combined and shuffled together (104 cards).' : '2 Barajas estándar combinadas y mezcladas (104 cartas).'}</div>
                      </div>
                    </li>
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>{isEn ? 'Additional Components:' : 'Componentes Adicionales:'}</strong>
                      <div className="mt-1 text-slate-400 space-y-0.5">
                        <div>• <strong>{isEn ? '1 Initiative Token.' : '1 Ficha de Iniciativa.'}</strong></div>
                        <div>• <strong>{isEn ? '1 Shadow Marker per player' : '1 Marcador de Sombra por jugador'}</strong> {isEn ? '(coin, stone, dice, counter, or card token).' : '(puede ser una moneda, piedra, dado, ficha o papel).'}</div>
                        <div>• <strong>{isEn ? '1 Stopwatch / Dual Chess Clock:' : '1 Cronómetro / Reloj de Ajedrez Dual:'}</strong> {isEn ? 'Switched clock timing shared team time during the round.' : 'Reloj conmutado para medir el tiempo global compartido de cada equipo en la ronda.'}</div>
                        <div>• <strong>{isEn ? 'Score Sheet / Scoreboard:' : 'Hoja de Anotación / Marcador:'}</strong> {isEn ? 'Notepad or digital interface to tally round points and cumulative front points.' : '1 bloc de papel o marcador digital para registrar tanto los puntos de ronda como la suma de puntos numéricos de cada frente por ronda.'}</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    {isEn ? 'Draw Deck & Discard Pile Management' : 'Gestión del Mazo Principal y Pozo de Descartes'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100">{isEn ? 'Draw Deck (Main Deck):' : 'Mazo Principal (Mazo de Robo):'}</strong> {isEn ? 'The face-down pile from which cards are dealt to players.' : 'Es la pila boca abajo de donde se reparten las cartas a los jugadores.'}
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100">{isEn ? 'Discard Pile:' : 'Pozo de Descartes:'}</strong> {isEn ? 'Face-up pile at the table edge where all cards played on fronts are placed at round end.' : 'Pila boca arriba a un lado de la mesa donde se colocan todas las cartas jugadas en los frentes al terminar una ronda.'}
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-amber-300">{isEn ? 'Continuity Rule & Card Counting:' : 'Regla de Continuidad y Conteo de Cartas:'}</strong> {isEn ? 'Cards played during a round are NOT reshuffled at round end; they remain in the discard pile. This enables players to perform strategic card counting of high cards and possible combinations.' : 'Las cartas jugadas en una ronda NO se rebarajan al finalizar dicha ronda; permanecen en el pozo de descartes. Esto permite a los jugadores realizar un conteo estratégico de cartas altas y posibles combinaciones.'}
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-rose-300">{isEn ? 'Reshuffle on Depletion:' : 'Rebarajado por Agotamiento:'}</strong> {isEn ? 'Whenever the Draw Deck lacks sufficient cards to deal hands to each player at the start of a round, the entire Discard Pile is gathered, thoroughly shuffled, and forms a new Draw Deck.' : 'Cuando el Mazo Principal no tenga suficientes cartas para repartir a cada jugador al inicio de una ronda, se toma todo el Pozo de Descartes, se baraja minuciosamente y se forma un nuevo Mazo Principal.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: DISPOSICIÓN Y DETERMINACIÓN DE INICIATIVA */}
            {activeSection === 'sec3' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 3' : 'Capítulo 3'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '3. Layout, Initiative & Team Clocks' : '3. Disposición, Iniciativa y Tiempos de Equipo'}
                  </h3>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">{isEn ? 'Table Layout' : 'Disposición de la Mesa'}</h4>
                  <p>
                    {isEn ? (
                      <>Three zones are designated across the center of the table: <strong className="text-slate-100">Left Front, Center Front, and Right Front</strong>. The Draw Deck and Discard Pile are placed to one side alongside the dual team chess clock.</>
                    ) : (
                      <>Se delimitan 3 zonas en el centro de la mesa: <strong className="text-slate-100">Frente Izquierdo, Frente Central y Frente Derecho</strong>. El Mazo Principal y el Pozo de Descartes se ubican a un costado junto con el reloj dual de equipo.</>
                    )}
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">{isEn ? 'Initial Initiative Determination' : 'Determinación de la Iniciativa Inicial'}</h4>
                  <p>
                    {isEn ? (
                      <>Before Round 1 begins, the attacking team is determined by a <strong className="text-amber-400">100% random draw</strong> (cutting the deck for highest card in tabletop play; automatic draw in digital play). The winning team receives the <strong className="text-amber-400">Initiative Token</strong> and makes the first deployment move.</>
                    ) : (
                      <>Antes de iniciar la Ronda 1, se determina qué equipo empieza atacando mediante un <strong className="text-amber-400">sorteo 100% aleatorio</strong> (en el juego presencial de mesa se realiza un corte de baraja robando la carta más alta; en la versión digital el sistema ejecuta este sorteo automáticamente por código). El equipo beneficiado recibe la <strong className="text-amber-400">Ficha de Iniciativa</strong> y abre el primer turno de despliegue.</>
                    )}
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">{isEn ? 'Initiative Rotation' : 'Rotación de Iniciativa'}</h4>
                  <p>
                    {isEn ? (
                      <>From Round 2 onward, the Initiative Token <strong className="text-emerald-400">automatically alternates to the opposing team</strong> at the start of each round, regardless of who won the previous round.</>
                    ) : (
                      <>A partir de la Ronda 2, la Ficha de Iniciativa <strong className="text-emerald-400">rota automáticamente al equipo contrario</strong> al inicio de cada ronda, independientemente de quién haya ganado la ronda anterior.</>
                    )}
                  </p>
                </div>

                {/* TABLA OFICIAL DE TIEMPOS DE EQUIPO */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {isEn ? 'Shared Team Clock (Official Times per Mode)' : 'Reloj de Equipo Compartido (Tiempos Oficiales por Modalidad)'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isEn ? (
                      <>Time is not individual per turn; it is a <strong>shared time pool for the entire team</strong> consumed exclusively while any of its members thinks or deploys a card. Upon card placement, the clock pauses and the opponent clock starts immediately.</>
                    ) : (
                      <>El tiempo ya no es individual por turno; es una <strong>bolsa de tiempo compartida para el equipo entero</strong> que se consume únicamente mientras cualquiera de sus miembros piensa o despliega una carta. Al colocar la carta, el reloj se detiene y se activa de inmediato el reloj del equipo contrario.</>
                    )}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-950 text-slate-300">
                          <th className="p-2 font-bold">{isEn ? 'Mode' : 'Modalidad'}</th>
                          <th className="p-2 font-bold text-emerald-400">{isEn ? 'Fast' : 'Rápido'}</th>
                          <th className="p-2 font-bold text-amber-400">{isEn ? 'Medium' : 'Medio'}</th>
                          <th className="p-2 font-bold text-indigo-400">{isEn ? 'Slow' : 'Lento'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                        <tr className="hover:bg-slate-800/40">
                          <td className="p-2 font-sans font-semibold text-slate-100">{isEn ? '1v1 (10 cards/player)' : '1v1 (10 cartas/jugador)'}</td>
                          <td className="p-2 text-emerald-300">1m 40s (100s)</td>
                          <td className="p-2 text-amber-300">3m 20s (200s)</td>
                          <td className="p-2 text-indigo-300">5m 00s (300s)</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="p-2 font-sans font-semibold text-slate-100">{isEn ? '2v2 (10 cards/team)' : '2v2 (10 cartas/equipo)'}</td>
                          <td className="p-2 text-emerald-300">1m 40s (100s)</td>
                          <td className="p-2 text-amber-300">3m 20s (200s)</td>
                          <td className="p-2 text-indigo-300">5m 00s (300s)</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="p-2 font-sans font-semibold text-slate-100">{isEn ? '3v3 (15 cards/team)' : '3v3 (15 cartas/equipo)'}</td>
                          <td className="p-2 text-emerald-300">2m 30s (150s)</td>
                          <td className="p-2 text-amber-300">5m 00s (300s)</td>
                          <td className="p-2 text-indigo-300">7m 30s (450s)</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="p-2 font-sans font-semibold text-slate-100">{isEn ? '4v4 (20 cards/team)' : '4v4 (20 cartas/equipo)'}</td>
                          <td className="p-2 text-emerald-300">3m 20s (200s)</td>
                          <td className="p-2 text-amber-300">6m 40s (400s)</td>
                          <td className="p-2 text-indigo-300">10m 00s (600s)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div>• <strong>{isEn ? 'Round Reset:' : 'Reseteo por Ronda:'}</strong> {isEn ? 'At the start of each new round, both team clocks reset to 100%. Unused time from prior rounds is forfeited and never accumulates.' : 'Al inicio de cada nueva ronda, el reloj de ambos equipos se restablece íntegramente al 100% del tiempo estipulado. El tiempo no consumido en rondas anteriores se pierde y nunca se acumula.'}</div>
                    <div>• <strong>{isEn ? 'Average Time per Play:' : 'Promedio de Tiempo por Jugada:'}</strong> {isEn ? 'Fast allows an average of 10s per card; Medium 20s per card; Slow 30s per card. Time distribution between teammates is flexible and strategic.' : 'Rápido permite una media de 10 seg por carta; Medio 20 seg por carta; Lento 30 seg por carta. La distribución entre jugadores del equipo es libre y estratégica.'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 4: CONCEPTOS CLAVE Y VALORES */}
            {activeSection === 'sec4' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 4' : 'Capítulo 4'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '4. Key Concepts & Card Values' : '4. Conceptos Clave y Valores'}
                  </h3>
                </div>

                <p className="text-slate-300">
                  {isEn ? 'To conquer a front, add up the value of all cards played on it by each team.' : 'Para ganar un frente, se suma el valor de las cartas jugadas en él por cada equipo.'}
                </p>

                {/* Valores Base */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100">{isEn ? 'Base Numerical Card Values:' : 'Valor Numérico Base de las Cartas:'}</h4>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">{isEn ? 'Cards 2 to 10 = Nominal face value.' : 'Cartas del 2 al 10 = Su valor nominal.'}</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'J (Jack)' : 'J (Jota)'}</strong> = 11 pts.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'Q (Queen)' : 'Q (Reina)'}</strong> = 12 pts.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">{isEn ? 'K (King)' : 'K (Rey)'}</strong> = 13 pts.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-emerald-400">{isEn ? 'A (Ace)' : 'A (As)'}</strong> = 14 pts.</li>
                  </ul>
                </div>

                {/* Sinergia */}
                <div className="bg-indigo-950/30 border border-indigo-800/60 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    {isEn ? 'Suit Synergy (+5 Points)' : 'Sinergia de Palo (+5 Puntos)'}
                  </h4>
                  <p className="text-xs sm:text-sm">
                    {isEn ? (
                      <>For each additional card of the same suit that a team deploys on the same Front, that team scores a <strong className="text-indigo-300">5-point bonus</strong>.</>
                    ) : (
                      <>Por cada carta adicional del mismo palo que un equipo coloque en un mismo Frente, ese equipo suma un <strong className="text-indigo-300">bono de 5 puntos</strong>.</>
                    )}
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded border border-slate-800 text-xs text-slate-300">
                    <strong>{isEn ? 'Official Example:' : 'Ejemplo Oficial:'}</strong> {isEn ? 'A team plays a 10 of Hearts and King of Hearts in Center Front. Sum: 23 base points + 5 synergy = ' : 'Un equipo juega un 10 de Corazones y un Rey de Corazones en el Frente Central. Suma: 23 puntos base + 5 de sinergia = '}<strong className="text-emerald-400">{isEn ? '28 points' : '28 puntos'}</strong>.
                  </div>
                </div>

                {/* Formaciones por Sinergia: Pareja, Escalera Corta, Trío */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Pareja */}
                  <div className="bg-sky-950/30 border border-sky-800/60 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-sky-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-400" />
                      {isEn ? 'Pair (+10 Points)' : 'Pareja (+10 Puntos)'}
                    </h4>
                    <p className="text-xs sm:text-sm">
                      {isEn ? (
                        <>2 cards of the <strong className="text-sky-300">same numerical value</strong> on the Front.</>
                      ) : (
                        <>2 cartas del <strong className="text-sky-300">mismo valor numérico</strong> en el Frente.</>
                      )}
                    </p>
                    <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300">
                      <strong>{isEn ? 'Official Example:' : 'Ejemplo Oficial:'}</strong> {isEn ? 'Two 7s = 14 base + 10 pair = ' : 'Dos 7s = 14 base + 10 pareja = '}<strong className="text-sky-400">24 pts</strong>.
                    </div>
                  </div>

                  {/* Escalera Corta */}
                  <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      {isEn ? 'Short Straight (+15 Points)' : 'Escalera Corta (+15 Puntos)'}
                    </h4>
                    <p className="text-xs sm:text-sm">
                      {isEn ? (
                        <>3 cards of <strong className="text-emerald-300">consecutive numerical values</strong> on the Front.</>
                      ) : (
                        <>3 cartas de <strong className="text-emerald-300">valores numéricos consecutivos</strong> en el Frente.</>
                      )}
                    </p>
                    <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300">
                      <strong>{isEn ? 'Official Example:' : 'Ejemplo Oficial:'}</strong> 8-9-10 = 27 base + 15 = <strong className="text-emerald-400">42 pts</strong>. {isEn ? '(Q-K-A = 54 pts)' : '(Q-K-A = 54 pts)'}.
                    </div>
                  </div>

                  {/* Trío */}
                  <div className="bg-rose-950/30 border border-rose-800/60 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-rose-300 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400" />
                      {isEn ? 'Trio (+20 Points)' : 'Trío (+20 Puntos)'}
                    </h4>
                    <p className="text-xs sm:text-sm">
                      {isEn ? (
                        <>3 cards of the <strong className="text-rose-300">same numerical value</strong> on the Front.</>
                      ) : (
                        <>3 cartas del <strong className="text-rose-300">mismo valor numérico</strong> en el Frente.</>
                      )}
                    </p>
                    <p className="text-[11px] text-rose-300/90 bg-rose-950/40 p-2 rounded border border-rose-900/50">
                      {isEn
                        ? 'Clarification: Forming a Trio automatically annuls the Pair bonus; you cannot sum the +20 of the Trio and the +10 of the Pair for the same cards.'
                        : 'Aclaración: Formar un Trío anula automáticamente la bonificación de la Pareja; no se pueden sumar los +20 del Trío y los +10 de la Pareja por las mismas cartas.'}
                    </p>
                  </div>
                </div>

                {/* Carta y Marcador de Sombra */}
                <div className="bg-purple-950/30 border border-purple-800/60 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-purple-300 flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-purple-400" />
                    {isEn ? 'The Shadow Card (Optional - Max 1 per round)' : 'La Carta de Sombra (Opcional - Máximo 1 por ronda)'}
                  </h4>
                  <p className="text-xs sm:text-sm">
                    {isEn ? (
                      <>Each player has the option to play at most <strong className="text-purple-300">1 of their 5 cards FACE-DOWN</strong> during the round. If team strategy dictates playing all cards face-up, they may freely do so.</>
                    ) : (
                      <>Cada jugador tiene la opción de jugar como <strong className="text-purple-300">máximo 1 de sus 5 cartas BOCA ABAJO</strong> durante la ronda. Si la estrategia del equipo requiere jugar todas sus cartas boca arriba, pueden hacerlo libremente.</>
                    )}
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded border border-slate-800 text-xs text-slate-300 mt-2">
                    <strong>{isEn ? 'The Shadow Marker (Anti-Cheat Control):' : 'El Marcador de Sombra (Control Anti-trampas):'}</strong> {isEn ? 'At the start of the round, each player places their Shadow Marker in active state before them. When a player plays a card face-down, they must flip or turn over their marker. This guarantees full transparency.' : 'Al inicio de la ronda, cada jugador coloca su Marcador de Sombra en estado activo frente a sí. En el momento en que un jugador decide jugar una carta boca abajo, debe voltear o entregar su Marcador de Sombra. Esto garantiza transparencia total sobre quién conserva la opción de jugar oculto y quién ya la ha utilizado.'}
                  </div>
                </div>

                {/* Límite Territorial Compartido */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {isEn ? 'Shared Territorial Front Limit' : 'Límite Territorial Compartido por Frente'}
                  </h4>
                  <p className="text-xs sm:text-sm">
                    {isEn ? 'A maximum number of total cards is set per Front across both teams combined:' : 'Se establece un número máximo de casillas en total por Frente para la suma de las cartas de ambos equipos:'}
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 my-2">
                    <li>• <strong>{isEn ? '1v1 and 2v2 Matches:' : 'Partidas 1v1 y 2v2:'}</strong> {isEn ? 'Max 8 cards total per Front.' : 'Máximo 8 cartas en total por Frente.'}</li>
                    <li>• <strong>{isEn ? '3v3 Matches:' : 'Partidas 3v3:'}</strong> {isEn ? 'Max 12 cards total per Front.' : 'Máximo 12 cartas en total por Frente.'}</li>
                    <li>• <strong>{isEn ? '4v4 Matches:' : 'Partidas 4v4:'}</strong> {isEn ? 'Max 16 cards total per Front.' : 'Máximo 16 cartas en total por Frente.'}</li>
                  </ul>
                  <p className="text-xs text-rose-300 font-semibold bg-rose-950/30 p-2.5 rounded border border-rose-900/50">
                    {isEn ? 'Closure Rule (Saturation): As soon as a Front reaches this limit with the combined cards of both teams, it becomes saturated and no further cards may be played on it for the rest of the round.' : 'Regla de Cierre (Saturación): En cuanto un Frente alcanza dicho límite con la suma de las cartas de ambos equipos, queda saturado y no se pueden colocar más cartas en él durante el resto de la ronda.'}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 5: ESTRUCTURA PASO A PASO DE LA RONDA */}
            {activeSection === 'sec5' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 5' : 'Capítulo 5'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '5. Step-by-Step Round Flow' : '5. Estructura Paso a Paso de la Ronda'}
                  </h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm">
                  {isEn ? 'Each round is strictly divided into the following sequential phases:' : 'Cada ronda se divide strictly en las siguientes fases secuenciales:'}
                </p>

                <div className="space-y-3">
                  {/* FASE 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">{isEn ? 'PHASE 1: Preparation & Initiative' : 'FASE 1: Preparación e Iniciativa'}</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Setup</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs sm:text-sm space-y-1 text-slate-300">
                      <li>{isEn ? 'If the Draw Deck lacks cards, reshuffle the Discard Pile to form a new deck.' : 'Si el Mazo Principal no tiene suficientes cartas, se rebaraja el Pozo de Descartes para formar el nuevo mazo.'}</li>
                      <li>{isEn ? 'All players set their Shadow Marker in active state in front of them.' : 'Todos los jugadores colocan su Marcador de Sombra en estado activo frente a ellos.'}</li>
                      <li>{isEn ? 'The Initiative token rotates clockwise to the opposing team (or is drawn randomly in Round 1).' : 'La Ficha de Iniciativa rota al equipo rival (o se sortea aleatoriamente en la Ronda 1).'}</li>
                    </ol>
                  </div>

                  {/* FASE 2 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">{isEn ? 'PHASE 2: Team Tactics (Clock: 30s Strict - NO CARDS IN HAND)' : 'FASE 2: Táctica de Equipo (Reloj: 30s Estrictos - SIN CARTAS EN MANO)'}</h4>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">30s</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• <strong>{isEn ? 'Total Free Communication:' : 'Comunicación Total Libre:'}</strong> {isEn ? 'Teams have 30 seconds to talk and coordinate macro strategy before cards are dealt.' : 'Los equipos disponen de un tiempo de 30 segundos para hablar y coordinar su estrategia general antes de recibir sus cartas.'}</li>
                      <li>• <strong>{isEn ? 'Macro Strategy:' : 'Estrategia Macro:'}</strong> {isEn ? 'Plan priority fronts ("Attack Center and Left", "Let\'s build a straight or trio in Center").' : 'Se planifica la distribución de las zonas ("Ataquemos fuerte Centro e Izquierda", "Intentemos armar una escalera o trío en el centro"), roles o señas.'}</li>
                      <li>• <strong>{isEn ? 'Time Budget:' : 'Presupuesto Temporal:'}</strong> {isEn ? 'Teams can agree on clock distribution (e.g. initial players play in 3-5 seconds to save time for endgame calculations).' : 'Los equipos pueden pactar la distribución de su reloj compartido (ejemplo: acordar que los jugadores iniciales jueguen en 3–5 segundos para reservar tiempo de cálculo al cierre de la ronda).'}</li>
                      <li className="text-emerald-300 font-semibold">• <strong>{isEn ? 'Anti-Alpha Player Guarantee:' : 'Garantía Anti-Jugador Alfa:'}</strong> {isEn ? 'Having no cards in hand prevents any single player from dictating teammate actions.' : 'Al no tener aún las cartas en mano, es imposible que un jugador ordene las jugadas exactas a sus compañeros.'}</li>
                    </ul>
                  </div>

                  {/* FASE 3 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">{isEn ? 'PHASE 3: Dealing Cards' : 'FASE 3: Reparto de Cartas'}</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">{isEn ? 'Deal' : 'Reparto'}</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• {isEn ? 'Immediately upon concluding the 30-second Tactical Phase, the dealer deals 5 cards face-down to each player from the Draw Deck.' : 'Inmediatamente al terminar los 30 segundos de la Fase de Táctica, el repartidor entrega 5 cartas boca abajo a cada jugador del Mazo Principal.'}</li>
                      <li className="text-purple-300 font-bold">• {isEn ? 'Speaking or signaling is strictly forbidden from this instant forward.' : 'Está estrictamente prohibido hablar desde este instante.'}</li>
                    </ul>
                  </div>

                  {/* FASE 4 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">{isEn ? 'PHASE 4: Deployment (Absolute Silence & Shared Team Clock)' : 'FASE 4: Despliegue (Silencio Absoluto y Reloj de Equipo Compartido)'}</h4>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">{isEn ? 'Team Clock' : 'Reloj de Equipo'}</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• <strong>{isEn ? 'Communication Ban:' : 'Prohibición de Comunicación:'}</strong> {isEn ? 'All spoken, written, or gestured communication is prohibited during deployment.' : 'Queda prohibida toda comunicación hablada, escrita o mediante señas durante el despliegue.'}</li>
                      <li>• <strong>{isEn ? 'Clock Start:' : 'Inicio del Reloj:'}</strong> {isEn ? 'The clock for the team holding the Initiative Token starts immediately when the phase begins.' : 'El reloj del equipo con la Ficha de Iniciativa se activa en el instante en que comienza la fase.'}</li>
                      <li>• <strong>{isEn ? 'Turn Order & Alternation:' : 'Orden de Turnos e Intercalado:'}</strong> {isEn ? 'Starts with the Initiative team. Turns strictly alternate 1-by-1 (e.g., A1 ➔ B1 ➔ A2 ➔ B2) until all players have deployed all cards.' : 'Inicia un jugador del equipo con la Ficha de Iniciativa. Los turnos se alternan estrictamente 1 a 1 entre jugadores de ambos equipos de forma fija (ej: A1 ➔ B1 ➔ A2 ➔ B2) hasta que todos los jugadores hayan colocado todas sus cartas.'}</li>
                      <li>• <strong>{isEn ? 'Unique Turn Action:' : 'Acción Única del Turno:'}</strong> {isEn ? 'On their turn, the player MUST place exactly ONE (1) card on any unsaturated front. Passing or playing 2 cards is forbidden. Placing the card switches the clock to the other team.' : 'En su turno, el jugador DEBE colocar exactamente UNA (1) carta en cualquiera de los 3 Frentes que no haya alcanzado el Límite Territorial Compartido. No se permite jugar 2 cartas en un mismo turno ni pasar el turno. Cuando se coloca la carta el cronómetro empieza a contar para el otro equipo.'}</li>
                      <li>• {isEn ? 'If choosing to play face-down (Shadow Card), the player must flip their Shadow Marker.' : 'Si decide jugarla boca abajo (Carta de Sombra), debe voltear/entregar su Marcador de Sombra.'}</li>
                      <li>• <strong>{isEn ? 'Territorial Front Limit:' : 'Restricción del Límite Territorial Compartido:'}</strong> {isEn ? 'Cards cannot be played on fronts where total cards have reached the limit (8 in 1v1/2v2; 12 in 3v3; 16 in 4v4).' : 'No se puede colocar una carta en un Frente donde la suma total de cartas de ambos equipos ya haya alcanzado el límite permitido (8 cartas en 1v1 y 2v2; 12 cartas en 3v3; 16 cartas en 4v4).'}</li>
                      <li className="text-rose-300 font-semibold bg-rose-950/30 p-2.5 rounded border border-rose-900/60">
                        <strong>{isEn ? 'Loss on Time (Flag Fall):' : 'Derrota por Tiempo (Caída de Bandera):'}</strong> {isEn ? 'If a team clock reaches 00:00 before completing turns:' : 'Si el reloj de un equipo llega a 00:00 antes de completar sus turnos:'}
                        <div className="mt-1 pl-2 space-y-0.5 font-normal text-slate-300 text-xs">
                          <div>- {isEn ? 'The round ends instantaneously.' : 'La ronda finaliza de manera instantánea.'}</div>
                          <div>- {isEn ? 'The offending team automatically loses the round and the opponent scores +1 Round Point.' : 'El equipo infractor pierde la ronda automáticamente y el equipo rival suma el +1 Punto de Ronda de forma directa.'}</div>
                          <div>- <strong>{isEn ? 'Cumulative Score Conservation:' : 'Conservación de Puntos Acumulados:'}</strong> {isEn ? 'Cards played on fronts up to flag fall are revealed and tallied (base value + synergy bonuses) for overall match tiebreakers.' : 'Se voltean las cartas jugadas hasta ese instante en la mesa y se suman los valores base y bonificaciones por sinergia ya colocadas por ambos bandos. Esos puntos se registran obligatoriamente en la Hoja de Anotación para el criterio de desempate final de la partida.'}</div>
                        </div>
                      </li>
                      <li>• <strong>{isEn ? 'Automatic Deployment Closure:' : 'Cierre Automático de la Fase de Despliegue:'}</strong> {isEn ? 'Deployment ends automatically when all players have deployed all 5 cards. Clock stops and scoring begins across all 3 Fronts.' : 'La Fase de Despliegue concluye de manera instantánea y automática en el segundo exacto en que todos los jugadores de ambos equipos hayan colocado las 5 cartas de su mano en la mesa.'}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-1 text-xs sm:text-sm">
                  <h4 className="font-bold text-amber-400 mb-2">{isEn ? 'UPON COMPLETING DEPLOYMENT:' : 'TRAS COMPLETAR EL DESPLIEGUE:'}</h4>
                  <div>1. <strong>{isEn ? 'Revelation:' : 'Revelación:'}</strong> {isEn ? 'Flip all Shadow Cards.' : 'Voltear todas las Cartas Sombra.'}</div>
                  <div>2. <strong>{isEn ? 'Sum:' : 'Suma:'}</strong> {isEn ? 'Base Value + Synergy Bonuses (Suit +5, Pair +10, Straight +15, Trio +20).' : 'Valor Base + Bonificaciones por Sinergia (Palo +5, Pareja +10, Escalera +15, Trío +20).'}</div>
                  <div>3. <strong>{isEn ? 'Winner:' : 'Ganador:'}</strong> {isEn ? 'Winning 2 of 3 Fronts = +1 Round Point. Record cumulative front points.' : 'Ganar 2 de 3 Frentes = +1 Pt de Ronda. Registra también los puntos numéricos acumulados en la Hoja de Anotación.'}</div>
                </div>
              </div>
            )}

            {/* SECCIÓN 6: RESOLUCIÓN DE EMPATES Y VACÍOS LEGALES */}
            {activeSection === 'sec6' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 6' : 'Capítulo 6'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '6. Tie Resolution & Edge Cases' : '6. Resolución de Empates y Vacíos Legales'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      {isEn ? 'Tie on a Front' : 'Empate en un Frente'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>If both teams tie in exact score on a Front, the front tiebreaker goes to the team holding the <strong className="text-amber-300">highest base-value individual card</strong> played on it. If exact tie persists, the Front is declared <strong className="text-slate-100">Void</strong> (neither team scores it).</>
                      ) : (
                        <>Si ambos equipos igualan en puntaje exacto en un Frente, el desempate en ese frente lo gana el equipo que posea la <strong className="text-amber-300">carta individual de mayor valor base</strong> jugada en él. Si el empate persiste, el Frente se declara <strong className="text-slate-100">Nulo</strong> (nadie suma ese frente).</>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      {isEn ? 'Tie in the Round' : 'Empate en la Ronda'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>If the round ends tied (e.g. Team A wins Left, Team B wins Right, and Center is Void), the <strong className="text-slate-100">Round is declared Void</strong>. Neither team scores the round point, but numerical points obtained across all fronts <strong className="text-emerald-400">must be recorded</strong> for cumulative scoring.</>
                      ) : (
                        <>Si la ronda concluye igualada (ejemplo: Equipo A gana Izquierda, Equipo B gana Derecha, y el Centro es Nulo), la <strong className="text-slate-100">Ronda se declara Nula</strong>. Ningún equipo anota el punto de ronda, pero los puntos numéricos obtenidos por cada equipo en los frentes de esa ronda <strong className="text-emerald-400">sí deben registrarse</strong> en la hoja de anotación para el cálculo de puntos acumulados.</>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      {isEn ? 'Shadow Card Infraction' : 'Infracción de Carta de Sombra'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>If a player attempts to play a second face-down card after exhausting their Shadow Marker, the card must be flipped immediately and remain exposed face-up on the table.</>
                      ) : (
                        <>Si un jugador intenta jugar una segunda carta boca abajo tras haber consumido su Marcador de Sombra, la carta debe voltearse inmediatamente y quedar expuesta boca arriba en la mesa.</>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-amber-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {isEn ? 'Irregular Clock Press' : 'Pulsación Irregular del Reloj'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>A player cannot press the clock before completely releasing the card on the designated front. If attempted, the clock continues running until the card is properly placed.</>
                      ) : (
                        <>Un jugador no puede pulsar el cronómetro antes de haber soltado la carta de forma definitiva en el frente elegido. Si lo hace, el rival o el árbitro pueden exigir que retire la mano del reloj; el tiempo seguirá corriendo para su equipo hasta que la carta esté correctamente depositada en la mesa.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 7: FIN DE LA PARTIDA Y CRITERIOS DE DESEMPATE */}
            {activeSection === 'sec7' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 7' : 'Capítulo 7'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '7. End of Match & Tiebreakers' : '7. Fin de la Partida y Criterios de Desempate'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                      {isEn ? 'Direct Victory' : 'Victoria Directa'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>After playing the scheduled rounds (4, 6, or 8), the team with the most rounds won takes the victory.</>
                      ) : (
                        <>Tras disputar las rondas reglamentarias (4, 6 u 8), el equipo con más rondas ganadas obtiene la victoria.</>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-amber-400 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      {isEn ? 'First Tiebreaker (Cumulative Points)' : 'Primer Criterio de Desempate (Puntos Acumulados)'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>If tied in rounds (e.g. 4-4 or 3-3 with void rounds), <strong className="text-slate-100">total numerical points scored by each team across all fronts</strong> over all rounds are summed. The team with higher cumulative points wins.</>
                      ) : (
                        <>Si la partida concluye empatada en rondas (ej: 4-4, o 3-3 con rondas nulas), se sumarán los <strong className="text-slate-100">puntos numéricos totales obtenidos por cada equipo en todos los frentes</strong> a lo largo de las rondas reglamentarias. El equipo con mayor puntuación acumulada se declara vencedor.</>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {isEn ? 'Second Tiebreaker (2-Round Overtime)' : 'Segundo Criterio de Desempate (Prórroga de 2 Rondas)'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isEn ? (
                        <>If exact tie persists in cumulative points, <strong className="text-slate-100">2 Overtime Rounds</strong> are played (preserving initiative rotation). If still tied, overtime cumulative points are summed until a winner emerges.</>
                      ) : (
                        <>En el caso poco probable de que persista el empate exacto en puntos acumulados, se jugarán <strong className="text-slate-100">2 Rondas de Prórroga adicionales</strong> (manteniendo la rotación de iniciativa). Si el empate en rondas persiste tras la prórroga, se volverán a sumar los puntos numéricos acumulados de la prórroga. El proceso se repetirá hasta obtener un ganador.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 8: ANEXO: MODO DE JUEGO 1v1 */}
            {activeSection === 'sec8' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    {isEn ? 'Chapter 8' : 'Capítulo 8'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    {isEn ? '8. Annex: 1v1 Duel Mode' : '8. Anexo: Modo de Juego 1v1'}
                  </h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm">
                  {isEn ? (
                    <>General rules apply, with the following specific adaptations for 1-on-1 matches:</>
                  ) : (
                    <>Las reglas generales del juego se mantienen, con las siguientes adaptaciones específicas para partidas de 1 contra 1:</>
                  )}
                </p>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-400">
                    {isEn ? '1. Mathematical & Mechanical Adjustments (The Mirror of 2v2)' : '1. Ajustes Matemáticos y Mecánicos (El Espejo del 2v2)'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isEn ? (
                      <>To maintain territorial tension and mathematical balance, 1v1 mechanically simulates a 2v2. Instead of two minds controlling 10 cards, one mind controls all 10 cards.</>
                    ) : (
                      <>Para mantener la tensión de los espacios y la viabilidad matemática, el modo 1v1 debe "simular" mecánicamente un 2v2. En lugar de que un equipo sean dos mentes controlando 10 cartas en total, un equipo será una sola mente controlando las 10 cartas.</>
                    )}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>{isEn ? 'Deck:' : 'Baraja:'}</strong> {isEn ? '1 standard deck (52 cards).' : '1 Baraja estándar (52 cartas).'}
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>{isEn ? 'Player Hand:' : 'Mano del Jugador:'}</strong> {isEn ? '10 cards per player (instead of 5).' : '10 cartas por jugador (en lugar de 5).'}
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>{isEn ? 'Shared Front Limit:' : 'Límite Territorial Compartido:'}</strong> {isEn ? 'Max 8 cards total per Front summing both duelists.' : 'Máximo 8 cartas en total por Frente sumando las cartas de ambos jugadores.'}
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>{isEn ? 'Shadow Cards:' : 'Cartas Sombra:'}</strong> {isEn ? 'Each player receives ' : 'Cada jugador recibe '}<strong className="text-purple-400">{isEn ? '2 Shadow Markers' : '2 Marcadores de Sombra'}</strong> {isEn ? '(up to 2 face-down cards per round).' : '(puede jugar hasta 2 cartas boca abajo durante la ronda).'}
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800 sm:col-span-2">
                      <strong>{isEn ? 'Clock Management in 1v1:' : 'Gestión del Reloj en 1v1:'}</strong> {isEn ? 'The solo player assumes all 10 turns, having the full 10-turn clock pool (e.g. 3m 20s in Medium speed), switching the clock after each card.' : 'El jugador individual asume los 10 turnos de su equipo, disponiendo de la bolsa de tiempo completa de 10 turnos (ej. 3 min 20 s en Ritmo Medio) para alternar sus jugadas frente al rival, pulsando el reloj tras cada una de sus 10 cartas colocadas.'}
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-amber-400">{isEn ? '2. The 4 Round Phases' : '2. Las 4 Fases de la Ronda'}</h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                      {isEn ? 'Identical to Team Mode' : 'Fases Idénticas al Modo Equipos'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 bg-amber-950/20 border border-amber-800/40 p-3 rounded-lg leading-relaxed">
                    {isEn ? (
                      <>Phases proceed identically, using the <strong>tactical phase (30s)</strong> to plan your own attacks and counter-moves mentally.</>
                    ) : (
                      <>Las fases se desarrollan completamente igual que en los otros modos, pero usando la <strong>fase de táctica (30s)</strong> para planear cómo vas a atacar en la siguiente ronda (en vez de para comunicarse).</>
                    )}
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-100 font-bold">{isEn ? 'PHASE 1: Preparation & Initiative' : 'FASE 1: Preparación e Iniciativa'}</strong>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">Setup</span>
                      </div>
                      <p className="text-slate-400">
                        {isEn ? 'Each duelist activates their 2 Shadow Markers. Initiative rotates automatically to the opponent (or is drawn randomly in Round 1). The Trump Card mechanic has been completely eliminated to remove arbitrary luck.' : 'Cada duelista coloca sus 2 Marcadores de Sombra en estado activo. La Iniciativa rota automáticamente al rival respecto a la ronda previa (o se determina por sorteo aleatorio en Ronda 1). La mecánica de la carta de sinergia/triunfo ha sido completamente eliminada para mitigar el factor suerte.'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-100 font-bold">{isEn ? 'PHASE 2: Tactical Phase (Clock: 30s Strict — NO CARDS IN HAND)' : 'FASE 2: Fase Táctica (Reloj: 30s Estrictos — SIN CARTAS EN MANO)'}</strong>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">30s</span>
                      </div>
                      <p className="text-slate-400">
                        <strong className="text-amber-300">{isEn ? 'Individual Tactical Planning:' : 'Planificación Táctica Individual:'}</strong> {isEn ? '30 seconds without cards in hand to reflect, plan front priorities, and anticipate enemy moves.' : 'En lugar de comunicación entre compañeros, cada jugador dispone de 30 segundos sin cartas en mano para reflexionar, planificar mentalmente el enfoque de los 3 frentes y anticipar los contrataques del oponente.'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-100 font-bold">{isEn ? 'PHASE 3: Dealing Cards (Absolute Silence)' : 'FASE 3: Reparto de Cartas (Silencio Absoluto)'}</strong>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">{isEn ? 'Deal' : 'Reparto'}</span>
                      </div>
                      <p className="text-slate-400">
                        {isEn ? '10 cards dealt face-down to each duelist. Absolute silence and focus.' : 'Inmediatamente al terminar los 30 segundos de la Fase Táctica, el repartidor entrega 10 cartas boca abajo a cada duelista. Silencio absoluto y concentración estricta desde este instante.'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-100 font-bold">{isEn ? 'PHASE 4: Tactical Deployment (Dual Player Clock)' : 'FASE 4: Despliegue Táctico (Silencio Absoluto — Reloj de Jugador Compartido)'}</strong>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">{isEn ? 'Dual Clock' : 'Reloj Dual'}</span>
                      </div>
                      <p className="text-slate-400">
                        {isEn ? '1-by-1 alternating turns. 1 card per turn on an unsaturated front (max 8 cards combined). Up to 2 Shadow Cards. Clock matches mode speed (Fast: 1:40, Medium: 3:20, Slow: 5:00). Flag Fall awards round to opponent while conserving table points.' : 'Turnos 1 a 1 alternados (Jugador A ➔ Jugador B ➔ Jugador A...) comenzando por quien tenga la Iniciativa. Se coloca exactamente una carta por turno en un frente no saturado (máximo 8 cartas sumando ambos duelistas). Cada jugador puede jugar hasta 2 Cartas de Sombra durante la ronda volteando sus marcadores. En 1v1 el reloj de equipo equivale al reloj de cada duelista (Rápido: 1m 40s, Medio: 3m 20s, Lento: 5m 00s). La Caída de Bandera a 00:00 otorga automáticamente la ronda (+1 Punto) al contrincante conservando los puntos acumulados en mesa. Concluye al jugar las 10 cartas.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pie del Manual */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {manualT.footerText}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow"
          >
            {manualT.footerBackBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
