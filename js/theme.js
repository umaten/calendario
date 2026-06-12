const STORAGE_KEY = 'cal_theme';

// ─── Inicializar tema ───────────────────────────────────────────
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  document.getElementById('btn-theme').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// ─── Aplicar tema ───────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);

  const btn = document.getElementById('btn-theme');
  btn.textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
}