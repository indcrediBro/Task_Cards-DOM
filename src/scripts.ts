import { logDate } from './logDate';

logDate();

// Define a TypeScript interface for Card
interface Card {
  id: number;
  text: string;
}

let taskIndex = 0;

// Function to delete a card
function deleteCard(id: number) {
  let cards: Card[] = JSON.parse(localStorage.getItem('cards') || '[]');
  cards = cards.filter((card) => card.id !== id);
  localStorage.setItem('cards', JSON.stringify(cards));
  displayCards();

  if (cards.length < 1) taskIndex = 0;
  else taskIndex -= 1;
}

// Function to add event listeners to delete buttons
function addDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id') || '0', 10);
      deleteCard(id);
    });
  });
}

// Function to display all cards in the container
function displayCards() {
  const cardsContainer = document.querySelector('.cardsContainer');

  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    const cards: Card[] = JSON.parse(localStorage.getItem('cards') || '[]');
    cards.forEach((card) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card'; // Apply the 'card' class
      cardDiv.innerHTML = `
                  <p>Task ${card.id}</p>
                  <p>${card.text}</p>
                  <button class="deleteButton" data-id="${card.id}">Delete</button>
                  <button class="editButton" data-id="${card.id}">Edit</button>
              `;
      cardsContainer.appendChild(cardDiv);
    });
    addDeleteEventListeners(); // Add event listeners after cards are displayed
  }
}

// Function to save a card to local storage
function saveCard(card: Card) {
  const cards: Card[] = JSON.parse(localStorage.getItem('cards') || '[]');
  cards.push(card);
  localStorage.setItem('cards', JSON.stringify(cards));
}

// Function to create a new card
function createCard() {
  const cardTextInput = document.querySelector('.cardText') as HTMLInputElement;
  const text = cardTextInput.value.trim();
  taskIndex += 1;
  if (text !== '') {
    const card: Card = { id: taskIndex, text };
    saveCard(card);
    displayCards();
    cardTextInput.value = '';
  }
}

// Display cards on page load
document.addEventListener('DOMContentLoaded', () => {
  displayCards();
});
const createButton = document.querySelector('.createButton');
createButton?.addEventListener('click', createCard);
