import React, { useState, useEffect } from 'react';
import {
  Users,
  Swords,
  Copy,
  Check,
  Share2,
  Bot,
  User,
  Shield,
  Clock,
  ArrowLeft,
  Play,
  Send,
  MessageSquare,
  Sparkles,
  Wifi,
  WifiOff,
  Timer,
  Crown,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  GAME_MODES,
  GAME_DURATIONS,
  TEAM_TIMES,
  TEAM_TIME_OPTIONS,
  getLocalizedModes,
  getLocalizedDurations,
  getLocalizedTimeOptions,
} from '../constants/rules';
import { mp, formatRoomCode, generateRoomCode } from '../utils/multiplayer';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function MultiplayerLobby({
  onStartMultiplayerGame,
  onBackToMenu,
  initialRoomCode = '',
}) {
  const { language, isEn, ui } = useLanguage();

  // Estado de conexión: 'idle' | 'creating' | 'joining' | 'inLobby'
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  // Formulario de conexión
  const [activeTab, setActiveTab] = useState(initialRoomCode ? 'join' : 'create');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('wf_player_name') || (isEn ? 'Commander' : 'Comandante'));
  const [inputRoomCode, setInputRoomCode] = useState(initialRoomCode || '');
  const [selectedMode, setSelectedMode] = useState('2v2');
  const [selectedRhythm, setSelectedRhythm] = useState(6);
  const [selectedTimeSpeed, setSelectedTimeSpeed] = useState('medio');

  // Estado de la sala activa
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [lobbySlots, setLobbySlots] = useState([]);
  const [mySlotId, setMySlotId] = useState('A1');
  const [autoFillBots, setAutoFillBots] = useState(false);

  // Chat y Copiado
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Guardar nombre en localStorage
  const handleNameChange = (name) => {
    setPlayerName(name);
    try {
      localStorage.setItem('wf_player_name', name);
    } catch (_) {}
  };

  // Suscribirse a eventos de multiplayer
  useEffect(() => {
    const unsubJoinReq = mp.on('clientJoinRequest', ({ peerId, name, conn }) => {
      if (!mp.isHost) return;
      handleAssignClientToSlot(peerId, name, conn);
    });

    const unsubSlotSelect = mp.on('clientSelectSlot', ({ peerId, slotId }) => {
      if (!mp.isHost) return;
      handleMoveClientSlot(peerId, slotId);
    });

    const unsubLobbyState = mp.on('lobbyState', (lobby) => {
      setLobbySlots(lobby.slots);
      setSelectedMode(lobby.modeId);
      setSelectedRhythm(lobby.rhythmRounds);
      if (lobby.timeSpeed) setSelectedTimeSpeed(lobby.timeSpeed);
      setAutoFillBots(lobby.autoFillBots);
    });

    const unsubSlotAssigned = mp.on('slotAssigned', (slotId) => {
      setMySlotId(slotId);
      mp.myPlayerId = slotId;
    });

    const unsubGameStart = mp.on('gameStart', (data) => {
      const payload = data?.gameData || data;
      const assignedSlot = mySlotId || mp.myPlayerId;
      onStartMultiplayerGame({
        ...payload,
        isHost: false,
        mySlotId: assignedSlot,
      });
    });

    const unsubChat = mp.on('chatMessage', (msg) => {
      setChatMessages(prev => [...prev.slice(-30), msg]);
    });

    const unsubError = mp.on('error', (err) => {
      setErrorMessage(err);
      setConnectionStatus('idle');
    });

    const unsubDisconnect = mp.on('disconnected', (msg) => {
      setErrorMessage(msg);
      setConnectionStatus('idle');
    });

    const unsubClientDisc = mp.on('clientDisconnected', (peerId) => {
      if (!mp.isHost) return;
      setLobbySlots(prevSlots => {
        const found = prevSlots.find(s => s.peerId === peerId);
        if (!found) return prevSlots;
        const updated = prevSlots.map(s => {
          if (s.peerId === peerId) {
            return {
              ...s,
              peerId: null,
              playerName: isEn ? 'Empty' : 'Vacío',
              isHuman: false,
              isBot: false,
            };
          }
          return s;
        });
        broadcastLobbyState(updated, selectedMode, selectedRhythm, false);
        mp.sendChat(isEn ? `Commander ${found.playerName} (${found.slotId}) disconnected.` : `El comandante ${found.playerName} (${found.slotId}) se ha desconectado.`);
        return updated;
      });
    });

    return () => {
      unsubJoinReq();
      unsubSlotSelect();
      unsubLobbyState();
      unsubSlotAssigned();
      unsubGameStart();
      unsubChat();
      unsubError();
      unsubDisconnect();
      unsubClientDisc();
    };
  }, [onStartMultiplayerGame, lobbySlots, selectedMode, selectedRhythm, selectedTimeSpeed, autoFillBots, isEn]);

  // Inicializar slots de la sala (todos los puestos no-host empiezan vacíos)
  const buildInitialSlots = (modeId, hostName, fillWithBots = false) => {
    const mode = GAME_MODES[modeId] || GAME_MODES['2v2'];
    const slots = [];
    const teamSize = mode.teamSize;

    // Equipo A
    for (let i = 1; i <= teamSize; i++) {
      slots.push({
        slotId: `A${i}`,
        label: i === 1 ? (isEn ? 'Allied Captain (A1)' : 'Capitán Aliado (A1)') : (isEn ? `Ally A${i}` : `Aliado A${i}`),
        team: 'teamA',
        isHost: i === 1,
        peerId: i === 1 ? mp.myPeerId : null,
        playerName: i === 1 ? hostName : (fillWithBots ? `Bot A${i}` : (isEn ? 'Empty' : 'Vacío')),
        isBot: i !== 1 && fillWithBots,
        isHuman: i === 1,
      });
    }

    // Equipo B
    for (let i = 1; i <= teamSize; i++) {
      slots.push({
        slotId: `B${i}`,
        label: i === 1 ? (isEn ? 'Rival Captain (B1)' : 'Capitán Rival (B1)') : (isEn ? `Rival B${i}` : `Rival B${i}`),
        team: 'teamB',
        isHost: false,
        peerId: null,
        playerName: fillWithBots ? `Bot B${i}` : (isEn ? 'Empty' : 'Vacío'),
        isBot: fillWithBots,
        isHuman: false,
      });
    }

    return slots;
  };

  // Crear Sala (Host)
  const handleCreateRoom = async () => {
    setErrorMessage(null);
    setConnectionStatus('creating');
    const generated = generateRoomCode();

    try {
      const res = await mp.createRoom(generated, playerName, selectedMode, selectedRhythm);
      setRoomCode(res.roomCode);
      setIsHost(true);
      setMySlotId('A1');
      mp.myPlayerId = 'A1';

      const initialSlots = buildInitialSlots(selectedMode, playerName, false);
      setLobbySlots(initialSlots);
      setConnectionStatus('inLobby');

      // Notificar chat de bienvenida
      setChatMessages([
        { senderName: isEn ? 'System' : 'Sistema', text: isEn ? `Room ${res.roomCode} created! Share the code with your teammates and rivals.` : `¡Sala ${res.roomCode} creada! Comparte el código con tus compañeros y rivales.` }
      ]);
    } catch (err) {
      setErrorMessage(err.message || (isEn ? 'Could not create room.' : 'No se pudo crear la sala.'));
      setConnectionStatus('idle');
    }
  };

  // Unirse a Sala (Client)
  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) {
      setErrorMessage(isEn ? 'Please enter a valid room code.' : 'Por favor introduce un código de sala válido.');
      return;
    }

    setErrorMessage(null);
    setConnectionStatus('joining');

    try {
      const res = await mp.joinRoom(inputRoomCode, playerName);
      setRoomCode(res.roomCode);
      setIsHost(false);
      setConnectionStatus('inLobby');
      setChatMessages([
        { senderName: isEn ? 'System' : 'Sistema', text: isEn ? `Connected to room ${res.roomCode}. Waiting for slot assignment...` : `Conectado a la sala ${res.roomCode}. Esperando asignación de puesto...` }
      ]);
    } catch (err) {
      setErrorMessage(err.message || (isEn ? 'Error connecting to room.' : 'Error al conectar a la sala.'));
      setConnectionStatus('idle');
    }
  };

  // Host: Asignar un cliente que acaba de unirse a un slot libre
  const handleAssignClientToSlot = (peerId, clientName, conn) => {
    setLobbySlots(prevSlots => {
      // Buscar el primer slot disponible (que sea bot o vacío)
      const targetIndex = prevSlots.findIndex(s => !s.isHuman);
      if (targetIndex === -1) {
        conn.send({ type: 'ERROR', message: isEn ? 'The room is full.' : 'La sala está completa.' });
        return prevSlots;
      }

      const updated = [...prevSlots];
      updated[targetIndex] = {
        ...updated[targetIndex],
        peerId,
        playerName: clientName,
        isHuman: true,
        isBot: false,
      };

      // Notificar al cliente de su slot asignado
      conn.send({
        type: 'ASSIGNED_SLOT',
        slotId: updated[targetIndex].slotId,
      });

      // Transmitir estado de lobby a todos
      broadcastLobbyState(updated, selectedMode, selectedRhythm, autoFillBots);

      mp.sendChat(ui.multiplayer.systemJoin(clientName, updated[targetIndex].label));
      return updated;
    });
  };

  // Host: Mover a un jugador de slot (o al propio host)
  const handleMoveClientSlot = (peerId, targetSlotId) => {
    setLobbySlots(prevSlots => {
      const currentIdx = prevSlots.findIndex(s => s.peerId === peerId);
      const targetIdx = prevSlots.findIndex(s => s.slotId === targetSlotId);

      if (currentIdx === -1 || targetIdx === -1) return prevSlots;
      if (prevSlots[targetIdx].isHuman) return prevSlots; // Ya ocupado por humano

      const updated = [...prevSlots];
      const playerInfo = { ...updated[currentIdx] };

      // Vaciar slot anterior (o poner bot si autoFill)
      updated[currentIdx] = {
        ...updated[currentIdx],
        peerId: null,
        playerName: autoFillBots ? `Bot ${updated[currentIdx].slotId}` : (isEn ? 'Empty' : 'Vacío'),
        isHuman: false,
        isBot: autoFillBots,
      };

      // Ocupar nuevo slot
      updated[targetIdx] = {
        ...updated[targetIdx],
        peerId,
        playerName: playerInfo.playerName,
        isHuman: true,
        isBot: false,
      };

      // Si el peer es el host
      if (peerId === mp.myPeerId) {
        setMySlotId(targetSlotId);
      } else {
        mp.sendToPeer(peerId, {
          type: 'ASSIGNED_SLOT',
          slotId: targetSlotId,
        });
      }

      broadcastLobbyState(updated, selectedMode, selectedRhythm, autoFillBots);
      return updated;
    });
  };

  // Host: Alternar slot individual entre Bot y Vacío
  const handleToggleBotSlot = (slotId) => {
    if (!isHost) return;

    setLobbySlots(prevSlots => {
      const updated = prevSlots.map(slot => {
        if (slot.slotId === slotId && !slot.isHuman) {
          const nextIsBot = !slot.isBot;
          return {
            ...slot,
            isBot: nextIsBot,
            playerName: nextIsBot ? `Bot ${slot.slotId}` : (isEn ? 'Empty' : 'Vacío'),
          };
        }
        return slot;
      });

      broadcastLobbyState(updated, selectedMode, selectedRhythm, autoFillBots);
      return updated;
    });
  };

  // Host: Rellenar todos los puestos vacíos con bots, o vaciar todos los bots
  const handleFillAllBots = () => {
    if (!isHost) return;

    setLobbySlots(prevSlots => {
      const hasEmpty = prevSlots.some(s => !s.isHuman && !s.isBot);
      const updated = prevSlots.map(slot => {
        if (!slot.isHuman) {
          if (hasEmpty) {
            // Rellenar vacíos con bots
            return {
              ...slot,
              isBot: true,
              playerName: `Bot ${slot.slotId}`,
            };
          } else {
            // Vaciar todos los bots
            return {
              ...slot,
              isBot: false,
              playerName: isEn ? 'Empty' : 'Vacío',
            };
          }
        }
        return slot;
      });

      const nextAutoFill = hasEmpty;
      setAutoFillBots(nextAutoFill);
      broadcastLobbyState(updated, selectedMode, selectedRhythm, nextAutoFill);
      return updated;
    });
  };

  // Host: Cambiar modo de juego en la sala
  const handleChangeGameMode = (newModeId) => {
    if (!isHost) return;
    setSelectedMode(newModeId);
    const newSlots = buildInitialSlots(newModeId, playerName, false);
    setLobbySlots(newSlots);
    setMySlotId('A1');
    broadcastLobbyState(newSlots, newModeId, selectedRhythm, false, selectedTimeSpeed);
  };

  // Host: Cambiar tiempo de equipo en la sala
  const handleChangeTimeSpeed = (newSpeed) => {
    if (!isHost) return;
    setSelectedTimeSpeed(newSpeed);
    broadcastLobbyState(lobbySlots, selectedMode, selectedRhythm, autoFillBots, newSpeed);
  };

  // Host: Cambiar duración de juego en la sala
  const handleChangeRhythm = (newRhythm) => {
    if (!isHost) return;
    setSelectedRhythm(newRhythm);
    broadcastLobbyState(lobbySlots, selectedMode, newRhythm, autoFillBots, selectedTimeSpeed);
  };

  // Host: Difundir estado del lobby a todos los peers
  const broadcastLobbyState = (slots, modeId, rhythmRounds, fillBots, timeSpeed = null) => {
    mp.broadcast({
      type: 'LOBBY_STATE',
      lobby: {
        slots,
        modeId,
        rhythmRounds,
        timeSpeed: timeSpeed || selectedTimeSpeed,
        autoFillBots: fillBots,
      },
    });
  };

  // Iniciar la partida (solo Host)
  const handleHostStartMatch = () => {
    if (!isHost) return;

    // Comprobar si hay huecos vacíos
    const emptySlots = lobbySlots.filter(s => !s.isHuman && !s.isBot);
    if (emptySlots.length > 0) {
      setErrorMessage(
        isEn
          ? `There are ${emptySlots.length} empty slot(s). Wait for more players, click '+ Bot' on slots or use 'Fill with Bots' to start.`
          : `Hay ${emptySlots.length} puesto(s) vacío(s). Espera a más jugadores, pulsa '+ Bot' en los huecos o usa el botón 'Rellenar con Bots' para poder iniciar.`
      );
      return;
    }

    onStartMultiplayerGame({
      modeId: selectedMode,
      rhythmRounds: selectedRhythm,
      timeSpeed: selectedTimeSpeed,
      slots: lobbySlots,
      mySlotId,
      isHost: true,
    });
  };

  // Enviar mensaje de chat
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    mp.sendChat(chatInput.trim());
    setChatInput('');
  };

  // Copiar código de sala
  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copiar enlace de invitación
  const handleCopyLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Salir de la sala
  const handleLeaveLobby = () => {
    mp.cleanup();
    setConnectionStatus('idle');
    setIsHost(false);
    onBackToMenu();
  };

  const localizedModes = getLocalizedModes(language);
  const localizedDurations = getLocalizedDurations(language);
  const localizedTimeOptions = getLocalizedTimeOptions(language);
  const modeConfig = localizedModes[selectedMode] || localizedModes['2v2'];
  const modeTimes = TEAM_TIMES[selectedMode] || TEAM_TIMES['2v2'];
  const currentTimeConfig = modeTimes[selectedTimeSpeed] || modeTimes['medio'];
  const currentDuration = localizedDurations.find(d => d.rounds === selectedRhythm) || localizedDurations[1];

  // PANTALLA 1: CONEXIÓN O CREACIÓN (Si aún no está en sala)
  if (connectionStatus !== 'inLobby') {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative select-none">
        {/* Cabecera */}
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/90 text-slate-300 hover:text-amber-200 transition text-xs font-serif font-bold uppercase tracking-wider border border-amber-500/20 hover:border-amber-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{ui.common.backToMenu}</span>
          </button>

          <div className="flex items-center gap-3">
            <LanguageToggle compact />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/20">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-serif font-bold text-amber-300 uppercase tracking-wider">{ui.multiplayer.headerTitle}</div>
                <div className="text-[10px] text-slate-400 font-serif">{ui.multiplayer.headerSubtitle}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Zona Central: Formato amplio tipo Partida contra Bots */}
        <main className="max-w-6xl w-full mx-auto my-auto py-6 z-10 flex flex-col items-center">
          {/* Título y Subtítulo de Operaciones */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest mb-2 shadow-inner">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>{ui.multiplayer.connectBoxTitle}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-widest text-gold-gradient uppercase">
              {ui.multiplayer.headerTitle}
            </h2>

            <p className="text-xs sm:text-sm font-serif text-slate-300 mt-1 max-w-xl mx-auto leading-relaxed">
              {ui.multiplayer.connectBoxSubtitle}
            </p>
          </div>

          {/* Nombre de Jugador / Comandante */}
          <div className="w-full max-w-xl mb-6 casino-panel rounded-2xl p-4 border border-amber-500/25 shadow-lg">
            <label className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300 block mb-1.5">
              {ui.multiplayer.nameLabel}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                maxLength={20}
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={ui.multiplayer.namePlaceholder}
                className="w-full bg-black/70 border border-amber-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-serif font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
              />
            </div>
          </div>

          {/* Selector de Pestañas: Crear Sala vs Unirse a Sala */}
          <div className="inline-flex p-1.5 bg-black/70 rounded-2xl border border-amber-500/30 mb-7 shadow-inner">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-8 py-2.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              {ui.multiplayer.tabCreate}
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-8 py-2.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              {ui.multiplayer.tabJoin}
            </button>
          </div>

          {/* Mensaje de Error si existiese */}
          {errorMessage && (
            <div className="w-full max-w-xl mb-5 p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-200 font-serif flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: CREAR SALA (Estructura idéntica al Menú de Partida contra Bots) */}
          {activeTab === 'create' && (
            <div className="w-full flex flex-col items-center">
              {/* 1. Selección de Formato de Juego */}
              <div className="w-full mb-7">
                <div className="flex items-center justify-between mb-3 px-1 font-serif">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step1}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isEn ? '1v1, 2v2, 3v3 and 4v4 Tactical Format' : 'Formatos 1v1, 2v2, 3v3 y 4v4 para multijugador'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {Object.values(localizedModes).map((mode) => {
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`
                          text-left rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between relative group cursor-pointer
                          ${isSelected
                            ? 'border-2 border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] shadow-[0_0_25px_rgba(212,175,55,0.35)] ring-2 ring-amber-400/40 -translate-y-1'
                            : 'border border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 opacity-75 hover:opacity-100'
                          }
                        `}
                      >
                        {/* Insignia de Barajas y Estado */}
                        <div className="flex items-center justify-between mb-3 gap-1">
                          {isSelected ? (
                            <span className="text-[10px] font-serif font-black px-2.5 py-0.5 rounded-full border bg-amber-500/25 text-amber-300 border-amber-400 flex items-center gap-1 shadow-sm">
                              <Check className="w-3 h-3 stroke-[3] text-amber-400" />
                              {isEn ? 'SELECTED' : 'SELECCIONADO'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-serif font-bold px-2 py-0.5 rounded-full border bg-black/50 text-slate-400 border-amber-500/20">
                              {mode.decks === 1 ? (isEn ? '1 Deck (52 cards)' : '1 Baraja (52 cartas)') : (isEn ? '2 Decks (104 cards)' : '2 Barajas (104 cartas)')}
                            </span>
                          )}

                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-amber-500/70'}`}>
                            {mode.totalPlayers} {isEn ? 'Players' : 'Jugadores'}
                          </span>
                        </div>

                        <div>
                          <h3 className={`text-xl font-serif font-black mb-1 flex items-center justify-between ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>
                            {mode.name}
                          </h3>
                          <p className="text-xs font-serif text-amber-400/90 font-semibold mb-2">{mode.subtitle}</p>
                          <p className="text-xs text-slate-300 leading-snug">{mode.description}</p>
                        </div>

                        {/* Resumen táctico inferior */}
                        <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-slate-400 font-serif">
                          <span>{isEn ? 'Front Cap:' : 'Límite Frente:'} <strong className="text-slate-200">{mode.maxFrontCards}</strong></span>
                          <span>{isEn ? 'Team Shadows:' : 'Sombras Equipo:'} <strong className="text-purple-400">{mode.teamShadows || (mode.id === '1v1' ? 2 : mode.teamSize)}</strong></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Selección de Tiempo de Equipo (Reloj Compartido) */}
              <div className="w-full mb-7">
                <div className="flex items-center justify-between mb-3 px-1 font-serif">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step3}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isEn ? 'Joint team time bank for each round' : 'Bolsa de tiempo conjunta por equipo para cada ronda'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {localizedTimeOptions.map((timeOpt) => {
                    const isSelected = selectedTimeSpeed === timeOpt.id;
                    const speedConfig = modeTimes[timeOpt.id];
                    return (
                      <button
                        key={timeOpt.id}
                        type="button"
                        onClick={() => setSelectedTimeSpeed(timeOpt.id)}
                        className={`
                          p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer relative
                          ${isSelected
                            ? 'border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] ring-2 ring-amber-400/40 text-slate-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] -translate-y-0.5'
                            : 'border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 text-slate-300 opacity-75 hover:opacity-100'
                          }
                        `}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-serif font-bold text-base ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>{timeOpt.name}</span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-serif font-black uppercase text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                                <Check className="w-2.5 h-2.5 stroke-[3] text-amber-400" />
                                {isEn ? 'ACTIVE' : 'ACTIVO'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-serif text-slate-400">{timeOpt.desc}</span>
                        </div>

                        <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border shadow-inner ${
                          isSelected
                            ? 'text-amber-300 bg-amber-500/20 border-amber-400'
                            : 'text-amber-400 bg-black/60 border-amber-500/25'
                        }`}>
                          {speedConfig?.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-serif text-slate-400 mt-2 px-1">
                  {isEn
                    ? 'Time is shared across the entire team and counts down during members\' turns. Resets to full value each round.'
                    : 'El tiempo es compartido para todo el equipo y se consume durante los turnos de sus componentes. Se reinicia al valor completo en cada nueva ronda.'}
                </p>
              </div>

              {/* 3. Selección de Duración de la Partida */}
              <div className="w-full mb-7">
                <div className="flex items-center justify-between mb-3 px-1 font-serif">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> {ui.menu.setup.step2}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isEn ? 'Determines the total number of regular rounds to contest' : 'Determina el total de rondas reglamentarias a disputar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {localizedDurations.map((dur) => {
                    const isSelected = selectedRhythm === dur.rounds;
                    return (
                      <button
                        key={dur.rounds}
                        type="button"
                        onClick={() => setSelectedRhythm(dur.rounds)}
                        className={`
                          p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer relative
                          ${isSelected
                            ? 'border-amber-400 bg-gradient-to-b from-[#182030] to-[#0c101a] ring-2 ring-amber-400/40 text-slate-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] -translate-y-0.5'
                            : 'border-amber-500/20 bg-black/60 hover:bg-[#101624] hover:border-amber-500/40 text-slate-300 opacity-75 hover:opacity-100'
                          }
                        `}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-serif font-bold text-base ${isSelected ? 'text-amber-200' : 'text-slate-100'}`}>{dur.name}</span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-serif font-black uppercase text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                                <Check className="w-2.5 h-2.5 stroke-[3] text-amber-400" />
                                {isEn ? 'ACTIVE' : 'ACTIVO'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-serif text-slate-400">{dur.desc}</span>
                        </div>

                        <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border ${
                          isSelected
                            ? 'text-amber-300 bg-amber-500/20 border-amber-400'
                            : 'text-slate-300 bg-black/60 border-amber-500/20'
                        }`}>
                          {dur.timeEst}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Resumen y Botón Principal de Crear Sala */}
              <div className="w-full max-w-4xl casino-panel rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                <div>
                  <span className="text-[11px] uppercase font-serif font-bold text-amber-400 tracking-wider block">
                    {isEn ? 'Multiplayer Match Summary' : 'Resumen de Configuración Multijugador'}
                  </span>
                  <div className="text-sm font-serif font-bold text-slate-200 mt-0.5">
                    {modeConfig.name} • {currentTimeConfig?.text || currentTimeConfig?.label} • {currentDuration?.name} ({selectedRhythm} {isEn ? 'Rounds' : 'Rondas'})
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={connectionStatus === 'creating'}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-serif font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{connectionStatus === 'creating' ? ui.multiplayer.creatingRoom : ui.multiplayer.createRoomBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UNIRSE A SALA */}
          {activeTab === 'join' && (
            <div className="w-full max-w-xl casino-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30">
              <div className="space-y-2 text-center">
                <label className="text-xs font-serif font-bold uppercase tracking-widest text-amber-300 block">
                  {ui.multiplayer.roomCodeLabel}
                </label>
                <p className="text-xs font-serif text-slate-400">
                  {isEn ? 'Enter the unique 6-character room code provided by the host' : 'Introduce el código único de sala proporcionado por el anfitrión'}
                </p>
                <input
                  type="text"
                  maxLength={10}
                  value={inputRoomCode}
                  onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                  placeholder={ui.multiplayer.roomCodePlaceholder}
                  className="w-full bg-black/80 border-2 border-amber-500/40 rounded-2xl px-6 py-4 text-center text-2xl font-mono font-black tracking-widest text-amber-300 uppercase focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition shadow-inner"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={connectionStatus === 'joining'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-serif font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wifi className="w-4 h-4" />
                <span>{connectionStatus === 'joining' ? ui.multiplayer.joiningRoom : ui.multiplayer.joinRoomBtn}</span>
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-xs font-serif text-slate-500 py-2">
          {isEn ? 'P2P Multiplayer compatible with local networks and Internet' : 'Multijugador P2P compatible con redes locales e Internet'}
        </footer>
      </div>
    );
  }

  // PANTALLA 2: SALA DE ESPERA ACTIVA (LOBBY)
  const teamASlots = lobbySlots.filter(s => s.team === 'teamA');
  const teamBSlots = lobbySlots.filter(s => s.team === 'teamB');
  const hasAnyEmptySlot = lobbySlots.some(s => !s.isHuman && !s.isBot);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between p-3 sm:p-6 relative select-none">
      {/* Barra Superior de la Sala */}
      <header className="max-w-5xl w-full mx-auto casino-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveLobby}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/90 border border-amber-500/20 hover:border-amber-400 text-slate-400 hover:text-white transition cursor-pointer"
            title={ui.multiplayer.leaveRoom}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-serif font-black text-amber-400 tracking-wider">
                {isEn ? 'Multiplayer Room' : 'Sala Multijugador'}
              </span>
              <span className="text-[10px] bg-black/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-serif font-bold">
                {modeConfig.name} • {currentTimeConfig?.text || currentTimeConfig?.label} • {isEn ? 'Duration' : 'Duración'} {currentDuration?.name} ({selectedRhythm} {isEn ? 'Rounds' : 'Rondas'})
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-widest text-gold-gradient">
                {roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-amber-500/25 hover:border-amber-400 text-slate-300 hover:text-amber-200 transition text-xs flex items-center gap-1 font-serif font-semibold cursor-pointer"
                title={ui.multiplayer.copyCode}
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden sm:inline">{copiedCode ? ui.multiplayer.copiedCode : ui.multiplayer.copyCode}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-amber-500/25 hover:border-amber-400 text-slate-300 hover:text-amber-200 transition text-xs flex items-center gap-1 font-serif font-semibold cursor-pointer"
                title={ui.multiplayer.copyLink}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden sm:inline">{copiedLink ? ui.multiplayer.copiedLink : ui.multiplayer.copyLink}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rol y estado */}
        <div className="flex items-center gap-3">
          <LanguageToggle compact />
          <div className="text-right">
            <span className="text-[10px] uppercase font-serif font-bold text-slate-400 block">{isEn ? 'Your Role' : 'Tu Rol'}</span>
            <span className="text-xs font-serif font-black text-amber-300 flex items-center justify-end gap-1">
              {isHost && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isHost ? (isEn ? 'Host Commander' : 'Comandante Anfitrión') : (isEn ? 'Guest Commander' : 'Comandante Invitado')}</span>
              <span className="font-mono text-emerald-400">({mySlotId})</span>
            </span>
          </div>

          {isHost && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleFillAllBots}
                className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-amber-500/25 hover:border-amber-400 text-amber-200 text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title={hasAnyEmptySlot ? (isEn ? 'Fill empty slots with Bots' : 'Rellenar huecos vacíos con Bots') : (isEn ? 'Clear all Bots' : 'Vaciar todos los Bots')}
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>{hasAnyEmptySlot ? (isEn ? 'Fill with Bots' : 'Rellenar con Bots') : (isEn ? 'Clear Bots' : 'Vaciar Bots')}</span>
              </button>

              <button
                onClick={handleHostStartMatch}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-serif font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition cursor-pointer hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{ui.multiplayer.startGameBtn}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Alerta de Error o Aviso en la Sala */}
      {errorMessage && (
        <div className="max-w-5xl w-full mx-auto mt-3 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-200 font-serif flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white p-1 rounded hover:bg-rose-900/40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Distribución de Escuadrones (Equipo A vs Equipo B) */}
      <main className="max-w-5xl w-full mx-auto my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* EQUIPO A (ALIADOS) */}
        <div className="casino-panel border-t-2 border-t-emerald-400/80 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <h3 className="font-serif font-black text-emerald-400 text-base uppercase tracking-wider">
                  {ui.multiplayer.teamALabel}
                </h3>
              </div>
              <span className="text-xs font-serif font-bold text-slate-300">
                {teamASlots.filter(s => s.isHuman).length} {isEn ? 'Humans' : 'Humanos'} / {teamASlots.length} {isEn ? 'Slots' : 'Puestos'}
              </span>
            </div>

            <div className="space-y-2.5">
              {teamASlots.map((slot) => {
                const isMe = slot.slotId === mySlotId;
                const isEmpty = !slot.isHuman && !slot.isBot;
                return (
                  <div
                    key={slot.slotId}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isMe
                        ? 'bg-emerald-950/40 border-2 border-emerald-400 ring-2 ring-emerald-400/30'
                        : slot.isHuman
                        ? 'bg-black/60 border-amber-500/20'
                        : slot.isBot
                        ? 'bg-black/40 border-amber-500/20'
                        : 'bg-black/25 border-dashed border-amber-500/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-serif font-black border ${
                        slot.isHuman
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : slot.isBot
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-black/60 text-slate-600 border-amber-500/10'
                      }`}>
                        {slot.isHuman ? (
                          <User className="w-4 h-4" />
                        ) : slot.isBot ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4 opacity-40" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          {isEmpty ? (
                            <strong className="text-xs text-slate-500 font-serif italic">{isEn ? 'Empty Slot' : 'Puesto Vacío'}</strong>
                          ) : (
                            <strong className={`text-xs font-serif ${slot.isBot ? 'text-amber-200' : 'text-slate-100'}`}>
                              {slot.playerName}
                            </strong>
                          )}

                          {slot.isHost && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-serif font-black uppercase">
                              Host
                            </span>
                          )}
                          {slot.isBot && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-serif font-bold uppercase">
                              {isEn ? 'AI Bot' : 'IA Bot'}
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[9px] bg-emerald-500 text-stone-950 px-1.5 py-0.5 rounded font-serif font-black uppercase">
                              {isEn ? 'You' : 'Tú'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-serif">
                          {slot.label} {isEmpty && (isEn ? '• Waiting for commander or bot' : '• Esperando comandante o bot')}
                        </span>
                      </div>
                    </div>

                    {/* Acciones de puesto */}
                    <div className="flex items-center gap-1.5">
                      {!slot.isHuman && !isMe && (
                        <button
                          onClick={() => {
                            if (isHost) {
                              handleMoveClientSlot(mp.myPeerId, slot.slotId);
                            } else {
                              mp.sendToHost({ type: 'SELECT_SLOT', slotId: slot.slotId });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 text-xs font-serif font-bold transition cursor-pointer shadow-sm"
                        >
                          {ui.multiplayer.takeSlot}
                        </button>
                      )}

                      {isHost && !slot.isHuman && (
                        <button
                          onClick={() => handleToggleBotSlot(slot.slotId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-serif font-bold border transition cursor-pointer ${
                            slot.isBot
                              ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800/60'
                              : 'bg-black/60 hover:bg-black/90 text-amber-300 border-amber-500/30'
                          }`}
                          title={slot.isBot ? (isEn ? 'Empty this slot' : 'Vaciar este puesto') : (isEn ? 'Assign a Bot to this slot' : 'Asignar un Bot a este puesto')}
                        >
                          {slot.isBot ? (isEn ? 'Remove Bot' : 'Quitar Bot') : (isEn ? '+ Add Bot' : '+ Añadir Bot')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/15 text-[11px] text-slate-400 font-serif flex items-center justify-between">
            <span>{isEn ? 'Initiative: Determined in Round 1' : 'Iniciativa: Determinada en Ronda 1'}</span>
            <span className="text-emerald-400 font-bold">{isEn ? 'Allied Flank' : 'Flanco Aliado'}</span>
          </div>
        </div>

        {/* EQUIPO B (RIVALES) */}
        <div className="casino-panel border-t-2 border-t-rose-500/80 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
                <h3 className="font-serif font-black text-rose-400 text-base uppercase tracking-wider">
                  {ui.multiplayer.teamBLabel}
                </h3>
              </div>
              <span className="text-xs font-serif font-bold text-slate-300">
                {teamBSlots.filter(s => s.isHuman).length} {isEn ? 'Humans' : 'Humanos'} / {teamBSlots.length} {isEn ? 'Slots' : 'Puestos'}
              </span>
            </div>

            <div className="space-y-2.5">
              {teamBSlots.map((slot) => {
                const isMe = slot.slotId === mySlotId;
                const isEmpty = !slot.isHuman && !slot.isBot;
                return (
                  <div
                    key={slot.slotId}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isMe
                        ? 'bg-rose-950/40 border-2 border-rose-500 ring-2 ring-rose-400/30'
                        : slot.isHuman
                        ? 'bg-black/60 border-amber-500/20'
                        : slot.isBot
                        ? 'bg-black/40 border-amber-500/20'
                        : 'bg-black/25 border-dashed border-amber-500/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-serif font-black border ${
                        slot.isHuman
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : slot.isBot
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-black/60 text-slate-600 border-amber-500/10'
                      }`}>
                        {slot.isHuman ? (
                          <User className="w-4 h-4" />
                        ) : slot.isBot ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4 opacity-40" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          {isEmpty ? (
                            <strong className="text-xs text-slate-500 font-serif italic">{isEn ? 'Empty Slot' : 'Puesto Vacío'}</strong>
                          ) : (
                            <strong className={`text-xs font-serif ${slot.isBot ? 'text-amber-200' : 'text-slate-100'}`}>
                              {slot.playerName}
                            </strong>
                          )}

                          {slot.isBot && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-serif font-bold uppercase">
                              {isEn ? 'AI Bot' : 'IA Bot'}
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[9px] bg-rose-500 text-stone-950 px-1.5 py-0.5 rounded font-serif font-black uppercase">
                              {isEn ? 'You' : 'Tú'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-serif">
                          {slot.label} {isEmpty && (isEn ? '• Waiting for commander or bot' : '• Esperando comandante o bot')}
                        </span>
                      </div>
                    </div>

                    {/* Acciones de puesto */}
                    <div className="flex items-center gap-1.5">
                      {!slot.isHuman && !isMe && (
                        <button
                          onClick={() => {
                            if (isHost) {
                              handleMoveClientSlot(mp.myPeerId, slot.slotId);
                            } else {
                              mp.sendToHost({ type: 'SELECT_SLOT', slotId: slot.slotId });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 text-xs font-serif font-bold transition cursor-pointer shadow-sm"
                        >
                          {ui.multiplayer.takeSlot}
                        </button>
                      )}

                      {isHost && !slot.isHuman && (
                        <button
                          onClick={() => handleToggleBotSlot(slot.slotId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-serif font-bold border transition cursor-pointer ${
                            slot.isBot
                              ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800/60'
                              : 'bg-black/60 hover:bg-black/90 text-amber-300 border-amber-500/30'
                          }`}
                          title={slot.isBot ? (isEn ? 'Empty this slot' : 'Vaciar este puesto') : (isEn ? 'Assign a Bot to this slot' : 'Asignar un Bot a este puesto')}
                        >
                          {slot.isBot ? (isEn ? 'Remove Bot' : 'Quitar Bot') : (isEn ? '+ Add Bot' : '+ Añadir Bot')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/15 text-[11px] text-slate-400 font-serif flex items-center justify-between">
            <span>{isEn ? 'Initiative: Determined in Round 1' : 'Iniciativa: Determinada en Ronda 1'}</span>
            <span className="text-rose-400 font-bold">{isEn ? 'Rival Flank' : 'Flanco Rival'}</span>
          </div>
        </div>
      </main>

      {/* Barra Inferior: Chat Táctico y Notificaciones */}
      <footer className="max-w-5xl w-full mx-auto casino-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="w-full sm:w-1/2 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-serif font-bold text-amber-300 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>{ui.multiplayer.chatTitle}</span>
          </div>

          <div className="h-16 overflow-y-auto bg-black/70 p-2.5 rounded-xl border border-amber-500/20 text-[11px] font-serif space-y-1 mb-2">
            {chatMessages.length === 0 ? (
              <span className="text-slate-500 italic">{isEn ? 'No radio transmissions in this room yet...' : 'Sin transmisiones de radio en esta sala aún...'}</span>
            ) : (
              chatMessages.map((m, idx) => (
                <div key={idx} className="leading-tight">
                  <strong className={m.senderName === 'Sistema' || m.senderName === 'System' ? 'text-amber-300' : 'text-slate-200'}>
                    {m.senderName}:
                  </strong>{' '}
                  <span className="text-slate-300">{m.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={ui.multiplayer.chatPlaceholder}
              className="flex-1 bg-black/80 border border-amber-500/25 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-serif focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold transition cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Resumen de inicio */}
        <div className="w-full sm:w-auto text-center sm:text-right font-serif">
          {isHost ? (
            <div className="text-xs text-slate-300">
              <span className="text-amber-300 font-bold block mb-1">
                {isEn ? 'Ready for combat?' : '¿Todo listo para el combate?'}
              </span>
              {isEn ? 'Click Launch Match! to deal troops.' : 'Haz clic en ¡Iniciar Guerra! para comenzar.'}
            </div>
          ) : (
            <div className="text-xs text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">
                {isEn ? 'Connected to salon' : 'Conectado a la sala'}
              </span>
              {isEn ? 'Waiting for host to start match...' : 'Esperando a que el anfitrión inicie la partida...'}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
