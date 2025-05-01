const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const config = require('./configuration/config');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authenticationRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session configuration
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.MONGODB_URI }),
    cookie: {
        secure: config.NODE_ENV === 'production', // Set to true in production for HTTPS only
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', categoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const port = config.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));