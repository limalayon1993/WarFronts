import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  TUTORIAL_INITIAL_HANDS,
  getTutorialSteps,
} from '../constants/tutorialData';
import { getLocalizedSuits, getLocalizedFronts, calculateFrontScore, sortFrontCards } from '../constants/rules';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
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
  Clock,
} from 'lucide-react';

export function InteractiveTutorial({ onBackToMenu }) {
  const { language, isEn } = useLanguage();
  const tutorialSteps = getTutorialSteps(language);
  const localizedSuits = getLocalizedSuits(language);
  const localizedFronts = getLocalizedFronts(language);

  const [stepIndex, setStepIndex] = useState(0);
  const [fronts, setFronts] = useState({
    left: { teamA: [], teamB: [] },
    center: { teamA: [], teamB: [] },
    right: { teamA: [], teamB: [] },
  });
  const [playerHand, setPlayerHand] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [draggingCardId, setDraggingCardId] = useState(null);
  const [dragOverFrontKey, setDragOverFrontKey] = useState(null);
  const [isShadowActive, setIsShadowActive] = useState(false);
  const [shadowsLeft, setShadowsLeft] = useState(2);
  const [isMuted, setIsMuted] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  const currentStep = tutorialSteps[stepIndex] || tutorialSteps[0];
  const processedBotStepsRef = useRef(new Set());

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

  // Reproducir sonido táctico de turno cuando le toque tirar al jugador en el tutorial
  const prevStepTypeRef = useRef(null);
  useEffect(() => {
    if (currentStep.type === 'player_turn' && prevStepTypeRef.current !== 'player_turn') {
      sound.playYourTurn();
    }
    prevStepTypeRef.current = currentStep.type;
  }, [currentStep.type]);

  // Despliegue automático de la carta del bot nada más comenzar su turno para que el jugador
  // vea la carta sobre la mesa MIENTRAS lee la explicación táctica
  useEffect(() => {
    if (currentStep.type !== 'bot_turn') return;
    if (processedBotStepsRef.current.has(currentStep.stepId)) return;

    processedBotStepsRef.current.add(currentStep.stepId);

    const timer = setTimeout(() => {
      if (currentStep.stepId === 20) {
        // Conclusión del despliegue: colocar las últimas cartas de los bots en la mesa
        sound.playCard();
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
              { id: 'card-3d', suit: 'diamonds', rank: '3', base: 3, playedBy: isEn ? 'Ally A2' : 'Aliado A2', isShadow: false },
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
    }, 120);

    return () => clearTimeout(timer);
  }, [currentStep, isEn]);

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

    // Si pasamos al inicio del despliegue (tras planning y team_clock), se reparten las 5 cartas
    if (currentStep.stage === 'team_clock' || currentStep.stage === 'planning') {
      setPlayerHand([...TUTORIAL_INITIAL_HANDS.A1]);
    }

    setStepIndex(prev => prev + 1);
  }

  // Avanzar al siguiente paso tras leer la explicación de la jugada del bot
  function handleAdvanceBotTurn() {
    sound.playCard();
    setStepIndex(prev => prev + 1);
  }

  // Manejo de clic en carta de la mano del jugador
  function handleSelectPlayerCard(card) {
    if (currentStep.type !== 'player_turn') return;

    if (card.id !== currentStep.requiredCardId) {
      let cardLabel = '';
      if (currentStep.requiredCardId === 'card-kh') {
        cardLabel = isEn ? 'King of Hearts' : 'Rey de Corazones';
      } else if (currentStep.requiredCardId === 'card-10s') {
        cardLabel = isEn ? 'Ten of Spades' : 'Diez de Picas';
      } else if (currentStep.requiredCardId === 'card-8h') {
        cardLabel = isEn ? '8 of Hearts' : '8 de Corazones';
      } else if (currentStep.requiredCardId === 'card-ad') {
        cardLabel = isEn ? 'Ace of Diamonds' : 'As de Diamantes';
      } else {
        cardLabel = isEn ? '4 of Clubs' : '4 de Tréboles';
      }

      triggerWarning(
        isEn
          ? `The tutorial requires you to play the card highlighted in gold (${cardLabel}). Check the tactical panel.`
          : `El tutorial requiere que juegues la carta marcada en dorado (${cardLabel}). Consulta el panel táctico.`
      );
      return;
    }

    sound.playCard();
    setSelectedCardId(card.id);
  }

  // Manejo de despliegue en un frente (clic o arrastrar y soltar)
  function handleDeployToFront(frontKey, targetCardId = null) {
    if (currentStep.type !== 'player_turn') return;

    const cardIdToPlay = targetCardId || selectedCardId;
    if (!cardIdToPlay) {
      triggerWarning(
        isEn
          ? 'First select or drag the recommended card from your hand.'
          : 'Primero selecciona o arrastra la carta recomendada en tu mano inferior.'
      );
      return;
    }

    if (frontKey !== currentStep.requiredFrontKey) {
      const targetFront = localizedFronts.find(f => f.id === currentStep.requiredFrontKey);
      const frontName = targetFront?.name || currentStep.requiredFrontKey;
      triggerWarning(
        isEn
          ? `Guided deployment: You must place this card in the ${frontName}.`
          : `Despliegue guiado: Debes colocar esta carta en el ${frontName}.`
      );
      return;
    }

    if (currentStep.requireShadow && !isShadowActive) {
      triggerWarning(
        isEn
          ? 'Attention! This step requires activating "Shadow Mode" before deploying.'
          : '¡Atención! Este paso requiere activar el "Modo Sombra" antes de desplegar.'
      );
      return;
    }

    const cardToDeploy = playerHand.find(c => c.id === cardIdToPlay);
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
            playedBy: isEn ? 'You (A1)' : 'Tú (A1)',
          },
        ],
      },
    }));

    // Retirar carta de mano
    setPlayerHand(prev => prev.filter(c => c.id !== cardToDeploy.id));
    setSelectedCardId(null);
    setDraggingCardId(null);
    setDragOverFrontKey(null);
    setIsShadowActive(false);

    // Avanzar al siguiente paso del guion
    setStepIndex(prev => prev + 1);
  }

  // Puntuaciones actuales de los frentes (calculadas sin contar sombras hasta la resolución)
  const isResolutionPhase = currentStep.type === 'resolution' || currentStep.type === 'conclusion';
  const leftScoreA = calculateFrontScore(fronts.left.teamA, null, isResolutionPhase);
  const leftScoreB = calculateFrontScore(fronts.left.teamB, null, isResolutionPhase);
  const centerScoreA = calculateFrontScore(fronts.center.teamA, null, isResolutionPhase);
  const centerScoreB = calculateFrontScore(fronts.center.teamB, null, isResolutionPhase);
  const rightScoreA = calculateFrontScore(fronts.right.teamA, null, isResolutionPhase);
  const rightScoreB = calculateFrontScore(fronts.right.teamB, null, isResolutionPhase);

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
              title={isEn ? 'Return to Main Menu' : 'Salir al Menú Principal'}
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{isEn ? 'Main Menu' : 'Menú Principal'}</span>
            </button>

            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <Award className="w-4 h-4" />
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-100 uppercase flex items-center gap-2">
                <span>{isEn ? 'Tactical Academy' : 'Academia Táctica'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  {isEn ? 'Guided 2v2 Tutorial' : 'Tutorial Guiado 2v2'}
                </span>
              </h1>
              <div className="text-[11px] text-slate-400 font-medium">
                {isEn ? (
                  <>Step <strong className="text-amber-400">{stepIndex + 1}</strong> of {tutorialSteps.length} • 2 vs 2 Partner Format</>
                ) : (
                  <>Paso <strong className="text-amber-400">{stepIndex + 1}</strong> de {tutorialSteps.length} • Formato 2 contra 2 por Parejas</>
                )}
              </div>
            </div>
          </div>

          {/* Bonificaciones por Sinergia Oficiales */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-md">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {isEn ? 'Official Scoring & Formations' : 'Sinergias Oficiales'}
              </div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="text-indigo-300 font-mono">+5 {isEn ? 'Suit' : 'Palo'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-300 font-mono">+10 {isEn ? 'Pair' : 'Pareja'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-mono">+15 {isEn ? 'Straight' : 'Escalera'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-rose-300 font-mono">+20 {isEn ? 'Trio' : 'Trío'}</span>
              </div>
            </div>
          </div>

          {/* Reloj Dual de Equipo en la cabecera del tutorial */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition-all ${
                currentStep.type === 'player_turn' || currentStep.botTeam === 'teamA'
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/20 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
              }`}
              title={isEn ? "Your team's clock (Team A)" : 'Reloj de tu equipo (Equipo A)'}
            >
              <div className="flex flex-col text-left">
                <span className="text-[7px] uppercase font-bold tracking-wider opacity-80 leading-none">
                  {isEn ? 'Team A' : 'Equipo A'}
                </span>
                <span className="text-xs font-black leading-tight">03:20</span>
              </div>
              {(currentStep.type === 'player_turn' || currentStep.botTeam === 'teamA') && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>

            <span className="text-slate-600 text-[10px] font-bold px-0.5">VS</span>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition-all ${
                currentStep.botTeam === 'teamB'
                  ? 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-500/20 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
              }`}
              title={isEn ? "Opponent team's clock (Team B)" : 'Reloj del equipo rival (Equipo B)'}
            >
              <div className="flex flex-col text-left">
                <span className="text-[7px] uppercase font-bold tracking-wider opacity-80 leading-none">
                  {isEn ? 'Team B' : 'Equipo B'}
                </span>
                <span className="text-xs font-black leading-tight">03:20</span>
              </div>
              {currentStep.botTeam === 'teamB' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              )}
            </div>
          </div>

          {/* Estado de Equipos & Sonido & Idioma */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold">{isEn ? 'Team A (You & A2)' : 'Equipo A (Tú y A2)'}</span>
              <span className="text-slate-600">vs</span>
              <span className="text-rose-400 font-bold">{isEn ? 'Team B (B1 & B2)' : 'Equipo B (B1 y B2)'}</span>
            </div>

            <div
              className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1"
              title={isEn ? 'Your team won the initiative draw to attack first' : 'Tu equipo ganó el sorteo de iniciativa para empezar atacando'}
            >
              <span className="text-slate-400">{isEn ? 'Initiative:' : 'Iniciativa:'}</span>
              <span className="text-emerald-400 font-bold">{isEn ? 'Your Team (1st Attack)' : 'Tu Equipo (1er Ataque)'}</span>
            </div>

            <LanguageToggle compact />

            <button
              onClick={() => setIsMuted(sound.toggleMute())}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title={isMuted ? (isEn ? 'Unmute' : 'Activar sonido') : (isEn ? 'Mute' : 'Silenciar')}
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
                  {currentStep.instructor || (isEn ? 'Instructor Commander' : 'Comandante Instructor')}
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
              <span>
                {currentStep.stepId === 20
                  ? isEn
                    ? 'Proceed to Resolution'
                    : 'Proceder a la Resolución'
                  : isEn
                  ? 'Understood, Next Play'
                  : 'Entendido, Siguiente Jugada'}
              </span>
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
                <span>{isEn ? 'Why play this card and not another?' : '¿Por qué jugar esta carta y no otra?'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentStep.whyThisCard}
              </p>
            </div>

            {/* Por qué NO las otras cartas */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>{isEn ? 'Why NOT use the other cards in your hand?' : '¿Por qué NO usar las otras cartas de tu mano?'}</span>
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
                <span>{isEn ? 'Tactical Analysis: Why did it make this play?' : 'Análisis Táctico: ¿Por qué eligió esta jugada?'}</span>
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
                <span>{isEn ? "Instructor's Key Advice" : 'Consejo Clave del Instructor'}</span>
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
          {localizedFronts.map(front => {
            const teamACards = sortFrontCards(fronts[front.id].teamA, isResolutionPhase);
            const teamBCards = sortFrontCards(fronts[front.id].teamB, isResolutionPhase);
            const totalCards = teamACards.length + teamBCards.length;
            const isTarget = currentStep.type === 'player_turn' && currentStep.requiredFrontKey === front.id;
            const isLocked = currentStep.type === 'player_turn' && currentStep.requiredFrontKey !== front.id;
            const fScore = frontScores[front.id];

            return (
              <div
                key={front.id}
                onClick={() => handleDeployToFront(front.id)}
                onDragOver={(e) => {
                  if (currentStep.type === 'player_turn' && !isLocked) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverFrontKey !== front.id) setDragOverFrontKey(front.id);
                  }
                }}
                onDragEnter={(e) => {
                  if (currentStep.type === 'player_turn' && !isLocked) {
                    e.preventDefault();
                    setDragOverFrontKey(front.id);
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setDragOverFrontKey(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverFrontKey(null);
                  if (currentStep.type !== 'player_turn') return;
                  const droppedId = e.dataTransfer.getData('text/plain') || draggingCardId || selectedCardId;
                  if (droppedId) {
                    handleDeployToFront(front.id, droppedId);
                  }
                }}
                className={`
                  flex-1 flex flex-col justify-between rounded-xl p-3 sm:p-4 border transition-all duration-300 relative
                  ${
                    dragOverFrontKey === front.id
                      ? 'bg-amber-950/40 border-amber-400 shadow-2xl ring-4 ring-amber-400 scale-[1.02]'
                      : isTarget
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
                          <Zap className="w-2.5 h-2.5 fill-current" /> {isEn ? 'TARGET HERE' : 'OBJETIVO AQUÍ'}
                        </span>
                      )}
                      {isLocked && (
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> {isEn ? 'Locked' : 'Bloqueado'}
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-slate-400">{front.subtitle}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-medium text-slate-400">
                      {isEn ? 'Capacity' : 'Capacidad'}
                    </span>
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
                      {isEn ? 'Opponent Team (B)' : 'Equipo Rival (B)'}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {teamBCards.length} {isEn ? 'cards' : 'cartas'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-2 border border-slate-800/80">
                    {teamBCards.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic m-auto">
                        {isEn ? 'No enemy troops' : 'Sin tropas enemigas'}
                      </span>
                    ) : (
                      teamBCards.map((c, i) => {
                        const isJustPlayed = currentStep.type === 'bot_turn' && (
                          currentStep.card?.id === c.id ||
                          (currentStep.stepId === 20 && ['card-9s', 'card-5h'].includes(c.id))
                        );

                        return (
                          <div key={`b-${i}-${c.id}`} className="relative group">
                            {isJustPlayed && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded shadow-lg z-20 whitespace-nowrap animate-bounce flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{isEn ? 'PLAYED NOW' : 'JUGADA AHORA'}</span>
                              </div>
                            )}
                            <div className={isJustPlayed ? 'ring-2 ring-amber-400 rounded-lg scale-105 transition-all shadow-lg shadow-amber-500/20' : ''}>
                              <Card
                                card={c}
                                isShadow={c.isShadow}
                                isRevealed={isResolutionPhase}
                                isOwner={false}
                                isTeammate={false}
                                compact
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Divisor Central del Frente */}
                <div className="py-2 my-1 border-y border-slate-800/80 flex items-center justify-between bg-slate-950/60 px-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Swords className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>
                      {teamBCards.length} vs {teamACards.length} {isEn ? 'troops' : 'tropas'}
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
                      <span>{isEn ? 'Click here to deploy!' : '¡Haz clic aquí para desplegar!'}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono italic">
                      {isEn ? 'Evaluated zone' : 'Zona evaluada'}
                    </span>
                  )}
                </div>

                {/* Tropas del Equipo A (Tú y Aliado A2) */}
                <div className="my-2 min-h-[90px] flex flex-col justify-end">
                  <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 items-center min-h-[64px] bg-slate-950/40 rounded-lg p-2 border border-slate-800/80 mb-1.5">
                    {teamACards.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic m-auto">
                        {isEn ? 'Deploy your troops here' : 'Despliega tus tropas aquí'}
                      </span>
                    ) : (
                      teamACards.map((c, i) => {
                        const isJustPlayed = currentStep.type === 'bot_turn' && (
                          currentStep.card?.id === c.id ||
                          (currentStep.stepId === 20 && c.id === 'card-3d')
                        );

                        return (
                          <div key={`a-${i}-${c.id}`} className="relative group">
                            {isJustPlayed && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded shadow-lg z-20 whitespace-nowrap animate-bounce flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{isEn ? 'PLAYED NOW' : 'JUGADA AHORA'}</span>
                              </div>
                            )}
                            <div className={isJustPlayed ? 'ring-2 ring-amber-400 rounded-lg scale-105 transition-all shadow-lg shadow-amber-500/20' : ''}>
                              <Card
                                card={c}
                                isShadow={c.isShadow}
                                isRevealed={isResolutionPhase}
                                isOwner={c.isOwner}
                                isTeammate={true}
                                compact
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      {isEn ? 'Your Ally Team (A)' : 'Tu Equipo Aliado (A)'}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {teamACards.length} {isEn ? 'cards' : 'cartas'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTROLES Y MANO DEL JUGADOR */}
        <div
          className={`rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2 transition-all duration-300 ${
            currentStep.type === 'player_turn'
              ? 'glowing-green-hand bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-900 border-2 border-emerald-400'
              : 'bg-slate-900/90 border border-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-200">
                {isEn ? `Your Commander Hand (${playerHand.length} cards)` : `Tu Mano de Comandante (${playerHand.length} cartas)`}
              </span>

              {currentStep.type === 'player_turn' && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[10px] uppercase font-black px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isEn ? 'Your turn!' : '¡Te toca tirar!'}
                </span>
              )}

              {/* Botón de Modo Sombra */}
              <button
                type="button"
                disabled={shadowsLeft <= 0 || currentStep.type !== 'player_turn'}
                onClick={() => {
                  if (currentStep.requireShadow) {
                    setIsShadowActive(prev => !prev);
                  } else {
                    triggerWarning(
                      isEn
                        ? 'The instructor indicates playing this card face up. Do not activate shadow mode on this turn.'
                        : 'El instructor indica jugar esta carta de forma visible. No actives la sombra en este turno.'
                    );
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
                  {isShadowActive
                    ? isEn ? 'Shadow Mode ACTIVE' : 'Modo Sombra ACTIVO'
                    : isEn ? 'Play as Shadow' : 'Jugar como Sombra'}
                </span>
                <span className="bg-purple-950 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  {shadowsLeft} {isEn ? (shadowsLeft === 1 ? 'team shadow left' : 'team shadows left') : (shadowsLeft === 1 ? 'de equipo restante' : 'de equipo restantes')}
                </span>
              </button>
            </div>

            {/* Estado del turno guiado */}
            <div>
              {currentStep.type === 'player_turn' ? (
                <span className="text-xs text-amber-400 font-bold animate-pulse">
                  {selectedCardId
                    ? isEn
                      ? 'Card selected! Click on target front to deploy'
                      : '¡Carta seleccionada! Haz clic en el frente marcado para desplegar'
                    : isEn
                    ? 'Select the card highlighted in gold'
                    : 'Selecciona la carta recomendada en dorado'}
                </span>
              ) : currentStep.type === 'bot_turn' ? (
                <span className="text-xs text-slate-400">
                  {isEn
                    ? 'Bots\' turn: Read the tactical analysis and click "Next Play".'
                    : 'Turno de los bots: Lee la explicación táctica y pulsa "Siguiente Jugada".'}
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  {isEn ? 'Tutorial preparation phase.' : 'Fase de preparación del tutorial.'}
                </span>
              )}
            </div>
          </div>

          {/* Cartas en mano del jugador con hand-holding estricto */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap min-h-[120px] py-1">
            {playerHand.length === 0 ? (
              <span className="text-sm text-slate-500 italic">
                {currentStep.type === 'dialog'
                  ? isEn
                    ? 'You will receive your 5 standard cards when deployment begins.'
                    : 'Recibirás tus 5 cartas reglamentarias al iniciar el despliegue.'
                  : isEn
                  ? 'You have deployed all your cards this round.'
                  : 'Has desplegado todas tus cartas de la ronda.'}
              </span>
            ) : (
              playerHand.map(card => {
                const isRequired = currentStep.type === 'player_turn' && card.id === currentStep.requiredCardId;
                const isSelected = card.id === selectedCardId;

                return (
                  <div key={card.id} className="relative group">
                    {/* Insignia sobre la carta recomendada */}
                    {isRequired && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg z-20 whitespace-nowrap animate-bounce flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{isEn ? 'CHOOSE THIS' : 'ELIGE ESTA'}</span>
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
                        isPlayable={isRequired}
                        onClick={() => handleSelectPlayerCard(card)}
                        onDragStart={(e) => {
                          if (isRequired) {
                            setDraggingCardId(card.id);
                            handleSelectPlayerCard(card);
                            e.dataTransfer.setData('text/plain', card.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }
                        }}
                        onDragEnd={() => {
                          setDraggingCardId(null);
                        }}
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
      {/* MODALES DE DIÁLOGO DE PASOS INTRODUCTORIOS (0, 1, 2, team_clock) */}
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

            {/* Simulación visual del Reloj Dual de Equipo */}
            {currentStep.stage === 'team_clock' && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> {isEn ? 'Dual Team Clock (2v2 Simulation)' : 'Reloj Dual de Equipo (Simulación 2v2)'}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                    {isEn ? 'Medium Speed (3m 20s)' : 'Ritmo Medio (3m 20s)'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                  {/* Reloj Equipo A */}
                  <div className="flex-1 bg-emerald-950/80 border-2 border-emerald-400 p-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-300 block">
                      {isEn ? 'Your Team (You & A2) • ACTIVE' : 'Tu Equipo (Tú y A2) • ACTIVO'}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                      03:20
                    </span>
                    <div className="text-[9px] text-emerald-400/90 mt-0.5 animate-pulse font-medium">
                      {isEn ? 'Counts down on your turn' : 'Descuenta en tu turno'}
                    </div>
                  </div>

                  <span className="text-slate-500 font-black text-xs sm:text-sm">VS</span>

                  {/* Reloj Equipo B */}
                  <div className="flex-1 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-center opacity-70">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">
                      {isEn ? 'Opponent Team (B1 & B2) • PAUSED' : 'Equipo Rival (B1 y B2) • PAUSADO'}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-400">
                      03:20
                    </span>
                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {isEn ? 'Activates when card is placed' : 'Se activa al colocar tu carta'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <strong className="text-emerald-400 block font-bold">{isEn ? 'Fast' : 'Rápido'}</strong>
                    <span className="font-mono">1m 40s (100s)</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-amber-500/40">
                    <strong className="text-amber-400 block font-bold">{isEn ? 'Medium' : 'Medio'}</strong>
                    <span className="font-mono">3m 20s (200s)</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <strong className="text-indigo-400 block font-bold">{isEn ? 'Slow' : 'Lento'}</strong>
                    <span className="font-mono">5m 00s (300s)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onBackToMenu}
                className="text-xs font-bold text-slate-400 hover:text-white transition"
              >
                {isEn ? 'Exit to Menu' : 'Salir al Menú'}
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
                {isEn ? 'Official Resolution Phase: Round Conquered' : 'Fase Oficial de Resolución: Ronda Conquistada'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide">
                {isEn ? 'Round Victory for Allied Team (A)!' : '¡Victoria de Ronda para el Equipo Aliado (A)!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isEn ? (
                  <>Fronts Won: <strong className="text-emerald-400">2</strong> (Center and Left) vs <strong className="text-rose-400">1</strong> (Right). Official rule: Winning 2 fronts earns the Round Point!</>
                ) : (
                  <>Frentes Ganados: <strong className="text-emerald-400">2</strong> (Centro e Izquierda) vs <strong className="text-rose-400">1</strong> (Derecha). Regla oficial: ¡Al ganar 2 frentes obtenéis el Punto de Ronda!</>
                )}
              </p>
            </div>

            {/* Desglose de los 3 frentes con sombras reveladas */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. FRENTE CENTRAL */}
                <div className="p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">
                        {isEn ? 'Center Front' : 'Frente Central'}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-400">
                        {isEn ? 'Won (Team A)' : 'Ganado (Equipo A)'}
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">57</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">33</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isEn ? 'Higher total score' : 'Mayor puntuación total'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <strong className="text-emerald-400">{isEn ? 'Team A:' : 'Equipo A:'}</strong>{' '}
                        {isEn
                          ? 'K♥ (13) + Q♥ (12) + revealed shadow 8♥ (8) + 9♥ (9) + 4-Hearts Synergy (+15 pts) = '
                          : 'K♥ (13) + Q♥ (12) + 8♥ sombra revelada (8) + 9♥ (9) + Sinergia de 4 Corazones (+15 pts) = '}
                        <strong>57 pts</strong>.
                      </div>
                      <div>
                        <strong className="text-rose-400">{isEn ? 'Team B:' : 'Equipo B:'}</strong>{' '}
                        {isEn
                          ? 'Q♦ (12) + J♥ (11) + 5♥ (5) + 2-Hearts Synergy (+5 pts) = '
                          : 'Q♦ (12) + J♥ (11) + 5♥ (5) + Sinergia 2 Corazones (+5 pts) = '}
                        <strong>33 pts</strong>.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. FRENTE IZQUIERDO */}
                <div className="p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">
                        {isEn ? 'Left Front' : 'Frente Izquierdo'}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-400">
                        {isEn ? 'Won (Team A)' : 'Ganado (Equipo A)'}
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">38</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">29</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isEn ? 'Higher total score' : 'Mayor puntuación total'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <strong className="text-emerald-400">{isEn ? 'Team A:' : 'Equipo A:'}</strong>{' '}
                        {isEn
                          ? 'J♦ (11) + Your Ace A♦ (14) + 3♦ (3) + 3-Diamonds Synergy (+10 pts) = '
                          : 'J♦ (11) + Tu As A♦ (14) + 3♦ (3) + Sinergia de 3 Diamantes (+10 pts) = '}
                        <strong>38 pts</strong>.
                      </div>
                      <div>
                        <strong className="text-rose-400">{isEn ? 'Team B:' : 'Equipo B:'}</strong>{' '}
                        {isEn
                          ? '5♦ (5) + Revealed shadow 10♦ (10) + 4♦ (4) + 3-Diamonds Synergy (+10 pts) = '
                          : '5♦ (5) + Sombra 10♦ revelada (10) + 4♦ (4) + Sinergia 3 Diamantes (+10 pts) = '}
                        <strong>29 pts</strong>.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. FRENTE DERECHO */}
                <div className="p-3.5 rounded-xl border bg-rose-950/20 border-rose-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-slate-200">
                        {isEn ? 'Right Front' : 'Frente Derecho'}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase bg-rose-500/20 text-rose-400">
                        {isEn ? 'Team B' : 'Equipo B'}
                      </span>
                    </div>

                    <div className="my-3 text-center">
                      <div className="text-2xl font-black font-mono">
                        <span className="text-emerald-400">25</span>
                        <span className="text-slate-600 text-sm mx-2">vs</span>
                        <span className="text-rose-400">41</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isEn ? 'Opponent spades control' : 'Control rival por picas'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <strong className="text-emerald-400">{isEn ? 'Team A:' : 'Equipo A:'}</strong>{' '}
                        {isEn
                          ? '10♠ (10) + 6♠ (6) + 4♣ (4) + 2-Spades Synergy (+5 pts) = '
                          : '10♠ (10) + 6♠ (6) + 4♣ (4) + Sinergia de 2 Picas (+5 pts) = '}
                        <strong>25 pts</strong>.
                      </div>
                      <div>
                        <strong className="text-rose-400">{isEn ? 'Team B:' : 'Equipo B:'}</strong>{' '}
                        {isEn
                          ? 'K♠ (13) + 7♠ (7) + 2♣ (2) + 9♠ (9) + 3-Spades Synergy (+10 pts) = '
                          : 'K♠ (13) + 7♠ (7) + 2♣ (2) + 9♠ (9) + Sinergia 3 Picas (+10 pts) = '}
                        <strong>41 pts</strong>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicación de los Puntos Acumulados */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-200 block text-sm">
                    {isEn ? 'Total Round Cumulative Points:' : 'Puntos Acumulados Totales de la Ronda:'}
                  </span>
                  <span className="text-slate-400">
                    {isEn
                      ? 'Numerical scores across all fronts are summed to break overall match ties.'
                      : 'Se suman las puntuaciones numéricas de todos los frentes para resolver posibles desempates globales de partida.'}
                  </span>
                </div>
                <div className="font-mono font-bold text-base text-right shrink-0">
                  <span className="text-emerald-400">{isEn ? 'Team A: 120 pts' : 'Equipo A: 120 pts'}</span>
                  <span className="text-slate-600 mx-2">/</span>
                  <span className="text-rose-400">{isEn ? 'Team B: 103 pts' : 'Equipo B: 103 pts'}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setStepIndex(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>{isEn ? 'View Conclusions and Graduation' : 'Ver Conclusiones y Graduación'}</span>
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
              {isEn ? 'Tactical Instruction Certificate' : 'Certificado de Instrucción Táctica'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide mb-2">
              {isEn ? 'GRADUATE COMMANDER!' : '¡COMANDANTE GRADUADO!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              {isEn ? (
                <>You have completed the official <strong>WarFronts</strong> tutorial. You now master all the necessary mechanics for competitive play:</>
              ) : (
                <>Has completado el tutorial oficial de <strong>Frentes de Guerra</strong>. Conoces al detalle todas las mecánicas necesarias para disputar cualquier partida competitiva:</>
              )}
            </p>

            {/* Checklist de conceptos dominados */}
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? '2-Front Rule:' : 'Regla de los 2 Frentes:'}</strong>{' '}
                  {isEn
                    ? 'Conquering at least 2 of the 3 battlefronts secures the round.'
                    : 'Conquistar al menos 2 de los 3 frentes otorga la ronda.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Formations & Synergies:' : 'Formaciones y Sinergias:'}</strong>{' '}
                  {isEn
                    ? 'Suit (+5), Pair (+10), Short Straight (+15), and Trio (+20) deepen strategic play.'
                    : 'Palo (+5), Pareja (+10), Escalera Corta (+15) y Trío (+20) aportan máxima profundidad estratégica.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Suit Synergies in 2v2:' : 'Sinergias de Palo en 2v2:'}</strong>{' '}
                  {isEn
                    ? '+5 points for each repeated suit card deployed in a front.'
                    : '+5 puntos por cada carta repetida del mismo palo en un frente.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Shadow Marker:' : 'Marcador de Sombra:'}</strong>{' '}
                  {isEn
                    ? 'Concealed deployment from rivals (visible to your own team with a purple border), bluffing opponents and coordinating team plays.'
                    : 'Despliegue oculto para rivales (visible para tu equipo con borde morado), engañando al enemigo y coordinando jugadas aliadas.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Tactical Discard:' : 'Descarte Táctico:'}</strong>{' '}
                  {isEn
                    ? 'Placing low cards into secure or conceded sectors to boost cumulative tie-breaker points.'
                    : 'Colocar cartas bajas en frentes perdidos o ganados para sumar puntos acumulados.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{isEn ? 'Cumulative Points:' : 'Puntos Acumulados:'}</strong>{' '}
                  {isEn
                    ? 'Break overall match ties when round points are drawn.'
                    : 'Deciden el desempate global de la contienda.'}
                </span>
              </div>
            </div>

            {/* Botón de vuelta al menú */}
            <button
              onClick={onBackToMenu}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{isEn ? 'Ready for Battle! Return to Main Menu' : '¡Listo para la Batalla! Volver al Menú Principal'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
