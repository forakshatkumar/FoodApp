
import express from "express";

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

let orders = [
    {
        orderId: 1,
        customerName: "Aarav Sharma",
        itemName: "Veg Burger",
        quantity: 2,
        status: "Pending",
        totalAmount: 240
    },
    {
        orderId: 2,
        customerName: "Priya Singh",
        itemName: "Paneer Pizza",
        quantity: 1,
        status: "Preparing",
        totalAmount: 350
    },
    {
        orderId: 3,
        customerName: "Rahul Verma",
        itemName: "French Fries",
        quantity: 3,
        status: "Delivered",
        totalAmount: 300
    }
];


// Validate Order Details
function isValidOrder(order) {
    return (
        Number.isInteger(order.orderId) &&
        order.orderId > 0 &&
        typeof order.customerName === "string" &&
        order.customerName.trim() !== "" &&
        typeof order.itemName === "string" &&
        order.itemName.trim() !== "" &&
        Number.isInteger(order.quantity) &&
        order.quantity > 0 &&
        typeof order.status === "string" &&
        order.status.trim() !== "" &&
        typeof order.totalAmount === "number" &&
        Number.isFinite(order.totalAmount) &&
        order.totalAmount >= 0
    );
}


// GET: Retrieve All Orders
app.get("/orders", (req, res) => {

    res.status(200).json({
        message: "All food orders retrieved successfully",
        orders: orders
    });

});


// GET: Retrieve Order By ID
app.get("/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const order = orders.find(
        order => order.orderId === orderId
    );

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    res.status(200).json({
        message: "Order retrieved successfully",
        order: order
    });

});


// POST: Add New Order
app.post("/orders", (req, res) => {

    const newOrder = req.body;

    if (!isValidOrder(newOrder)) {
        return res.status(400).json({
            message: "Invalid order details. Please provide all required fields."
        });
    }

    const existingOrder = orders.find(
        order => order.orderId === newOrder.orderId
    );

    if (existingOrder) {
        return res.status(409).json({
            message: "Order ID already exists"
        });
    }

    const order = {
        orderId: newOrder.orderId,
        customerName: newOrder.customerName.trim(),
        itemName: newOrder.itemName.trim(),
        quantity: newOrder.quantity,
        status: newOrder.status.trim(),
        totalAmount: newOrder.totalAmount
    };

    orders.push(order);

    res.status(201).json({
        message: "Order placed successfully",
        order: order
    });

});


// PUT: Update Existing Order
app.put("/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const index = orders.findIndex(
        order => order.orderId === orderId
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    const updatedOrder = {
        ...orders[index],
        ...req.body,
        orderId: orders[index].orderId
    };

    if (!isValidOrder(updatedOrder)) {
        return res.status(400).json({
            message: "Invalid order details"
        });
    }

    updatedOrder.customerName = updatedOrder.customerName.trim();
    updatedOrder.itemName = updatedOrder.itemName.trim();
    updatedOrder.status = updatedOrder.status.trim();

    orders[index] = updatedOrder;

    res.status(200).json({
        message: "Order updated successfully",
        order: orders[index]
    });

});


// DELETE: Delete Existing Order
app.delete("/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const index = orders.findIndex(
        order => order.orderId === orderId
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    const deletedOrder = orders.splice(index, 1);

    res.status(200).json({
        message: "Order deleted successfully",
        order: deletedOrder[0]
    });

});


// Handle Invalid JSON
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON request body"
        });
    }

    next(err);

});


// Handle Invalid Routes
app.use((req, res) => {

    res.status(404).json({
        message: "404 - API Route Not Found"
    });

});


// Start Express Server
app.listen(4000, () => {

    console.log("Express Server running at http://localhost:4000");

});
