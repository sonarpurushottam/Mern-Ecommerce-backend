// server/routes/heroContent.js
import express from 'express';
import HeroContent from '../models/HeroContent.js';

const router = express.Router();

// Get Hero Content
router.get('/hero-content', async (req, res) => {
  try {
    const heroContent = await HeroContent.findOne();
    res.json(heroContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hero content' });
  }
});

// Create Hero Content
router.post('/hero-content', async (req, res) => {
  try {
    const newHeroContent = new HeroContent(req.body);
    const savedHeroContent = await newHeroContent.save();
    res.status(201).json(savedHeroContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hero content' });
  }
});

// Update Hero Content
router.put('/hero-content/:id', async (req, res) => {
  try {
    const updatedHeroContent = await HeroContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHeroContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hero content' });
  }
});

// Delete Hero Content
router.delete('/hero-content/:id', async (req, res) => {
  try {
    await HeroContent.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hero content' });
  }
});

export default router;
