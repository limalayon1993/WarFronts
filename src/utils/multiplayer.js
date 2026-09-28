import { Peer } from 'peerjs';

/**
 * Gestor de Red P2P WebRTC para Multijugador de Frentes de Guerra.
 * Permite partidas en tiempo real sin necesidad de configurar servidores ni abrir puertos.
 */

// Prefijo único para evitar colisiones en la red pública de PeerJS
const PEER_PREFIX = 'wf-v16-';

export function formatRoomCode(code) {
  if (!code) return '';
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return clean.startsWith('WF') ? clean : `WF-${clean}`;
}

export function cleanRoomCode(code) {
  if (!code) return '';
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^WF/, '');
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WF-${result}`;
}

class MultiplayerManager {
  constructor() {
    this.peer = null;
    this.connections = new Map(); // Para el Host: peerId -> DataConnection
    this.hostConnection = null;   // Para el Cliente: conexión hacia el Host
    this.isHost = false;
    this.roomCode = null;
    this.myPeerId = null;
    this.myPlayerId = null;       // 'A1', 'A2', 'B1', etc.
    this.myPlayerName = '';
    this.listeners = new Map();
  }

  // Sistema de suscripción a eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  /**
   * Crear Sala como Anfitrión (Host)
   */
  async createRoom(roomCode, hostPlayerName, gameMode, rhythmRounds) {
    this.cleanup();
    this.isHost = true;
    this.roomCode = formatRoomCode(roomCode);
    this.myPlayerName = hostPlayerName || 'Comandante Host';
    const targetPeerId = `${PEER_PREFIX}${cleanRoomCode(this.roomCode)}`;

    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(targetPeerId, {
          debug: 1,
        });

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          this.myPlayerId = 'A1'; // El host por defecto es el Capitán del Equipo A
          resolve({ roomCode: this.roomCode, peerId: id });
        });

        this.peer.on('connection', (conn) => {
          this.handleIncomingConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.error('[Multiplayer Host Error]', err);
          if (err.type === 'unavailable-id') {
            reject(new Error('El código de sala ya está en uso. Prueba con otro código.'));
          } else {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Unirse a una Sala existente como Invitado (Client)
   */
  async joinRoom(roomCode, playerName) {
    this.cleanup();
    this.isHost = false;
    this.roomCode = formatRoomCode(roomCode);
    this.myPlayerName = playerName || 'Comandante Invitado';
    const targetHostPeerId = `${PEER_PREFIX}${cleanRoomCode(this.roomCode)}`;

    return new Promise((resolve, reject) => {
      try {
        // Generar un ID de peer aleatorio para el cliente
        this.peer = new Peer({
          debug: 1,
        });

        this.peer.on('open', (myId) => {
          this.myPeerId = myId;

          const conn = this.peer.connect(targetHostPeerId, {
            reliable: true,
          });

          this.hostConnection = conn;

          conn.on('open', () => {
            // Solicitar unirse enviando nombre
            conn.send({
              type: 'REQUEST_JOIN',
              name: this.myPlayerName,
            });
            resolve({ roomCode: this.roomCode, peerId: myId });
          });

          conn.on('data', (data) => {
            this.handleMessageFromHost(data);
          });

          conn.on('close', () => {
            this.emit('disconnected', 'La conexión con el anfitrión se ha cerrado.');
          });

          conn.on('error', (err) => {
            console.error('[Client Conn Error]', err);
            reject(new Error('No se pudo conectar con la sala. Verifica el código.'));
          });
        });

        this.peer.on('error', (err) => {
          console.error('[Client Peer Error]', err);
          reject(new Error('Error de conexión P2P. Asegúrate de tener conexión a Internet.'));
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Manejo de conexiones entrantes hacia el Host
   */
  handleIncomingConnection(conn) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      this.handleMessageFromClient(conn, data);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.emit('clientDisconnected', conn.peer);
    });

    conn.on('error', (err) => {
      console.warn('[Host Client Conn Error]', err);
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Mensajes recibidos por el Host desde un Cliente
   */
  handleMessageFromClient(conn, data) {
    switch (data.type) {
      case 'REQUEST_JOIN':
        this.emit('clientJoinRequest', {
          peerId: conn.peer,
          name: data.name,
          conn,
        });
        break;

      case 'SELECT_SLOT':
        this.emit('clientSelectSlot', {
          peerId: conn.peer,
          slotId: data.slotId,
        });
        break;

      case 'PLAY_CARD':
        this.emit('clientPlayCard', {
          peerId: conn.peer,
          slotId: data.slotId,
          cardId: data.cardId,
          frontKey: data.frontKey,
          asShadow: data.asShadow,
        });
        break;

      case 'PLAYER_READY':
        this.emit('clientPlayerReady', {
          peerId: conn.peer,
          slotId: data.slotId,
          isReady: data.isReady,
        });
        break;

      case 'CHAT':
        this.emit('chatMessage', {
          senderName: data.senderName,
          text: data.text,
          team: data.team,
        });
        // Reenviar a todos los clientes
        this.broadcast({
          type: 'CHAT',
          senderName: data.senderName,
          text: data.text,
          team: data.team,
        });
        break;

      default:
        break;
    }
  }

  /**
   * Mensajes recibidos por un Cliente desde el Host
   */
  handleMessageFromHost(data) {
    switch (data.type) {
      case 'LOBBY_STATE':
        this.emit('lobbyState', data.lobby);
        break;

      case 'ASSIGNED_SLOT':
        this.myPlayerId = data.slotId;
        this.emit('slotAssigned', data.slotId);
        break;

      case 'GAME_START':
        this.emit('gameStart', data.gameData || data);
        break;

      case 'GAME_SYNC':
        this.emit('gameSync', data.gameState);
        break;

      case 'READY_UPDATE':
        this.emit('readyUpdate', data.readySlotIds);
        break;

      case 'ROUND_OVER':
        this.emit('roundOver', data);
        break;

      case 'GAME_OVER':
        this.emit('gameOver', data);
        break;

      case 'PENALTY_NOTICE':
        this.emit('penaltyNotice', data.notice);
        break;

      case 'CHAT':
        this.emit('chatMessage', {
          senderName: data.senderName,
          text: data.text,
          team: data.team,
        });
        break;

      case 'ERROR':
        this.emit('error', data.message);
        break;

      default:
        break;
    }
  }

  /**
   * Enviar un mensaje a todos los clientes conectados (Host -> Clientes)
   */
  broadcast(message) {
    if (!this.isHost) return;
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  /**
   * Enviar mensaje directo a un peer específico
   */
  sendToPeer(peerId, message) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(message);
    }
  }

  /**
   * Enviar mensaje al Host (Cliente -> Host)
   */
  sendToHost(message) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(message);
    }
  }

  /**
   * Enviar chat
   */
  sendChat(text, team = null) {
    const msg = {
      type: 'CHAT',
      senderName: this.myPlayerName,
      text,
      team,
    };
    if (this.isHost) {
      this.emit('chatMessage', msg);
      this.broadcast(msg);
    } else {
      this.sendToHost(msg);
    }
  }

  /**
   * Cierre y limpieza de recursos
   */
  cleanup() {
    if (this.hostConnection) {
      try { this.hostConnection.close(); } catch (_) {}
      this.hostConnection = null;
    }
    this.connections.forEach(conn => {
      try { conn.close(); } catch (_) {}
    });
    this.connections.clear();

    if (this.peer) {
      try { this.peer.destroy(); } catch (_) {}
      this.peer = null;
    }

    this.isHost = false;
    this.roomCode = null;
    this.myPeerId = null;
    this.myPlayerId = null;
  }
}

export const mp = new MultiplayerManager();

/**
 * Sanitiza el estado del juego para un jugador específico:
 * - Oculta la mano de los rivales y compañeros.
 * - OCULTA LAS CARTAS SOMBRA: Si no es el dueño de la carta y la ronda está activa,
 *   se censura el valor y el palo ('?') para impedir trampas mediante inspección de red o DOM.
 */
export function sanitizeGameStateForPlayer(fullGameState, targetSlotId) {
  const isRoundOver = fullGameState.phase === 'roundOver' || fullGameState.phase === 'gameOver';

  // Sanitizar frentes
  const sanitizedFronts = {};
  ['left', 'center', 'right'].forEach(frontKey => {
    const front = fullGameState.fronts[frontKey];
    sanitizedFronts[frontKey] = {
      teamA: front.teamA.map(card => sanitizeCard(card, targetSlotId, isRoundOver)),
      teamB: front.teamB.map(card => sanitizeCard(card, targetSlotId, isRoundOver)),
    };
  });

  // Sanitizar jugadores: cada uno solo ve su propia mano completa
  const sanitizedPlayers = fullGameState.players.map(p => {
    if (p.id === targetSlotId) {
      return p; // Su propia mano completa
    }
    return {
      ...p,
      // Los demás jugadores solo ven el número de cartas en mano, no su contenido
      hand: p.hand.map(c => ({ id: c.id, isHidden: true })),
    };
  });

  return {
    ...fullGameState,
    fronts: sanitizedFronts,
    players: sanitizedPlayers,
  };
}

function sanitizeCard(card, targetSlotId, isRoundOver) {
  if (!card.isShadow || isRoundOver) {
    return card;
  }

  const isOwner = card.playedById === targetSlotId;
  if (isOwner) {
    // El dueño que la lanzó sí la ve, con flag isOwner: true
    return {
      ...card,
      isOwner: true,
    };
  }

  // Ni los rivales ni los compañeros de equipo pueden verla: datos completamente redactados
  return {
    id: card.id,
    isShadow: true,
    isOwner: false,
    playedBy: card.playedBy,
    playedById: card.playedById,
    team: card.team,
    rank: '?',
    suit: 'spades',
    base: 0,
  };
}
