import { state } from './app.js';
import { saveEvents, generateId } from './storage.js';
import { renderCalendar } from './calendar.js';
import { renderUpcoming } from './upcoming.js';

const overlay = document.getElementById('modal-overlay');
const form = document.getElementById('event-form');

// ─── Abrir modal ────────────────────────────────────────────────
// eventId: si es null, es un evento nuevo
// date: fecha preseleccionada al hacer click en una celda
export function openModal(eventId = null, date = null) {
  form.reset();

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
  } else {
    document.querySelector('#modal h3').textContent = 'Nuevo evento';
    delete form.dataset.editId;

    if (date) document.getElementById('event-date').value = date;
    document.getElementById('event-color').value = '#5B7FFF';

    populateCourses(null);
  }

  overlay.classList.remove('hidden');
}

export function closeModal() {
  overlay.classList.add('hidden');
  delete form.dataset.editId;
}

// ─── Inicializar eventos del modal ──────────────────────────────
export function initModal() {
  // Cerrar al hacer click en overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Botón cerrar
  document.getElementById('modal-close').addEventListener('click', closeModal);

  // Submit del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
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
    // Editar evento existente
    const index = state.events.findIndex(e => e.id === editId);
    if (index !== -1) {
      state.events[index] = { ...state.events[index], title, description, type, courseId, date, color };
    }
  } else {
    // Crear evento nuevo
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

  saveEvents(state.events);
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