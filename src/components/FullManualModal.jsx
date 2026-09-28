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
} from 'lucide-react';

const SECTIONS = [
  { id: 'sec1', num: '1', title: 'Introducción y Objetivo' },
  { id: 'sec2', num: '2', title: 'Materiales y Gestión de Mazos' },
  { id: 'sec3', num: '3', title: 'Disposición e Iniciativa' },
  { id: 'sec4', num: '4', title: 'Conceptos Clave y Valores' },
  { id: 'sec5', num: '5', title: 'Estructura Paso a Paso de la Ronda' },
  { id: 'sec6', num: '6', title: 'Resolución de Empates y Vacíos' },
  { id: 'sec7', num: '7', title: 'Fin de Partida y Desempates' },
  { id: 'sec8', num: '8', title: 'Anexo: Modo de Juego 1v1' },
];

export function FullManualModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('sec1');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn text-slate-100">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">
        {/* Cabecera del Manual Completo */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-100">
                  Reglamento Oficial: Frentes de Guerra
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-black uppercase">
                  Versión Oficial 1.6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Edición Oficial Competitiva y Casual • Texto Íntegro del Reglamento
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Cerrar Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Manual con Navegación Lateral y Contenido */}
        <div className="flex-1 flex overflow-hidden">
          {/* Barra Lateral de Secciones */}
          <aside className="w-64 border-r border-slate-800 bg-slate-950/80 p-3 hidden sm:flex flex-col justify-between overflow-y-auto shrink-0">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-2">
                Índice de Capítulos
              </span>
              {SECTIONS.map((sec) => (
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
              <span className="font-bold text-slate-200 block mb-1">Anotación Oficial:</span>
              Reglamento compilado para competiciones 1v1, 2v2, 3v3 y 4v4.
            </div>
          </aside>

          {/* Selector de pestañas para móvil */}
          <div className="sm:hidden flex overflow-x-auto border-b border-slate-800 p-2 gap-1 bg-slate-950">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  activeSection === sec.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Cap. {sec.num}
              </button>
            ))}
          </div>

          {/* Área de Lectura del Contenido */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 leading-relaxed text-sm text-slate-300 bg-slate-950">
            {/* SECCIÓN 1: INTRODUCCIÓN Y OBJETIVO */}
            {activeSection === 'sec1' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 1</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">1. Introducción y Objetivo</h3>
                </div>

                <p className="text-slate-300">
                  <strong className="text-slate-100">Frentes de Guerra</strong> es un juego táctico de cartas por equipos basado en el control de zonas, la información imperfecta, la deducción estratégica y el trabajo en equipo sin microgestión.
                </p>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Objetivo de la Partida
                  </h4>
                  <p>
                    La partida se disputa a un <strong className="text-slate-100">total fijo de Rondas</strong>. El equipo que obtenga la mayoría de puntos de ronda se declara vencedor. En caso de empate al finalizar las rondas, la partida se resolverá mediante el criterio de <strong className="text-emerald-400">puntuación acumulada</strong> (puntos totales en cada ronda).
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Los ritmos oficiales son los siguientes:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">Rápido:</strong> 4 rondas.
                      </li>
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">Medio:</strong> 6 rondas.
                      </li>
                      <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400 block">Lento:</strong> 8 rondas.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-emerald-400" /> Objetivo de la Ronda
                  </h4>
                  <p>
                    Obtener el mayor valor numérico total en <strong className="text-emerald-400">al menos 2 de los 3 Frentes de Guerra</strong> (Izquierdo, Central y Derecho) al finalizar el despliegue.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: MATERIALES Y GESTIÓN DE MAZOS */}
            {activeSection === 'sec2' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 2</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">2. Materiales y Gestión de Mazos</h3>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-100">Componentes Oficiales:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>Jugadores:</strong> 1v1 (ver anexo), 2v2, 3v3 o 4v4.
                    </li>
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>Barajas (Póker estándar sin comodines/jokers):</strong>
                      <div className="mt-1 text-slate-400 space-y-0.5">
                        <div>• <strong>Partidas 2v2:</strong> 1 Baraja estándar (52 cartas).</div>
                        <div>• <strong>Partidas 3v3 y 4v4:</strong> 2 Barajas estándar combinadas y mezcladas (104 cartas).</div>
                      </div>
                    </li>
                    <li className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <strong>Componentes Adicionales:</strong>
                      <div className="mt-1 text-slate-400 space-y-0.5">
                        <div>• <strong>1 Ficha de Iniciativa.</strong></div>
                        <div>• <strong>1 Marcador de Sombra por jugador</strong> (puede ser una moneda, piedra, dado, ficha o papel).</div>
                        <div>• <strong>Hoja de Anotación / Marcador:</strong> 1 bloc de papel o marcador digital para registrar tanto los puntos de ronda como la suma de puntos numéricos de cada frente por ronda.</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Gestión del Mazo Principal y Pozo de Descartes
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100">Mazo Principal (Mazo de Robo):</strong> Es la pila boca abajo de donde se reparten las cartas a los jugadores y se revela el Palo Triunfo.
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100">Pozo de Descartes:</strong> Pila boca arriba a un lado de la mesa donde se colocan todas las cartas jugadas en los frentes al terminar una ronda, así como la carta revelada del Palo Triunfo.
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-amber-300">Regla de Continuidad y Conteo de Cartas:</strong> Las cartas jugadas en una ronda <strong className="text-slate-100">NO se rebarajan</strong> al finalizar dicha ronda; permanecen en el pozo de descartes. Esto permite a los jugadores realizar un conteo estratégico de cartas altas y triunfos que ya han salido.
                    </li>
                    <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                      <strong className="text-rose-300">Rebarajado por Agotamiento:</strong> Cuando el Mazo Principal no tenga suficientes cartas para revelar el Palo Triunfo o repartir las cartas a cada jugador al inicio de una ronda, se toma todo el Pozo de Descartes, se baraja minuciosamente y se forma un nuevo Mazo Principal.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: DISPOSICIÓN Y DETERMINACIÓN DE INICIATIVA */}
            {activeSection === 'sec3' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 3</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">3. Disposición y Determinación de Iniciativa</h3>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">Disposición de la Mesa</h4>
                  <p>
                    Se delimitan 3 zonas en el centro de la mesa: <strong className="text-slate-100">Frente Izquierdo, Frente Central y Frente Derecho</strong>. El Mazo Principal y el Pozo de Descartes se ubican a un costado.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">Determinación de la Iniciativa Inicial (Corte de Baraja)</h4>
                  <p>
                    Antes de iniciar la Ronda 1, un representante de cada equipo roba una carta del mazo. El equipo que obtenga la carta de mayor valor base recibe la <strong className="text-amber-400">Ficha de Iniciativa</strong>. A continuación, las cartas utilizadas se devuelven al mazo y este se vuelve a barajar completamente.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-100">Rotación de Iniciativa</h4>
                  <p>
                    A partir de la Ronda 2, la Ficha de Iniciativa <strong className="text-emerald-400">rota automáticamente al equipo contrario</strong> al inicio de cada ronda, independientemente de quién haya ganado la ronda anterior.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 4: CONCEPTOS CLAVE Y VALORES */}
            {activeSection === 'sec4' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 4</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">4. Conceptos Clave y Valores</h3>
                </div>

                <p className="text-slate-300">
                  Para ganar un frente, se suma el valor de las cartas jugadas en él por cada equipo.
                </p>

                {/* Valores Base */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100">Valor Numérico Base de las Cartas:</h4>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">Cartas del 2 al 10 = Su valor nominal.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">J (Jota)</strong> = 11 puntos.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">Q (Reina)</strong> = 12 puntos.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-amber-400">K (Rey)</strong> = 13 puntos.</li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800"><strong className="text-emerald-400">A (As)</strong> = 14 puntos.</li>
                  </ul>
                </div>

                {/* Sinergia */}
                <div className="bg-indigo-950/30 border border-indigo-800/60 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Sinergia de Palo (+5 Puntos)
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Por cada carta adicional del mismo palo que un equipo coloque en un mismo Frente, ese equipo suma un <strong className="text-indigo-300">bono de 5 puntos</strong>.
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded border border-slate-800 text-xs text-slate-300">
                    <strong>Ejemplo Oficial:</strong> Un equipo juega un 10 de Corazones y un Rey de Corazones en el Frente Central. Suma: 23 puntos base + 5 de sinergia = <strong className="text-emerald-400">28 puntos</strong>.
                  </div>
                </div>

                {/* Palo Triunfo */}
                <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" /> El Palo Triunfo (+2 Puntos por carta)
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Al inicio de cada ronda, se revela la carta superior del Mazo Principal para definir el "Palo Triunfo". Toda carta de ese palo jugada en la mesa obtiene <strong className="text-amber-300">2 puntos adicionales</strong> sobre su valor base.
                  </p>
                  <p className="text-xs text-slate-400">
                    • <strong>Ubicación:</strong> La carta revelada se coloca visible al lado del mazo como indicador visual. No pertenece a ningún jugador, no puede jugarse en ningún frente y al finalizar la ronda se envía al pozo de descarte.
                  </p>
                </div>

                {/* Carta y Marcador de Sombra */}
                <div className="bg-purple-950/30 border border-purple-800/60 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-purple-300 flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-purple-400" /> La Carta de Sombra (Opcional - Máximo 1 por ronda)
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Cada jugador tiene la opción de jugar como <strong className="text-purple-300">máximo 1 de sus 5 cartas BOCA ABAJO</strong> durante la ronda. Si la estrategia del equipo requiere jugar todas sus cartas boca arriba, pueden hacerlo libremente.
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded border border-slate-800 text-xs text-slate-300 mt-2">
                    <strong>El Marcador de Sombra (Control Anti-trampas):</strong> Al inicio de la ronda, cada jugador coloca su Marcador de Sombra en estado activo frente a sí. En el momento en que un jugador decide jugar una carta boca abajo, debe voltear o entregar su Marcador de Sombra. Esto garantiza transparencia total sobre quién conserva la opción de jugar oculto y quién ya la ha utilizado.
                  </div>
                </div>

                {/* Límite Territorial Compartido */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Límite Territorial Compartido por Frente
                  </h4>
                  <p className="text-xs sm:text-sm">
                    Se establece un número máximo de casillas en total por Frente para la suma de las cartas de ambos equipos:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 my-2">
                    <li>• <strong>Partidas 1v1 y 2v2:</strong> Máximo 8 cartas en total por Frente.</li>
                    <li>• <strong>Partidas 3v3:</strong> Máximo 12 cartas en total por Frente.</li>
                    <li>• <strong>Partidas 4v4:</strong> Máximo 16 cartas en total por Frente.</li>
                  </ul>
                  <p className="text-xs text-rose-300 font-semibold bg-rose-950/30 p-2.5 rounded border border-rose-900/50">
                    Regla de Cierre (Saturación): En cuanto un Frente alcanza dicho límite con la suma de las cartas de ambos equipos, queda saturado y no se pueden colocar más cartas en él durante el resto de la ronda.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 5: ESTRUCTURA PASO A PASO DE LA RONDA */}
            {activeSection === 'sec5' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 5</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">5. Estructura Paso a Paso de la Ronda</h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm">
                  Cada ronda se divide strictly en las siguientes fases secuenciales:
                </p>

                <div className="space-y-3">
                  {/* FASE 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">FASE 1: Palo Triunfo e Iniciativa</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Setup</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs sm:text-sm space-y-1 text-slate-300">
                      <li>Si el Mazo Principal no tiene suficientes cartas, se rebaraja el Pozo de Descartes para formar el nuevo mazo.</li>
                      <li>Se revela la carta superior del Mazo Principal y se coloca a un lado como indicador del Palo Triunfo.</li>
                      <li>Todos los jugadores colocan su Marcador de Sombra en estado activo frente a ellos.</li>
                    </ol>
                  </div>

                  {/* FASE 2 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">FASE 2: Táctica de Equipo (Reloj: 30s Estrictos - SIN CARTAS EN MANO)</h4>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">30s</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• <strong>Comunicación Total Libre:</strong> Los equipos disponen de un tiempo de 30 segundos para hablar y coordinar su estrategia general antes de recibir sus cartas.</li>
                      <li>• <strong>Estrategia Macro:</strong> Se planifica la distribución de las zonas ("Ataquemos fuerte Centro e Izquierda", "Si alguien recibe triunfos que refuerce el flanco"), roles o señas.</li>
                      <li className="text-emerald-300 font-semibold">• <strong>Garantía Anti-Jugador Alfa:</strong> Al no tener aún las cartas en mano, es imposible que un jugador ordene las jugadas exactas a sus compañeros.</li>
                    </ul>
                  </div>

                  {/* FASE 3 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">FASE 3: Reparto de Cartas</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Reparto</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• Inmediatamente al terminar los 30 segundos de la Fase de Táctica, el repartidor entrega 5 cartas boca abajo a cada jugador del Mazo Principal.</li>
                      <li className="text-purple-300 font-bold">• Está estrictamente prohibido hablar desde este instante.</li>
                    </ul>
                  </div>

                  {/* FASE 4 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-amber-400">FASE 4: Despliegue (Silencio Absoluto)</h4>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">15s / Turno</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
                      <li>• <strong>Prohibición de Comunicación:</strong> Queda prohibida toda comunicación hablada, escrita o mediante señas durante el despliegue.</li>
                      <li>• <strong>Orden de Turnos e Intercalado:</strong> Inicia un jugador del equipo con la Ficha de Iniciativa. Los turnos se alternan estrictamente 1 a 1 entre jugadores de ambos equipos de forma fija (ej: A1 ➔ B1 ➔ A2 ➔ B2) hasta que todos los jugadores hayan colocado sus 5 cartas.</li>
                      <li>• <strong>Acción Única del Turno (Reloj: 15s):</strong> En su turno, el jugador DEBE colocar exactamente UNA (1) carta en cualquiera de los 3 Frentes que no haya alcanzado el Límite Territorial Compartido. No se permite jugar 2 cartas en un mismo turno ni pasar el turno.</li>
                      <li>• Si decide jugarla boca abajo (Carta de Sombra), debe voltear/entregar su Marcador de Sombra.</li>
                      <li>• <strong>Restricción del Límite Territorial Compartido:</strong> No se puede colocar una carta en un Frente donde la suma total de cartas de ambos equipos ya haya alcanzado el límite permitido (8 cartas en 1v1 y 2v2; 12 cartas en 3v3; 16 cartas en 4v4).</li>
                      <li className="text-rose-300 font-semibold">• <strong>Penalización por Tiempo:</strong> Si un jugador supera los 15s, pierde su turno y descarta una carta al azar de su mano directamente al pozo de descarte (esa carta no puntúa ni va a ningún frente).</li>
                      <li>• <strong>Cierre Automático de la Fase de Despliegue:</strong> Concluye de manera instantánea y automática en el segundo exacto en que todos los jugadores de ambos equipos hayan colocado las 5 cartas de su mano en la mesa (o hayan descartado por penalización). No es posible "pasar", guardar cartas ni prolongar la fase.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-1 text-xs sm:text-sm">
                  <h4 className="font-bold text-amber-400 mb-2">TRAS COMPLETAR EL DESPLIEGUE:</h4>
                  <div>1. <strong>Revelación:</strong> Voltear todas las Cartas Sombra.</div>
                  <div>2. <strong>Suma:</strong> Valor Base + Sinergias (+5) + Triunfos (+2).</div>
                  <div>3. <strong>Ganador:</strong> Ganar 2 de 3 Frentes = +1 Pt de Ronda. Registra también los puntos numéricos acumulados en la Hoja de Anotación.</div>
                </div>
              </div>
            )}

            {/* SECCIÓN 6: RESOLUCIÓN DE EMPATES Y VACÍOS LEGALES */}
            {activeSection === 'sec6' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 6</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">6. Resolución de Empates y Vacíos Legales</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" /> Empate en un Frente
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Si ambos equipos igualan en puntaje exacto en un Frente, el desempate en ese frente lo gana el equipo que posea la <strong className="text-amber-300">carta individual de mayor valor base</strong> jugada en él. Si el empate persiste, el Frente se declara <strong className="text-slate-100">Nulo</strong> (nadie suma ese frente).
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" /> Empate en la Ronda
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Si la ronda concluye igualada (ejemplo: Equipo A gana Izquierda, Equipo B gana Derecha, y el Centro es Nulo), la <strong className="text-slate-100">Ronda se declara Nula</strong>. Ningún equipo anota el punto de ronda, pero los puntos numéricos obtenidos por cada equipo en los frentes de esa ronda <strong className="text-emerald-400">sí deben registrarse</strong> en la hoja de anotación para el cálculo de puntos acumulados.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" /> Infracción de Carta de Sombra
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Si un jugador intenta jugar una segunda carta boca abajo tras haber consumido su Marcador de Sombra, la carta debe voltearse inmediatamente y quedar expuesta boca arriba en la mesa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 7: FIN DE LA PARTIDA Y CRITERIOS DE DESEMPATE */}
            {activeSection === 'sec7' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 7</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">7. Fin de la Partida y Criterios de Desempate</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-400" /> Victoria Directa
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Tras disputar las rondas reglamentarias (4, 6 u 8), el equipo con más rondas ganadas obtiene la victoria.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-amber-400 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" /> Primer Criterio de Desempate (Puntos Acumulados)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Si la partida concluye empatada en rondas (ej: 4-4, o 3-3 con rondas nulas), se sumarán los <strong className="text-slate-100">puntos numéricos totales obtenidos por cada equipo en todos los frentes</strong> a lo largo de las rondas reglamentarias. El equipo con mayor puntuación acumulada se declara vencedor.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" /> Segundo Criterio de Desempate (Prórroga de 2 Rondas)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      En el caso poco probable de que persista el empate exacto en puntos acumulados, se jugarán <strong className="text-slate-100">2 Rondas de Prórroga adicionales</strong> (manteniendo la rotación de iniciativa). Si el empate en rondas persiste tras la prórroga, se volverán a sumar los puntos numéricos acumulados de la prórroga. El proceso se repetirá hasta obtener un ganador.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 8: ANEXO: MODO DE JUEGO 1v1 */}
            {activeSection === 'sec8' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Capítulo 8</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">8. Anexo: Modo de Juego 1v1</h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm">
                  Las reglas generales del juego se mantienen, con las siguientes adaptaciones específicas para partidas de 1 contra 1:
                </p>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-400">1. Ajustes Matemáticos y Mecánicos (El Espejo del 2v2)</h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Para mantener la tensión de los espacios y la viabilidad matemática, el modo 1v1 debe "simular" mecánicamente un 2v2. En lugar de que un equipo sean dos mentes controlando 10 cartas en total, un equipo será una sola mente controlando las 10 cartas.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>Baraja:</strong> 1 Baraja estándar (52 cartas).
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>Mano del Jugador:</strong> 10 cartas por jugador (en lugar de 5).
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>Límite Territorial Compartido:</strong> Máximo 8 cartas en total por Frente sumando las cartas de ambos jugadores.
                    </li>
                    <li className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <strong>Cartas Sombra:</strong> Cada jugador recibe <strong className="text-purple-400">2 Marcadores de Sombra</strong> (puede jugar hasta 2 cartas boca abajo durante la ronda).
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-400">2. Adaptación de las 4 Fases de la Ronda</h4>
                  <p className="text-xs text-slate-400">
                    El principal desafío del 1v1 es que la "Fase de Táctica (30s)" pierde su sentido original de comunicación. Así es como se estructura la ronda:
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100 block mb-0.5">FASE 1: Preparación y Triunfo (Sin Cambios)</strong>
                      Se revela la carta superior del mazo para definir el Palo Triunfo (+2 pts). El jugador con la Ficha de Iniciativa se prepara para abrir.
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100 block mb-0.5">FASE 2: Reparto Inmediato</strong>
                      Se reparten las 10 cartas a cada jugador.
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100 block mb-0.5">FASE 3: Planificación Estratégica (Reemplaza la Táctica)</strong>
                      Reloj de 30 Segundos: Ambos jugadores tienen medio minuto de silencio absoluto para analizar su mano de 10 cartas, planificar sus Sinergias y decidir qué frentes atacarán o abandonarán.
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <strong className="text-slate-100 block mb-0.5">FASE 4: Despliegue (El Duelo)</strong>
                      Turnos 1 a 1: Inicia el jugador con Iniciativa. Juegan de forma alternada (Jugador A - Jugador B - Jugador A...). Reloj de 20s: Se agregan 5 segundos ya que hay más cartas que revisar. Deben colocar 1 carta por turno.
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
            Reglamento Oficial Frentes de Guerra v1.6 — Todos los derechos reservados
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow"
          >
            Entendido, Volver
          </button>
        </div>
      </div>
    </div>
  );
}
