// Configuration WhatsApp
const WHATSAPP_NUMBERS = [
    '+23566418962',
];

let cart = [];

// Charger le panier depuis localStorage au démarrage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('royalShoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Sauvegarder le panier dans localStorage
function saveCartToStorage() {
    localStorage.setItem('royalShoppingCart', JSON.stringify(cart));
}

let products = [];

// Navigation entre sections
function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = ['accueil', 'products', 'cart', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Fermer le menu mobile
    const menuNav = document.getElementById('menuNav');
    if (menuNav) {
        menuNav.classList.remove('active');
    }

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle menu mobile
function toggleMenu() {
    const menuNav = document.getElementById('menuNav');
    menuNav.classList.toggle('active');
}

// Fermer le menu si clic en dehors
document.addEventListener('click', function(event) {
    const menuNav = document.getElementById('menuNav');
    const menuBtn = document.getElementById('menuBtn');
    
    if (menuNav && menuBtn) {
        if (!menuNav.contains(event.target) && !menuBtn.contains(event.target)) {
            menuNav.classList.remove('active');
        }
    }
});

// Filtrer les produits par catégorie
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Mettre à jour les boutons actifs
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((category === 'all' && btn.textContent === 'Tous') ||
            btn.textContent.toLowerCase().includes(category.replace('-', ' '))) {
            btn.classList.add('active');
        }
    });

    // Filtrer les produits
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Charger et afficher les produits
function loadProducts() {
    fetch('productslist.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des produits');
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => {
            console.error('Erreur:', error);
            const container = document.getElementById('productsContainer');
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; grid-column: 1/-1;">
                    <p style="color: #666; font-size: 18px;">Erreur lors du chargement des produits.</p>
                    <button class="hero-btn" onclick="loadProducts()" style="margin-top: 20px;">Réessayer</button>
                </div>
            `;
        });
}

// Afficher les produits
function displayProducts(productsToDisplay) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);

        const stockStatus = product.in_stock 
            ? '<span class="stock-status in-stock">✓ En stock</span>'
            : '<span class="stock-status out-of-stock">✗ Rupture de stock</span>';

        // Extraire le prix numérique
        const priceValue = parseInt(product.price.replace(/\D/g, ''));

        productCard.innerHTML = `
            <img src="${product.url}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/280x250?text=Image+non+disponible'">
            <span id="total-picture">1/${product.url.length}</span>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${stockStatus}
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="add-to-cart-btn" 
                            onclick="addToCart(${product.product_id})" 
                            ${!product.in_stock ? 'disabled' : ''}>
                        ${product.in_stock ? '🛒 Ajouter' : 'Indisponible'}
                    </button>
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.product_id === productId);
    if (!product || !product.in_stock) return;

    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.product_id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product_id: product.product_id,
            name: product.name,
            price: parseInt(product.price.replace(/\D/g, '')),
            image: product.url,
            quantity: 1
        });
        
    }

    saveCartToStorage();
    updateCartUI();
    showNotification('Produit ajouté au panier ! 🎉');
}

// Mettre à jour l'interface du panier
function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    // Mettre à jour le badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartItems.style.display = 'block';
        cartSummary.style.display = 'block';
        displayCartItems();
        updateCartSummary();
    }
}

// Afficher les articles du panier
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=Image'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} FCFA</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.product_id})">Retirer</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Mettre à jour la quantité d'un article
function updateQuantity(productId, change) {
    const item = cart.find(i => i.product_id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartUI();
    }
}

// Retirer un article du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCartToStorage();
    updateCartUI();
    showNotification('Produit retiré du panier');
}

// Vider le panier
function clearCart() {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        showNotification('Panier vidé');
    }
}

// Mettre à jour le résumé du panier
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString()} FCFA`;
}

// Envoyer la commande sur WhatsApp
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }

    // Créer le message de commande
    let message = '*NOUVELLE COMMANDE - Royal Shopping*\n\n';
    message += '*Détails de la commande:*\n';
    message += '━━━━━━━━━━━━━━━━━━\n\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   • Prix unitaire: ${item.price} FCFA\n`;
        message += `   • Quantité: ${item.quantity}\n`;
        message += `   • Sous-total: ${(item.price * item.quantity).toLocaleString()} FCFA\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━\n';
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    message += `*Nombre total d'articles:* ${totalItems}\n`;
    message += `*TOTAL: ${totalPrice.toLocaleString()} FCFA*\n\n`;
    message += 'Merci de confirmer ma commande !';

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Créer le lien WhatsApp avec le premier numéro
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBERS[0].replace(/\s+/g, '')}?text=${encodedMessage}`;

    // Ouvrir WhatsApp
    window.open(whatsappURL, '_blank');

    // Optionnel: Vider le panier après envoi
    setTimeout(() => {
        if (confirm('Votre commande a été envoyée ! Voulez-vous vider votre panier ?')) {
            clearCart();
        }
    }, 1000);
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    // Ajouter l'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Retirer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCartFromStorage();
    
    // Afficher la section accueil par défaut
    showSection('accueil');

    // Gérer les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            if (section) {
                showSection(section);
            }
        });
    });
});