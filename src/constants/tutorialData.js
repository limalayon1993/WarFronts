// Script maestro oficial para el Tutorial Guiado 2v2 de Frentes de Guerra
// Diseñado para garantizar una experiencia didáctica determinista y completa de principio a fin (Bilingüe ES/EN).

export const TUTORIAL_TRUMP_CARD = {
  id: 'tutorial-trump-7h',
  suit: 'hearts',
  rank: '7',
  base: 7,
};

export const TUTORIAL_INITIAL_HANDS = {
  A1: [
    { id: 'card-kh', suit: 'hearts', rank: 'K', base: 13 },
    { id: 'card-10s', suit: 'spades', rank: '10', base: 10 },
    { id: 'card-8h', suit: 'hearts', rank: '8', base: 8 },
    { id: 'card-4c', suit: 'clubs', rank: '4', base: 4 },
    { id: 'card-ad', suit: 'diamonds', rank: 'A', base: 14 },
  ],
  B1: [
    { id: 'card-qd', suit: 'diamonds', rank: 'Q', base: 12 },
    { id: 'card-jh', suit: 'hearts', rank: 'J', base: 11 },
    { id: 'card-9s', suit: 'spades', rank: '9', base: 9 },
    { id: 'card-5d', suit: 'diamonds', rank: '5', base: 5 },
    { id: 'card-2c', suit: 'clubs', rank: '2', base: 2 },
  ],
  A2: [
    { id: 'card-qh', suit: 'hearts', rank: 'Q', base: 12 },
    { id: 'card-jd', suit: 'diamonds', rank: 'J', base: 11 },
    { id: 'card-9h', suit: 'hearts', rank: '9', base: 9 },
    { id: 'card-6s', suit: 'spades', rank: '6', base: 6 },
    { id: 'card-3d', suit: 'diamonds', rank: '3', base: 3 },
  ],
  B2: [
    { id: 'card-ks', suit: 'spades', rank: 'K', base: 13 },
    { id: 'card-10d', suit: 'diamonds', rank: '10', base: 10 },
    { id: 'card-7s', suit: 'spades', rank: '7', base: 7 },
    { id: 'card-5h', suit: 'hearts', rank: '5', base: 5 },
    { id: 'card-4d', suit: 'diamonds', rank: '4', base: 4 },
  ],
};

export function getTutorialPlayersConfig(lang = 'es') {
  const isEn = lang === 'en';
  return [
    {
      id: 'A1',
      name: isEn ? 'You (A1)' : 'Tú (A1)',
      team: 'teamA',
      isHuman: true,
      isBot: false,
      shadowsLeft: 2,
    },
    {
      id: 'B1',
      name: isEn ? 'Rival B1' : 'Rival B1',
      team: 'teamB',
      isHuman: false,
      isBot: true,
      shadowsLeft: 2,
    },
    {
      id: 'A2',
      name: isEn ? 'Ally A2' : 'Aliado A2',
      team: 'teamA',
      isHuman: false,
      isBot: true,
      shadowsLeft: 2,
    },
    {
      id: 'B2',
      name: isEn ? 'Rival B2' : 'Rival B2',
      team: 'teamB',
      isHuman: false,
      isBot: true,
      shadowsLeft: 2,
    },
  ];
}

export const TUTORIAL_PLAYERS_CONFIG = getTutorialPlayersConfig('es');

