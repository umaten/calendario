// ─── Claves de localStorage ─────────────────────────────────────
const KEYS = {
  events:        (mode) => `cal_events_${mode}`,
  courses:       'cal_courses',
  notes:         'cal_notes',
  semesterStart: 'cal_semester_start',
  semesterWeeks: 'cal_semester_weeks',
  theme:         'cal_theme',
  mode:          'cal_mode',
};

// ─── Cargar estado desde localStorage ──────────────────────────
export function loadState(state) {
  state.mode          = localStorage.getItem(KEYS.mode) || 'academic';
  state.events        = JSON.parse(localStorage.getItem(KEYS.events(state.mode))) || [];
  state.courses       = JSON.parse(localStorage.getItem(KEYS.courses))            || [];
  state.notes         = JSON.parse(localStorage.getItem(KEYS.notes))              || [];
  state.semesterStart = localStorage.getItem(KEYS.semesterStart)                  || null;
  state.semesterWeeks = parseInt(localStorage.getItem(KEYS.semesterWeeks))        || 16;
}

// ─── Guardar eventos del modo actual ────────────────────────────
export function saveEvents(events, mode) {
  localStorage.setItem(KEYS.events(mode), JSON.stringify(events));
}

// ─── Cambiar de modo y cargar sus eventos ───────────────────────
export function switchMode(state, newMode) {
  // Guardar eventos del modo actual antes de cambiar
  saveEvents(state.events, state.mode);
  // Cargar eventos del nuevo modo
  state.mode   = newMode;
  state.events = JSON.parse(localStorage.getItem(KEYS.events(newMode))) || [];
  localStorage.setItem(KEYS.mode, newMode);
}

// ─── Guardar cursos ─────────────────────────────────────────────
export function saveCourses(courses) {
  localStorage.setItem(KEYS.courses, JSON.stringify(courses));
}

// ─── Guardar anotaciones ────────────────────────────────────────
export function saveNotes(notes) {
  localStorage.setItem(KEYS.notes, JSON.stringify(notes));
}

// ─── Guardar configuración del semestre ─────────────────────────
export function saveSemesterConfig(start, weeks) {
  localStorage.setItem(KEYS.semesterStart, start);
  localStorage.setItem(KEYS.semesterWeeks, weeks);
}

// ─── Generar ID único ────────────────────────────────────────────
export function generateId() {
  return crypto.randomUUID();
}