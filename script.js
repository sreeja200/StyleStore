// Product data
const products = [
    {
        id: 1,
        name: "Classic White Sneakers",
        price: 79.99,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 2,
        name: "Denim Jacket",
        price: 89.99,
        image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 59.99,
        image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 4,
        name: "Leather Backpack",
        price: 129.99,
        image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 5,
        name: "Sunglasses",
        price: 49.99,
        image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: 6,
        name: "Watch",
        price: 199.99,
        image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
];

// Cart state
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartIcon = document.getElementById('cartIcon');
const cartElement = document.getElementById('cart');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const modal = document.getElementById('modal');
const checkoutForm = document.getElementById('checkoutForm');

// Render products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCart();
}

// Toggle cart
cartIcon.addEventListener('click', () => {
    cartElement.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartElement.classList.remove('open');
});

// Checkout
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    modal.classList.add('open');
    cartElement.classList.remove('open');
});

// Handle checkout form
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
    cart = [];
    updateCart();
    modal.classList.remove('open');
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('open');
    }
});

// Initialize
renderProducts();

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    contactForm.reset();
});

// Add active class to navigation links
const navLinks = document.querySelectorAll('.nav-items a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show your own install button (optional)
  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install StyleStore';
  installBtn.className = 'install-button';
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed');
      }
      deferredPrompt = null;
    });
  });
});
