import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  TUTORIAL_TRUMP_CARD,
  TUTORIAL_INITIAL_HANDS,
  TUTORIAL_STEPS,
} from '../constants/tutorialData';
import { SUITS, FRONTS, calculateFrontScore } from '../constants/rules';
import { Card } from './Card';
import { sound } from '../utils/audio';
import {
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Home,
  Volume2,
  VolumeX,
  Swords,
  Lock,
  Check,
  Trophy,
  Zap,
} from 'lucide-react';

export function InteractiveTutorial({ onBackToMenu }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fronts, setFronts] = useState({
    left: { teamA: [], teamB: [] },
    center: { teamA: [], teamB: [] },
    right: { teamA: [], teamB: [] },
  });
  const [playerHand, setPlayerHand] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShadowActive, setIsShadowActive] = useState(false);
  const [shadowsLeft, setShadowsLeft] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  const currentStep = TUTORIAL_STEPS[stepIndex] || TUTORIAL_STEPS[0];
  const trumpSuit = SUITS[TUTORIAL_TRUMP_CARD.suit];

  // Lanzar confeti al llegar a la graduación
  useEffect(() => {
    if (currentStep.type === 'conclusion') {
      sound.playWin();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [currentStep.type]);

  // Alerta temporal ante un clic no permitido
  function triggerWarning(msg) {
    setWarningMessage(msg);
    setTimeout(() => {
      setWarningMessage(null);
    }, 2800);
  }

  // Avanzar desde diálogos de instrucción
  function handleNextDialog() {
    sound.playCard();

    // Si pasamos del paso 2 al 3 (inicio del despliegue), se reparten las 5 cartas
    if (currentStep.stage === 'planning') {
      setPlayerHand([...TUTORIAL_INITIAL_HANDS.A1]);
    }

    setStepIndex(prev => prev + 1);
  }

  // Ejecución de jugada del bot al pulsar "Continuar"
  function handleAdvanceBotTurn() {
    if (currentStep.type !== 'bot_turn') return;

    if (currentStep.stepId === 20) {
      // Conclusión del despliegue: colocar las últimas cartas de los bots
      // B1: 9♠ en right
      // A2: 3♦ en left
      // B2: 5♥ en center
      setFronts(prev => ({
        ...prev,
        right: {
          ...prev.right,
          teamB: [
            ...prev.right.teamB,
            { id: 'card-9s', suit: 'spades', rank: '9', base: 9, playedBy: 'Rival B1', isShadow: false },
          ],
        },
        left: {
          ...prev.left,
          teamA: [
            ...prev.left.teamA,
            { id: 'card-3d', suit: 'diamonds', rank: '3', base: 3, playedBy: 'Aliado A2', isShadow: false },
          ],
        },
        center: {
          ...prev.center,
          teamB: [
            ...prev.center.teamB,
            { id: 'card-5h', suit: 'hearts', rank: '5', base: 5, playedBy: 'Rival B2', isShadow: false },
          ],
        },
      }));
      sound.playCard();
      setStepIndex(prev => prev + 1);
      return;
    }

    const { card, frontKey, asShadow, botName, botTeam } = currentStep;

    if (asShadow) {
      sound.playShadow();
    } else {
      sound.playCard();
    }

    setFronts(prev => ({
      ...prev,
      [frontKey]: {
        ...prev[frontKey],
        [botTeam]: [
          ...prev[frontKey][botTeam],
          {
            ...card,
            isShadow: asShadow,
            playedBy: botName,
            isOwner: false,
          },
        ],
      },
    }));

    setStepIndex(prev => prev + 1);
  }

  // Manejo de clic en carta de la mano del jugador
  function handleSelectPlayerCard(card) {
    if (currentStep.type !== 'player_turn') return;

    if (card.id !== currentStep.requiredCardId) {
      triggerWarning(
        `El tutorial requiere que juegues la carta marcada en dorado (${
          currentStep.requiredCardId === 'card-kh'
            ? 'Rey de Corazones'
            : currentStep.requiredCardId === 'card-10s'
            ? 'Diez de Picas'
            : currentStep.requiredCardId === 'card-8h'
            ? '8 de Corazones'
            : currentStep.requiredCardId === 'card-ad'
            ? 'As de Diamantes'
            : '4 de Tréboles'
        }). Consulta el panel táctico.`
      );
      return;
    }

    sound.playCard();
    setSelectedCardId(card.id);
  }

  // Manejo de despliegue en un frente
  function handleDeployToFront(frontKey) {
    if (currentStep.type !== 'player_turn') return;

    if (!selectedCardId) {
      triggerWarning('Primero selecciona la carta recomendada en tu mano inferior.');
      return;
    }

    if (frontKey !== currentStep.requiredFrontKey) {
      const frontName = FRONTS.find(f => f.id === currentStep.requiredFrontKey)?.name;
      triggerWarning(`Despliegue guiado: Debes colocar esta carta en el ${frontName}.`);
      return;
    }

    if (currentStep.requireShadow && !isShadowActive) {
      triggerWarning('¡Atención! Este paso requiere activar el "Modo Sombra" antes de desplegar.');
      return;
    }

    const cardToDeploy = playerHand.find(c => c.id === selectedCardId);
    if (!cardToDeploy) return;

    const useShadow = Boolean(currentStep.requireShadow && isShadowActive);

    if (useShadow) {
      sound.playShadow();
      setShadowsLeft(prev => Math.max(0, prev - 1));
    } else {
      sound.playCard();
    }

    // Actualizar frentes con la carta del jugador
    setFronts(prev => ({
      ...prev,
      [frontKey]: {
        ...prev[frontKey],
        teamA: [
          ...prev[frontKey].teamA,
          {
            ...cardToDeploy,
            isShadow: useShadow,
            isOwner: true,
            playedBy: 'Tú (A1)',
          },
        ],
      },
    }));

    // Retirar carta de mano
    setPlayerHand(prev => prev.filter(c => c.id !== cardToDeploy.id));
    setSelectedCardId(null);
    setIsShadowActive(false);

    // Avanzar al siguiente paso del guion
    setStepIndex(prev => prev + 1);
  }

  // Puntuaciones actuales de los frentes (calculadas sin contar sombras hasta la resolución)
  const isResolutionPhase = currentStep.type === 'resolution' || currentStep.type === 'conclusion';
  const leftScoreA = calculateFrontScore(fronts.left.teamA, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);
  const leftScoreB = calculateFrontScore(fronts.left.teamB, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);
  const centerScoreA = calculateFrontScore(fronts.center.teamA, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);
  const centerScoreB = calculateFrontScore(fronts.center.teamB, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);
  const rightScoreA = calculateFrontScore(fronts.right.teamA, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);
  const rightScoreB = calculateFrontScore(fronts.right.teamB, TUTORIAL_TRUMP_CARD.suit, isResolutionPhase);

  const frontScores = {
    left: { a: leftScoreA, b: leftScoreB },
    center: { a: centerScoreA, b: centerScoreB },
    right: { a: rightScoreA, b: rightScoreB },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Elementos ambientales de fondo */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* CABECERA DE LA ACADEMIA TÁCTICA */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo y Modo Tutorial */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Salir al Menú Principal"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Menú Principal</span>
            </button>

            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <Award className="w-4 h-4" />
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-100 uppercase flex items-center gap-2">
                <span>Academia Táctica</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  Tutorial Guiado 2v2
                </span>
              </h1>
              <div className="text-[11px] text-slate-400 font-medium">
                Paso <strong className="text-amber-400">{stepIndex + 1}</strong> de {TUTORIAL_STEPS.length} • Formato 2 contra 2 por Parejas
              </div>
            </div>
          </div>

          {/* Palo de Triunfo Revelado */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-xl px-3 py-1 shadow-md">
            <div className="scale-75 origin-left -mr-4">
              <Card card={TUTORIAL_TRUMP_CARD} isTrump compact />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-amber-400" /> Palo Triunfo
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {trumpSuit.name} <span className="text-amber-400 font-bold">(+2 pts)</span>
              </div>
            </div>
          </div>

          {/* Estado de Equipos & Sonido */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold">Equipo A (Tú y A2)</span>
              <span className="text-slate-600">vs</span>
              <span className="text-rose-400 font-bold">Equipo B (B1 y B2)</span>
            </div>

            <button
              onClick={() => setIsMuted(sound.toggleMute())}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* BARRA DE AVISO DE RESTRICCIÓN / ERROR DEL TUTORIAL */}
      {warningMessage && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-bounce z-50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* PANEL DEL INSTRUCTOR TÁCTICO (GUÍA PASO A PASO) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border-b border-amber-500/30 px-4 py-3 shadow-xl z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-md shadow-amber-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {currentStep.instructor || 'Comandante Instructor'}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {currentStep.title}
                </span>
              </div>

              {currentStep.actionPrompt && (
                <div className="text-sm font-black text-amber-200 mt-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{currentStep.actionPrompt}</span>
                </div>
              )}

              {currentStep.actionSummary && (
                <div className="text-sm font-black text-slate-100 mt-1">
                  {currentStep.actionSummary}
                </div>
              )}
            </div>
          </div>

          {/* Botón de continuación en turnos de bots */}
          {currentStep.type === 'bot_turn' && (
            <button
              onClick={handleAdvanceBotTurn}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>{currentStep.stepId === 20 ? 'Proceder a la Resolución' : 'Entendido, Siguiente Jugada'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Explicación pedagógica expandida: Por qué esta carta y por qué NO las otras */}
        {currentStep.type === 'player_turn' && (
          <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Por qué esta carta */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>¿Por qué jugar esta carta y no otra?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentStep.whyThisCard}
              </p>
            </div>

            {/* Por qué NO las otras cartas */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>¿Por qué NO usar las otras cartas de tu mano?</span>
              </div>
              <div className="space-y-1 text-slate-300">
                {currentStep.whyNotOthers?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <div>
                      <strong className="text-slate-200">{item.cardLabel}:</strong>{' '}
                      <span className="text-slate-400">{item.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explicación pedagógica de la jugada del BOT */}
        {currentStep.type === 'bot_turn' && (
          <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Análisis Táctico: ¿Por qué eligió esta jugada?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentStep.whyPlayed}
              </p>
              {currentStep.whyNotOthers && (
                <p className="text-slate-400 mt-1 italic">
                  {currentStep.whyNotOthers}
                </p>
              )}
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Consejo Clave del Instructor</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentStep.tacticalInsight}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ÁREA PRINCIPAL: LOS 3 FRENTES DE GUERRA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-between gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
          {FRONTS.map(front => {
            const teamACards = fronts[front.id].teamA;
            const teamBCards = fronts[front.id].teamB;
            const totalCards = teamACards.length + teamBCards.length;
            const isTarget = currentStep.type === 'player_turn' && currentStep.requiredFrontKey === front.id;
            const isLocked = currentStep.type === 'player_turn' && currentStep.requiredFrontKey !== front.id;
            const fScore = frontScores[front.id];

            return (
              <div
                key={front.id}
                onClick={() => handleDeployToFront(front.id)}
                className={`
                  flex-1 flex flex-col justify-between rounded-xl p-3 sm:p-4 border transition-all duration-300 relative
                  ${
                    isTarget
                      ? 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-500/20 ring-4 ring-amber-400/50 cursor-pointer animate-pulse'
                      : isLocked
                      ? 'bg-slate-950/70 border-slate-800 opacity-60'
                      : 'bg-slate-900/90 border-slate-700 shadow-xl'
                  }
                `}
              >
                {/* Cabecera del Frente */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
                      {front.name}
                      {isTarget && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 fill-current" /> OBJETIVO AQUÍ
                        </span>
                      )}
                      {isLocked && (
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Bloqueado
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-slate-400">{front.subtitle}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-medium text-slate-400">Capacidad</span>
                    <div className="text-xs font-bold text-slate-200">
                      <span>{totalCards}</span>
                      <span className="text-slate-500"> / 8</span>
                    </div>
                  </div>
                </div>

                {/* Tropas del Equipo B (Rivales B1 y B2) */}
                <div className="my-2 min-h-[90px] flex flex-col justify-start">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-semibold text-rose-400">
                      Equipo Rival (B)
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {teamBCards.length} cartas
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-1.5 border border-slate-800/80">
                    {teamBCards.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic m-auto">Sin tropas enemigas</span>
                    ) : (
                      teamBCards.map((c, i) => (
                        <div key={`b-${i}-${c.id}`} className="relative group">
                          <Card
                            card={c}
                            isShadow={c.isShadow}
                            isRevealed={isResolutionPhase}
                            isOwner={false}
                            isTrump={c.suit === TUTORIAL_TRUMP_CARD.suit}
                            compact
                          />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-[8px] font-bold px-1 rounded border border-rose-900/50 text-rose-400">
                              {c.playedBy}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Divisor Central del Frente */}
                <div className="py-2 my-1 border-y border-slate-800/80 flex items-center justify-between bg-slate-950/60 px-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Swords className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>
                      {teamBCards.length} vs {teamACards.length} tropas
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="font-mono text-[10px]">
                      <strong className="text-emerald-400">{fScore?.a.total || 0}</strong>
                      <span className="text-slate-500 mx-1">vs</span>
                      <strong className="text-rose-400">{fScore?.b.total || 0} pts</strong>
                    </span>
                  </div>

                  {isTarget ? (
                    <div className="text-xs font-black text-amber-400 flex items-center gap-1 animate-pulse">
                      <Zap className="w-3 h-3" />
                      <span>¡Haz clic aquí para desplegar!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono italic">
                      Zona evaluada
                    </span>
                  )}
                </div>

                {/* Tropas del Equipo A (Tú y Aliado A2) */}
                <div className="my-2 min-h-[90px] flex flex-col justify-end">
                  <div className="flex flex-wrap gap-1 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-1.5 border border-slate-800/80 mb-1.5">
                    {teamACards.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic m-auto">Despliega tus tropas aquí</span>
                    ) : (
                      teamACards.map((c, i) => (
                        <div key={`a-${i}-${c.id}`} className="relative group">
                          <Card
                            card={c}
                            isShadow={c.isShadow}
                            isRevealed={isResolutionPhase}
                            isOwner={c.isOwner}
                            isTrump={c.suit === TUTORIAL_TRUMP_CARD.suit}
                            compact
                          />
                          {c.playedBy && (
                            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-[8px] font-bold px-1 rounded border border-emerald-900/50 text-emerald-400">
                              {c.playedBy}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      Tu Equipo Aliado (A)
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {teamACards.length} cartas
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTROLES Y MANO DEL JUGADOR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-200">
                Tu Mano de Comandante ({playerHand.length} cartas)
              </span>

              {/* Botón de Modo Sombra */}
              <button
                type="button"
                disabled={shadowsLeft <= 0 || currentStep.type !== 'player_turn'}
                onClick={() => {
                  if (currentStep.requireShadow) {
                    setIsShadowActive(prev => !prev);
                  } else {
                    triggerWarning('El instructor indica jugar esta carta de forma visible. No actives la sombra en este turno.');
                  }
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  isShadowActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/30 shadow-md ring-2 ring-purple-400'
                    : currentStep.requireShadow
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500 ring-2 ring-purple-400 animate-bounce cursor-pointer'
                    : shadowsLeft > 0
                    ? 'bg-slate-800 text-purple-300 border-purple-900/50 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>
                  {isShadowActive ? 'Modo Sombra ACTIVO' : 'Jugar como Sombra'}
                </span>
                <span className="bg-purple-950 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  {shadowsLeft} restante
                </span>
              </button>
            </div>

            {/* Estado del turno guiado */}
            <div>
              {currentStep.type === 'player_turn' ? (
                <span className="text-xs text-amber-400 font-bold animate-pulse">
                  {selectedCardId
                    ? '¡Carta seleccionada! Haz clic en el frente marcado para desplegar'
                    : 'Selecciona la carta recomendada en dorado'}
                </span>
              ) : currentStep.type === 'bot_turn' ? (
                <span className="text-xs text-slate-400">
                  Turno de los bots: Lee la explicación táctica y pulsa "Siguiente Jugada".
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Fase de preparación del tutorial.
                </span>
              )}
            </div>
          </div>

          {/* Cartas en mano del jugador con hand-holding estricto */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap min-h-[120px] py-1">
            {playerHand.length === 0 ? (
              <span className="text-sm text-slate-500 italic">
                {stepIndex < 3
                  ? 'Recibirás tus 5 cartas reglamentarias al iniciar el despliegue.'
                  : 'Has desplegado todas tus cartas de la ronda.'}
              </span>
            ) : (
              playerHand.map(card => {
                const isRequired = currentStep.type === 'player_turn' && card.id === currentStep.requiredCardId;
                const isSelected = card.id === selectedCardId;
                const isTrump = card.suit === TUTORIAL_TRUMP_CARD.suit;

                return (
                  <div key={card.id} className="relative group">
                    {/* Insignia sobre la carta recomendada */}
                    {isRequired && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg z-20 whitespace-nowrap animate-bounce flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>ELIGE ESTA</span>
                      </div>
                    )}

                    <div
                      className={`transition-all duration-200 ${
                        isRequired
                          ? 'ring-4 ring-amber-400 rounded-lg scale-105 shadow-xl shadow-amber-500/20'
                          : 'opacity-40 grayscale cursor-not-allowed'
                      }`}
                    >
                      <Card
                        card={card}
                        isSelected={isSelected}
                        isTrump={isTrump}
                        isPlayable={isRequired}
                        onClick={() => handleSelectPlayerCard(card)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* MODALES DE DIÁLOGO DE PASOS INTRODUCTORIOS (0, 1, 2) */}
      {/* ===================================================================== */}
      {currentStep.type === 'dialog' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {currentStep.subtitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-wide mt-1">
                  {currentStep.title}
                </h2>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              {currentStep.content.map((paragraph, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onBackToMenu}
                className="text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Salir al Menú
              </button>

              <button
                onClick={handleNextDialog}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>{currentStep.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL DEL PASO 21: RESOLUCIÓN Y REVELACIÓN DE SOMBRAS */}
      {/* ===================================================================== */}
      {currentStep.type === 'resolution' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Cabecera de la resolución */}
            <div className="px-6 py-5 border-b border-slate-800 text-center bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                <Award className="w-4 h-4" />
                Fase Oficial de Resolución: Ronda Conquistada
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide">
                ¡Victoria de Ronda para el Equipo Aliado (A)!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Frentes Ganados: <strong className="text-emerald-400">2</strong> (Centro e Izquierda) vs <strong className="text-rose-400">1</strong> (Derecha). Regla oficial: ¡Al ganar 2 frentes obtenéis el Punto de Ronda!
              </p>
            </div>

            {/* Desglose de los 3 frentes con sombras reveladas */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. FRENTE CENTRAL */}
                <div className="p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">Frente Central</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-400">
                        Ganado (Equipo A)
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">65</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">37</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Mayor puntuación total</div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div><strong className="text-emerald-400">Equipo A:</strong> K♥ (15) + Q♥ (14) + 8♥ sombra revelada (10) + 9♥ (11) + Sinergia de 4 Corazones (+15 pts) = <strong>65 pts</strong>.</div>
                      <div><strong className="text-rose-400">Equipo B:</strong> Q♦ (12) + J♥ (13) + 5♥ (7) + Sinergia 2 Corazones (+5 pts) = <strong>37 pts</strong>.</div>
                    </div>
                  </div>
                </div>

                {/* 2. FRENTE IZQUIERDO */}
                <div className="p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">Frente Izquierdo</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-400">
                        Ganado (Equipo A)
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">38</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">29</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Mayor puntuación total</div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div><strong className="text-emerald-400">Equipo A:</strong> J♦ (11) + Tu As A♦ (14) + 3♦ (3) + Sinergia de 3 Diamantes (+10 pts) = <strong>38 pts</strong>.</div>
                      <div><strong className="text-rose-400">Equipo B:</strong> 5♦ (5) + Sombra 10♦ revelada (10) + 4♦ (4) + Sinergia 3 Diamantes (+10 pts) = <strong>29 pts</strong>.</div>
                    </div>
                  </div>
                </div>

                {/* 3. FRENTE DERECHO */}
                <div className="p-3.5 rounded-xl border bg-rose-950/20 border-rose-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">Frente Derecho</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-rose-500/20 text-rose-400">
                        Equipo B
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">25</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">41</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Control rival por picas</div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div><strong className="text-emerald-400">Equipo A:</strong> 10♠ (10) + 6♠ (6) + 4♣ (4) + Sinergia de 2 Picas (+5 pts) = <strong>25 pts</strong>.</div>
                      <div><strong className="text-rose-400">Equipo B:</strong> K♠ (13) + 7♠ (7) + 2♣ (2) + 9♠ (9) + Sinergia 3 Picas (+10 pts) = <strong>41 pts</strong>.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicación de los Puntos Acumulados */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-200 block text-sm">
                    Puntos Acumulados Totales de la Ronda:
                  </span>
                  <span className="text-slate-400">
                    Se suman las puntuaciones numéricas de todos los frentes para resolver posibles desempates globales de partida.
                  </span>
                </div>
                <div className="font-mono font-bold text-base text-right shrink-0">
                  <span className="text-emerald-400">Equipo A: 128 pts</span>
                  <span className="text-slate-600 mx-2">/</span>
                  <span className="text-rose-400">Equipo B: 107 pts</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setStepIndex(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>Ver Conclusiones y Graduación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL DEL PASO 22: GRADUACIÓN Y CONCLUSIÓN */}
      {/* ===================================================================== */}
      {currentStep.type === 'conclusion' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20 mb-4 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
              Certificado de Instrucción Táctica
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide mb-2">
              ¡COMANDANTE GRADUADO!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              Has completado el tutorial oficial de <strong>Frentes de Guerra</strong>. Conoces al detalle todas las mecánicas necesarias para disputar cualquier partida competitiva:
            </p>

            {/* Checklist de conceptos dominados */}
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Regla de los 2 Frentes:</strong> Conquistar al menos 2 de los 3 frentes otorga la ronda.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Palo de Triunfo:</strong> Otorga +2 puntos de bonificación en cada carta de ese palo.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Sinergias de Palo en 2v2:</strong> +5 puntos por cada carta repetida del mismo palo en un frente.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Marcador de Sombra:</strong> Despliegue oculto para engañar y proteger bazas clave.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Descarte Táctico:</strong> Colocar cartas bajas en frentes perdidos o ganados para sumar puntos acumulados.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Puntos Acumulados:</strong> Deciden el desempate global de la contienda.</span>
              </div>
            </div>

            {/* Botón de vuelta al menú */}
            <button
              onClick={onBackToMenu}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>¡Listo para la Batalla! Volver al Menú Principal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
