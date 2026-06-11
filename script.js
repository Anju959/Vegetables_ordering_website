/**
 * Farm to Home - Vegetable Selling Website
 * Main JavaScript Application Logic
 */

// --- 1. PRODUCT DATASET ---
const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "nightshades",
    price: 40,
    unit: "kg",
    description: "Plump, red, and juicy vine-ripened tomatoes. Rich in Lycopene and perfect for salads, sauces, and curries.",
    image: "assets/tomato.png",
    rating: 4.8,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Organic Potatoes",
    category: "roots",
    price: 30,
    unit: "kg",
    description: "Earthy, freshly dug organic potatoes. Highly versatile for baking, boiling, mashing, or roasting.",
    image: "assets/potato.png",
    rating: 4.5,
    badge: "Daily Harvest"
  },
  {
    id: 3,
    name: "Red Onions",
    category: "roots",
    price: 35,
    unit: "kg",
    description: "Crispy and sharp local red onions. Essential base ingredient that adds aroma and depth to every culinary dish.",
    image: "assets/onion.png",
    rating: 4.6,
    badge: ""
  },
  {
    id: 4,
    name: "Sweet Carrots",
    category: "roots",
    price: 60,
    unit: "kg",
    description: "Crisp and vibrant orange carrots. Sweet tasting, packed with Vitamin A, great for snacking, soups, or juice.",
    image: "assets/carrot.png",
    rating: 4.9,
    badge: "Organic"
  },
  {
    id: 5,
    name: "Fresh Brinjal",
    category: "nightshades",
    price: 45,
    unit: "kg",
    description: "Deep purple, glossy eggplants. Soft meaty texture, perfect for traditional roasting, baking, or stuffing.",
    image: "assets/brinjal.png",
    rating: 4.3,
    badge: ""
  },
  {
    id: 6,
    name: "Lady's Finger",
    category: "vegetables",
    price: 45,
    unit: "kg",
    description: "Fresh, tender lady's finger (okra) pods, perfect for stews, curries, and fries. Rich in fiber and vitamins.",
    image: "assets/ladys_finger.jpg",
    rating: 4.7,
    badge: "Fresh"
  },
  {
    id: 7,
    name: "Tender Spinach",
    category: "greens",
    price: 25,
    unit: "bunch",
    description: "Freshly harvested, iron-rich spinach greens. Clean, crispy leaves, wonderful for sauteing, soups, or green smoothies.",
    image: "assets/spinach.png",
    rating: 4.8,
    badge: "Superfood"
  },
  {
    id: 8,
    name: "Green Broccoli",
    category: "gourds",
    price: 120,
    unit: "kg",
    description: "Nutrient-dense green broccoli heads. Firm stalks and bushy florets packed with vitamins, ready for steaming or roasting.",
    image: "assets/broccoli.png",
    rating: 4.7,
    badge: "Premium"
  }
];

// --- 2. STATE MANAGEMENT ---
let cart = [];
let activeCategory = "all";
let searchTerm = "";

// --- 3. DOM ELEMENTS ---
const header = document.getElementById("header");
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const categoriesContainer = document.getElementById("filter-categories-container");

// Cart Elements
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsBody = document.getElementById("cart-items-body");
const cartBadgeCount = document.getElementById("cart-badge-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartDeliveryEl = document.getElementById("cart-delivery");
const cartTotalEl = document.getElementById("cart-total");

// Checkout Modal Elements
const checkoutModal = document.getElementById("checkout-modal");
const checkoutForm = document.getElementById("checkout-form");
const checkoutTriggerBtn = document.getElementById("checkout-trigger-btn");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const miniSummaryItems = document.getElementById("mini-summary-items");
const checkoutTotalPayable = document.getElementById("checkout-total-payable");

// Success Modal Elements
const successModal = document.getElementById("success-modal");
const successTrackingId = document.getElementById("success-tracking-id");
const successCloseBtn = document.getElementById("success-close-btn");

// Mobile Nav Menu Elements
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// Toast Notification Container
const toastContainer = document.getElementById("toast-container");

// --- 4. APP INITIALIZATION & LOCAL STORAGE ---
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
  renderProducts();
  setupEventListeners();
  updateHeaderScroll();
});

// Load cart from LocalStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("f2h_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartUI();
    } catch (e) {
      cart = [];
      localStorage.removeItem("f2h_cart");
    }
  }
}

// Save cart to LocalStorage
function saveCartToLocalStorage() {
  localStorage.setItem("f2h_cart", JSON.stringify(cart));
}

