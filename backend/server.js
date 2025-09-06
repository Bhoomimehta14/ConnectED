const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const queueRoutes = require('./routes/queue');
const orderRoutes = require('./routes/orders');

// In-memory data stores (replace with database in production)
let queues = {
    express: [],
    quickGrab: [],
    regular: [],
    beverage: []
};

let activeTokens = new Map();
let tokenCounter = 1000;

// Make queues available to routes
app.locals.queues = queues;
app.locals.activeTokens = activeTokens;
app.locals.io = io;

// Routes
app.use('/api/queue', queueRoutes);
app.use('/api/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Canteen Queue Management System API',
        endpoints: {
            queue: '/api/queue',
            orders: '/api/orders',
            health: '/health'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        queues: {
            express: queues.express.length,
            quickGrab: queues.quickGrab.length,
            regular: queues.regular.length,
            beverage: queues.beverage.length
        }
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send current queue status on connection
    socket.emit('queue:status', {
        queues: Object.keys(queues).reduce((acc, key) => {
            acc[key] = queues[key].length;
            return acc;
        }, {})
    });

    // Handle queue join
    socket.on('queue:join', (data) => {
        const { userId, queueType, orderDetails } = data;
        
        const token = {
            id: `TKN${tokenCounter++}`,
            userId,
            queueType,
            orderDetails,
            timestamp: new Date(),
            status: 'waiting',
            position: queues[queueType].length + 1,
            estimatedTime: calculateEstimatedTime(queueType)
        };

        queues[queueType].push(token);
        activeTokens.set(token.id, token);

        socket.emit('queue:joined', token);
        io.emit('queue:update', getQueueMetrics());
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Helper function to calculate estimated time
function calculateEstimatedTime(queueType) {
    const avgServiceTimes = {
        express: 0.5,
        quickGrab: 1.5,
        regular: 4,
        beverage: 1
    };
    
    const queueLength = queues[queueType].length;
    const estimatedMinutes = queueLength * avgServiceTimes[queueType];
    
    return {
        minutes: Math.round(estimatedMinutes),
        confidence: 0.85
    };
}

// Get queue metrics
function getQueueMetrics() {
    return {
        timestamp: new Date(),
        queues: Object.keys(queues).reduce((acc, key) => {
            acc[key] = {
                length: queues[key].length,
                estimatedWait: calculateEstimatedTime(key).minutes
            };
            return acc;
        }, {}),
        totalCustomers: Object.values(queues).reduce((sum, q) => sum + q.length, 0)
    };
}

// Update queue metrics every 30 seconds
setInterval(() => {
    io.emit('queue:metrics', getQueueMetrics());
}, 30000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   Canteen Queue System Server          ║
    ║   Running on http://localhost:${PORT}     ║
    ╠════════════════════════════════════════╣
    ║   API Endpoints:                       ║
    ║   • Health: http://localhost:${PORT}/health║
    ║   • Queue:  http://localhost:${PORT}/api/queue║
    ║   • Orders: http://localhost:${PORT}/api/orders║
    ╚════════════════════════════════════════╝
    `);
});