
let state = {
  tasks: [],       // масив усіх завдань
  activeSort: null, // поле сортування або null
  nextId: 1
};


const createTask = (id, text) => ({
  id,
  text,
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});


const removeTask = (tasks, id) =>
  tasks.filter(t => t.id !== id);

const toggleDone = (tasks, id) =>
  tasks.map(t =>
    t.id === id
      ? { ...t, done: !t.done, updatedAt: new Date().toISOString() }
      : t
  );

const updateTaskText = (tasks, id, text) =>
  tasks.map(t =>
    t.id === id
      ? { ...t, text, updatedAt: new Date().toISOString() }
      : t
  );

const sortTasks = (tasks, field) => {
  if (!field) return tasks;
  return [...tasks].sort((a, b) => {
    if (field === 'done') {
      return Number(a.done) - Number(b.done);
    }
    return new Date(a[field]) - new Date(b[field]);
  });
};

const render = () => {
  const sorted = sortTasks(state.tasks, state.activeSort);
  renderTaskList(sorted);
};

const renderTaskList = (tasks) => {
  const list = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');

  emptyMsg.style.display = state.tasks.length === 0 ? 'block' : 'none';

  list.innerHTML = ''; 

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => handleToggleDone(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редагувати';
    editBtn.onclick = () => handleStartEdit(task.id, li, textSpan, editBtn, saveBtn);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Зберегти';
    saveBtn.style.display = 'none'; 
    saveBtn.onclick = () => handleSaveEdit(task.id, li, saveBtn, editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Видалити';
    deleteBtn.onclick = () => handleDelete(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(actions);

    list.appendChild(li);
  });
};

document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const input = document.getElementById('new-task-input');
  const errorEl = document.getElementById('add-error');
  const text = input.value.trim();

  if (text.length < 2) {
    errorEl.textContent = 'Завдання повинно містити мінімум 2 символи!';
    return;
  }

  errorEl.textContent = '';

  const newTask = createTask(state.nextId, text);
  state = {
    ...state,
    tasks: [...state.tasks, newTask],
    nextId: state.nextId + 1
  };

  input.value = ''; 
  render();
});

const handleToggleDone = (id) => {
  state = { ...state, tasks: toggleDone(state.tasks, id) };
  render();
};

const handleStartEdit = (id, li, textSpan, editBtn, saveBtn) => {
  const currentText = state.tasks.find(t => t.id === id)?.text || '';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = currentText;
  input.required = true;
  input.minLength = 2;

  li.replaceChild(input, textSpan); 


  editBtn.style.display = 'none';
  saveBtn.style.display = '';

  input.focus();
};

const handleSaveEdit = (id, li, saveBtn, editBtn) => {
  const input = li.querySelector('.task-edit-input');
  if (!input) return;

  const newText = input.value.trim();
  if (newText.length < 2) {
    input.style.borderColor = 'red';
    return;
  }

  state = { ...state, tasks: updateTaskText(state.tasks, id, newText) };

  saveBtn.style.display = 'none';
  editBtn.style.display = '';

  render();
};

const handleDelete = (id) => {
  const li = document.querySelector(`[data-id="${id}"]`);
  if (li) {
    li.classList.add('removing');
    setTimeout(() => {
      state = { ...state, tasks: removeTask(state.tasks, id) };
      render();
    }, 300);
  }
};

const handleSort = (field) => {
  state = { ...state, activeSort: field };
  render();
};

const seedTasks = [
  createTask(1, 'Зробити лабораторну роботу'),
  createTask(2, 'Прочитати документацію по DOM'),
  createTask(3, 'Здати роботу викладачу'),
];

const doneSeed = toggleDone(seedTasks, 1);

state = {
  ...state,
  tasks: doneSeed,
  nextId: 4
};

render();


