import { renderCalendar, buildGrid } from './calendar.js';
import { initModal, openModal } from './modal.js';
import { renderUpcoming } from './upcoming.js';
import { renderFilters } from './filters.js';
import { loadState } from './storage.js';
import { initTheme } from './theme.js';

// ─── Estado global ───────────────────────────────────────────────
export const state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  events: [],
  courses: [],
  activeTypeFilter: null,
  activeCourseFilter: null,
  semesterStart: null,
  semesterWeeks: 16,
};

// ─── Inicialización ──────────────────────────────────────────────
function init() {
  loadState(state);
  initTheme();
  renderFilters();
  renderCalendar();
  renderUpcoming();
  initModal();

  document.getElementById('btn-new-event').addEventListener('click', () => openModal(null));
  document.getElementById('btn-prev').addEventListener('click', () => cambiarMes(-1));
  document.getElementById('btn-next').addEventListener('click', () => cambiarMes(1));

  initCarrusel();
}

// ─── Carrusel ────────────────────────────────────────────────────
function initCarrusel() {
  const calendarMain = document.getElementById('calendar-main');
  let startX    = 0;
  let isDragging = false;
  let animating  = false;

  function getGrid()     { return document.getElementById('calendar-grid'); }
  function getGridNext() { return document.getElementById('calendar-grid-next'); }

  function onStart(clientX) {
    if (animating) return;
    startX = clientX;
    isDragging = true;
  }

  function onMove(clientX) {
    if (!isDragging || animating) return;
    const diff = clientX - startX;

    // Mover el grid actual
    getGrid().style.transform = `translateX(${diff}px)`;

    // Preparar y mover el grid del mes adyacente
    const nextGrid = getGridNext();
    const direccion = diff < 0 ? 1 : -1;
    const nextMonth = state.currentMonth + direccion;
    const nextYear  = nextMonth > 11 ? state.currentYear + 1
                    : nextMonth < 0  ? state.currentYear - 1
                    : state.currentYear;
    const nextMonthNorm = (nextMonth + 12) % 12;

    // Solo reconstruir si cambió de dirección o es la primera vez
    if (nextGrid.dataset.month !== String(nextMonthNorm) ||
        nextGrid.dataset.year  !== String(nextYear)) {
      buildGrid(nextGrid, nextYear, nextMonthNorm);
      nextGrid.dataset.month = nextMonthNorm;
      nextGrid.dataset.year  = nextYear;
    }

    // Posicionar el grid siguiente al lado del actual
    const offset = diff < 0
      ? calendarMain.offsetWidth + diff   // viene de la derecha
      : -calendarMain.offsetWidth + diff; // viene de la izquierda

    nextGrid.style.transform = `translateX(${offset}px)`;
  }

  function onEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;

    const diff    = clientX - startX;
    const umbral  = calendarMain.offsetWidth * 0.25;
    const grid    = getGrid();
    const nextGrid = getGridNext();

    if (Math.abs(diff) >= umbral) {
      // Pasó el umbral — completar la transición
      animating = true;
      const direccion = diff < 0 ? 1 : -1;
      const salida    = diff < 0 ? -calendarMain.offsetWidth : calendarMain.offsetWidth;
      const entrada   = 0;

      grid.style.transition     = 'transform 250ms ease';
      nextGrid.style.transition = 'transform 250ms ease';
      grid.style.transform      = `translateX(${salida}px)`;
      nextGrid.style.transform  = `translateX(${entrada}px)`;

      grid.addEventListener('transitionend', () => {
        // Limpiar ambos grids antes de renderizar
        grid.style.transition     = '';
        grid.style.transform      = '';
        nextGrid.style.transition = '';
        nextGrid.style.transform  = 'translateX(100%)';
        nextGrid.innerHTML        = '';
        nextGrid.dataset.month    = '';
        nextGrid.dataset.year     = '';
        cambiarMes(direccion);
        animating = false;
      }, { once: true });

    } else {
      // No llegó — volver al estado original
      grid.style.transition     = 'transform 250ms ease';
      nextGrid.style.transition = 'transform 250ms ease';
      grid.style.transform      = 'translateX(0)';
      nextGrid.style.transform  = `translateX(${diff < 0 ? calendarMain.offsetWidth : -calendarMain.offsetWidth}px)`;

      grid.addEventListener('transitionend', () => {
        grid.style.transition     = '';
        nextGrid.style.transition = '';
        grid.style.transform      = '';
        nextGrid.style.transform  = '';
        nextGrid.dataset.month    = '';
        nextGrid.dataset.year     = '';
      }, { once: true });
    }
  }

  // Mouse
  calendarMain.addEventListener('mousedown',  (e) => {
    if (e.target.classList.contains('event-chip')) return;
    if (e.target.closest('#calendar-nav')) return;
    onStart(e.clientX);
  });
  calendarMain.addEventListener('mousemove',  (e) => onMove(e.clientX));
  calendarMain.addEventListener('mouseup',    (e) => onEnd(e.clientX));
  calendarMain.addEventListener('mouseleave', (e) => { if (isDragging) onEnd(e.clientX); });

  // Táctil
  calendarMain.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX));
  calendarMain.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX));
  calendarMain.addEventListener('touchend',   (e) => onEnd(e.changedTouches[0].clientX));
}

// ─── Cambiar mes ─────────────────────────────────────────────────
function cambiarMes(direccion) {
  state.currentMonth += direccion;
  if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
  if (state.currentMonth < 0)  { state.currentMonth = 11; state.currentYear--; }
  renderCalendar();
  renderUpcoming();
}

document.addEventListener('DOMContentLoaded', init);