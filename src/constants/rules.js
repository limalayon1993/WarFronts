export const SUITS = {
  hearts: { key: 'hearts', symbol: '♥', name: 'Corazones', color: 'text-rose-500' },
  diamonds: { key: 'diamonds', symbol: '♦', name: 'Diamantes', color: 'text-rose-500' },
  clubs: { key: 'clubs', symbol: '♣', name: 'Tréboles', color: 'text-slate-100' },
  spades: { key: 'spades', symbol: '♠', name: 'Picas', color: 'text-slate-100' },
};

export const CARD_VALUES = [
  { rank: '2', base: 2 },
  { rank: '3', base: 3 },
  { rank: '4', base: 4 },
  { rank: '5', base: 5 },
  { rank: '6', base: 6 },
  { rank: '7', base: 7 },
  { rank: '8', base: 8 },
  { rank: '9', base: 9 },
  { rank: '10', base: 10 },
  { rank: 'J', base: 11, label: 'Jota' },
  { rank: 'Q', base: 12, label: 'Reina' },
  { rank: 'K', base: 13, label: 'Rey' },
  { rank: 'A', base: 14, label: 'As' },
];

export const FRONTS = [
  { id: 'left', name: 'Frente Izquierdo', subtitle: 'Flanco Oeste' },
  { id: 'center', name: 'Frente Central', subtitle: 'Línea Principal' },
  { id: 'right', name: 'Frente Derecho', subtitle: 'Flanco Este' },
];

export function getLocalizedSuits(lang = 'es') {
  const isEn = lang === 'en';
  return {
    hearts: { key: 'hearts', symbol: '♥', name: isEn ? 'Hearts' : 'Corazones', color: 'text-rose-500' },
    diamonds: { key: 'diamonds', symbol: '♦', name: isEn ? 'Diamonds' : 'Diamantes', color: 'text-rose-500' },
    clubs: { key: 'clubs', symbol: '♣', name: isEn ? 'Clubs' : 'Tréboles', color: 'text-slate-100' },
    spades: { key: 'spades', symbol: '♠', name: isEn ? 'Spades' : 'Picas', color: 'text-slate-100' },
  };
}

export function getLocalizedFronts(lang = 'es') {
  const isEn = lang === 'en';
  return [
    { id: 'left', name: isEn ? 'Left Front' : 'Frente Izquierdo', subtitle: isEn ? 'West Flank' : 'Flanco Oeste' },
    { id: 'center', name: isEn ? 'Center Front' : 'Frente Central', subtitle: isEn ? 'Main Line' : 'Línea Principal' },
    { id: 'right', name: isEn ? 'Right Front' : 'Frente Derecho', subtitle: isEn ? 'East Flank' : 'Flanco Este' },
  ];
}

export const CASUAL_TURN_SECONDS = 20;
export const CASUAL_SHADOWS_PER_PLAYER = 1;

export const MATCH_TYPES = {
  competitive: {
    id: 'competitive',
    name: 'Modo Competitivo',
    subtitle: 'Escala Oficial • Economía de Sombras • Reloj Dual',
  },
  casual: {
    id: 'casual',
    name: 'Modo Casual (Party / Amigos)',
    subtitle: 'Escala Comprimida (1-4) • 1 Sombra/Jug • 20s/Turno',
  },
};

export function getLocalizedMatchTypes(lang = 'es') {
  const isEn = lang === 'en';
  return {
    competitive: {
      id: 'competitive',
      name: isEn ? 'Competitive Mode' : 'Modo Competitivo',
      badge: isEn ? 'Official Tournament' : 'Torneo Oficial',
      subtitle: isEn ? 'Official Scale (2-14) • Shadow Economy • Dual Team Clock' : 'Escala Oficial (2-14) • Economía de Sombras • Reloj Dual',
      description: isEn
        ? 'Nominal card values (2-14) and +5/+10/+15/+20 synergies. Shared team shadow economy across rounds, dual chess clock, and cumulative score tiebreaker.'
        : 'Valores nominales (2-14) y sinergias +5/+10/+15/+20. Fondo de sombras compartido con ahorro entre rondas, reloj dual de equipo y desempate por puntos acumulados.',
    },
    casual: {
      id: 'casual',
      name: isEn ? 'Casual Mode (Party / Friends)' : 'Modo Casual (Party / Amigos)',
      badge: isEn ? 'Fast Count & Live Score' : 'Conteo Rápido y Puntos en Vivo',
      subtitle: isEn ? 'Compressed Scale (1-4) • Live Front Score • 1 Shadow/Player • 20s/Turn' : 'Escala Comprimida (1-4) • Marcador en Vivo • 1 Sombra/Jug • 20s/Turno',
      description: isEn
        ? 'Simplified 1-4 card values and rebalanced synergies (Color +1/+3, Pair +3, Straight +4, Trio +6) with live real-time front score counters. 1 personal shadow per player/round, 20s individual turn timer (auto-play on timeout), and direct 2-round overtime tiebreaker.'
        : 'Escala simplificada (1-4 pts) y sinergias rebalanceadas (Color +1/+3, Pareja +3, Escalera +4, Trío +6) con contador de puntos en vivo en cada frente. 1 sombra fija por jugador/ronda, turno individual de 20s (despliegue automático si se agota) y desempate directo por prórroga.',
    },
  };
}

/**
 * Obtiene el valor base de una carta en el Modo Casual ("Escala Comprimida"):
 * - Cartas del 2 al 6 = 1 punto
 * - Cartas del 7 al 10 = 2 puntos
 * - Figuras (J, Q, K) = 3 puntos
 * - As (A) = 4 puntos
 */
