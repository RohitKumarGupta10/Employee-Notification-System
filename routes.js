// File: server/routes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    recipientDepartment: String,
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Route to handle form submission and save data
router.post('/save-notification', (req, res) => {
    const { title, message, department } = req.body;

    const notification = new Notification({
        title,
        message,
        recipientDepartment: department,
    });

    notification.save()
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error('Error saving notification:', err);
            res.status(400).send('Error saving notification.');
        });
});

// Route to get notifications
router.get('/notifications', (req, res) => {
    Notification.find().sort({ createdAt: -1 })
        .then(notifications => res.json(notifications))
        .catch(err => {
            console.error('Error fetching notifications:', err);
            res.status(400).send('Error fetching notifications.');
        });
});

module.exports = router;
