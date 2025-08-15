import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import mongoose from "mongoose";

const mongoDBConnect = () => {
  try {
    //
    // THIS IS THE CORRECTED LINE:
    mongoose.connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    //
    //
    console.log("MongoDB - Connected");
  } catch (error) {
    console.log("Error - MongoDB Connection " + error);
  }
};

export default mongoDBConnect;