document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the cart from localStorage or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartIcon = document.getElementById("cart-icon");
    const cartCount = document.getElementById("cart-count");
    const cartModal = document.getElementById("cart-modal");
    const closeModal = document.querySelector(".close-btn");
    const orderItemsContainer = document.getElementById("order-items");
    const totalPriceElement = document.getElementById("total-price");
    const notification = document.getElementById("notification");

    // Update cart count (number of items)
    function updateCartCount() {
        const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalQuantity > 0 ? totalQuantity : ""; // Show count or hide if empty
    }

    // Open cart modal
    cartIcon.addEventListener("click", function () {
        cartModal.style.display = "flex";
        updateCartUI(); // Update the cart UI in the modal when opened
    });

    // Close cart modal
    closeModal.addEventListener("click", function () {
        cartModal.style.display = "none";
    });

    // Update cart UI in the modal
    function updateCartUI() {
        orderItemsContainer.innerHTML = '';  // Clear existing content
        let totalPrice = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                let price = (item.price * item.quantity).toFixed(2);
                totalPrice += item.price * item.quantity;

                let itemElement = document.createElement("div");
                itemElement.classList.add("order-item");
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <p><strong>${item.name}</strong></p>
                        <p>$${item.price} x <span class="item-quantity">${item.quantity}</span></p>
                        <p>Total: $${price}</p>
                        <button class="increase-qty" data-name="${item.name}">+</button>
                        <button class="decrease-qty" data-name="${item.name}">-</button>
                        <button class="remove-item" data-name="${item.name}">Remove</button>
                    </div>
                `;
                orderItemsContainer.appendChild(itemElement);
            });
        } else {
            orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        }

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        saveCartToLocalStorage();
    }

    // Increase quantity of item in cart
    orderItemsContainer.addEventListener("click", function (event) {
        const button = event.target;
        const productName = button.getAttribute("data-name");

        if (button.classList.contains("increase-qty")) {
            const item = cart.find(product => product.name === productName);
            if (item) item.quantity += 1;
        } else if (button.classList.contains("decrease-qty")) {
            const item = cart.find(product => product.name === productName);
            if (item && item.quantity > 1) item.quantity -= 1;
        } else if (button.classList.contains("remove-item")) {
            cart = cart.filter(item => item.name !== productName);
        }

        updateCartCount();  // Update the cart count
        updateCartUI();  // Re-render the cart modal
    });

    // Add to cart functionality
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".product-card");
            const productName = productCard.querySelector("h2").textContent;
            const productPrice = parseFloat(productCard.querySelector(".price").textContent.replace("$", ""));
            const productImage = productCard.querySelector("img").src;

            // Check if the product already exists in the cart
            const existingProduct = cart.find(item => item.name === productName);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            // Save updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();  // Update the cart count in the icon

            // Show notification
            showNotification();
        });
    });

    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Function to show notification
    function showNotification() {
        notification.classList.add("show");

        // Hide notification after 3 seconds
        setTimeout(function () {
            notification.classList.remove("show");
        }, 3000);
    }

    // Initial cart count update
    updateCartCount();
});
