// routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const userController = require('../controllers/userController');
const User           = require('../models/userModel');
const authenticateUser = require('../middleware/authMiddleware');

router.get('/',            userController.findAll);

router.get('/me', authenticateUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.uid).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id',         userController.findOne);
router.post('/',           userController.create);        
router.post('/register',   userController.create);        
router.post('/login',      userController.login);
router.put('/:id',         userController.update);
router.delete('/:id',      userController.delete);
router.post('/logout',     userController.logout);


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ msg: 'Missing credential' });

    
    const ticket  = await client.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();  

    
    const user = await User.findOrCreateGoogle(payload);

    
    const token = jwt.sign(
      { uid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production', 
        maxAge:   2 * 60 * 60 * 1000,                   
      })
      .json({ ok: true });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(401).json({ msg: 'Invalid or expired Google token' });
  }
});

module.exports = router;
