document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const totalPriceElement = document.getElementById("total-price");
    let totalPrice = 0;

    // Populate order summary and add "edit" button to each item
    if (cart.length > 0) {
        cart.forEach(item => {
            let quantity = item.quantity ? item.quantity : 1;
            let price = item.price ? (item.price * quantity).toFixed(2) : "0.00";
            
            let itemElement = document.createElement("div");
            itemElement.classList.add("order-item");
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong> x${quantity}</p>
                <p>$${price}</p>
                <button class="edit-item" data-name="${item.name}">Edit</button>  <!-- Add Edit Button -->
            `;
            orderItemsContainer.appendChild(itemElement);
            totalPrice += item.price * quantity;
        });
    } else {
        orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }

    // Display total price
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

    // Handle form submission
    document.querySelector(".checkout-form").addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Place Order button clicked");
        
        const userEmail = document.getElementById("email").value.trim();
        const paymentMethod = document.getElementById("payment").value;
        
        if (!userEmail) {
            alert("Please enter a valid email address.");
            return;
        }
        
        // Generate order summary
        let orderDetails = cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n");
        let emailParams = {
            to_email: userEmail,
            order_details: orderDetails,
            total_price: totalPrice.toFixed(2)
        };
        
        console.log("Sending email with params:", emailParams);
        
        // Check if EmailJS is available
        if (typeof emailjs === "undefined") {
            alert("EmailJS not loaded. Please check your script inclusion.");
            return;
        }

        // Send email via EmailJS
        emailjs.send("service_v5dkktd", "template_8vuf9v3", emailParams)
        .then(response => {
            console.log("Email sent successfully:", response);
            alert("Order placed! Redirecting to payment...");
            
            localStorage.removeItem("cart"); // Clear cart after order
            
            if (paymentMethod === "nayapay") {
                // Redirect user to NayaPay Payment Gateway
                const paymentUrl = `https://www.nayapay.com/pay?amount=${totalPrice.toFixed(2)}&currency=PKR&email=${encodeURIComponent(userEmail)}`;
                window.location.href = paymentUrl;
            } else if (paymentMethod === "creditcard") {
                // Redirect to Stripe Checkout (Replace with your Stripe session URL)
                fetch("/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: totalPrice.toFixed(2), email: userEmail })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        alert("Error processing payment");
                    }
                })
                .catch(error => console.error("Stripe Error:", error));
            }
        })
        .catch(error => {
            alert("Error sending email receipt.");
            console.error("EmailJS Error:", error);
        });
    });

    // Handle "Edit" button clicks
    document.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("edit-item")) {
            const itemName = event.target.getAttribute("data-name");
            const item = cart.find(item => item.name === itemName);

            if (item) {
                let newQuantity = prompt(`Edit quantity for ${item.name}:`, item.quantity || 1);

                if (newQuantity && !isNaN(newQuantity) && newQuantity > 0) {
                    item.quantity = parseInt(newQuantity);
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // Re-render the order items and total price
                    orderItemsContainer.innerHTML = "";
                    totalPrice = 0;
                    cart.forEach(item => {
                        let quantity = item.quantity ? item.quantity : 1;
                        let price = item.price ? (item.price * quantity).toFixed(2) : "0.00";
                        
                        let itemElement = document.createElement("div");
                        itemElement.classList.add("order-item");
                        itemElement.innerHTML = `
                            <p><strong>${item.name}</strong> x${quantity}</p>
                            <p>$${price}</p>
                            <button class="edit-item" data-name="${item.name}">Edit</button>  <!-- Edit Button -->
                        `;
                        orderItemsContainer.appendChild(itemElement);
                        totalPrice += item.price * quantity;
                    });

                    // Update the total price display
                    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
                } else {
                    alert("Invalid quantity entered.");
                }
            }
        }
    });
});
