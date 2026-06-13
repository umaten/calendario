import { state } from './app.js';
import { saveEvents } from './storage.js';
import { renderCalendar } from './calendar.js';
import { renderUpcoming } from './upcoming.js';

// ─── Inicializar drag & drop en todos los chips y celdas ────────
export function initDragAndDrop() {
  const chips = document.querySelectorAll('.event-chip');
  const cells = document.querySelectorAll('.day-cell');

  chips.forEach(chip => {
    chip.setAttribute('draggable', true);

    chip.addEventListener('dragstart', onDragStart);
    chip.addEventListener('dragend', onDragEnd);
  });

  cells.forEach(cell => {
    cell.addEventListener('dragover', onDragOver);
    cell.addEventListener('dragleave', onDragLeave);
    cell.addEventListener('drop', onDrop);
  });
}

// ─── Guardar qué evento se está arrastrando ─────────────────────
let draggedId = null;

function onDragStart(e) {
  draggedId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('event-chip--dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('event-chip--dragging');
  draggedId = null;
}

// ─── Celda receptora ────────────────────────────────────────────
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('day-cell--drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('day-cell--drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const cell = e.currentTarget;
  cell.classList.remove('day-cell--drag-over');

  const newDate = cell.dataset.date;
  if (!newDate || !draggedId) return;

  // Actualizar fecha del evento en el estado
  const index = state.events.findIndex(ev => ev.id === draggedId);
  if (index === -1) return;

  state.events[index].date = newDate;

  saveEvents(state.events, state.mode);
  renderCalendar();
  renderUpcoming();
}