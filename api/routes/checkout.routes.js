// routes/checkout.js

const express = require('express');
const router = express.Router();
const { createOrder, processPayment } = require('../controllers/checkoutController');

// Route for creating a new order
router.post('/create-order', createOrder);

// Route for processing payment
router.post('/process-payment', processPayment);

module.exports = router;
