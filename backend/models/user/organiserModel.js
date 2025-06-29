import mongoose from "mongoose";
import User from "../userModels.js";

// Organizer Schema
const { ObjectId } = mongoose.Types

const OrganizerSchema = new mongoose.Schema({
  organizationName: {
    type: String
  },
  approved: {
    type: Boolean,
    default: false
  },
  organizedEvents: [
    {
      type: ObjectId,
      ref: 'Event'
    }
  ]
});

const Organizer = User.discriminator('Organizer', OrganizerSchema);

export default Organizer;  
