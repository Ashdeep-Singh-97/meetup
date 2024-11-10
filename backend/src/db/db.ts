// src/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB URI from environment variables
const mongoURI = process.env.DB_URL || ""; 

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to the MeetUp database');
  })
  .catch((error) => {
    console.error('Error connecting to the MeetUp database:', error);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified : {type: Boolean, required: false}
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export { User };