export function getCardCasualBase(cardOrBase) {
  const base = typeof cardOrBase === 'object' ? (cardOrBase?.base || 0) : Number(cardOrBase || 0);
  if (base >= 2 && base <= 6) return 1;
  if (base >= 7 && base <= 10) return 2;
  if (base >= 11 && base <= 13) return 3;
  if (base === 14) return 4;
  return 0;
}

/**
 * Determina el frente válido (no saturado) con menor cantidad total de cartas
 * para la infracción por tiempo (Auto-play) en Modo Casual.
 * En caso de empate, prioriza por orden estándar: Izquierdo ('left') -> Central ('center') -> Derecho ('right').
 */
export function findCasualAutoPlayFront(fronts, maxFrontCards = 8) {
  const standardOrder = ['left', 'center', 'right'];
  let bestFrontKey = null;
  let minTotalCards = Infinity;

  for (const frontKey of standardOrder) {
    const front = fronts?.[frontKey];
    if (!front) continue;
    const totalCards = (front.teamA?.length || 0) + (front.teamB?.length || 0);
    if (totalCards < maxFrontCards && totalCards < minTotalCards) {
      minTotalCards = totalCards;
      bestFrontKey = frontKey;
    }
  }
  return bestFrontKey;
}

// Economía de Cartas de Sombra según Reglamento Oficial v2.0 y Guía Rápida v2.0
// Ambos equipos inician la Ronda 1 con 0 sombras en su Fondo de Equipo.
// Al final de la ronda se cobran marcadores según el resultado:
// - Gana: +1 (1v1, 2v2) / +2 (3v3, 4v4)
// - Pierde: +2 (1v1, 2v2) / +3 (3v3) / +4 (4v4)
// - Racha de Derrotas (2 o más consecutivas): +3 (1v1, 2v2) / +4 (3v3) / +5 (4v4)
// - Empate de Ronda: +1 a ambos (1v1, 2v2) / +2 a ambos (3v3, 4v4)
// Los marcadores no utilizados se conservan entre rondas (ahorro continuo).
// La racha de derrotas se reinicia a 0 si se gana (2 o 3 pts) o empata (+1 pt a ambos).
export const SHADOW_ECONOMY = {
  '1v1': { win: 1, loss: 2, streak: 3, tie: 1 },
  '2v2': { win: 1, loss: 2, streak: 3, tie: 1 },
  '3v3': { win: 2, loss: 3, streak: 4, tie: 2 },
  '4v4': { win: 2, loss: 4, streak: 5, tie: 2 },
};

/**
 * Calcula la asignación de Puntos de Ronda según el Reglamento Oficial v2.0 (Escala 1 / 2 / 3 Puntos):
 * - Empate en la Ronda (ej. cada equipo gana 1 frente y el tercero queda Nulo, o los 3 quedan Nulos):
 *   +1 Punto de Ronda para CADA equipo.
 * - Victoria Estándar (ganar 2 de los 3 frentes, o ganar 1 a 0 si hay doble frente nulo):
 *   +2 Puntos de Ronda para el equipo ganador (0 para el perdedor).
 * - Dominio Total / "Pleno" (ganar los 3 frentes simultáneamente):
 *   +3 Puntos de Ronda para el equipo ganador (0 para el perdedor).
 * - Derrota por Tiempo (Caída de Bandera a 00:00):
 *   El equipo rival suma +2 Puntos de Ronda (victoria estándar) de forma directa, salvo que en ese
 *   instante ya tuviera mayor puntuación en los 3 frentes y el rival hubiera jugado todas sus cartas (+3 Puntos).
 */
export function calculateRoundPoints(
  teamAFrontWins = 0,
  teamBFrontWins = 0,
  flagFallTeam = null,
  isFlagFallFullSweep = false
) {
  if (flagFallTeam === 'teamA') {
    const pts = isFlagFallFullSweep ? 3 : 2;
    return {
      teamAPoints: 0,
      teamBPoints: pts,
      roundWinner: 'teamB',
      outcome: 'teamB',
      winType: isFlagFallFullSweep ? 'sweep' : 'flagFall',
    };
  }
  if (flagFallTeam === 'teamB') {
    const pts = isFlagFallFullSweep ? 3 : 2;
    return {
      teamAPoints: pts,
      teamBPoints: 0,
      roundWinner: 'teamA',
      outcome: 'teamA',
      winType: isFlagFallFullSweep ? 'sweep' : 'flagFall',
    };
  }

  if (teamAFrontWins === 3) {
    return {
      teamAPoints: 3,
      teamBPoints: 0,
      roundWinner: 'teamA',
      outcome: 'teamA',
      winType: 'sweep',
    };
  }
  if (teamBFrontWins === 3) {
    return {
      teamAPoints: 0,
      teamBPoints: 3,
      roundWinner: 'teamB',
      outcome: 'teamB',
      winType: 'sweep',
    };
  }

  if (teamAFrontWins > teamBFrontWins) {
    return {
      teamAPoints: 2,
      teamBPoints: 0,
      roundWinner: 'teamA',
      outcome: 'teamA',
      winType: 'standard',
    };
  }
  if (teamBFrontWins > teamAFrontWins) {
    return {
      teamAPoints: 0,
      teamBPoints: 2,
      roundWinner: 'teamB',
      outcome: 'teamB',
      winType: 'standard',
    };
  }

  // Empate en frentes conquistados (ej. 1-1 y 1 Nulo, o 0-0 con 3 Nulos): +1 Punto para CADA equipo
  return {
    teamAPoints: 1,
    teamBPoints: 1,
    roundWinner: 'tie',
    outcome: 'tie',
    winType: 'tie',
  };
}

