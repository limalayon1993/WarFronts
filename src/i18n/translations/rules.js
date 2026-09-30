export const RULES_TRANSLATIONS = {
  es: {
    suits: {
      hearts: 'Corazones',
      diamonds: 'Diamantes',
      clubs: 'Tréboles',
      spades: 'Picas',
    },
    ranks: {
      J: 'Jota',
      Q: 'Reina',
      K: 'Rey',
      A: 'As',
    },
    fronts: {
      left: { name: 'Frente Izquierdo', subtitle: 'Flanco Oeste' },
      center: { name: 'Frente Central', subtitle: 'Línea Principal' },
      right: { name: 'Frente Derecho', subtitle: 'Flanco Este' },
    },
    modes: {
      '1v1': {
        name: '1 contra 1',
        subtitle: 'Duelo Táctico de Comandantes',
        description: '1 baraja (52 cartas). 10 cartas por duelista, 2 sombras, límite de 8 cartas por frente.',
      },
      '2v2': {
        name: '2 contra 2',
        subtitle: 'Escuadrón Táctico por Parejas',
        description: '1 baraja (52 cartas). 4 jugadores, 5 cartas c/u, 1 sombra, límite de 8 cartas por frente.',
      },
      '3v3': {
        name: '3 contra 3',
        subtitle: 'Batalla de Frente Ampliado',
        description: '2 barajas combinadas (104 cartas). 6 jugadores, 5 cartas c/u, límite de 12 cartas por frente.',
      },
      '4v4': {
        name: '4 contra 4',
        subtitle: 'Guerra Total de Ejércitos',
        description: '2 barajas combinadas (104 cartas). 8 jugadores, 5 cartas c/u, límite de 16 cartas por frente.',
      },
    },
    durations: {
      corta: { name: 'Corta', desc: '4 Rondas', timeEst: '~10 min' },
      mediana: { name: 'Mediana', desc: '6 Rondas', timeEst: '~18 min' },
      larga: { name: 'Larga', desc: '8 Rondas', timeEst: '~25 min' },
    },
    speeds: {
      rapido: { name: 'Rápido', desc: 'Ritmo ágil y dinámico' },
      medio: { name: 'Medio', desc: 'Equilibrio táctico estándar' },
      lento: { name: 'Lento', desc: 'Máxima profundidad y cálculo' },
    },
    reasons: {
      higherScore: 'Mayor puntuación total',
      highestCard: (scoreA, scoreB) => `Desempate por carta más alta (${scoreA} vs ${scoreB})`,
      tie: 'Frente Nulo por empate exacto',
    },
  },
  en: {
    suits: {
      hearts: 'Hearts',
      diamonds: 'Diamonds',
      clubs: 'Clubs',
      spades: 'Spades',
    },
    ranks: {
      J: 'Jack',
      Q: 'Queen',
      K: 'King',
      A: 'Ace',
    },
    fronts: {
      left: { name: 'Left Front', subtitle: 'West Flank' },
      center: { name: 'Center Front', subtitle: 'Main Line' },
      right: { name: 'Right Front', subtitle: 'East Flank' },
    },
    modes: {
      '1v1': {
        name: '1 vs 1',
        subtitle: 'Tactical Commanders Duel',
        description: '1 deck (52 cards). 10 cards per player, 2 shadows, limit of 8 cards per front.',
      },
      '2v2': {
        name: '2 vs 2',
        subtitle: 'Tactical Squads by Pairs',
        description: '1 deck (52 cards). 4 players, 5 cards each, 1 shadow, limit of 8 cards per front.',
      },
      '3v3': {
        name: '3 vs 3',
        subtitle: 'Extended Front Battle',
        description: '2 combined decks (104 cards). 6 players, 5 cards each, limit of 12 cards per front.',
      },
      '4v4': {
        name: '4 vs 4',
        subtitle: 'Total Army Warfare',
        description: '2 combined decks (104 cards). 8 players, 5 cards each, limit of 16 cards per front.',
      },
    },
    durations: {
      corta: { name: 'Short', desc: '4 Rounds', timeEst: '~10 min' },
      mediana: { name: 'Medium', desc: '6 Rounds', timeEst: '~18 min' },
      larga: { name: 'Long', desc: '8 Rounds', timeEst: '~25 min' },
    },
    speeds: {
      rapido: { name: 'Fast', desc: 'Agile & dynamic tempo' },
      medio: { name: 'Medium', desc: 'Standard tactical balance' },
      lento: { name: 'Slow', desc: 'Maximum depth & calculation' },
    },
    reasons: {
      higherScore: 'Higher total score',
      highestCard: (scoreA, scoreB) => `Tie-breaker by highest base card (${scoreA} vs ${scoreB})`,
      tie: 'Void front due to exact tie',
    },
  },
};
