import { state } from './app.js';
import { saveSemesterConfig } from './storage.js';
import { renderCalendar } from './calendar.js';

const overlay = document.getElementById('config-overlay');
const form    = document.getElementById('config-form');

// ─── Inicializar ─────────────────────────────────────────────────
export function initConfig() {
  document.getElementById('btn-config').addEventListener('click', openConfig);
  document.getElementById('config-close').addEventListener('click', closeConfig);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeConfig();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const start = document.getElementById('config-start').value;
    const weeks = parseInt(document.getElementById('config-weeks').value);

    state.semesterStart = start;
    state.semesterWeeks = weeks;

    saveSemesterConfig(start, weeks);
    closeConfig();
    renderCalendar();
  });
}

// ─── Abrir ───────────────────────────────────────────────────────
function openConfig() {
  // Precargar valores actuales si existen
  if (state.semesterStart) {
    document.getElementById('config-start').value = state.semesterStart;
  }
  document.getElementById('config-weeks').value = state.semesterWeeks;

  overlay.classList.remove('hidden');
}

// ─── Cerrar ──────────────────────────────────────────────────────
function closeConfig() {
  overlay.classList.add('hidden');
}