function getProductHtml(product) {
  return `
  <div class="col-md-4 mb-4">
    <div class="card h-100">
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title fw-bold">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="price">${product.price}$</span>
          <button class="btn btn-primary cart-btn" data-product='${JSON.stringify(product)}'>
            Купити
          </button>
        </div>
      </div>
    </div>
  </div>
`;
}

function addToComparisonTable(product) {
  const tbody = document.getElementById('comparison-tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
  <td>${product.title}</td>
  <td>${product.gpu}</td>
  <td>${product.memory}</td>
  <td>${product.clockSpeed}</td>
  <td>${product.price}$</td>
`;
  tbody.appendChild(row);
}
function renderProducts(products) {
  const container = document.getElementById('card-row'); // Проверяем наличие контейнера
  if (!container) {
      console.error("Container with id 'card-row' не найден!");
      return; // Прерываем выполнение, если контейнер отсутствует
  }

  products.forEach(product => {
      addToComparisonTable(product); // Заполняем таблицу сравнения
  });
}

// Приклад даних про відеокарти
const mockProducts = [
  {
      title: 'NVIDIA RTX 3090',
      description: 'Потужна відеокарта для професіоналів.',
      image: 'path/to/image/rtx3090.jpg',
      price: 1499,
      gpu: 'Ampere',
      memory: '24GB GDDR6X',
      clockSpeed: '1.7GHz'
  },
  {
      title: 'AMD RX 7900 XTX',
      description: 'Якісна відеокарта для ігор та робочих задач.',
      image: 'path/to/image/rx7900xtx.jpg',
      price: 999,
      gpu: 'RDNA 3',
      memory: '20GB GDDR6',
      clockSpeed: '2.5GHz'
  },
  {
      title: 'NVIDIA RTX 4060',
      description: 'Доступна відеокарта для Full HD ігор.',
      image: 'path/to/image/rtx4060.jpg',
      price: 399,
      gpu: 'Ada Lovelace',
      memory: '8GB GDDR6',
      clockSpeed: '1.8GHz'
  }
];

// Рендеринг товарів і таблиці
renderProducts(mockProducts);

async function getProducts() {
const response = await fetch('products.json')
return await response.json()
}

getProducts().then(function (products) {
const productsContainer = document.querySelector('.catalog')
console.log(products)
if (products && productsContainer) {
  products.forEach(function (product) {
    productsContainer.innerHTML += getProductHtml(product)
  })
}
let buyButtons = document.querySelectorAll('.cart-btn')

if(buyButtons.length > 0) {
  buyButtons.forEach(function(button) {
      button.addEventListener('click', addToCart)
  })
}
})


class Cart {
constructor() {
    this.items = {}
    this.total = 0
    this.loadCartToCookies()
}

addItem(item) {
    if(this.items[item.title]) {
        this.items[item.title].quantity += 1
    } else {
        this.items[item.title] = item
        this.items[item.title].quantity = 1
    }
    this.saveCartToCookies()
}

saveCartToCookies() {
    let cartJSON = JSON.stringify(this.items)
    document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`

    console.log(document.cookie)
}

loadCartToCookies() {
    let cartCookies = getCookieValue('cart');

    if (cartCookies && cartCookies !== '') {
        this.items = JSON.parse(cartCookies)
    }
}
}

let cart = new Cart();


function addToCart(event) {
const productData = event.target.getAttribute('data-product')
const product = JSON.parse(productData)
console.log(product,productData)
cart.addItem(product)
}
function getCookieValue(cookieName) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
          return decodeURIComponent(value);
      }
  }
  return null;
}
function getCartProductHtml(item) {
    return `
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex align-items-center">
          <div class="item-info">
            <h5 class="card-title fw-bold mb-2">${item.title}</h5>
            <p class=" mb-1">Ціна: <span class="fw-bold">${item.price}$</span></p>
            <p class=" mb-1">Кількість: <span class="fw-bold">${item.quantity}</span></p>
          </div>
          <div class="ms-auto">
            <button class="btn btn-danger btn-sm remove-item-btn" data-id="${item.id}">
              Видалити
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

Cart.prototype.removeItem = function (itemTitle) {
    if (this.items[itemTitle]) {
        delete this.items[itemTitle];
        this.saveCartToCookies();
        showCart(); // Обновляем отображение корзины
    }
};

function updateCartTotal() {
    const total = Object.values(cart.items).reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    cart.loadCartToCookies()
}

function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemTitle = event.target.getAttribute('data-id');
            cart.removeItem(itemTitle);
            cart.loadCartToCookies()
            updateCartTotal();
        });
    });
}

/**
 * Обновляет отображение корзины
 */
function showCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) {
        console.error('Cart container not found in DOM.');
        return;
    }

    cartContainer.innerHTML = ''; // Очищаем контейнер
    for (let key in cart.items) {
        cartContainer.innerHTML += getCartProductHtml(cart.items[key]);
    }

    updateCartTotal(); // Обновляем сумму
    setupRemoveButtons(); // Навешиваем обработчики удаления
}

// Слушаем событие загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
    showCart();
});