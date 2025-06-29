import mongoose from "mongoose";

// Venue Schema
const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Venue = mongoose.model("Venue", VenueSchema);
export default Venue;