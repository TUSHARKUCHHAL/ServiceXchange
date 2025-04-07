const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/ContactRequest');
const sendEmail = require('../utils/emailServices');

// @route   POST /api/contact
// @desc    Submit a new contact request
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Create new contact request in database
    const contactRequest = await ContactRequest.create({
      name,
      email,
      phone,
      subject,
      message
    });
    
    // Send confirmation email
    const emailSent = await sendEmail({
      to: email,
      subject: `Confirmation: Your Request - ${subject}`,
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your message and will get back to you shortly. Here are the details of your request:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Request ID:</strong> ${contactRequest._id}</p>
          <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>Our support team will review your request and contact you as soon as possible.</p>
        <p>If you have any urgent concerns, please call us at +123 456 7890.</p>
        
        <p>Thank you for choosing our services!</p>
        <p>The Service Exchange Team</p>
      `
    });
    
    // Also send notification to admin
    await sendEmail({
      to: 'support@servicexchange.com',
      subject: `New Contact Request: ${subject}`,
      html: `
        <h3>New contact request received</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Request ID:</strong> ${contactRequest._id}</p>
        <p>Please respond to this request as soon as possible.</p>
      `
    });
    
    res.status(201).json({ 
      success: true, 
      data: contactRequest,
      message: 'Contact request submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error in contact submission:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error, please try again' 
    });
  }
});

module.exports = router;