// --- 5. RENDER PRODUCTS GRID ---
function renderProducts() {
  productsGrid.innerHTML = "";
  
  // Filter products based on search term & active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Empty state check
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-products">
        <i class="fa-regular fa-face-frown"></i>
        <h3>No vegetables found</h3>
        <p>Try searching for something else or browse another category.</p>
      </div>
    `;
    return;
  }

  // Render cards
  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Build stars HTML
    let starsHtml = "";
    const fullStars = Math.floor(product.rating);
    const hasHalf = product.rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i === fullStars + 1 && hasHalf) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    card.innerHTML = `
      <div class="product-img-wrapper">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-cat">${product.category}</span>
          <div class="product-rating">
            ${starsHtml}
          </div>
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">₹${product.price} <span>/ ${product.unit}</span></div>
          <button class="add-cart-btn" data-id="${product.id}" aria-label="Add ${product.name} to basket">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;

    // Hook add-to-cart click
    const addBtn = card.querySelector(".add-cart-btn");
    addBtn.addEventListener("click", () => {
      addToCart(product.id);
    });

    productsGrid.appendChild(card);
  });
}

// --- 6. CART OPERATIONS ---
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCartToLocalStorage();
  updateCartUI();
  showToast(`${product.name} added to basket!`, "add");
}

function updateQuantity(productId, change) {
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCartToLocalStorage();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  const product = products.find(p => p.id === productId);
  const name = product ? product.name : "Vegetable";
  
  cart = cart.filter(item => item.id !== productId);
  
  saveCartToLocalStorage();
  updateCartUI();
  showToast(`${name} removed from basket!`, "remove");
}

function calculateTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  // Delivery configuration: Free delivery above ₹400, else ₹40. No delivery fee if cart is empty.
  let deliveryFee = 0;
  if (subtotal > 0) {
    deliveryFee = subtotal >= 400 ? 0 : 40;
  }

  const grandTotal = subtotal + deliveryFee;

  return { subtotal, deliveryFee, grandTotal };
}

// Update Cart Badge, Drawer HTML, Footer Pricing details
function updateCartUI() {
  // 1. Badge Count
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartBadgeCount.innerText = totalItemsCount;
  
  // Play tiny scaling pop animation on badge update
  cartBadgeCount.classList.remove("pop");
  void cartBadgeCount.offsetWidth; // trigger reflow
  cartBadgeCount.classList.add("pop");

  // 2. Cart Drawer Body Items
  if (cart.length === 0) {
    cartItemsBody.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <h3>Your basket is empty</h3>
        <p>Browse our fresh categories and add items to your cart.</p>
        <button class="btn btn-secondary" id="cart-continue-shopping-btn">Explore Crops</button>
      </div>
    `;
    
    // Connect "Explore Crops" trigger button
    const exploreBtn = cartItemsBody.querySelector("#cart-continue-shopping-btn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        closeCartDrawer();
        window.location.hash = "#products";
      });
    }

    // Disable checkout trigger
    checkoutTriggerBtn.disabled = true;
    checkoutTriggerBtn.style.opacity = "0.5";
    checkoutTriggerBtn.style.cursor = "not-allowed";
  } else {
    checkoutTriggerBtn.disabled = false;
    checkoutTriggerBtn.style.opacity = "1";
    checkoutTriggerBtn.style.cursor = "pointer";

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "cart-items-list";

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const itemTotal = product.price * item.quantity;
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <div class="cart-item-img-wrapper">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price">₹${product.price} / ${product.unit}</div>
          <div class="cart-item-actions">
            <div class="quantity-selector">
              <button class="qty-btn minus" data-id="${product.id}" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn plus" data-id="${product.id}" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="remove-item-btn" data-id="${product.id}" aria-label="Remove item from basket"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;

      // Event listeners for quantites
      itemEl.querySelector(".qty-btn.minus").addEventListener("click", () => updateQuantity(product.id, -1));
      itemEl.querySelector(".qty-btn.plus").addEventListener("click", () => updateQuantity(product.id, 1));
      itemEl.querySelector(".remove-item-btn").addEventListener("click", () => removeFromCart(product.id));

      itemsContainer.appendChild(itemEl);
    });

    cartItemsBody.innerHTML = "";
    cartItemsBody.appendChild(itemsContainer);
  }

  // 3. Price Summaries
  const totals = calculateTotals();
  cartSubtotalEl.innerText = `₹${totals.subtotal.toFixed(2)}`;
  
  if (totals.subtotal > 0 && totals.deliveryFee === 0) {
    cartDeliveryEl.innerHTML = `<span style="color: var(--primary-light); font-weight: 600;">FREE</span>`;
  } else {
    cartDeliveryEl.innerText = `₹${totals.deliveryFee.toFixed(2)}`;
  }
  
  cartTotalEl.innerText = `₹${totals.grandTotal.toFixed(2)}`;
  
  // Checkout Modal Summaries
  checkoutTotalPayable.innerText = `₹${totals.grandTotal.toFixed(2)}`;
}

// --- 7. MODALS AND DRAWER UI TOGGLES ---
function openCartDrawer() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // disable background scroll
}

function closeCartDrawer() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = ""; // enable background scroll
}

function openCheckoutModal() {
  closeCartDrawer();
  
  // Populate checkout modal summary list
  miniSummaryItems.innerHTML = "";
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "summary-item-mini-row";
    row.innerHTML = `
      <span>${product.name} (x${item.quantity})</span>
      <span>₹${(product.price * item.quantity).toFixed(2)}</span>
    `;
    miniSummaryItems.appendChild(row);
  });
  
  // Add delivery row to mini summary
  const totals = calculateTotals();
  const deliveryRow = document.createElement("div");
  deliveryRow.className = "summary-item-mini-row";
  deliveryRow.style.color = "var(--text-muted)";
  deliveryRow.style.fontSize = "0.8rem";
  deliveryRow.innerHTML = `
    <span>Delivery Fee</span>
    <span>${totals.deliveryFee === 0 ? "FREE" : `₹${totals.deliveryFee.toFixed(2)}`}</span>
  `;
  miniSummaryItems.appendChild(deliveryRow);

  checkoutModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("active");
  document.body.style.overflow = "";
}

function openSuccessModal(orderId) {
  successTrackingId.innerText = orderId;
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Header background styling when scrolled
function updateHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// --- 8. TOAST NOTIFICATIONS ---
function showToast(message, type = "add") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "remove" ? "toast-remove" : ""}`;
  
  const icon = type === "remove" ? '<i class="fa-solid fa-trash-can"></i>' : '<i class="fa-solid fa-basket-shopping"></i>';
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Set timeout to slide out and remove toast
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 2500);
}

