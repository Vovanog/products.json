function getProductHtml(product) {
  return `
    <div class="card" style="width: 18rem;">
    <img src=${product.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text">${product.description}</p>
      <a href="#" class="btn btn-primary">${product.price}$</a>
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
})
const themeToggle = document.getElementById('themeToggle');
const body = document.querySelector("body")
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});