/**
 * Calcula los ingresos de economía (Marcadores de Sombra) al finalizar una ronda
 * según el reglamento oficial v2.0 (Capítulo 5 y Guía Rápida v2.0):
 * - 1v1 y 2v2: Ganador (+1), Perdedor (+2), Perdedor en racha de 2+ derrotas (+3), Empate de Ronda (+1 a ambos).
 * - 3v3: Ganador (+2), Perdedor (+3), Perdedor en racha de 2+ derrotas (+4), Empate de Ronda (+2 a ambos).
 * - 4v4: Ganador (+2), Perdedor (+4), Perdedor en racha de 2+ derrotas (+5), Empate de Ronda (+2 a ambos).
 * - Reinicio de Racha: Si un equipo que está cobrando el bono máximo de sombras por racha de derrotas
 *   logra ganar una ronda (2 o 3 pts) o empatarla (+1 pt para cada equipo), su racha se reinicia instantáneamente a 0.
 */
export function calculateRoundEconomy(modeId = '2v2', roundWinner = 'tie', teamALossStreak = 0, teamBLossStreak = 0) {
  const econ = SHADOW_ECONOMY[modeId] || SHADOW_ECONOMY['2v2'];

  if (roundWinner === 'teamA') {
    const nextBLossStreak = teamBLossStreak + 1;
    const isBStreak = nextBLossStreak >= 2;
    const teamBEarned = isBStreak ? econ.streak : econ.loss;
    return {
      teamAEarned: econ.win,
      teamBEarned,
      teamANewStreak: 0,
      teamBNewStreak: nextBLossStreak,
      teamAReason: 'win',
      teamBReason: isBStreak ? 'streak' : 'loss',
    };
  }

  if (roundWinner === 'teamB') {
    const nextALossStreak = teamALossStreak + 1;
    const isAStreak = nextALossStreak >= 2;
    const teamAEarned = isAStreak ? econ.streak : econ.loss;
    return {
      teamAEarned,
      teamBEarned: econ.win,
      teamANewStreak: nextALossStreak,
      teamBNewStreak: 0,
      teamAReason: isAStreak ? 'streak' : 'loss',
      teamBReason: 'win',
    };
  }

  // Ronda Nula / Empate: se reinicia la racha para ambos
  return {
    teamAEarned: econ.tie,
    teamBEarned: econ.tie,
    teamANewStreak: 0,
    teamBNewStreak: 0,
    teamAReason: 'tie',
    teamBReason: 'tie',
  };
}

// Modos de juego oficiales según el reglamento v1.6 / v2.0
export const GAME_MODES = {
  '1v1': {
    id: '1v1',
    name: '1 contra 1',
    subtitle: 'Duelo Táctico de Comandantes',
    teamSize: 1,
    handSize: 10,
    decks: 1,
    maxFrontCards: 8,
    startShadows: 0,
    teamShadows: 0,
    shadowsPerPlayer: 0,
    totalPlayers: 2,
    economy: SHADOW_ECONOMY['1v1'],
    description: '1 baraja (52 cartas). 10 cartas por duelista. Economía de sombras continua (inician en 0). Límite de 8 cartas por frente.',
  },
  '2v2': {
    id: '2v2',
    name: '2 contra 2',
    subtitle: 'Escuadrón Táctico por Parejas',
    teamSize: 2,
    handSize: 5,
    decks: 1,
    maxFrontCards: 8,
    startShadows: 0,
    teamShadows: 0,
    shadowsPerPlayer: 0,
    totalPlayers: 4,
    economy: SHADOW_ECONOMY['2v2'],
    description: '1 baraja (52 cartas). 4 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 8 cartas por frente.',
  },
  '3v3': {
    id: '3v3',
    name: '3 contra 3',
    subtitle: 'Batalla de Frente Ampliado',
    teamSize: 3,
    handSize: 5,
    decks: 2,
    maxFrontCards: 12,
    startShadows: 0,
    teamShadows: 0,
    shadowsPerPlayer: 0,
    totalPlayers: 6,
    economy: SHADOW_ECONOMY['3v3'],
    description: '2 barajas combinadas (104 cartas). 6 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 12 cartas por frente.',
  },
  '4v4': {
    id: '4v4',
    name: '4 contra 4',
    subtitle: 'Guerra Total de Ejércitos',
    teamSize: 4,
    handSize: 5,
    decks: 2,
    maxFrontCards: 16,
    startShadows: 0,
    teamShadows: 0,
    shadowsPerPlayer: 0,
    totalPlayers: 8,
    economy: SHADOW_ECONOMY['4v4'],
    description: '2 barajas combinadas (104 cartas). 8 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 16 cartas por frente.',
  },
};

// Duraciones oficiales de la partida según el reglamento v1.6
export const GAME_DURATIONS = [
  { id: 'corta', name: 'Corta', rounds: 4, desc: '4 Rondas', timeEst: '~10 min' },
  { id: 'mediana', name: 'Mediana', rounds: 6, desc: '6 Rondas', timeEst: '~18 min' },
  { id: 'larga', name: 'Larga', rounds: 8, desc: '8 Rondas', timeEst: '~25 min' },
];

// Alias para compatibilidad hacia atrás
export const GAME_RHYTHMS = GAME_DURATIONS;

// Opciones de velocidad de tiempo por equipo
export const TEAM_TIME_OPTIONS = [
  { id: 'rapido', name: 'Rápido', desc: 'Ritmo ágil y dinámico' },
  { id: 'medio', name: 'Medio', desc: 'Equilibrio táctico estándar' },
  { id: 'lento', name: 'Lento', desc: 'Máxima profundidad y cálculo' },
];

