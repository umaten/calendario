// ─── Manejo de sidebars móviles (off-canvas) ────────────────────
export function initResponsive() {
  const sidebarLeft  = document.getElementById('sidebar-left');
  const sidebarRight = document.getElementById('sidebar-right');
  const overlay      = document.getElementById('sidebar-overlay');

  const btnLeft  = document.getElementById('btn-sidebar-left-toggle');
  const btnRight = document.getElementById('btn-sidebar-right-toggle');

  function closeAll() {
    sidebarLeft.classList.remove('open');
    sidebarRight.classList.remove('open');
    overlay.classList.remove('visible');
    overlay.classList.add('hidden');
  }

  function toggleSidebar(sidebar) {
    const isOpen = sidebar.classList.contains('open');
    closeAll();

    if (!isOpen) {
      sidebar.classList.add('open');
      overlay.classList.remove('hidden');
      overlay.classList.add('visible');
    }
  }

  btnLeft?.addEventListener('click', () => toggleSidebar(sidebarLeft));
  btnRight?.addEventListener('click', () => toggleSidebar(sidebarRight));

  overlay.addEventListener('click', closeAll);
}