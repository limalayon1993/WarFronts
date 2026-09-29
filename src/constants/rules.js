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

// Modos de juego oficiales según el reglamento v1.6
export const GAME_MODES = {
  '1v1': {
    id: '1v1',
    name: '1 contra 1',
    subtitle: 'Duelo Táctico de Comandantes',
    teamSize: 1,
    handSize: 10,
    decks: 1,
    maxFrontCards: 8,
    shadowsPerPlayer: 2,
    totalPlayers: 2,
    description: '1 baraja (52 cartas). 10 cartas por duelista, 2 sombras, límite de 8 cartas por frente.',
  },
  '2v2': {
    id: '2v2',
    name: '2 contra 2',
    subtitle: 'Escuadrón Táctico por Parejas',
    teamSize: 2,
    handSize: 5,
    decks: 1,
    maxFrontCards: 8,
    shadowsPerPlayer: 1,
    totalPlayers: 4,
    description: '1 baraja (52 cartas). 4 jugadores, 5 cartas c/u, 1 sombra, límite de 8 cartas por frente.',
  },
  '3v3': {
    id: '3v3',
    name: '3 contra 3',
    subtitle: 'Batalla de Frente Ampliado',
    teamSize: 3,
    handSize: 5,
    decks: 2,
    maxFrontCards: 12,
    shadowsPerPlayer: 1,
    totalPlayers: 6,
    description: '2 barajas combinadas (104 cartas). 6 jugadores, 5 cartas c/u, límite de 12 cartas por frente.',
  },
  '4v4': {
    id: '4v4',
    name: '4 contra 4',
    subtitle: 'Guerra Total de Ejércitos',
    teamSize: 4,
    handSize: 5,
    decks: 2,
    maxFrontCards: 16,
    shadowsPerPlayer: 1,
    totalPlayers: 8,
    description: '2 barajas combinadas (104 cartas). 8 jugadores, 5 cartas c/u, límite de 16 cartas por frente.',
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
 * Calcula el desglose de puntuación de un equipo en un frente.
 * @param {Array} cards - Lista de cartas del equipo en ese frente
 * @param {string} trumpSuit - Palo de triunfo
 * @param {boolean} countShadows - Si true cuenta cartas sombra (fin de ronda)
 */
export function calculateFrontScore(cards, trumpSuit, countShadows = true) {
  const activeCards = cards.filter(c => countShadows || !c.isShadow);

  let baseTotal = 0;
  let trumpTotal = 0;
  let synergyTotal = 0;
  const suitCounts = {};
  let highestBaseCard = 0;

  activeCards.forEach(card => {
    baseTotal += card.base;
    if (card.base > highestBaseCard) {
      highestBaseCard = card.base;
    }

    // Palo Triunfo (+2 pts)
    if (card.suit === trumpSuit) {
      trumpTotal += 2;
    }

    // Conteo para sinergia
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  });

  // Sinergia de palo (+5 pts por cada carta adicional del mismo palo)
  const synergiesBySuit = {};
  Object.entries(suitCounts).forEach(([suit, count]) => {
    if (count >= 2) {
      const bonus = (count - 1) * 5;
      synergyTotal += bonus;
      synergiesBySuit[suit] = {
        count,
        bonus,
      };
    }
  });

  const total = baseTotal + trumpTotal + synergyTotal;

  return {
    total,
    baseTotal,
    trumpTotal,
    synergyTotal,
    synergiesBySuit,
    highestBaseCard,
    cardCount: cards.length,
    activeCount: activeCards.length,
    hiddenCount: cards.filter(c => c.isShadow && !countShadows).length,
  };
}

/**
 * Resuelve el ganador de un frente entre Equipo A y Equipo B
 */
export function resolveFrontWinner(teamACards, teamBCards, trumpSuit) {
  const teamACalc = calculateFrontScore(teamACards, trumpSuit, true);
  const teamBCalc = calculateFrontScore(teamBCards, trumpSuit, true);

  if (teamACalc.total > teamBCalc.total) {
    return { winner: 'teamA', reason: 'Mayor puntuación total' };
  }
  if (teamBCalc.total > teamACalc.total) {
    return { winner: 'teamB', reason: 'Mayor puntuación total' };
  }

  // Empate en puntuación: Criterio oficial de la carta individual de mayor valor base
  if (teamACalc.highestBaseCard > teamBCalc.highestBaseCard) {
    return {
      winner: 'teamA',
      reason: `Desempate por carta más alta (${teamACalc.highestBaseCard} vs ${teamBCalc.highestBaseCard})`
    };
  }
  if (teamBCalc.highestBaseCard > teamACalc.highestBaseCard) {
    return {
      winner: 'teamB',
      reason: `Desempate por carta más alta (${teamBCalc.highestBaseCard} vs ${teamACalc.highestBaseCard})`
    };
  }

  // Empate absoluto: Frente Nulo
  return { winner: 'tie', reason: 'Frente Nulo por empate exacto' };
}
