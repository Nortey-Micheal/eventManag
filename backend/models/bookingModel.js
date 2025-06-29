import mongoose from "mongoose";

// Booking Schema
const { ObjectId } = mongoose.Types
const BookingSchema = new mongoose.Schema({
  event: {
    type: ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  attendee: {
    type: ObjectId,
    ref: 'Attendee',
    required: true,
    index: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  seatsBooked: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

BookingSchema.statics.getAvailableSeats = async function (eventId) {
  const event = await mongoose.model('Event').findById(eventId).populate('venue');
  if (!event) throw new Error('Event not found');
  const booked = await this.aggregate([
    { $match: { event: new ObjectId(eventId) } },
    { $group: { _id: '$event', total: { $sum: '$seatsBooked' } } }
  ]);
  const totalBooked = (booked[0] && booked[0].total) || 0;
  return event.venue.capacity - totalBooked;
};

BookingSchema.pre('save', async function (next) {
  const available = await this.constructor.getAvailableSeats(this.event);
  if (this.seatsBooked > available) {
    return next(new Error('Not enough seats available'));
  }
  next();
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;