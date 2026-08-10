/**
 * Implementação simplificada do algoritmo SM-2 (Spaced Repetition)
 * Baseado no Anki / SuperMemo-2.
 */

export function calcularRevisao(
  grade: number, // 1 (Errei feio) a 5 (Muito fácil)
  interval: number,
  repetitions: number,
  easeFactor: number
) {
  let nextInterval = interval;
  let nextRepetitions = repetitions;
  let nextEaseFactor = easeFactor;

  // Atualiza Repetições
  if (grade >= 3) {
    if (nextRepetitions === 0) {
      nextInterval = 1;
    } else if (nextRepetitions === 1) {
      nextInterval = 3; // Opcional: Anki usa 6, Supermemo usa 6, mas 3 é mais intenso
    } else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetitions += 1;
  } else {
    nextRepetitions = 0;
    nextInterval = 1;
  }

  // Atualiza o Ease Factor (Fator de Facilidade)
  nextEaseFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  
  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3;
  }

  // Calcula a data exata da próxima revisão
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    interval: nextInterval,
    repetitions: nextRepetitions,
    easeFactor: nextEaseFactor,
    nextReview: nextReviewDate
  };
}
