import { calculateFrontScore } from '../constants/rules';

/**
 * Inteligencia Artificial Táctica para Bots (soporta 1v1, 2v2, 3v3, 4v4).
 * Coopera con sus compañeros de equipo para sumar sinergias y disputar frentes clave.
 */
export function chooseBotMove({
  botHand,
  botTeam, // 'teamA' o 'teamB'
  fronts, // { left: { teamA: [], teamB: [] }, center: ..., right: ... }
  botShadowsLeft,
  maxFrontCards = 8,
}) {
  if (!botHand || botHand.length === 0) return null;

  const enemyTeam = botTeam === 'teamA' ? 'teamB' : 'teamA';

  // Filtrar frentes disponibles (menos de maxFrontCards en total)
  const availableFronts = Object.keys(fronts).filter(frontKey => {
    const totalCards = fronts[frontKey].teamA.length + fronts[frontKey].teamB.length;
    return totalCards < maxFrontCards;
  });

  if (availableFronts.length === 0) return null;

  // Analizar la situación de cada frente
  const frontAnalysis = {};
  availableFronts.forEach(frontKey => {
    const myTeamCards = fronts[frontKey][botTeam];
    const enemyTeamCards = fronts[frontKey][enemyTeam];

    const myScore = calculateFrontScore(myTeamCards, true);
    const enemyScore = calculateFrontScore(enemyTeamCards, false);
    const currentDiff = myScore.total - enemyScore.total;
    const remainingSlots = maxFrontCards - (myTeamCards.length + enemyTeamCards.length);

    frontAnalysis[frontKey] = {
      myScore: myScore.total,
      enemyScore: enemyScore.total,
      diff: currentDiff,
      remainingSlots,
      myTeamSuits: myTeamCards.map(c => c.suit),
      myTeamRanks: myTeamCards.map(c => c.base),
    };
  });

  let bestMove = null;
  let highestRating = -9999;

  // Evaluar cada carta en cada frente disponible
  botHand.forEach(card => {
    availableFronts.forEach(frontKey => {
      const analysis = frontAnalysis[frontKey];
      const myTeamCards = fronts[frontKey][botTeam];

      // Puntos que ganaría el equipo colocando esta carta
      const hypoCards = [...myTeamCards, card];
      const newScore = calculateFrontScore(hypoCards, true);
      const currentScore = calculateFrontScore(myTeamCards, true);
      const pointsGained = newScore.total - currentScore.total;

      let rating = pointsGained * 1.5;

      // Sinergia cooperativa de palo (+5 pts)
      if (analysis.myTeamSuits.includes(card.suit)) {
        rating += 8;
      }

      // Sinergia de formación: Pareja (+10), Trío (+20) o Escalera (+15)
      if (newScore.trioTotal > currentScore.trioTotal) {
        rating += 12; // Formar un trío es un hito de +20 pts
      } else if (newScore.straightTotal > currentScore.straightTotal) {
        rating += 10; // Formar una escalera corta es +15 pts
      } else if (newScore.pairTotal > currentScore.pairTotal) {
        rating += 7; // Formar una pareja es +10 pts
      }

      // Situación táctica del frente:
      // Frente reñido (perdiendo por poco o empatado)
      if (analysis.diff <= 0 && analysis.diff >= -10) {
        rating += 8;
      }

      // Si el equipo ya lidera cómodamente (+16 pts), ahorrar cartas altas
      if (analysis.diff > 14) {
        rating -= (card.base > 10 ? 9 : 2);
      }

      // Si el frente está prácticamente perdido y quedan pocos turnos
      if (analysis.diff < -18 && analysis.remainingSlots <= 2) {
        if (card.base >= 11) {
          rating -= 16; // Guardar As/Rey para otros frentes
        } else {
          rating += 6; // Descarte táctico de carta baja
        }
      }

      // Factor de aleatoriedad para dinamismo
      rating += (Math.random() * 3 - 1.5);

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

  // Decisión de usar Marcador de Sombra
  if (bestMove && botShadowsLeft > 0) {
    const isHighCard = bestMove.card.base >= 12; // As (14), Rey (13), Reina (12)
    if (isHighCard && Math.random() < 0.6) {
      bestMove.asShadow = true;
    } else if (botHand.length <= 1 && Math.random() < 0.75) {
      bestMove.asShadow = true;
    }
  }

  return bestMove;
}
