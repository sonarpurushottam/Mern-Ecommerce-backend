// server/models/HeroContent.js
import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
  },
  subheadline: {
    type: String,
    required: true,
  },
  backgroundImage: {
    type: String,
    required: true,
  },
});

const HeroContent = mongoose.model('HeroContent', heroContentSchema);

export default HeroContent;
