function getProductHtml(product) {
  return `
    <div class="card" style="width: 18rem;">
    <img src=${product.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text">${product.description}</p>
      <a href="#" class="btn btn-primary">${product.price}$</a>

<button class="button cart-btn"  data-product='${JSON.stringify(product)}'>
 buy
</button>

    </div>
  </div>
  `
}

async function getProducts() {
  const response = await fetch('products.json')
  return await response.json()
}

getProducts().then(function (products) {
  const productsContainer = document.querySelector('.catalog')

  if (products) {
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
const themeToggle = document.getElementById('themeToggle');
const body = document.querySelector("body")
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});



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
      <div style="border: 1px solid black">
          <p>${item.title}</p>
          <p>${item.price}</p>
          <p>${item.quantity}</p>
      </div>
`
}

function showCart() {
  const cartContainer = document.querySelector('.cart-container');
  if (!cartContainer) {
      console.error('Cart container not found in DOM.');
      return;
  }
  cartContainer.innerHTML = '';
  for (let key in cart.items) {
      cartContainer.innerHTML += getCartProductHtml(cart.items[key]);
  }

  cart.loadCartToCookies(); }

  window.addEventListener('DOMContentLoaded', () => {
    showCart();
});