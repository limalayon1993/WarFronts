import React, { useState, useEffect, useRef } from 'react';
import {
  createDeck,
  shuffleDeck,
  FRONTS,
  GAME_MODES,
  GAME_DURATIONS,
  GAME_RHYTHMS,
  TEAM_TIMES,
  TEAM_TIME_OPTIONS,
  getTeamTimeSeconds,
  getTeamTimeConfig,
  formatClockTime,
  calculateFrontScore,
  resolveFrontWinner,
  getLocalizedFronts,
} from './constants/rules';
import { useLanguage } from './context/LanguageContext';
import { chooseBotMove } from './utils/aiBot';
import { sound } from './utils/audio';
import { mp, sanitizeGameStateForPlayer } from './utils/multiplayer';
import { Card } from './components/Card';
import { FrontZone } from './components/FrontZone';
import { ScoreBoard } from './components/ScoreBoard';
import { MainMenu } from './components/MainMenu';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { TurnStrip } from './components/TurnStrip';
import { QuickGuideModal } from './components/QuickGuideModal';
import { FullManualModal } from './components/FullManualModal';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { GameOverModal } from './components/GameOverModal';
import {
  EyeOff,
  Clock,
  Play,
  Check,
  AlertTriangle,
  Sparkles,
  Dices,
  Timer,
} from 'lucide-react';

