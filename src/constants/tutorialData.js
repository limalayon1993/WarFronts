// Script maestro oficial para el Tutorial Guiado 2v2 de Frentes de Guerra
// Diseñado para garantizar una experiencia didáctica determinista y completa de principio a fin.

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

export const TUTORIAL_PLAYERS_CONFIG = [
  {
    id: 'A1',
    name: 'Tú (A1)',
    team: 'teamA',
    isHuman: true,
    isBot: false,
    shadowsLeft: 1,
  },
  {
    id: 'B1',
    name: 'Rival B1',
    team: 'teamB',
    isHuman: false,
    isBot: true,
    shadowsLeft: 1,
  },
  {
    id: 'A2',
    name: 'Aliado A2',
    team: 'teamA',
    isHuman: false,
    isBot: true,
    shadowsLeft: 1,
  },
  {
    id: 'B2',
    name: 'Rival B2',
    team: 'teamB',
    isHuman: false,
    isBot: true,
    shadowsLeft: 1,
  },
];

// Pasos secuenciales del tutorial interactivo
export const TUTORIAL_STEPS = [
  // PASO 0: INTRODUCCIÓN GENERAL
  {
    stepId: 0,
    type: 'dialog',
    stage: 'intro',
    title: '¡Bienvenido a la Academia de Frentes de Guerra!',
    subtitle: 'Instrucción Táctica Guiada: Modalidad 2 contra 2 (2v2)',
    instructor: 'Comandante Instructor',
    content: [
      'Estás a punto de disputar una partida guiada de 2v2 con bots. Aquí aprenderás exactamente cómo funciona cada regla, cada cálculo y cada decisión táctica.',
      'En 2v2 juegas junto a tu compañero (Aliado A2) frente a dos rivales (B1 y B2). Hay 3 frentes de combate: Izquierdo, Central y Derecho.',
      'Regla de Oro: Para ganar la ronda, tu equipo debe ganar al menos 2 de los 3 frentes al final del despliegue.',
      'En este tutorial te llevaremos de la mano: cada carta a jugar estará indicada, te explicaremos por qué es la jugada ideal y por qué no debes usar las otras cartas, y analizaremos las respuestas de rivales y aliados.',
    ],
    buttonText: 'Comenzar Instrucción',
  },

  // PASO 1: LECTURA DEL PALO DE TRIUNFO E INICIATIVA (QUIÉN EMPIEZA ATACANDO)
  {
    stepId: 1,
    type: 'dialog',
    stage: 'trump_reveal',
    title: 'Fase 1: Palo de Triunfo e Iniciativa Inicial',
    subtitle: 'Triunfo de Ronda y Sorteo de Quién Empieza Atacando',
    instructor: 'Comandante Instructor',
    content: [
      'Observa la parte superior: la carta de triunfo revelada es el 7 de Corazones (♥). Toda carta de Corazones que se juegue en cualquier frente sumará automáticamente +2 PUNTOS EXTRA además de su valor numérico base (del 2 al 10, J=11, Q=12, K=13, A=14).',
      '¿Quién empieza atacando? La selección de qué equipo abre el juego es 100% ALEATORIA en la Ronda 1. En el juego presencial de mesa se realiza un corte de baraja (robando una carta cada equipo y ganando la más alta), mientras que en esta versión digital el sistema realiza el sorteo aleatorio automáticamente por código sin necesidad de cortar cartas.',
      'Rotación de iniciativa: A partir de la Ronda 2, la iniciativa rota automáticamente al equipo rival al comenzar cada ronda, alternando quién abre las hostilidades.',
      'Para esta instrucción guiada, ¡el sorteo ha otorgado la iniciativa a tu equipo (Equipo A) y serás tú (A1) quien realice el primer ataque!',
    ],
    buttonText: 'Ver Fase de Planificación',
  },

  // PASO 2: FASE TÁCTICA SIN CARTAS
  {
    stepId: 2,
    type: 'dialog',
    stage: 'planning',
    title: 'Fase 2: Táctica de Equipo (Sin Cartas en Mano)',
    subtitle: 'La regla que elimina al "Jugador Alfa"',
    instructor: 'Comandante Instructor',
    content: [
      'En el reglamento oficial, antes de recibir cartas hay una fase táctica de 30 segundos donde los jugadores planifican SIN CARTAS en mano.',
      '¿Por qué sin cartas? Porque en los juegos cooperativos a menudo un jugador dominante le dice a los demás qué hacer. Al no tener cartas aún, el equipo debe acordar la macro-estrategia: por ejemplo, "aseguremos con fuerza el Centro y un Flanco, y si presionan mucho el otro, no malgastemos tropas".',
      'Además, en esta fase los equipos pactan la gestión del reloj de equipo para no quedarse sin tiempo en el cierre de la ronda.',
    ],
    buttonText: 'Ver Reloj de Equipo Compartido',
  },

  // PASO 2.5: NUEVA REGLA - EL RELOJ DE EQUIPO COMPARTIDO
  {
    stepId: 'team_clock',
    type: 'dialog',
    stage: 'team_clock',
    title: 'Nueva Regla Oficial: El Reloj de Equipo Compartido',
    subtitle: 'Gestión del Tiempo por Equipos (Dual Chess Clock)',
    instructor: 'Comandante Instructor',
    content: [
      'En Frentes de Guerra el tiempo NO es individual por turno (no dispones de 15 segundos aislados por jugada). Ahora el reloj es COMPARTIDO para todo el equipo.',
      'Bolsa de tiempo conjunta: Cada equipo dispone de un tiempo total por ronda (ejemplo en 2v2: Rápido = 1m 40s, Medio = 3m 20s, Lento = 5m 00s). Los segundos que consuma cada jugador durante su turno se restan al reloj global de su equipo.',
      'Conmutación del reloj: El reloj de tu equipo corre mientras tú o tu aliado pensáis y realizáis la jugada. En el instante exacto en que colocáis la carta en el frente, vuestro reloj se detiene y se activa de inmediato el reloj del equipo rival.',
      'Reseteo por ronda: El reloj de equipo se reinicia al valor completo al inicio de cada nueva ronda. El tiempo sobrante de una ronda no se acumula para las siguientes.',
      '⚠️ Regla de Caída de Bandera (00:00): Si el reloj de un equipo llega a 00:00 antes de completar sus turnos, ¡pierde automáticamente la ronda (+1 Punto al rival)! Sin embargo, las cartas ya colocadas en la mesa se revelan y sus puntos se conservan para el cómputo de desempate final.',
    ],
    buttonText: '¡Entendido! Iniciar Despliegue de Cartas',
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
    title: 'Tu Turno 1: Despliegue Inicial',
    actionPrompt: 'Selecciona tu Rey de Corazones (K♥) y despliégalo en el Frente Central.',
    whyThisCard:
      'Al haber ganado la iniciativa de la ronda, tu equipo empieza atacando y abres la partida. El Rey de Corazones tiene valor base 13 + 2 puntos por ser palo de triunfo = ¡15 puntos totales! Abrir con un golpe de autoridad en el Centro establece control territorial inmediato y le indica a tu aliado A2 que tenemos cartas de Corazones para cooperar.',
    whyNotOthers: [
      {
        cardLabel: '4 de Tréboles (4♣)',
        reason: 'Es una carta muy débil (4 pts). Abrir con ella regalaría el control del frente al rival sin oponer resistencia.',
      },
      {
        cardLabel: 'As de Diamantes (A♦)',
        reason: 'El As es la carta más alta de la baraja (14 pts), pero NO es triunfo. Es un recurso supremo que debemos reservar para contestar amenazas o asegurar otro frente más adelante.',
      },
      {
        cardLabel: 'Diez de Picas (10♠)',
        reason: 'Es una carta media-alta sin bonificación de triunfo. No causa el impacto inicial disuasorio que buscamos en el centro.',
      },
      {
        cardLabel: '8 de Corazones (8♥)',
        reason: 'Es triunfo (10 pts), pero guardarlo nos servirá para encadenar sinergias posteriores o jugarlo como carta oculta (Sombra).',
      },
    ],
  },

  // PASO 4: TURNO 2 - RIVAL B1
  {
    stepId: 4,
    type: 'bot_turn',
    turnIndex: 2,
    botId: 'B1',
    botName: 'Rival B1',
    botTeam: 'teamB',
    card: { id: 'card-qd', suit: 'diamonds', rank: 'Q', base: 12 },
    frontKey: 'center',
    asShadow: false,
    title: 'Turno de Rival B1: Respuesta en el Centro',
    actionSummary: 'Rival B1 juega la Reina de Diamantes (Q♦, 12 pts) en el Frente Central.',
    whyPlayed:
      'Al ver tu Rey (15 pts) en el Centro, B1 no quiere ceder la zona central sin luchar. Coloca su Reina (12 pts) para mantener el frente reñido (15 vs 12).',
    whyNotOthers:
      'B1 decidió no jugar su Jota de Corazones (triunfo) porque prefiere esperar a ver si su compañero B2 puede apoyarle o reservarla para disputar otro frente.',
    tacticalInsight:
      'Fíjate en el marcador del centro: estás liderando 15 a 12. ¡Tu golpe inicial ha forzado al rival a gastar una de sus cartas más altas!',
  },

  // PASO 5: TURNO 3 - ALIADO A2
  {
    stepId: 5,
    type: 'bot_turn',
    turnIndex: 3,
    botId: 'A2',
    botName: 'Aliado A2',
    botTeam: 'teamA',
    card: { id: 'card-qh', suit: 'hearts', rank: 'Q', base: 12 },
    frontKey: 'center',
    asShadow: false,
    title: 'Turno de Aliado A2: ¡COMBO DE SINERGIA DE PALO!',
    actionSummary: 'Aliado A2 juega la Reina de Corazones (Q♥) en el Frente Central.',
    whyPlayed:
      '¡Atención a esto! Tu aliado A2 vio que jugaste Corazones (K♥). Al jugar su Reina de Corazones (Q♥), vuestro equipo tiene ahora 2 cartas del mismo palo en el mismo frente.',
    whyNotOthers:
      'A2 no jugó su Jota de Diamantes ni cartas de picas porque activar la bonificación de sinergia en el Centro da una ventaja matemática descomunal.',
    tacticalInsight:
      '¡REGLA CLAVE DE 2v2: SINERGIA DE PALO! Cada carta adicional del mismo palo otorga +5 PUNTOS EXTRA. Vuestro equipo suma: 15 (K♥) + 14 (Q♥) + 5 (Sinergia) = ¡34 puntos en el Centro frente a los 12 del rival!',
  },

  // PASO 6: TURNO 4 - RIVAL B2
  {
    stepId: 6,
    type: 'bot_turn',
    turnIndex: 4,
    botId: 'B2',
    botName: 'Rival B2',
    botTeam: 'teamB',
    card: { id: 'card-ks', suit: 'spades', rank: 'K', base: 13 },
    frontKey: 'right',
    asShadow: false,
    title: 'Turno de Rival B2: Flanco Alternativo',
    actionSummary: 'Rival B2 juega el Rey de Picas (K♠, 13 pts) en el Frente Derecho.',
    whyPlayed:
      'Rival B2 ve que el Centro está dominado por vuestro combo de Corazones (34 vs 12). Sabe que gastar tropas en el centro ahora sería inútil, así que abre el Frente Derecho con su carta más poderosa (Rey = 13 pts) para intentar asegurar esa zona.',
    whyNotOthers:
      'No jugó en la izquierda porque prefiere concentrar a su equipo en un frente específico donde no haya oposición aliada.',
    tacticalInsight:
      'Lección táctica: En WarFronts necesitas 2 de 3 frentes. Si el rival ve un frente muy adverso, buscará dominar los otros dos. ¡Debes vigilar sus movimientos!',
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
    title: 'Tu Turno 2: Contención en el Flanco',
    actionPrompt: 'Selecciona tu Diez de Picas (10♠) y despliégalo en el Frente Derecho.',
    whyThisCard:
      'El rival B2 acaba de poner su Rey de Picas (13 pts) en la derecha. Si dejamos que se lleven ese frente gratis, solo necesitarán ganar uno más para ganar la ronda. Jugando tu 10♠ (10 pts), disputas el frente quedando a tiro de piedra (13 vs 10) sin gastar tus cartas clave.',
    whyNotOthers: [
      {
        cardLabel: 'As de Diamantes (A♦)',
        reason: 'El As (14 pts) ganaría al Rey (13 pts), pero gastar el As tan temprano en el flanco nos dejaría sin nuestra carta más determinante para el momento cumbre.',
      },
      {
        cardLabel: '8 de Corazones (8♥)',
        reason: 'Es carta de Triunfo. Gastarla en la derecha sin sinergia de corazones desaprovecha su potencial en el centro o su factor sorpresa.',
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
    botName: 'Rival B1',
    botTeam: 'teamB',
    card: { id: 'card-jh', suit: 'hearts', rank: 'J', base: 11 },
    frontKey: 'center',
    asShadow: false,
    title: 'Turno de Rival B1: Refuerzo del Centro',
    actionSummary: 'Rival B1 juega la Jota de Corazones (J♥, 13 pts) en el Frente Central.',
    whyPlayed:
      'B1 intenta no perder el centro definitivamente y juega su Jota de Corazones (11 base + 2 de triunfo = 13 pts). Ahora el equipo B suma 25 puntos en el centro (12 + 13).',
    whyNotOthers:
      'No jugó su 2♣ porque sería un descarte inútil, ni su 5♦ porque no sumaba bono de triunfo en un frente donde van perdiendo.',
    tacticalInsight:
      'Aunque B1 sumó 13 puntos, vosotros seguís dominando el Centro con 34 puntos gracias a vuestra sinergia previa.',
  },

  // PASO 9: TURNO 7 - ALIADO A2
  {
    stepId: 9,
    type: 'bot_turn',
    turnIndex: 7,
    botId: 'A2',
    botName: 'Aliado A2',
    botTeam: 'teamA',
    card: { id: 'card-jd', suit: 'diamonds', rank: 'J', base: 11 },
    frontKey: 'left',
    asShadow: false,
    title: 'Turno de Aliado A2: Apertura del Tercer Frente',
    actionSummary: 'Aliado A2 juega la Jota de Diamantes (J♦, 11 pts) en el Frente Izquierdo.',
    whyPlayed:
      'Vuestro equipo lidera el Centro (34 a 25) y disputa la Derecha (10 a 13). Aliado A2 aprovecha que el Frente Izquierdo está totalmente vacío para colocar su Jota (11 pts) y tomar ventaja libre (11 a 0).',
    whyNotOthers:
      'No jugó en el centro porque ya tenéis ventaja suficiente, ni en la derecha porque prefiere obligar a los rivales a dividirse entre los 3 frentes.',
    tacticalInsight:
      'Excelente lectura de A2: al abrir el Frente Izquierdo, vuestro equipo presiona simultáneamente en los 3 frentes.',
  },

  // PASO 10: TURNO 8 - RIVAL B2
  {
    stepId: 10,
    type: 'bot_turn',
    turnIndex: 8,
    botId: 'B2',
    botName: 'Rival B2',
    botTeam: 'teamB',
    card: { id: 'card-7s', suit: 'spades', rank: '7', base: 7 },
    frontKey: 'right',
    asShadow: false,
    title: 'Turno de Rival B2: Sinergia Enemiga en la Derecha',
    actionSummary: 'Rival B2 juega el 7 de Picas (7♠) en el Frente Derecho.',
    whyPlayed:
      'B2 refuerza la derecha con su 7 de Picas. ¡Al juntar K♠ y 7♠, los rivales activan su propia Sinergia de Picas (+5 pts)! Su equipo suma 13 + 7 + 5 = 25 puntos en la derecha frente a tus 10 puntos.',
    whyNotOthers:
      'B2 no jugó en la izquierda porque vio la oportunidad de consolidar un frente seguro para su bando.',
    tacticalInsight:
      'Los rivales también saben crear sinergias. Ahora ellos lideran la Derecha. Pero recuerda: ¡solo necesitas ganar 2 frentes para llevarte la ronda entera!',
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
    title: 'Tu Turno 3: ¡MECÁNICA DEL MARCADOR DE SOMBRA!',
    actionPrompt: 'Activa el botón "Jugar como Sombra", selecciona tu 8 de Corazones (8♥) y colócalo en el Frente Central.',
    whyThisCard:
      'En 2v2 cada jugador tiene 1 Ficha de Sombra. Jugar una carta como sombra la coloca BOCA ABAJO: ni los rivales ni tu aliado conocen su valor ni su palo hasta el final de la ronda. Al poner el 8♥ (8 base + 2 triunfo = 10 pts) en el centro como sombra, ¡añades una tercera carta de corazones a vuestro equipo, elevando la sinergia de vuestro equipo a +10 puntos! Además, al estar oculta, los rivales no saben si es un farol o un As, intimidándolos por completo.',
    whyNotOthers: [
      {
        cardLabel: '4 de Tréboles (4♣)',
        reason: 'Gastar tu única sombra en un 4 débil que no tiene sinergia sería un desperdicio del recurso táctico más valioso.',
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
    botName: 'Rival B1',
    botTeam: 'teamB',
    card: { id: 'card-5d', suit: 'diamonds', rank: '5', base: 5 },
    frontKey: 'left',
    asShadow: false,
    title: 'Turno de Rival B1: Respuesta en la Izquierda',
    actionSummary: 'Rival B1 juega el 5 de Diamantes (5♦, 5 pts) en el Frente Izquierdo.',
    whyPlayed:
      'Tu aliado A2 tiene una Jota de Diamantes (11 pts) en la izquierda. B1 no puede dejar que os llevéis ese frente sin oposición, así que coloca su 5♦ para empezar a disputarlo.',
    whyNotOthers:
      'B1 no se atrevió a jugar en el Centro porque vio que acabas de desplegar una carta Sombra amenazante y teme que el centro sea imposible de remontar.',
    tacticalInsight:
      '¡Tu carta sombra ha funcionado psicológicamente! B1 se alejó del centro por temor a vuestra fuerza oculta.',
  },

  // PASO 13: TURNO 11 - ALIADO A2
  {
    stepId: 13,
    type: 'bot_turn',
    turnIndex: 11,
    botId: 'A2',
    botName: 'Aliado A2',
    botTeam: 'teamA',
    card: { id: 'card-9h', suit: 'hearts', rank: '9', base: 9 },
    frontKey: 'center',
    asShadow: false,
    title: 'Turno de Aliado A2: Blindaje Definitivo del Centro',
    actionSummary: 'Aliado A2 juega el 9 de Corazones (9♥, 11 pts) en el Frente Central.',
    whyPlayed:
      'A2 sigue vuestro plan maestro: añade otra carta de triunfo al Frente Central. Con esto, el Centro queda completamente blindado con 4 cartas de Corazones del Equipo A.',
    whyNotOthers:
      'A2 se guarda su 3♦ y 6♠ para los compases finales según convenga en los flancos.',
    tacticalInsight:
      'El Centro ya tiene 6 cartas acumuladas entre ambos bandos. Recuerda: el límite físico máximo de un frente en 2v2 es de 8 cartas.',
  },

  // PASO 14: TURNO 12 - RIVAL B2 -> SOMBRA RIVAL
  {
    stepId: 14,
    type: 'bot_turn',
    turnIndex: 12,
    botId: 'B2',
    botName: 'Rival B2',
    botTeam: 'teamB',
    card: { id: 'card-10d', suit: 'diamonds', rank: '10', base: 10 },
    frontKey: 'left',
    asShadow: true,
    title: 'Turno de Rival B2: ¡Sombra Rival en la Izquierda!',
    actionSummary: 'Rival B2 juega una CARTA SOMBRA (Oculta) en el Frente Izquierdo.',
    whyPlayed:
      'B2 gasta su ficha de sombra para ocultar su jugada en la izquierda frente a vuestro Aliado A2. Nadie sabe qué carta es, creando incertidumbre en el Frente Izquierdo.',
    whyNotOthers:
      'B2 no jugó en el centro porque lo da por perdido, ni en la derecha porque ya lideran cómodamente allí.',
    tacticalInsight:
      '¡Atención! La carta sombra de B2 es un enigma. Podría ser una carta alta o un farol. ¿Cómo responderemos en nuestro próximo turno? ¡Con contundencia!',
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
    title: 'Tu Turno 4: ¡Golpe Maestro en el Frente Decisivo!',
    actionPrompt: 'Selecciona tu As de Diamantes (A♦) y despliégalo en el Frente Izquierdo.',
    whyThisCard:
      '¡Momento crucial de la partida! Analicemos el panorama global: el Centro está ganado con creces por vuestro combo de triunfo. La Derecha está en manos del rival. Por tanto: ¡LA PARTIDA SE DECIDE EN EL FRENTE IZQUIERDO! El rival B2 ha puesto una carta sombra. Al jugar tu As de Diamantes (14 puntos base, la carta más alta de la baraja), sumas una ventaja arrolladora en la izquierda y activas la Sinergia de Diamantes con la J♦ de tu aliado A2 (+5 pts adicionales). ¡Este movimiento sentencia la ronda!',
    whyNotOthers: [
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
    botName: 'Rival B1',
    botTeam: 'teamB',
    card: { id: 'card-2c', suit: 'clubs', rank: '2', base: 2 },
    frontKey: 'right',
    asShadow: false,
    title: 'Turno de Rival B1: Descarte Táctico',
    actionSummary: 'Rival B1 juega el Dos de Tréboles (2♣, 2 pts) en el Frente Derecho.',
    whyPlayed:
      'Al ver caer tu As en la izquierda, B1 sabe que competir en la izquierda o centro es misión imposible. Realiza un "Descarte Táctico": deposita su carta más baja (2♣) en la derecha donde su equipo ya va ganando, sumando esos 2 puntos para su acumulado global sin estorbar.',
    whyNotOthers:
      'No tiene cartas con valor suficiente para desafiar vuestro As de Diamantes en la izquierda.',
    tacticalInsight:
      'Lección táctica: Cuando un frente está perdido, colocar cartas bajas en frentes seguros para sumar puntos al acumulado es una técnica profesional de WarFronts.',
  },

  // PASO 17: TURNO 15 - ALIADO A2
  {
    stepId: 17,
    type: 'bot_turn',
    turnIndex: 15,
    botId: 'A2',
    botName: 'Aliado A2',
    botTeam: 'teamA',
    card: { id: 'card-6s', suit: 'spades', rank: '6', base: 6 },
    frontKey: 'right',
    asShadow: false,
    title: 'Turno de Aliado A2: Cosecha de Puntos Acumulados',
    actionSummary: 'Aliado A2 juega el Seis de Picas (6♠, 6 pts) en el Frente Derecho.',
    whyPlayed:
      'A2 no necesita sobrecargar la izquierda (ya dominada por vuestro As y Jota) y prefiere sumar 6 puntos en la derecha, aprovechando para sumar sinergia con tu 10♠ anterior.',
    whyNotOthers:
      'Se reserva su 3♦ para el remate final en la izquierda.',
    tacticalInsight:
      'Tu equipo está jugando como un auténtico escuadrón coordinado.',
  },

  // PASO 18: TURNO 16 - RIVAL B2
  {
    stepId: 18,
    type: 'bot_turn',
    turnIndex: 16,
    botId: 'B2',
    botName: 'Rival B2',
    botTeam: 'teamB',
    card: { id: 'card-4d', suit: 'diamonds', rank: '4', base: 4 },
    frontKey: 'left',
    asShadow: false,
    title: 'Turno de Rival B2: Intento a la Desesperada',
    actionSummary: 'Rival B2 juega el Cuatro de Diamantes (4♦, 4 pts) en el Frente Izquierdo.',
    whyPlayed:
      'B2 intenta desesperadamente recortar distancias en la izquierda con su 4♦, sumando sinergia con el 5♦ de B1. Pero vuestro As y Jota mantienen una ventaja inalcanzable.',
    whyNotOthers:
      'Solo le queda una carta de triunfo baja en mano.',
    tacticalInsight:
      '¡Llegamos al último turno de la ronda! Tienes una sola carta en mano.',
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
    title: 'Tu Turno Final: Cierre de Despliegue',
    actionPrompt: 'Despliega tu última carta, el Cuatro de Tréboles (4♣), en el Frente Derecho.',
    whyThisCard:
      'Te queda únicamente el 4♣. El Centro y la Izquierda ya están matemáticamente ganados por vuestro equipo (¡2 de 3 frentes asegurados!). Desplegar el 4♣ en el Frente Derecho es tu jugada de cierre perfecta: sumas 4 puntos directamente al marcador de Puntos Acumulados de tu equipo. ¡Los puntos acumulados deciden quién gana el juego en caso de empate!',
    whyNotOthers: [
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
    botName: 'Rival B1 / Aliado A2 / Rival B2',
    botTeam: 'teamB',
    card: { id: 'card-9s', suit: 'spades', rank: '9', base: 9 },
    frontKey: 'right',
    asShadow: false,
    title: 'Fin del Despliegue: Todos los Jugadores Agotan Tropas',
    actionSummary:
      'B1 coloca su 9♠ en la derecha, Aliado A2 coloca su 3♦ en la izquierda, y Rival B2 coloca su 5♥ en el centro.',
    whyPlayed:
      'Todos los jugadores han colocado sus 5 cartas reglamentarias en el campo de batalla. Ha llegado la hora de resolver la ronda.',
    whyNotOthers: 'No quedan más cartas por jugar en esta ronda.',
    tacticalInsight:
      'Ahora pasamos a la Fase de Resolución: ¡Se revelarán todas las cartas sombra y se calcularán los puntos finales de cada frente!',
  },

  // PASO 21: FASE DE RESOLUCIÓN Y REVELACIÓN DE SOMBRAS
  {
    stepId: 21,
    type: 'resolution',
    title: 'Fase de Resolución: Revelación y Puntuación Oficial',
    subtitle: 'El momento de la verdad en los 3 Frentes',
  },

  // PASO 22: GRADUACIÓN Y FIN DEL TUTORIAL
  {
    stepId: 22,
    type: 'conclusion',
    title: '¡ENHORABUENA, COMANDANTE GRADUADO!',
    subtitle: 'Has dominado todos los fundamentos de Frentes de Guerra',
  },
];
