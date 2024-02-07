import { any, string } from 'joi';
import mongoose from 'mongoose';

// Define the schema for the Kapan object
const Schema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  user: mongoose.Schema.Types.Mixed,
  time: {
    type: String,
    default : `${new Date().toLocaleTimeString()}-${new Date().toLocaleDateString()}`
  },
  operation: String,
  dataType: String,
  path: String,
  data: mongoose.Schema.Types.Mixed
});

// Create the Mongoose model for Kapan
const logModel = mongoose.model('Logs', Schema);

export default logModel;


