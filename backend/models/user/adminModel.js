import mongoose from "mongoose";
import User from "../userModels.js";

// Admin Schema
const AdminSchema = new mongoose.Schema({
  accessLevel: {
    type: String,
    enum: ['SuperAdmin', 'Moderator'],
    default: 'Moderator'
  }
});

const Admin = User.discriminator('Admin', AdminSchema);

export default Admin