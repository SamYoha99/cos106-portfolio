/* ==========================================================================
   COS 106 – Introduction to Web Technologies
   Student: Samuel Iyoha | Matric No: 2025/C/CSC/1089
   Interactive Planner, Page Navigation & Form Validation (script.js)
   ========================================================================== */

// 1. MULTI-PAGE NAVIGATION CONTROLLER
function showPage(pageId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

// 2. ACADEMIC PLANNER SYSTEM (Array + LocalStorage + DOM Manipulation)
let tasks = JSON.parse(localStorage.getItem('samuel_cos106_tasks')) || [
  { id: 1, title: 'Submit COS 106 Term Project & GitHub Repo Link', course: 'COS 106', priority: 'High', dueDate: '2025-05-20', completed: false },
  { id: 2, title: 'Complete JavaScript Form Validation & DOM Lab', course: 'COS 106', priority: 'High', dueDate: '2025-05-15', completed: true },
  { id: 3, title: 'Revise Discrete Structures Set Theory Notes', course: 'MTH 102', priority: 'Medium', dueDate: '2025-05-22', completed: false },
  { id: 4, title: 'Push Responsive CSS Grid Layout to @SamYoha99', course: 'COS 106', priority: 'Medium', dueDate: '2025-05-12', completed: true }
];

let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('samuel_cos106_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const listEl = document.getElementById('task-list');
  if (!listEl) return;

  const filtered = tasks.filter(t => {
    if (currentFilter === 'pending') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  // Update counters
  const totalEl = document.getElementById('stat-total');
  const pendingEl = document.getElementById('stat-pending');
  const doneEl = document.getElementById('stat-completed');

  if (totalEl) totalEl.textContent = tasks.length;
  if (pendingEl) pendingEl.textContent = tasks.filter(t => !t.completed).length;
  if (doneEl) doneEl.textContent = tasks.filter(t => t.completed).length;

  listEl.innerHTML = '';

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <li class="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        No academic tasks in this view. Add a new task above!
      </li>`;
    return;
  }

  filtered.forEach(task => {
    const badgeColor = task.priority === 'High'
      ? 'bg-red-100 text-red-700 border-red-200'
      : task.priority === 'Medium'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200';

    const li = document.createElement('li');
    li.className = `flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
      task.completed ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm'
    }`;

    li.innerHTML = `
      <div class="flex items-start gap-3.5">
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
          onchange="toggleTask(${task.id})"
          class="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
        <div>
          <p class="font-semibold text-slate-900 ${task.completed ? 'task-done' : ''}">${task.title}</p>
          <div class="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
            <span class="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono font-semibold">${task.course}</span>
            <span class="px-2.5 py-0.5 rounded-md border font-semibold ${badgeColor}">${task.priority} Priority</span>
            <span class="text-slate-500">Due: ${task.dueDate}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 self-end sm:self-center">
        <button onclick="toggleTask(${task.id})" class="px-3 py-1.5 text-xs font-semibold rounded-lg border ${
          task.completed
            ? 'border-slate-300 text-slate-600 hover:bg-slate-100'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        }">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onclick="deleteTask(${task.id})" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
          Delete
        </button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById('task-title');
  const courseInput = document.getElementById('task-course');
  const priorityInput = document.getElementById('task-priority');
  const dateInput = document.getElementById('task-date');
  const errEl = document.getElementById('planner-error');

  if (!titleInput.value.trim()) {
    errEl.textContent = 'Please enter a task description before adding.';
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');

  tasks.unshift({
    id: Date.now(),
    title: titleInput.value.trim(),
    course: courseInput.value,
    priority: priorityInput.value,
    dueDate: dateInput.value || '2025-05-30',
    completed: false
  });

  titleInput.value = '';
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const active = btn.dataset.filter === filter;
    btn.className = active
      ? 'filter-btn px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white'
      : 'filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
  });
  renderTasks();
}

// 3. CONTACT FORM VALIDATION (No empty fields, valid email, digits-only phone)
function validateContactForm(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errPhone = document.getElementById('err-phone');
  const errMsg = document.getElementById('err-message');
  const successBanner = document.getElementById('contact-success');

  [errName, errEmail, errPhone, errMsg, successBanner].forEach(el => el.classList.add('hidden'));

  let isValid = true;

  if (!name) {
    errName.textContent = 'Full Name is required.';
    errName.classList.remove('hidden');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errEmail.textContent = 'Please enter a valid email address (e.g., samuel@miva.edu.ng).';
    errEmail.classList.remove('hidden');
    isValid = false;
  }

  const digitsOnlyRegex = /^\d+$/;
  if (!phone || !digitsOnlyRegex.test(phone) || phone.length < 7) {
    errPhone.textContent = 'Phone number must contain only digits (0-9) with no spaces or symbols.';
    errPhone.classList.remove('hidden');
    isValid = false;
  }

  if (!message) {
    errMsg.textContent = 'Message field cannot be empty.';
    errMsg.classList.remove('hidden');
    isValid = false;
  }

  if (isValid) {
    successBanner.classList.remove('hidden');
    document.getElementById('contact-form').reset();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});