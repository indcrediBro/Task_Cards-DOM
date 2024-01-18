/* eslint-disable radix */
/* eslint-disable no-use-before-define */
import axios from 'axios';
import { logDate } from './logDate';

logDate();

type Task = {
  id: unknown;
  title: string;
};

const apiUrl = 'http://localhost:3004/tasks/';
let taskArr: Task[] = [];

const getTasks = () => {
  axios
    .get<Task[]>(apiUrl)
    .then((response) => {
      taskArr = response.data;
      console.log('Successfully got data', response.data);
      displayTasks();
    })
    .catch((error) => {
      console.error('Failed to get data', error);
    });
};

const deleteTask = async (id: unknown) => {
  try {
    const response = await axios.delete(`${apiUrl}${id}`);
    if (response.data.success) {
      console.log('Task deleted successfully.');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
  getTasks();
};
const addDeleteEventListeners = () => {
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteTask(id);
    });
  });
};

const addEditEventListeners = () => {
  const editButtons = document.querySelectorAll('.editButton');
  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      editTaskInput(id);
    });
  });
};

const displayTasks = () => {
  const tasksContainer = document.querySelector('.tasksContainer');

  if (tasksContainer) {
    tasksContainer.innerHTML = '';
    taskArr.forEach((task: Task) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.innerHTML = `
                <p>${task.title}</p>
                <button class="deleteButton" data-id="${task.id}">Delete</button>
                <button class="editButton" data-id="${task.id}">Edit</button>
            `;
      tasksContainer.appendChild(taskDiv);
    });
    addDeleteEventListeners();
    addEditEventListeners();
  }
};

const saveTask = async (task: Task) => {
  try {
    const response = await axios.post(apiUrl, task);
    console.log('Task saved:', response.data);
    getTasks();
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const createTask = () => {
  const taskTitleInput = document.querySelector(
    '.taskTitle'
  ) as HTMLInputElement;
  const title = taskTitleInput.value;

  if (title !== '') {
    const task: Task = { id: Date.now(), title };
    saveTask(task);
    getTasks();
    taskTitleInput.value = '';
  }
};

const editTaskInput = (id: number) => {
  const taskDiv = document.querySelector(`.task[data-id="${id}"]`);
  if (taskDiv) {
    const currentTitle = taskDiv.querySelector('p');
    const inputElement = document.createElement('input');
    inputElement.value = currentTitle.innerHTML;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';

    const editButton = taskDiv.querySelector('.editButton');

    saveButton.addEventListener('click', () => {
      editTask(id, inputElement.value);
      inputElement.remove();
      saveButton.remove();
    });

    taskDiv.removeChild(editButton);
    taskDiv.appendChild(inputElement);
    taskDiv.appendChild(saveButton);
  }
};

const editTask = async (id: number, newTitle: string) => {
  try {
    const response = await axios.put(`${apiUrl}/${id}`, {
      title: newTitle,
    });
    console.log('Task edited successfully:', response.data);
    getTasks(); // Fetch tasks again after editing to update the taskArr
  } catch (error) {
    console.error('Error editing task:', error);
  }
};

getTasks();

const createButton = document.querySelector('.createButton');
createButton?.addEventListener('click', createTask);
