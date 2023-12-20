import { any, string } from 'joi';
import mongoose from 'mongoose';

// Define the schema for the Kapan object
const Schema = new mongoose.Schema({
  id:{
    type : Number,
    unique  : true
  } ,
  name : String,
  number : Number,
  remarks: String,
  status : String,
  type : String,
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true, // Set the field to be immutable after it's been set
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },  
  lastModifiedBy: {
    userId: String,
    userName: String,
  },
  history: mongoose.Schema.Types.Mixed, // Store historical data as needed
});

// Create the Mongoose model for Kapan
const Staffmodel = mongoose.model('Staff', Schema);

export default Staffmodel;


