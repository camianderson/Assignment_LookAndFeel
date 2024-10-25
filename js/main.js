// Hamburger Menu
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('responsive');
  }
}

// Manage Clothing
document.addEventListener('DOMContentLoaded', () => {
  loadItems(); 

  const chartCanvas = document.getElementById('trendingOutfitsChart');
  if (chartCanvas) {
    displayTrendingOutfitsChart();
  }
});

// Create or update an item in the wardrobe
function createOrUpdateItem() {
  const clothingItem = document.getElementById('clothingItem').value;
  const color = document.getElementById('color').value;
  const editingId = document.getElementById('clothingForm').dataset.editingId;
  const submitBtn = document.getElementById('submitBtn');

  if (clothingItem && color) {
      let items = getItemsFromLocalStorage();

      if (editingId) {
          const itemIndex = items.findIndex(i => i.id === parseInt(editingId));
          if (itemIndex !== -1) {
              items[itemIndex].name = clothingItem;
              items[itemIndex].color = color;

              document.getElementById('clothingForm').dataset.editingId = '';
              if (submitBtn) {
                  submitBtn.textContent = 'Add Clothing Item';
              }
          }
      } else {
          const newItem = {
              id: Date.now(),
              name: clothingItem,
              color: color
          };
          items.push(newItem);
      }

      saveItemsToLocalStorage(items);
      displayItems();
      document.getElementById('clothingForm').reset(); 
  } else {
      alert('Please enter both the clothing item and color!');
  }
}

function displayItems() {
  const clothingList = document.getElementById('clothingList');
  if (!clothingList) return; 

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
  const submitBtn = document.getElementById('submitBtn');

  if (item) {
      document.getElementById('clothingItem').value = item.name;
      document.getElementById('color').value = item.color;
      document.getElementById('clothingForm').dataset.editingId = id;

      if (submitBtn) {
          submitBtn.textContent = 'Update Clothing Item';
      }
  }
}

document.getElementById('clothingForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  createOrUpdateItem();
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

// Analytics
function displayTrendingOutfitsChart() {
  const items = getItemsFromLocalStorage();

  if (items.length === 0) {
      alert('No clothing items found. Add items to manage wardrobe.');
      return;
  }

  const itemCounts = {};
  items.forEach(item => {
      if (itemCounts[item.name]) {
          itemCounts[item.name]++;
      } else {
          itemCounts[item.name] = 1;
      }
  });

  const labels = Object.keys(itemCounts);
  const data = Object.values(itemCounts);

  const chartCanvas = document.getElementById('trendingOutfitsChart');
  if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Number of Times Added',
                  data: data,
                  backgroundColor: 'rgba(209, 123, 123, 0.6)',
                  borderColor: 'rgba(209, 123, 123, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Number of Times Added'
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Clothing Items'
                      }
                  }
              },
              plugins: {
                  legend: {
                      display: true,
                      position: 'top'
                  }
              }
          }
      });
  } else {
      console.log('Chart canvas not found.');
  }
}
