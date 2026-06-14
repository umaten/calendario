import { state } from './app.js';
import { createCourse, editCourse, deleteCourse } from './courses.js';

const overlay  = document.getElementById('courses-overlay');
const form     = document.getElementById('course-form');
const list     = document.getElementById('courses-list');
const deleteBtn = document.getElementById('btn-delete-course');

// ─── Inicializar ─────────────────────────────────────────────────
export function initCoursesModal() {
  document.getElementById('btn-manage-courses').addEventListener('click', openCoursesModal);
  document.getElementById('courses-close').addEventListener('click', closeCoursesModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCoursesModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  deleteBtn.addEventListener('click', handleDelete);
}

// ─── Abrir modal ────────────────────────────────────────────────
function openCoursesModal() {
  resetForm();
  renderCoursesList();
  overlay.classList.remove('hidden');
}

function closeCoursesModal() {
  overlay.classList.add('hidden');
  resetForm();
}

// ─── Renderizar lista de cursos existentes ──────────────────────
function renderCoursesList() {
  list.innerHTML = '';

  if (state.courses.length === 0) {
    list.innerHTML = '<li class="courses-empty">Sin cursos aún</li>';
    return;
  }

  state.courses.forEach(course => {
    const li = document.createElement('li');
    li.classList.add('course-item');

    li.innerHTML = `
      <span class="course-dot" style="background-color: ${course.color}"></span>
      <span class="course-name">${course.name}</span>
      <button class="btn-ghost btn-small" data-id="${course.id}">Editar</button>
    `;

    li.querySelector('button').addEventListener('click', () => {
      loadCourseIntoForm(course);
    });

    list.appendChild(li);
  });
}

// ─── Abrir modal directamente en modo edición de un curso ────────
export function openCourseEditor(course) {
  resetForm();
  renderCoursesList();
  loadCourseIntoForm(course);
  overlay.classList.remove('hidden');
}

// ─── Cargar curso en el formulario para editar ──────────────────
function loadCourseIntoForm(course) {
  document.getElementById('course-name').value  = course.name;
  document.getElementById('course-color').value = course.color;
  form.dataset.editId = course.id;

  document.getElementById('courses-modal-title').textContent = 'Editar curso';
  deleteBtn.style.display = 'inline-flex';
}

// ─── Resetear formulario a modo "crear" ─────────────────────────
function resetForm() {
  form.reset();
  delete form.dataset.editId;
  document.getElementById('course-color').value = '#5B7FFF';
  document.getElementById('courses-modal-title').textContent = 'Cursos';
  deleteBtn.style.display = 'none';
}

// ─── Guardar (crear o editar) ────────────────────────────────────
function handleSubmit() {
  const name  = document.getElementById('course-name').value.trim();
  const color = document.getElementById('course-color').value;

  if (!name) return;

  const editId = form.dataset.editId;

  if (editId) {
    editCourse(editId, name, color);
  } else {
    createCourse(name, color);
  }

  resetForm();
  renderCoursesList();
}

// ─── Eliminar curso ───────────────────────────────────────────────
function handleDelete() {
  const editId = form.dataset.editId;
  if (!editId) return;

  deleteCourse(editId);
  resetForm();
  renderCoursesList();
}