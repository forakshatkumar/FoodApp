
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
        name: "Chicken Burger",
        category: "Burger",
        price: 180,
        description: "Juicy chicken patty with fresh lettuce.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=500"
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
        <div class="food-card">

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


// Checkout (Backend integration will be added later)
checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Your cart is ready! Order placement will be connected to the Express API in a later step.");

});


// Initial Display
displayFoodItems(foodItems);

updateCart();
