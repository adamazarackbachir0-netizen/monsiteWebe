function toggleMenu() {
    const menuTitles = document.querySelector('.menu-titles');
    menuTitles.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    const menuTitles = document.querySelector('.menu-titles');
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuTitles.contains(event.target) && !menuBtn.contains(event.target)) {
        menuTitles.classList.remove('active');
    }
});

function scrollToProducts() {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Chargement des produits depuis productslist.json
fetch('productslist.json')
    .then(response => response.json())
    .then(products => {
        const productsContainer = document.getElementById('products-container');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <button onclick="addToCart('${product.name}', ${parseInt(product.price)})">Add to Cart</button>;
            `;
            productsContainer.appendChild(productCard);
        }); 
        })
    .catch(error => console.error('Error loading products:', error));