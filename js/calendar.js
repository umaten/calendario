import { state } from './app.js';
import { getWeekNumber } from './weeks.js';
import { openModal } from './modal.js';
import { initDragAndDrop } from './dragdrop.js';

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const WEEKDAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// ─── Renderizar el calendario completo ──────────────────────────
export function renderCalendar() {
  const { currentYear, currentMonth } = state;

  document.getElementById('calendar-title').textContent =
    `${MONTHS[currentMonth]} ${currentYear}`;

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  buildGrid(grid, currentYear, currentMonth);
  initDragAndDrop();
}

// ─── Renderizar un grid para un mes específico ──────────────────
export function buildGrid(grid, year, month) {
  grid.innerHTML = '';
  grid.appendChild(createEl('div', 'week-corner'));

  WEEKDAYS.forEach(day => {
    grid.appendChild(createEl('div', 'weekday-header', day));
  });

  const days = buildDays(year, month);

  days.forEach((dayObj, index) => {
    if (index % 7 === 0) {
      const weekNum = getWeekNumber(dayObj.date, state.semesterStart, state.semesterWeeks);
      const label = weekNum ? `S${weekNum}` : '';
      grid.appendChild(createEl('div', 'week-label', label));
    }
    grid.appendChild(createDayCell(dayObj));
  });
}

// ─── Construir array de días ─────────────────────────────────────
function buildDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  for (let i = startDow; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), otherMonth: true });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), otherMonth: false });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), otherMonth: true });
    }
  }

  return days;
}

// ─── Crear celda de un día ───────────────────────────────────────
function createDayCell(dayObj) {
  const { date, otherMonth } = dayObj;
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const cell = document.createElement('div');
  cell.classList.add('day-cell');
  if (otherMonth) cell.classList.add('day-cell--other-month');
  if (isToday)    cell.classList.add('day-cell--today');

  cell.dataset.date = date.toISOString().split('T')[0];

  const numEl = createEl('div', 'day-number', date.getDate());
  cell.appendChild(numEl);

  const eventsEl = document.createElement('div');
  eventsEl.classList.add('day-events');
  getEventsForDay(date).forEach(ev => {
    eventsEl.appendChild(createEventChip(ev));
  });
  cell.appendChild(eventsEl);

  cell.addEventListener('click', (e) => {
    if (e.target.classList.contains('event-chip')) return;
    openModal(null, cell.dataset.date);
  });

  return cell;
}

// ─── Filtrar eventos para un día ─────────────────────────────────
function getEventsForDay(date) {
  const dateStr = date.toISOString().split('T')[0];
  return state.events.filter(ev => {
    if (state.activeTypeFilter && ev.type !== state.activeTypeFilter) return false;
    if (state.activeCourseFilter && ev.courseId !== state.activeCourseFilter) return false;
    return ev.date === dateStr;
  });
}

// ─── Crear chip de evento ────────────────────────────────────────
export function createEventChip(ev) {
  const chip = document.createElement('div');
  chip.classList.add('event-chip', `event-chip--${ev.type}`);
  chip.textContent = ev.title;
  chip.dataset.id = ev.id;

  if (ev.color) chip.style.backgroundColor = ev.color;

  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(ev.id);
  });

  return chip;
}

// ─── Helper ──────────────────────────────────────────────────────
function createEl(tag, className, text = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== '') el.textContent = text;
  return el;
}