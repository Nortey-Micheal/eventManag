import User from "../models/userModels.js";
import Venue from "../models/venueModel.js";

// Create a new venue (Admin or Organizer)
export const createVenue = async (req, res) => {
  const { userId, name, capacity, location } = req.body;
  if (!userId ) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }

  if (user.role === 'Attendee') return res.status(401).json({  message: 'Unauthorized: Only Admins or Organizers can create venues'});

  try {
    const venue = new Venue({ name, capacity, location });
    await venue.save();
    return res.status(201).json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get all venues (Public)
export const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    res.status(200).json({ venues });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get a specific venue by ID (Public)
export const getVenueById = async (req, res) => {
  try {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Update a venue (Admin or Organizer)
export const updateVenue = async (req, res) => {
  const { userId} = req.body;
  const { venueId } = req.params;
  if (!userId ) {
    return res.status(401).json({ message: 'Unauthorized: Only Admins or Organizers can update venues' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }
  if (user.role === 'Attendee') return res.status(401).json({ message: 'Unauthorized: Invalid user' }); 

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    Object.assign(venue, req.body);
    await venue.save();
    res.status(200).json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete a venue (Admin only)
export const deleteVenue = async (req, res) => {
  const { userId } = req.body;
  const { venueId } = req.params;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Only Admins can delete venues' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user' });
  }
  if (user.role !== 'Admin') return res.status(401).json({ message: 'Unauthorized: Invalid user' }); 

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    await venue.remove();
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
