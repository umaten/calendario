import { state } from './app.js';
import { renderCalendar } from './calendar.js';
import { openCourseEditor } from './courses-modal.js';

// ─── Calcular si un color es claro u oscuro ──────────────────────
// Devuelve 'dark' o 'light' para usar como color de texto contrastante
function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Luminancia relativa (fórmula estándar WCAG simplificada)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? '#1A1D2E' : '#FFFFFF';
}

const TYPES = [
  { value: 'task',  label: 'Tarea',  color: '#5B7FFF' },
  { value: 'exam',  label: 'Examen', color: '#E05A5A' },
  { value: 'other', label: 'Otro',   color: '#7BC67E' },
];

// ─── Renderizar todos los filtros ────────────────────────────────
export function renderFilters() {
  renderTypeFilters();
  renderCourseFilters();
}

// ─── Filtros por tipo ────────────────────────────────────────────
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
      state.activeTypeFilter = state.activeTypeFilter === type.value ? null : type.value;
      renderTypeFilters();
      renderCalendar();
    });

    container.appendChild(chip);
  });
}

// ─── Filtros por curso (académico) o anotaciones (personal) ─────
export function renderCourseFilters() {
  const container = document.getElementById('filter-course');
  container.innerHTML = '';

  if (state.mode === 'personal') {
    if (state.notes.length === 0) {
      container.innerHTML = '<p style="font-size:0.75rem; color:#6B7280;">Sin anotaciones aún</p>';
      return;
    }
    state.notes.forEach(note => {
      const chip = document.createElement('div');
      chip.classList.add('filter-chip');
      chip.innerHTML = `<span class="filter-dot" style="background-color:#7BC67E"></span>${note}`;
      container.appendChild(chip);
    });
    return;
  }

  if (state.courses.length === 0) {
    container.innerHTML = '<p style="font-size:0.75rem; color:#6B7280;">Sin cursos aún</p>';
    return;
  }

  state.courses.forEach(course => {
    const chip = document.createElement('div');
    chip.classList.add('filter-chip');
    if (state.activeCourseFilter === course.id) chip.classList.add('active');

    const textColor = getContrastColor(course.color);
    chip.style.backgroundColor = course.color;
    chip.style.color = textColor;
    chip.style.borderColor = course.color;

    chip.innerHTML = `
      <span class="filter-chip-name">${course.name}</span>
      <button class="course-edit-icon" aria-label="Editar curso" title="Editar curso">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="M15 5l4 4"/>
        </svg>
      </button>
    `;

    chip.querySelector('.filter-chip-name').addEventListener('click', () => {
      state.activeCourseFilter = state.activeCourseFilter === course.id ? null : course.id;
      renderCourseFilters();
      renderCalendar();
    });

    chip.querySelector('.course-edit-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      openCourseEditor(course);
    });

    container.appendChild(chip);
  });
}