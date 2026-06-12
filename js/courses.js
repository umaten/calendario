import { state } from './app.js';
import { saveCourses, generateId } from './storage.js';
import { renderCourseFilters } from './filters.js';
import { renderCalendar } from './calendar.js';

// ─── Crear curso ────────────────────────────────────────────────
export function createCourse(name, color) {
  const course = {
    id: generateId(),
    name,
    color,
  };
  state.courses.push(course);
  saveCourses(state.courses);
  renderCourseFilters();
}

// ─── Editar curso ───────────────────────────────────────────────
export function editCourse(id, name, color) {
  const index = state.courses.findIndex(c => c.id === id);
  if (index === -1) return;

  state.courses[index] = { ...state.courses[index], name, color };
  saveCourses(state.courses);
  renderCourseFilters();
  renderCalendar(); // los chips del calendario usan el color del curso
}

// ─── Eliminar curso ─────────────────────────────────────────────
export function deleteCourse(id) {
  state.courses = state.courses.filter(c => c.id !== id);

  // Desasociar eventos que pertenecían a ese curso
  state.events = state.events.map(ev =>
    ev.courseId === id ? { ...ev, courseId: null } : ev
  );

  saveCourses(state.courses);
  renderCourseFilters();
  renderCalendar();
}

// ─── Obtener curso por id ───────────────────────────────────────
export function getCourseById(id) {
  return state.courses.find(c => c.id === id) || null;
}