// Hamburger Menu
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('responsive');
}

// Manage Clothing
document.addEventListener('DOMContentLoaded', () => {
  loadItems(); 
});

function createItem() {
  const clothingItem = document.getElementById('clothingItem').value;
  const color = document.getElementById('color').value;

  if (clothingItem && color) {
      const newItem = {
          id: Date.now(),
          name: clothingItem,
          color: color
      };
      let items = getItemsFromLocalStorage();
      items.push(newItem);
      saveItemsToLocalStorage(items);
      displayItems();
      document.getElementById('clothingForm').reset(); 
  } else {
      alert('Please enter both the clothing item and color!');
  }
}

function displayItems() {
  const clothingList = document.getElementById('clothingList');
  clothingList.innerHTML = ''; 
  const items = getItemsFromLocalStorage();

  items.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('clothing-item');
      li.innerHTML = `
          <h4>${item.name}</h4>
          <p>Color: ${item.color}</p>
          <button onclick="editItem(${item.id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
      `;
      clothingList.appendChild(li);
  });
}

function editItem(id) {
  const items = getItemsFromLocalStorage();
  const item = items.find(i => i.id === id);

  if (item) {
      document.getElementById('clothingItem').value = item.name;
      document.getElementById('color').value = item.color;
      document.getElementById('clothingForm').dataset.editingId = id;
  }
}

document.getElementById('clothingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const editingId = document.getElementById('clothingForm').dataset.editingId;
  if (editingId) {
      const items = getItemsFromLocalStorage();
      const item = items.find(i => i.id === parseInt(editingId));

      item.name = document.getElementById('clothingItem').value;
      item.color = document.getElementById('color').value;

      saveItemsToLocalStorage(items);
      displayItems();
      document.getElementById('clothingForm').reset();
      delete document.getElementById('clothingForm').dataset.editingId;
  }
});

function deleteItem(id) {
  let items = getItemsFromLocalStorage();
  items = items.filter(item => item.id !== id);
  saveItemsToLocalStorage(items);
  displayItems();
}

function getItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('wardrobeItems')) || [];
}

function saveItemsToLocalStorage(items) {
  localStorage.setItem('wardrobeItems', JSON.stringify(items));
}

function loadItems() {
  displayItems();
}
