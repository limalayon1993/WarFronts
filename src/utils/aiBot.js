import { calculateFrontScore } from '../constants/rules.js';

/**
 * Inteligencia Artificial Táctica Avanzada para Bots (soporta 1v1, 2v2, 3v3, 4v4).
 * 
 * Principios estratégicos y mejoras fundamentales:
 * 1. Regla Macro 2-de-3: El objetivo de la ronda es ganar al menos 2 frentes. La IA evalúa
 *    el campo completo y no desperdicia cartas en frentes ya ganados o perdidos.
 * 2. Prevención de Overkill y Ofuscación: Si el rival no está compitiendo en un frente (0 tropas)
 *    o ya se tiene una ventaja segura (>=15 pts), la IA NO sigue acumulando cartas allí.
 *    Reserva sus cartas para frentes disputados.
 * 3. Niebla de Guerra Absoluta (Anti-Trampas para Carta Sombra Rival):
 *    La IA NUNCA inspecciona el palo, valor o rango de las cartas sombras no reveladas del rival.
 *    Se censuran completamente (rank: '?', suit: null, base: 0).
 *    En lugar de ignorarlas (lo que crearía la falsa ilusión de que el frente está vacío),
 *    la IA estima de forma realista una amenaza ponderada (~11 pts) por cada sombra rival.
 * 4. Preservación de Cartas de Alto Impacto: Ases (14), Reyes (13) y Reinas (12) se reservan
 *    para decantar frentes disputados o lograr remontadas, nunca para frentes sin rival.
 * 5. Corte de Pérdidas (Cut Losses): Si un frente está matemáticamente perdido o con desventaja
 *    irrecuperable, la IA no tira cartas de alto calibre allí; se enfoca en ganar los otros 2 frentes.
 * 6. Marcador de Sombra Táctico: Utiliza la carta sombra estratégicamente en cartas altas en
 *    frentes disputados para ocultar la fuerza real e impedir que el rival calcule su respuesta.
 */
