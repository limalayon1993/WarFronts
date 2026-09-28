import React, { useState, useEffect, useRef } from 'react';
import {
  createDeck,
  shuffleDeck,
  FRONTS,
  GAME_MODES,
  GAME_RHYTHMS,
  calculateFrontScore,
  resolveFrontWinner,
} from './constants/rules';
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
} from 'lucide-react';

export default function App() {
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

  // Selección del Menú
  const [selectedMode, setSelectedMode] = useState('1v1');
  const [selectedRhythm, setSelectedRhythm] = useState(6);

  // Configuración activa de la partida
  const modeConfig = GAME_MODES[selectedMode] || GAME_MODES['1v1'];
  const rhythmConfig = GAME_RHYTHMS.find(r => r.rounds === selectedRhythm) || GAME_RHYTHMS[1];

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
  const [trumpCard, setTrumpCard] = useState(null);

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

  // Reloj oficial de turno (15s por turno con penalización de descarte)
  const [turnTimer, setTurnTimer] = useState(15);
  const [penaltyNotice, setPenaltyNotice] = useState(null);
  const [initiativeNotice, setInitiativeNotice] = useState(null);

  // Frentes de combate: { left: { teamA: [], teamB: [] }, ... }
  const [fronts, setFronts] = useState({
    left: { teamA: [], teamB: [] },
    center: { teamA: [], teamB: [] },
    right: { teamA: [], teamB: [] },
  });

  // Interacción del jugador humano
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShadowMode, setIsShadowMode] = useState(false);

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
    turnTimer,
    phase,
    round,
    totalMatchRounds,
    trumpCard,
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
      turnTimer: base.turnTimer,
      phase: base.phase,
      round: base.round,
      totalMatchRounds: base.totalMatchRounds,
      trumpCard: base.trumpCard,
      teamARoundPoints: base.teamARoundPoints,
      teamBRoundPoints: base.teamBRoundPoints,
      teamACumulativePoints: base.teamACumulativePoints,
      teamBCumulativePoints: base.teamBCumulativePoints,
      drawDeckLength: base.drawDeck ? base.drawDeck.length : 0,
      discardDeckLength: base.discardDeck ? base.discardDeck.length : 0,
      initiativeTeam: base.initiativeTeam,
      initiativeNotice: base.initiativeNotice,
      modeId: base.selectedMode,
      roundOverReadyPlayers: base.roundOverReadyPlayers || [],
      roundOverTimer: base.roundOverTimer ?? 60,
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

    setFronts(syncData.fronts);
    setPlayers(syncData.players);
    setCurrentTurnPlayerId(syncData.currentTurnPlayerId);
    setTurnTimer(syncData.turnTimer);
    setPhase(syncData.phase);
    setRound(syncData.round);
    setTotalMatchRounds(syncData.totalMatchRounds);
    setTrumpCard(syncData.trumpCard);
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

    if (syncData.phase === 'roundOver' && prevPhase !== 'roundOver') {
      sound.playReveal();
    }

    stateRef.current = {
      ...stateRef.current,
      fronts: syncData.fronts,
      players: syncData.players,
      currentTurnPlayerId: syncData.currentTurnPlayerId,
      turnTimer: syncData.turnTimer,
      phase: syncData.phase,
      round: syncData.round,
      totalMatchRounds: syncData.totalMatchRounds,
      trumpCard: syncData.trumpCard,
      teamARoundPoints: syncData.teamARoundPoints,
      teamBRoundPoints: syncData.teamBRoundPoints,
      teamACumulativePoints: syncData.teamACumulativePoints,
      teamBCumulativePoints: syncData.teamBCumulativePoints,
      initiativeTeam: syncData.initiativeTeam,
      initiativeNotice: syncData.initiativeNotice,
      roundOverReadyPlayers: syncData.roundOverReadyPlayers ?? stateRef.current.roundOverReadyPlayers ?? [],
      roundOverTimer: syncData.roundOverTimer ?? stateRef.current.roundOverTimer ?? 60,
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
        name: s.playerName || (s.isBot ? `Bot ${s.slotId}` : `Jugador ${s.slotId}`),
        team: s.team,
        isHuman: s.isHuman,
        isBot: s.isBot,
        peerId: s.peerId,
        hand: [],
        shadowsLeft: mode.shadowsPerPlayer,
      }));
    }

    const list = [];
    const teamSize = mode.teamSize;

    if (initTeam === 'teamA') {
      for (let i = 1; i <= teamSize; i++) {
        list.push({
          id: `A${i}`,
          name: i === 1 ? 'Tú (A1)' : `Aliado A${i}`,
          team: 'teamA',
          isHuman: i === 1,
          isBot: i !== 1,
          peerId: null,
          hand: [],
          shadowsLeft: mode.shadowsPerPlayer,
        });
        list.push({
          id: `B${i}`,
          name: `Rival B${i}`,
          team: 'teamB',
          isHuman: false,
          isBot: true,
          peerId: null,
          hand: [],
          shadowsLeft: mode.shadowsPerPlayer,
        });
      }
    } else {
      for (let i = 1; i <= teamSize; i++) {
        list.push({
          id: `B${i}`,
          name: `Rival B${i}`,
          team: 'teamB',
          isHuman: false,
          isBot: true,
          peerId: null,
          hand: [],
          shadowsLeft: mode.shadowsPerPlayer,
        });
        list.push({
          id: `A${i}`,
          name: i === 1 ? 'Tú (A1)' : `Aliado A${i}`,
          team: 'teamA',
          isHuman: i === 1,
          isBot: i !== 1,
          peerId: null,
          hand: [],
          shadowsLeft: mode.shadowsPerPlayer,
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
    const activeTrumpSuit = stateRef.current.trumpCard?.suit || trumpCard?.suit;

    let teamARoundScoreSum = 0;
    let teamBRoundScoreSum = 0;
    let teamAFrontWins = 0;
    let teamBFrontWins = 0;

    FRONTS.forEach(front => {
      const teamACards = activeFronts[front.id].teamA;
      const teamBCards = activeFronts[front.id].teamB;
      const teamAScore = calculateFrontScore(teamACards, activeTrumpSuit, true);
      const teamBScore = calculateFrontScore(teamBCards, activeTrumpSuit, true);

      teamARoundScoreSum += teamAScore.total;
      teamBRoundScoreSum += teamBScore.total;

      const resolution = resolveFrontWinner(teamACards, teamBCards, activeTrumpSuit);
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
        const limitTimer = modeConfig.turnTimeLimit || 15;
        setCurrentTurnPlayerId(nextPlayerId);
        setTurnTimer(limitTimer);

        stateRef.current = {
          ...stateRef.current,
          fronts: activeFronts,
          players: activePlayersList,
          currentTurnPlayerId: nextPlayerId,
          turnTimer: limitTimer,
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

    const deployedCard = {
      ...card,
      isShadow: asShadow,
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

    // Actualizar jugador (remover carta de mano y restar ficha de sombra)
    const updatedPlayers = currentList.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          hand: p.hand.filter(c => c.id !== card.id),
          shadowsLeft: asShadow ? Math.max(0, p.shadowsLeft - 1) : p.shadowsLeft,
        };
      }
      return p;
    });
    setPlayers(updatedPlayers);

    stateRef.current = {
      ...stateRef.current,
      fronts: updatedFronts,
      players: updatedPlayers,
    };

    if (asShadow) {
      sound.playShadow();
    } else {
      sound.playCard();
    }

    if (playerId === mySlotId) {
      setSelectedCardId(null);
      setIsShadowMode(false);
    }

    setTurnTimer(modeConfig.turnTimeLimit || 15);

    // Comprobar si todos los jugadores terminaron sus cartas
    const anyCardsLeft = updatedPlayers.some(p => p.hand.length > 0);
    if (!anyCardsLeft) {
      handleDeploymentEnd(updatedFronts, updatedPlayers);
    } else {
      advanceToNextTurn(playerId, updatedPlayers, updatedFronts);
    }
  }

  // Manejo de penalización oficial cuando se agotan los 15s/20s de turno
  function handleTurnTimeoutPenalty() {
    const activePlayer = players.find(p => p.id === currentTurnPlayerId);
    if (!activePlayer || activePlayer.hand.length === 0) return;

    sound.playTimeout();

    // Descartar una carta al azar directamente al pozo de descarte
    const randomCardIndex = Math.floor(Math.random() * activePlayer.hand.length);
    const penalizedCard = activePlayer.hand[randomCardIndex];

    const updatedDiscard = [...discardDeck, penalizedCard];
    setDiscardDeck(updatedDiscard);

    const updatedPlayers = players.map(p => {
      if (p.id === activePlayer.id) {
        return {
          ...p,
          hand: p.hand.filter((_, idx) => idx !== randomCardIndex),
        };
      }
      return p;
    });
    setPlayers(updatedPlayers);

    stateRef.current = {
      ...stateRef.current,
      players: updatedPlayers,
      discardDeck: updatedDiscard,
    };

    const notice = `¡Tiempo agotado para ${activePlayer.name}! Penalización oficial: Carta descartada al pozo sin puntuar.`;
    setPenaltyNotice(notice);
    setTimeout(() => setPenaltyNotice(null), 4000);

    if (activePlayer.id === mySlotId) {
      setSelectedCardId(null);
      setIsShadowMode(false);
    }

    if (isMultiplayer && isHost) {
      mp.broadcast({
        type: 'PENALTY_NOTICE',
        notice,
      });
    }

    const anyCardsLeft = updatedPlayers.some(p => p.hand.length > 0);
    if (!anyCardsLeft) {
      handleDeploymentEnd(fronts, updatedPlayers);
    } else {
      advanceToNextTurn(activePlayer.id, updatedPlayers, fronts);
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

    const initialTurnTimer = modeConfig.turnTimeLimit || 15;
    setTurnTimer(initialTurnTimer);
    setPhase('deployment');

    stateRef.current = {
      ...stateRef.current,
      players: updatedPlayers,
      drawDeck: pool,
      phase: 'deployment',
      turnTimer: initialTurnTimer,
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

  // Iniciar una ronda concreta
  function startNewRound(
    roundNumber,
    newInitiativeTeam,
    currentDrawPool,
    currentDiscardPool,
    cfg = modeConfig,
    customSlots = null,
    forceMultiplayerHost = false
  ) {
    let pool = [...currentDrawPool];
    let discards = [...currentDiscardPool];

    const cardsNeeded = 1 + cfg.totalPlayers * cfg.handSize;
    if (pool.length < cardsNeeded) {
      pool = shuffleDeck([...pool, ...discards]);
      discards = [];
    }

    // 1. Palo de triunfo
    const trump = pool.pop();

    // 2. Jugadores (usar customSlots o los guardados en multiplayerSlots)
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

    setDrawDeck(pool);
    setDiscardDeck(discards);
    setTrumpCard(trump);
    setPlayers(playerList);
    setCurrentTurnPlayerId(playerList[0].id);
    setFronts(initialFronts);
    setRound(roundNumber);
    setInitiativeTeam(newInitiativeTeam);
    setSelectedCardId(null);
    setIsShadowMode(false);
    setPlanningTimer(30);
    setTurnTimer(cfg.turnTimeLimit || 15);
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

    let noticeText = '';
    if (roundNumber === 1) {
      if (isMp) {
        noticeText = `🎲 Sorteo de Iniciativa (Ronda 1): ¡Le ha tocado empezar atacando al ${isTeamA ? 'Equipo A' : 'Equipo B'}!`;
      } else if (is1v1) {
        noticeText = `🎲 Sorteo de Iniciativa (Ronda 1): ¡${isTeamA ? 'Te ha tocado a TI empezar atacando' : 'Le ha tocado al RIVAL empezar atacando'}!`;
      } else {
        noticeText = `🎲 Sorteo de Iniciativa (Ronda 1): ¡${isTeamA ? 'Le ha tocado a TU EQUIPO (A) empezar atacando' : 'Le ha tocado al EQUIPO RIVAL (B) empezar atacando'}!`;
      }
    } else {
      if (isMp) {
        noticeText = `🔄 Rotación de Iniciativa (Ronda ${roundNumber}): Por reglamento alterna la iniciativa. Empieza atacando el ${isTeamA ? 'Equipo A' : 'Equipo B'}.`;
      } else if (is1v1) {
        noticeText = `🔄 Rotación de Iniciativa (Ronda ${roundNumber}): Por reglamento alterna la iniciativa. Ahora ${isTeamA ? 'te toca a TI empezar atacando' : 'le toca al RIVAL empezar atacando'}.`;
      } else {
        noticeText = `🔄 Rotación de Iniciativa (Ronda ${roundNumber}): Por reglamento alterna la iniciativa. Ahora ${isTeamA ? 'le toca a TU EQUIPO (A) empezar atacando' : 'le toca al EQUIPO RIVAL (B) empezar atacando'}.`;
      }
    }
    setInitiativeNotice(noticeText);

    const isMultiplayerActive = isMultiplayer || forceMultiplayerHost || stateRef.current.isMultiplayer;
    const isHostActive = isHost || forceMultiplayerHost || stateRef.current.isHost;

    stateRef.current = {
      ...stateRef.current,
      round: roundNumber,
      initiativeTeam: newInitiativeTeam,
      initiativeNotice: noticeText,
      drawDeck: pool,
      discardDeck: discards,
      trumpCard: trump,
      players: playerList,
      currentTurnPlayerId: playerList[0].id,
      fronts: initialFronts,
      phase: 'planning',
      planningTimer: 30,
      turnTimer: cfg.turnTimeLimit || 15,
      readyPlayers: initialBotReadyIds,
      roundOverTimer: 60,
      roundOverReadyPlayers: [],
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
    setTotalMatchRounds(rhythmConfig.rounds);
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);

    const initialDeck = createDeck(modeConfig.decks);
    const initialInitiative = determineInitialInitiative();

    startNewRound(1, initialInitiative, initialDeck, [], modeConfig);
    setScreen('game');
  }

  // Iniciar partida multijugador desde la sala (Host o Cliente)
  function handleStartMultiplayerMatch(lobbyData) {
    const isHostUser = Boolean(lobbyData.isHost);
    const assignedSlot = lobbyData.mySlotId || mp.myPlayerId || (isHostUser ? 'A1' : null);

    setIsMultiplayer(true);
    setIsHost(isHostUser);
    setMySlotId(assignedSlot);
    setMultiplayerSlots(lobbyData.slots || null);
    setSelectedMode(lobbyData.modeId);
    setSelectedRhythm(lobbyData.rhythmRounds);
    setMultiplayerRoomCode(mp.roomCode);
    setRoundOverTimer(60);
    setRoundOverReadyPlayers([]);

    stateRef.current.isMultiplayer = true;
    stateRef.current.isHost = isHostUser;
    stateRef.current.mySlotId = assignedSlot;
    stateRef.current.selectedMode = lobbyData.modeId;

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
          slots: lobbyData.slots,
          isHost: false,
        },
      });

      startNewRound(1, initialInitiative, initialDeck, [], activeConfig, lobbyData.slots, true);
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
    const currentTrumpCard = stateRef.current.trumpCard || trumpCard;
    const currentDiscardDeck = stateRef.current.discardDeck || discardDeck;
    const currentDrawDeck = stateRef.current.drawDeck || drawDeck;
    const currentInitiative = stateRef.current.initiativeTeam || initiativeTeam;

    const cardsToDiscard = [
      currentTrumpCard,
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
      multiplayerSlots
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
    setTotalMatchRounds(rhythmConfig.rounds);

    const newDeck = createDeck(modeConfig.decks);
    const initialInitiative = determineInitialInitiative();

    startNewRound(1, initialInitiative, newDeck, [], modeConfig);
  }

  // Despliegue del jugador humano al hacer clic en un frente
  function handleDeployPlayerCard(frontKey) {
    if (phase !== 'deployment') return;

    // Comprobar si es el turno del jugador local
    if (currentTurnPlayerId !== mySlotId) return;
    if (!selectedCardId) return;

    const me = players.find(p => p.id === mySlotId);
    if (!me) return;

    const card = me.hand.find(c => c.id === selectedCardId);
    if (!card) return;

    const totalInFront = fronts[frontKey].teamA.length + fronts[frontKey].teamB.length;
    if (totalInFront >= modeConfig.maxFrontCards) return;

    const useShadow = isShadowMode && me.shadowsLeft > 0;

    if (isMultiplayer && !isHost) {
      // Cliente: enviar acción al Host
      mp.sendToHost({
        type: 'PLAY_CARD',
        slotId: mySlotId,
        cardId: card.id,
        frontKey,
        asShadow: useShadow,
      });
      setSelectedCardId(null);
      setIsShadowMode(false);
      return;
    }

    // Host o Local: ejecutar directamente
    executePlayerMove(mySlotId, card, frontKey, useShadow);
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

  // Temporizador oficial por turno durante el despliegue (15s oficiales con penalización de descarte)
  useEffect(() => {
    if (screen !== 'game' || phase !== 'deployment') return;
    if (isMultiplayer && !isHost) return; // Solo el Host o en juego local aplica penalizaciones de tiempo

    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          handleTurnTimeoutPenalty();
          return modeConfig.turnTimeLimit || 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, phase, currentTurnPlayerId, players, isMultiplayer, isHost]);

  // Turno de Bots (Solo corre en Local o en el Host multijugador para puestos con Bot)
  useEffect(() => {
    if (screen !== 'game' || phase !== 'deployment') return;
    if (isMultiplayer && !isHost) return; // Clientes no calculan IA

    const activePlayer = players.find(p => p.id === currentTurnPlayerId);
    if (!activePlayer) return;

    if (activePlayer.isBot && activePlayer.hand.length > 0) {
      setIsBotThinking(true);
      const delay = setTimeout(() => {
        const move = chooseBotMove({
          botHand: activePlayer.hand,
          botTeam: activePlayer.team,
          fronts,
          trumpSuit: trumpCard?.suit,
          botShadowsLeft: activePlayer.shadowsLeft,
          maxFrontCards: modeConfig.maxFrontCards,
        });

        if (move) {
          executePlayerMove(activePlayer.id, move.card, move.frontKey, move.asShadow);
        } else {
          advanceToNextTurn(activePlayer.id);
        }
        setIsBotThinking(false);
      }, 750);

      return () => clearTimeout(delay);
    }
  }, [screen, phase, currentTurnPlayerId, players, fronts, isMultiplayer, isHost]);

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

  // Obtener al jugador local y perspectiva de equipo
  const localPlayer = players.find(p => p.id === mySlotId) || (!isMultiplayer ? players.find(p => p.isHuman) : null);
  const viewerTeam = localPlayer?.team || (mySlotId?.startsWith('B') ? 'teamB' : 'teamA');
  const isMyTurn = currentTurnPlayerId === mySlotId && phase === 'deployment';
  const selectedCard = localPlayer?.hand?.find(c => c.id === selectedCardId);

  // PANTALLA 1: MENÚ PRINCIPAL
  if (screen === 'menu') {
    return (
      <>
        <MainMenu
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedRhythm={selectedRhythm}
          setSelectedRhythm={setSelectedRhythm}
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

  // PANTALLA 3: PANTALLA DE JUEGO (BATALLA)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Barra Superior / Marcador */}
      <ScoreBoard
        round={round}
        totalRounds={totalMatchRounds}
        teamARoundPoints={teamARoundPoints}
        teamBRoundPoints={teamBRoundPoints}
        teamACumulativePoints={teamACumulativePoints}
        teamBCumulativePoints={teamBCumulativePoints}
        trumpCard={trumpCard}
        initiativeTeam={initiativeTeam}
        drawDeckCount={drawDeck.length}
        discardDeckCount={discardDeck.length}
        modeConfig={modeConfig}
        rhythmConfig={rhythmConfig}
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

      {/* Tira Secuencial de Turnos para 1v1, 2v2, 3v3 y 4v4 con Reloj Oficial */}
      {phase === 'deployment' && (
        <TurnStrip
          players={players}
          currentTurnPlayerId={currentTurnPlayerId}
          isBotThinking={isBotThinking}
          turnTimer={turnTimer}
        />
      )}

      {/* Aviso de Sorteo / Iniciativa (Quién empieza atacando) */}
      {initiativeNotice && (
        <div className="bg-gradient-to-r from-amber-950/95 via-indigo-950/95 to-slate-900 border-b border-amber-500/50 text-amber-200 px-4 py-2 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Dices className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-semibold text-slate-100">{initiativeNotice}</span>
          </div>
          <button
            onClick={() => setInitiativeNotice(null)}
            className="text-[10px] uppercase font-bold text-amber-400 hover:text-white px-2.5 py-0.5 rounded bg-slate-900/60 border border-amber-500/30 hover:border-amber-400 transition"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Aviso de Penalización por Tiempo */}
      {penaltyNotice && (
        <div className="bg-rose-950/95 border-b border-rose-700 text-rose-200 px-4 py-2 text-xs flex items-center gap-2 shadow-lg animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{penaltyNotice}</span>
        </div>
      )}

      {/* Alerta de Fase de Planificación / Táctica */}
      {phase === 'planning' && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2 max-w-2xl">
            <Clock className="w-4 h-4 shrink-0 animate-spin" />
            <span>
              {selectedMode === '1v1' ? (
                <>
                  <strong>FASE 2: Fase Táctica (30s) — SIN CARTAS EN MANO.</strong> Planificación táctica individual: prepara mentalmente tu táctica y contrataque antes del reparto.
                </>
              ) : (
                <>
                  <strong>FASE 2: Táctica de Equipo (30s) — SIN CARTAS EN MANO.</strong> Planificad zonas prioritarias antes del reparto (Regla anti-jugador alfa).
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono bg-amber-950/20 px-2.5 py-1 rounded text-slate-950 font-black flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{planningTimer}s</span>
            </span>

            {!isMultiplayer ? (
              <button
                type="button"
                onClick={beginDeploymentPhase}
                className="bg-slate-950 hover:bg-slate-900 text-amber-400 px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{selectedMode === '1v1' ? '¡Iniciar Duelo!' : '¡Empezar Ya!'}</span>
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer ${
                  readyPlayers.includes(mySlotId)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-emerald-900/40'
                    : 'bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/40 hover:border-amber-400'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${readyPlayers.includes(mySlotId) ? 'stroke-[3]' : ''}`} />
                <span>
                  {readyPlayers.includes(mySlotId) ? '¡Listo!' : '¡Preparado!'} (
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
        {/* LOS 3 FRENTES DE GUERRA (SIN CONTADOR DE PUNTOS AUTOMÁTICO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto">
          {FRONTS.map(front => (
            <FrontZone
              key={front.id}
              frontKey={front.id}
              frontInfo={front}
              teamACards={fronts[front.id].teamA}
              teamBCards={fronts[front.id].teamB}
              trumpSuit={trumpCard?.suit}
              isRoundOver={phase === 'roundOver'}
              selectedCard={selectedCard}
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2">
          {/* Barra superior de la mano */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                Tu Mano: {localPlayer?.name || 'Comandante'} ({localPlayer?.hand?.length || 0} cartas)
              </span>

              {/* Botón de Modo Sombra */}
              <button
                type="button"
                disabled={!localPlayer || localPlayer.shadowsLeft <= 0 || !isMyTurn}
                onClick={() => setIsShadowMode(prev => !prev)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  isShadowMode
                    ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/30 shadow-md ring-2 ring-purple-400'
                    : localPlayer && localPlayer.shadowsLeft > 0
                    ? 'bg-slate-800 text-purple-300 border-purple-800 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>
                  {isShadowMode ? 'Modo Sombra ACTIVO' : 'Jugar como Sombra'}
                </span>
                <span className="bg-purple-950/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  {localPlayer?.shadowsLeft || 0} restantes
                </span>
              </button>
            </div>

            {/* Aviso de turno del jugador con contador de tiempo */}
            <div>
              {isMyTurn ? (
                <span className="text-xs text-amber-400 font-bold animate-pulse">
                  {selectedCardId
                    ? `Haz clic en un frente para desplegar (Te quedan ${turnTimer}s)`
                    : `Es tu turno: elige una carta para jugar (${turnTimer}s)`}
                </span>
              ) : phase === 'planning' ? (
                <span className="text-xs text-amber-300">
                  {selectedMode === '1v1' ? 'Fase táctica: prepara tu estrategia mentalmente...' : 'Planificad táctica macro (sin cartas)...'}
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Esperando el turno de {players.find(p => p.id === currentTurnPlayerId)?.name || 'otro jugador'}...
                </span>
              )}
            </div>
          </div>

          {/* Cartas en mano del jugador local */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap min-h-[110px] sm:min-h-[140px] py-1">
            {!localPlayer || !localPlayer.hand || localPlayer.hand.length === 0 ? (
              <span className="text-sm text-slate-500 italic">
                {phase === 'planning'
                  ? `Fase de Táctica: Recibirás tus ${modeConfig.handSize} cartas al comenzar el despliegue.`
                  : 'Has desplegado todas tus tropas de esta ronda.'}
              </span>
            ) : (
              localPlayer.hand.map(card => {
                const isSelected = card.id === selectedCardId;
                const isTrump = card.suit === trumpCard?.suit;

                return (
                  <div key={card.id} className="relative group">
                    <Card
                      card={card}
                      isSelected={isSelected}
                      isTrump={isTrump}
                      isPlayable={isMyTurn}
                      onClick={() => {
                        if (isMyTurn) {
                          setSelectedCardId(prev => (prev === card.id ? null : card.id));
                        }
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
        trumpSuit={trumpCard?.suit}
        modeId={selectedMode}
        onNextRound={handleNextRound}
        isMultiplayer={isMultiplayer}
        readyPlayers={roundOverReadyPlayers}
        mySlotId={mySlotId}
        players={players}
        countdown={roundOverTimer}
        onToggleReady={handleToggleRoundReady}
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
