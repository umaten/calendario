import { state } from './app.js';
import { saveEvents, generateId } from './storage.js';
import { renderCalendar } from './calendar.js';
import { renderUpcoming } from './upcoming.js';

const overlay = document.getElementById('modal-overlay');
const form = document.getElementById('event-form');

// ─── Colores por defecto según tipo de evento ───────────────────
const TYPE_COLORS = {
  task:  '#5B7FFF',
  exam:  '#E05A5A',
  other: '#7BC67E',
};

// ─── Abrir modal ────────────────────────────────────────────────
export function openModal(eventId = null, date = null) {
  form.reset();

  const deleteBtn = document.getElementById('btn-delete-event');

  if (eventId) {
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;

    document.querySelector('#modal h3').textContent = 'Editar evento';
    document.getElementById('event-title').value       = ev.title;
    document.getElementById('event-description').value = ev.description || '';
    document.getElementById('event-type').value        = ev.type;
    document.getElementById('event-date').value        = ev.date;
    document.getElementById('event-color').value       = ev.color || '#5B7FFF';

    form.dataset.editId = eventId;
    populateCourses(ev.courseId);

    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
  } else {
    document.querySelector('#modal h3').textContent = 'Nuevo evento';
    delete form.dataset.editId;

    if (date) document.getElementById('event-date').value = date;
    document.getElementById('event-color').value = TYPE_COLORS.task;

    populateCourses(null);

    if (deleteBtn) deleteBtn.style.display = 'none';
  }

  overlay.classList.remove('hidden');
}

export function closeModal() {
  overlay.classList.add('hidden');
  delete form.dataset.editId;
}

// ─── Inicializar eventos del modal ──────────────────────────────
export function initModal() {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  const deleteBtn = document.getElementById('btn-delete-event');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDelete);
  }

  // Cambiar color automáticamente al elegir el tipo
  document.getElementById('event-type').addEventListener('change', (e) => {
    const color = TYPE_COLORS[e.target.value];
    if (color) document.getElementById('event-color').value = color;
  });
}

// ─── Guardar evento (crear o editar) ────────────────────────────
function handleSubmit() {
  const title       = document.getElementById('event-title').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const type        = document.getElementById('event-type').value;
  const courseId    = document.getElementById('event-course').value || null;
  const date        = document.getElementById('event-date').value;
  const color       = document.getElementById('event-color').value;

  if (!title || !date) return;

  const editId = form.dataset.editId;

  if (editId) {
    const index = state.events.findIndex(e => e.id === editId);
    if (index !== -1) {
      state.events[index] = { ...state.events[index], title, description, type, courseId, date, color };
    }
  } else {
    const newEvent = {
      id: generateId(),
      title,
      description,
      type,
      courseId,
      date,
      color,
    };
    state.events.push(newEvent);
  }

  saveEvents(state.events, state.mode);
  closeModal();
  renderCalendar();
  renderUpcoming();
}

// ─── Eliminar evento ─────────────────────────────────────────────
function handleDelete() {
  const editId = form.dataset.editId;
  if (!editId) return;

  state.events = state.events.filter(e => e.id !== editId);

  saveEvents(state.events, state.mode);
  closeModal();
  renderCalendar();
  renderUpcoming();
}

// ─── Poblar select de cursos ────────────────────────────────────
function populateCourses(selectedCourseId) {
  const select = document.getElementById('event-course');
  select.innerHTML = '<option value="">Sin curso</option>';

  state.courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.name;
    if (course.id === selectedCourseId) option.selected = true;
    select.appendChild(option);
  });
}