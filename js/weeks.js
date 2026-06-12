// ─── Calcular número de semana académica ────────────────────────
// Retorna el número de semana (1, 2, 3...) o null si está fuera del semestre
export function getWeekNumber(date, semesterStart, semesterWeeks) {
  if (!semesterStart) return null;

  const start = new Date(semesterStart + 'T00:00:00');
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  const diffMs   = current - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null; // antes del semestre

  const weekNum = Math.floor(diffDays / 7) + 1;

  if (weekNum > semesterWeeks) return null; // después del semestre

  return weekNum;
}