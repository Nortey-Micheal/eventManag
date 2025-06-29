import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Attendee', 'Organizer', 'Admin'],
    default: 'Attendee'
  }
}, {
  timestamps: true,
  discriminatorKey: 'role'
});

const User = mongoose.model('User', UserSchema);
export default User