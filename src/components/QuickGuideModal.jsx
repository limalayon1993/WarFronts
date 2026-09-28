import React from 'react';
import {
  X,
  Zap,
  Users,
  Clock,
  ShieldAlert,
  Sparkles,
  Flame,
  Scale,
  Swords,
  Layers,
  Trophy,
} from 'lucide-react';

export function QuickGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden text-slate-100">
        {/* Cabecera de la Guía Rápida de Mesa */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-100">
                  Frentes de Guerra — Guía Rápida de Mesa v1.6
                </h2>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                  Hoja de Referencia
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Edición Oficial por Equipos (2v2, 3v3, 4v4) + Anexo Duelo 1v1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-slate-300">
                <Swords className="w-3.5 h-3.5 text-amber-400" /> 3 Frentes: Izquierdo, Centro, Derecho
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Ritmos: Rápido (4), Medio (6), Lento (8)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cerrar Guía"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel visual de 4 Bloques Principales + Anexo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Fila 1: Especificaciones por Modo y Resolución de Empates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* BLOQUE 1: ESPECIFICACIONES Y LÍMITES POR MODO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4" /> 1. Especificaciones y Límites por Modo
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Formato Oficial v1.6</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  {/* Modo 2v2 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                      <span>Modo 2v2</span>
                      <span className="text-slate-500 font-normal">(4 jug.)</span>
                    </div>
                    <div className="text-lg font-black text-slate-100 my-0.5">8 Cartas</div>
                    <div className="text-[10px] text-rose-400 font-semibold">Límite TOTAL / frente</div>
                    <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-850">
                      🎴 1 Baraja • 5 cart./jug.
                    </div>
                  </div>

                  {/* Modo 3v3 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                      <span>Modo 3v3</span>
                      <span className="text-slate-500 font-normal">(6 jug.)</span>
                    </div>
                    <div className="text-lg font-black text-slate-100 my-0.5">12 Cartas</div>
                    <div className="text-[10px] text-rose-400 font-semibold">Límite TOTAL / frente</div>
                    <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-850">
                      🎴 2 Barajas • 5 cart./jug.
                    </div>
                  </div>

                  {/* Modo 4v4 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                      <span>Modo 4v4</span>
                      <span className="text-slate-500 font-normal">(8 jug.)</span>
                    </div>
                    <div className="text-lg font-black text-slate-100 my-0.5">16 Cartas</div>
                    <div className="text-[10px] text-rose-400 font-semibold">Límite TOTAL / frente</div>
                    <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-850">
                      🎴 2 Barajas • 5 cart./jug.
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-rose-300">Límite Compartido (Saturación):</strong> Suma de cartas de AMBOS equipos en un frente. Al alcanzar el tope, el frente se cierra inmediatamente.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-300">Rotación de Iniciativa:</strong> Ronda 1 por corte de baraja (carta más alta). Desde Ronda 2 rota automáticamente al rival.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Partida Oficial: Según el ritmo elegido</span>
                <span className="text-emerald-400 font-bold">Gana quien sume más Puntos de Ronda</span>
              </div>
            </div>

            {/* BLOQUE 2: RESOLUCIÓN DE EMPATES Y CRITERIO FINAL */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                    <Scale className="w-4 h-4" /> 2. Resolución de Empates y Criterio Final
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Jerarquía Oficial</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Criterio 1 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-100 block">Empate en Puntaje de Frente:</strong>
                      <span className="text-slate-400">
                        Gana el equipo que posea la <span className="text-amber-300 font-bold">carta individual de mayor valor base</span> jugada en él. Si persiste el empate exacto, el Frente se declara Nulo.
                      </span>
                    </div>
                  </div>

                  {/* Criterio 2 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-100 block">Empate de Ronda (ej. 1-1 y 1 Nulo):</strong>
                      <span className="text-slate-400">
                        Ronda Nula. Ninguno suma punto de ronda, pero <span className="text-emerald-400 font-bold">SE REGISTRAN</span> los puntos numéricos acumulados de todos los frentes.
                      </span>
                    </div>
                  </div>

                  {/* Criterio 3 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-100 block">Desempate de Partida:</strong>
                      <div className="text-[11px] text-slate-400 space-y-0.5 mt-0.5">
                        <div>• <strong className="text-emerald-300">1º Puntos Acumulados:</strong> Suma total de puntos numéricos de todos los frentes a lo largo de las rondas.</div>
                        <div>• <strong className="text-amber-300">2º Prórroga:</strong> 2 rondas adicionales si persiste el empate exacto en acumulados.</div>
                        <div>• <strong className="text-slate-300">3º Acumulación Continua:</strong> Si se empata prórroga, se suman puntos hasta desempate definitivo.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded">
                <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span><strong className="text-slate-200">Mazo Continuo:</strong> El pozo de descartes NO se rebaraja entre rondas salvo que se agote el mazo principal.</span>
              </div>
            </div>
          </div>

          {/* Fila 2: Las 4 Fases de la Ronda */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4" /> 3. Las 4 Fases de la Ronda (Secuencia de Turno Inflexible)
              </h3>
              <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                Táctica: 30s | Turno: 15s • 4 Pasos Estrictos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Fase 1 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-400">FASE 1</span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded uppercase">Setup</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Preparación & Triunfo</h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• <strong>Palo Triunfo:</strong> Revelar 1ª carta del mazo (<span className="text-amber-400">+2 pts</span> por carta de este palo).</li>
                  <li>• <strong>Marcador Sombra:</strong> Colocar en estado activo frente a cada jugador.</li>
                  <li>• <strong>Iniciativa:</strong> Rota al equipo rival cada ronda.</li>
                </ul>
                <div className="text-[9px] text-slate-500 mt-2 italic">La carta de triunfo va al descarte al terminar la ronda.</div>
              </div>

              {/* Fase 2 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-400">FASE 2</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">30 Segundos</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Táctica de Equipo</h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• <strong>Comunicación Libre:</strong> Coordinar estrategia macro, frentes a priorizar y roles/señas.</li>
                  <li className="text-rose-300 font-semibold">• <strong>SIN CARTAS EN MANO:</strong> Evita el "Jugador Alfa" al no conocer la mano exacta.</li>
                </ul>
                <div className="text-[9px] text-slate-500 mt-2 italic">Planificación general antes del reparto.</div>
              </div>

              {/* Fase 3 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-400">FASE 3</span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded uppercase">Reparto</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Reparto de Cartas</h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• <strong>5 Cartas:</strong> Se reparten boca abajo a cada jugador del mazo principal.</li>
                  <li className="text-purple-300 font-semibold">• <strong>SILENCIO ABSOLUTO:</strong> Prohibido hablar o hacer señas desde este instante.</li>
                </ul>
                <div className="text-[9px] text-slate-500 mt-2 italic">Inicia el despliegue a ciegas y deducción.</div>
              </div>

              {/* Fase 4 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-400">FASE 4</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 rounded font-mono">15s / Turno</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">Despliegue Táctico</h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• <strong>Turnos 1 a 1:</strong> Alternado (<span className="font-mono">1A➔1B➔2A➔2B</span>).</li>
                  <li>• <strong>Acción:</strong> Jugar 1 carta en un frente NO saturado.</li>
                  <li>• <strong>Carta Sombra:</strong> Máx 1 boca abajo por jugador volteando marcador.</li>
                  <li className="text-amber-400">• <strong>Exceder 15s:</strong> Descarta al azar al pozo.</li>
                </ul>
                <div className="text-[9px] text-slate-500 mt-2 italic">Cierre al colocar las 5 cartas.</div>
              </div>
            </div>

            {/* Tras completar el despliegue */}
            <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> TRAS COMPLETAR EL DESPLIEGUE:
              </span>
              <span>1. <strong>Revelación:</strong> Voltear todas las Cartas Sombra.</span>
              <span>2. <strong>Suma:</strong> Valor Base + Sinergias (+5) + Triunfos (+2).</span>
              <span className="text-emerald-400 font-bold">3. <strong>Ganador:</strong> Ganar al menos 2 de 3 frentes = +1 Pt de Ronda.</span>
            </div>
          </div>

          {/* Fila 3: Cálculo de Fuerza y Anexo 1v1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* BLOQUE 4: CÁLCULO DE FUERZA POR FRENTE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 4. Cálculo de Fuerza por Frente (Suma Total)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Valores Base + Bonos</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cartas Numéricas</span>
                    <strong className="text-xs text-slate-100 block">Valor Nominal</strong>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cartas del 2 al 10 otorgan su valor exacto (2 = 2 pts, 10 = 10 pts).
                    </p>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Figuras y As</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-400">
                      <span>J=11</span> <span>Q=12</span> <span>K=13</span> <span className="text-emerald-400 font-black">A=14</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      El As (A) es la carta de mayor valor base (14 pts).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-800/60">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 uppercase mb-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Sinergia de Palo
                    </div>
                    <strong className="text-sm text-indigo-200 block">+5 Puntos Bono</strong>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Por cada carta adicional del mismo palo que ponga tu equipo en un mismo frente.
                    </p>
                  </div>

                  <div className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/60">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase mb-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Palo Triunfo
                    </div>
                    <strong className="text-sm text-amber-200 block">+2 Puntos Extra</strong>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Por cada carta jugada que coincida con el palo de triunfo revelado en Fase 1.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-center font-mono text-slate-400">
                Cálculo: <strong className="text-slate-200">Valor Base + Sinergias (+5) + Triunfos (+2)</strong>
              </div>
            </div>

            {/* ANEXO: MODO DUELO 1V1 (EL ESPEJO DEL 2V2) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                    <Swords className="w-4 h-4" /> Anexo: Modo Duelo 1v1 (El Espejo del 2v2)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">2 Jugadores • Rondas según Ritmo</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mb-3">
                  <div className="text-[11px] text-slate-300 font-semibold mb-1">1. Ajustes Matemáticos y Mecánicos</div>
                  <div className="text-[10px] text-slate-400 mb-2">Simula un 2v2: una sola mente controla las 10 cartas del equipo.</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Baraja</span>
                      <strong className="text-slate-200 text-[11px]">1 (52 cartas)</strong>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Mano</span>
                      <strong className="text-slate-200 text-[11px]">10 cartas</strong>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Límite Frente</span>
                      <strong className="text-slate-200 text-[11px]">8 cartas</strong>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Sombras</span>
                      <strong className="text-purple-400 text-[11px]">2 por jugador</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200 mb-0.5">2. Adaptación de las 4 Fases:</div>
                  <div>• <strong>Fase 1:</strong> Revelar Palo Triunfo (+2 pts). Preparar 2 Marcadores Sombra.</div>
                  <div>• <strong>Fase 2:</strong> Reparto directo de 10 cartas a cada jugador.</div>
                  <div>• <strong>Fase 3 Planificación:</strong> Reloj de 30s de silencio para estudiar mano de 10 cartas.</div>
                  <div>• <strong>Fase 4 Despliegue:</strong> Turnos 1 a 1 (<span className="font-mono">A➔B➔A</span>). Reloj de 20s/turno. 1 carta por turno.</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>⚡ Mazo Continuo: Sin rebarajar salvo agotamiento</span>
                <span className="text-amber-400 font-bold">Modalidad Duelo 1v1 Oficial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie con botón de cerrar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Puedes consultar esta hoja de referencia en cualquier momento durante la partida.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
}
