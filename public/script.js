
// Food Menu Data
const foodItems = [
    {
        id: 1,
        name: "Classic Veg Burger",
        category: "Burger",
        price: 120,
        description: "Fresh vegetables with a delicious sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 2,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 250,
        description: "Loaded with cheese and fresh toppings.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 3,
        name: "French Fries",
        category: "Snacks",
        price: 100,
        description: "Crispy golden potato fries.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 4,
        name: "Cold Coffee",
        category: "Drinks",
        price: 90,
        description: "Refreshing chilled creamy coffee.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    },
    {
        id: 5,
        name: "Paneer Pizza",
        category: "Pizza",
        price: 350,
        description: "Delicious paneer with cheesy toppings.",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500"
    },
    {
        id: 6,
        name: "Paneer Burger",
        category: "Burger",
        price: 150,
        description: "Juicy Paneer patty with fresh lettuce.",
        image: "https://c.ndtvimg.com/2022-06/gp4k2jro_burgers_625x300_20_June_22.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886"
    },
    {
        id: 7,
        name: "Chocolate Shake",
        category: "Drinks",
        price: 130,
        description: "Rich and creamy chocolate shake.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500"
    },
    {
        id: 8,
        name: "Cheese Sandwich",
        category: "Snacks",
        price: 110,
        description: "Toasted sandwich with melted cheese.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: 9,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 220,
        description: "Classic pizza with tomato and mozzarella.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"
    }
];


// Shopping Cart
let cart = [];


// DOM Elements
const foodContainer = document.getElementById("foodContainer");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");


// Display Food Items
function displayFoodItems(items) {

    if (items.length === 0) {
        foodContainer.innerHTML = "<p>No food items found.</p>";
        return;
    }

    foodContainer.innerHTML = items.map(item => `
        <div class="food-card reveal">

            <img src="${item.image}" alt="${item.name}">

            <div class="food-info">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <div class="food-bottom">

                    <span class="food-price">
                        ₹${item.price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${item.id})">
                        + Add
                    </button>

                </div>

            </div>

        </div>
    `).join("");
}


// Add Item to Cart
function addToCart(id) {

    const food = foodItems.find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    updateCart();

}


// Display Cart
function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price * item.quantity}</p>
            </div>

            <div class="cart-quantity">

                <button onclick="changeQuantity(${item.id}, -1)">
                    -
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})">
                ✕
            </button>
        `;

        cartItems.appendChild(cartItem);

    });

    // Calculate Total Items
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    // Calculate Total Price
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalItems;

    cartTotal.textContent = totalPrice;

}


// Change Item Quantity
function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
    }

}


// Remove Item from Cart
function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

}


// Open Cart
cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("show");
});


// Close Cart
closeCart.addEventListener("click", () => {
    cartOverlay.classList.remove("show");
});


// Close Cart when clicking outside
cartOverlay.addEventListener("click", (event) => {

    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("show");
    }

});


// Search Food
searchInput.addEventListener("input", () => {

    const searchValue = searchInput.value.toLowerCase();

    const filteredItems = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchValue)
    );

    displayFoodItems(filteredItems);

});


// Filter Food Categories
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.dataset.category;

        const filteredItems = category === "All"
            ? foodItems
            : foodItems.filter(item =>
                item.category === category
            );

        displayFoodItems(filteredItems);

        searchInput.value = "";

    });

});


// Checkout: send each cart item to the Express API
async function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty. Add something delicious first.", "error");
        return;
    }

    const customerName = prompt("Enter your name to place the order:");
    if (!customerName || !customerName.trim()) {
        showToast("Please enter your name to continue.", "error");
        return;
    }

    const originalButtonText = checkoutButton.textContent;
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Placing order...";

    try {
        const placedOrders = [];

        for (const item of cart) {
            const order = {
                orderId: Date.now() + Math.floor(Math.random() * 100000),
                customerName: customerName.trim(),
                itemName: item.name,
                quantity: item.quantity,
                status: "Pending",
                totalAmount: item.price * item.quantity
            };

            const response = await fetch("http://localhost:4000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || `Order request failed (${response.status}).`);
            }

            placedOrders.push(result.order || order);
        }

        const orderTotal = placedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        cart = [];
        updateCart();
        cartOverlay.classList.remove("show");
        showToast(`Order placed successfully! Total: ₹${orderTotal}`, "success");
    } catch (error) {
        console.error("Checkout error:", error);
        showToast(
            error.message.includes("Failed to fetch")
                ? "Cannot reach the order server. Make sure expressApp.js is running on port 4000."
                : error.message,
            "error"
        );
    } finally {
        checkoutButton.disabled = false;
        checkoutButton.textContent = originalButtonText;
    }
}

// Lightweight in-page feedback instead of browser alerts
function showToast(message, type = "success") {
    let toast = document.getElementById("craveToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "craveToast";
        toast.className = "crave-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `crave-toast ${type} visible`;

    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.remove("visible");
    }, 3600);
}

checkoutButton.addEventListener("click", checkout);

// Close cart with Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cartOverlay.classList.remove("show");
});

// Reveal sections and cards smoothly as they enter the viewport
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

function observeRevealElements() {
    document.querySelectorAll(".reveal:not(.revealed)").forEach(element => {
        revealObserver.observe(element);
    });
}

// Observe static sections and newly rendered menu cards
document.querySelectorAll(".hero-content, .hero-image, .categories, .menu-section, .about")
    .forEach(element => element.classList.add("reveal"));

observeRevealElements();

const menuObserver = new MutationObserver(observeRevealElements);
menuObserver.observe(foodContainer, { childList: true });

// Initial Display
displayFoodItems(foodItems);

updateCart();
document.getElementById("checkoutButton").addEventListener("click", checkout);