export function chooseBotMove({
  botHand,
  botTeam, // 'teamA' o 'teamB'
  fronts, // { left: { teamA: [], teamB: [] }, center: ..., right: ... }
  botShadowsLeft = 0,
  maxFrontCards = 8,
  botPlayerId = null,
  allPlayers = [],
}) {
  if (!botHand || botHand.length === 0) return null;

  const enemyTeam = botTeam === 'teamA' ? 'teamB' : 'teamA';
  const frontKeys = Object.keys(fronts);

  // 1. HIGIENIZACIÓN TOTAL DE INFORMACIÓN (FOG-OF-WAR ESTRICTO)
  // Las cartas sombra rivales no reveladas quedan completamente censuradas.
  // Es imposible que la IA haga trampas o lea suit/base/rank.
  const sanitizedFronts = {};
  frontKeys.forEach(fKey => {
    const rawEnemyCards = fronts[fKey]?.[enemyTeam] || [];
    const rawMyCards = fronts[fKey]?.[botTeam] || [];

    sanitizedFronts[fKey] = {
      [enemyTeam]: rawEnemyCards.map(c => {
        if (c.isShadow && !c.isRevealed) {
          return {
            id: c.id,
            isShadow: true,
            isRevealed: false,
            // Censura absoluta
            rank: '?',
            suit: null,
            base: 0,
            playedById: c.playedById,
            team: enemyTeam,
          };
        }
        return { ...c };
      }),
      [botTeam]: rawMyCards.map(c => {
        // Si es una sombra del compañero de equipo y no está revelada, el bot tampoco la ve
        if (c.isShadow && !c.isRevealed && botPlayerId && c.playedById !== botPlayerId) {
          return {
            id: c.id,
            isShadow: true,
            isRevealed: false,
            rank: '?',
            suit: null,
            base: 0,
            playedById: c.playedById,
            team: botTeam,
          };
        }
        return { ...c };
      }),
    };
  });

  // 2. FILTRAR FRENTES CON CAPACIDAD DISPONIBLE
  const availableFronts = frontKeys.filter(fKey => {
    const totalCards = sanitizedFronts[fKey][botTeam].length + sanitizedFronts[fKey][enemyTeam].length;
    return totalCards < maxFrontCards;
  });

  if (availableFronts.length === 0) return null;

  // 3. ANÁLISIS GLOBAL DEL ESTADO DE LA BATALLA
  const frontAnalysis = {};

  frontKeys.forEach(fKey => {
    const myCards = sanitizedFronts[fKey][botTeam];
    const enemyCards = sanitizedFronts[fKey][enemyTeam];

    // Puntuación de nuestro equipo (cartas activas)
    const myScoreObj = calculateFrontScore(myCards, true);
    const myScore = myScoreObj.total;

    // Puntuación visible del enemigo (excluye cartas sombra)
    const enemyVisibleObj = calculateFrontScore(enemyCards, false);
    const enemyVisibleScore = enemyVisibleObj.total;

    // Detección de cartas sombra rivales sin filtrar su contenido
    const enemyShadowCount = enemyCards.filter(c => c.isShadow && !c.isRevealed).length;
    
    // Estimación táctica de amenaza: una sombra rival suele ser una carta alta o combo clave.
    // Asignamos ~11 puntos de expectativa por cada sombra oculta, sin saber qué carta es.
    const enemyEstimatedShadowScore = enemyShadowCount * 11;
    const enemyEstimatedTotal = enemyVisibleScore + enemyEstimatedShadowScore;

    const totalCards = myCards.length + enemyCards.length;
    const remainingSlots = maxFrontCards - totalCards;
    const diff = myScore - enemyEstimatedTotal; // positivo: vamos ganando

    const isMineUncontested = myCards.length > 0 && enemyCards.length === 0;
    const isEnemyUncontested = myCards.length === 0 && enemyCards.length > 0;
    const isEmpty = myCards.length === 0 && enemyCards.length === 0;

    // Frente ya asegurado:
    // - Si el rival no ha puesto nada y ya tenemos >= 15 pts, o
    // - Si la ventaja es abrumadora (>= 22 pts), o
    // - Si la ventaja es de >= 14 pts y quedan apenas 2 huecos en el frente.
    const isSecured = 
      (isMineUncontested && myScore >= 15) ||
      (enemyCards.length > 0 && diff >= 22) ||
      (enemyCards.length > 0 && diff >= 14 && remainingSlots <= 2);

    // Frente prácticamente perdido:
    // Desventaja profunda (<= -22 pts) y quedan muy pocos huecos (<= 2), o desventaja > -34 pts
    const isLost = 
      (diff <= -22 && remainingSlots <= 2) ||
      (diff <= -34);

    // Frente en disputa activa
    const isContested = !isSecured && !isLost && !isEmpty && !isMineUncontested;

    frontAnalysis[fKey] = {
      myCards,
      enemyCards,
      myScore,
      myScoreObj,
      enemyVisibleScore,
      enemyShadowCount,
      enemyEstimatedTotal,
      diff,
      totalCards,
      remainingSlots,
      isMineUncontested,
      isEnemyUncontested,
      isEmpty,
      isSecured,
      isLost,
      isContested,
      mySuits: myCards.filter(c => c.suit).map(c => c.suit),
      myRanks: myCards.filter(c => c.base > 0).map(c => c.base),
    };
  });

  // Conteo macro de frentes
  const securedFrontsCount = frontKeys.filter(k => frontAnalysis[k].isSecured).length;
  const lostFrontsCount = frontKeys.filter(k => frontAnalysis[k].isLost).length;

  let bestMove = null;
  let highestRating = -99999;

  // 4. EVALUACIÓN EXHAUSTIVA DE CADA CARTA EN CADA FRENTE
  botHand.forEach(card => {
    const isHighCard = card.base >= 12; // As (14), Rey (13), Reina (12)
    const isMidCard = card.base >= 8 && card.base <= 11; // 8, 9, 10, J
    const isLowCard = card.base <= 7; // 2..7

    availableFronts.forEach(frontKey => {
      const fa = frontAnalysis[frontKey];
      const myCards = fa.myCards;

      // Calcular puntos brutos que aportaría la carta
      const hypoCards = [...myCards, card];
      const newScoreObj = calculateFrontScore(hypoCards, true);
      const pointsGained = newScoreObj.total - fa.myScore;

      // Base: puntos aportados
      let rating = pointsGained * 1.2;

      // =========================================================================
      // REGLA 1: ANTI-OVERKILL Y COMBATE A LA OFUSCACIÓN
      // (Previene amontonar cartas en frentes donde el rival no compite o ya se gana)
      // =========================================================================
      if (fa.isMineUncontested) {
        // El rival no ha puesto NINGUNA tropa en este frente (0 cartas)
        if (fa.myScore >= 24) {
          // Ya tenemos 24+ puntos frente a la nada. Castigo masivo para frenar el amontonamiento.
          rating -= 60;
        } else if (fa.myScore >= 15) {
          // Ventaja cómoda (15-23 pts) sin resistencia enemiga:
          // Muy mala idea gastar una carta alta, y desaconsejado jugar cualquier otra
          rating -= isHighCard ? 45 : 30;
        } else if (fa.myScore >= 8) {
          // Ya tenemos 1 carta sólida (8-14 pts). Si aún no hay rival, NO gastar As ni Rey.
          if (isHighCard) rating -= 25;
        }
      } else if (fa.isSecured) {
        // Hay tropas rivales, pero la ventaja es decisiva
        if (fa.diff >= 28) {
          rating -= 50; // Overkill total
        } else {
          rating -= isHighCard ? 35 : 20;
        }
      }

      // =========================================================================
      // REGLA 2: CORTE DE PÉRDIDAS EN FRENTES PERDIDOS (CUT LOSSES)
      // =========================================================================
      if (fa.isLost) {
        if (isHighCard) {
          // Jamás gastar As, Rey o Reina en un frente perdido
          rating -= 60;
        } else if (isMidCard) {
          rating -= 30;
        } else {
          // Descarte táctico de carta baja inservible (sólo si no sirve en otro frente)
          rating -= 12;
        }
      }

      // =========================================================================
      // REGLA 3: MÁXIMA PRIORIDAD A FRENTES EN DISPUTA ACTIVA (CLUTCH ZONE)
      // =========================================================================
      if (fa.isContested) {
        rating += 14;

        const newEstimatedDiff = newScoreObj.total - fa.enemyEstimatedTotal;
        if (fa.diff <= 0 && newEstimatedDiff > 0) {
          // ¡Remontada! Cambia el frente de derrota/empate a victoria
          rating += 26;
        } else if (fa.diff > 0 && fa.diff <= 8 && newEstimatedDiff >= 12) {
          // Convierte una ventaja frágil en una ventaja sólida
          rating += 18;
        } else if (fa.diff < 0 && newEstimatedDiff > fa.diff) {
          // Recorta desventaja de forma importante
          rating += 10;
        }

        // En frentes disputados, las cartas de poder son decisivas
        if (isHighCard) {
          rating += 16;
        }
      }

      // =========================================================================
      // REGLA 4: APERTURA Y DESPLIEGUE EN FRENTES VACÍOS
      // =========================================================================
      if (fa.isEmpty) {
        if (securedFrontsCount >= 1) {
          // Si ya aseguramos 1 frente, abrir el 2º frente es crucial para ganar la ronda (2-de-3)
          rating += 18;
          if (isMidCard) rating += 8; // Cartas de 8-10 son ideales para abrir
          if (isHighCard) rating += 4;
        } else {
          if (isMidCard) rating += 10;
          if (isLowCard) rating += 4;
        }
      }

      // =========================================================================
      // REGLA 5: SINERGIAS Y COMBOS CON SENTIDO ESTRATÉGICO
      // =========================================================================
      // Solo premiar sinergias si el frente no está ya sobrecargado o asegurado
      const shouldRewardSynergies = !fa.isSecured && !(fa.isMineUncontested && fa.myScore >= 16);

      if (shouldRewardSynergies) {
        // Trío (+20 oficial)
        if (newScoreObj.trioTotal > fa.myScoreObj.trioTotal) {
          rating += 16;
        }
        // Escalera (+15 oficial)
        else if (newScoreObj.straightTotal > fa.myScoreObj.straightTotal) {
          rating += 14;
        }
        // Pareja (+10 oficial)
        else if (newScoreObj.pairTotal > fa.myScoreObj.pairTotal) {
          rating += 10;
        }

        // Sinergia de palo (+5 pts)
        if (fa.mySuits.includes(card.suit)) {
          rating += 6;
        }
      }

      // =========================================================================
      // REGLA 6: ALINEACIÓN MACRO 2-DE-3
      // =========================================================================
      if (securedFrontsCount >= 1 && !fa.isSecured) {
        // Con 1 frente ganado, concentrar recursos en asegurar el segundo
        rating += 14;
      }
      if (lostFrontsCount >= 1 && !fa.isLost) {
        // Con 1 frente perdido, los restantes son vitales
        rating += 18;
      }

      // =========================================================================
      // REGLA 7: FACTOR DE DINAMISMO (Variación controlada de +/- 1.2 pts)
      // =========================================================================
      rating += (Math.random() * 2.4 - 1.2);

      if (rating > highestRating) {
        highestRating = rating;
        bestMove = {
          card,
          frontKey,
          asShadow: false,
        };
      }
    });
  });

  // 5. DECISIÓN TÁCTICA DEL MARCADOR DE SOMBRA
  // Solo se usa de forma inteligente para engañar al rival o proteger jugadas clave
  if (bestMove && botShadowsLeft > 0) {
    const targetAnalysis = frontAnalysis[bestMove.frontKey];
    const isHighCard = bestMove.card.base >= 11; // J, Q, K, As

    // NUNCA gastar sombra en frentes asegurados, ni en frentes perdidos, ni en frentes vacíos sin rival
    const isWorthyFront = !targetAnalysis.isSecured && !targetAnalysis.isLost && !targetAnalysis.isMineUncontested;

    if (isWorthyFront) {
      if (isHighCard && targetAnalysis.isContested) {
        // Carta de alto impacto en frente disputado: esconder su puntuación para tender una trampa
        bestMove.asShadow = Math.random() < 0.85;
      } else if (botHand.length <= 2 && targetAnalysis.isContested) {
        // Jugada de cierre de ronda en frente apretado
        bestMove.asShadow = Math.random() < 0.70;
      } else if (isHighCard && targetAnalysis.isEmpty && Math.random() < 0.40) {
        // Apertura misteriosa para forzar al rival a dudar
        bestMove.asShadow = true;
      }
    }
  }

  return bestMove;
}
