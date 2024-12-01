// Завантаження JSON-даних
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    // Контейнер для карток
    const container = document.getElementById('card-row');

    // Генерація карток
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('col-md-4', 'mb-4');

      card.innerHTML = `
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Ціна: $${product.price}</strong></p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => console.error('Помилка завантаження даних:', error));