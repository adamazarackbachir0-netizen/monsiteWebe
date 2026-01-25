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

// PANIER
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    const product = cart.find(item => item.name === name);
    if (product) product.quantity++;
    else cart.push({ name, price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price} FCFA</td>
                <td>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>${itemTotal} FCFA</td>
                <td><button onclick="removeItem(${index})">❌</button></td>
            </tr>
        `;
    });

    cartTotal.textContent = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function changeQuantity(index, value) {
    cart[index].quantity += value;
    if (cart[index].quantity <= 0) removeItem(index);
    else {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }
}

function goToCheckout() {
    if (cart.length === 0) alert("Votre panier est vide");
    else window.location.href = "checkout.html";
}

displayCart();
// FIN PANIER
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