// Función constructora de pasos para el Modo Casual (Party / Amigos) según idioma
export function getCasualTutorialSteps(lang = 'es') {
  const isEn = lang === 'en';

  return [
    // PASO 0: INTRODUCCIÓN AL MODO CASUAL
    {
      stepId: 0,
      type: 'dialog',
      stage: 'intro',
      title: isEn
        ? 'Welcome to the Casual Mode (Party) Tutorial!'
        : '¡Bienvenido al Tutorial del Modo Casual (Party / Amigos)!',
      subtitle: isEn
        ? 'Guided Instruction: Unified Tactical Scale & 3 Casual Modifications'
        : 'Instrucción Guiada: Escala Táctica Unificada y las 3 Modificaciones Casual',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Welcome to Casual Mode (Party / Friends) — Official Rulebook v2.1 (Chapter 9). This mode uses the exact same Unified Tactical Scale and scoring as Competitive Mode, but with 3 exclusive modifications to eliminate resource tracking and keep matches fast and light!',
            '1. Unified Tactical Scale (1 to 4 pts): Cards 2–6 = 1 pt, Cards 7–10 = 2 pts, Face Cards (J, Q, K) = 3 pts, and Ace (A) = 4 pts. Synergies: Suit (Color) = +1 pt per additional card, Pair = +2 pts, Short Straight = +4 pts, and Trio = +5 pts (cancels Pair).',
            '2. 1 Fixed Shadow per Player (Modification 1): No team shadow pool or post-round income; every player receives exactly 1 personal Shadow Marker per round (personal, non-transferable, non-cumulative).',
            '3. 20s Individual Turn Clock (Modification 2): No dual chess clock; each player has 20 seconds. If time expires, the system auto-plays the first available card in hand face-up into the valid front with fewest cards.',
            '4. Direct 2-Round Overtime (Modification 3): No shadow reserve tiebreaker; if total Round Points are tied at match end, you go directly into a 2-Round Overtime!',
          ]
        : [
            'Bienvenido al Modo Casual (Party / Amigos) — Reglamento Oficial v2.1 (Capítulo 9). Este modo comparte la misma Escala Táctica Unificada y reglas de puntuación que el Modo Competitivo, pero con 3 modificaciones exclusivas para agilizar la partida sin gestión compleja.',
            '1. Escala Táctica Unificada (1 al 4 pts): Cartas del 2 al 6 = 1 pto, Cartas del 7 al 10 = 2 pts, Figuras (J, Q, K) = 3 pts y As (A) = 4 pts. Sinergias: Palo (Color) = +1 pto por cada carta adicional, Pareja = +2 pts, Escalera Corta = +4 pts y Trío = +5 pts (anula Pareja).',
            '2. 1 Sombra Fija por Jugador (Modificación 1): Sin fondo de equipo ni ingresos posronda; cada jugador recibe exactamente 1 Marcador de Sombra personal por ronda (intransferible y no acumulable).',
            '3. Reloj Fijo de 20s por Turno (Modificación 2): Sin reloj dual; 20 segundos por jugada. Si se agota el tiempo, el sistema ejecuta auto-play colocando tu primera carta boca arriba en el frente válido con menos cartas.',
            '4. Desempate Directo por Prórroga (Modificación 3): Sin desempate por sombras; si hay empate final en Puntos de Ronda, se disputa directamente una Prórroga de 2 rondas.',
          ],
      buttonText: isEn ? 'Learn Unified Scale & Synergies' : 'Ver Escala Unificada y Sinergias',
    },

    // PASO 1: ESCALA COMPRIMIDA Y CONTADOR EN VIVO
    {
      stepId: 1,
      type: 'dialog',
      stage: 'trump_reveal',
      title: isEn
        ? '1. Unified Tactical Scale & Live Score Counters'
        : '1. Escala Táctica Unificada y Contador de Puntos en Vivo',
      subtitle: isEn
        ? 'Suit (+1/extra), Pair (+2), Straight (+4), Trio (+5) & Nominal Tiebreaker'
        : 'Palo (+1/extra), Pareja (+2), Escalera (+4), Trío (+5) y Desempate Nominal',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Unified Base Card Values (1 to 4): Every card displays a badge with its tactical base value: 2–6 = 1 pt | 7–10 = 2 pts | J, Q, K = 3 pts | Ace (A) = 4 pts.',
            'Unified Synergies: Suit (Color) = +1 pt per additional card of the same suit (2 cards = +1 pt, 3 cards = +2 pts, 4 cards = +3 pts, scaling linearly with no cap) | Pair = +2 pts | Short Straight (3 consecutive ranks) = +4 pts | Trio (3 equal ranks) = +5 pts (cancels Pair).',
            'Nominal Hierarchy Front Tiebreaker: If both teams tie in total points on a front, the front is won by the team holding the single card of highest nominal rank (2 < 3 < ... < 10 < J < Q < K < A). If both share the exact same highest rank, the front is declared Void (Nulo).',
            'Real-Time Live Score & Shadow Security: Each front shows your team\'s REAL total (including your team\'s Shadow Cards) and the rival\'s VISIBLE total (counting only face-up rival cards). Enemy Shadow Cards NEVER add points to the public counter until Revelation at the end of the round!',
          ]
        : [
            'Valores Base de las Cartas (1 al 4): Cada carta muestra una insignia con su valor táctico base: 2 al 6 = 1 pto | 7 al 10 = 2 pts | J, Q, K = 3 pts | As (A) = 4 pts.',
            'Sinergias Unificadas: Sinergia de Palo (Color) = +1 pto por cada carta adicional del mismo palo (2 cartas = +1 pto, 3 cartas = +2 pts, 4 cartas = +3 pts, escalando sin tope) | Pareja = +2 pts | Escalera Corta (3 consecutivas) = +4 pts | Trío = +5 pts (anula Pareja).',
            'Desempate en un Frente (Jerarquía Nominal): Si ambos equipos empatan en puntos en un frente, gana quien tenga la carta individual de mayor jerarquía nominal (2 < 3 < ... < 10 < J < Q < K < A). Si empatan en la carta más alta, el frente queda Nulo.',
            'Contador en Vivo y Seguridad de Sombras: Cada frente muestra en tiempo real el Total Real Aliado (incluyendo vuestras Cartas Sombra) y los Puntos Visibles del Rival. ¡Las Cartas Sombra enemigas NUNCA suman en el marcador público hasta la Revelación!',
          ],
      buttonText: isEn ? 'View Personal Shadow Rule' : 'Ver Regla de 1 Sombra Personal',
    },

    // PASO 2: 1 CARTA SOMBRA FIJA POR JUGADOR Y POR RONDA
    {
      stepId: 2,
      type: 'dialog',
      stage: 'planning',
      title: isEn
        ? '2. Individual Shadow Card Management'
        : '2. Gestión Individual de Cartas Sombra (1 por Jugador)',
      subtitle: isEn
        ? 'Personal, Non-Transferable & Refreshed Every Round'
        : 'Personal, Intransferible y Renovada en Cada Ronda',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'In Casual Mode, there is NO shared Team Shadow Pool and NO post-round shadow economy.',
            '1 Fixed Shadow per Player: At the start of EVERY round (including Round 1!), each player automatically receives 1 personal Shadow Marker (1 🌑).',
            'Personal & Non-Cumulative: You cannot transfer your marker to a teammate, and if you do not use it during the round, it is not saved — in the next round you simply start with 1 fresh Shadow Marker again.',
            'Silent Teammate Reveal: Just like in Competitive Mode, when you play your Shadow Card it is silently shown to your teammates (visible with a purple border for allies, hidden face-down for opponents until the end of the round).',
          ]
        : [
            'En el Modo Casual se desactiva el Fondo de Sombras compartido del equipo y los ingresos económicos posronda.',
            '1 Sombra Fija por Jugador: Al inicio de CADA ronda (¡incluida la Ronda 1!), cada jugador recibe automáticamente 1 Marcador de Sombra individual (1 🌑).',
            'Personal y No Acumulable: Este marcador es estrictamente personal e intransferible entre compañeros. Si no lo usas en la ronda, no se acumula; en la siguiente ronda vuelves a tener 1.',
            'Visibilidad para Compañeros: Al jugar tu Carta Sombra, se enseña en silencio a tus compañeros de equipo (visible con borde morado para aliados y oculta boca abajo para los rivales hasta el final de la ronda).',
          ],
      buttonText: isEn ? 'View 20s Turn Clock & Auto-Play' : 'Ver Reloj de 20s y Auto-Play',
    },

    // PASO 2.5: RELOJ DE TURNO INDIVIDUAL DE 20s Y AUTO-PLAY
    {
      stepId: 'team_clock',
      type: 'dialog',
      stage: 'team_clock',
      title: isEn
        ? '3. 20s Individual Turn Clock & Auto-Play'
        : '3. Reloj de Turno de 20s y Penalización Automática',
      subtitle: isEn
        ? 'Dynamic Pace Without Losing the Round on Time'
        : 'Ritmo Dinámico sin Pérdida de Ronda por Tiempo',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'In Casual Mode, the dual team clock is replaced by a fixed 20-second individual timer per turn during Deployment.',
            'Automatic Reset: Every time the turn passes to the next player, the clock resets to 00:20.',
            'Time Infraction (Auto-Play): If a player\'s 20-second timer reaches 00:00 without placing a card, the team does NOT lose the round!',
            'Instead, the system automatically plays the FIRST available card in that player\'s hand FACE UP into the valid (non-saturated) front with the FEWEST total cards at that moment (breaking ties Left -> Center -> Right), and passes the turn to the next player.',
          ]
        : [
            'En el Modo Casual se sustituye el reloj dual de equipo por un temporizador individual fijo de 20 segundos por turno durante el Despliegue.',
            'Reinicio Automático: El reloj se reinicia a 00:20 cada vez que cambia el turno al siguiente jugador.',
            'Infracción por Tiempo (Auto-play): Si el temporizador de 20 segundos llega a 00:00 sin que hayas colocado una carta, ¡NO se pierde la ronda!',
            'En su lugar, el sistema juega automáticamente la PRIMERA carta disponible de tu mano BOCA ARRIBA en el frente válido (no saturado) que tenga la MENOR cantidad total de cartas en ese instante (desempatando por orden Izquierdo -> Central -> Derecho), y pasa el turno.',
          ],
      buttonText: isEn ? 'Start Casual Mode Practice!' : '¡Iniciar Práctica en Modo Casual!',
    },

    // PASO 3: TURNO 1 - HUMANO (A1)
    {
      stepId: 3,
      type: 'player_turn',
      turnIndex: 1,
      playerId: 'A1',
      requiredCardId: 'card-kh',
      requiredFrontKey: 'center',
      requireShadow: false,
      title: isEn ? 'Turn 1 (20s Clock): Unified Scale Opening' : 'Turno 1 (Reloj 20s): Apertura con Escala Unificada',
      actionPrompt: isEn
        ? 'Select your King of Hearts (K♥ = 3 pts) and deploy it to the Center Front.'
        : 'Selecciona tu Rey de Corazones (K♥ = 3 pts) y despliégalo en el Frente Central.',
      whyThisCard: isEn
        ? 'All Face Cards (J, Q, K) are worth 3 base points ("3p" badge). Opening in the Center with K♥ puts your team ahead 3 to 0 on the live counter and starts building toward Hearts Color (+1 pt per additional Heart).'
        : 'Todas las Figuras (J, Q, K) valen 3 puntos base (fíjate en la insignia "3p" de tu K♥). Abrir en el Centro con K♥ coloca el contador en vivo 3 a 0 a vuestro favor e inicia el camino hacia el Color de Corazones (+1 pto por cada carta adicional).',
      whyNotOthers: isEn
        ? [
            { cardLabel: '4 of Clubs (4♣ = 1p)', reason: 'Cards 2 to 6 are worth only 1 point in the Unified Scale.' },
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'The Ace is worth 4 points (highest base value). Save it for a decisive front!' },
            { cardLabel: '10♠ (2p) & 8♥ (2p)', reason: 'Cards 7 to 10 are worth 2 points. Better to save 8♥ for your personal Shadow play!' },
          ]
        : [
            { cardLabel: '4 de Tréboles (4♣ = 1p)', reason: 'Las cartas del 2 al 6 valen solo 1 punto en la Escala Táctica Unificada.' },
            { cardLabel: 'As de Diamantes (A♦ = 4p)', reason: 'El As vale 4 puntos (el valor máximo). ¡Resérvalo para decidir otro frente!' },
            { cardLabel: '10♠ (2p) y 8♥ (2p)', reason: 'Las cartas del 7 al 10 valen 2 puntos. ¡Guardaremos el 8♥ para jugarlo con tu Sombra personal!' },
          ],
    },

    // PASO 4: TURNO 2 - RIVAL B1
    {
      stepId: 4,
      type: 'bot_turn',
      turnIndex: 2,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-qd', suit: 'diamonds', rank: 'Q', base: 12 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Tying the Live Counter" : 'Turno de Rival B1: Empate en el Contador en Vivo',
      actionSummary: isEn
        ? 'Rival B1 plays Queen of Diamonds (Q♦ = 3 pts) on the Center Front.'
        : 'Rival B1 juega la Reina de Diamantes (Q♦ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'In the Unified Scale, Q♦ is also worth 3 base points. Look at the Center Front live counter: it automatically updates to 3 vs 3!'
        : 'En la Escala Unificada, la Q♦ también vale 3 puntos base. Mira el contador en vivo del Frente Central: ¡se actualiza automáticamente a 3 vs 3!',
      whyNotOthers: isEn
        ? 'Even though the score is 3 vs 3, remember that front ties are broken by highest nominal card hierarchy (K♥ beats Q♦).'
        : 'Aunque el marcador en vivo indique 3 vs 3, recuerda que en caso de empate en un frente gana quien tenga la carta de mayor jerarquía nominal (tu K♥ supera a su Q♦).',
      tacticalInsight: isEn
        ? 'No mental calculation needed: the live counter on each front always shows both teams\' current points.'
        : 'Sin cálculo mental: el marcador en vivo de cada frente te muestra al instante los puntos actuales de ambos bandos.',
    },

    // PASO 5: TURNO 3 - ALIADO A2
    {
      stepId: 5,
      type: 'bot_turn',
      turnIndex: 3,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-qh', suit: 'hearts', rank: 'Q', base: 12 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: 2-Card Color (+1 pt)!" : 'Turno de Aliado A2: ¡Color de 2 Cartas (+1 pto)!',
      actionSummary: isEn
        ? 'Ally A2 plays Queen of Hearts (Q♥ = 3 pts) on the Center Front.'
        : 'Aliado A2 juega la Reina de Corazones (Q♥ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'A2 adds Q♥ (3 pts) to your K♥ (3 pts). With 2 Hearts on the front, your team activates Color (+1 pt for 1 additional Heart), bringing the live counter to 3 + 3 + 1 = 7 pts vs 3!'
        : 'A2 suma su Q♥ (3 pts) a tu K♥ (3 pts). ¡Al juntar 2 Corazones en el frente, activáis el Color (+1 pto por 1 carta adicional), subiendo el marcador en vivo a 3 + 3 + 1 = 7 pts vs 3!',
      whyNotOthers: isEn
        ? 'Having 2 Hearts on the table already grants +1 pt and sets up your next turn to add more Hearts (+1 pt per additional card).'
        : 'Tener 2 Corazones en mesa ya os da +1 pto de Color y deja listo el frente para que sigáis sumando Corazones (+1 pto por cada carta extra).',
      tacticalInsight: isEn
        ? 'Unified Color Rule: +1 point per additional card of the same suit played by the team on that front.'
        : 'Regla Unificada de Color: +1 punto por cada carta adicional del mismo palo jugada por el equipo en ese frente.',
    },

    // PASO 6: TURNO 4 - RIVAL B2
    {
      stepId: 6,
      type: 'bot_turn',
      turnIndex: 4,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-ks', suit: 'spades', rank: 'K', base: 13 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: Opening the Right Front" : 'Turno de Rival B2: Apertura del Frente Derecho',
      actionSummary: isEn
        ? 'Rival B2 plays King of Spades (K♠ = 3 pts) on the Right Front.'
        : 'Rival B2 juega el Rey de Picas (K♠ = 3 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'Seeing your team leading 7 vs 3 in the Center, B2 opens the Right Front with K♠ (3 pts).'
        : 'Al ver que domináis el Centro 7 a 3, B2 abre el Frente Derecho con su K♠ (3 pts).',
      whyNotOthers: isEn
        ? 'Remember: winning 2 fronts awards +2 Round Points, and sweeping all 3 fronts awards +3 Round Points.'
        : 'Recuerda: ganar 2 frentes otorga +2 Puntos de Ronda y ganar los 3 frentes (Pleno) otorga +3 Puntos de Ronda.',
      tacticalInsight: isEn
        ? 'Look at the Right Front live counter: 0 vs 3 pts.'
        : 'Observa el contador en vivo del Frente Derecho: 0 vs 3 pts.',
    },

    // PASO 7: TURNO 5 - HUMANO (A1)
    {
      stepId: 7,
      type: 'player_turn',
      turnIndex: 5,
      playerId: 'A1',
      requiredCardId: 'card-10s',
      requiredFrontKey: 'right',
      requireShadow: false,
      title: isEn ? 'Turn 2: Contesting the Right Flank' : 'Tu Turno 2: Disputa en el Flanco Derecho',
      actionPrompt: isEn
        ? 'Select your Ten of Spades (10♠ = 2 pts) and deploy it to the Right Front.'
        : 'Selecciona tu Diez de Picas (10♠ = 2 pts) y despliégalo en el Frente Derecho.',
      whyThisCard: isEn
        ? 'Cards from 7 to 10 are worth 2 base points ("2p"). Playing 10♠ on the Right Front puts you right behind the rival (2 vs 3 pts) while keeping your 8♥ for the Center Color combo and your A♦ (4p) for the Left Front!'
        : 'Las cartas del 7 al 10 valen 2 puntos base ("2p"). Jugar el 10♠ en el Frente Derecho te deja muy cerca del rival (2 vs 3 pts), reservando tu 8♥ para el Color en el Centro y tu A♦ (4p) para la Izquierda.',
      whyNotOthers: isEn
        ? [
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'Save your 4-point Ace to dominate the Left Front!' },
            { cardLabel: '8 of Hearts (8♥ = 2p)', reason: 'We need 8♥ in the Center to extend the Hearts Color bonus!' },
          ]
        : [
            { cardLabel: 'As de Diamantes (A♦ = 4p)', reason: '¡Guarda tu As de 4 puntos para dominar el Frente Izquierdo!' },
            { cardLabel: '8 de Corazones (8♥ = 2p)', reason: '¡Necesitamos el 8♥ en el Centro para ampliar el Color de Corazones!' },
          ],
    },

    // PASO 8: TURNO 6 - RIVAL B1
    {
      stepId: 8,
      type: 'bot_turn',
      turnIndex: 6,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-jh', suit: 'hearts', rank: 'J', base: 11 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Pressuring the Center" : 'Turno de Rival B1: Presión en el Centro',
      actionSummary: isEn
        ? 'Rival B1 plays Jack of Hearts (J♥ = 3 pts) on the Center Front.'
        : 'Rival B1 juega la Jota de Corazones (J♥ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'B1 adds J♥ (3 pts) to Q♦ (3 pts), bringing the Center live counter to 7 vs 6 (you still lead thanks to your +1 Color bonus!).'
        : 'B1 suma su J♥ (3 pts) a la Q♦ (3 pts), dejando el contador en vivo del Centro 7 a 6 (¡seguís por delante gracias a vuestro +1 de Color!).',
      whyNotOthers: isEn
        ? 'B1 has two different suits (Q♦ and J♥), so they do not get the +1 Color bonus yet.'
        : 'B1 tiene dos palos distintos (Q♦ y J♥), por lo que no suma el +1 de Color.',
      tacticalInsight: isEn
        ? 'Now it is time to break the Center wide open with your personal Shadow Card and extend the Hearts Color bonus!'
        : '¡Ahora ampliaremos la ventaja en el Centro con tu Carta Sombra personal y sumaremos más Color de Corazones!',
    },

    // PASO 9: TURNO 7 - ALIADO A2
    {
      stepId: 9,
      type: 'bot_turn',
      turnIndex: 7,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-jd', suit: 'diamonds', rank: 'J', base: 11 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Opening the Left Front" : 'Turno de Aliado A2: Apertura del Frente Izquierdo',
      actionSummary: isEn
        ? 'Ally A2 plays Jack of Diamonds (J♦ = 3 pts) on the Left Front.'
        : 'Aliado A2 juega la Jota de Diamantes (J♦ = 3 pts) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'A2 opens the Left Front with J♦ (3 pts), giving your team a 3 vs 0 lead on the Left live counter.'
        : 'A2 abre el Frente Izquierdo con su J♦ (3 pts), poniendo el contador en vivo de la Izquierda 3 a 0 a vuestro favor.',
      whyNotOthers: isEn
        ? 'Opening Diamonds on the Left prepares a future Diamond Color synergy (+1 pt per additional card) with your Ace of Diamonds!'
        : 'Abrir con Diamantes en la Izquierda prepara una futura sinergia de Color de Diamantes (+1 pto por cada carta extra) con tu As de Diamantes.',
      tacticalInsight: isEn
        ? 'Look at all 3 live counters: Left (3 vs 0), Center (7 vs 6), Right (2 vs 3).'
        : 'Mira los 3 contadores en vivo: Izquierdo (3 vs 0), Central (7 vs 6), Derecho (2 vs 3).',
    },

    // PASO 10: TURNO 8 - RIVAL B2
    {
      stepId: 10,
      type: 'bot_turn',
      turnIndex: 8,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-7s', suit: 'spades', rank: '7', base: 7 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: 2-Spade Color (+1 pt) on the Right" : 'Turno de Rival B2: Color de 2 Picas (+1 pto) en la Derecha',
      actionSummary: isEn
        ? 'Rival B2 plays 7 of Spades (7♠ = 2 pts) on the Right Front.'
        : 'Rival B2 juega el 7 de Picas (7♠ = 2 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'B2 adds 7♠ (2 pts) to K♠ (3 pts) on the Right. With 2 Spades, Team B activates Color (+1 pt for 1 extra Spade), bringing the Right live counter to 2 vs 6 pts (3 + 2 + 1 Color)!'
        : 'B2 añade el 7♠ (2 pts) a su K♠ (3 pts) en la Derecha. ¡Al juntar 2 Picas, el Equipo B activa Color (+1 pto por 1 Pica extra), subiendo el marcador de la Derecha a 2 vs 6 pts (3 + 2 + 1 Color)!',
      whyNotOthers: isEn
        ? 'B2 is preparing to add another Spade later to continue adding +1 pt per additional card on the Right.'
        : 'B2 busca añadir otra Pica más adelante para seguir sumando +1 pto por cada carta extra en la Derecha.',
      tacticalInsight: isEn
        ? 'Your turn is next: let\'s use your 1 personal Shadow Marker of the round!'
        : 'Te toca tirar: ¡vamos a usar tu Marcador de Sombra personal de esta ronda!',
    },

    // PASO 11: TURNO 9 - HUMANO (A1) -> 1 SOMBRA PERSONAL FIJA
    {
      stepId: 11,
      type: 'player_turn',
      turnIndex: 9,
      playerId: 'A1',
      requiredCardId: 'card-8h',
      requiredFrontKey: 'center',
      requireShadow: true,
      title: isEn ? 'Turn 3: YOUR 1 PERSONAL SHADOW & HEARTS COLOR!' : 'Tu Turno 3: ¡TU SOMBRA PERSONAL Y COLOR DE CORAZONES!',
      actionPrompt: isEn
        ? 'Activate "Play as Shadow (1/1)", select your 8 of Hearts (8♥ = 2 pts), and deploy it to the Center Front.'
        : 'Activa el botón "Jugar como Sombra (1/1)", selecciona tu 8 de Corazones (8♥ = 2 pts) y colócalo en el Frente Central.',
      whyThisCard: isEn
        ? 'In Casual Mode, every player gets 1 personal Shadow Marker per round. By playing 8♥ (2 pts) as a Shadow in the Center, your team reaches 3 Hearts (K♥, Q♥, 8♥) and scores +2 synergy points for 2 additional Hearts! Notice how your Allied Real Total on the Center counter immediately jumps to 10 pts (3 + 3 + 2 + 2 Color) because teammates know your Shadow, while rivals only see 7 visible pts + 1 hidden Shadow!'
        : 'En Modo Casual, cada jugador recibe 1 Marcador de Sombra personal fijo por ronda. Al jugar tu 8♥ (2 pts) como Sombra en el Centro, vuestro equipo reúne 3 Corazones (K♥, Q♥, 8♥) y suma +2 pts de sinergia por 2 cartas adicionales. Observa cómo vuestro Total Real Aliado en el contador del Centro sube al instante a 10 pts (3 + 3 + 2 + 2 Color) porque tu equipo conoce tu Sombra, ¡mientras que los rivales solo ven 7 pts visibles + 1 Sombra oculta!',
      whyNotOthers: isEn
        ? [
            { cardLabel: '4 of Clubs (4♣ = 1p)', reason: 'Does not extend the Hearts Color synergy in the Center.' },
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'Reserved to win the Left Front!' },
          ]
        : [
            { cardLabel: '4 de Tréboles (4♣ = 1p)', reason: 'No amplía la sinergia de Color de Corazones en el Centro.' },
            { cardLabel: 'As de Diamantes (A♦ = 4p)', reason: 'Reservado para ganar el Frente Izquierdo.' },
          ],
    },

    // PASO 12: TURNO 10 - RIVAL B1
    {
      stepId: 12,
      type: 'bot_turn',
      turnIndex: 10,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-5d', suit: 'diamonds', rank: '5', base: 5 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Testing the Left Front" : 'Turno de Rival B1: Tanteo en la Izquierda',
      actionSummary: isEn
        ? 'Rival B1 plays 5 of Diamonds (5♦ = 1 pt) on the Left Front.'
        : 'Rival B1 juega el 5 de Diamantes (5♦ = 1 pto) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Intimidated by your Shadow Card in the Center, B1 plays 5♦ (1 pt) on the Left Front (live counter: 3 vs 1).'
        : 'Intimidado por tu Carta Sombra en el Centro, B1 juega su 5♦ (1 pto) en el Frente Izquierdo (contador en vivo: 3 vs 1).',
      whyNotOthers: isEn
        ? 'Remember: if a player takes more than 20 seconds on their turn, the system auto-plays their first card face up in the front with fewest cards!'
        : 'Recuerda: si un jugador tarda más de 20 segundos en su turno, el sistema juega automáticamente su 1ª carta boca arriba en el frente con menos cartas.',
      tacticalInsight: isEn
        ? 'You have used your 1 personal Shadow Marker for this round (0/1 left). Next round you will automatically get 1 again!'
        : 'Ya has usado tu Marcador de Sombra personal de esta ronda (0/1). ¡En la siguiente ronda volverás a recibir 1 automáticamente!',
    },

    // PASO 13: TURNO 11 - ALIADO A2
    {
      stepId: 13,
      type: 'bot_turn',
      turnIndex: 11,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-9h', suit: 'hearts', rank: '9', base: 9 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Locking Down the Center" : 'Turno de Aliado A2: Blindaje del Centro',
      actionSummary: isEn
        ? 'Ally A2 plays 9 of Hearts (9♥ = 2 pts) on the Center Front.'
        : 'Aliado A2 juega el 9 de Corazones (9♥ = 2 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'A2 adds 9♥ (2 pts) to the Center. With 4 Hearts, Team A scores Base (3+3+2+2 = 10) + Color (+3 for 3 extra Hearts) = 13 real allied points!'
        : 'A2 añade el 9♥ (2 pts) al Centro. Con 4 Corazones, el Equipo A suma Base (3+3+2+2 = 10) + Color (+3 por 3 cartas extra) = ¡13 puntos reales aliados!',
      whyNotOthers: isEn
        ? '13 points in the Unified Scale is an almost unbeatable fortress in the Center.'
        : '13 puntos en la Escala Unificada es una fortaleza casi inexpugnable en el Centro.',
      tacticalInsight: isEn
        ? 'Center Live Counter: 13 Allied Real Pts (incl. Shadow) vs 6 Rival Visible Pts.'
        : 'Contador en Vivo del Centro: 13 Pts Reales Aliados (incl. Sombra) vs 6 Pts Visibles del Rival.',
    },

    // PASO 14: TURNO 12 - RIVAL B2 -> SOMBRA RIVAL (SEGURIDAD DE INFORMACIÓN OCULTA)
    {
      stepId: 14,
      type: 'bot_turn',
      turnIndex: 12,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-10d', suit: 'diamonds', rank: '10', base: 10 },
      frontKey: 'left',
      asShadow: true,
      title: isEn ? "Rival B2's Turn: Enemy Shadow & Live Score Security!" : 'Turno de Rival B2: ¡Sombra Enemiga y Seguridad del Contador!',
      actionSummary: isEn
        ? 'Rival B2 uses their 1 personal Shadow Marker on the Left Front.'
        : 'Rival B2 usa su Marcador de Sombra personal en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Look closely at the Left Front live counter! B2 played a Shadow Card, yet the Rival Visible Score stays at 1 pt (+1 SHADOW badge). Why? Because in Casual Mode, enemy Shadow Cards NEVER add points to the public counter until Revelation at the end of the round, preventing any information leak!'
        : '¡Fíjate muy bien en el contador en vivo del Frente Izquierdo! B2 ha jugado una Carta Sombra, pero los Puntos Visibles del Rival siguen marcando 1 pto (+1 SOMBRA). ¿Por qué? ¡Porque las Cartas Sombra enemigas NUNCA suman puntos en el marcador público hasta la Fase de Revelación al final de la ronda, evitando filtraciones de información!',
      whyNotOthers: isEn
        ? 'B2 tries to ambush your Left Front with hidden strength.'
        : 'B2 intenta tender una emboscada en el Frente Izquierdo con fuerza oculta.',
      tacticalInsight: isEn
        ? 'Hidden Information Security: You see your own team\'s shadow points in real time, but rival shadows remain secret until round end!'
        : 'Seguridad de Información Oculta: Ves los puntos de las sombras de tu equipo en vivo, pero las sombras rivales permanecen secretas hasta el final.',
    },

    // PASO 15: TURNO 13 - HUMANO (A1) -> AS DE DIAMANTES (4 PTS)
    {
      stepId: 15,
      type: 'player_turn',
      turnIndex: 13,
      playerId: 'A1',
      requiredCardId: 'card-ad',
      requiredFrontKey: 'left',
      requireShadow: false,
      title: isEn ? 'Turn 4: Deploying the 4-Point Ace!' : 'Tu Turno 4: ¡Desplegando el As de 4 Puntos!',
      actionPrompt: isEn
        ? 'Select your Ace of Diamonds (A♦ = 4 pts) and deploy it to the Left Front.'
        : 'Selecciona tu As de Diamantes (A♦ = 4 pts) y despliégalo en el Frente Izquierdo.',
      whyThisCard: isEn
        ? 'The Ace (A) is worth 4 base points ("4p") — the highest base value! Placing A♦ on the Left Front alongside A2\'s J♦ (3p) activates 2-Diamond Color (+1 pt), bringing your Left live counter to 8 pts (3 + 4 + 1 Color) and preparing further Color when A2 plays their 3rd Diamond!'
        : 'El As (A) vale 4 puntos base ("4p"), ¡el valor individual más alto del juego! Colocar tu A♦ en el Frente Izquierdo junto a la J♦ (3p) de A2 activa el Color de 2 Diamantes (+1 pto), subiendo vuestro contador en vivo a 8 pts (3 + 4 + 1 Color) y dejando preparado más Color cuando A2 juegue su 3er Diamante.',
      whyNotOthers: isEn
        ? [
            { cardLabel: '4 of Clubs (4♣ = 1p)', reason: 'Only 1 point and does not help build Diamond Color on the Left.' },
          ]
        : [
            { cardLabel: '4 de Tréboles (4♣ = 1p)', reason: 'Solo aporta 1 punto y no ayuda a completar el Color de Diamantes en la Izquierda.' },
          ],
    },

    // PASO 16: TURNO 14 - RIVAL B1
    {
      stepId: 16,
      type: 'bot_turn',
      turnIndex: 14,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-2c', suit: 'clubs', rank: '2', base: 2 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Reinforcing the Right" : 'Turno de Rival B1: Refuerzo en la Derecha',
      actionSummary: isEn
        ? 'Rival B1 plays Two of Clubs (2♣ = 1 pt) on the Right Front.'
        : 'Rival B1 juega el Dos de Tréboles (2♣ = 1 pto) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'B1 adds 1 point to the Right Front (live counter: 2 vs 7 pts).'
        : 'B1 suma 1 punto en el Frente Derecho (contador en vivo: 2 vs 7 pts).',
      whyNotOthers: isEn
        ? 'Note: In Casual Mode, there are NO cumulative points across rounds! Only Round Points (+1, +2, +3) matter.'
        : 'Nota clave: ¡En Modo Casual NO existen los puntos acumulados entre rondas! Solo importan los Puntos de Ronda (+1, +2, +3).',
      tacticalInsight: isEn
        ? 'If a Casual match ends tied in Round Points after the agreed rounds, it goes directly to a 2-Round Overtime!'
        : 'Si una partida en Modo Casual termina empatada a Puntos de Ronda, ¡se desempata directamente con una Prórroga de 2 rondas!',
    },

    // PASO 17: TURNO 15 - ALIADO A2
    {
      stepId: 17,
      type: 'bot_turn',
      turnIndex: 15,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-6s', suit: 'spades', rank: '6', base: 6 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Playing on the Right" : 'Turno de Aliado A2: Jugada en la Derecha',
      actionSummary: isEn
        ? 'Ally A2 plays Six of Spades (6♠ = 1 pt) on the Right Front.'
        : 'Aliado A2 juega el Seis de Picas (6♠ = 1 pto) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'A2 plays 6♠ (1 pt) on the Right, saving 3♦ for the final turn on the Left to complete your 3-Diamond Color (+2 pts)!'
        : 'A2 juega su 6♠ (1 pto) en la Derecha, reservando su 3♦ para el último turno en la Izquierda con el que completará vuestro Color de 3 Diamantes (+2 pts).',
      whyNotOthers: isEn
        ? 'Notice that on the Right you now have 10♠ (2p) + 6♠ (1p) + 2-Spade Color (+1) = 4 pts.'
        : 'Observa que en la Derecha tenéis ahora 10♠ (2p) + 6♠ (1p) + Color de 2 Picas (+1) = 4 pts.',
      tacticalInsight: isEn
        ? 'One last card in your hand!'
        : '¡Te queda una última carta en la mano!',
    },

    // PASO 18: TURNO 16 - RIVAL B2
    {
      stepId: 18,
      type: 'bot_turn',
      turnIndex: 16,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-4d', suit: 'diamonds', rank: '4', base: 4 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: Contesting the Left" : 'Turno de Rival B2: Disputa en la Izquierda',
      actionSummary: isEn
        ? 'Rival B2 plays Four of Diamonds (4♦ = 1 pt) on the Left Front.'
        : 'Rival B2 juega el Cuatro de Diamantes (4♦ = 1 pto) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'B2 places 4♦ (1 pt) on the Left. Visible rival score on the Left is now 3 pts (5♦ + 4♦ + 1 Color for 2 visible Diamonds) plus their hidden Shadow Card!'
        : 'B2 coloca su 4♦ (1 pto) en la Izquierda. La puntuación visible del rival en la Izquierda es ahora de 3 pts (5♦ + 4♦ + 1 de Color por 2 Diamantes visibles) más su Carta Sombra oculta.',
      whyNotOthers: isEn
        ? 'Even if their hidden card is a Diamond (giving them 3 Diamonds = +2 Color), your J♦ (3p) + A♦ (4p) + A2\'s upcoming 3♦ (1p) + Color (+2) = 10 pts will secure the win!'
        : 'Aunque su carta oculta sea otro Diamante (dándoles 3 Diamantes = +2 Color), vuestra J♦ (3p) + A♦ (4p) + el 3♦ (1p) de A2 + Color (+2) = ¡10 pts os darán la victoria!',
      tacticalInsight: isEn
        ? 'Time for your final card of the round!'
        : '¡Hora de jugar tu última carta de la ronda!',
    },

    // PASO 19: TURNO 17 - HUMANO (A1) -> ÚLTIMA CARTA
    {
      stepId: 19,
      type: 'player_turn',
      turnIndex: 17,
      playerId: 'A1',
      requiredCardId: 'card-4c',
      requiredFrontKey: 'right',
      requireShadow: false,
      title: isEn ? 'Final Turn: Closing Deployment' : 'Tu Turno Final: Cierre del Despliegue',
      actionPrompt: isEn
        ? 'Deploy your final card, the Four of Clubs (4♣ = 1 pt), to the Right Front.'
        : 'Despliega tu última carta, el Cuatro de Tréboles (4♣ = 1 pto), en el Frente Derecho.',
      whyThisCard: isEn
        ? 'You deploy your final card (4♣ = 1 pt) on the Right Front. Remember: in Casual Mode there is no cumulative score tiebreaker across rounds — if the match ends tied in Round Points after 4, 6, or 8 rounds, you play a direct 2-Round Overtime!'
        : 'Despliegas tu última carta (4♣ = 1 pto) en el Frente Derecho. Recuerda: en el Modo Casual no se usan puntos acumulados para desempatar la partida; si al terminar las rondas acordadas (4, 6 u 8) hay empate en Puntos de Ronda, ¡se juega directamente una Prórroga de 2 rondas!',
      whyNotOthers: isEn
        ? [{ cardLabel: 'No other cards', reason: 'Final card in hand.' }]
        : [{ cardLabel: 'Ninguna otra', reason: 'Última carta de tu mano.' }],
    },

    // PASO 20: CONCLUSIÓN DE DESPLIEGUE DE LOS BOTS
    {
      stepId: 20,
      type: 'bot_turn',
      turnIndex: 18,
      botId: 'B1',
      botName: isEn ? 'Rival B1 / Ally A2 / Rival B2' : 'Rival B1 / Aliado A2 / Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-9s', suit: 'spades', rank: '9', base: 9 },
      frontKey: 'right',
      asShadow: false,
      title: isEn
        ? 'Deployment Complete: Watch the Final Live Counters!'
        : 'Fin del Despliegue: ¡Observa los Contadores en Vivo!',
      actionSummary: isEn
        ? 'B1 plays 9♠ (2p) on the Right (reaching 3 Spades = +2 Color!), Ally A2 plays 3♦ (1p) on the Left (reaching 3 Diamonds = +2 Color!), and Rival B2 plays 5♥ (1p) in the Center (reaching 2 Hearts = +1 Color!).'
        : 'B1 juega 9♠ (2p) en la Derecha (¡logrando 3 Picas = +2 Color!), Aliado A2 juega 3♦ (1p) en la Izquierda (¡logrando 3 Diamantes = +2 Color!) y Rival B2 juega 5♥ (1p) en el Centro (¡2 Corazones = +1 Color!).',
      whyPlayed: isEn
        ? 'All 20 cards are on the table! In the next step, Shadow Cards flip face-up and the live counters update with the final revealed score of both teams.'
        : '¡Las 20 cartas están en mesa! En el siguiente paso se voltean las Cartas Sombra y los contadores de cada frente se actualizan con el total definitivo de ambos equipos.',
      whyNotOthers: isEn
        ? 'No cards left in hand.'
        : 'No quedan cartas en mano.',
      tacticalInsight: isEn
        ? 'Let\'s reveal all Shadow Cards and see the final Casual Mode scoreboard!'
        : '¡Vamos a revelar todas las Cartas Sombra y ver el marcador final en Modo Casual!',
    },

    // PASO 21: RESOLUCIÓN EN MODO CASUAL
    {
      stepId: 21,
      type: 'resolution',
      title: isEn
        ? 'Casual Mode Resolution: Shadows Revealed & Final Totals'
        : 'Resolución en Modo Casual: Sombras Reveladas y Totales Finales',
      subtitle: isEn
        ? 'Unified Tactical Scale Breakdown & Direct Overtime Rule'
        : 'Desglose con Escala Táctica Unificada y Regla de Prórroga Directa',
    },

    // PASO 22: GRADUACIÓN MODO CASUAL
    {
      stepId: 22,
      type: 'conclusion',
      title: isEn
        ? 'CASUAL MODE (PARTY) MASTERED!'
        : '¡MODO CASUAL (PARTY / AMIGOS) DOMINADO!',
      subtitle: isEn
        ? 'You are ready to play fast, fun Party matches with friends'
        : 'Ya estás listo para disfrutar partidas ágiles y dinámicas con amigos',
    },
  ];
}

