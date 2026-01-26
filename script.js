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

// Liste centrale des catégories
const categories = [
    { id: 'montres-femme', label: 'Montres Femme' },
    { id: 'montres-homme', label: 'Montres Homme' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'accessoires', label: 'Accessoires' }
];

// Génère dynamiquement les boutons de filtre
function generateCategoryButtons() {
    const container = document.getElementById('category-filters');
    container.innerHTML = '';

    // Bouton "Tous"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Tous';
    allBtn.onclick = () => filterProducts('all');
    container.appendChild(allBtn);

    // Boutons par catégorie
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.label;
        btn.onclick = () => filterProducts(cat.id);
        container.appendChild(btn);
    });
}

// Fonction de filtrage des produits
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

// Chargement des produits depuis JSON et affichage
function loadProducts() {
    fetch('productslist.json')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products-container');
            productsContainer.innerHTML = '';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product';
                productCard.setAttribute('data-category', product.category);
                productCard.innerHTML = `
                    <img src="${product.url}" alt="${product.name}" style="max-width: 150px; display: block; margin-bottom: 10px;">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Prix : ${product.price}</p>
                    <button onclick="addToCart('${product.name}', ${parseInt(product.price)})">Ajouter au panier</button>
                `;
                productsContainer.appendChild(productCard);
            });

            // Affiche tous les produits au chargement
            filterProducts('all');
        })
        .catch(error => console.error('Erreur lors du chargement des produits :', error));
}

// Exemple de fonction addToCart (à adapter selon votre logique)
function addToCart(productName, price) {
    alert(`Produit ajouté au panier : ${productName} - Prix : ${price} FCfA`);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    generateCategoryButtons();
    loadProducts();
});
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
