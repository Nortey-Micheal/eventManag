import mongoose from "mongoose";

// Event Schema
const { ObjectId } = mongoose.Types

const EventSchema = new mongoose.Schema({
  organizer: {
    type: ObjectId,
    ref: 'Organizer',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true,
  },
  venue: {
    type: ObjectId,
    ref: 'Venue',
    required: true
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event',EventSchema)
export default Event;  