export function getLocalizedModes(lang = 'es', gameMode = 'competitive') {
  const isEn = lang === 'en';
  const isCasual = gameMode === 'casual';
  return {
    '1v1': {
      ...GAME_MODES['1v1'],
      name: isEn ? '1 vs 1' : '1 contra 1',
      subtitle: isEn ? 'Tactical Commanders Duel' : 'Duelo Táctico de Comandantes',
      description: isCasual
        ? (isEn
          ? '1 deck (52 cards). 10 cards per player. 1 personal shadow/round. 20s turn clock. Limit of 8 cards per front.'
          : '1 baraja (52 cartas). 10 cartas por duelista. 1 sombra fija/ronda por jugador. Turno de 20s. Límite de 8 cartas por frente.')
        : (isEn
          ? '1 deck (52 cards). 10 cards per player. Continuous shadow economy (start at 0). Limit of 8 cards per front.'
          : GAME_MODES['1v1'].description),
    },
    '2v2': {
      ...GAME_MODES['2v2'],
      name: isEn ? '2 vs 2' : '2 contra 2',
      subtitle: isEn ? 'Tactical Squads by Pairs' : 'Escuadrón Táctico por Parejas',
      description: isCasual
        ? (isEn
          ? '1 deck (52 cards). 4 players, 5 cards each. 1 personal shadow/round. 20s turn clock. Limit of 8 cards per front.'
          : '1 baraja (52 cartas). 4 jugadores, 5 cartas c/u. 1 sombra fija/ronda por jugador. Turno de 20s. Límite de 8 cartas por frente.')
        : (isEn
          ? '1 deck (52 cards). 4 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 8 cards per front.'
          : GAME_MODES['2v2'].description),
    },
    '3v3': {
      ...GAME_MODES['3v3'],
      name: isEn ? '3 vs 3' : '3 contra 3',
      subtitle: isEn ? 'Extended Front Battle' : 'Batalla de Frente Ampliado',
      description: isCasual
        ? (isEn
          ? '2 combined decks (104 cards). 6 players, 5 cards each. 1 personal shadow/round. 20s turn clock. Limit of 12 cards per front.'
          : '2 barajas combinadas (104 cartas). 6 jugadores, 5 cartas c/u. 1 sombra fija/ronda por jugador. Turno de 20s. Límite de 12 cartas por frente.')
        : (isEn
          ? '2 combined decks (104 cards). 6 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 12 cards per front.'
          : GAME_MODES['3v3'].description),
    },
    '4v4': {
      ...GAME_MODES['4v4'],
      name: isEn ? '4 vs 4' : '4 contra 4',
      subtitle: isEn ? 'Total Army Warfare' : 'Guerra Total de Ejércitos',
      description: isCasual
        ? (isEn
          ? '2 combined decks (104 cards). 8 players, 5 cards each. 1 personal shadow/round. 20s turn clock. Limit of 16 cards per front.'
          : '2 barajas combinadas (104 cartas). 8 jugadores, 5 cartas c/u. 1 sombra fija/ronda por jugador. Turno de 20s. Límite de 16 cartas por frente.')
        : (isEn
          ? '2 combined decks (104 cards). 8 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 16 cards per front.'
          : GAME_MODES['4v4'].description),
    },
  };
}

export function getLocalizedDurations(lang = 'es') {
  const isEn = lang === 'en';
  return [
    { id: 'corta', name: isEn ? 'Short' : 'Corta', rounds: 4, desc: isEn ? '4 Rounds' : '4 Rondas', timeEst: '~10 min' },
    { id: 'mediana', name: isEn ? 'Medium' : 'Mediana', rounds: 6, desc: isEn ? '6 Rounds' : '6 Rondas', timeEst: '~18 min' },
    { id: 'larga', name: isEn ? 'Long' : 'Larga', rounds: 8, desc: isEn ? '8 Rounds' : '8 Rondas', timeEst: '~25 min' },
  ];
}

export function getLocalizedTimeOptions(lang = 'es') {
  const isEn = lang === 'en';
  return [
    { id: 'rapido', name: isEn ? 'Fast' : 'Rápido', desc: isEn ? 'Agile & dynamic tempo' : 'Ritmo ágil y dinámico' },
    { id: 'medio', name: isEn ? 'Medium' : 'Medio', desc: isEn ? 'Standard tactical balance' : 'Equilibrio táctico estándar' },
    { id: 'lento', name: isEn ? 'Slow' : 'Lento', desc: isEn ? 'Maximum depth & calculation' : 'Máxima profundidad y cálculo' },
  ];
}

// Tiempos oficiales por formato (Reloj de Equipo compartido por ronda) según Capítulo 3 del reglamento v1.6
export const TEAM_TIMES = {
  '1v1': {
    rapido: { seconds: 100, label: '1m 40s (100s)', text: '1m 40s' },
    medio: { seconds: 200, label: '3m 20s (200s)', text: '3m 20s' },
    lento: { seconds: 300, label: '5m 00s (300s)', text: '5m 00s' },
  },
  '2v2': {
    rapido: { seconds: 100, label: '1m 40s (100s)', text: '1m 40s' },
    medio: { seconds: 200, label: '3m 20s (200s)', text: '3m 20s' },
    lento: { seconds: 300, label: '5m 00s (300s)', text: '5m 00s' },
  },
  '3v3': {
    rapido: { seconds: 150, label: '2m 30s (150s)', text: '2m 30s' },
    medio: { seconds: 300, label: '5m 00s (300s)', text: '5m 00s' },
    lento: { seconds: 450, label: '7m 30s (450s)', text: '7m 30s' },
  },
  '4v4': {
    rapido: { seconds: 200, label: '3m 20s (200s)', text: '3m 20s' },
    medio: { seconds: 400, label: '6m 40s (400s)', text: '6m 40s' },
    lento: { seconds: 600, label: '10m 00s (600s)', text: '10m 00s' },
  },
};

