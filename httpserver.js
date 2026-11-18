
// Import built-in modules
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Food Menu
const foodItems = [
    {
        id: 1,
        name: "Classic Veg Burger",
        category: "Burger",
        price: 120
    },
    {
        id: 2,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 250
    },
    {
        id: 3,
        name: "French Fries",
        category: "Snacks",
        price: 100
    },
    {
        id: 4,
        name: "Cold Coffee",
        category: "Drinks",
        price: 90
    },
    {
        id: 5,
        name: "Paneer Pizza",
        category: "Pizza",
        price: 350
    }
];

// Store orders in an array
const orders = [];

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

// Helper function to serve files using FS module
function serveFile(res, fileName, contentType) {

    const filePath = path.join(__dirname, "public", fileName);

    fs.readFile(filePath, "utf8", (error, data) => {

        if (error) {
            console.error("File reading error:", error);

            res.writeHead(500, {
                "Content-Type": "text/plain"
            });

            res.end("Internal Server Error: Unable to load file.");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);

    });
}


// Create HTTP Server
const server = http.createServer((req, res) => {

    const url = req.url;

    // Route 1: Welcome Page
    if (url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Welcome to Crave!</h1>
            <p>Your favourite food, delivered fresh.</p>
            <a href="/home">Visit Our Website</a>
            <br>
            <a href="/menu">View Food Menu</a>
        `);

    }

    // Route 2: Display Food Menu
    else if (url === "/menu" && req.method === "GET") {

        sendJSON(res, 200, foodItems);

    }

    // Route 3: About Application
    else if (url === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>About Crave</h1>
            <p>
                Crave is an online food ordering application
                that allows customers to explore food items
                and place orders easily.
            </p>
        `);

    }

    // Route 4: Serve Homepage using FS Module
    else if (url === "/home" && req.method === "GET") {

        serveFile(res, "index.html", "text/html");

    }

    // Serve CSS file
    else if (url === "/style.css" && req.method === "GET") {

        serveFile(res, "style.css", "text/css");

    }

    // Serve JavaScript file
    else if (url === "/script.js" && req.method === "GET") {

        serveFile(res, "script.js", "text/javascript");

    }

    // Route 5: Place Order
    else if (url === "/place-order" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const order = JSON.parse(body);

                const { orderId, customerName, itemName, quantity } = order;

                // Validate required fields
                if (
                    orderId === undefined ||
                    typeof customerName !== "string" ||
                    !customerName.trim() ||
                    typeof itemName !== "string" ||
                    !itemName.trim() ||
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {

                    sendJSON(res, 400, {
                        message: "Invalid order details. All fields are required."
                    });

                    return;
                }

                // Add order to array
                orders.push({
                    orderId,
                    customerName: customerName.trim(),
                    itemName: itemName.trim(),
                    quantity
                });

                sendJSON(res, 201, {
                    message: "Order placed successfully!",
                    order: orders[orders.length - 1]
                });

            } catch (error) {

                sendJSON(res, 400, {
                    message: "Invalid JSON request body."
                });

            }

        });

    }

    // Handle invalid routes
    else {

        sendJSON(res, 404, {
            message: "404 - Route Not Found"
        });

    }

});


// Start Server on Port 3000
server.listen(3000, () => {

    console.log("HTTP Server running at http://localhost:3000");

});
