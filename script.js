// External JavaScript File for COS 106 - Samuel Iyoha (2025/C/CSC/1089 | @SamYoha99)
let tasks = JSON.parse(localStorage.getItem('cos106_samuel_tasks')) || [
    { id: 1, text: 'Complete COS 106 Portfolio Website (Samuel Iyoha - 2025/C/CSC/1089)', done: true },
    { id: 2, text: 'Push Repository to https://github.com/SamYoha99/cos106-portfolio & Enable GitHub Pages', done: false }
];

function renderPlanner() {
    const list = document.getElementById('taskList');
    if (!list) return;
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item ' + (task.done ? 'done' : '');
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button onclick="toggleTask(${task.id})" class="btn btn-primary">${task.done ? 'Undo' : 'Complete'}</button>
                <button onclick="removeTask(${task.id})" class="btn">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('cos106_samuel_tasks', JSON.stringify(tasks));
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    renderPlanner();
}

function removeTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderPlanner();
}

const plannerForm = document.getElementById('plannerForm');
if (plannerForm) {
    plannerForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('taskInput');
        if (input.value.trim()) {
            tasks.push({ id: Date.now(), text: input.value.trim(), done: false });
            input.value = '';
            renderPlanner();
        }
    });
}

// Contact Form Validation (No empty fields, valid email regex, digits-only phone)
const contactFormPage = document.getElementById('contactFormPage');
if (contactFormPage) {
    contactFormPage.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('nameField').value.trim();
        const email = document.getElementById('emailField').value.trim();
        const phone = document.getElementById('phoneField').value.trim();
        const msg = document.getElementById('messageField').value.trim();
        const feedback = document.getElementById('formFeedback');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const digitsOnly = /^\d+$/;

        if (!name || !email || !phone || !msg) {
            feedback.textContent = 'Error: No field is allowed to be empty.';
            feedback.style.color = '#dc2626';
            return;
        }
        if (!emailRegex.test(email)) {
            feedback.textContent = 'Error: Please enter a valid email address.';
            feedback.style.color = '#dc2626';
            return;
        }
        if (!digitsOnly.test(phone)) {
            feedback.textContent = 'Error: Phone number must contain ONLY digits (0-9).';
            feedback.style.color = '#dc2626';
            return;
        }

        feedback.textContent = 'Success! Your message to Samuel Iyoha (2025/C/CSC/1089 | @SamYoha99) passed validation and was sent.';
        feedback.style.color = '#059669';
        contactFormPage.reset();
    });
}

document.addEventListener('DOMContentLoaded', renderPlanner);