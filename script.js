function toggleMenu() {
    filterProducts('all');
    
   document.querySelector('.menu-title[href="#"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html'; // ou '/'
});
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
    const productsSection = document.getElementById("products");
    // Affiche la section produits si elle est cachée
    if (productsSection.style.display === 'none' || productsSection.style.display === '') {
        productsSection.style.display = 'block';
    }
    productsSection.scrollIntoView({ behavior: "smooth" });
}

function filterProducts(category) {
    const products = document.querySelectorAll('#products-container .product');

    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
}

// Chargement des produits depuis productslist.json
fetch('productslist.json')
    .then(response => response.json())
    .then(products => {
        const productsContainer = document.getElementById('products-container');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product'; // classe cohérente avec le filtre
            productCard.setAttribute('data-category', product.category); // ajout catégorie
            productCard.innerHTML = `
                <img src="${product.url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <button onclick="addToCart('${product.name}', ${parseInt(product.price)})">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
        // Affiche tous les produits au chargement
        filterProducts('all');
    })
    .catch(error => console.error('Error loading products:', error));
