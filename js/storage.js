// ─── Claves de localStorage ─────────────────────────────────────
const KEYS = {
  events:        'cal_events',
  courses:       'cal_courses',
  semesterStart: 'cal_semester_start',
  semesterWeeks: 'cal_semester_weeks',
};

// ─── Cargar estado desde localStorage ──────────────────────────
export function loadState(state) {
  state.events        = JSON.parse(localStorage.getItem(KEYS.events))        || [];
  state.courses       = JSON.parse(localStorage.getItem(KEYS.courses))       || [];
  state.semesterStart = localStorage.getItem(KEYS.semesterStart)             || null;
  state.semesterWeeks = parseInt(localStorage.getItem(KEYS.semesterWeeks))   || 16;
}

// ─── Guardar eventos ────────────────────────────────────────────
export function saveEvents(events) {
  localStorage.setItem(KEYS.events, JSON.stringify(events));
}

// ─── Guardar cursos ─────────────────────────────────────────────
export function saveCourses(courses) {
  localStorage.setItem(KEYS.courses, JSON.stringify(courses));
}

// ─── Guardar configuración del semestre ─────────────────────────
export function saveSemesterConfig(start, weeks) {
  localStorage.setItem(KEYS.semesterStart, start);
  localStorage.setItem(KEYS.semesterWeeks, weeks);
}

// ─── Generar ID único para cada evento ──────────────────────────
export function generateId() {
  return crypto.randomUUID();
}