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
        ? 'Guided Instruction: Compressed Scale, Live Score & 20s Turn Clock'
        : 'Instrucción Guiada: Escala Comprimida, Puntos en Vivo y Turno de 20s',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Welcome to Casual Mode (Party / Friends) — Official Rulebook v2.0 (Chapter 9). This mode keeps the full tactical essence of WarFronts (3 fronts, 1v1 to 4v4, continuous deck, and 1/2/3 Round Points) while eliminating mental math and complex resource tracking!',
            '1. Compressed Scale (1 to 4 pts): Cards 2–6 = 1 pt, Cards 7–10 = 2 pts, Face Cards (J, Q, K) = 3 pts, and Ace (A) = 4 pts.',
            '2. Simplified Synergies: Color (3+ cards of the same suit in the same front) = +2 pts total, Pair = +2 pts, Short Straight (3 consecutive cards) = +3 pts, and Trio = +4 pts (cancels Pair).',
            '3. Real-Time Live Score on Fronts: Each front displays the live score of both teams automatically so you never have to do mental math.',
            '4. 1 Fixed Shadow per Player & 20s Turn Clock: Every player receives 1 personal Shadow Marker per round, and each turn has a fixed 20-second timer with automatic deployment if time runs out.',
          ]
        : [
            'Bienvenido al Modo Casual (Party / Amigos) — Reglamento Oficial v2.0 (Capítulo 9). Este modo conserva toda la esencia táctica de Frentes de Guerra (3 frentes, 1v1 a 4v4, mazo continuo y escala de 1/2/3 Puntos de Ronda), eliminando el cálculo mental pesado y la gestión económica compleja.',
            '1. Escala Comprimida (1 a 4 pts): Cartas del 2 al 6 = 1 pto, Cartas del 7 al 10 = 2 pts, Figuras (J, Q, K) = 3 pts y As (A) = 4 pts.',
            '2. Sinergias Simplificadas: Color (3 o más cartas del mismo palo en el mismo frente) = +2 pts totales, Pareja = +2 pts, Escalera Corta (3 consecutivas) = +3 pts y Trío = +4 pts (anula Pareja).',
            '3. Contador de Puntos en Vivo: Cada frente muestra en tiempo real la suma automática de puntos de ambos equipos para evitar cualquier cálculo mental.',
            '4. 1 Sombra Fija por Jugador y Turno de 20s: Cada jugador recibe 1 Marcador de Sombra personal por ronda y dispone de 20 segundos fijos por turno con despliegue automático si se agota el tiempo.',
          ],
      buttonText: isEn ? 'Learn the Compressed Scale' : 'Ver Escala Comprimida y Sinergias',
    },

    // PASO 1: ESCALA COMPRIMIDA Y CONTADOR EN VIVO
    {
      stepId: 1,
      type: 'dialog',
      stage: 'trump_reveal',
      title: isEn
        ? '1. Compressed Scale & Live Score Counters'
        : '1. Escala Comprimida y Contador de Puntos en Vivo',
      subtitle: isEn
        ? 'Zero Mental Math & Hidden Information Security'
        : 'Cero Cálculo Mental y Seguridad de Información Oculta',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Base Card Values (1 to 4): Every card displays a green badge (1p, 2p, 3p, 4p) with its Casual base value: 2–6 = 1 pt | 7–10 = 2 pts | J, Q, K = 3 pts | Ace (A) = 4 pts.',
            'Attention on Color Synergy (+2 pts): Unlike Competitive Mode, in Casual Mode you need 3 OR MORE cards of the same suit in the same front to earn a flat +2 bonus!',
            'Other Synergies: Pair (2 equal ranks) = +2 pts | Short Straight (3 consecutive ranks) = +3 pts | Trio (3 equal ranks) = +4 pts (replaces Pair).',
            'Real-Time Live Score & Shadow Security: Each front shows your team\'s REAL total (including your own team\'s Shadow Cards, which teammates know) and the rival\'s VISIBLE total (counting only face-up rival cards). Enemy Shadow Cards do NOT add points to the public counter until Revelation at the end of the round!',
          ]
        : [
            'Valores Base de las Cartas (1 al 4): Cada carta muestra una insignia verde (1p, 2p, 3p, 4p) con su valor en Modo Casual: 2 al 6 = 1 pto | 7 al 10 = 2 pts | J, Q, K = 3 pts | As (A) = 4 pts.',
            '¡Ojo con la Sinergia de Color (+2 pts)! A diferencia del modo competitivo, en Modo Casual necesitas 3 O MÁS cartas del mismo palo en un mismo frente para obtener una bonificación única de +2 puntos totales.',
            'Resto de Sinergias: Pareja (2 iguales) = +2 pts | Escalera Corta (3 consecutivas) = +3 pts | Trío (3 iguales) = +4 pts (anula la Pareja).',
            'Contador en Vivo y Seguridad de Sombras: Cada frente muestra en tiempo real el Total Real Aliado (incluyendo vuestras propias Cartas Sombra, conocidas por el equipo) y los Puntos Visibles del Rival. ¡Las Cartas Sombra enemigas NO suman en el marcador público hasta la Fase de Revelación!',
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
      title: isEn ? 'Turn 1 (20s Clock): Compressed Scale Opening' : 'Turno 1 (Reloj 20s): Apertura con Escala Comprimida',
      actionPrompt: isEn
        ? 'Select your King of Hearts (K♥ = 3 pts) and deploy it to the Center Front.'
        : 'Selecciona tu Rey de Corazones (K♥ = 3 pts) y despliégalo en el Frente Central.',
      whyThisCard: isEn
        ? 'In Casual Mode, all Face Cards (J, Q, K) are worth 3 base points (notice the "3p" badge on K♥). Opening in the Center with K♥ puts your team ahead 3 to 0 on the live counter and starts building toward a 3-card Hearts Color bonus (+2 pts).'
        : 'En el Modo Casual, todas las Figuras (J, Q, K) valen 3 puntos base (fíjate en la insignia "3p" de tu K♥). Abrir en el Centro con K♥ coloca el contador en vivo 3 a 0 a vuestro favor e inicia el camino hacia el Color de 3 Corazones (+2 pts).',
      whyNotOthers: isEn
        ? [
            { cardLabel: '4 of Clubs (4♣ = 1p)', reason: 'Cards 2 to 6 are worth only 1 point in Casual Mode.' },
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'The Ace is worth 4 points (the highest base value). Save it for a decisive front!' },
            { cardLabel: '10♠ (2p) & 8♥ (2p)', reason: 'Cards 7 to 10 are worth 2 points. Better to save 8♥ for your personal Shadow play!' },
          ]
        : [
            { cardLabel: '4 de Tréboles (4♣ = 1p)', reason: 'Las cartas del 2 al 6 valen solo 1 punto en la Escala Comprimida.' },
            { cardLabel: 'As de Diamantes (A♦ = 4p)', reason: 'El As vale 4 puntos (el valor máximo en Modo Casual). ¡Resérvalo para decidir otro frente!' },
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
        ? 'In Casual Mode, Q♦ is also worth 3 base points. Look at the Center Front live counter: it automatically updates to 3 vs 3!'
        : 'En Modo Casual, la Q♦ también vale 3 puntos base. Mira el contador en vivo del Frente Central: ¡se actualiza automáticamente a 3 vs 3!',
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
      title: isEn ? "Ally A2's Turn: Preparing the 3-Card Color!" : 'Turno de Aliado A2: ¡Preparando el Color de 3 Cartas!',
      actionSummary: isEn
        ? 'Ally A2 plays Queen of Hearts (Q♥ = 3 pts) on the Center Front.'
        : 'Aliado A2 juega la Reina de Corazones (Q♥ = 3 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'A2 adds Q♥ (3 pts) to your K♥ (3 pts). Notice a key Casual Mode difference: with 2 Hearts, your total is 3 + 3 = 6 pts (no bonus yet!). In Casual Mode, Color (+2 pts) activates when you reach 3 OR MORE cards of the same suit!'
        : 'A2 suma su Q♥ (3 pts) a tu K♥ (3 pts). ¡Fíjate en esta diferencia clave del Modo Casual! Con 2 Corazones vuestro marcador en vivo suma 3 + 3 = 6 pts (aún sin bono). ¡En Modo Casual el bono de Color (+2 pts) se activa al reunir 3 O MÁS cartas del mismo palo!',
      whyNotOthers: isEn
        ? 'Having 2 Hearts on the table sets up your next turn to complete the 3rd Heart and trigger the +2 Color bonus.'
        : 'Tener 2 Corazones en mesa deja listo el frente para que en tu próximo turno pongas el 3er Corazón y actives el +2 de Color.',
      tacticalInsight: isEn
        ? 'Casual Color Rule: 3 or more cards of the same suit in a front = flat +2 bonus points!'
        : 'Regla de Color en Modo Casual: 3 o más cartas del mismo palo en un mismo frente = ¡+2 puntos totales de bonificación!',
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
        ? 'Seeing your team leading 6 vs 3 in the Center, B2 opens the Right Front with K♠ (3 pts).'
        : 'Al ver que domináis el Centro 6 a 3, B2 abre el Frente Derecho con su K♠ (3 pts).',
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
        ? 'Cards from 7 to 10 are worth 2 base points ("2p") in Casual Mode. Playing 10♠ on the Right Front puts you right behind the rival (2 vs 3 pts) while keeping your 8♥ for the Center Color combo and your A♦ (4p) for the Left Front!'
        : 'Las cartas del 7 al 10 valen 2 puntos base ("2p") en Modo Casual. Jugar el 10♠ en el Frente Derecho te deja muy cerca del rival (2 vs 3 pts), reservando tu 8♥ para completar el Color en el Centro y tu A♦ (4p) para la Izquierda.',
      whyNotOthers: isEn
        ? [
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'Save your 4-point Ace to dominate the Left Front!' },
            { cardLabel: '8 of Hearts (8♥ = 2p)', reason: 'We need 8♥ in the Center to reach 3 Hearts and trigger Color (+2 pts)!' },
          ]
        : [
            { cardLabel: 'As de Diamantes (A♦ = 4p)', reason: '¡Guarda tu As de 4 puntos para dominar el Frente Izquierdo!' },
            { cardLabel: '8 de Corazones (8♥ = 2p)', reason: '¡Necesitamos el 8♥ en el Centro para llegar a 3 Corazones y activar el Color (+2 pts)!' },
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
        ? 'B1 adds J♥ (3 pts) to Q♦ (3 pts), tying the Center live counter at 6 vs 6!'
        : 'B1 suma su J♥ (3 pts) a la Q♦ (3 pts), ¡empatando el contador en vivo del Centro 6 a 6!',
      whyNotOthers: isEn
        ? 'Even tied 6 vs 6, your K♥ is higher in nominal hierarchy than Q♦.'
        : 'Incluso empatados 6 a 6, tu K♥ tiene mayor jerarquía nominal que su Q♦.',
      tacticalInsight: isEn
        ? 'Now it is time to break the Center wide open with your personal Shadow Card and 3-Heart Color!'
        : '¡Ahora romperemos el empate en el Centro con tu Carta Sombra personal y el Color de 3 Corazones!',
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
        ? 'Opening Diamonds on the Left prepares a future 3-Diamond Color combo with your Ace of Diamonds!'
        : 'Abrir con Diamantes en la Izquierda prepara una futura sinergia de Color de 3 Diamantes con tu As de Diamantes.',
      tacticalInsight: isEn
        ? 'Look at all 3 live counters: Left (3 vs 0), Center (6 vs 6), Right (2 vs 3).'
        : 'Mira los 3 contadores en vivo: Izquierdo (3 vs 0), Central (6 vs 6), Derecho (2 vs 3).',
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
      title: isEn ? "Rival B2's Turn: Adding Spades on the Right" : 'Turno de Rival B2: Refuerzo de Picas en la Derecha',
      actionSummary: isEn
        ? 'Rival B2 plays 7 of Spades (7♠ = 2 pts) on the Right Front.'
        : 'Rival B2 juega el 7 de Picas (7♠ = 2 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'B2 adds 7♠ (2 pts) to K♠ (3 pts) on the Right. Notice they have 2 Spades (3 + 2 = 5 pts), which does NOT trigger Color yet because Casual Mode requires 3+ cards of the same suit!'
        : 'B2 añade el 7♠ (2 pts) a su K♠ (3 pts) en la Derecha. Fíjate que con 2 Picas suman 3 + 2 = 5 pts, ¡porque en Modo Casual aún no activan Color hasta reunir 3 cartas del mismo palo!',
      whyNotOthers: isEn
        ? 'B2 is preparing to add a 3rd Spade later to claim the +2 Color bonus on the Right.'
        : 'B2 busca añadir una 3ª Pica más adelante para cobrar el +2 de Color en la Derecha.',
      tacticalInsight: isEn
        ? 'Your turn is next: let\'s use your 1 personal Shadow Marker of the round!'
        : 'Te toca tirar: ¡vamos a usar tu Marcador de Sombra personal de esta ronda!',
    },

    // PASO 11: TURNO 9 - HUMANO (A1) -> 1 SOMBRA PERSONAL FIJA + COLOR (+2)
    {
      stepId: 11,
      type: 'player_turn',
      turnIndex: 9,
      playerId: 'A1',
      requiredCardId: 'card-8h',
      requiredFrontKey: 'center',
      requireShadow: true,
      title: isEn ? 'Turn 3: YOUR 1 PERSONAL SHADOW & COLOR (+2 PTS)!' : 'Tu Turno 3: ¡TU SOMBRA PERSONAL Y COLOR (+2 PTS)!',
      actionPrompt: isEn
        ? 'Activate "Play as Shadow (1/1)", select your 8 of Hearts (8♥ = 2 pts), and deploy it to the Center Front.'
        : 'Activa el botón "Jugar como Sombra (1/1)", selecciona tu 8 de Corazones (8♥ = 2 pts) y colócalo en el Frente Central.',
      whyThisCard: isEn
        ? 'In Casual Mode, every player gets 1 personal Shadow Marker per round. By playing 8♥ (2 pts) as a Shadow in the Center, your team reaches 3 Hearts (K♥, Q♥, 8♥) and activates COLOR (+2 pts)! Notice how your Allied Real Total on the Center counter immediately jumps to 10 pts (3 + 3 + 2 + 2 Color) because teammates know your Shadow, while rivals only see 6 visible pts + 1 hidden Shadow!'
        : 'En Modo Casual, cada jugador recibe 1 Marcador de Sombra personal fijo por ronda. Al jugar tu 8♥ (2 pts) como Sombra en el Centro, vuestro equipo reúne 3 Corazones (K♥, Q♥, 8♥) y activa ¡COLOR (+2 pts)! Observa cómo vuestro Total Real Aliado en el contador del Centro sube al instante a 10 pts (3 + 3 + 2 + 2 Color) porque tu equipo conoce tu Sombra, ¡mientras que los rivales solo ven 6 pts visibles + 1 Sombra oculta!',
      whyNotOthers: isEn
        ? [
            { cardLabel: '4 of Clubs (4♣ = 1p)', reason: 'Does not complete the 3-Heart Color bonus in the Center.' },
            { cardLabel: 'Ace of Diamonds (A♦ = 4p)', reason: 'Reserved to win the Left Front!' },
          ]
        : [
            { cardLabel: '4 de Tréboles (4♣ = 1p)', reason: 'No completaría los 3 Corazones para el bono de Color (+2) en el Centro.' },
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
        ? 'A2 adds 9♥ (2 pts) to the Center. Notice the Casual Mode rule: Color (+2 pts) is a single flat bonus for having 3 or more cards of the same suit, so 4 Hearts gives Base (3+3+2+2 = 10) + Color (+2) = 12 real allied points!'
        : 'A2 añade el 9♥ (2 pts) al Centro. ¡Fíjate en la regla del Modo Casual! El Color (+2 pts) es una bonificación única por tener 3 o más cartas del mismo palo, así que con 4 Corazones sumáis Base (3+3+2+2 = 10) + Color (+2) = ¡12 puntos reales aliados!',
      whyNotOthers: isEn
        ? '12 points in Casual Mode is an almost unbeatable fortress in the Center.'
        : '12 puntos en la Escala Comprimida del Modo Casual es una fortaleza casi inexpugnable en el Centro.',
      tacticalInsight: isEn
        ? 'Center Live Counter: 12 Allied Real Pts (incl. Shadow) vs 6 Rival Visible Pts.'
        : 'Contador en Vivo del Centro: 12 Pts Reales Aliados (incl. Sombra) vs 6 Pts Visibles del Rival.',
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
        ? 'In Casual Mode, the Ace (A) is worth 4 base points ("4p") — the highest single card value! Placing A♦ on the Left Front alongside A2\'s J♦ (3p) brings your Left live counter to 7 pts and prepares a 3-Diamond Color bonus (+2 pts) when A2 plays their last Diamond!'
        : 'En el Modo Casual, el As (A) vale 4 puntos base ("4p"), ¡el valor individual más alto del juego! Colocar tu A♦ en el Frente Izquierdo junto a la J♦ (3p) de A2 sube vuestro contador en vivo a 7 pts y deja preparado el Color de 3 Diamantes (+2 pts) para el último turno de A2.',
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
        ? 'B1 adds 1 point to the Right Front (live counter: 2 vs 6 pts).'
        : 'B1 suma 1 punto en el Frente Derecho (contador en vivo: 2 vs 6 pts).',
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
        ? 'Notice that on the Right you have 10♠ (2p) and 6♠ (1p) = 3 pts (2 Spades do not give Color in Casual Mode).'
        : 'Observa que en la Derecha tenéis 10♠ (2p) y 6♠ (1p) = 3 pts (2 Picas no dan Color en Modo Casual).',
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
        ? 'B2 places 4♦ (1 pt) on the Left. Visible rival score on the Left is now 2 pts (5♦ + 4♦) plus their hidden Shadow Card!'
        : 'B2 coloca su 4♦ (1 pto) en la Izquierda. La puntuación visible del rival en la Izquierda es ahora de 2 pts (5♦ + 4♦) más su Carta Sombra oculta.',
      whyNotOthers: isEn
        ? 'Even if their hidden card is a Diamond (giving them 3 Diamonds = +2 Color), your J♦ (3p) + A♦ (4p) + A2\'s upcoming 3♦ (1p) + Color (+2) = 10 pts will crush them!'
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
        ? 'B1 plays 9♠ (2p) on the Right (reaching 3 Spades = +2 Color!), Ally A2 plays 3♦ (1p) on the Left (reaching 3 Diamonds = +2 Color!), and Rival B2 plays 5♥ (1p) in the Center.'
        : 'B1 juega 9♠ (2p) en la Derecha (¡logrando 3 Picas = +2 Color!), Aliado A2 juega 3♦ (1p) en la Izquierda (¡logrando 3 Diamantes = +2 Color!) y Rival B2 juega 5♥ (1p) en el Centro.',
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
        ? 'Compressed Scale Breakdown & Direct Overtime Rule'
        : 'Desglose con Escala Comprimida y Regla de Prórroga Directa',
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
        ? 'Guided Tactical Instruction: 2 vs 2 Mode (2v2)'
        : 'Instrucción Táctica Guiada: Modalidad 2 contra 2 (2v2)',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'You are about to play a guided 2v2 match with bots. Here you will learn how every rule, calculation, and tactical decision works in Official Competitive Mode v2.0.',
            'In 2v2 you play alongside your partner (Ally A2) against two opponents (B1 and B2). There are 3 battlefronts: Left, Center, and Right.',
            'Official 1, 2 & 3 Round Points System: At the end of deployment, Round Points are awarded based on how many fronts your team conquers:',
            '• Tie in the Round (e.g. 1 front each and 1 void, or all 3 void): +1 Round Point for EACH team.',
            '• Standard Victory (winning 2 of the 3 fronts): +2 Round Points for the winning team.',
            '• Total Dominance / "Full Sweep" (winning all 3 fronts): +3 Round Points for the winning team!',
            'In this tutorial we will guide you step by step: each card to play will be highlighted, we will explain why it is the optimal move and why you should not play other cards, and we will analyze responses from opponents and allies.',
          ]
        : [
            'Estás a punto de disputar una partida guiada de 2v2 con bots. Aquí aprenderás exactamente cómo funciona cada regla, cada cálculo y cada decisión táctica del Modo Competitivo Oficial v2.0.',
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
        ? 'Phase 1: Preparation, Synergies & Initiative'
        : 'Fase 1: Preparación, Sinergias e Iniciativa',
      subtitle: isEn
        ? 'Official Scoring System (1/2/3 Pts) and Opening Attack'
        : 'Sistema Oficial de Puntuación (1/2/3 Pts) y Sorteo de Ataque',
      instructor: isEn ? 'Instructor Commander' : 'Comandante Instructor',
      content: isEn
        ? [
            'Base card values run from 2 to 10 at face value, J=11, Q=12, K=13, and Ace (A) = 14 points (the highest single card in the deck!).',
            'Four powerful formation bonuses decide battles on each front: Suit Synergy (+5 pts per additional card of the same suit in the front), Pair (+10 pts for 2 cards of same rank), Short Straight (+15 pts for 3 consecutive ranks), and Trio (+20 pts for 3 cards of same rank, which supersedes Pair).',
            'Round Points Scale (1, 2 & 3 Pts): Winning 2 fronts grants +2 Round Points, sweeping all 3 fronts ("Pleno") grants +3 Round Points, and if the round ends tied in fronts, BOTH teams score +1 Round Point each!',
            'Shadow Economy (Official v2.0): Teams start Round 1 with strictly 0 Shadow Markers. At round end, teams earn markers based on performance (+1 win, +2 loss, +3 loss streak of 2+, +1 tie in 2v2) which carry over and accumulate across rounds. For this training drill, we simulate an active pool of 2 markers so you can learn how to play shadow cards.',
            'Who attacks first? The choice of which team opens Round 1 is 100% RANDOM (a deck cut on tabletop, automated digitally). From Round 2 onward, initiative rotates automatically to the opposing team. For this drill, your team (Team A) holds the initiative and you (A1) will execute the opening attack!',
          ]
        : [
            'Los valores base de las cartas van del 2 al 10 según su valor nominal, J=11, Q=12, K=13 y el As (A) = 14 puntos (¡la carta individual más alta de la baraja!).',
            'Cuatro formaciones estratégicas por sinergia deciden cada frente: Sinergia de Palo (+5 pts por cada carta adicional del mismo palo en el frente), Pareja (+10 pts por 2 cartas de igual valor), Escalera Corta (+15 pts por 3 cartas consecutivas) y Trío (+20 pts por 3 cartas de igual valor, anulando la pareja de esas cartas).',
            'Escala de Puntos de Ronda (1, 2 y 3 Pts): Ganar 2 frentes otorga +2 Puntos de Ronda, ganar los 3 frentes ("Pleno") otorga +3 Puntos de Ronda, ¡y en caso de empate en frentes AMBOS equipos suman +1 Punto de Ronda cada uno!',
            'Economía de Sombras (Reglamento v2.0): Los equipos inician la Ronda 1 con estrictamente 0 Marcadores de Sombra. Al final de la ronda, ganan marcadores según el resultado (+1 victoria, +2 derrota, +3 racha de 2+ derrotas, +1 empate en 2v2) que se acumulan y ahorran entre rondas. En este tutorial simulamos una reserva de 2 marcadores para que aprendas su uso práctico.',
            '¿Quién empieza atacando? La iniciativa en la Ronda 1 es 100% ALEATORIA (mediante corte de baraja en mesa o sorteo digital automático). A partir de la Ronda 2, rota al equipo rival. Para esta instrucción, ¡tu equipo (Equipo A) tiene la iniciativa y serás tú (A1) quien abra el combate!',
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
            'Flag Fall Rule (00:00): If a team\'s clock reaches 00:00 before completing its turns, it automatically loses the round and the opponent scores +2 Round Points directly (or +3 Round Points if at that instant the opponent already led all 3 fronts with all cards played)! Cards already deployed on the table are revealed and their points are preserved for the final tie-breaker tally.',
          ]
        : [
            'En Frentes de Guerra el tiempo NO es individual por turno. El reloj es COMPARTIDO para todo el equipo.',
            'Bolsa de tiempo conjunta: Cada equipo dispone de un tiempo total por ronda (ejemplo en 2v2: Rápido = 1m 40s, Medio = 3m 20s, Lento = 5m 00s). Los segundos que consuma cada jugador durante su turno se restan al reloj global de su equipo.',
            'Conmutación del reloj: El reloj de tu equipo corre mientras tú o tu aliado pensáis y realizáis la jugada. En el instante exacto en que colocáis la carta en el frente, vuestro reloj se detiene y se activa de inmediato el reloj del equipo rival.',
            'Reseteo por ronda: El reloj de equipo se reinicia al valor completo al inicio de cada nueva ronda. El tiempo sobrante de una ronda no se acumula para las siguientes.',
            'Regla de Caída de Bandera (00:00): Si el reloj de un equipo llega a 00:00 antes de completar sus turnos, ¡pierde automáticamente la ronda y el rival suma +2 Puntos de Ronda directos (o +3 Puntos si en ese instante el rival ya dominaba los 3 frentes habiendo jugado todas sus cartas)! Las cartas ya colocadas en la mesa se revelan y sus puntos se conservan para el cómputo de desempate final.',
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
        ? 'Select your King of Hearts (K♥) and deploy it to the Center Front.'
        : 'Selecciona tu Rey de Corazones (K♥) y despliégalo en el Frente Central.',
      whyThisCard: isEn
        ? 'Having won the round initiative, your team attacks first and you open the match. The King of Hearts has a strong base value of 13 points. Opening with authority in the Center establishes immediate territorial control and signals to your ally A2 that we hold Hearts to coordinate suit synergies.'
        : 'Al haber ganado la iniciativa de la ronda, tu equipo empieza atacando y abres la partida. El Rey de Corazones tiene un poderoso valor base de 13 puntos. Abrir con un golpe de autoridad en el Centro establece control territorial inmediato y le indica a tu aliado A2 que tenemos cartas de Corazones para coordinar sinergias de palo.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣)',
              reason: 'It is very weak (4 pts). Opening with it surrenders front control without resistance.',
            },
            {
              cardLabel: 'Ace of Diamonds (A♦)',
              reason: 'The Ace is the highest card in the deck (14 pts). We must save it to answer threats or secure another front later.',
            },
            {
              cardLabel: 'Ten of Spades (10♠)',
              reason: 'Above-average card (10 pts). It lacks the deterrent punch we need to seize the center immediately.',
            },
            {
              cardLabel: '8 of Hearts (8♥)',
              reason: 'Provides 8 pts. Holding it enables subsequent suit synergies or playing it concealed as a Shadow.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣)',
              reason: 'Es una carta muy débil (4 pts). Abrir con ella regalaría el control del frente al rival sin oponer resistencia.',
            },
            {
              cardLabel: 'As de Diamantes (A♦)',
              reason: 'El As es la carta más alta de la baraja (14 pts). Es un recurso supremo que debemos reservar para contestar amenazas o asegurar otro frente más adelante.',
            },
            {
              cardLabel: 'Diez de Picas (10♠)',
              reason: 'Es una carta media-alta (10 pts). No causa el impacto inicial disuasorio que buscamos en el centro.',
            },
            {
              cardLabel: '8 de Corazones (8♥)',
              reason: 'Aporta 8 pts. Guardarlo nos servirá para encadenar sinergias de palo posteriores o jugarlo como carta oculta (Sombra).',
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
        ? 'Rival B1 plays the Queen of Diamonds (Q♦, 12 pts) on the Center Front.'
        : 'Rival B1 juega la Reina de Diamantes (Q♦, 12 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'Seeing your King (13 pts) in the Center, B1 refuses to concede without a fight. B1 plays Queen (12 pts) to contest closely (13 vs 12).'
        : 'Al ver tu Rey (13 pts) en el Centro, B1 no quiere ceder la zona central sin luchar. Coloca su Reina (12 pts) para mantener el frente reñido (13 vs 12).',
      whyNotOthers: isEn
        ? 'B1 opted not to play Jack of Hearts, preferring to see if partner B2 can support or saving it for another front.'
        : 'B1 decidió no jugar su Jota de Corazones porque prefiere esperar a ver si su compañero B2 puede apoyarle o reservarla para disputar otro frente.',
      tacticalInsight: isEn
        ? 'Notice the center score: you are leading 13 to 12. Your opening blow forced the opponent to spend one of their highest cards!'
        : 'Fíjate en el marcador del centro: estás liderando 13 a 12. ¡Tu golpe inicial ha forzado al rival a gastar una de sus cartas más altas!',
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
        ? 'Ally A2 plays the Queen of Hearts (Q♥) on the Center Front.'
        : 'Aliado A2 juega la Reina de Corazones (Q♥) en el Frente Central.',
      whyPlayed: isEn
        ? 'Attention! Your ally A2 saw you played Hearts (K♥). By playing Queen of Hearts (Q♥), your team now has 2 cards of the same suit in the same front.'
        : '¡Atención a esto! Tu aliado A2 vio que jugaste Corazones (K♥). Al jugar su Reina de Corazones (Q♥), vuestro equipo tiene ahora 2 cartas del mismo palo en el mismo frente.',
      whyNotOthers: isEn
        ? 'A2 did not play Jack of Diamonds or spades because triggering the synergy bonus in the Center provides an overwhelming advantage.'
        : 'A2 no jugó su Jota de Diamantes ni cartas de picas porque activar la bonificación de sinergia en el Centro da una ventaja matemática descomunal.',
      tacticalInsight: isEn
        ? 'KEY RULE: SUIT SYNERGY! Each additional card of the same suit grants +5 BONUS POINTS. Your team totals: 13 (K♥) + 12 (Q♥) + 5 (Synergy) = 30 points in the Center against opponent\'s 12!'
        : '¡REGLA CLAVE: SINERGIA DE PALO! Cada carta adicional del mismo palo otorga +5 PUNTOS EXTRA. Vuestro equipo suma: 13 (K♥) + 12 (Q♥) + 5 (Sinergia) = ¡30 puntos en el Centro frente a los 12 del rival!',
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
        ? 'Rival B2 plays the King of Spades (K♠, 13 pts) on the Right Front.'
        : 'Rival B2 juega el Rey de Picas (K♠, 13 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'Rival B2 sees the Center dominated by your Hearts combo (30 vs 12). Spending troops there would be futile, so B2 opens Right Front with their top card (King = 13 pts) to secure that sector.'
        : 'Rival B2 ve que el Centro está dominado por vuestro combo de Corazones (30 vs 12). Sabe que gastar tropas en el centro ahora sería inútil, así que abre el Frente Derecho con su carta más poderosa (Rey = 13 pts) para intentar asegurar esa zona.',
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
        ? 'Select your Ten of Spades (10♠) and deploy it to the Right Front.'
        : 'Selecciona tu Diez de Picas (10♠) y despliégalo en el Frente Derecho.',
      whyThisCard: isEn
        ? 'Rival B2 just deployed King of Spades (13 pts) on the right. If we surrender that sector for free, they only need one more to claim the round. Playing your 10♠ (10 pts) contests the front closely (13 vs 10) without burning your Ace.'
        : 'El rival B2 acaba de poner su Rey de Picas (13 pts) en la derecha. Si dejamos que se lleven ese frente gratis, solo necesitarán ganar uno más para ganar la ronda. Jugando tu 10♠ (10 pts), disputas el frente quedando a tiro de piedra (13 vs 10) sin gastar tus cartas clave.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: 'Ace of Diamonds (A♦)',
              reason: 'The Ace (14 pts) beats the King (13 pts), but expending it this early leaves us without our decisive weapon for the endgame.',
            },
            {
              cardLabel: '8 of Hearts (8♥)',
              reason: 'It is an 8 of Hearts (8 pts). Spending it on the right without hearts synergy wastes its potential in the center or its surprise value.',
            },
            {
              cardLabel: '4 of Clubs (4♣)',
              reason: 'It is too weak (4 pts vs 13). It would leave us 9 points behind, an almost insurmountable deficit.',
            },
          ]
        : [
            {
              cardLabel: 'As de Diamantes (A♦)',
              reason: 'El As (14 pts) ganaría al Rey (13 pts), pero gastar el As tan temprano en el flanco nos dejaría sin nuestra carta más determinante para el momento cumbre.',
            },
            {
              cardLabel: '8 de Corazones (8♥)',
              reason: 'Es carta de Corazones (8 pts). Gastarla en la derecha sin sinergia de corazones desaprovecha su potencial en el centro o su factor sorpresa.',
            },
            {
              cardLabel: '4 de Tréboles (4♣)',
              reason: 'Es demasiado baja (4 pts vs 13 del rival). Nos dejaría 9 puntos por detrás, una distancia muy difícil de recortar.',
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
        ? 'Rival B1 plays the Jack of Hearts (J♥, 11 pts) on the Center Front.'
        : 'Rival B1 juega la Jota de Corazones (J♥, 11 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'B1 attempts to stay alive in the center and plays Jack of Hearts (11 pts base). Team B now has 23 points in the center (12 + 11).'
        : 'B1 intenta no perder el centro definitivamente y juega su Jota de Corazones (11 pts base). Ahora el equipo B suma 23 puntos en el centro (12 + 11).',
      whyNotOthers: isEn
        ? 'B1 did not play 2♣ or 5♦ because they would be weak discards in a trailing sector.'
        : 'No jugó su 2♣ ni su 5♦ porque serían descartes débiles en un frente donde van perdiendo.',
      tacticalInsight: isEn
        ? 'Even though B1 added 11 points, you still dominate the Center with 30 points thanks to your earlier synergy.'
        : 'Aunque B1 sumó 11 puntos, vosotros seguís dominando el Centro con 30 puntos gracias a vuestra sinergia previa.',
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
        ? 'Ally A2 plays the Jack of Diamonds (J♦, 11 pts) on the Left Front.'
        : 'Aliado A2 juega la Jota de Diamantes (J♦, 11 pts) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Your team leads Center (30 vs 23) and contests Right (10 vs 13). Ally A2 takes advantage of the empty Left Front to plant their Jack (11 pts) and take a 11-0 lead.'
        : 'Vuestro equipo lidera el Centro (30 a 23) y disputa la Derecha (10 a 13). Aliado A2 aprovecha que el Frente Izquierdo está totalmente vacío para colocar su Jota (11 pts) y tomar ventaja libre (11 a 0).',
      whyNotOthers: isEn
        ? 'A2 refrained from center (already comfortable lead) and right to force opponents to stretch thin across all 3 fronts.'
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
        ? 'Rival B2 plays the 7 of Spades (7♠) on the Right Front.'
        : 'Rival B2 juega el 7 de Picas (7♠) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'B2 bolsters the right with 7 of Spades. Combining K♠ and 7♠ triggers enemy Spades Synergy (+5 pts)! Their team totals 13 + 7 + 5 = 25 points on the right against your 10 points.'
        : 'B2 refuerza la derecha con su 7 de Picas. ¡Al juntar K♠ y 7♠, los rivales activan su propia Sinergia de Picas (+5 pts)! Su equipo suma 13 + 7 + 5 = 25 puntos en la derecha frente a tus 10 puntos.',
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
        ? 'Activate the "Play as Shadow" button, select your 8 of Hearts (8♥), and deploy it to the Center Front.'
        : 'Activa el botón "Jugar como Sombra", selecciona tu 8 de Corazones (8♥) y colócalo en el Frente Central.',
      whyThisCard: isEn
        ? 'In official WarFronts v2.0 rules, shadow cards are part of a continuous team economy: teams start Round 1 with 0 markers and earn them at round end (+1 win, +2 loss, +3 streak of 2+ losses, +1 tie in 2v2), saving them across rounds. In this drill, we provide 2 simulated markers so you can master their use. When playing a Shadow Card, you silently show it to your teammates before placing it face-down (in the digital game, it remains fully VISIBLE to your entire team with a purple border while hidden from opponents). Your ally A2 sees your 8♥ clearly to coordinate and build suit synergy (+10 pts for 3 hearts), while opponents only see the dark back, completely intimidating them.'
        : 'En el reglamento oficial v2.0, las cartas sombra forman parte de una economía continua de equipo: los equipos inician la Ronda 1 con 0 marcadores y los ganan al final de la ronda (+1 por ganar, +2 por perder, +3 si llevas 2+ derrotas seguidas o +1 si hay empate en 2v2), ahorrándolos entre rondas. En este tutorial te proporcionamos 2 marcadores simulados para aprender su uso. Al jugar una Carta Sombra, se enseña en silencio a los compañeros antes de bajarla BOCA ABAJO (en la versión digital permanece VISIBLE para todo tu equipo con borde morado y oculta para los rivales). Tu aliado A2 ve perfectamente tu 8♥ para coordinar la estrategia y calcular las sinergias (+10 pts por 3 corazones), mientras que los rivales solo ven el reverso oscuro, intimidándolos por completo.',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣)',
              reason: 'Burning a team shadow token on a weak 4 with no synergy squanders your most potent tactical asset.',
            },
            {
              cardLabel: 'Ace of Diamonds (A♦)',
              reason: 'The Ace is a powerhouse we want to deploy face up later to claim the Left Front decisively.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣)',
              reason: 'Gastar una sombra de equipo en un 4 débil que no tiene sinergia sería un desperdicio del recurso táctico más valioso.',
            },
            {
              cardLabel: 'As de Diamantes (A♦)',
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
        ? 'Rival B1 plays the 5 of Diamonds (5♦, 5 pts) on the Left Front.'
        : 'Rival B1 juega el 5 de Diamantes (5♦, 5 pts) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'Your ally A2 has Jack of Diamonds (11 pts) on the left. B1 cannot leave that front uncontested, playing 5♦ to start disputing it.'
        : 'Tu aliado A2 tiene una Jota de Diamantes (11 pts) en la izquierda. B1 no puede dejar que os llevéis ese frente sin oposición, así que coloca su 5♦ para empezar a disputarlo.',
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
        ? 'Ally A2 plays the 9 of Hearts (9♥, 9 pts) on the Center Front.'
        : 'Aliado A2 juega el 9 de Corazones (9♥, 9 pts) en el Frente Central.',
      whyPlayed: isEn
        ? 'A2 follows the master plan: adding another Hearts card to Center. The Center is now fortified with 4 Team A Hearts cards (+15 pts suit synergy).'
        : 'A2 sigue vuestro plan maestro: añade otra carta de corazones al Frente Central. Con esto, el Centro queda completamente blindado con 4 cartas de Corazones del Equipo A (+15 pts de sinergia de palo).',
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
        ? 'Select your Ace of Diamonds (A♦) and deploy it to the Left Front.'
        : 'Selecciona tu As de Diamantes (A♦) y despliégalo en el Frente Izquierdo.',
      whyThisCard: isEn
        ? 'Crucial match turning point! Look at the strategic picture: Center is locked down by your Hearts combo. Right belongs to the rival. Therefore: THE ROUND IS DECIDED ON THE LEFT FRONT! Rival B2 placed a shadow card. Playing your Ace of Diamonds (14 base points, the highest card in the deck) delivers overwhelming power and triggers Diamond Synergy with Ally A2\'s J♦ (+5 bonus pts). This move seals the round!'
        : '¡Momento crucial de la partida! Analicemos el panorama global: el Centro está ganado con creces por vuestro combo de corazones. La Derecha está en manos del rival. Por tanto: ¡LA PARTIDA SE DECIDE EN EL FRENTE IZQUIERDO! El rival B2 ha puesto una carta sombra. Al jugar tu As de Diamantes (14 puntos base, la carta más alta de la baraja), sumas una ventaja arrolladora en la izquierda y activas la Sinergia de Diamantes con la J♦ de tu aliado A2 (+5 pts adicionales). ¡Este movimiento sentencia la ronda!',
      whyNotOthers: isEn
        ? [
            {
              cardLabel: '4 of Clubs (4♣)',
              reason: 'The 4♣ provides only 4 points without synergy, leaving the left exposed to the enemy shadow card.',
            },
          ]
        : [
            {
              cardLabel: '4 de Tréboles (4♣)',
              reason: 'El 4♣ sumaría solo 4 puntos y no activaría sinergia, dejando la izquierda a merced de la carta sombra del rival.',
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
        ? 'Rival B1 plays the Two of Clubs (2♣, 2 pts) on the Right Front.'
        : 'Rival B1 juega el Dos de Tréboles (2♣, 2 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'Seeing your Ace drop on the left, B1 realizes challenging the left or center is futile. Executing a "Tactical Discard", B1 dumps their lowest card (2♣) on the right where their team already leads, bagging 2 cumulative points safely.'
        : 'Al ver caer tu As en la izquierda, B1 sabe que competir en la izquierda o centro es misión imposible. Realiza un "Descarte Táctico": deposita su carta más baja (2♣) en la derecha donde su equipo ya va ganando, sumando esos 2 puntos para su acumulado global sin estorbar.',
      whyNotOthers: isEn
        ? 'Lacks sufficient card strength to challenge your Ace of Diamonds on the left.'
        : 'No tiene cartas con valor suficiente para desafiar vuestro As de Diamantes en la izquierda.',
      tacticalInsight: isEn
        ? 'Tactical lesson: When a front is out of reach, dumping low cards into secure fronts to boost tie-breaker points is standard high-level play.'
        : 'Lección táctica: Cuando un frente está perdido, colocar cartas bajas en frentes seguros para sumar puntos al acumulado es una técnica profesional de WarFronts.',
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
      title: isEn ? "Ally A2's Turn: Harvesting Cumulative Points" : 'Turno de Aliado A2: Cosecha de Puntos Acumulados',
      actionSummary: isEn
        ? 'Ally A2 plays the Six of Spades (6♠, 6 pts) on the Right Front.'
        : 'Aliado A2 juega el Seis de Picas (6♠, 6 pts) en el Frente Derecho.',
      whyPlayed: isEn
        ? 'A2 does not need to overload the left (firmly held by Ace and Jack) and prefers adding 6 points on the right, connecting synergy with your earlier 10♠.'
        : 'A2 no necesita sobrecargar la izquierda (ya dominada por vuestro As y Jota) y prefiere sumar 6 puntos en la derecha, aprovechando para sumar sinergia con tu 10♠ anterior.',
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
        ? 'Rival B2 plays the Four of Diamonds (4♦, 4 pts) on the Left Front.'
        : 'Rival B2 juega el Cuatro de Diamantes (4♦, 4 pts) en el Frente Izquierdo.',
      whyPlayed: isEn
        ? 'B2 desperately tries to close the gap on the left with 4♦, combining synergy with B1\'s 5♦. But your Ace and Jack maintain an insurmountable advantage.'
        : 'B2 intenta desesperadamente recortar distancias en la izquierda con su 4♦, sumando sinergia con el 5♦ de B1. Pero vuestro As y Jota mantienen una ventaja inalcanzable.',
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
        ? 'Deploy your final card, the Four of Clubs (4♣), to the Right Front.'
        : 'Despliega tu última carta, el Cuatro de Tréboles (4♣), en el Frente Derecho.',
      whyThisCard: isEn
        ? 'You only have the 4♣ remaining. Center and Left are mathematically won by your team (2 of 3 fronts secured = +2 Round Points!). Deploying 4♣ to the Right Front is your ideal closing move: it feeds 4 points directly into your team\'s Cumulative Points tally for tie-breakers!'
        : 'Te queda únicamente el 4♣. El Centro y la Izquierda ya están matemáticamente ganados por vuestro equipo (¡2 de 3 frentes asegurados = +2 Puntos de Ronda!). Desplegar el 4♣ en el Frente Derecho es tu jugada de cierre perfecta: sumas 4 puntos directamente al marcador de Puntos Acumulados de tu equipo. ¡Los puntos acumulados deciden quién gana el juego en caso de empate en Puntos de Ronda!',
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
        ? 'You have mastered all the fundamentals of WarFronts'
        : 'Has dominado todos los fundamentos de Frentes de Guerra',
    },
  ];
}

export const TUTORIAL_STEPS = getTutorialSteps('es');
