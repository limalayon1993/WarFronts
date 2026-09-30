import React, { useState } from 'react';
import { X, Shield, Swords, Sparkles, EyeOff, Trophy, Users, TrendingUp, Flame } from 'lucide-react';

export function RulesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Reglamento Oficial: Frentes de Guerra (v1.6)</h2>
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
            Objetivo y Frentes
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'values'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Puntos y Sinergias
          </button>
          <button
            onClick={() => setActiveTab('shadows')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'shadows'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sombra y Límites
          </button>
          <button
            onClick={() => setActiveTab('ties')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'ties'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Desempates
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Objetivo y Duraciones de Partida
                </h3>
                <p>
                  La partida se disputa a un número fijo de rondas según la duración elegida: <strong className="text-amber-400">Corta (4 rondas)</strong>, <strong className="text-amber-400">Mediana (6 rondas)</strong> o <strong className="text-amber-400">Larga (8 rondas)</strong>. 
                  El bando que gane la mayoría de puntos de ronda se declara vencedor. En caso de empate, decide la puntuación acumulada.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-emerald-400" /> Objetivo de la Ronda y Reloj de Equipo
                </h3>
                <p>
                  Obtener el mayor valor numérico total en al menos <strong className="text-emerald-400">2 de los 3 Frentes de Guerra</strong> (Izquierdo, Central y Derecho) al terminar el despliegue.
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  El tiempo de juego es un <strong className="text-slate-200">Reloj Compartido de Equipo</strong> (Rápido, Medio o Lento) que se consume durante los turnos de sus integrantes y conmuta al rival tras cada carta jugada. Si un reloj llega a 00:00 (Caída de Bandera), el rival gana de inmediato la ronda (+1 Punto) y se contabilizan los puntos en mesa.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" /> Continuidad del Mazo
                </h3>
                <p>
                  Las cartas jugadas NO se rebarajan al terminar cada ronda; van al pozo de descarte. 
                  Esto permite memorizar y contar cartas clave, figuras y palos que ya han salido.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">Valores Base de las Cartas</h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <li className="bg-slate-900 p-2 rounded border border-slate-800">Cartas 2 al 10 = Valor nominal</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">J (Jota)</strong> = 11 puntos</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">Q (Reina)</strong> = 12 puntos</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">K (Rey)</strong> = 13 puntos</li>
                  <li className="bg-slate-900 p-2 rounded border border-slate-800"><strong className="text-amber-400">A (As)</strong> = 14 puntos</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" /> Sinergia de Palo (+5 Puntos)
                </h3>
                <p className="text-xs">
                  Por cada carta adicional del mismo palo que coloques en un mismo Frente, sumas un bono de <strong className="text-indigo-400">+5 puntos</strong>.
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>Ejemplo:</em> 10♥ y K♥ en el centro: 10 + 13 = 23 base + 5 de sinergia = <strong>28 puntos</strong>. Con 3 cartas del mismo palo sumas +10 pts, etc.
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-emerald-400">
                  <Users className="w-4 h-4" /> Pareja (+10 Puntos)
                </h3>
                <p className="text-xs">
                  Dos cartas del mismo valor numérico en el mismo frente suman un bono de <strong className="text-emerald-400">+10 puntos</strong>.
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>Ejemplo:</em> 8♠ y 8♦: 8 + 8 = 16 base + 10 = <strong>26 puntos</strong>.
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-amber-400">
                  <TrendingUp className="w-4 h-4" /> Escalera Corta (+15 Puntos)
                </h3>
                <p className="text-xs">
                  Tres cartas de valores consecutivos en el mismo frente otorgan un bono de <strong className="text-amber-400">+15 puntos</strong>.
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-400">
                  <em>Ejemplo:</em> 4, 5 y 6 (o J, Q, K, o A, 2, 3): suma los valores base + <strong>15 puntos</strong>.
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-rose-400">
                  <Flame className="w-4 h-4" /> Trío (+20 Puntos)
                </h3>
                <p className="text-xs">
                  Tres cartas del mismo valor numérico en el mismo frente suman un bono de <strong className="text-rose-400">+20 puntos</strong>.
                </p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-800 text-amber-300/90 font-medium">
                  <em>Aclaración Oficial:</em> Formar un Trío anula automáticamente la bonificación de la Pareja para esas cartas (se aplican los +20 del Trío, no se acumulan +20 y +10 por las mismas cartas).
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shadows' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-2 text-purple-400">
                  <EyeOff className="w-4 h-4" /> Cartas de Sombra (Boca Abajo)
                </h3>
                <p className="text-xs">
                  En el modo 1v1 dispones de <strong className="text-purple-400">2 Marcadores de Sombra</strong> por ronda. 
                  Puedes jugar hasta 2 cartas boca abajo. Tu rival no sabrá qué carta es ni qué puntuación aporta hasta que concluya el despliegue de la ronda.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">Límite Territorial Compartido (Saturación)</h3>
                <p className="text-xs">
                  En partidas 1v1 y 2v2 se establece un <strong className="text-rose-400">máximo de 8 cartas en total por Frente</strong> sumando las cartas de ambos contrincantes.
                </p>
                <p className="text-xs mt-2 text-slate-400">
                  En cuanto un Frente alcanza 8 cartas, queda <em>saturado</em> y no se pueden jugar más tropas en él durante el resto de la ronda.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ties' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">1. Desempate en un Frente</h3>
                <p className="text-xs">
                  Si ambos jugadores igualan en puntuación exacta en un frente, lo gana quien posea la <strong className="text-amber-400">carta individual de mayor valor base</strong> en él. Si aún persiste el empate, el frente queda Nulo.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-2">2. Desempate de la Partida (Puntos Acumulados)</h3>
                <p className="text-xs">
                  Si al terminar todas las rondas hay empate a rondas ganadas (ej. 2-2 o 3-3), gana el jugador que sume la <strong className="text-emerald-400">mayor cantidad de puntos numéricos acumulados</strong> a lo largo de toda la partida.
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
            Entendido, volver al combate
          </button>
        </div>
      </div>
    </div>
  );
}
