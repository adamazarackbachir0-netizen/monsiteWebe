// Fonction pour basculer l'affichage du menu et filtrer tous les produits
function toggleMenu() {
    filterProducts('all');

    const accueilLink = document.querySelector('.menu-title[href="#"]');
    if (accueilLink) {
        accueilLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html'; // ou '/'
        });
    }

    const menuTitles = document.querySelector('.menu-titles');
    menuTitles.classList.toggle('active');
}

// Fermer le menu si clic en dehors
document.addEventListener('click', function(event) {
    const menuTitles = document.querySelector('.menu-titles');
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuTitles.contains(event.target) && !menuBtn.contains(event.target)) {
        menuTitles.classList.remove('active');
    }
});

// Liste centrale des catégories
const categories = [
    { id: 'montres-femme', label: 'Montres Femme' },
    { id: 'montres-homme', label: 'Montres Homme' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'accessoires', label: 'Accessoires' }
];

// Génère dynamiquement les boutons de filtre dans #category-filters
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

// Filtrage des produits affichés selon la catégorie
function filterProducts(category) {
    console.log("Filtrage catégorie:", category); // Debug

    const products = document.querySelectorAll('#products-container .product');
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
}

// Chargement des produits depuis productslist.json et affichage
function loadProducts() {
    fetch('productslist.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
            return response.json();
        })
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

// Exemple simple d'ajout au panier (à adapter selon votre logique)
function addToCart(productName, price) {
    alert(`Produit ajouté au panier : ${productName} - Prix : ${price} FCfA`);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    generateCategoryButtons();
    loadProducts();

    const accueilLink = document.querySelector('.menu-title[href="#"]');
    if (accueilLink) {
        accueilLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html'; // ou '/'
        });
    }
});
