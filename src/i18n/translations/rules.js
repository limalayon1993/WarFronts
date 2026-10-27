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
        description: '1 baraja (52 cartas). 10 cartas por duelista. Economía de sombras continua (inician en 0). Límite de 8 cartas por frente.',
      },
      '2v2': {
        name: '2 contra 2',
        subtitle: 'Escuadrón Táctico por Parejas',
        description: '1 baraja (52 cartas). 4 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 8 cartas por frente.',
      },
      '3v3': {
        name: '3 contra 3',
        subtitle: 'Batalla de Frente Ampliado',
        description: '2 barajas combinadas (104 cartas). 6 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 12 cartas por frente.',
      },
      '4v4': {
        name: '4 contra 4',
        subtitle: 'Guerra Total de Ejércitos',
        description: '2 barajas combinadas (104 cartas). 8 jugadores, 5 cartas c/u. Economía de sombras continua (inician en 0). Límite de 16 cartas por frente.',
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
    matchTypes: {
      competitive: {
        name: 'Modo Competitivo',
        badge: 'Base Estándar Oficial',
        subtitle: 'Escala Táctica Unificada (1-4) • Fondo de Sombras • Reloj Dual',
      },
      casual: {
        name: 'Modo Casual (Party / Amigos)',
        badge: '3 Ajustes Exclusivos',
        subtitle: '1 Sombra Fija/Jug • Turno de 20s • Prórroga Directa',
      },
    },
    casualSynergies: {
      color: {
        label: 'Palo (Color)',
        bonus: '+1 pt / carta extra',
        desc: 'Sinergia de Palo: +1 pt por cada carta adicional del mismo palo jugada por el mismo equipo en el frente (2 cartas = +1 pt, 3 cartas = +2 pts, etc., sin límite).',
      },
      pair: {
        label: 'Pareja',
        bonus: '+2 pts',
        desc: 'Pareja: +2 pts por 2 cartas del mismo valor nominal.',
      },
      straight: {
        label: 'Escalera Corta',
        bonus: '+4 pts',
        desc: 'Escalera Corta: +4 pts por 3 cartas de valor nominal consecutivo (ej. 5-6-7 o J-Q-K).',
      },
      threeOfAKind: {
        label: 'Trío',
        bonus: '+5 pts',
        desc: 'Trío: +5 pts por 3 cartas del mismo valor nominal (anula automáticamente la bonificación de Pareja de esas cartas).',
      },
    },
    reasons: {
      higherScore: 'Mayor puntuación total',
      highestCard: (scoreA, scoreB) => `Desempate nominal por carta alta (${scoreA} vs ${scoreB})`,
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
        description: '1 deck (52 cards). 10 cards per player. Continuous shadow economy (start at 0). Limit of 8 cards per front.',
      },
      '2v2': {
        name: '2 vs 2',
        subtitle: 'Tactical Squads by Pairs',
        description: '1 deck (52 cards). 4 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 8 cards per front.',
      },
      '3v3': {
        name: '3 vs 3',
        subtitle: 'Extended Front Battle',
        description: '2 combined decks (104 cards). 6 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 12 cards per front.',
      },
      '4v4': {
        name: '4 vs 4',
        subtitle: 'Total Army Warfare',
        description: '2 combined decks (104 cards). 8 players, 5 cards each. Continuous shadow economy (start at 0). Limit of 16 cards per front.',
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
    matchTypes: {
      competitive: {
        name: 'Competitive Mode',
        badge: 'Official Standard Base',
        subtitle: 'Unified Tactical Scale (1-4) • Shadow Pool • Dual Clock',
      },
      casual: {
        name: 'Casual Mode (Party / Friends)',
        badge: '3 Exclusive Adjustments',
        subtitle: '1 Fixed Shadow/Player • 20s Turn • Direct Overtime',
      },
    },
    casualSynergies: {
      color: {
        label: 'Suit (Color)',
        bonus: '+1 pt / extra card',
        desc: 'Suit Synergy: +1 pt for each additional card of the same suit played by the team on that front (2 cards = +1 pt, 3 cards = +2 pts, etc., no cap).',
      },
      pair: {
        label: 'Pair',
        bonus: '+2 pts',
        desc: 'Pair: +2 pts for 2 cards of equal nominal rank.',
      },
      straight: {
        label: 'Short Straight',
        bonus: '+4 pts',
        desc: 'Short Straight: +4 pts for 3 cards of consecutive nominal rank (e.g. 5-6-7 or J-Q-K).',
      },
      threeOfAKind: {
        label: 'Trio',
        bonus: '+5 pts',
        desc: 'Trio: +5 pts for 3 cards of equal nominal rank (automatically cancels the Pair bonus for those cards).',
      },
    },
    reasons: {
      higherScore: 'Higher total score',
      highestCard: (scoreA, scoreB) => `Nominal tiebreaker by highest card (${scoreA} vs ${scoreB})`,
      tie: 'Void front due to exact tie',
    },
  },
};
