import mongoose from 'mongoose';
import { config } from '../config';

export const dbConnect = ()=>{ 
    console.log("config.db.connect_string.......",config.db.connect_string);
    mongoose.connect("mongodb://127.0.0.1:27017/",{dbName:"DCut"})
    .then(() => console.log('Mongo DB connected!'))
    .catch((e)=> console.log('Mongo DB connection failed!', e))
};