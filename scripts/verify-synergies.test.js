/**
 * @file scripts/verify-synergies.test.js
 * Test unitario matemático para certificar las reglas de sinergia y puntuación de WarFronts (Fase 4).
 *
 * Valida:
 *   a) Valores base tácticos: Carta 2-6 = 1 pt, 7-10 = 2 pts, J-Q-K = 3 pts, As = 4 pts.
 *   b) Sinergia de palo: 1 carta de corazones = 0 bono; 2 cartas = +1; 3 cartas = +2; 4 cartas = +3.
 *   c) Pareja: 2 cartas de valor 8 = +2 pts.
 *   d) Exclusión mutua Trío vs Pareja: 3 cartas de valor 8 deben sumar +5 pts de Trío y EXACTAMENTE 0 pts de Pareja (el total no puede ser 7).
 *   e) 5 cartas de valor 8 (modo 2 barajas): 1 trío (+5) y 1 pareja (+2) = +7 pts.
 *   f) Escalera corta: 5-6-7 = +4 pts; J-Q-K = +4 pts; As-2-3 = +4 pts.
 *   g) Escalera de color: Base (1+1+1 = 3) + Escalera (+4) + Palo (+2 por 2 adicionales) = 9 pts totales.
 *   h) Desempate nominal: Frente empatado a 8 puntos entre Equipo A (carta más alta K) y Equipo B (carta más alta As) -> resolveFrontWinner declara ganador a Equipo B.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getCardTacticalBase,
  calculateFrontScore,
  findShortStraights,
  resolveFrontWinner,
  analyzeCardSynergies,
  CARD_VALUES,
} from '../src/constants/rules.js';

describe('WarFronts - Certificación Matemática de Reglas y Sinergias (Fase 4)', () => {

  // =========================================================================
  // a) Valores base tácticos
  // =========================================================================
  describe('a) Valores base tácticos (Escala Táctica Unificada)', () => {
    test('Cartas 2 a 6 deben valer exactamente 1 punto base', () => {
      const lowRanks = [2, 3, 4, 5, 6];
      lowRanks.forEach(val => {
        assert.equal(
          getCardTacticalBase(val),
          1,
          `La carta con valor numérico ${val} debe otorgar 1 pt táctico`
        );
        assert.equal(
          getCardTacticalBase({ rank: String(val), base: val }),
          1,
          `El objeto carta { rank: '${val}', base: ${val} } debe otorgar 1 pt táctico`
        );
      });
    });

    test('Cartas 7 a 10 deben valer exactamente 2 puntos base', () => {
      const midRanks = [7, 8, 9, 10];
      midRanks.forEach(val => {
        assert.equal(
          getCardTacticalBase(val),
          2,
          `La carta con valor numérico ${val} debe otorgar 2 pts tácticos`
        );
        assert.equal(
          getCardTacticalBase({ rank: String(val), base: val }),
          2,
          `El objeto carta { rank: '${val}', base: ${val} } debe otorgar 2 pts tácticos`
        );
      });
    });

    test('Figuras J, Q, K (valores nominales 11, 12, 13) deben valer exactamente 3 puntos base', () => {
      const figures = [
        { rank: 'J', base: 11 },
        { rank: 'Q', base: 12 },
        { rank: 'K', base: 13 },
      ];
      figures.forEach(({ rank, base }) => {
        assert.equal(
          getCardTacticalBase(base),
          3,
          `La figura ${rank} (base ${base}) debe otorgar 3 pts tácticos`
        );
        assert.equal(
          getCardTacticalBase({ rank, base }),
          3,
          `El objeto carta { rank: '${rank}', base: ${base} } debe otorgar 3 pts tácticos`
        );
      });
    });

    test('As (A, valor nominal 14) debe valer exactamente 4 puntos base', () => {
      assert.equal(
        getCardTacticalBase(14),
        4,
        'El As numérico (base 14) debe otorgar 4 pts tácticos'
      );
      assert.equal(
        getCardTacticalBase({ rank: 'A', base: 14 }),
        4,
        'El objeto carta As { rank: "A", base: 14 } debe otorgar 4 pts tácticos'
      );
    });

    test('Todas las definiciones de CARD_VALUES deben mapearse correctamente a su valor base táctico', () => {
      CARD_VALUES.forEach(({ rank, base }) => {
        const tactical = getCardTacticalBase({ rank, base });
        if (base >= 2 && base <= 6) {
          assert.equal(tactical, 1, `Rank ${rank} (base ${base}) debe ser 1`);
        } else if (base >= 7 && base <= 10) {
          assert.equal(tactical, 2, `Rank ${rank} (base ${base}) debe ser 2`);
        } else if (base >= 11 && base <= 13) {
          assert.equal(tactical, 3, `Rank ${rank} (base ${base}) debe ser 3`);
        } else if (base === 14) {
          assert.equal(tactical, 4, `Rank ${rank} (base ${base}) debe ser 4`);
        }
      });
    });
  });

  // =========================================================================
  // b) Sinergia de palo
  // =========================================================================
  describe('b) Sinergia de palo (Color)', () => {
    test('1 carta de corazones = 0 bono; 2 cartas = +1; 3 cartas = +2; 4 cartas = +3', () => {
      // Cartas sin parejas ni escaleras para aislar exclusivamente la sinergia de palo
      const heartCards = [
        { id: 'h1', suit: 'hearts', rank: '2', base: 2 },
        { id: 'h2', suit: 'hearts', rank: '4', base: 4 },
        { id: 'h3', suit: 'hearts', rank: '7', base: 7 },
        { id: 'h4', suit: 'hearts', rank: '9', base: 9 },
      ];

      // 1 carta de corazones -> 0 bono
      const score1 = calculateFrontScore([heartCards[0]]);
      assert.equal(score1.suitSynergyTotal, 0, '1 carta de corazones debe otorgar 0 bono de palo');
      assert.equal(score1.synergiesBySuit.hearts, undefined, 'No debe registrar bono en synergiesBySuit');

      // 2 cartas de corazones -> +1 bono
      const score2 = calculateFrontScore([heartCards[0], heartCards[1]]);
      assert.equal(score2.suitSynergyTotal, 1, '2 cartas de corazones deben otorgar +1 bono de palo');
      assert.equal(score2.synergiesBySuit.hearts?.bonus, 1);
      assert.equal(score2.synergiesBySuit.hearts?.count, 2);

      // 3 cartas de corazones -> +2 bono
      const score3 = calculateFrontScore([heartCards[0], heartCards[1], heartCards[2]]);
      assert.equal(score3.suitSynergyTotal, 2, '3 cartas de corazones deben otorgar +2 bono de palo');
      assert.equal(score3.synergiesBySuit.hearts?.bonus, 2);
      assert.equal(score3.synergiesBySuit.hearts?.count, 3);

      // 4 cartas de corazones -> +3 bono
      const score4 = calculateFrontScore(heartCards);
      assert.equal(score4.suitSynergyTotal, 3, '4 cartas de corazones deben otorgar +3 bono de palo');
      assert.equal(score4.synergiesBySuit.hearts?.bonus, 3);
      assert.equal(score4.synergiesBySuit.hearts?.count, 4);
    });
  });

  // =========================================================================
  // c) Pareja
  // =========================================================================
  describe('c) Pareja', () => {
    test('2 cartas de valor 8 deben sumar exactamente +2 pts de Pareja', () => {
      const pairCards = [
        { id: 'c1', suit: 'hearts', rank: '8', base: 8 },
        { id: 'c2', suit: 'spades', rank: '8', base: 8 },
      ];

      const score = calculateFrontScore(pairCards);

      assert.equal(score.pairTotal, 2, 'El bono de Pareja debe ser exactamente +2 pts');
      assert.equal(score.pairs.length, 1, 'Debe identificarse exactamente 1 pareja');
      assert.equal(score.pairs[0].rank, '8', 'La pareja debe ser de rango 8');
      assert.equal(score.pairs[0].bonus, 2, 'El objeto de la pareja debe contener bonus: 2');
      assert.equal(score.trioTotal, 0, 'El bono de Trío debe ser 0');
      assert.equal(score.suitSynergyTotal, 0, 'No debe haber bono de palo con palos distintos');
      assert.equal(score.synergyTotal, 2, 'El total de sinergias debe ser exactamente 2');
      assert.equal(score.baseTotal, 4, 'La base táctica (2 + 2) debe ser 4');
      assert.equal(score.total, 6, 'El total (base 4 + pareja 2) debe ser 6');
    });
  });

  // =========================================================================
  // d) Exclusión mutua Trío vs Pareja
  // =========================================================================
  describe('d) Exclusión mutua Trío vs Pareja', () => {
    test('3 cartas de valor 8 deben sumar +5 pts de Trío y EXACTAMENTE 0 pts de Pareja (no 7)', () => {
      const trioCards = [
        { id: 'c1', suit: 'hearts', rank: '8', base: 8 },
        { id: 'c2', suit: 'spades', rank: '8', base: 8 },
        { id: 'c3', suit: 'diamonds', rank: '8', base: 8 },
      ];

      const score = calculateFrontScore(trioCards);

      assert.equal(score.trioTotal, 5, 'El bono de Trío debe ser exactamente +5 pts');
      assert.equal(score.trios.length, 1, 'Debe registrarse exactamente 1 trío');
      assert.equal(score.pairTotal, 0, 'El bono de Pareja debe ser EXACTAMENTE 0 pts (anulado por el trío)');
      assert.equal(score.pairs.length, 0, 'No debe haber parejas activas registradas');

      // Verificación explícita de exclusión mutua: el total no puede ser 7
      assert.notEqual(
        score.trioTotal + score.pairTotal,
        7,
        'Regla de exclusión violada: 3 cartas iguales NUNCA deben sumar 7 pts (5 de trío + 2 de pareja)'
      );
      assert.equal(
        score.trioTotal + score.pairTotal,
        5,
        'La combinación de trío y pareja con 3 cartas debe ser estrictamente 5 pts'
      );
      assert.equal(score.synergyTotal, 5, 'El total de sinergias debe ser 5');
    });
  });

  // =========================================================================
  // e) 5 cartas de valor 8 (modo 2 barajas)
  // =========================================================================
  describe('e) 5 cartas de valor 8 (modo 2 barajas)', () => {
    test('5 cartas de valor 8 deben formar 1 trío (+5) y 1 pareja (+2) = +7 pts', () => {
      const fiveCards = [
        { id: 'c1', suit: 'hearts', rank: '8', base: 8 },
        { id: 'c2', suit: 'spades', rank: '8', base: 8 },
        { id: 'c3', suit: 'diamonds', rank: '8', base: 8 },
        { id: 'c4', suit: 'clubs', rank: '8', base: 8 },
        { id: 'c5', suit: 'hearts', rank: '8', base: 8 },
      ];

      const score = calculateFrontScore(fiveCards);

      assert.equal(score.trioTotal, 5, 'Debe registrar 1 trío (+5 pts)');
      assert.equal(score.pairTotal, 2, 'Debe registrar 1 pareja con las 2 cartas restantes (+2 pts)');
      assert.equal(score.trios.length, 1, 'Debe contener exactamente 1 trío');
      assert.equal(score.pairs.length, 1, 'Debe contener exactamente 1 pareja');
      assert.equal(
        score.trioTotal + score.pairTotal,
        7,
        'La suma de trío (+5) y pareja (+2) debe ser exactamente +7 pts'
      );

      // Verificación complementaria con el analizador detallado de sinergias
      const analysis = analyzeCardSynergies(fiveCards, true);
      const cardsInTrio = Object.values(analysis.cardSynergies).filter(c => c.inTrio);
      const cardsInPair = Object.values(analysis.cardSynergies).filter(c => c.inPair);

      assert.equal(cardsInTrio.length, 3, 'Exactamente 3 cartas deben estar etiquetadas inTrio');
      assert.equal(cardsInPair.length, 2, 'Exactamente 2 cartas deben estar etiquetadas inPair');
    });
  });

  // =========================================================================
  // f) Escalera corta
  // =========================================================================
  describe('f) Escalera corta (+4 pts)', () => {
    test('5-6-7 = +4 pts', () => {
      const cards = [
        { id: 'c1', suit: 'hearts', rank: '5', base: 5 },
        { id: 'c2', suit: 'spades', rank: '6', base: 6 },
        { id: 'c3', suit: 'diamonds', rank: '7', base: 7 },
      ];

      const triplets = findShortStraights([5, 6, 7]);
      assert.deepEqual(triplets, [[5, 6, 7]], 'findShortStraights debe detectar [5, 6, 7]');

      const score = calculateFrontScore(cards);
      assert.equal(score.straightTotal, 4, 'Escalera 5-6-7 debe sumar +4 pts');
      assert.equal(score.straights.length, 1);
      assert.equal(score.straights[0].label, '5-6-7');
      assert.equal(score.straights[0].bonus, 4);
    });

    test('J-Q-K (11-12-13) = +4 pts', () => {
      const cards = [
        { id: 'c1', suit: 'hearts', rank: 'J', base: 11 },
        { id: 'c2', suit: 'spades', rank: 'Q', base: 12 },
        { id: 'c3', suit: 'diamonds', rank: 'K', base: 13 },
      ];

      const triplets = findShortStraights([11, 12, 13]);
      assert.deepEqual(triplets, [[11, 12, 13]], 'findShortStraights debe detectar [11, 12, 13]');

      const score = calculateFrontScore(cards);
      assert.equal(score.straightTotal, 4, 'Escalera J-Q-K debe sumar +4 pts');
      assert.equal(score.straights.length, 1);
      assert.equal(score.straights[0].label, 'J-Q-K');
      assert.equal(score.straights[0].bonus, 4);
    });

    test('As-2-3 (14-2-3) = +4 pts (Escalera baja con As)', () => {
      const cards = [
        { id: 'c1', suit: 'hearts', rank: 'A', base: 14 },
        { id: 'c2', suit: 'spades', rank: '2', base: 2 },
        { id: 'c3', suit: 'diamonds', rank: '3', base: 3 },
      ];

      const triplets = findShortStraights([14, 2, 3]);
      assert.deepEqual(triplets, [[14, 2, 3]], 'findShortStraights debe detectar la plantilla [14, 2, 3]');

      const score = calculateFrontScore(cards);
      assert.equal(score.straightTotal, 4, 'Escalera As-2-3 debe sumar +4 pts');
      assert.equal(score.straights.length, 1);
      assert.equal(score.straights[0].label, 'A-2-3');
      assert.equal(score.straights[0].bonus, 4);
    });
  });

  // =========================================================================
  // g) Escalera de color
  // =========================================================================
  describe('g) Escalera de color', () => {
    test('Escalera de color baja (4♥, 5♥, 6♥): Base (1+1+1 = 3) + Escalera (+4) + Palo (+2) = 9 pts totales', () => {
      // Tres cartas consecutivas en el rango 2-6 (cada una vale 1 pt táctico):
      // 4♥ (1 pt) + 5♥ (1 pt) + 6♥ (1 pt) -> BaseTotal = 3
      // Escalera corta: +4 pts
      // Palo (3 corazones = 2 cartas adicionales): +2 pts
      // Total = 3 + 4 + 2 = 9 pts
      const straightFlushLow = [
        { id: 'sf1', suit: 'hearts', rank: '4', base: 4 },
        { id: 'sf2', suit: 'hearts', rank: '5', base: 5 },
        { id: 'sf3', suit: 'hearts', rank: '6', base: 6 },
      ];

      const score = calculateFrontScore(straightFlushLow);

      assert.equal(score.baseTotal, 3, 'Base: 4♥(1) + 5♥(1) + 6♥(1) debe ser exactamente 3 pts');
      assert.equal(score.straightTotal, 4, 'Escalera: debe sumar +4 pts');
      assert.equal(score.suitSynergyTotal, 2, 'Palo: 3 corazones deben sumar +2 pts');
      assert.equal(score.synergyTotal, 6, 'Total sinergias (4 + 2) debe ser 6 pts');
      assert.equal(
        score.total,
        9,
        'Base (3) + Escalera (4) + Palo (2) debe sumar exactamente 9 pts totales'
      );
    });

    test('Escalera de color (5♥, 6♥, 7♥): Base (1+1+2 = 4) + Escalera (+4) + Palo (+2) = 10 pts totales', () => {
      // 5♥ (1 pt, rango 2-6) + 6♥ (1 pt, rango 2-6) + 7♥ (2 pts, rango 7-10 según req a) -> BaseTotal = 4
      // Escalera: +4 pts | Palo: +2 pts -> Total = 4 + 4 + 2 = 10 pts
      const straightFlush567 = [
        { id: 'sf1', suit: 'hearts', rank: '5', base: 5 },
        { id: 'sf2', suit: 'hearts', rank: '6', base: 6 },
        { id: 'sf3', suit: 'hearts', rank: '7', base: 7 },
      ];

      const score = calculateFrontScore(straightFlush567);

      assert.equal(score.baseTotal, 4, 'Base: 5♥(1) + 6♥(1) + 7♥(2) debe ser 4 pts según regla táctica (a)');
      assert.equal(score.straightTotal, 4, 'Escalera: debe sumar +4 pts');
      assert.equal(score.suitSynergyTotal, 2, 'Palo: 3 corazones deben sumar +2 pts');
      assert.equal(
        score.total,
        10,
        'Base (4) + Escalera (4) + Palo (2) debe sumar 10 pts totales para 5♥, 6♥, 7♥'
      );
    });
  });

  // =========================================================================
  // h) Desempate nominal
  // =========================================================================
  describe('h) Desempate nominal', () => {
    test('Frente empatado a 8 puntos entre Equipo A (máxima K) y Equipo B (máxima As) -> declara ganador al Equipo B', () => {
      // Equipo A: K♠ (3 pts), Q♦ (3 pts), 7♣ (2 pts)
      // Palos distintos, rangos distintos sin escaleras -> Base = 3 + 3 + 2 = 8 pts, Sinergias = 0, Total = 8 pts
      // Carta más alta: K (base 13)
      const teamACards = [
        { id: 'a1', suit: 'spades', rank: 'K', base: 13 },
        { id: 'a2', suit: 'diamonds', rank: 'Q', base: 12 },
        { id: 'a3', suit: 'clubs', rank: '7', base: 7 },
      ];

      // Equipo B: A♥ (4 pts), 8♦ (2 pts), 9♠ (2 pts)
      // Palos distintos, rangos distintos sin escaleras -> Base = 4 + 2 + 2 = 8 pts, Sinergias = 0, Total = 8 pts
      // Carta más alta: As (base 14)
      const teamBCards = [
        { id: 'b1', suit: 'hearts', rank: 'A', base: 14 },
        { id: 'b2', suit: 'diamonds', rank: '8', base: 8 },
        { id: 'b3', suit: 'spades', rank: '9', base: 9 },
      ];

      const scoreA = calculateFrontScore(teamACards);
      const scoreB = calculateFrontScore(teamBCards);

      assert.equal(scoreA.total, 8, 'Equipo A debe tener exactamente 8 pts totales');
      assert.equal(scoreB.total, 8, 'Equipo B debe tener exactamente 8 pts totales');
      assert.equal(scoreA.highestBaseCard, 13, 'La carta más alta de Equipo A debe ser K (13)');
      assert.equal(scoreB.highestBaseCard, 14, 'La carta más alta de Equipo B debe ser As (14)');

      // Ejecutar desempate oficial del reglamento
      const outcome = resolveFrontWinner(teamACards, teamBCards);

      assert.equal(outcome.winner, 'teamB', 'resolveFrontWinner debe declarar ganador al Equipo B');
      assert.equal(outcome.wonByTiebreaker, true, 'La victoria debe ser por criterio de desempate');
      assert.equal(outcome.tiebreakerWinnerRank, 'A', 'El rango ganador del desempate debe ser As (A)');
      assert.equal(outcome.tiebreakerLoserRank, 'K', 'El rango perdedor del desempate debe ser Rey (K)');

      // Verificar simetría invirtiendo el orden de los argumentos
      const outcomeInverted = resolveFrontWinner(teamBCards, teamACards);
      assert.equal(outcomeInverted.winner, 'teamA', 'Invertido: el primer argumento (Equipo B) debe ganar como teamA');
      assert.equal(outcomeInverted.wonByTiebreaker, true);
    });
  });

});