export default function App() {
  const { language, isEn, ui } = useLanguage();
  const localizedFronts = getLocalizedFronts(language);

  // Estado de Pantalla: 'menu' | 'multiplayer_lobby' | 'game'
  const [screen, setScreen] = useState('menu');
  const [initialRoomCode, setInitialRoomCode] = useState('');

  // Modo Multijugador
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [mySlotId, setMySlotId] = useState('A1');
  const [multiplayerRoomCode, setMultiplayerRoomCode] = useState('');
  const [multiplayerSlots, setMultiplayerSlots] = useState(null);
  const [readyPlayers, setReadyPlayers] = useState([]);

  // Selección del Menú: Formato, Duración (rondas) y Tiempo de Equipo
  const [selectedMode, setSelectedMode] = useState('1v1');
  const [selectedRhythm, setSelectedRhythm] = useState(6);
  const [selectedTimeSpeed, setSelectedTimeSpeed] = useState('medio');

  // Configuración activa de la partida
  const modeConfig = GAME_MODES[selectedMode] || GAME_MODES['1v1'];
  const durationConfig = GAME_DURATIONS.find(d => d.rounds === selectedRhythm) || GAME_DURATIONS[1];
  const rhythmConfig = durationConfig;
  const timeConfig = getTeamTimeConfig(selectedMode, selectedTimeSpeed);

  // Reloj de equipo compartido (segundos restantes por ronda para cada bando)
  const defaultInitialClock = getTeamTimeSeconds(selectedMode, selectedTimeSpeed);
  const [teamAClock, setTeamAClock] = useState(defaultInitialClock);
  const [teamBClock, setTeamBClock] = useState(defaultInitialClock);

  // Estado de la partida
  const [round, setRound] = useState(1);
  const [totalMatchRounds, setTotalMatchRounds] = useState(6);
  const [teamARoundPoints, setTeamARoundPoints] = useState(0);
  const [teamBRoundPoints, setTeamBRoundPoints] = useState(0);
  const [teamACumulativePoints, setTeamACumulativePoints] = useState(0);
  const [teamBCumulativePoints, setTeamBCumulativePoints] = useState(0);

  // Mazos
  const [drawDeck, setDrawDeck] = useState([]);
  const [discardDeck, setDiscardDeck] = useState([]);

  // Jugadores y turnos
  const [players, setPlayers] = useState([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);
  const [initiativeTeam, setInitiativeTeam] = useState('teamA'); // teamA o teamB (rota por ronda)

  // Fases de ronda: 'planning' | 'deployment' | 'roundOver' | 'gameOver'
  const [phase, setPhase] = useState('planning');
  const [planningTimer, setPlanningTimer] = useState(30);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [roundOverTimer, setRoundOverTimer] = useState(60);
  const [roundOverReadyPlayers, setRoundOverReadyPlayers] = useState([]);

  // Avisos oficiales y Caída de Bandera
  const [penaltyNotice, setPenaltyNotice] = useState(null);
  const [initiativeNotice, setInitiativeNotice] = useState(null);
  const [flagFallTeam, setFlagFallTeam] = useState(null); // 'teamA' | 'teamB' | null

  function getInitiativeNoticeText(notice) {
    if (!notice) return '';
    if (typeof notice === 'string') return notice;
    const { roundNumber, initiativeTeam: iteam, is1v1: isOne, isMp: isMulti } = notice;
    const isTeamA = iteam === 'teamA';
    if (roundNumber === 1) {
      if (isMulti) return ui.game.notices.initiativeDrawMp(iteam);
      if (isOne) return isTeamA ? ui.game.notices.initiativeDraw1v1TeamA : ui.game.notices.initiativeDraw1v1TeamB;
      return isTeamA ? ui.game.notices.initiativeDrawTeamA : ui.game.notices.initiativeDrawTeamB;
    } else {
      if (isMulti) return ui.game.notices.initiativeRotMp(roundNumber, iteam);
      if (isOne) return isTeamA ? ui.game.notices.initiativeRot1v1TeamA(roundNumber) : ui.game.notices.initiativeRot1v1TeamB(roundNumber);
      return isTeamA ? ui.game.notices.initiativeRotTeamA(roundNumber) : ui.game.notices.initiativeRotTeamB(roundNumber);
    }
  }

  function getPenaltyNoticeText(penalty) {
    if (!penalty) return '';
    if (typeof penalty === 'string') return penalty;
    const { infringingTeam, is1v1: isOne } = penalty;
    if (isOne) {
      return infringingTeam === 'teamA' ? ui.game.notices.flagFall1v1TeamA : ui.game.notices.flagFall1v1TeamB;
    }
    return infringingTeam === 'teamA' ? ui.game.notices.flagFallTeamA : ui.game.notices.flagFallTeamB;
  }

  // Frentes de combate: { left: { teamA: [], teamB: [] }, ... }
  const [fronts, setFronts] = useState({
    left: { teamA: [], teamB: [] },
    center: { teamA: [], teamB: [] },
    right: { teamA: [], teamB: [] },
  });

  // Interacción del jugador humano
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [draggingCardId, setDraggingCardId] = useState(null);
  const [isShadowMode, setIsShadowMode] = useState(false);

  // Fondos de Marcadores de Sombra por Equipo (2 en 1v1 y 2v2, 3 en 3v3, 4 en 4v4)
  const [teamAShadowsLeft, setTeamAShadowsLeft] = useState(modeConfig.teamShadows || 2);
  const [teamBShadowsLeft, setTeamBShadowsLeft] = useState(modeConfig.teamShadows || 2);

  // Jugador local y perspectiva de equipo
  const localPlayer = players.find(p => p.id === mySlotId) || (!isMultiplayer ? players.find(p => p.isHuman) : null);
  const viewerTeam = localPlayer?.team || (mySlotId?.startsWith('B') ? 'teamB' : 'teamA');
  const isMyTurn = currentTurnPlayerId === mySlotId && phase === 'deployment';
  const selectedCard = localPlayer?.hand?.find(c => c.id === selectedCardId);

  // Modales y Sonido
  const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);
  const [isFullManualOpen, setIsFullManualOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Refs para listeners asíncronos de red
  const stateRef = useRef({});
  stateRef.current = {
    fronts,
    players,
    currentTurnPlayerId,
    teamAClock,
    teamBClock,
    selectedTimeSpeed,
    phase,
    round,
    totalMatchRounds,
    teamARoundPoints,
    teamBRoundPoints,
    teamACumulativePoints,
    teamBCumulativePoints,
    drawDeck,
    discardDeck,
    initiativeTeam,
    selectedMode,
    isMultiplayer,
    isHost,
    mySlotId,
    readyPlayers,
    roundOverTimer,
    roundOverReadyPlayers,
    penaltyNotice,
    flagFallTeam,
  };

  // Detectar parámetro ?room=WF-XXXX en la URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setInitialRoomCode(roomParam.toUpperCase());
        setScreen('multiplayer_lobby');
      }
    } catch (_) {}
  }, []);

  // Handlers ref para evitar closures obsoletos en listeners de red
  const handlersRef = useRef({});

  // Difundir estado a todos los clientes multijugador con sanitización estricta anti-trampas
  function broadcastStateToClients(customState = null) {
    if (!mp.isHost) return;
    const isMp = customState?.isMultiplayer ?? stateRef.current.isMultiplayer;
    if (!isMp && !mp.isHost) return;

    const base = customState || stateRef.current;
    if (!base.fronts || !base.players) return;

    const fullState = {
      fronts: base.fronts,
      players: base.players,
      currentTurnPlayerId: base.currentTurnPlayerId,
      teamAClock: base.teamAClock,
      teamBClock: base.teamBClock,
      selectedTimeSpeed: base.selectedTimeSpeed,
      phase: base.phase,
      round: base.round,
      totalMatchRounds: base.totalMatchRounds,
      trumpCard: null,
      teamARoundPoints: base.teamARoundPoints,
      teamBRoundPoints: base.teamBRoundPoints,
      teamACumulativePoints: base.teamACumulativePoints,
      teamBCumulativePoints: base.teamBCumulativePoints,
      drawDeckLength: base.drawDeck ? base.drawDeck.length : 0,
      discardDeckLength: base.discardDeck ? base.discardDeck.length : 0,
      initiativeTeam: base.initiativeTeam,
      initiativeNotice: base.initiativeNotice,
      penaltyNotice: base.penaltyNotice,
      modeId: base.selectedMode,
      roundOverReadyPlayers: base.roundOverReadyPlayers || [],
      roundOverTimer: base.roundOverTimer ?? 60,
      flagFallTeam: base.flagFallTeam ?? null,
      teamAShadowsLeft: base.teamAShadowsLeft ?? teamAShadowsLeft,
      teamBShadowsLeft: base.teamBShadowsLeft ?? teamBShadowsLeft,
    };

    mp.connections.forEach((conn, peerId) => {
      const playerSlot = base.players.find(p => p.peerId === peerId);
      const targetSlotId = playerSlot ? playerSlot.id : null;
      const sanitized = sanitizeGameStateForPlayer(fullState, targetSlotId);

      if (conn.open) {
        conn.send({
          type: 'GAME_SYNC',
          gameState: sanitized,
        });
      }
    });
  }

  // Aplicar sincronización recibida del Host (en modo Cliente)
  function applySynchronizedState(syncData) {
    if (!syncData) return;
    const prevPhase = stateRef.current.phase;
    const prevFronts = stateRef.current.fronts;

    // Detectar si alguien (bot, host u otro jugador) colocó una carta en un frente
    if (syncData.fronts && prevFronts && syncData.phase === 'deployment') {
      const prevTotal = Object.values(prevFronts).reduce(
        (acc, f) => acc + (f?.teamA?.length || 0) + (f?.teamB?.length || 0), 0
      );
      const newTotal = Object.values(syncData.fronts).reduce(
        (acc, f) => acc + (f?.teamA?.length || 0) + (f?.teamB?.length || 0), 0
      );

      if (newTotal > prevTotal) {
        let addedCard = null;
        for (const fKey of ['left', 'center', 'right']) {
          const prevA = prevFronts[fKey]?.teamA?.length || 0;
          const newA = syncData.fronts[fKey]?.teamA || [];
          if (newA.length > prevA) {
            addedCard = newA[newA.length - 1];
            break;
          }
          const prevB = prevFronts[fKey]?.teamB?.length || 0;
          const newB = syncData.fronts[fKey]?.teamB || [];
          if (newB.length > prevB) {
            addedCard = newB[newB.length - 1];
            break;
          }
        }

        // Si la carta fue colocada por otro jugador/bot, reproducir el efecto de sonido
        if (addedCard && addedCard.playedById !== stateRef.current.mySlotId) {
          if (addedCard.isShadow) {
            sound.playShadow();
          } else {
            sound.playCard();
          }
        }
      }
    }

    setFronts(syncData.fronts);
    setPlayers(syncData.players);
    setCurrentTurnPlayerId(syncData.currentTurnPlayerId);
    if (syncData.teamAClock !== undefined) setTeamAClock(syncData.teamAClock);
    if (syncData.teamBClock !== undefined) setTeamBClock(syncData.teamBClock);
    if (syncData.selectedTimeSpeed !== undefined) setSelectedTimeSpeed(syncData.selectedTimeSpeed);
    if (syncData.penaltyNotice !== undefined) setPenaltyNotice(syncData.penaltyNotice);
    setPhase(syncData.phase);
    setRound(syncData.round);
    setTotalMatchRounds(syncData.totalMatchRounds);
    setTeamARoundPoints(syncData.teamARoundPoints);
    setTeamBRoundPoints(syncData.teamBRoundPoints);
    setTeamACumulativePoints(syncData.teamACumulativePoints);
    setTeamBCumulativePoints(syncData.teamBCumulativePoints);
    setInitiativeTeam(syncData.initiativeTeam);
    if (syncData.initiativeNotice !== undefined) {
      setInitiativeNotice(syncData.initiativeNotice);
    }
    if (syncData.roundOverReadyPlayers !== undefined) {
      setRoundOverReadyPlayers(syncData.roundOverReadyPlayers);
    }
    if (syncData.roundOverTimer !== undefined) {
      setRoundOverTimer(syncData.roundOverTimer);
    }
    if (syncData.flagFallTeam !== undefined) {
      setFlagFallTeam(syncData.flagFallTeam);
    }
    if (syncData.teamAShadowsLeft !== undefined) setTeamAShadowsLeft(syncData.teamAShadowsLeft);
    if (syncData.teamBShadowsLeft !== undefined) setTeamBShadowsLeft(syncData.teamBShadowsLeft);

    if (syncData.phase === 'roundOver' && prevPhase !== 'roundOver') {
      sound.playReveal();
    }

    stateRef.current = {
      ...stateRef.current,
      fronts: syncData.fronts,
      players: syncData.players,
      currentTurnPlayerId: syncData.currentTurnPlayerId,
      teamAClock: syncData.teamAClock ?? stateRef.current.teamAClock,
      teamBClock: syncData.teamBClock ?? stateRef.current.teamBClock,
      selectedTimeSpeed: syncData.selectedTimeSpeed ?? stateRef.current.selectedTimeSpeed,
      phase: syncData.phase,
      round: syncData.round,
      totalMatchRounds: syncData.totalMatchRounds,
      teamARoundPoints: syncData.teamARoundPoints,
      teamBRoundPoints: syncData.teamBRoundPoints,
      teamACumulativePoints: syncData.teamACumulativePoints,
      teamBCumulativePoints: syncData.teamBCumulativePoints,
      initiativeTeam: syncData.initiativeTeam,
      initiativeNotice: syncData.initiativeNotice,
      roundOverReadyPlayers: syncData.roundOverReadyPlayers ?? stateRef.current.roundOverReadyPlayers ?? [],
      roundOverTimer: syncData.roundOverTimer ?? stateRef.current.roundOverTimer ?? 60,
      flagFallTeam: syncData.flagFallTeam ?? stateRef.current.flagFallTeam ?? null,
      teamAShadowsLeft: syncData.teamAShadowsLeft ?? stateRef.current.teamAShadowsLeft,
      teamBShadowsLeft: syncData.teamBShadowsLeft ?? stateRef.current.teamBShadowsLeft,
    };
  }

  // Actualizar handlersRef en cada render con las funciones más recientes
  handlersRef.current = {
    executePlayerMove,
    handleSetPlayerReady,
    handleSetRoundReady,
    applySynchronizedState,
    handleNextRound,
  };

  // Escuchar eventos de red en multijugador
  useEffect(() => {
    // Cliente recibe sincronización del Host
    const unsubSync = mp.on('gameSync', (gameState) => {
      handlersRef.current.applySynchronizedState?.(gameState);
    });

    // Cliente recibe aviso de penalización
    const unsubPenalty = mp.on('penaltyNotice', (notice) => {
      setPenaltyNotice(notice);
      sound.playTimeout();
      setTimeout(() => setPenaltyNotice(null), 4000);
    });

    // Host recibe jugada de un cliente
    const unsubPlayCard = mp.on('clientPlayCard', ({ slotId, cardId, frontKey, asShadow }) => {
      if (!mp.isHost) return;
      const curr = stateRef.current;
      if (curr.currentTurnPlayerId !== slotId || curr.phase !== 'deployment') return;

      const player = curr.players?.find(p => p.id === slotId);
      if (!player) return;

      const card = player.hand?.find(c => c.id === cardId);
      if (!card) return;

      handlersRef.current.executePlayerMove?.(slotId, card, frontKey, asShadow);
    });

    // Host recibe confirmación de preparación de un cliente (fase táctica)
    const unsubPlayerReady = mp.on('clientPlayerReady', ({ slotId, isReady }) => {
      if (!mp.isHost) return;
      handlersRef.current.handleSetPlayerReady?.(slotId, isReady);
    });

    // Cliente recibe lista actualizada de jugadores preparados (fase táctica)
    const unsubReadyUpdate = mp.on('readyUpdate', (readySlotIds) => {
      setReadyPlayers(readySlotIds || []);
    });

    // Host recibe confirmación de preparación para siguiente ronda de un cliente
    const unsubRoundReady = mp.on('clientRoundReady', ({ slotId, isReady }) => {
      if (!mp.isHost) return;
      handlersRef.current.handleSetRoundReady?.(slotId, isReady);
    });

    // Cliente recibe actualización de jugadores preparados y cronómetro en roundOver
    const unsubRoundReadyUpdate = mp.on('roundReadyUpdate', ({ readySlotIds, timer }) => {
      if (readySlotIds !== undefined) setRoundOverReadyPlayers(readySlotIds);
      if (timer !== undefined) setRoundOverTimer(timer);
    });

    return () => {
      unsubSync();
      unsubPenalty();
      unsubPlayCard();
      unsubPlayerReady();
      unsubReadyUpdate();
      unsubRoundReady();
      unsubRoundReadyUpdate();
    };
  }, []);

  // Generar lista de jugadores según el modo e iniciativa
  function createPlayerList(mode, initTeam, customSlots = null) {
    const teamShadowCount = mode.teamShadows || (mode.id === '1v1' ? 2 : mode.teamSize);

    if (customSlots && customSlots.length > 0) {
      // Usar los slots configurados en el lobby multijugador, ordenados intercalando turnos
      const teamAPlayers = customSlots.filter(s => s.team === 'teamA');
      const teamBPlayers = customSlots.filter(s => s.team === 'teamB');
      const maxLen = Math.max(teamAPlayers.length, teamBPlayers.length);
      const ordered = [];
      for (let i = 0; i < maxLen; i++) {
        if (initTeam === 'teamA') {
          if (teamAPlayers[i]) ordered.push(teamAPlayers[i]);
          if (teamBPlayers[i]) ordered.push(teamBPlayers[i]);
        } else {
          if (teamBPlayers[i]) ordered.push(teamBPlayers[i]);
          if (teamAPlayers[i]) ordered.push(teamAPlayers[i]);
        }
      }
      return ordered.map(s => ({
        id: s.slotId,
        name: s.playerName || (s.isBot ? `Bot ${s.slotId}` : (isEn ? `Player ${s.slotId}` : `Jugador ${s.slotId}`)),
        team: s.team,
        isHuman: s.isHuman,
        isBot: s.isBot,
        peerId: s.peerId,
        hand: [],
        shadowsLeft: teamShadowCount,
      }));
    }

    const list = [];
    const teamSize = mode.teamSize;

    if (initTeam === 'teamA') {
      for (let i = 1; i <= teamSize; i++) {
        list.push({
          id: `A${i}`,
          name: i === 1 ? (isEn ? 'You (A1)' : 'Tú (A1)') : (isEn ? `Ally A${i}` : `Aliado A${i}`),
          team: 'teamA',
          isHuman: i === 1,
          isBot: i !== 1,
          peerId: null,
          hand: [],
          shadowsLeft: teamShadowCount,
        });
        list.push({
          id: `B${i}`,
          name: isEn ? `Rival B${i}` : `Rival B${i}`,
          team: 'teamB',
          isHuman: false,
          isBot: true,
          peerId: null,
          hand: [],
          shadowsLeft: teamShadowCount,
        });
      }
    } else {
      for (let i = 1; i <= teamSize; i++) {
        list.push({
          id: `B${i}`,
          name: isEn ? `Rival B${i}` : `Rival B${i}`,
          team: 'teamB',
          isHuman: false,
          isBot: true,
          peerId: null,
          hand: [],
          shadowsLeft: teamShadowCount,
        });
        list.push({
          id: `A${i}`,
          name: i === 1 ? (isEn ? 'You (A1)' : 'Tú (A1)') : (isEn ? `Ally A${i}` : `Aliado A${i}`),
          team: 'teamA',
          isHuman: i === 1,
          isBot: i !== 1,
          peerId: null,
          hand: [],
          shadowsLeft: teamShadowCount,
        });
      }
    }
    return list;
  }

  // Selección aleatoria oficial para definir quién empieza atacando (Iniciativa en Ronda 1)
  function determineInitialInitiative() {
    return Math.random() < 0.5 ? 'teamA' : 'teamB';
  }

  // Fin del despliegue de la ronda
  function handleDeploymentEnd(currentFronts = null, currentPlayersList = null) {
    sound.playReveal();

    const activeFronts = currentFronts || stateRef.current.fronts || fronts;
    const activePlayersList = currentPlayersList || stateRef.current.players || players;

    let teamARoundScoreSum = 0;
    let teamBRoundScoreSum = 0;
    let teamAFrontWins = 0;
    let teamBFrontWins = 0;

    FRONTS.forEach(front => {
      const teamACards = activeFronts[front.id].teamA;
      const teamBCards = activeFronts[front.id].teamB;
      const teamAScore = calculateFrontScore(teamACards, true);
      const teamBScore = calculateFrontScore(teamBCards, true);

      teamARoundScoreSum += teamAScore.total;
      teamBRoundScoreSum += teamBScore.total;

      const resolution = resolveFrontWinner(teamACards, teamBCards, language);
      if (resolution.winner === 'teamA') teamAFrontWins++;
      if (resolution.winner === 'teamB') teamBFrontWins++;
    });

    const prevTeamACumulative = stateRef.current.teamACumulativePoints ?? teamACumulativePoints;
    const prevTeamBCumulative = stateRef.current.teamBCumulativePoints ?? teamBCumulativePoints;
    let prevTeamARoundPts = stateRef.current.teamARoundPoints ?? teamARoundPoints;
    let prevTeamBRoundPts = stateRef.current.teamBRoundPoints ?? teamBRoundPoints;

    const newTeamACumulative = prevTeamACumulative + teamARoundScoreSum;
    const newTeamBCumulative = prevTeamBCumulative + teamBRoundScoreSum;

    // Sumar puntos de ronda si gana al menos 2 frentes
    if (teamAFrontWins >= 2) {
      prevTeamARoundPts += 1;
    } else if (teamBFrontWins >= 2) {
      prevTeamBRoundPts += 1;
    }

    setTeamARoundPoints(prevTeamARoundPts);
    setTeamBRoundPoints(prevTeamBRoundPts);
    setTeamACumulativePoints(newTeamACumulative);
    setTeamBCumulativePoints(newTeamBCumulative);
    setPhase('roundOver');
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);
    setFlagFallTeam(null);

    stateRef.current = {
      ...stateRef.current,
      fronts: activeFronts,
      players: activePlayersList,
      phase: 'roundOver',
      teamARoundPoints: prevTeamARoundPts,
      teamBRoundPoints: prevTeamBRoundPts,
      teamACumulativePoints: newTeamACumulative,
      teamBCumulativePoints: newTeamBCumulative,
      roundOverTimer: 60,
      roundOverReadyPlayers: [],
      flagFallTeam: null,
    };

    const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
    const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);

    if (isMp && isHst) {
      broadcastStateToClients(stateRef.current);
    }
  }

  // Pasar al siguiente jugador con cartas en mano en orden intercalado estricto
  function advanceToNextTurn(currentPlayerId, currentPlayersList = null, currentFronts = null) {
    const activeFronts = currentFronts || stateRef.current.fronts || fronts;
    const activePlayersList = currentPlayersList || stateRef.current.players || players;
    const currentIndex = activePlayersList.findIndex(p => p.id === currentPlayerId);
    const n = activePlayersList.length;

    for (let step = 1; step <= n; step++) {
      const nextIndex = (currentIndex + step) % n;
      if (activePlayersList[nextIndex].hand.length > 0) {
        const nextPlayerId = activePlayersList[nextIndex].id;
        setCurrentTurnPlayerId(nextPlayerId);

        stateRef.current = {
          ...stateRef.current,
          fronts: activeFronts,
          players: activePlayersList,
          currentTurnPlayerId: nextPlayerId,
        };

        const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
        const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);
        if (isMp && isHst) {
          broadcastStateToClients(stateRef.current);
        }
        return;
      }
    }

    // Si nadie tiene cartas, fin del despliegue
    handleDeploymentEnd(activeFronts, activePlayersList);
  }

  // Ejecución del despliegue de una carta (humano o bot)
  function executePlayerMove(playerId, card, frontKey, asShadow) {
    const currentList = stateRef.current.players || players;
    const currentActiveFronts = stateRef.current.fronts || fronts;
    const player = currentList.find(p => p.id === playerId);
    if (!player) return;

    // Comprobar disponibilidad en el Fondo de Sombras del Equipo
    const currentTeamAShadows = stateRef.current.teamAShadowsLeft ?? teamAShadowsLeft;
    const currentTeamBShadows = stateRef.current.teamBShadowsLeft ?? teamBShadowsLeft;
    const currentTeamShadows = player.team === 'teamA' ? currentTeamAShadows : currentTeamBShadows;

    const validAsShadow = Boolean(asShadow && currentTeamShadows > 0);

    const newTeamAShadows = player.team === 'teamA'
      ? (validAsShadow ? Math.max(0, currentTeamAShadows - 1) : currentTeamAShadows)
      : currentTeamAShadows;
    const newTeamBShadows = player.team === 'teamB'
      ? (validAsShadow ? Math.max(0, currentTeamBShadows - 1) : currentTeamBShadows)
      : currentTeamBShadows;

    setTeamAShadowsLeft(newTeamAShadows);
    setTeamBShadowsLeft(newTeamBShadows);

    const deployedCard = {
      ...card,
      isShadow: validAsShadow,
      playedBy: player.name,
      playedById: player.id,
      team: player.team,
      isHuman: player.isHuman,
    };

    // Actualizar frentes
    const updatedFronts = {
      ...currentActiveFronts,
      [frontKey]: {
        ...currentActiveFronts[frontKey],
        [player.team]: [...currentActiveFronts[frontKey][player.team], deployedCard],
      },
    };
    setFronts(updatedFronts);

    // Actualizar jugador (remover carta de mano y sincronizar sombras de equipo restantes)
    const updatedPlayers = currentList.map(p => {
      const remainingTeamShadows = p.team === 'teamA' ? newTeamAShadows : newTeamBShadows;
      if (p.id === playerId) {
        return {
          ...p,
          hand: p.hand.filter(c => c.id !== card.id),
          shadowsLeft: remainingTeamShadows,
        };
      }
      return {
        ...p,
        shadowsLeft: remainingTeamShadows,
      };
    });
    setPlayers(updatedPlayers);

    stateRef.current = {
      ...stateRef.current,
      fronts: updatedFronts,
      players: updatedPlayers,
      teamAShadowsLeft: newTeamAShadows,
      teamBShadowsLeft: newTeamBShadows,
    };

    if (validAsShadow) {
      sound.playShadow();
    } else {
      sound.playCard();
    }

    if (playerId === mySlotId) {
      setSelectedCardId(null);
      setIsShadowMode(false);
    }

    // Comprobar si todos los jugadores terminaron sus cartas
    const anyCardsLeft = updatedPlayers.some(p => p.hand.length > 0);
    if (!anyCardsLeft) {
      handleDeploymentEnd(updatedFronts, updatedPlayers);
    } else {
      advanceToNextTurn(playerId, updatedPlayers, updatedFronts);
    }
  }

  // Manejo oficial de Caída de Bandera (Derrota por Tiempo al llegar a 00:00 el reloj de equipo)
  function handleFlagFallTimeout(infringingTeam) {
    if (stateRef.current.phase !== 'deployment' && phase !== 'deployment') return;

    sound.playTimeout();

    const winnerTeam = infringingTeam === 'teamA' ? 'teamB' : 'teamA';
    const activeFronts = stateRef.current.fronts || fronts;

    // 1. Conservación de Puntos Acumulados: Se voltean las cartas jugadas hasta ese instante en la mesa
    // y se suman los valores base y sinergias ya colocados por ambos bandos.
    let teamARoundScoreSum = 0;
    let teamBRoundScoreSum = 0;

    FRONTS.forEach(front => {
      const teamACards = activeFronts[front.id].teamA;
      const teamBCards = activeFronts[front.id].teamB;
      const teamAScore = calculateFrontScore(teamACards, true);
      const teamBScore = calculateFrontScore(teamBCards, true);

      teamARoundScoreSum += teamAScore.total;
      teamBRoundScoreSum += teamBScore.total;
    });

    const prevTeamACumulative = stateRef.current.teamACumulativePoints ?? teamACumulativePoints;
    const prevTeamBCumulative = stateRef.current.teamBCumulativePoints ?? teamBCumulativePoints;
    let prevTeamARoundPts = stateRef.current.teamARoundPoints ?? teamARoundPoints;
    let prevTeamBRoundPts = stateRef.current.teamBRoundPoints ?? teamBRoundPoints;

    const newTeamACumulative = prevTeamACumulative + teamARoundScoreSum;
    const newTeamBCumulative = prevTeamBCumulative + teamBRoundScoreSum;

    // 2. El equipo rival suma el +1 Punto de Ronda de forma directa
    if (winnerTeam === 'teamA') {
      prevTeamARoundPts += 1;
    } else {
      prevTeamBRoundPts += 1;
    }

    setTeamARoundPoints(prevTeamARoundPts);
    setTeamBRoundPoints(prevTeamBRoundPts);
    setTeamACumulativePoints(newTeamACumulative);
    setTeamBCumulativePoints(newTeamBCumulative);
    setPhase('roundOver');
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);
    setFlagFallTeam(infringingTeam);

    const is1v1 = (selectedMode || stateRef.current.selectedMode) === '1v1';
    const penaltyNoticeObj = { infringingTeam, is1v1 };

    setPenaltyNotice(penaltyNoticeObj);
    setTimeout(() => setPenaltyNotice(null), 6000);

    stateRef.current = {
      ...stateRef.current,
      phase: 'roundOver',
      teamARoundPoints: prevTeamARoundPts,
      teamBRoundPoints: prevTeamBRoundPts,
      teamACumulativePoints: newTeamACumulative,
      teamBCumulativePoints: newTeamBCumulative,
      roundOverTimer: 60,
      roundOverReadyPlayers: [],
      penaltyNotice: penaltyNoticeObj,
      flagFallTeam: infringingTeam,
    };

    const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
    const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);
    if (isMp && isHst) {
      mp.broadcast({
        type: 'PENALTY_NOTICE',
        notice: getPenaltyNoticeText(penaltyNoticeObj),
      });
      broadcastStateToClients(stateRef.current);
    }
  }

  // Transición a la fase de despliegue (Fase 3: Reparto y Fase 4: Despliegue)
  function beginDeploymentPhase() {
    setReadyPlayers([]);
    let pool = [...drawDeck];

    // En todos los modos (1v1 y equipos), se reparten las cartas al terminar la fase táctica (Fase 3)
    const updatedPlayers = players.map(player => ({
      ...player,
      hand: pool.splice(0, modeConfig.handSize),
    }));
    setPlayers(updatedPlayers);
    setDrawDeck(pool);

    const initialClock = getTeamTimeSeconds(modeConfig.id, selectedTimeSpeed);
    setTeamAClock(initialClock);
    setTeamBClock(initialClock);
    setPhase('deployment');

    stateRef.current = {
      ...stateRef.current,
      players: updatedPlayers,
      drawDeck: pool,
      phase: 'deployment',
      teamAClock: initialClock,
      teamBClock: initialClock,
      readyPlayers: [],
    };

    if (isMultiplayer && isHost) {
      broadcastStateToClients(stateRef.current);
    }
  }

  // Manejo de preparación (Listo / Preparado) durante la fase de táctica
  function handleSetPlayerReady(slotId, isReady) {
    if (stateRef.current.phase !== 'planning' && phase !== 'planning') return;

    setReadyPlayers(prev => {
      const next = isReady
        ? Array.from(new Set([...prev, slotId]))
        : prev.filter(id => id !== slotId);

      const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
      const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);

      // Si somos Host, difundir la lista a todos los clientes
      if (isMp && isHst) {
        mp.broadcast({
          type: 'READY_UPDATE',
          readySlotIds: next,
        });

        // Comprobar si TODOS los jugadores humanos de la partida están preparados
        // (Los bots nunca bloquean el inicio porque siempre se consideran preparados)
        const currentList = stateRef.current.players || players;
        const humanPlayers = currentList.filter(p => Boolean(p.isHuman && !p.isBot));
        const allReady = humanPlayers.length > 0 && humanPlayers.every(p => next.includes(p.id));
        if (allReady) {
          setTimeout(() => {
            beginDeploymentPhase();
          }, 250);
        }
      }

      return next;
    });
  }

  function handleClientToggleReady() {
    const isCurrentlyReady = readyPlayers.includes(mySlotId);
    const nextReady = !isCurrentlyReady;

    setReadyPlayers(prev =>
      nextReady ? Array.from(new Set([...prev, mySlotId])) : prev.filter(id => id !== mySlotId)
    );

    sound.playCard();

    mp.sendToHost({
      type: 'PLAYER_READY',
      slotId: mySlotId,
      isReady: nextReady,
    });
  }

  // Manejo de preparación para la siguiente ronda durante roundOver
  function handleSetRoundReady(slotId, isReady) {
    if (stateRef.current.phase !== 'roundOver' && phase !== 'roundOver') return;

    setRoundOverReadyPlayers(prev => {
      const next = isReady
        ? Array.from(new Set([...prev, slotId]))
        : prev.filter(id => id !== slotId);

      stateRef.current = {
        ...stateRef.current,
        roundOverReadyPlayers: next,
      };

      const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
      const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);

      if (isMp && isHst) {
        mp.broadcast({
          type: 'ROUND_READY_UPDATE',
          readySlotIds: next,
          timer: stateRef.current.roundOverTimer ?? 60,
        });

        // Comprobar si TODOS los humanos de la partida están preparados
        const currentList = stateRef.current.players || players;
        const humanPlayers = currentList.filter(p => Boolean(p.isHuman && !p.isBot));
        const allReady = humanPlayers.length > 0 && humanPlayers.every(p => next.includes(p.id));

        if (allReady) {
          setTimeout(() => {
            handleNextRound();
          }, 350);
        }
      }

      return next;
    });
  }

  function handleToggleRoundReady() {
    const isReadyNow = roundOverReadyPlayers.includes(mySlotId);
    const nextReady = !isReadyNow;

    if (isMultiplayer && !isHost) {
      // Cliente: actualiza localmente y envía al Host
      setRoundOverReadyPlayers(prev =>
        nextReady ? Array.from(new Set([...prev, mySlotId])) : prev.filter(id => id !== mySlotId)
      );
      sound.playCard();
      mp.sendToHost({
        type: 'ROUND_READY',
        slotId: mySlotId,
        isReady: nextReady,
      });
      return;
    }

    // Host o Local: ejecutar directamente
    sound.playCard();
    handleSetRoundReady(mySlotId, nextReady);
  }

  // Iniciar una ronda concreta con reseteo reglamentario de Reloj de Equipo
  function startNewRound(
    roundNumber,
    newInitiativeTeam,
    currentDrawPool,
    currentDiscardPool,
    cfg = modeConfig,
    customSlots = null,
    forceMultiplayerHost = false,
    speed = null
  ) {
    let pool = [...currentDrawPool];
    let discards = [...currentDiscardPool];

    const cardsNeeded = cfg.totalPlayers * cfg.handSize;
    if (pool.length < cardsNeeded) {
      pool = shuffleDeck([...pool, ...discards]);
      discards = [];
    }

    // 1. Jugadores (usar customSlots o los guardados en multiplayerSlots)
    const effectiveSlots = customSlots || multiplayerSlots;
    const playerList = createPlayerList(cfg, newInitiativeTeam, effectiveSlots);

    // En todos los modos (1v1 y equipos), la Fase 2 es sin cartas en mano (se reparten en Fase 3)
    playerList.forEach(player => {
      player.hand = [];
    });

    const initialFronts = {
      left: { teamA: [], teamB: [] },
      center: { teamA: [], teamB: [] },
      right: { teamA: [], teamB: [] },
    };

    const activeSpeed = speed || stateRef.current.selectedTimeSpeed || selectedTimeSpeed;
    const initialClock = getTeamTimeSeconds(cfg.id || selectedMode, activeSpeed);

    setDrawDeck(pool);
    setDiscardDeck(discards);
    setPlayers(playerList);
    setCurrentTurnPlayerId(playerList[0].id);
    setFronts(initialFronts);
    setRound(roundNumber);
    setInitiativeTeam(newInitiativeTeam);
    setSelectedCardId(null);
    setIsShadowMode(false);
    const teamShadowCount = cfg.teamShadows || (cfg.id === '1v1' ? 2 : cfg.teamSize);
    setTeamAShadowsLeft(teamShadowCount);
    setTeamBShadowsLeft(teamShadowCount);
    setPlanningTimer(30);
    setTeamAClock(initialClock);
    setTeamBClock(initialClock);
    setPhase('planning');
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);
    // Los bots siempre se inicializan como preparados automáticamente
    const initialBotReadyIds = playerList.filter(p => p.isBot || !p.isHuman).map(p => p.id);
    setReadyPlayers(initialBotReadyIds);

    // Mensaje descriptivo de quién empieza atacando (sorteo en Ronda 1, rotación en rondas posteriores)
    const isTeamA = newInitiativeTeam === 'teamA';
    const activeModeId = cfg.id || selectedMode || stateRef.current.selectedMode;
    const is1v1 = activeModeId === '1v1';
    const isMp = isMultiplayer || forceMultiplayerHost || stateRef.current.isMultiplayer;

    const noticeObj = {
      roundNumber,
      initiativeTeam: newInitiativeTeam,
      is1v1,
      isMp,
    };
    setInitiativeNotice(noticeObj);
    setFlagFallTeam(null);

    const isMultiplayerActive = isMultiplayer || forceMultiplayerHost || stateRef.current.isMultiplayer;
    const isHostActive = isHost || forceMultiplayerHost || stateRef.current.isHost;

    stateRef.current = {
      ...stateRef.current,
      round: roundNumber,
      initiativeTeam: newInitiativeTeam,
      initiativeNotice: noticeObj,
      drawDeck: pool,
      discardDeck: discards,
      players: playerList,
      currentTurnPlayerId: playerList[0].id,
      fronts: initialFronts,
      phase: 'planning',
      planningTimer: 30,
      teamAClock: initialClock,
      teamBClock: initialClock,
      selectedTimeSpeed: activeSpeed,
      readyPlayers: initialBotReadyIds,
      roundOverTimer: 60,
      roundOverReadyPlayers: [],
      flagFallTeam: null,
      teamAShadowsLeft: teamShadowCount,
      teamBShadowsLeft: teamShadowCount,
      isMultiplayer: isMultiplayerActive,
      isHost: isHostActive,
    };

    if (isMultiplayerActive && isHostActive) {
      broadcastStateToClients(stateRef.current);
    }
  }

  // Iniciar partida local vs Bots
  function handleStartGame() {
    setIsMultiplayer(false);
    setIsHost(false);
    setMySlotId('A1');
    setTeamARoundPoints(0);
    setTeamBRoundPoints(0);
    setTeamACumulativePoints(0);
    setTeamBCumulativePoints(0);
    setTotalMatchRounds(durationConfig.rounds);
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);

    const initialDeck = createDeck(modeConfig.decks);
    const initialInitiative = determineInitialInitiative();

    startNewRound(1, initialInitiative, initialDeck, [], modeConfig, null, false, selectedTimeSpeed);
    setScreen('game');
  }

  // Iniciar partida multijugador desde la sala (Host o Cliente)
  function handleStartMultiplayerMatch(lobbyData) {
    const isHostUser = Boolean(lobbyData.isHost);
    const assignedSlot = lobbyData.mySlotId || mp.myPlayerId || (isHostUser ? 'A1' : null);
    const activeSpeed = lobbyData.timeSpeed || selectedTimeSpeed;

    setIsMultiplayer(true);
    setIsHost(isHostUser);
    setMySlotId(assignedSlot);
    setMultiplayerSlots(lobbyData.slots || null);
    setSelectedMode(lobbyData.modeId);
    setSelectedRhythm(lobbyData.rhythmRounds);
    setSelectedTimeSpeed(activeSpeed);
    setMultiplayerRoomCode(mp.roomCode);
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);

    stateRef.current.isMultiplayer = true;
    stateRef.current.isHost = isHostUser;
    stateRef.current.mySlotId = assignedSlot;
    stateRef.current.selectedMode = lobbyData.modeId;
    stateRef.current.selectedTimeSpeed = activeSpeed;

    const activeConfig = GAME_MODES[lobbyData.modeId] || GAME_MODES['2v2'];
    setTotalMatchRounds(lobbyData.rhythmRounds);
    setTeamARoundPoints(0);
    setTeamBRoundPoints(0);
    setTeamACumulativePoints(0);
    setTeamBCumulativePoints(0);

    if (isHostUser) {
      const initialDeck = createDeck(activeConfig.decks);
      const initialInitiative = determineInitialInitiative();

      // Notificar a todos los clientes que la partida arranca
      mp.broadcast({
        type: 'GAME_START',
        gameData: {
          modeId: lobbyData.modeId,
          rhythmRounds: lobbyData.rhythmRounds,
          timeSpeed: activeSpeed,
          slots: lobbyData.slots,
          isHost: false,
        },
      });

      startNewRound(1, initialInitiative, initialDeck, [], activeConfig, lobbyData.slots, true, activeSpeed);
    }

    setScreen('game');
  }

  // Siguiente ronda
  function handleNextRound() {
    // Si ya no estamos en roundOver (por ejemplo, ya se avanzó por timeout u otro evento), evitar duplicación
    if (stateRef.current.phase !== 'roundOver' && phase !== 'roundOver') return;

    const currentRound = stateRef.current.round ?? round;
    const totalRounds = stateRef.current.totalMatchRounds ?? totalMatchRounds;
    const isMp = Boolean(stateRef.current.isMultiplayer || isMultiplayer || mp.isHost);
    const isHst = Boolean(stateRef.current.isHost || isHost || mp.isHost);

    if (currentRound >= totalRounds) {
      setPhase('gameOver');
      stateRef.current = {
        ...stateRef.current,
        phase: 'gameOver',
      };
      if (isMp && isHst) {
        broadcastStateToClients(stateRef.current);
      }
      return;
    }

    const currentFronts = stateRef.current.fronts || fronts;
    const currentDiscardDeck = stateRef.current.discardDeck || discardDeck;
    const currentDrawDeck = stateRef.current.drawDeck || drawDeck;
    const currentInitiative = stateRef.current.initiativeTeam || initiativeTeam;

    const cardsToDiscard = [
      ...currentFronts.left.teamA,
      ...currentFronts.left.teamB,
      ...currentFronts.center.teamA,
      ...currentFronts.center.teamB,
      ...currentFronts.right.teamA,
      ...currentFronts.right.teamB,
    ].filter(Boolean);

    const newDiscardDeck = [...currentDiscardDeck, ...cardsToDiscard];
    const nextInitiativeTeam = currentInitiative === 'teamA' ? 'teamB' : 'teamA';

    setRoundOverReadyPlayers([]);
    setRoundOverTimer(60);

    startNewRound(
      currentRound + 1,
      nextInitiativeTeam,
      currentDrawDeck,
      newDiscardDeck,
      modeConfig,
      multiplayerSlots,
      false,
      stateRef.current.selectedTimeSpeed || selectedTimeSpeed
    );
  }

  // Disputar Prórroga oficial de 2 rondas por empate exacto en acumulados (Capítulo 7)
  function handlePlayOvertime() {
    setTotalMatchRounds(prev => prev + 2);
    setPhase('roundOver');
    stateRef.current = {
      ...stateRef.current,
      totalMatchRounds: (stateRef.current.totalMatchRounds || totalMatchRounds) + 2,
      phase: 'roundOver',
    };
    handleNextRound();
  }

  // Reiniciar partida
  function handleRestartGame() {
    setTeamARoundPoints(0);
    setTeamBRoundPoints(0);
    setTeamACumulativePoints(0);
    setTeamBCumulativePoints(0);
    setTotalMatchRounds(durationConfig.rounds);

    const newDeck = createDeck(modeConfig.decks);
    const initialInitiative = determineInitialInitiative();

    startNewRound(1, initialInitiative, newDeck, [], modeConfig, null, false, selectedTimeSpeed);
  }

  // Despliegue del jugador humano al hacer clic o soltar una carta en un frente
  function handleDeployPlayerCard(frontKey, targetCardId = null) {
    if (phase !== 'deployment') return;

    // Comprobar si es el turno del jugador local
    if (currentTurnPlayerId !== mySlotId) return;
    const cardIdToPlay = targetCardId || selectedCardId;
    if (!cardIdToPlay) return;

    const me = players.find(p => p.id === mySlotId);
    if (!me) return;

    const card = me.hand.find(c => c.id === cardIdToPlay);
    if (!card) return;

    const totalInFront = fronts[frontKey].teamA.length + fronts[frontKey].teamB.length;
    if (totalInFront >= modeConfig.maxFrontCards) return;

    const myTeamShadows = me.team === 'teamA'
      ? (stateRef.current.teamAShadowsLeft ?? teamAShadowsLeft)
      : (stateRef.current.teamBShadowsLeft ?? teamBShadowsLeft);
    const useShadow = isShadowMode && myTeamShadows > 0;

    if (isMultiplayer && !isHost) {
      if (useShadow) {
        sound.playShadow();
      } else {
        sound.playCard();
      }
      // Cliente: enviar acción al Host
      mp.sendToHost({
        type: 'PLAY_CARD',
        slotId: mySlotId,
        cardId: card.id,
        frontKey,
        asShadow: useShadow,
      });
      setSelectedCardId(null);
      setDraggingCardId(null);
      setIsShadowMode(false);
      return;
    }

    // Host o Local: ejecutar directamente
    executePlayerMove(mySlotId, card, frontKey, useShadow);
    setSelectedCardId(null);
    setDraggingCardId(null);
  }

  // Volver al Menú Principal
  function handleBackToMenu() {
    if (isMultiplayer) {
      mp.cleanup();
      setIsMultiplayer(false);
      setIsHost(false);
    }
    setScreen('menu');
  }

  // Temporizador de fase de planificación (30 segundos oficiales)
  useEffect(() => {
    if (screen !== 'game' || phase !== 'planning') return;

    if (planningTimer <= 0) {
      if (!isMultiplayer || isHost) {
        beginDeploymentPhase();
      }
      return;
    }

    const timer = setInterval(() => {
      setPlanningTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, phase, planningTimer, isMultiplayer, isHost]);

  // Temporizador oficial del Reloj Compartido de Equipo durante el despliegue
  useEffect(() => {
    if (screen !== 'game' || phase !== 'deployment') return;

    // Cliente en multijugador: decrementa visualmente el reloj del equipo del jugador activo para máxima fluidez
    if (isMultiplayer && !isHost) {
      const timer = setInterval(() => {
        const currList = stateRef.current.players || players;
        const active = currList.find(p => p.id === currentTurnPlayerId);
        const activeTeam = active?.team || 'teamA';
        if (activeTeam === 'teamA') {
          setTeamAClock(prev => Math.max(0, prev - 1));
        } else {
          setTeamBClock(prev => Math.max(0, prev - 1));
        }
      }, 1000);
      return () => clearInterval(timer);
    }

    // Host o Local: control oficial y sanción por Caída de Bandera a 00:00
    const timer = setInterval(() => {
      const curr = stateRef.current;
      if (curr.phase !== 'deployment') return;

      const currList = curr.players || players;
      const active = currList.find(p => p.id === curr.currentTurnPlayerId);
      const activeTeam = active?.team || 'teamA';

      if (activeTeam === 'teamA') {
        setTeamAClock(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFlagFallTimeout('teamA');
            return 0;
          }
          const next = prev - 1;
          stateRef.current.teamAClock = next;
          return next;
        });
      } else {
        setTeamBClock(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFlagFallTimeout('teamB');
            return 0;
          }
          const next = prev - 1;
          stateRef.current.teamBClock = next;
          return next;
        });
      }

      if (isMultiplayer && isHost) {
        broadcastStateToClients(stateRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, phase, currentTurnPlayerId, isMultiplayer, isHost, players]);

  // Alerta sonora para cuando al equipo del jugador humano le queden 10 segundos o menos en el reloj
  const lastBeepSecondRef = useRef(null);
  useEffect(() => {
    if (screen !== 'game' || phase !== 'deployment') {
      lastBeepSecondRef.current = null;
      return;
    }

    const activePlayer = players.find(p => p.id === currentTurnPlayerId);
    const isMyTeamTurn = activePlayer?.team === viewerTeam;

    // Solo emitir la alerta si es el turno de un miembro de nuestro equipo (consume nuestro reloj)
    if (!isMyTeamTurn) {
      lastBeepSecondRef.current = null;
      return;
    }

    const teamRemainingClock = viewerTeam === 'teamA' ? teamAClock : teamBClock;
    if (teamRemainingClock <= 10 && teamRemainingClock > 0) {
      if (lastBeepSecondRef.current !== teamRemainingClock) {
        lastBeepSecondRef.current = teamRemainingClock;
        sound.playWarningCountdown(teamRemainingClock);
      }
    } else {
      lastBeepSecondRef.current = null;
    }
  }, [teamAClock, teamBClock, currentTurnPlayerId, viewerTeam, phase, screen, players]);

  // Sonido de aviso cuando te toca tirar
  const prevTurnPlayerRef = useRef(null);
  const prevPhaseRef = useRef(null);
  useEffect(() => {
    if (screen !== 'game') {
      prevTurnPlayerRef.current = currentTurnPlayerId;
      prevPhaseRef.current = phase;
      return;
    }

    const isMyTurnNow = currentTurnPlayerId === mySlotId && phase === 'deployment';
    const wasMyTurnBefore = prevTurnPlayerRef.current === mySlotId && prevPhaseRef.current === 'deployment';

    if (isMyTurnNow && !wasMyTurnBefore) {
      sound.playYourTurn();
    }

    prevTurnPlayerRef.current = currentTurnPlayerId;
    prevPhaseRef.current = phase;
  }, [currentTurnPlayerId, mySlotId, phase, screen]);

  // Turno de Bots (Solo corre en Local o en el Host multijugador para puestos con Bot)
  useEffect(() => {
    if (screen !== 'game' || phase !== 'deployment') return;
    if (isMultiplayer && !isHost) return; // Clientes no calculan IA

    const currentList = stateRef.current.players || players;
    const activePlayer = currentList.find(p => p.id === currentTurnPlayerId);
    if (!activePlayer) return;

    if (activePlayer.isBot && activePlayer.hand.length > 0) {
      setIsBotThinking(true);

      // Tiempo fijo de 3 segundos solicitado por el usuario para una partida legible y no vertiginosa
      const botDelay = 3000;

      const delay = setTimeout(() => {
        const freshList = stateRef.current.players || players;
        const freshFronts = stateRef.current.fronts || fronts;
        const freshBot = freshList.find(p => p.id === activePlayer.id) || activePlayer;
        const botTeamShadows = freshBot.team === 'teamA'
          ? (stateRef.current.teamAShadowsLeft ?? teamAShadowsLeft)
          : (stateRef.current.teamBShadowsLeft ?? teamBShadowsLeft);

        const move = chooseBotMove({
          botHand: freshBot.hand,
          botTeam: freshBot.team,
          botPlayerId: freshBot.id,
          allPlayers: freshList,
          fronts: freshFronts,
          botShadowsLeft: botTeamShadows,
          maxFrontCards: modeConfig.maxFrontCards,
        });

        if (move) {
          executePlayerMove(activePlayer.id, move.card, move.frontKey, move.asShadow);
        } else {
          advanceToNextTurn(activePlayer.id);
        }
        setIsBotThinking(false);
      }, botDelay);

      return () => {
        clearTimeout(delay);
        setIsBotThinking(false);
      };
    } else {
      setIsBotThinking(false);
    }
  }, [screen, phase, currentTurnPlayerId, isMultiplayer, isHost, selectedTimeSpeed]);

  // Temporizador oficial de resumen de ronda (60 segundos con avance automático)
  useEffect(() => {
    if (screen !== 'game' || phase !== 'roundOver') return;

    // En multijugador los clientes decrementan visualmente para mantener fluidez
    if (isMultiplayer && !isHost) {
      const visualTimer = setInterval(() => {
        setRoundOverTimer(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(visualTimer);
    }

    // Host o Local: controla el tiempo oficial y fuerza el avance al expirar
    const timer = setInterval(() => {
      setRoundOverTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlersRef.current.handleNextRound?.();
          return 0;
        }
        const next = prev - 1;
        stateRef.current = {
          ...stateRef.current,
          roundOverTimer: next,
        };

        // Si es Host en multijugador, sincronizar periódicamente con los clientes
        if (isMultiplayer && isHost && (next % 5 === 0 || next <= 10)) {
          mp.broadcast({
            type: 'ROUND_READY_UPDATE',
            readySlotIds: stateRef.current.roundOverReadyPlayers || [],
            timer: next,
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, phase, isMultiplayer, isHost]);

  // PANTALLA 1: MENÚ PRINCIPAL
  if (screen === 'menu') {
    return (
      <>
        <MainMenu
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedRhythm={selectedRhythm}
          setSelectedRhythm={setSelectedRhythm}
          selectedTimeSpeed={selectedTimeSpeed}
          setSelectedTimeSpeed={setSelectedTimeSpeed}
          onStartGame={handleStartGame}
          onOpenMultiplayer={() => setScreen('multiplayer_lobby')}
          onOpenTutorial={() => setScreen('tutorial')}
          onOpenQuickGuide={() => setIsQuickGuideOpen(true)}
          onOpenFullManual={() => setIsFullManualOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(sound.toggleMute())}
        />
        <QuickGuideModal isOpen={isQuickGuideOpen} onClose={() => setIsQuickGuideOpen(false)} />
        <FullManualModal isOpen={isFullManualOpen} onClose={() => setIsFullManualOpen(false)} />
      </>
    );
  }

  // PANTALLA: TUTORIAL INTERACTIVO 2v2 GUIADO
  if (screen === 'tutorial') {
    return (
      <InteractiveTutorial
        onBackToMenu={() => setScreen('menu')}
      />
    );
  }

  // PANTALLA 2: LOBBY DE SALA MULTIJUGADOR
  if (screen === 'multiplayer_lobby') {
    return (
      <>
        <MultiplayerLobby
          initialRoomCode={initialRoomCode}
          onStartMultiplayerGame={handleStartMultiplayerMatch}
          onBackToMenu={handleBackToMenu}
        />
        <QuickGuideModal isOpen={isQuickGuideOpen} onClose={() => setIsQuickGuideOpen(false)} />
        <FullManualModal isOpen={isFullManualOpen} onClose={() => setIsFullManualOpen(false)} />
      </>
    );
  }

  // PANTALLA 3: PANTALLA DE JUEGO (BATALLA DE SALÓN)
  return (
    <div className="min-h-screen bg-[#07090e] text-[#e6e9ee] flex flex-col font-sans select-none">
      {/* Barra Superior / Marcador */}
      <ScoreBoard
        round={round}
        totalRounds={totalMatchRounds}
        teamARoundPoints={teamARoundPoints}
        teamBRoundPoints={teamBRoundPoints}
        teamACumulativePoints={teamACumulativePoints}
        teamBCumulativePoints={teamBCumulativePoints}
        initiativeTeam={initiativeTeam}
        drawDeckCount={drawDeck.length}
        discardDeckCount={discardDeck.length}
        modeConfig={modeConfig}
        durationConfig={durationConfig}
        rhythmConfig={rhythmConfig}
        timeConfig={timeConfig}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(sound.toggleMute())}
        onOpenQuickGuide={() => setIsQuickGuideOpen(true)}
        onOpenFullManual={() => setIsFullManualOpen(true)}
        onRestartGame={handleRestartGame}
        onBackToMenu={handleBackToMenu}
        isMultiplayer={isMultiplayer}
        roomCode={multiplayerRoomCode || mp.roomCode}
        mySlotId={mySlotId}
      />

      {/* Tira Secuencial de Turnos para 1v1, 2v2, 3v3 y 4v4 con Reloj Oficial de Equipo */}
      {phase === 'deployment' && (
        <TurnStrip
          players={players}
          currentTurnPlayerId={currentTurnPlayerId}
          isBotThinking={isBotThinking}
          teamAClock={teamAClock}
          teamBClock={teamBClock}
          teamAShadowsLeft={teamAShadowsLeft}
          teamBShadowsLeft={teamBShadowsLeft}
          modeId={selectedMode}
        />
      )}

      {/* Aviso de Sorteo / Iniciativa (Quién empieza atacando) */}
      {initiativeNotice && (
        <div className="casino-panel border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs font-serif flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Dices className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-100">{getInitiativeNoticeText(initiativeNotice)}</span>
          </div>
          <button
            onClick={() => setInitiativeNotice(null)}
            className="text-[10px] uppercase font-serif font-bold text-amber-300 hover:text-white px-3 py-1 rounded-lg bg-black/60 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer"
          >
            {ui.common?.ok || (isEn ? 'Understood' : 'Entendido')}
          </button>
        </div>
      )}

      {/* Aviso de Penalización por Tiempo */}
      {penaltyNotice && (
        <div className="bg-[#260a12]/95 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs font-serif flex items-center gap-2 shadow-xl animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{getPenaltyNoticeText(penaltyNotice)}</span>
        </div>
      )}

      {/* Alerta de Fase de Planificación / Táctica */}
      {phase === 'planning' && (
        <div className="bg-gradient-to-r from-[#1a140b] via-[#261d0f] to-[#1a140b] border-b border-amber-500/30 text-amber-100 px-4 py-2.5 shadow-xl flex items-center justify-between text-xs sm:text-sm font-serif font-bold">
          <div className="flex items-center gap-2 max-w-2xl">
            <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-spin" />
            <span>
              {selectedMode === '1v1' ? ui.game.planning.banner1v1 : ui.game.planning.bannerTeam}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono bg-black/60 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-300 font-black flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{planningTimer}s</span>
            </span>

            {!isMultiplayer ? (
              <button
                type="button"
                onClick={beginDeploymentPhase}
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 px-4 py-1.5 rounded-xl text-xs font-serif font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{selectedMode === '1v1' ? ui.game.planning.startDuelBtn : ui.game.planning.startNowBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (isHost) {
                    handleSetPlayerReady(mySlotId, !readyPlayers.includes(mySlotId));
                  } else {
                    handleClientToggleReady();
                  }
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-serif font-black uppercase tracking-wider flex items-center gap-1.5 shadow transition cursor-pointer ${
                  readyPlayers.includes(mySlotId)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-900/40'
                    : 'bg-black/80 hover:bg-black text-amber-300 border border-amber-500/40 hover:border-amber-400'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${readyPlayers.includes(mySlotId) ? 'stroke-[3]' : ''}`} />
                <span>
                  {readyPlayers.includes(mySlotId) ? ui.game.planning.readyBtn : ui.game.planning.preparingBtn} (
                  {readyPlayers.filter(id => {
                    const p = players.find(player => player.id === id);
                    return p && p.isHuman && !p.isBot;
                  }).length}/{players.filter(p => Boolean(p.isHuman && !p.isBot)).length})
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ZONA DE JUEGO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-between gap-3">
        {/* LOS 3 FRENTES DE GUERRA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
          {localizedFronts.map(front => (
            <FrontZone
              key={front.id}
              frontKey={front.id}
              frontInfo={front}
              teamACards={fronts[front.id].teamA}
              teamBCards={fronts[front.id].teamB}
              isRoundOver={phase === 'roundOver'}
              selectedCard={selectedCard}
              draggingCard={localPlayer?.hand?.find(c => c.id === draggingCardId) || null}
              isPlayerTurn={isMyTurn}
              maxFrontCards={modeConfig.maxFrontCards}
              modeId={selectedMode}
              viewerPlayerId={mySlotId}
              viewerTeam={viewerTeam}
              onDeploy={handleDeployPlayerCard}
            />
          ))}
        </div>

        {/* CONTROLES Y MANO DEL JUGADOR LOCAL */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-col gap-2.5 transition-all duration-300 ${
            isMyTurn
              ? 'glowing-green-hand casino-panel'
              : 'casino-panel-subtle'
          }`}
        >
          {/* Barra superior de la mano */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-black tracking-wider uppercase text-slate-200">
                {ui.game.hand.yourHandTitle(localPlayer?.name || (isEn ? 'Commander' : 'Comandante'), localPlayer?.hand?.length || 0)}
              </span>

              {isMyTurn && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-serif font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {ui.game.hand.yourTurnBadge}
                </span>
              )}

              {/* Botón de Modo Sombra */}
              {(() => {
                const currentMyTeamShadows = (localPlayer?.team === 'teamA' ? teamAShadowsLeft : teamBShadowsLeft) ?? 0;
                return (
                  <button
                    type="button"
                    disabled={!localPlayer || currentMyTeamShadows <= 0 || !isMyTurn}
                    onClick={() => setIsShadowMode(prev => !prev)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border font-serif font-bold tracking-wider uppercase flex items-center gap-1.5 transition cursor-pointer ${
                      isShadowMode
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-950 text-purple-200 border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                        : currentMyTeamShadows > 0
                        ? 'bg-[#141220] text-purple-300 border-purple-800/80 hover:bg-[#1d1a30]'
                        : 'bg-black/40 text-stone-600 border-stone-800 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isShadowMode ? ui.game.hand.shadowActiveBtn : ui.game.hand.playShadowBtn}
                    </span>
                    <span className="bg-purple-950/90 text-purple-300 border border-purple-800/60 px-1.5 py-0.2 rounded text-[10px] font-mono">
                      {ui.game.hand.teamShadowsRemaining
                        ? ui.game.hand.teamShadowsRemaining(currentMyTeamShadows, selectedMode === '1v1')
                        : ui.game.hand.shadowsRemaining(currentMyTeamShadows)}
                    </span>
                  </button>
                );
              })()}
            </div>

            {/* Aviso de turno del jugador con contador de tiempo */}
            <div>
              {isMyTurn ? (
                <span className="text-xs font-serif text-amber-300 font-bold tracking-wide animate-pulse">
                  {selectedCardId
                    ? ui.game.hand.actionInstructionDrag(formatClockTime(viewerTeam === 'teamA' ? teamAClock : teamBClock))
                    : ui.game.hand.actionInstructionPick(formatClockTime(viewerTeam === 'teamA' ? teamAClock : teamBClock))}
                </span>
              ) : phase === 'planning' ? (
                <span className="text-xs font-serif text-amber-300/80 tracking-wide">
                  {selectedMode === '1v1' ? ui.game.hand.planningInstruction1v1 : ui.game.hand.planningInstructionTeam}
                </span>
              ) : (
                <span className="text-xs font-serif text-slate-400 tracking-wide">
                  {ui.game.hand.waitingForTurn(players.find(p => p.id === currentTurnPlayerId)?.name || (isEn ? 'another player' : 'otro jugador'))}
                </span>
              )}
            </div>
          </div>

          {/* Cartas en mano del jugador local */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap min-h-[110px] sm:min-h-[140px] py-1">
            {!localPlayer || !localPlayer.hand || localPlayer.hand.length === 0 ? (
              <span className="text-sm font-serif text-slate-500 italic">
                {phase === 'planning'
                  ? ui.game.hand.emptyHandPlanning(modeConfig.handSize)
                  : ui.game.hand.emptyHandPlayed}
              </span>
            ) : (
              localPlayer.hand.map(card => {
                const isSelected = card.id === selectedCardId;
                return (
                  <div key={card.id} className="relative group">
                    <Card
                      card={card}
                      isSelected={isSelected}
                      isPlayable={isMyTurn}
                      onClick={() => {
                        if (isMyTurn) {
                          setSelectedCardId(prev => (prev === card.id ? null : card.id));
                        }
                      }}
                      onDragStart={(e) => {
                        if (isMyTurn) {
                          setDraggingCardId(card.id);
                          setSelectedCardId(card.id);
                          e.dataTransfer.setData('text/plain', card.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }
                      }}
                      onDragEnd={() => {
                        setDraggingCardId(null);
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* MODAL DE RESUMEN DE RONDA */}
      <RoundSummaryModal
        isOpen={phase === 'roundOver'}
        round={round}
        totalRounds={totalMatchRounds}
        fronts={fronts}
        modeId={selectedMode}
        onNextRound={handleNextRound}
        isMultiplayer={isMultiplayer}
        readyPlayers={roundOverReadyPlayers}
        mySlotId={mySlotId}
        players={players}
        countdown={roundOverTimer}
        onToggleReady={handleToggleRoundReady}
        flagFallTeam={flagFallTeam}
      />

      {/* MODAL DE FIN DE PARTIDA CON PRÓRROGA REGLAMENTARIA */}
      <GameOverModal
        isOpen={phase === 'gameOver'}
        teamARoundPoints={teamARoundPoints}
        teamBRoundPoints={teamBRoundPoints}
        teamACumulativePoints={teamACumulativePoints}
        teamBCumulativePoints={teamBCumulativePoints}
        modeId={selectedMode}
        onRestart={handleRestartGame}
        onBackToMenu={handleBackToMenu}
        onPlayOvertime={handlePlayOvertime}
      />

      {/* MODALES DE GUÍA RÁPIDA Y MANUAL COMPLETO */}
      <QuickGuideModal isOpen={isQuickGuideOpen} onClose={() => setIsQuickGuideOpen(false)} />
      <FullManualModal isOpen={isFullManualOpen} onClose={() => setIsFullManualOpen(false)} />
    </div>
  );
}
