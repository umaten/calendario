// ─── Calcular si un color es claro u oscuro ──────────────────────
// Devuelve el color de texto contrastante: '#1A1D2E' (oscuro) o '#FFFFFF' (claro)
export function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Luminancia relativa (fórmula estándar WCAG simplificada)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? '#1A1D2E' : '#FFFFFF';
}

// ─── Calcular luminancia numérica de un color ────────────────────
export function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}