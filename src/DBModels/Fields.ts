import { number } from 'joi';
import mongoose from 'mongoose';

// Define the schema for the Kapan object
const Schema = new mongoose.Schema({
  id : {
    type : String,
    default : "Kapan",
    unique : true
  },
  charni: {
    type: [mongoose.Schema.Types.Mixed],
    default : []
  },
  color: {
    type: [mongoose.Schema.Types.Mixed],
    default : []
  },
  cutting: {
    type: [mongoose.Schema.Types.Mixed],
    default : []
  }
});

// Create the Mongoose model for Kapan
const FieldsModel = mongoose.model('Fields', Schema);

export default FieldsModel;


