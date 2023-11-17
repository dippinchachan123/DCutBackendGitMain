import { any, string } from 'joi';
import mongoose from 'mongoose';

// Define the schema for the Kapan object
const Schema = new mongoose.Schema({
  id:{
    type : Number,
    unique  : true
  } ,
  name : String,
  number : {type : Number,unique : true},
  status : String,
  role : String,
  password : String,
  staff : mongoose.Schema.Types.Mixed,
  nonStaff : mongoose.Schema.Types.Mixed,
});

// Create the Mongoose model for Kapan
const UserModel = mongoose.model('Users', Schema);

export default UserModel;


