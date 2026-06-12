import { state } from './app.js';
import { openModal } from './modal.js';
import { renderCalendar } from './calendar.js';

const MONTHS_SHORT = [
  'ene','feb','mar','abr','may','jun',
  'jul','ago','sep','oct','nov','dic'
];

// ─── Renderizar panel de próximos eventos ───────────────────────
export function renderUpcoming() {
  const list = document.getElementById('upcoming-list');
  list.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrar eventos futuros y ordenar cronológicamente
  const upcoming = state.events
    .filter(ev => {
      const evDate = new Date(ev.date + 'T00:00:00');
      return evDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10); // máximo 10 eventos

  if (upcoming.length === 0) {
    const empty = document.createElement('p');
    empty.style.cssText = 'font-size:0.75rem; color:#6B7280; margin-top:0.5rem;';
    empty.textContent = 'Sin eventos próximos';
    list.appendChild(empty);
    return;
  }

  upcoming.forEach(ev => {
    const evDate = new Date(ev.date + 'T00:00:00');
    const day    = evDate.getDate();
    const month  = MONTHS_SHORT[evDate.getMonth()];

    const li = document.createElement('li');
    li.classList.add('upcoming-item');

    li.innerHTML = `
      <span class="upcoming-dot" style="background-color: ${ev.color || '#5B7FFF'}"></span>
      <div class="upcoming-info">
        <span class="upcoming-title">${ev.title}</span>
        <span class="upcoming-date">${day} ${month}</span>
      </div>
    `;

    // Click lleva al mes del evento y abre el modal
    li.addEventListener('click', () => {
      state.currentMonth = evDate.getMonth();
      state.currentYear  = evDate.getFullYear();
      renderCalendar();
      openModal(ev.id);
    });

    list.appendChild(li);
  });
}