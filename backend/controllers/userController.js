// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Organizer from '../models/user/organiserModel.js';
import Admin from '../models/user/adminModel.js';
import Attendee from '../models/user/attendeeModel.js';
import User from '../models/userModels.js';

// Helper to generate JWT
function generateToken(user) {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Signup Controller
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    let UserModel;
    switch (role) {
      case 'Organizer':
        UserModel = Organizer;
        break;
      case 'Admin':
        UserModel = Admin;
        break;
      default:
        UserModel = Attendee;
    }

    const existing = await UserModel.findOne( { email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = new UserModel({ username, email, role });
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    // const token = generateToken(user);
    res.status(201).json({ ...user._doc,password:undefined});
  } catch (err) {
    next(err);
  }
};

// Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email})

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // const token = generateToken(user);
    res.status(200).json({...user._doc,password:undefined });
  } catch (err) {
    next(err);
  }
};