// --- 9. EVENT LISTENERS SETUP ---
function setupEventListeners() {
  // Scroll Listener
  window.addEventListener("scroll", updateHeaderScroll);
  
  // Navigation active highlighting during scroll
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 200;
    
    // Loop navigation links
    navLinks.forEach(link => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        const section = document.querySelector(targetId);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
          }
        }
      }
    });
  });

  // Cart open/close triggers
  cartBtn.addEventListener("click", openCartDrawer);
  closeCartBtn.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);

  // Search filter crops
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });

  // Categories filter button click
  categoriesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // Remove active class from other buttons
      categoriesContainer.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      // Add to clicked
      e.target.classList.add("active");
      activeCategory = e.target.dataset.category;
      renderProducts();
    }
  });

  // Checkout modal triggers
  checkoutTriggerBtn.addEventListener("click", openCheckoutModal);
  closeCheckoutBtn.addEventListener("click", closeCheckoutModal);
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Success modal triggers
  successCloseBtn.addEventListener("click", () => {
    closeSuccessModal();
  });
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeSuccessModal();
  });

  // Mobile Menu triggers
  menuToggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = menuToggleBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars-staggered";
    }
  });

  // Close mobile nav menu when selecting a navigation link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const icon = menuToggleBtn.querySelector("i");
      icon.className = "fa-solid fa-bars-staggered";
    });
  });

  // Checkout Form Submission handler
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Gather data (simulate storage/delivery backend log)
    const name = document.getElementById("checkout-name").value;
    const phone = document.getElementById("checkout-phone").value;
    const address = document.getElementById("checkout-address").value;
    
    // Create random order key
    const orderId = `F2H-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log("Order Placed Successfully:", {
      orderId,
      customer: { name, phone, address },
      items: cart,
      totals: calculateTotals()
    });

    // 2. Clear state
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();

    // 3. Clear form inputs
    checkoutForm.reset();

    // 4. Modal transitions
    closeCheckoutModal();
    openSuccessModal(orderId);
  });

  // Farmer Feedback Form Submission handler
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    console.log("Farmer Feedback Message received:", { name, email, message });

    // Toast notification
    showToast("Message sent to Farmer David!", "add");
    contactForm.reset();
  });

  // Farmer Newsletter Form Submission handler
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector(".newsletter-input");
    console.log("Newsletter subscription:", input.value);
    showToast("Successfully joined updates newsletter!", "add");
    newsletterForm.reset();
  });
}