/**
 * Obtiene los segundos del reloj de equipo para un modo y velocidad de tiempo elegidos
 */
export function getTeamTimeSeconds(modeId = '2v2', timeSpeed = 'medio') {
  const modeTimes = TEAM_TIMES[modeId] || TEAM_TIMES['2v2'];
  return modeTimes[timeSpeed]?.seconds ?? 200;
}

/**
 * Obtiene la configuración de tiempo para un modo y velocidad
 */
export function getTeamTimeConfig(modeId = '2v2', timeSpeed = 'medio') {
  const modeTimes = TEAM_TIMES[modeId] || TEAM_TIMES['2v2'];
  return modeTimes[timeSpeed] || modeTimes['medio'];
}

/**
 * Formatea segundos a mm:ss (o m:ss)
 */
export function formatClockTime(totalSeconds) {
  if (totalSeconds == null || totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Crea la baraja con 1 o 2 mazos combinados según el modo
 */
export function createDeck(numDecks = 1) {
  const deck = [];
  let id = 1;
  for (let d = 0; d < numDecks; d++) {
    for (const suitKey of Object.keys(SUITS)) {
      for (const val of CARD_VALUES) {
        deck.push({
          id: `card-d${d}-${id++}`,
          suit: suitKey,
          rank: val.rank,
          base: val.base,
        });
      }
    }
  }
  return shuffleDeck(deck);
}

// Algoritmo Fisher-Yates
export function shuffleDeck(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Convierte el valor base numérico en el identificador o etiqueta de rango (J, Q, K, A o número).
 */
export function getRankLabel(val) {
  if (val === 11) return 'J';
  if (val === 12) return 'Q';
  if (val === 13) return 'K';
  if (val === 14) return 'A';
  return String(val);
}

/**
 * Detecta las escaleras cortas (3 cartas de valores numéricos consecutivos).
 * Encuentra el número máximo de tríos consecutivos disjuntos.
 * Admite 2..14 (donde J=11, Q=12, K=13, A=14) así como [14, 2, 3] (A-2-3).
 */
export function findShortStraights(cardValues) {
  const templates = [];
  for (let v = 2; v <= 12; v++) {
    templates.push([v, v + 1, v + 2]);
  }
  templates.push([14, 2, 3]); // Escalera A-2-3

  const counts = {};
  for (const val of cardValues) {
    counts[val] = (counts[val] || 0) + 1;
  }

  function helper(startIndex, currentCounts) {
    let best = [];
    for (let i = startIndex; i < templates.length; i++) {
      const [v1, v2, v3] = templates[i];
      if ((currentCounts[v1] || 0) > 0 && (currentCounts[v2] || 0) > 0 && (currentCounts[v3] || 0) > 0) {
        const nextCounts = { ...currentCounts };
        nextCounts[v1]--;
        nextCounts[v2]--;
        nextCounts[v3]--;
        const sub = helper(i, nextCounts);
        if (sub.length + 1 > best.length) {
          best = [[v1, v2, v3], ...sub];
        }
      }
    }
    return best;
  }

  return helper(0, counts);
}

/**
 * Calcula el desglose de puntuación de un equipo en un frente según el reglamento oficial v1.6 / v2.0.
 * Soporta tanto el Modo Competitivo como el Modo Casual ("Escala Comprimida"):
 *
 * MODO COMPETITIVO (`gameMode === 'competitive'`):
 * - Valor base: 2 al 10 nominal, J=11, Q=12, K=13, A=14
 * - Sinergia de Palo: +5 Puntos (por cada carta adicional del mismo palo en el frente, a partir de 2)
 * - Pareja: +10 Puntos (2 cartas del mismo valor)
 * - Escalera Corta: +15 Puntos (3 cartas consecutivas)
 * - Trío: +20 Puntos (3 cartas del mismo valor; anula la bonificación de Pareja de esas mismas cartas)
 *
 * MODO CASUAL (`gameMode === 'casual'` - Escala Comprimida Rebalanceada):
 * - Valor base: 2-6 = 1 pt, 7-10 = 2 pts, J/Q/K = 3 pts, As (A) = 4 pts
 * - Color (Mismo palo): +1 punto al juntar exactamente 2 cartas del mismo palo, y +3 puntos totales (bonificación máxima) al alcanzar 3 o más cartas del mismo palo en el frente
 * - Pareja (2 cartas del mismo valor nominal): +3 puntos
 * - Escalera Corta (3 cartas de valor nominal consecutivo): +4 puntos
 * - Trío (3 cartas del mismo valor nominal): +6 puntos (anula la bonificación de Pareja de esas mismas cartas)
 * - Desempate en un Frente: carta individual de mayor jerarquía nominal (2 < 3 < ... < K < A)
 *
 * @param {Array} cards - Lista de cartas del equipo en ese frente
 * @param {boolean|string} countShadowsOrTrump - Si booleano: cuenta sombras; si string (antiguo trumpSuit): retrocompatibilidad
 * @param {boolean|string} countShadowsOrGameMode - Opcional: booleano (si se pasó trumpSuit antes) o gameMode ('competitive'|'casual')
 * @param {string} gameModeParam - Modo de juego ('competitive' | 'casual')
 */
export function calculateFrontScore(
  cards = [],
  countShadowsOrTrump = true,
  countShadowsOrGameMode = true,
  gameModeParam = 'competitive',
  fifthParam = null
) {
  let countShadows = true;
  if (typeof countShadowsOrTrump === 'boolean') {
    countShadows = countShadowsOrTrump;
  } else if (typeof countShadowsOrGameMode === 'boolean') {
    countShadows = countShadowsOrGameMode;
  }

  let gameMode = 'competitive';
  if (countShadowsOrTrump === 'casual' || countShadowsOrTrump === 'competitive') {
    gameMode = countShadowsOrTrump;
  } else if (countShadowsOrGameMode === 'casual' || countShadowsOrGameMode === 'competitive') {
    gameMode = countShadowsOrGameMode;
  } else if (gameModeParam === 'casual' || gameModeParam === 'competitive') {
    gameMode = gameModeParam;
  } else if (fifthParam === 'casual' || fifthParam === 'competitive') {
    gameMode = fifthParam;
  }
  const isCasual = gameMode === 'casual';

  // Filtrar cartas activas; nunca contabilizar cartas censuradas ('?' o base <= 0)
  const activeCards = (cards || []).filter(
    c => c && (countShadows || !c.isShadow) && !c.isHidden && c.rank !== '?' && Number(c.base) > 0
  );

  let baseTotal = 0;
  let highestBaseCard = 0;
  const suitCounts = {};
  const rankCounts = {};
  const activeValues = [];

  activeCards.forEach(card => {
    const cardPoints = isCasual ? getCardCasualBase(card.base) : card.base;
    baseTotal += cardPoints;
    if (card.base > highestBaseCard) {
      highestBaseCard = card.base;
    }

    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    rankCounts[card.base] = (rankCounts[card.base] || 0) + 1;
    activeValues.push(card.base);
  });

  // 1. Sinergia de palo / Color
  // Competitivo: +5 pts por cada carta adicional del mismo palo (count >= 2 => (count - 1) * 5)
  // Casual: Color (Mismo palo): +1 punto al juntar exactamente 2 cartas del mismo palo, y +3 puntos totales (bonificación máxima) al alcanzar 3 o más cartas del mismo palo en el frente
  let suitSynergyTotal = 0;
  const synergiesBySuit = {};
  Object.entries(suitCounts).forEach(([suit, count]) => {
    if (isCasual) {
      if (count >= 2) {
        const bonus = count >= 3 ? 3 : 1;
        suitSynergyTotal += bonus;
        synergiesBySuit[suit] = {
          count,
          bonus,
        };
      }
    } else if (count >= 2) {
      const bonus = (count - 1) * 5;
      suitSynergyTotal += bonus;
      synergiesBySuit[suit] = {
        count,
        bonus,
      };
    }
  });

  // 2. Parejas (Competitivo: +10 pts / Casual: +3 pts) y Tríos (Competitivo: +20 pts / Casual: +6 pts; anula Pareja)
  const pairBonusValue = isCasual ? 3 : 10;
  const trioBonusValue = isCasual ? 6 : 20;
  let pairTotal = 0;
  let trioTotal = 0;
  const pairs = [];
  const trios = [];

  Object.entries(rankCounts).forEach(([baseStr, count]) => {
    const base = Number(baseStr);
    const rankLabel = getRankLabel(base);

    const numTrios = Math.floor(count / 3);
    const remainingAfterTrios = count % 3;
    const numPairs = Math.floor(remainingAfterTrios / 2);

    for (let i = 0; i < numTrios; i++) {
      trios.push({
        base,
        rank: rankLabel,
        bonus: trioBonusValue,
      });
      trioTotal += trioBonusValue;
    }

    for (let i = 0; i < numPairs; i++) {
      pairs.push({
        base,
        rank: rankLabel,
        bonus: pairBonusValue,
      });
      pairTotal += pairBonusValue;
    }
  });

  // 3. Escalera Corta (Competitivo: +15 pts / Casual: +4 pts por 3 cartas consecutivas)
  const straightBonusValue = isCasual ? 4 : 15;
  const straightTriplets = findShortStraights(activeValues);
  const straights = straightTriplets.map(triplet => {
    const isAceLow = triplet.includes(14) && triplet.includes(2) && triplet.includes(3);
    const sortedVals = isAceLow ? [14, 2, 3] : [...triplet].sort((a, b) => a - b);
    const rankLabels = sortedVals.map(getRankLabel);
    return {
      values: sortedVals,
      ranks: rankLabels,
      bonus: straightBonusValue,
      label: rankLabels.join('-'),
    };
  });
  const straightTotal = straights.length * straightBonusValue;

  const synergyTotal = suitSynergyTotal + pairTotal + trioTotal + straightTotal;
  const total = baseTotal + synergyTotal;

  return {
    total,
    baseTotal,
    suitSynergyTotal,
    pairTotal,
    trioTotal,
    straightTotal,
    synergyTotal,
    synergiesBySuit,
    pairs,
    trios,
    straights,
    trumpTotal: 0, // Conservado en 0 para evitar errores si algún componente legacy lo lee
    highestBaseCard,
    highestRankLabel: highestBaseCard > 0 ? getRankLabel(highestBaseCard) : '-',
    cardCount: (cards || []).length,
    activeCount: activeCards.length,
    hiddenCount: (cards || []).filter(c => c && (c.isShadow && !countShadows || c.isHidden || c.rank === '?')).length,
    shadowCount: (cards || []).filter(c => c && c.isShadow).length,
    gameMode,
  };
}

/**
 * Orden de palos para el criterio secundario de desempate en la ordenación:
 * Corazones (♥) -> Diamantes (♦) -> Tréboles (♣) -> Picas (♠)
 * (Rojos primero, seguidos de negros, cumpliendo el ejemplo del reglamento).
 */
export const SUIT_SORT_ORDER = {
  hearts: 0,
  diamonds: 1,
  clubs: 2,
  spades: 3,
};

/**
 * Compara dos cartas con prioridad:
 * 1º Valor numérico base ascendente (2, 3, ..., 14/As)
 * 2º Palo / Color
 */
export function compareCardsByValueAndSuit(a, b) {
  if (!a || !b) return 0;
  if (a.base !== b.base) {
    return a.base - b.base;
  }
  const suitA = SUIT_SORT_ORDER[a.suit] ?? 99;
  const suitB = SUIT_SORT_ORDER[b.suit] ?? 99;
  return suitA - suitB;
}

/**
 * Ordena las cartas de un frente según número y después palo.
 *
 * REGLA OFICIAL DE CARTAS SOMBRA:
 * Para no revelar ninguna pista sobre su valor numérico a los rivales durante la ronda,
 * las cartas de sombra no reveladas (o cartas ocultas con '?') permanecen fijas en el
 * índice exacto donde fueron colocadas cronológicamente. Las cartas visibles se ordenan
 * ocupando los huecos restantes.
 *
 * Cuando la ronda termina (isRevealed = true), todas las tropas se revelan y se ordenan
 * conjuntamente para permitir una visualización instantánea y limpia del frente completo.
 *
 * @param {Array} cards - Lista de cartas en el frente
 * @param {boolean} isRevealed - Si la ronda ha finalizado y las sombras están reveladas
 */
export function sortFrontCards(cards = [], isRevealed = false) {
  if (!cards || cards.length <= 1) return cards ? [...cards] : [];

  // Localizar índices fijos (sombras no reveladas o cartas ocultas)
  const fixedIndices = new Set();
  cards.forEach((card, idx) => {
    const isUnrevealedShadow = (card.isShadow && !isRevealed) || card.isHidden || card.rank === '?';
    if (isUnrevealedShadow) {
      fixedIndices.add(idx);
    }
  });

  // Si no hay cartas fijas, ordenar la lista completa directamente
  if (fixedIndices.size === 0) {
    return [...cards].sort(compareCardsByValueAndSuit);
  }

  // Filtrar y ordenar las cartas visibles
  const nonFixedCards = cards.filter((_, idx) => !fixedIndices.has(idx));
  nonFixedCards.sort(compareCardsByValueAndSuit);

  // Reconstruir el array respetando las posiciones originales de las cartas sombras
  let nonFixedIdx = 0;
  return cards.map((card, idx) => {
    if (fixedIndices.has(idx)) {
      return card;
    }
    return nonFixedCards[nonFixedIdx++];
  });
}

/**
 * Analiza en detalle las sinergias y formaciones de las cartas de un bando en un frente.
 * Identifica qué cartas participan en parejas, tríos, escaleras o sinergias de palo,
 * calcula si una carta participa en múltiples combos (Multi-Combo) y lista las cartas compañeras
 * para permitir la iluminación interactiva al pasar el cursor (hover).
 *
 * Para proteger la información imperfecta del juego, las cartas sombra no reveladas
 * NO exponen sus sinergias hasta que concluya la ronda (isRevealed = true).
 *
 * @param {Array} cards - Lista de cartas del bando
 * @param {boolean} isRevealed - Si se deben contabilizar cartas sombra reveladas
 * @param {string} lang - Idioma para etiquetas y tooltips ('es' | 'en')
 */
export function analyzeCardSynergies(cards = [], isRevealed = false, lang = 'es', gameMode = 'competitive') {
  const isEn = lang === 'en';
  const isCasual = gameMode === 'casual';
  const activeCards = (cards || []).filter(
    c => c && (isRevealed || !c.isShadow) && !c.isHidden && c.rank !== '?' && Number(c.base) > 0
  );
  const frontScore = calculateFrontScore(cards, isRevealed, gameMode);

  const cardSynergies = {};
  const partnerSets = {};

  (cards || []).forEach(c => {
    cardSynergies[c.id] = {
      cardId: c.id,
      inPair: false,
      pairRank: null,
      inTrio: false,
      trioRank: null,
      inStraight: false,
      straightLabels: [],
      inSuitSynergy: false,
      suitCount: 0,
      suitBonus: 0,
      synergyCount: 0,
      isMultiCombo: false,
      primarySynergy: null,
      partnerCardIds: [],
      synergyDescriptions: [],
    };
    partnerSets[c.id] = new Set();
  });

  // 1. Sinergias de Palo / Color (Competitivo: >=2 cartas; Casual: 2 cartas = +1 pt, 3+ cartas = +3 pts totales)
  const minSuitCards = 2;
  Object.entries(frontScore.synergiesBySuit || {}).forEach(([suit, data]) => {
    if (data.count >= minSuitCards) {
      const suitCards = activeCards.filter(c => c.suit === suit);
      const suitCardIds = suitCards.map(c => c.id);
      const localizedSuits = getLocalizedSuits(lang);
      const suitName = localizedSuits[suit]?.name || SUITS[suit]?.name || suit;
      suitCards.forEach(c => {
        const item = cardSynergies[c.id];
        if (item) {
          item.inSuitSynergy = true;
          item.suitCount = data.count;
          item.suitBonus = data.bonus;
          item.synergyDescriptions.push(
            isCasual
              ? (isEn ? `Color ${suitName} (${data.count}) +${data.bonus}` : `Color ${suitName} (${data.count}) +${data.bonus}`)
              : `${suitName} x${data.count}`
          );
          suitCardIds.forEach(id => {
            if (id !== c.id) partnerSets[c.id].add(id);
          });
        }
      });
    }
  });

  // 2. Tríos
  (frontScore.trios || []).forEach(trio => {
    const trioCards = activeCards.filter(c => c.base === trio.base);
    const trioCardIds = trioCards.map(c => c.id);
    trioCards.forEach(c => {
      const item = cardSynergies[c.id];
      if (item) {
        item.inTrio = true;
        item.trioRank = trio.rank;
        item.synergyDescriptions.push(
          isEn ? `Trio of ${trio.rank}s (+${trio.bonus})` : `Trío de ${trio.rank}s (+${trio.bonus})`
        );
        trioCardIds.forEach(id => {
          if (id !== c.id) partnerSets[c.id].add(id);
        });
      }
    });
  });

  // 3. Parejas (excluyendo cartas ya asignadas a un trío)
  (frontScore.pairs || []).forEach(pair => {
    const pairCards = activeCards.filter(c => c.base === pair.base && !cardSynergies[c.id]?.inTrio);
    const pairCardIds = pairCards.map(c => c.id);
    pairCards.forEach(c => {
      const item = cardSynergies[c.id];
      if (item) {
        item.inPair = true;
        item.pairRank = pair.rank;
        item.synergyDescriptions.push(
          isEn ? `Pair of ${pair.rank}s (+${pair.bonus})` : `Pareja de ${pair.rank}s (+${pair.bonus})`
        );
        pairCardIds.forEach(id => {
          if (id !== c.id) partnerSets[c.id].add(id);
        });
      }
    });
  });

  // 4. Escaleras Cortas (3 cartas consecutivas)
  (frontScore.straights || []).forEach(straight => {
    const straightCards = activeCards.filter(c => straight.values.includes(c.base));
    const straightCardIds = straightCards.map(c => c.id);
    straightCards.forEach(c => {
      const item = cardSynergies[c.id];
      if (item) {
        item.inStraight = true;
        if (!item.straightLabels.includes(straight.label)) {
          item.straightLabels.push(straight.label);
        }
        item.synergyDescriptions.push(
          isEn ? `Straight ${straight.label} (+${straight.bonus})` : `Escalera ${straight.label} (+${straight.bonus})`
        );
        straightCardIds.forEach(id => {
          if (id !== c.id) partnerSets[c.id].add(id);
        });
      }
    });
  });

  // 5. Determinar Multi-Combos y Sinergia Primaria
  (cards || []).forEach(c => {
    const item = cardSynergies[c.id];
    if (!item) return;

    let distinctTypes = 0;
    if (item.inTrio || item.inPair) distinctTypes++;
    if (item.inStraight) distinctTypes++;
    if (item.inSuitSynergy) distinctTypes++;

    item.synergyCount = distinctTypes;
    item.isMultiCombo = distinctTypes >= 2;

    if (item.inTrio) {
      item.primarySynergy = 'trio';
    } else if (item.inStraight) {
      item.primarySynergy = 'straight';
    } else if (item.inPair) {
      item.primarySynergy = 'pair';
    } else if (item.inSuitSynergy) {
      item.primarySynergy = 'suit';
    }

    item.partnerCardIds = Array.from(partnerSets[c.id] || []);
  });

  return {
    frontScore,
    cardSynergies,
  };
}

/**
 * Resuelve el ganador de un frente entre Equipo A y Equipo B
 */
export function resolveFrontWinner(
  teamACards,
  teamBCards,
  trumpSuitOrLang = 'es',
  langOrGameMode = 'es',
  gameModeParam = 'competitive'
) {
  let lang = 'es';
  if (trumpSuitOrLang === 'es' || trumpSuitOrLang === 'en') {
    lang = trumpSuitOrLang;
  } else if (langOrGameMode === 'es' || langOrGameMode === 'en') {
    lang = langOrGameMode;
  }

  let gameMode = 'competitive';
  if (trumpSuitOrLang === 'casual' || trumpSuitOrLang === 'competitive') {
    gameMode = trumpSuitOrLang;
  } else if (langOrGameMode === 'casual' || langOrGameMode === 'competitive') {
    gameMode = langOrGameMode;
  } else if (gameModeParam === 'casual' || gameModeParam === 'competitive') {
    gameMode = gameModeParam;
  }

  const teamACalc = calculateFrontScore(teamACards, true, gameMode);
  const teamBCalc = calculateFrontScore(teamBCards, true, gameMode);
  const isEn = lang === 'en';

  if (teamACalc.total > teamBCalc.total) {
    return { winner: 'teamA', reason: isEn ? 'Higher total score' : 'Mayor puntuación total' };
  }
  if (teamBCalc.total > teamACalc.total) {
    return { winner: 'teamB', reason: isEn ? 'Higher total score' : 'Mayor puntuación total' };
  }

  // Empate en puntuación: Criterio oficial de la carta individual de mayor jerarquía nominal (2 < 3 < ... < K < A)
  const rankA = getRankLabel(teamACalc.highestBaseCard);
  const rankB = getRankLabel(teamBCalc.highestBaseCard);
  if (teamACalc.highestBaseCard > teamBCalc.highestBaseCard) {
    return {
      winner: 'teamA',
      reason: isEn
        ? `Tie-breaker by highest nominal card (${rankA} vs ${rankB})`
        : `Desempate por carta más alta (${rankA} vs ${rankB})`
    };
  }
  if (teamBCalc.highestBaseCard > teamACalc.highestBaseCard) {
    return {
      winner: 'teamB',
      reason: isEn
        ? `Tie-breaker by highest nominal card (${rankB} vs ${rankA})`
        : `Desempate por carta más alta (${rankB} vs ${rankA})`
    };
  }

  // Empate absoluto: Frente Nulo
  return { winner: 'tie', reason: isEn ? 'Void front due to exact tie' : 'Frente Nulo por empate exacto' };
}
