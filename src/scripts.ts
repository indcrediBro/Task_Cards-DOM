/* eslint-disable no-use-before-define */
import axios from 'axios';

type Task = {
  id: number;
  title: string;
  description: string;
  dateCreated: string;
};

const apiUrl = 'http://localhost:3004/tasks/';

let taskArr: Task[] = [];
const taskTitleInput = document.querySelector('.taskTitle') as HTMLInputElement;
const taskDescriptionInput = document.querySelector(
  '.taskDetail'
) as HTMLInputElement;

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

const deleteTask = async (id: string) => {
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

const saveTask = async (task: Task) => {
  try {
    const response = await axios.post(apiUrl, task);
    console.log('Task saved:', response.data);
    getTasks();
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const updateTask = async (id: string, updatedTask: Partial<Task>) => {
  try {
    const response = await axios.put(`${apiUrl}${id}`, updatedTask);
    console.log('Task updated successfully:', response.data);
    getTasks();
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const editTask = async (
  id: string,
  newTitle: string,
  newDescription: string,
  newDate: string
) => {
  try {
    const updatedTask: Partial<Task> = {
      title: newTitle,
      description: newDescription,
      dateCreated: newDate,
    };
    updateTask(id, updatedTask);
  } catch (error) {
    console.error('Error editing task:', error);
  }
};

const displayTasks = () => {
  const tasksContainer = document.querySelector('.tasksContainer');

  if (tasksContainer) {
    tasksContainer.innerHTML = '';
    taskArr.forEach((task: Task) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = `task border task${task.id}`;
      taskDiv.innerHTML = `
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <date>${task.dateCreated}</date>
                <div>
                <button class="editButton" data-id="${task.id}">Edit</button>
                <button class="deleteButton" data-id="${task.id}">Delete</button>
                </div>
                `;
      tasksContainer.appendChild(taskDiv);
    });
    addDeleteEventListeners();
    addEditEventListeners();
  }
};

const addDeleteEventListeners = () => {
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      if (id) {
        deleteTask(id);
      } else {
        console.error('Task ID not found.');
      }
    });
  });
};

const addEditEventListeners = () => {
  const tasksContainer = document.querySelector('.tasksContainer');
  if (tasksContainer) {
    tasksContainer.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('editButton')) {
        const id = target.getAttribute('data-id');
        if (id) {
          editTaskInput(id);
        } else {
          console.error('Task ID not found.');
        }
      }
    });
  }
};

const editTaskInput = (id: string) => {
  const taskDiv = document.querySelector(`.task${id}`);
  if (taskDiv) {
    const currentTitle = taskDiv.querySelector('h2');
    currentTitle.classList.add('hidden');
    const currentTitleInput = document.createElement(
      'input'
    ) as HTMLInputElement;
    currentTitleInput.value = currentTitle.textContent;

    const currentDescription = taskDiv.querySelector('p');
    currentDescription.classList.add('hidden');
    const currentDescriptionInput = document.createElement(
      'textarea'
    ) as HTMLTextAreaElement;
    currentDescriptionInput.value = currentDescription.textContent;

    const currentDate = taskDiv.querySelector('date');

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';

    const editButton = taskDiv.querySelector('.editButton');
    editButton.classList.add('hidden');

    saveButton.addEventListener('click', () => {
      editTask(
        id,
        currentTitleInput.value,
        currentDescriptionInput.value,
        currentDate.textContent
      );
      currentTitle.classList.remove('hidden');
      // currentTitleInput.classList.add('hidden');
      currentTitleInput?.remove();
      currentDescription.classList.remove('hidden');
      // currentDescriptionInput.classList.add('hidden');
      currentDescriptionInput.remove();
      saveButton.remove();
    });
    console.log(`Added Listner for Edit Task ${id}`);

    taskDiv.appendChild(currentTitleInput);
    taskDiv.appendChild(currentDescriptionInput);
    taskDiv.appendChild(saveButton);
  }
};

const createTask = () => {
  const titleData: string = taskTitleInput.value;
  const descriptionData: string = taskDescriptionInput.value;

  if (titleData && descriptionData) {
    const task: Task = {
      id: 0,
      title: titleData,
      description: descriptionData,
      dateCreated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
    saveTask(task);
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
  } else {
    console.error('Title and description are required.');
  }
};

const createButton = document.querySelector('.btn_create') as HTMLElement;
createButton?.addEventListener('click', createTask);

getTasks();
