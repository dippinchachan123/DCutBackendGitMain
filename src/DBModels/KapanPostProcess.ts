import { any, string } from 'joi';
import mongoose from 'mongoose';

const packetSchema = new mongoose.Schema({
  diamondContainerId: String,
  packetId: String,
  id: {
    type: Number,
    index: true,  // Create an index on the "id" field
  },
  weight: Number,
  pieces: Number,
  size: Number,
  remarks: String,
  status: String,
  return: mongoose.Schema.Types.Mixed,
  issue: mongoose.Schema.Types.Mixed,
  subPackets: [mongoose.Schema.Types.Mixed],
  // Use the Mixed type to allow additional flexible fields
  charni: {
    type: { id: Number, value: String },
    default: null
  },
  color: {
    type: { id: Number, value: String },
    default: null
  },
  cutting: {  
    type: { id: Number, value: String },
    default: null
  },
  loss: {
    type: Number,
    default: 0
  },
  boil : mongoose.Schema.Types.Mixed,
  laser : mongoose.Schema.Types.Mixed
});


const processSchema = new mongoose.Schema({
  pending: {
    weight: Number,
    pieces: Number
  },
  process: {
    weight: Number,
    pieces: Number,
    packets: [packetSchema]
  }
})


const cartsSchema = new mongoose.Schema({
  MARKING_LOTING: processSchema,
  LASER_LOTING: processSchema,
  BOIL_LOTING: processSchema,
  GHAT_LOTING: processSchema,
  SHAPE_LOTING: processSchema,
  POLISH_LOTING: processSchema,
  POLISH_TABLE_LOTING: processSchema,
  POLISHED: processSchema,
  ORIGINAL_RC: processSchema,
  RC: processSchema,
  REJECTION: processSchema
  // Define fields for each process as needed
});


const cutsSchema = new mongoose.Schema({
  diamondContainerId: String,
  id: {
    type: Number,
    index: true,  // Create an index on the "id" field
  },
  weight: Number,
  pieces: Number,
  size: Number,
  remarks: String,
  status: String,
  carts: cartsSchema
  // Define fields for each process as needed
});


// Define the schema for the Kapan object
const kapanSchema = new mongoose.Schema({
  diamondContainerId: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness of container IDs
  },
  id: {
    type: Number,
    unique: true, // Ensure uniqueness
    index: true,  // Create an index on the "id" field
  },
  name: String,
  weight: Number,
  pieces: Number,
  size: Number,
  remarks: String,
  status: String,
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
  cuts: {
    type: [cutsSchema],
    default: []
  },
  history: mongoose.Schema.Types.Mixed, // Store historical data as needed
});


// Create the Mongoose model for Kapan
const KapanPP = mongoose.model('KapanPostProcess', kapanSchema);


export default KapanPP;


