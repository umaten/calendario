import { state } from './app.js';
import { renderCalendar } from './calendar.js';

const TYPES = [
  { value: 'task',  label: 'Tarea',  color: '#5B7FFF' },
  { value: 'exam',  label: 'Examen', color: '#E05A5A' },
  { value: 'other', label: 'Otro',   color: '#7BC67E' },
];

// ─── Renderizar filtros ─────────────────────────────────────────
export function renderFilters() {
  renderTypeFilters();
  renderCourseFilters();
}

// ─── Filtros por tipo ───────────────────────────────────────────
function renderTypeFilters() {
  const container = document.getElementById('filter-type');
  container.innerHTML = '';

  TYPES.forEach(type => {
    const chip = document.createElement('div');
    chip.classList.add('filter-chip');
    if (state.activeTypeFilter === type.value) chip.classList.add('active');

    chip.innerHTML = `
      <span class="filter-dot" style="background-color: ${type.color}"></span>
      ${type.label}
    `;

    chip.addEventListener('click', () => {
      // Toggle: si ya está activo lo desactiva
      state.activeTypeFilter = state.activeTypeFilter === type.value ? null : type.value;
      renderTypeFilters();
      renderCalendar();
    });

    container.appendChild(chip);
  });
}

// ─── Filtros por curso ──────────────────────────────────────────
export function renderCourseFilters() {
  const container = document.getElementById('filter-course');
  container.innerHTML = '';

  if (state.courses.length === 0) {
    container.innerHTML = '<p style="font-size:0.75rem; color: #6B7280;">Sin cursos aún</p>';
    return;
  }

  state.courses.forEach(course => {
    const chip = document.createElement('div');
    chip.classList.add('filter-chip');
    if (state.activeCourseFilter === course.id) chip.classList.add('active');

    chip.innerHTML = `
      <span class="filter-dot" style="background-color: ${course.color}"></span>
      ${course.name}
    `;

    chip.addEventListener('click', () => {
      state.activeCourseFilter = state.activeCourseFilter === course.id ? null : course.id;
      renderCourseFilters();
      renderCalendar();
    });

    container.appendChild(chip);
  });
}