// Función constructora de pasos según idioma y modalidad ('competitive' | 'casual')
export function getTutorialSteps(lang = 'es', tutorialMode = 'competitive') {
  if (tutorialMode === 'casual') {
    return getCasualTutorialSteps(lang);
  }
  const isEn = lang === 'en';

  return [
    // PASO 0: INTRODUCCIÓN GENERAL
    {
      stepId: 0,
      type: 'dialog',
      stage: 'intro',
      title: isEn
        ? 'Welcome to the WarFronts Academy!'
        : '¡Bienvenido a la Academia de Frentes de Guerra!',
      subtitle: isEn
        ? 'Guided Tactical Instruction: 2 vs 2 Mode (2v2) — v2.1'
        : 'Instrucción Táctica Guiada: Modalidad 2 contra 2 (2v2) — v2.1',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'You are about to play a guided 2v2 match with bots. Here you will learn how every rule, calculation, and tactical decision works in Official Competitive Mode v2.1 (Unified Tactical Scale).',
            'In 2v2 you play alongside your partner (Ally A2) against two opponents (B1 and B2). There are 3 battlefronts: Left, Center, and Right.',
            'Official 1, 2 & 3 Round Points System: At the end of deployment, Round Points are awarded based on how many fronts your team conquers:',
            '• Tie in the Round (e.g. 1 front each and 1 void, or all 3 void): +1 Round Point for EACH team.',
            '• Standard Victory (winning 2 of the 3 fronts): +2 Round Points for the winning team.',
            '• Total Dominance / "Full Sweep" (winning all 3 fronts): +3 Round Points for the winning team!',
            'In this tutorial we will guide you step by step: each card to play will be highlighted, we will explain why it is the optimal move and why you should not play other cards, and we will analyze responses from opponents and allies.',
          ]
        : [
            'Estás a punto de disputar una partida guiada de 2v2 con bots. Aquí aprenderás exactamente cómo funciona cada regla, cada cálculo y cada decisión táctica del Modo Competitivo Oficial v2.1 (Escala Táctica Unificada).',
            'En 2v2 juegas junto a tu compañero (Aliado A2) frente a dos rivales (B1 y B2). Hay 3 frentes de combate: Izquierdo, Central y Derecho.',
            'Sistema Oficial de Puntuación por Ronda (1, 2 y 3 Puntos): Al finalizar el despliegue, los Puntos de Ronda se reparten según vuestro dominio:',
            '• Empate en la ronda (ej. cada equipo gana 1 frente y el otro es nulo, o todos son nulos): +1 Punto de Ronda para CADA equipo.',
            '• Victoria estándar (ganar 2 de los 3 frentes): +2 Puntos de Ronda para el equipo ganador.',
            '• Dominio Total / "Pleno" (ganar los 3 frentes): ¡+3 Puntos de Ronda para el equipo ganador!',
            'En este tutorial te llevaremos de la mano: cada carta a jugar estará indicada, te explicaremos por qué es la jugada ideal y por qué no debes usar las otras cartas, y analizaremos las respuestas de rivales y aliados.',
          ],
      buttonText: isEn ? 'Begin Instruction' : 'Comenzar Instrucción',
    },

    // PASO 1: SISTEMA OFICIAL DE PUNTUACIÓN, SINERGIAS E INICIATIVA
    {
      stepId: 1,
      type: 'dialog',
      stage: 'trump_reveal',
      title: isEn
        ? 'Phase 1: Unified Tactical Scale, Synergies & Tiebreakers'
        : 'Fase 1: Escala Táctica Unificada, Sinergias y Desempates',
      subtitle: isEn
        ? 'Base Values (1–4), Synergies & Nominal Hierarchy'
        : 'Valores Base (1 al 4), Sinergias y Jerarquía Nominal',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Unified Base Card Values (1 to 4): Low Cards (2, 3, 4, 5, 6) = 1 pt | Medium Cards (7, 8, 9, 10) = 2 pts | Face Cards (J, Q, K) = 3 pts | Ace (A) = 4 pts (the highest single card!).',
            'Four Strategic Formation Synergies: Suit Synergy (+1 pt per additional card of the same suit in the front, scaling linearly with no cap), Pair (+2 pts for 2 equal ranks), Short Straight (+4 pts for 3 consecutive ranks), and Trio (+5 pts for 3 equal ranks, which cancels Pair).',
            'Front Tiebreaker (Nominal Hierarchy): If both teams tie in total points on a front, the front is won by the team holding the single card of highest nominal rank (2 < 3 < ... < 10 < J < Q < K < A). If both tie on the highest nominal card, the front is Void (Nulo).',
            'Match Tiebreakers (No Cumulative Points): Match ties in Round Points are decided first by Shadow Efficiency (the team with MORE unspent Shadow Markers in their Team Pool wins). If still tied, a 2-Round Overtime is played!',
            'Shadow Economy: Teams start Round 1 with 0 markers and earn them at round end (+1 win, +2 loss, +3 defeat streak of 2+, +1 tie in 2v2). Markers accumulate in the shared pool. (We simulate 2 markers in this drill for practice).',
          ]
        : [
            'Valores Base Unificados (1 al 4): Cartas Bajas (2, 3, 4, 5, 6) = 1 pto | Cartas Medias (7, 8, 9, 10) = 2 pts | Figuras (J, Q, K) = 3 pts | As (A) = 4 pts (¡la carta individual más alta!).',
            'Cuatro Formaciones Estratégicas por Sinergia: Sinergia de Palo (+1 pto por cada carta adicional del mismo palo en el frente, escalando linealmente sin tope), Pareja (+2 pts por 2 de igual valor), Escalera Corta (+4 pts por 3 cartas consecutivas) y Trío (+5 pts por 3 cartas de igual valor, anulando la pareja de esas cartas).',
            'Desempate en un Frente (Jerarquía Nominal): Si ambos equipos empatan en puntos en un frente, gana el equipo con la carta individual de mayor jerarquía nominal (2 < 3 < ... < 10 < J < Q < K < A). Si empatan en la carta más alta, el frente queda Nulo.',
            'Desempate de Partida (Sin Puntos Acumulados): El empate final en Puntos de Ronda se decide en primer lugar por Eficiencia de Sombras (gana quien conserve más Marcadores de Sombra sin gastar en su Fondo de Equipo). ¡Si persiste el empate, se disputa una Prórroga de 2 Rondas!',
            'Economía de Sombras: Los equipos inician la Ronda 1 con 0 marcadores y ganan ingresos al final de cada ronda (+1 victoria, +2 derrota, +3 racha de 2+ derrotas, +1 empate en 2v2). Se ahorran en el fondo de equipo. (Simulamos 2 marcadores en este tutorial para la práctica).',
          ],
      buttonText: isEn ? 'View Planning Phase' : 'Ver Fase de Planificación',
    },

    // PASO 2: FASE TÁCTICA SIN CARTAS
    {
      stepId: 2,
      type: 'dialog',
      stage: 'planning',
      title: isEn
        ? 'Phase 2: Team Tactics (No Cards in Hand)'
        : 'Fase 2: Táctica de Equipo (Sin Cartas en Mano)',
      subtitle: isEn
        ? 'The rule that eliminates the "Alpha Player"'
        : 'La regla que elimina al "Jugador Alfa"',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'In official rules, before receiving cards there is a 30-second tactical phase where players plan with NO CARDS in hand.',
            'Why without cards? Because in cooperative games a dominant player often dictates what others should do. By having no cards yet, the team must agree on macro-strategy: for instance, "let us secure the Center and a Flank for +2 points, or push for the 3-front Full Sweep (+3 points) if we draw strong hands".',
            'Shadow Economy & Clock Budget: During these 30 seconds, the team decides how many shadow markers from their accumulated reserve to invest this round or save for future rounds, and coordinates team clock pacing.',
          ]
        : [
            'En el reglamento oficial, antes de recibir cartas hay una fase táctica de 30 segundos donde los jugadores planifican SIN CARTAS en mano.',
            '¿Por qué sin cartas? Porque en los juegos cooperativos a menudo un jugador dominante le dice a los demás qué hacer. Al no tener cartas aún, el equipo debe acordar la macro-estrategia: por ejemplo, "aseguremos con fuerza el Centro y un Flanco para sumar +2 puntos, o busquemos el Pleno de 3 frentes (+3 puntos) si robamos buenas manos".',
            'Economía de Sombras y Presupuesto de Reloj: Durante estos 30 segundos, el equipo decide cuántos marcadores de sombra de su reserva acumulada invertirá en la ronda o ahorrará para rondas posteriores, y pacta el ritmo de juego del reloj compartido.',
          ],
      buttonText: isEn ? 'View Shared Team Clock' : 'Ver Reloj de Equipo Compartido',
    },

    // PASO 2.5: REGLA OFICIAL - EL RELOJ DE EQUIPO COMPARTIDO
    {
      stepId: 'team_clock',
      type: 'dialog',
      stage: 'team_clock',
      title: isEn
        ? 'Official Rule: Shared Team Clock'
        : 'Nueva Regla Oficial: El Reloj de Equipo Compartido',
      subtitle: isEn
        ? 'Team Time Management (Dual Chess Clock)'
        : 'Gestión del Tiempo por Equipos (Dual Chess Clock)',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'In WarFronts, time is NOT individual per turn. The clock is SHARED across the entire team.',
            'Joint time pool: Each team has a total time pool per round (e.g. in 2v2: Fast = 1m 40s, Medium = 3m 20s, Slow = 5m 00s). Seconds consumed by each player during their turn are deducted from their team\'s global clock.',
            'Clock switching: Your team\'s clock ticks while you or your ally think and make a play. The exact instant you place your card on a front, your clock stops and the opposing team\'s clock activates immediately.',
            'Per-round reset: The team clock resets to full value at the start of each new round. Unused time from a round does not carry over to subsequent ones.',
            'Flag Fall Rule (00:00): If a team\'s clock reaches 00:00 before completing its turns, it automatically loses the round and the opponent scores +2 Round Points directly (or +3 Round Points if at that instant the opponent already led all 3 fronts with all cards played)!',
          ]
        : [
            'En Frentes de Guerra el tiempo NO es individual por turno. El reloj es COMPARTIDO para todo el equipo.',
            'Bolsa de tiempo conjunta: Cada equipo dispone de un tiempo total por ronda (ejemplo en 2v2: Rápido = 1m 40s, Medio = 3m 20s, Lento = 5m 00s). Los segundos que consuma cada jugador durante su turno se restan al reloj global de su equipo.',
            'Conmutación del reloj: El reloj de tu equipo corre mientras tú o tu aliado pensáis y realizáis la jugada. En el instante exacto en que colocáis la carta en el frente, vuestro reloj se detiene y se activa de inmediato el reloj del equipo rival.',
            'Reseteo por ronda: El reloj de equipo se reinicia al valor completo al inicio de cada nueva ronda. El tiempo sobrante de una ronda no se acumula para las siguientes.',
            'Regla de Caída de Bandera (00:00): Si el reloj de un equipo llega a 00:00 antes de completar sus turnos, ¡pierde automáticamente la ronda y el rival suma +2 Puntos de Ronda directos (o +3 Puntos si en ese instante el rival ya dominaba los 3 frentes habiendo jugado todas sus cartas)!',
          ],
      buttonText: isEn ? 'Understood! Start Card Deployment' : '¡Entendido! Iniciar Despliegue de Cartas',
    },

    // =========================================================================
    // CICLO 1: TURNOS 1 AL 4
    // =========================================================================

    // PASO 3: TURNO 1 - HUMANO (A1)
    {
      stepId: 3,
      type: 'player_turn',
      turnIndex: 1,
      playerId: 'A1',
      requiredCardId: 'card-kh',
      requiredFrontKey: 'center',
      requireShadow: false,
      title: isEn ? 'Your Turn 1: Initial Deployment' : 'Tu Turno 1: Despliegue Inicial',
      actionPrompt: isEn
        ? 'Select your King of Hearts (K♥ = 3 pts) and deploy it to the Center Front.'
        : 'Selecciona tu Rey de Corazones (K♥ = 3 pts) y despliégalo en el Frente Central.',
      whyThisCard: isEn
        ? 'Having won the round initiative, your team attacks first and you open the match. In the Unified Scale, the King of Hearts is a Face Card worth 3 base points ("3p" badge). Opening with authority in the Center establishes immediate territorial control and signals to your ally A2 that we hold Hearts to coordinate suit synergies.'
        : 'Al haber ganado la iniciativa de la ronda, tu equipo empieza atacando y abres la partida. En la Escala Unificada, el Rey de Corazones es una Figura que vale 3 puntos base (insignia "3p"). Abrir con autoridad en el Centro establece control territorial inmediato y le indica a tu aliado A2 que tenemos cartas de Corazones para coordinar sinergias de palo.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣ = 1p)',
              reason: 'Cards 2 to 6 are worth only 1 point in the Unified Scale.',
            },
            {
              cardLabel: 'Ace of Diamonds (A♦ = 4p)',
              reason: 'The Ace is the highest base card (4 pts). We must save it to answer threats or secure another front later.',
            },
            {
              cardLabel: 'Ten of Spades (10♠ = 2p)',
              reason: 'Medium card (2 pts). It lacks the initial punch we need in the center.',
            },
            {
              cardLabel: '8 of Hearts (8♥ = 2p)',
              reason: 'Provides 2 pts. Holding it enables subsequent Hearts synergy or playing it concealed as a Shadow.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣ = 1p)',
              reason: 'Las cartas del 2 al 6 valen solo 1 punto en la Escala Unificada.',
            },
            {
              cardLabel: 'As de Diamantes (A♦ = 4p)',
              reason: 'El As es la carta más alta (4 pts). Es un recurso supremo que debemos reservar para contestar amenazas o asegurar otro frente más adelante.',
            },
            {
              cardLabel: 'Diez de Picas (10♠ = 2p)',
              reason: 'Es una carta media (2 pts). No causa el impacto inicial de una Figura en el centro.',
            },
            {
              cardLabel: '8 de Corazones (8♥ = 2p)',
              reason: 'Aporta 2 pts. Guardarlo nos servirá para encadenar sinergia de corazones posterior o jugarlo como Sombra.',
            },
          ],
    },

    // PASO 4: TURNO 2 - RIVAL B1
    {
      stepId: 4,
      type: 'bot_turn',
      turnIndex: 2,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-qd', suit: 'diamonds', rank: 'Q', base: 12 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Response in the Center" : 'Turno de Rival B1: Respuesta en el Centro',
      actionSummary: isEn
        ? 'Rival B1 plays the Queen of Diamonds (Q♦ = 3 pts) on the Center Front.'
        : 'Rival B1 juega la Reina de Diamantes (Q♦ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'Seeing your King (3 pts) in the Center, B1 refuses to concede without a fight. B1 plays Queen (3 pts) to contest closely (3 vs 3).'
        : 'Al ver tu Rey (3 pts) en el Centro, B1 no quiere ceder la zona central sin luchar. Coloca su Reina (3 pts) para mantener el frente reñido (3 vs 3).',
      whyNotOthers: isEn
        ? 'Front Tiebreaker Rule: Even though both score 3 pts, if the round ended now, your King (nominal rank 13) would beat their Queen (nominal rank 12) on nominal hierarchy!'
        : 'Regla de Desempate en Frente: Aunque ambos sumáis 3 pts, si la ronda terminara ahora, ¡tu Rey (rango nominal 13) ganaría a su Reina (rango nominal 12) por Jerarquía Nominal!',
      tacticalInsight: isEn
        ? 'Notice the center score: 3 vs 3. Both teams spent a 3-point Face Card!'
        : 'Fíjate en el marcador del centro: 3 vs 3. ¡Ambos equipos habéis jugado una Figura de 3 puntos!',
    },

    // PASO 5: TURNO 3 - ALIADO A2
    {
      stepId: 5,
      type: 'bot_turn',
      turnIndex: 3,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-qh', suit: 'hearts', rank: 'Q', base: 12 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: SUIT SYNERGY COMBO!" : 'Turno de Aliado A2: ¡COMBO DE SINERGIA DE PALO!',
      actionSummary: isEn
        ? 'Ally A2 plays the Queen of Hearts (Q♥ = 3 pts) on the Center Front.'
        : 'Aliado A2 juega la Reina de Corazones (Q♥ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'Attention! Your ally A2 saw you played Hearts (K♥). By playing Queen of Hearts (Q♥), your team gathers 2 cards of the same suit in the same front, scoring +1 synergy point for the additional card!'
        : '¡Atención a esto! Tu aliado A2 vio que jugaste Corazones (K♥). Al jugar su Reina de Corazones (Q♥), vuestro equipo reúne 2 cartas del mismo palo en el frente, ¡sumando +1 pto de sinergia por la carta adicional!',
      whyNotOthers: isEn
        ? 'A2 did not play Jack of Diamonds or spades because triggering suit synergy in the Center provides immediate control.'
        : 'A2 no jugó su Jota de Diamantes ni cartas de picas porque activar la sinergia de palo en el Centro otorga control inmediato.',
      tacticalInsight: isEn
        ? 'KEY RULE: SUIT SYNERGY! Each additional card of the same suit grants +1 point. Your team totals: 3 (K♥) + 3 (Q♥) + 1 (Synergy) = 7 points in the Center against opponent\'s 3!'
        : '¡REGLA CLAVE: SINERGIA DE PALO! Cada carta adicional del mismo palo otorga +1 punto. Vuestro equipo suma: 3 (K♥) + 3 (Q♥) + 1 (Sinergia) = ¡7 puntos en el Centro frente a los 3 del rival!',
    },

    // PASO 6: TURNO 4 - RIVAL B2
    {
      stepId: 6,
      type: 'bot_turn',
      turnIndex: 4,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-ks', suit: 'spades', rank: 'K', base: 13 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: Alternative Flank" : 'Turno de Rival B2: Flanco Alternativo',
      actionSummary: isEn
        ? 'Rival B2 plays the King of Spades (K♠ = 3 pts) on the Right Front.'
        : 'Rival B2 juega el Rey de Picas (K♠ = 3 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'Rival B2 sees the Center dominated by your Hearts combo (7 vs 3). Spending troops there would be futile, so B2 opens Right Front with a top card (King = 3 pts) to secure that sector.'
        : 'Rival B2 ve que el Centro está dominado por vuestro combo de Corazones (7 vs 3). Sabe que gastar tropas en el centro ahora sería inútil, así que abre el Frente Derecho con su carta más poderosa (Rey = 3 pts) para intentar asegurar esa zona.',
      whyNotOthers: isEn
        ? 'B2 did not play left, preferring to concentrate on an uncontested sector.'
        : 'No jugó en la izquierda porque prefiere concentrar a su equipo en un frente específico donde no haya oposición aliada.',
      tacticalInsight: isEn
        ? 'Tactical lesson: Winning all 3 fronts grants +3 Round Points (Full Sweep), while winning 2 fronts grants +2 Round Points. By opening the Right Front strongly, B2 seeks to deny your 3-front Sweep and fight for their own 2-front victory!'
        : 'Lección táctica: Ganar los 3 frentes otorga +3 Puntos de Ronda (Pleno), mientras que ganar 2 frentes otorga +2 Puntos. ¡Al abrir fuerte en la Derecha, B2 busca evitar vuestro Pleno de 3 frentes y pelear por ganar 2 frentes!',
    },

    // =========================================================================
    // CICLO 2: TURNOS 5 AL 8
    // =========================================================================

    // PASO 7: TURNO 5 - HUMANO (A1)
    {
      stepId: 7,
      type: 'player_turn',
      turnIndex: 5,
      playerId: 'A1',
      requiredCardId: 'card-10s',
      requiredFrontKey: 'right',
      requireShadow: false,
      title: isEn ? 'Your Turn 2: Flank Containment' : 'Tu Turno 2: Contención en el Flanco',
      actionPrompt: isEn
        ? 'Select your Ten of Spades (10♠ = 2 pts) and deploy it to the Right Front.'
        : 'Selecciona tu Diez de Picas (10♠ = 2 pts) y despliégalo en el Frente Derecho.',
      whyThisCard: isEn
        ? 'Rival B2 just deployed King of Spades (3 pts) on the right. If we surrender that sector for free, they only need one more to claim the round. Playing your 10♠ (2 pts) contests the front closely (3 vs 2) without burning your Ace.'
        : 'El rival B2 acaba de poner su Rey de Picas (3 pts) en la derecha. Si dejamos que se lleven ese frente gratis, solo necesitarán ganar uno más para ganar la ronda. Jugando tu 10♠ (2 pts), disputas el frente quedando a tiro (3 vs 2) sin gastar tu As.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: 'Ace of Diamonds (A♦ = 4p)',
              reason: 'The Ace (4 pts) beats the King, but expending it this early leaves us without our decisive weapon for the endgame.',
            },
            {
              cardLabel: '8 of Hearts (8♥ = 2p)',
              reason: 'It is a Heart. Spending it on the right without hearts synergy wastes its potential in the center or its surprise value.',
            },
            {
              cardLabel: '4 of Clubs (4♣ = 1p)',
              reason: 'It provides only 1 point, leaving us behind without contesting effectively.',
            },
          ]
        : [
            {
              cardLabel: 'As de Diamantes (A♦ = 4p)',
              reason: 'El As (4 pts) ganaría al Rey, pero gastar el As tan temprano en el flanco nos dejaría sin nuestra carta más determinante para el momento cumbre.',
            },
            {
              cardLabel: '8 de Corazones (8♥ = 2p)',
              reason: 'Es carta de Corazones (2 pts). Gastarla en la derecha sin sinergia de corazones desaprovecha su potencial en el centro o su factor sorpresa.',
            },
            {
              cardLabel: '4 de Tréboles (4♣ = 1p)',
              reason: 'Aporta solo 1 punto, dejándonos por detrás sin disputar eficazmente el sector.',
            },
          ],
    },

    // PASO 8: TURNO 6 - RIVAL B1
    {
      stepId: 8,
      type: 'bot_turn',
      turnIndex: 6,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-jh', suit: 'hearts', rank: 'J', base: 11 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Reinforcing the Center" : 'Turno de Rival B1: Refuerzo del Centro',
      actionSummary: isEn
        ? 'Rival B1 plays the Jack of Hearts (J♥ = 3 pts) on the Center Front.'
        : 'Rival B1 juega la Jota de Corazones (J♥ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'B1 attempts to stay alive in the center and plays Jack of Hearts (3 pts base). Team B now has 6 points in the center (3 + 3).'
        : 'B1 intenta no perder el centro definitivamente y juega su Jota de Corazones (3 pts base). Ahora el equipo B suma 6 puntos en el centro (3 + 3).',
      whyNotOthers: isEn
        ? 'B1 did not play 2♣ or 5♦ because they would be weak discards in a trailing sector.'
        : 'No jugó su 2♣ ni su 5♦ porque serían descartes débiles en un frente donde van perdiendo.',
      tacticalInsight: isEn
        ? 'Even though B1 added 3 points, you still dominate the Center with 7 points thanks to your suit synergy.'
        : 'Aunque B1 sumó 3 puntos, vosotros seguís dominando el Centro con 7 puntos gracias a vuestra sinergia de palo.',
    },

    // PASO 9: TURNO 7 - ALIADO A2
    {
      stepId: 9,
      type: 'bot_turn',
      turnIndex: 7,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-jd', suit: 'diamonds', rank: 'J', base: 11 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Opening the Third Front" : 'Turno de Aliado A2: Apertura del Tercer Frente',
      actionSummary: isEn
        ? 'Ally A2 plays the Jack of Diamonds (J♦ = 3 pts) on the Left Front.'
        : 'Aliado A2 juega la Jota de Diamantes (J♦ = 3 pts) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Your team leads Center (7 vs 6) and contests Right (2 vs 3). Ally A2 takes advantage of the empty Left Front to plant their Jack (3 pts) and take a 3-0 lead.'
        : 'Vuestro equipo lidera el Centro (7 a 6) y disputa la Derecha (2 a 3). Aliado A2 aprovecha que el Frente Izquierdo está totalmente vacío para colocar su Jota (3 pts) y tomar ventaja libre (3 a 0).',
      whyNotOthers: isEn
        ? 'A2 refrained from center (already leading) and right to force opponents to stretch thin across all 3 fronts.'
        : 'No jugó en el centro porque ya tenéis ventaja suficiente, ni en la derecha porque prefiere obligar a los rivales a dividirse entre los 3 frentes.',
      tacticalInsight: isEn
        ? 'Masterful reading by A2: opening Left exerts simultaneous pressure across all 3 battlefronts.'
        : 'Excelente lectura de A2: al abrir el Frente Izquierdo, vuestro equipo presiona simultáneamente en los 3 frentes.',
    },

    // PASO 10: TURNO 8 - RIVAL B2
    {
      stepId: 10,
      type: 'bot_turn',
      turnIndex: 8,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-7s', suit: 'spades', rank: '7', base: 7 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: Enemy Synergy on the Right" : 'Turno de Rival B2: Sinergia Enemiga en la Derecha',
      actionSummary: isEn
        ? 'Rival B2 plays the 7 of Spades (7♠ = 2 pts) on the Right Front.'
        : 'Rival B2 juega el 7 de Picas (7♠ = 2 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'B2 bolsters the right with 7 of Spades. Combining K♠ (3) and 7♠ (2) triggers enemy Spades Synergy (+1 pt for 1 extra Spade)! Their team totals 3 + 2 + 1 = 6 points on the right against your 2 points.'
        : 'B2 refuerza la derecha con su 7 de Picas. ¡Al juntar K♠ (3) y 7♠ (2), los rivales activan su Sinergia de Picas (+1 pto por 1 Pica extra)! Su equipo suma 3 + 2 + 1 = 6 puntos en la derecha frente a tus 2 puntos.',
      whyNotOthers: isEn
        ? 'B2 did not play left, seizing the chance to lock down a secure front for their team.'
        : 'B2 no jugó en la izquierda porque vio la oportunidad de consolidar un frente seguro para su bando.',
      tacticalInsight: isEn
        ? 'Opponents also build synergies and now lead the Right Front. Since the 3-front Sweep (+3 pts) is contested there, our priority is to lock down Center and Left to secure a Standard Victory (+2 Round Points)!'
        : 'Los rivales también saben crear sinergias y ahora lideran la Derecha. Como el Pleno de 3 frentes (+3 pts) se ha complicado allí, ¡nuestra prioridad es asegurar Centro e Izquierda para llevarnos la Victoria Estándar (+2 Puntos de Ronda)!',
    },

    // =========================================================================
    // CICLO 3: TURNOS 9 AL 12 (LA CARTA SOMBRA)
    // =========================================================================

    // PASO 11: TURNO 9 - HUMANO (A1) -> CARTA SOMBRA
    {
      stepId: 11,
      type: 'player_turn',
      turnIndex: 9,
      playerId: 'A1',
      requiredCardId: 'card-8h',
      requiredFrontKey: 'center',
      requireShadow: true,
      title: isEn ? 'Your Turn 3: SHADOW MARKER MECHANIC!' : 'Tu Turno 3: ¡MECÁNICA DEL MARCADOR DE SOMBRA!',
      actionPrompt: isEn
        ? 'Activate the "Play as Shadow" button, select your 8 of Hearts (8♥ = 2 pts), and deploy it to the Center Front.'
        : 'Activa el botón "Jugar como Sombra", selecciona tu 8 de Corazones (8♥ = 2 pts) y colócalo en el Frente Central.',
      whyThisCard: isEn
        ? 'In official WarFronts v2.1 rules, shadow cards are part of a continuous team economy: teams start Round 1 with 0 markers and earn them at round end (+1 win, +2 loss, +3 streak of 2+ losses, +1 tie in 2v2), saving them across rounds. In this drill, we provide 2 simulated markers so you can master their use. When playing a Shadow Card, you silently show it to your teammates before placing it face-down (in the digital game, it remains fully VISIBLE to your entire team with a purple border while hidden from opponents). Your ally A2 sees your 8♥ clearly to coordinate and build suit synergy (+2 pts for 3 hearts: 3+3+2 base + 2 synergy = 10 pts), while opponents only see the dark back, completely intimidating them.'
        : 'En el reglamento oficial v2.1, las cartas sombra forman parte de una economía continua de equipo: los equipos inician la Ronda 1 con 0 marcadores y los ganan al final de la ronda (+1 por ganar, +2 por perder, +3 si llevas 2+ derrotas seguidas o +1 si hay empate en 2v2), ahorrándolos entre rondas. En este tutorial te proporcionamos 2 marcadores simulados para aprender su uso. Al jugar una Carta Sombra, se enseña en silencio a los compañeros antes de bajarla BOCA ABAJO (en la versión digital permanece VISIBLE para todo tu equipo con borde morado y oculta para los rivales). Tu aliado A2 ve perfectamente tu 8♥ para coordinar la estrategia y calcular las sinergias (+2 pts por 3 corazones: 3+3+2 base + 2 sinergia = 10 pts), mientras que los rivales solo ven el reverso oscuro, intimidándolos por completo.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣ = 1p)',
              reason: 'Burning a team shadow token on a weak 1-point card with no synergy squanders your most potent tactical asset.',
            },
            {
              cardLabel: 'Ace of Diamonds (A♦ = 4p)',
              reason: 'The Ace is a powerhouse we want to deploy face up later to claim the Left Front decisively.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣ = 1p)',
              reason: 'Gastar una sombra de equipo en una carta de 1 punto que no tiene sinergia sería un desperdicio del recurso táctico más valioso.',
            },
            {
              cardLabel: 'As de Diamantes (A♦ = 4p)',
              reason: 'El As es una bomba que queremos jugar visible más adelante para ganar el Frente Izquierdo de forma aplastante.',
            },
          ],
    },

    // PASO 12: TURNO 10 - RIVAL B1
    {
      stepId: 12,
      type: 'bot_turn',
      turnIndex: 10,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-5d', suit: 'diamonds', rank: '5', base: 5 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Response on the Left" : 'Turno de Rival B1: Respuesta en la Izquierda',
      actionSummary: isEn
        ? 'Rival B1 plays the 5 of Diamonds (5♦ = 1 pt) on the Left Front.'
        : 'Rival B1 juega el 5 de Diamantes (5♦ = 1 pto) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Your ally A2 has Jack of Diamonds (3 pts) on the left. B1 cannot leave that front uncontested, playing 5♦ (1 pt) to start disputing it.'
        : 'Tu aliado A2 tiene una Jota de Diamantes (3 pts) en la izquierda. B1 no puede dejar que os llevéis ese frente sin oposición, así que coloca su 5♦ (1 pto) para empezar a disputarlo.',
      whyNotOthers: isEn
        ? 'B1 feared playing in the Center after watching your threatening Shadow deployment, sensing the center is out of reach.'
        : 'B1 no se atrevió a jugar en el Centro porque vio que acabas de desplegar una carta Sombra amenazante y teme que el centro sea imposible de remontar.',
      tacticalInsight: isEn
        ? 'Your shadow play worked psychologically! B1 steered away from center in fear of your hidden power.'
        : '¡Tu carta sombra ha funcionado psicológicamente! B1 se alejó del centro por temor a vuestra fuerza oculta.',
    },

    // PASO 13: TURNO 11 - ALIADO A2
    {
      stepId: 13,
      type: 'bot_turn',
      turnIndex: 11,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-9h', suit: 'hearts', rank: '9', base: 9 },
      frontKey: 'center',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Fortifying the Center" : 'Turno de Aliado A2: Blindaje Definitivo del Centro',
      actionSummary: isEn
        ? 'Ally A2 plays the 9 of Hearts (9♥ = 2 pts) on the Center Front.'
        : 'Aliado A2 juega el 9 de Corazones (9♥ = 2 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'A2 follows the master plan: adding another Hearts card to Center. With 4 Team A Hearts cards, your team scores Base (3+3+2+2 = 10) + Color (+3 for 3 extra Hearts) = 13 total points!'
        : 'A2 sigue vuestro plan maestro: añade otra carta de corazones al Frente Central. Con 4 cartas de Corazones del Equipo A, sumáis Base (3+3+2+2 = 10) + Color (+3 por 3 cartas extra) = ¡13 puntos totales!',
      whyNotOthers: isEn
        ? 'A2 holds 3♦ and 6♠ for the final turns on the flanks.'
        : 'A2 se guarda su 3♦ y 6♠ para los compases finales según convenga en los flancos.',
      tacticalInsight: isEn
        ? 'The Center now has 6 cards accumulated across both teams. Remember: front capacity limit in 2v2 is 8 cards.'
        : 'El Centro ya tiene 6 cartas acumuladas entre ambos bandos. Recuerda: el límite físico máximo de un frente en 2v2 es de 8 cartas.',
    },

    // PASO 14: TURNO 12 - RIVAL B2 -> SOMBRA RIVAL
    {
      stepId: 14,
      type: 'bot_turn',
      turnIndex: 12,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-10d', suit: 'diamonds', rank: '10', base: 10 },
      frontKey: 'left',
      asShadow: true,
      title: isEn ? "Rival B2's Turn: Enemy Shadow on the Left!" : 'Turno de Rival B2: ¡Sombra Rival en la Izquierda!',
      actionSummary: isEn
        ? 'Rival B2 plays a SHADOW CARD (Concealed) on the Left Front.'
        : 'Rival B2 juega una CARTA SOMBRA (Oculta) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'B2 spends one of their team\'s 2 shadow tokens to conceal their left flank deployment against your Ally A2. Their teammate B1 can see the card, but for our team it remains face-down with the dark shadow back, creating total uncertainty regarding its rank and suit on the Left Front.'
        : 'B2 gasta uno de los 2 marcadores de sombra de su equipo para ocultar su jugada en la izquierda frente a vuestro Aliado A2. Su compañero B1 puede ver su carta en su equipo, pero para nosotros permanece boca abajo con el reverso oscuro de sombra, creando total incertidumbre sobre su valor y palo en el Frente Izquierdo.',
      whyNotOthers: isEn
        ? 'B2 abandoned the center as lost and already holds a solid lead on the right.'
        : 'B2 no jugó en el centro porque lo da por perdido, ni en la derecha porque ya lideran cómodamente allí.',
      tacticalInsight: isEn
        ? 'Watch out! B2\'s shadow card is an enigma. It could be high or a bluff. How do we respond? Decisively!'
        : '¡Atención! La carta sombra de B2 es un enigma. Podría ser una carta alta o un farol. ¿Cómo responderemos en nuestro próximo turno? ¡Con contundencia!',
    },

    // =========================================================================
    // CICLO 4: TURNOS 13 AL 16 (EL GOLPE MAESTRO)
    // =========================================================================

    // PASO 15: TURNO 13 - HUMANO (A1) -> EL AS DE DIAMANTES
    {
      stepId: 15,
      type: 'player_turn',
      turnIndex: 13,
      playerId: 'A1',
      requiredCardId: 'card-ad',
      requiredFrontKey: 'left',
      requireShadow: false,
      title: isEn ? 'Your Turn 4: Masterstroke on the Decisive Front!' : 'Tu Turno 4: ¡Golpe Maestro en el Frente Decisivo!',
      actionPrompt: isEn
        ? 'Select your Ace of Diamonds (A♦ = 4 pts) and deploy it to the Left Front.'
        : 'Selecciona tu As de Diamantes (A♦ = 4 pts) y despliégalo en el Frente Izquierdo.',
      whyThisCard: isEn
        ? 'Crucial match turning point! Look at the strategic picture: Center is locked down by your Hearts combo. Right belongs to the rival. Therefore: THE ROUND IS DECIDED ON THE LEFT FRONT! Rival B2 placed a shadow card. Playing your Ace of Diamonds (4 base points, the highest single card) delivers supreme power and triggers Diamond Synergy with Ally A2\'s J♦ (+1 bonus pt). This move seals the round!'
        : '¡Momento crucial de la partida! Analicemos el panorama global: el Centro está ganado con creces por vuestro combo de corazones. La Derecha está en manos del rival. Por tanto: ¡LA PARTIDA SE DECIDE EN EL FRENTE IZQUIERDO! El rival B2 ha puesto una carta sombra. Al jugar tu As de Diamantes (4 puntos base, la carta más alta de la baraja), sumas una ventaja arrolladora en la izquierda y activas la Sinergia de Diamantes con la J♦ de tu aliado A2 (+1 pto adicional). ¡Este movimiento sentencia la ronda!',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣ = 1p)',
              reason: 'The 4♣ provides only 1 point without synergy, leaving the left exposed to the enemy shadow card.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣ = 1p)',
              reason: 'El 4♣ sumaría solo 1 punto y no activaría sinergia, dejando la izquierda a merced de la carta sombra del rival.',
            },
          ],
    },

    // PASO 16: TURNO 14 - RIVAL B1
    {
      stepId: 16,
      type: 'bot_turn',
      turnIndex: 14,
      botId: 'B1',
      botName: isEn ? 'Rival B1' : 'Rival B1',
      botTeam: 'teamB',
      card: { id: 'card-2c', suit: 'clubs', rank: '2', base: 2 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Rival B1's Turn: Tactical Discard" : 'Turno de Rival B1: Descarte Táctico',
      actionSummary: isEn
        ? 'Rival B1 plays the Two of Clubs (2♣ = 1 pt) on the Right Front.'
        : 'Rival B1 juega el Dos de Tréboles (2♣ = 1 pto) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'Seeing your Ace drop on the left, B1 realizes challenging the left or center is futile. Executing a "Tactical Discard", B1 dumps their lowest card (2♣ = 1 pt) on the right where their team already leads, avoiding crowding contested fronts.'
        : 'Al ver caer tu As en la izquierda, B1 sabe que competir en la izquierda o centro es misión imposible. Realiza un "Descarte Táctico": deposita su carta más baja (2♣ = 1 pto) en la derecha donde su equipo ya va ganando, sin estorbar en los frentes disputados.',
      whyNotOthers: isEn
        ? 'Lacks sufficient card strength to challenge your Ace of Diamonds on the left.'
        : 'No tiene cartas con valor suficiente para desafiar vuestro As de Diamantes en la izquierda.',
      tacticalInsight: isEn
        ? 'Tactical lesson: When a front is out of reach, dumping low cards into secure fronts is standard play.'
        : 'Lección táctica: Cuando un frente está perdido, colocar cartas bajas en frentes seguros es una técnica táctica estándar de WarFronts.',
    },

    // PASO 17: TURNO 15 - ALIADO A2
    {
      stepId: 17,
      type: 'bot_turn',
      turnIndex: 15,
      botId: 'A2',
      botName: isEn ? 'Ally A2' : 'Aliado A2',
      botTeam: 'teamA',
      card: { id: 'card-6s', suit: 'spades', rank: '6', base: 6 },
      frontKey: 'right',
      asShadow: false,
      title: isEn ? "Ally A2's Turn: Right Flank Containment" : 'Turno de Aliado A2: Contención en el Flanco Derecho',
      actionSummary: isEn
        ? 'Ally A2 plays the Six of Spades (6♠ = 1 pt) on the Right Front.'
        : 'Aliado A2 juega el Seis de Picas (6♠ = 1 pto) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'A2 does not need to overload the left (firmly held by Ace and Jack) and prefers adding 6♠ (1 pt) on the right, connecting Spades synergy (+1 pt) with your earlier 10♠ (2 pts).'
        : 'A2 no necesita sobrecargar la izquierda (ya dominada por vuestro As y Jota) y prefiere sumar 6♠ (1 pto) en la derecha, aprovechando para sumar sinergia de Picas (+1 pto) con tu 10♠ anterior (2 pts).',
      whyNotOthers: isEn
        ? 'Reserves 3♦ for the final touch on the left.'
        : 'Se reserva su 3♦ para el remate final en la izquierda.',
      tacticalInsight: isEn
        ? 'Your team is playing like a well-oiled squad.'
        : 'Tu equipo está jugando como un auténtico escuadrón coordinado.',
    },

    // PASO 18: TURNO 16 - RIVAL B2
    {
      stepId: 18,
      type: 'bot_turn',
      turnIndex: 16,
      botId: 'B2',
      botName: isEn ? 'Rival B2' : 'Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-4d', suit: 'diamonds', rank: '4', base: 4 },
      frontKey: 'left',
      asShadow: false,
      title: isEn ? "Rival B2's Turn: Desperation Push" : 'Turno de Rival B2: Intento a la Desesperada',
      actionSummary: isEn
        ? 'Rival B2 plays the Four of Diamonds (4♦ = 1 pt) on the Left Front.'
        : 'Rival B2 juega el Cuatro de Diamantes (4♦ = 1 pto) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'B2 desperately tries to close the gap on the left with 4♦ (1 pt), combining synergy with B1\'s 5♦ (+1 pt for 2 Diamonds). But your Ace and Jack maintain an insurmountable advantage.'
        : 'B2 intenta desesperadamente recortar distancias en la izquierda con su 4♦ (1 pto), sumando sinergia con el 5♦ de B1 (+1 pto por 2 Diamantes). Pero vuestro As y Jota mantienen una ventaja inalcanzable.',
      whyNotOthers: isEn
        ? 'Only holds a low card (5♥) in hand.'
        : 'Solo le queda una carta baja (5♥) en mano.',
      tacticalInsight: isEn
        ? 'We reached the final turn of the round! You hold a single card in hand.'
        : '¡Llegamos al último turno de la ronda! Tienes una sola carta en mano.',
    },

    // =========================================================================
    // CICLO 5: ÚLTIMO TURNO (TURNOS 17 AL 20)
    // =========================================================================

    // PASO 19: TURNO 17 - HUMANO (A1) -> ÚLTIMA CARTA
    {
      stepId: 19,
      type: 'player_turn',
      turnIndex: 17,
      playerId: 'A1',
      requiredCardId: 'card-4c',
      requiredFrontKey: 'right',
      requireShadow: false,
      title: isEn ? 'Your Final Turn: Deployment Close' : 'Tu Turno Final: Cierre de Despliegue',
      actionPrompt: isEn
        ? 'Deploy your final card, the Four of Clubs (4♣ = 1 pt), to the Right Front.'
        : 'Despliega tu última carta, el Cuatro de Tréboles (4♣ = 1 pto), en el Frente Derecho.',
      whyThisCard: isEn
        ? 'You only have the 4♣ remaining. Center and Left are mathematically won by your team (2 of 3 fronts secured = +2 Round Points!). Remember: in v2.1, front scores are NOT accumulated to break match ties; ties in Round Points are decided first by Shadow Efficiency (unspent Shadow Markers in the Team Pool) and then by a 2-Round Overtime!'
        : 'Te queda únicamente el 4♣. El Centro y la Izquierda ya están matemáticamente ganados por vuestro equipo (¡2 de 3 frentes asegurados = +2 Puntos de Ronda!). Recuerda: en la Versión 2.1 ya NO se acumulan las puntuaciones de los frentes para desempatar la partida; los empates en Puntos de Ronda se deciden primero por Eficiencia de Sombras (más Marcadores de Sombra en el Fondo de Equipo) y después por Prórroga de 2 Rondas.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: 'No other cards',
              reason: 'This is your final card of the round.',
            },
          ]
        : [
            {
              cardLabel: 'Ninguna otra',
              reason: 'Es tu última carta de la ronda.',
            },
          ],
    },

    // PASO 20: CONCLUSIÓN DE DESPLIEGUE DE LOS BOTS (TURNOS 18, 19, 20)
    {
      stepId: 20,
      type: 'bot_turn',
      turnIndex: 18,
      botId: 'B1',
      botName: isEn ? 'Rival B1 / Ally A2 / Rival B2' : 'Rival B1 / Aliado A2 / Rival B2',
      botTeam: 'teamB',
      card: { id: 'card-9s', suit: 'spades', rank: '9', base: 9 },
      frontKey: 'right',
      asShadow: false,
      title: isEn
        ? 'Deployment Complete: All Players Out of Troops'
        : 'Fin del Despliegue: Todos los Jugadores Agotan Tropas',
      actionSummary: isEn
        ? 'B1 plays 9♠ on the right, Ally A2 plays 3♦ on the left, and Rival B2 plays 5♥ in the center.'
        : 'B1 coloca su 9♠ en la derecha, Aliado A2 coloca su 3♦ en la izquierda, y Rival B2 coloca su 5♥ en el centro.',
      whyPlayed: isEn
        ? 'All players have deployed their 5 regulation cards to the battlefield. It is time to resolve the round.'
        : 'Todos los jugadores han colocado sus 5 cartas reglamentarias en el campo de batalla. Ha llegado la hora de resolver la ronda.',
      whyNotOthers: isEn
        ? 'No cards remain to be played in this round.'
        : 'No quedan más cartas por jugar en esta ronda.',
      tacticalInsight: isEn
        ? 'We now proceed to Resolution Phase: all shadow cards will be revealed and final front scores calculated!'
        : 'Ahora pasamos a la Fase de Resolución: ¡Se revelarán todas las cartas sombra y se calcularán los puntos finales de cada frente!',
    },

    // PASO 21: FASE DE RESOLUCIÓN Y REVELACIÓN DE SOMBRAS
    {
      stepId: 21,
      type: 'resolution',
      title: isEn
        ? 'Resolution Phase: Official Reveal and Scoring'
        : 'Fase de Resolución: Revelación y Puntuación Oficial',
      subtitle: isEn
        ? 'Moment of Truth on all 3 Fronts'
        : 'El momento de la verdad en los 3 Frentes',
    },

    // PASO 22: GRADUACIÓN Y FIN DEL TUTORIAL
    {
      stepId: 22,
      type: 'conclusion',
      title: isEn
        ? 'CONGRATULATIONS, GRADUATE COMMANDER!'
        : '¡ENHORABUENA, COMANDANTE GRADUADO!',
      subtitle: isEn
        ? 'You have mastered all the fundamentals of WarFronts v2.1'
        : 'Has dominado todos los fundamentos de Frentes de Guerra v2.1',
    },
  ];
}

export const TUTORIAL_STEPS = getTutorialSteps('es');
