const formElement = document.querySelector('#task-form');
const inputElement = document.querySelector('#task-input');
const taskListElement = document.querySelector('#task-list');
const clearButtonElement = document.querySelector('#clear-tasks');

function addTask(tasksArray, newTaskText) {
  return [
    ...tasksArray,
    { text: newTaskText, done: false }
  ];
}

function removeTask(tasksArray, taskIndex) {
  return tasksArray.filter((_, currentIndex) => currentIndex !== taskIndex);
}

function toggleTaskDone(tasksArray, taskIndex) {
  return tasksArray.map((task, currentIndex) => {
    if (currentIndex === taskIndex) {
      return { ...task, done: !task.done };
    }
    return task;
  });
}

function clearAllTasks() {
  return [];
}

function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasksArray) {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}


function renderTaskList(tasksArray) {
  taskListElement.textContent = '';
  tasksArray.forEach((taskObject, taskIndex) => {
    const listItemElement = document.createElement('li');
    listItemElement.style.display = "flex";
    listItemElement.style.alignItems = "center";
    listItemElement.style.justifyContent = "space-between";


    const taskTextElement = document.createElement('span');
    taskTextElement.textContent = taskObject.text;
    taskTextElement.className = taskObject.done ? 'done' : '';
    taskTextElement.style.cursor = "pointer";

    taskTextElement.addEventListener('click', () => {
      tasksState.tasksArray = toggleTaskDone(tasksState.tasksArray, taskIndex);
      saveTasksToStorage(tasksState.tasksArray);
      renderTaskList(tasksState.tasksArray);
    });

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.textContent = '🗑️';
    deleteButtonElement.className = 'delete';
    deleteButtonElement.title = "Supprimer";
    deleteButtonElement.addEventListener('click', () => {
      tasksState.tasksArray = removeTask(tasksState.tasksArray, taskIndex);
      saveTasksToStorage(tasksState.tasksArray);
      renderTaskList(tasksState.tasksArray);
    });

    listItemElement.append(taskTextElement, deleteButtonElement);

    taskListElement.appendChild(listItemElement);
  });
}

const tasksState = {
  tasksArray: loadTasksFromStorage()
};

formElement.addEventListener('submit', event => {
  event.preventDefault();
  const newTaskText = inputElement.value.trim();
  if (!newTaskText) return;
  tasksState.tasksArray = addTask(tasksState.tasksArray, newTaskText);
  inputElement.value = '';
  saveTasksToStorage(tasksState.tasksArray);
  renderTaskList(tasksState.tasksArray);
});

clearButtonElement.addEventListener('click', () => {
  tasksState.tasksArray = clearAllTasks();
  saveTasksToStorage(tasksState.tasksArray);
  renderTaskList(tasksState.tasksArray);
});

renderTaskList(tasksState.tasksArray);
