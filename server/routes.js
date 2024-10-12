// File: server/routes.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Notification Schema
const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  recipientDepartment: String,
  recipientEmail: String,
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "misproject08@gmail.com", // Replace with your Gmail username
    pass: "pstu ipbp twai pgos", // Replace with your App password
  },
});

// Define department email mappings
const departmentEmails = {
  "Chancellor/Vice-Chancellor": "rohitkumargupta1007@gmail.com",
  Deans: "prateek.chaudhary@adypu.edu.in",
  "Faculty Members": "giriraj.adypu.edu.in",
  "Lab Instructors/Technicians": "lokesh.lohani@adypu.edu.in",
  "Administrative Staff": "admin_staff@example.com",
  "Library Staff": "rohitkgupta107@gmail.com",
  "Student Representatives": "rohit.gupta@adypu.edu.in",
};

// Route to handle form submission and send email
router.post("/save-notification", (req, res) => {
  const { title, message, department } = req.body;
  const recipientEmail = departmentEmails[department]; // Get email for the selected department

  if (!recipientEmail) {
    return res.status(400).send("Invalid department selected.");
  }

  const notification = new Notification({
    title,
    message,
    recipientDepartment: department,
    recipientEmail,
  });

  notification
    .save()
    .then(() => {
      // Send email
      const mailOptions = {
        from: "misproject08@gmail.com",
        to: recipientEmail,
        subject: `Notification: ${title}`,
        html: `
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Message:</strong> ${message}</p>
                    <p><strong>Department:</strong> ${department}</p>
                    <p><strong>Recipient Email:</strong> ${recipientEmail}</p>
                `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email.");
        } else {
          console.log("Email sent:", info.response);
          res.status(200).send("Notification sent successfully.");
        }
      });
    })
    .catch((err) => {
      console.error("Error saving notification:", err);
      res.status(400).send("Error saving notification.");
    });
});

// Route to get notifications
router.get("/notifications", (req, res) => {
  Notification.find()
    .sort({ createdAt: -1 })
    .then((notifications) => res.json(notifications))
    .catch((err) => {
      console.error("Error fetching notifications:", err);
      res.status(400).send("Error fetching notifications.");
    });
});

module.exports = router;
