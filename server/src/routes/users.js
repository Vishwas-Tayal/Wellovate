import express from 'express';
import User from '../models/User.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'dob', 'address', 'emergencyContact'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

// Update medical history
router.put('/medical-history', auth, checkRole(['patient']), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['allergies', 'medications', 'surgeries', 'conditions', 'familyHistory'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user.medicalHistory[update] = req.body[update]);
    await req.user.save();
    res.json(req.user.medicalHistory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating medical history' });
  }
});

// Update privacy settings
router.put('/privacy-settings', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['shareData', 'emailNotifications', 'smsNotifications'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user.privacySettings[update] = req.body[update]);
    await req.user.save();
    res.json(req.user.privacySettings);
  } catch (error) {
    res.status(400).json({ message: 'Error updating privacy settings' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error changing password' });
  }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account' });
  }
});

export default router; 