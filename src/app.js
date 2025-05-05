const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);

const errorMiddleware = require('./middlewares/errorMiddleware');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);  // must come after routes

// global error handler (optional)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;
