import Booking from "../models/bookingModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModels.js";

// Create a new booking for an attendee using userId in body and verifying user
export const createBooking = async (req, res) => {
  const { userId, eventId, seatsRequested } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing userId' });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const availableSeats = await Booking.getAvailableSeats(eventId)

    if (availableSeats < seatsRequested) {
      return res.status(404).json({ message: `Requested seats more than available seats. Only ${availableSeats} seats available.` })
    }

    const booking = new Booking({
      event: eventId,
      attendee: userId,
      seatsBooked: seatsRequested
    });
    await booking.save();

    res.status(201).json({ booking });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get all bookings for an attendee using userId in body and verifying user
export const getUserBookings = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing userId' });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

  try {
    const bookings = await Booking.find({ attendee: userId })
      .populate({ path: 'event', select: 'name date venue' })
      .sort({ bookingTime: -1 });
    res.status(200).json({ bookings });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get all bookings for events organized by organizerId in body and verifying user
export const getOrganizerEventBookings = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || (role !== 'Organizer' && role !== 'Admin')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

  try {
    const events = await Event.find({ organizer: userId }).select('_id name date');
    const eventIds = events.map(e => e._id);

    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate({ path: 'attendee', select: 'username email' })
      .populate({ path: 'event', select: 'name date' })
      .sort({ bookingTime: -1 });

    res.status(200).json({ events, bookings });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Cancel a booking using userId in body and verifying user
export const cancelBooking = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing userId' });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid user' });

  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId, attendee: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    await booking.remove();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
