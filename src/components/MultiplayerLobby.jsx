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
} from 'lucide-react';
import {
  GAME_MODES,
  GAME_DURATIONS,
  TEAM_TIMES,
  TEAM_TIME_OPTIONS,
} from '../constants/rules';
import { mp, formatRoomCode, generateRoomCode } from '../utils/multiplayer';

export function MultiplayerLobby({
  onStartMultiplayerGame,
  onBackToMenu,
  initialRoomCode = '',
}) {
  // Estado de conexión: 'idle' | 'creating' | 'joining' | 'inLobby'
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  // Formulario de conexión
  const [activeTab, setActiveTab] = useState(initialRoomCode ? 'join' : 'create');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('wf_player_name') || 'Comandante');
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
              playerName: 'Vacío',
              isHuman: false,
              isBot: false,
            };
          }
          return s;
        });
        broadcastLobbyState(updated, selectedMode, selectedRhythm, false);
        mp.sendChat(`El comandante ${found.playerName} (${found.slotId}) se ha desconectado.`);
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
  }, [onStartMultiplayerGame, lobbySlots, selectedMode, selectedRhythm, selectedTimeSpeed, autoFillBots]);

  // Inicializar slots de la sala (todos los puestos no-host empiezan vacíos)
  const buildInitialSlots = (modeId, hostName, fillWithBots = false) => {
    const mode = GAME_MODES[modeId] || GAME_MODES['2v2'];
    const slots = [];
    const teamSize = mode.teamSize;

    // Equipo A
    for (let i = 1; i <= teamSize; i++) {
      slots.push({
        slotId: `A${i}`,
        label: i === 1 ? 'Capitán Aliado (A1)' : `Aliado A${i}`,
        team: 'teamA',
        isHost: i === 1,
        peerId: i === 1 ? mp.myPeerId : null,
        playerName: i === 1 ? hostName : (fillWithBots ? `Bot A${i}` : 'Vacío'),
        isBot: i !== 1 && fillWithBots,
        isHuman: i === 1,
      });
    }

    // Equipo B
    for (let i = 1; i <= teamSize; i++) {
      slots.push({
        slotId: `B${i}`,
        label: i === 1 ? 'Capitán Rival (B1)' : `Rival B${i}`,
        team: 'teamB',
        isHost: false,
        peerId: null,
        playerName: fillWithBots ? `Bot B${i}` : 'Vacío',
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
        { senderName: 'Sistema', text: `¡Sala ${res.roomCode} creada! Comparte el código con tus compañeros y rivales.` }
      ]);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo crear la sala.');
      setConnectionStatus('idle');
    }
  };

  // Unirse a Sala (Client)
  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) {
      setErrorMessage('Por favor introduce un código de sala válido.');
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
        { senderName: 'Sistema', text: `Conectado a la sala ${res.roomCode}. Esperando asignación de puesto...` }
      ]);
    } catch (err) {
      setErrorMessage(err.message || 'Error al conectar a la sala.');
      setConnectionStatus('idle');
    }
  };

  // Host: Asignar un cliente que acaba de unirse a un slot libre
  const handleAssignClientToSlot = (peerId, clientName, conn) => {
    setLobbySlots(prevSlots => {
      // Buscar el primer slot disponible (que sea bot o vacío)
      const targetIndex = prevSlots.findIndex(s => !s.isHuman);
      if (targetIndex === -1) {
        conn.send({ type: 'ERROR', message: 'La sala está completa.' });
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

      mp.sendChat(`¡${clientName} se ha unido a la sala en el puesto ${updated[targetIndex].label}!`);
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
        playerName: autoFillBots ? `Bot ${updated[currentIdx].slotId}` : 'Vacío',
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
            playerName: nextIsBot ? `Bot ${slot.slotId}` : 'Vacío',
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
              playerName: 'Vacío',
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
        `Hay ${emptySlots.length} puesto(s) vacío(s). Espera a más jugadores, pulsa '+ Bot' en los huecos o usa el botón 'Rellenar con Bots' para poder iniciar.`
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

  const modeConfig = GAME_MODES[selectedMode] || GAME_MODES['2v2'];
  const modeTimes = TEAM_TIMES[selectedMode] || TEAM_TIMES['2v2'];
  const currentTimeConfig = modeTimes[selectedTimeSpeed] || modeTimes['medio'];
  const currentDuration = GAME_DURATIONS.find(d => d.rounds === selectedRhythm) || GAME_DURATIONS[1];

  // PANTALLA 1: CONEXIÓN O CREACIÓN (Si aún no está en sala)
  if (connectionStatus !== 'inLobby') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative select-none">
        {/* Cabecera */}
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-bold border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Multijugador P2P</div>
              <div className="text-xs text-slate-400">Frentes de Guerra Online</div>
            </div>
          </div>
        </header>

        {/* Cuadro Central */}
        <main className="max-w-md w-full mx-auto my-auto p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wide flex items-center justify-center gap-2">
              <Swords className="w-6 h-6 text-amber-400" />
              <span>Guerra en Red</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Conexión directa jugador a jugador sin servidores externos.
            </p>
          </div>

          {/* Nombre de Jugador */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Tu Nombre de Comandante
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                maxLength={20}
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Comandante Antonio"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 font-semibold focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Selector de Pestañas: Crear o Unirse */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'create'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Nueva Sala
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'join'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unirse a Sala
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          {/* TAB 1: CREAR SALA */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Formato de Batalla
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(GAME_MODES).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                        selectedMode === mode.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <strong className="block text-slate-200">{mode.name}</strong>
                      <span className="text-[10px] text-slate-500">{mode.totalPlayers} jugadores</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de Tiempo de Equipo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tiempo de Equipo (Reloj Compartido)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Por ronda</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TEAM_TIME_OPTIONS.map((t) => {
                    const speedCfg = modeTimes[t.id];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTimeSpeed(t.id)}
                        className={`p-2 rounded-lg border text-center transition ${
                          selectedTimeSpeed === t.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-1 ring-amber-400/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{t.name}</div>
                        <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">{speedCfg?.text || speedCfg?.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selección de Duración de la Partida */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Duración de la Partida (Rondas)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GAME_DURATIONS.map((dur) => (
                    <button
                      key={dur.rounds}
                      type="button"
                      onClick={() => setSelectedRhythm(dur.rounds)}
                      className={`p-2 rounded-lg border text-center text-xs font-bold transition ${
                        selectedRhythm === dur.rounds
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-1 ring-amber-400/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>{dur.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{dur.rounds} rondas</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={connectionStatus === 'creating'}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{connectionStatus === 'creating' ? 'Creando Sala...' : 'Crear Sala Táctica'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: UNIRSE A SALA */}
          {activeTab === 'join' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Código de Sala
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={inputRoomCode}
                  onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                  placeholder="Ej. WF-A892"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-amber-400 uppercase focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={connectionStatus === 'joining'}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
              >
                <Wifi className="w-4 h-4" />
                <span>{connectionStatus === 'joining' ? 'Conectando...' : 'Unirse a la Batalla'}</span>
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-slate-500">
          Multijugador P2P compatible con redes locales e Internet
        </footer>
      </div>
    );
  }

  // PANTALLA 2: SALA DE ESPERA ACTIVA (LOBBY)
  const teamASlots = lobbySlots.filter(s => s.team === 'teamA');
  const teamBSlots = lobbySlots.filter(s => s.team === 'teamB');
  const hasAnyEmptySlot = lobbySlots.some(s => !s.isHuman && !s.isBot);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-6 relative select-none">
      {/* Barra Superior de la Sala */}
      <header className="max-w-5xl w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveLobby}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Salir de la sala"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black text-amber-400 tracking-wider">
                Sala Multijugador
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono font-bold">
                {modeConfig.name} • {currentTimeConfig?.text || currentTimeConfig?.label} • Duración {currentDuration?.name} ({selectedRhythm} Rondas)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-100">
                {roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 font-semibold"
                title="Copiar código de sala"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 font-semibold"
                title="Copiar enlace de invitación"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedLink ? '¡Enlace copiado!' : 'Invitar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rol y estado */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tu Rol</span>
            <span className="text-xs font-black text-emerald-400 font-mono">
              {isHost ? '★ Anfitrión' : 'Comandante Invitado'} ({mySlotId})
            </span>
          </div>

          {isHost && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleFillAllBots}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                title={hasAnyEmptySlot ? 'Rellenar huecos vacíos con Bots' : 'Vaciar todos los Bots'}
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>{hasAnyEmptySlot ? 'Rellenar con Bots' : 'Vaciar Bots'}</span>
              </button>

              <button
                onClick={handleHostStartMatch}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>¡Comenzar Batalla!</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Alerta de Error o Aviso en la Sala */}
      {errorMessage && (
        <div className="max-w-5xl w-full mx-auto mt-3 p-3 bg-amber-950/70 border border-amber-600/70 rounded-xl text-xs text-amber-200 font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-400 hover:text-white font-bold ml-2 text-sm px-1.5 py-0.5 rounded hover:bg-amber-900/40"
          >
            ✕
          </button>
        </div>
      )}

      {/* Distribución de Escuadrones (Equipo A vs Equipo B) */}
      <main className="max-w-5xl w-full mx-auto my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* EQUIPO A (ALIADOS) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-black text-emerald-400 text-base uppercase tracking-wider">
                  Equipo Aliado (A)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {teamASlots.filter(s => s.isHuman).length} Humanos / {teamASlots.length} Puestos
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
                        ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/40'
                        : slot.isHuman
                        ? 'bg-slate-950/80 border-slate-800'
                        : slot.isBot
                        ? 'bg-slate-900/60 border-amber-500/30'
                        : 'bg-slate-950/30 border-dashed border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono border ${
                        slot.isHuman
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : slot.isBot
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
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
                            <strong className="text-xs text-slate-500 italic">Puesto Vacío</strong>
                          ) : (
                            <strong className={`text-xs ${slot.isBot ? 'text-amber-200' : 'text-slate-100'}`}>
                              {slot.playerName}
                            </strong>
                          )}

                          {slot.isHost && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 rounded font-black uppercase">
                              Host
                            </span>
                          )}
                          {slot.isBot && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-bold uppercase">
                              IA Bot
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 rounded font-black uppercase">
                              Tú
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {slot.label} {isEmpty && '• Esperando jugador o bot'}
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 text-xs font-bold transition"
                        >
                          Ocupar
                        </button>
                      )}

                      {isHost && !slot.isHuman && (
                        <button
                          onClick={() => handleToggleBotSlot(slot.slotId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            slot.isBot
                              ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-800/50'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                          title={slot.isBot ? 'Vaciar este puesto' : 'Asignar un Bot a este puesto'}
                        >
                          {slot.isBot ? 'Quitar Bot' : '+ Añadir Bot'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Iniciativa: Determinada en Ronda 1</span>
            <span className="text-emerald-400 font-bold">Flanco Aliado</span>
          </div>
        </div>

        {/* EQUIPO B (RIVALES) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400 animate-pulse" />
                <h3 className="font-black text-rose-400 text-base uppercase tracking-wider">
                  Equipo Rival (B)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {teamBSlots.filter(s => s.isHuman).length} Humanos / {teamBSlots.length} Puestos
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
                        ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-400/40'
                        : slot.isHuman
                        ? 'bg-slate-950/80 border-slate-800'
                        : slot.isBot
                        ? 'bg-slate-900/60 border-amber-500/30'
                        : 'bg-slate-950/30 border-dashed border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono border ${
                        slot.isHuman
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : slot.isBot
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
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
                            <strong className="text-xs text-slate-500 italic">Puesto Vacío</strong>
                          ) : (
                            <strong className={`text-xs ${slot.isBot ? 'text-amber-200' : 'text-slate-100'}`}>
                              {slot.playerName}
                            </strong>
                          )}

                          {slot.isBot && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-bold uppercase">
                              IA Bot
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[9px] bg-rose-500 text-slate-950 px-1 rounded font-black uppercase">
                              Tú
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {slot.label} {isEmpty && '• Esperando jugador o bot'}
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
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 text-xs font-bold transition"
                        >
                          Ocupar
                        </button>
                      )}

                      {isHost && !slot.isHuman && (
                        <button
                          onClick={() => handleToggleBotSlot(slot.slotId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            slot.isBot
                              ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-800/50'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                          title={slot.isBot ? 'Vaciar este puesto' : 'Asignar un Bot a este puesto'}
                        >
                          {slot.isBot ? 'Quitar Bot' : '+ Añadir Bot'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Iniciativa: Determinada en Ronda 1</span>
            <span className="text-rose-400 font-bold">Flanco Rival</span>
          </div>
        </div>
      </main>

      {/* Barra Inferior: Chat Táctico y Notificaciones */}
      <footer className="max-w-5xl w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="w-full sm:w-1/2 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 mb-1">
            <MessageSquare className="w-3 h-3 text-amber-400" />
            <span>Chat de Sala</span>
          </div>

          <div className="h-16 overflow-y-auto bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] space-y-1 mb-2">
            {chatMessages.length === 0 ? (
              <span className="text-slate-600 italic">No hay mensajes aún en la sala...</span>
            ) : (
              chatMessages.map((m, idx) => (
                <div key={idx} className="leading-tight">
                  <strong className={m.senderName === 'Sistema' ? 'text-amber-400' : 'text-slate-300'}>
                    {m.senderName}:
                  </strong>{' '}
                  <span className="text-slate-400">{m.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Mensaje a la sala..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Resumen de inicio */}
        <div className="w-full sm:w-auto text-center sm:text-right">
          {isHost ? (
            <div className="text-xs text-slate-400">
              <span className="text-amber-400 font-bold block mb-1">
                ¿Todo listo para el combate?
              </span>
              Haz clic en <strong>¡Comenzar Batalla!</strong> para repartir las tropas.
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400 font-bold block mb-1">
                Conectado a la sala
              </span>
              Esperando a que el anfitrión inicie la partida...
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
