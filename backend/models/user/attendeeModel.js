import mongoose from "mongoose";
import User from "../userModels.js";

// Attendee Schema
const { ObjectId } = mongoose.Types

const AttendeeSchema = new mongoose.Schema({
  preferences: [
    {
      type: String
    }
  ],
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  bookings: [
    {
      type: ObjectId,
      ref: 'Booking'
    }
  ]
});

const Attendee = User.discriminator('Attendee', AttendeeSchema);

export default Attendee