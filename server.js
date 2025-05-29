require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);
app.use('/reviews', reviewRoutes);
app.use('/wishlists', wishlistRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
