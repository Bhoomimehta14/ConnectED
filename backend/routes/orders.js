const express = require('express');
const router = express.Router();

// In-memory order storage (replace with database in production)
let orders = new Map();
let orderCounter = 1;

// Menu items
const menuItems = {
    meals: [
        { id: 'M1', name: 'Veg Thali', price: 60, prepTime: 5, category: 'regular' },
        { id: 'M2', name: 'Chicken Biryani', price: 90, prepTime: 7, category: 'regular' },
        { id: 'M3', name: 'Paneer Butter Masala', price: 80, prepTime: 5, category: 'regular' },
        { id: 'M4', name: 'Fried Rice', price: 70, prepTime: 4, category: 'regular' }
    ],
    quickGrab: [
        { id: 'Q1', name: 'Sandwich', price: 40, prepTime: 1, category: 'quickGrab' },
        { id: 'Q2', name: 'Samosa (2 pcs)', price: 20, prepTime: 0, category: 'quickGrab' },
        { id: 'Q3', name: 'Burger', price: 50, prepTime: 2, category: 'quickGrab' },
        { id: 'Q4', name: 'Pasta', price: 60, prepTime: 3, category: 'quickGrab' }
    ],
    beverages: [
        { id: 'B1', name: 'Tea', price: 15, prepTime: 1, category: 'beverage' },
        { id: 'B2', name: 'Coffee', price: 20, prepTime: 1, category: 'beverage' },
        { id: 'B3', name: 'Cold Drink', price: 25, prepTime: 0, category: 'beverage' },
        { id: 'B4', name: 'Fresh Juice', price: 30, prepTime: 2, category: 'beverage' }
    ]
};

// Get menu
router.get('/menu', (req, res) => {
    res.json({
        success: true,
        data: menuItems,
        timestamp: new Date()
    });
});

// Create order
router.post('/create', (req, res) => {
    const { userId, items, orderType } = req.body;
    const io = req.app.locals.io;
    
    // Validate items
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No items in order'
        });
    }
    
    // Calculate order details
    const orderDetails = calculateOrderDetails(items);
    
    // Create order
    const order = {
        id: `ORD${Date.now()}`,
        orderNumber: orderCounter++,
        userId,
        items,
        orderType: orderType || 'regular',
        totalAmount: orderDetails.totalAmount,
        estimatedPrepTime: orderDetails.prepTime,
        status: 'pending',
        createdAt: new Date(),
        queueType: determineQueueType(items)
    };
    
    // Store order
    orders.set(order.id, order);
    
    // Notify kitchen
    io.emit('order:new', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        items: order.items,
        prepTime: order.estimatedPrepTime
    });
    
    res.json({
        success: true,
        data: order
    });
});

// Get order status
router.get('/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    const order = orders.get(orderId);
    
    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }
    
    res.json({
        success: true,
        data: order
    });
});

// Update order status
router.put('/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const io = req.app.locals.io;
    
    const order = orders.get(orderId);
    
    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }
    
    // Valid status transitions
    const validStatuses = ['pending', 'preparing', 'ready', 'collected', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid status'
        });
    }
    
    order.status = status;
    order.updatedAt = new Date();
    
    // Notify customer
    io.emit('order:statusUpdate', {
        orderId: order.id,
        status,
        message: getStatusMessage(status, order.orderNumber)
    });
    
    res.json({
        success: true,
        data: order
    });
});

// Get all active orders
router.get('/', (req, res) => {
    const { status, userId } = req.query;
    
    let filteredOrders = Array.from(orders.values());
    
    if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (userId) {
        filteredOrders = filteredOrders.filter(o => o.userId === userId);
    }
    
    res.json({
        success: true,
        data: filteredOrders,
        count: filteredOrders.length
    });
});

// Pre-order with time slot
router.post('/pre-order', (req, res) => {
    const { userId, items, pickupTime } = req.body;
    
    // Validate pickup time
    const pickupDate = new Date(pickupTime);
    const now = new Date();
    
    if (pickupDate < now) {
        return res.status(400).json({
            success: false,
            error: 'Pickup time must be in the future'
        });
    }
    
    // Calculate order details
    const orderDetails = calculateOrderDetails(items);
    
    // Create pre-order
    const order = {
        id: `PRE${Date.now()}`,
        orderNumber: `P${orderCounter++}`,
        userId,
        items,
        orderType: 'pre-order',
        totalAmount: orderDetails.totalAmount,
        estimatedPrepTime: orderDetails.prepTime,
        pickupTime: pickupDate,
        status: 'scheduled',
        createdAt: new Date(),
        queueType: 'express'
    };
    
    // Store order
    orders.set(order.id, order);
    
    res.json({
        success: true,
        data: {
            ...order,
            message: `Your order is scheduled for pickup at ${pickupDate.toLocaleTimeString()}`
        }
    });
});

// Helper functions
function calculateOrderDetails(items) {
    const allItems = [...menuItems.meals, ...menuItems.quickGrab, ...menuItems.beverages];
    
    let totalAmount = 0;
    let maxPrepTime = 0;
    
    items.forEach(item => {
        const menuItem = allItems.find(m => m.id === item.itemId);
        if (menuItem) {
            totalAmount += menuItem.price * (item.quantity || 1);
            maxPrepTime = Math.max(maxPrepTime, menuItem.prepTime);
        }
    });
    
    return {
        totalAmount,
        prepTime: maxPrepTime
    };
}

function determineQueueType(items) {
    const allItems = [...menuItems.meals, ...menuItems.quickGrab, ...menuItems.beverages];
    
    const categories = items.map(item => {
        const menuItem = allItems.find(m => m.id === item.itemId);
        return menuItem ? menuItem.category : null;
    }).filter(Boolean);
    
    // If only beverages, use beverage queue
    if (categories.every(c => c === 'beverage')) {
        return 'beverage';
    }
    
    // If only quick grab items, use quick grab queue
    if (categories.every(c => c === 'quickGrab')) {
        return 'quickGrab';
    }
    
    // Otherwise use regular queue
    return 'regular';
}

function getStatusMessage(status, orderNumber) {
    const messages = {
        preparing: `Order #${orderNumber} is being prepared`,
        ready: `Order #${orderNumber} is ready for pickup!`,
        collected: `Order #${orderNumber} has been collected`,
        cancelled: `Order #${orderNumber} has been cancelled`
    };
    
    return messages[status] || `Order #${orderNumber} status: ${status}`;
}

module.exports = router;