const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Get all queue statuses
router.get('/status', (req, res) => {
    const queues = req.app.locals.queues;
    
    const status = Object.keys(queues).reduce((acc, queueType) => {
        acc[queueType] = {
            length: queues[queueType].length,
            tokens: queues[queueType].map(t => ({
                id: t.id,
                position: t.position,
                estimatedTime: t.estimatedTime
            }))
        };
        return acc;
    }, {});
    
    res.json({
        success: true,
        data: status,
        timestamp: new Date()
    });
});

// Join a queue
router.post('/join', (req, res) => {
    const { userId, queueType, orderDetails } = req.body;
    const queues = req.app.locals.queues;
    const activeTokens = req.app.locals.activeTokens;
    const io = req.app.locals.io;
    
    // Validate queue type
    if (!queues[queueType]) {
        return res.status(400).json({
            success: false,
            error: 'Invalid queue type'
        });
    }
    
    // Generate token
    const token = {
        id: `TKN${Date.now()}`,
        userId,
        queueType,
        orderDetails,
        timestamp: new Date(),
        status: 'waiting',
        position: queues[queueType].length + 1,
        estimatedTime: calculateWaitTime(queueType, queues[queueType].length)
    };
    
    // Add to queue
    queues[queueType].push(token);
    activeTokens.set(token.id, token);
    
    // Notify all clients
    io.emit('queue:update', {
        queueType,
        length: queues[queueType].length
    });
    
    res.json({
        success: true,
        data: token
    });
});

// Get token status
router.get('/token/:tokenId', (req, res) => {
    const { tokenId } = req.params;
    const activeTokens = req.app.locals.activeTokens;
    
    const token = activeTokens.get(tokenId);
    
    if (!token) {
        return res.status(404).json({
            success: false,
            error: 'Token not found'
        });
    }
    
    res.json({
        success: true,
        data: token
    });
});

// Abandon queue
router.post('/abandon/:tokenId', (req, res) => {
    const { tokenId } = req.params;
    const queues = req.app.locals.queues;
    const activeTokens = req.app.locals.activeTokens;
    const io = req.app.locals.io;
    
    const token = activeTokens.get(tokenId);
    
    if (!token) {
        return res.status(404).json({
            success: false,
            error: 'Token not found'
        });
    }
    
    // Remove from queue
    const queueType = token.queueType;
    queues[queueType] = queues[queueType].filter(t => t.id !== tokenId);
    
    // Update positions
    queues[queueType].forEach((t, index) => {
        t.position = index + 1;
    });
    
    // Remove from active tokens
    activeTokens.delete(tokenId);
    
    // Notify all clients
    io.emit('queue:update', {
        queueType,
        length: queues[queueType].length
    });
    
    res.json({
        success: true,
        message: 'Successfully left the queue'
    });
});

// Call next customer
router.post('/call-next/:queueType', (req, res) => {
    const { queueType } = req.params;
    const { counterId } = req.body;
    const queues = req.app.locals.queues;
    const io = req.app.locals.io;
    
    if (!queues[queueType] || queues[queueType].length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No customers in queue'
        });
    }
    
    // Get next customer
    const nextCustomer = queues[queueType].shift();
    nextCustomer.status = 'serving';
    nextCustomer.counterId = counterId;
    
    // Update positions for remaining customers
    queues[queueType].forEach((t, index) => {
        t.position = index + 1;
    });
    
    // Notify the called customer
    io.emit('queue:call', {
        tokenId: nextCustomer.id,
        counterId,
        message: `Please proceed to counter ${counterId}`
    });
    
    // Notify queue update
    io.emit('queue:update', {
        queueType,
        length: queues[queueType].length
    });
    
    res.json({
        success: true,
        data: nextCustomer
    });
});

// Get queue metrics
router.get('/metrics', (req, res) => {
    const queues = req.app.locals.queues;
    
    const metrics = {
        timestamp: new Date(),
        totalCustomers: Object.values(queues).reduce((sum, q) => sum + q.length, 0),
        queueLengths: Object.keys(queues).reduce((acc, key) => {
            acc[key] = queues[key].length;
            return acc;
        }, {}),
        averageWaitTimes: {
            express: 1,
            quickGrab: 2,
            regular: 5,
            beverage: 1
        },
        recommendedQueue: getRecommendedQueue(queues)
    };
    
    res.json({
        success: true,
        data: metrics
    });
});

// Helper functions
function calculateWaitTime(queueType, position) {
    const avgServiceTimes = {
        express: 0.5,
        quickGrab: 1.5,
        regular: 4,
        beverage: 1
    };
    
    const minutes = Math.round(position * avgServiceTimes[queueType]);
    
    return {
        minutes,
        formatted: `${minutes} min`,
        confidence: 0.85
    };
}

function getRecommendedQueue(queues) {
    const scores = Object.keys(queues).map(type => ({
        type,
        score: queues[type].length * getQueueWeight(type)
    }));
    
    scores.sort((a, b) => a.score - b.score);
    return scores[0].type;
}

function getQueueWeight(queueType) {
    const weights = {
        express: 0.5,
        quickGrab: 1,
        regular: 3,
        beverage: 0.8
    };
    return weights[queueType] || 1;
}

module.exports = router;