import Event from "../models/eventModel.js";
import User from "../models/userModels.js";
import Venue from "../models/venueModel.js";

// Create a new event (Organizer only)
export const createEvent = async (req, res) => {
  const { userId, name, description, date, venueId, ticketPrice } = req.body;
  if (!userId ) {
    return res.status(401).json({ message: 'Unauthorized: Only organizers can create events' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }

  if (user.role !== 'Organizer') return res.status(401).json({ message: 'Unauthorized: Invalid user' });

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const event = new Event({
      organizer: userId,
      name,
      description,
      date,
      venue: venueId,
      ticketPrice
    });
    await event.save();

    // Add to organizer's organizedEvents
    user.organizedEvents.push(event._id);
    await user.save();

    res.status(201).json({ event });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get all events (public)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true })
      .populate({ path: 'venue', select: 'name location capacity' })
      .populate({ path: 'organizer', select: 'username email' })
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get a specific event by ID
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId)
      .populate({ path: 'venue', select: 'name location capacity' })
      .populate({ path: 'organizer', select: 'username email' });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Approve an event (Admin only)
export const approveEvent = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || role !== 'Admin') {
    return res.status(401).json({ message: 'Unauthorized: Only admins can approve events' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }

  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isApproved = true;
    await event.save();

    res.status(200).json({ message: 'Event approved', event });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Update an event (Organizer only)
export const updateEvent = async (req, res) => {
  const { userId, role } = req.body;
  const { eventId } = req.params;

  if (!userId || role !== 'Organizer') {
    return res.status(401).json({ message: 'Unauthorized: Only organizers can update events' });
  }

  try {
    const event = await Event.findOne({ _id: eventId, organizer: userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json({ event });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete an event (Organizer only)
export const deleteEvent = async (req, res) => {
  const { userId, role } = req.body;
  const { eventId } = req.params;

  if (!userId || role !== 'Organizer') {
    return res.status(401).json({ message: 'Unauthorized: Only organizers can delete events' });
  }

  try {
    const event = await Event.findOne({ _id: eventId, organizer: userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
