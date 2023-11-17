import { string } from 'joi';
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    id : String,
    path: String,
    filename: String,
});

// Create the Mongoose model for Kapan
const Image = mongoose.model('Image', imageSchema);

export default Image;