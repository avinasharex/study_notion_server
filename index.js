import dotenv from 'dotenv'
import connectDB from "./config/database.js";
import app from './app.js';

dotenv.config()

const PORT = process.env.PORT 


app.listen(PORT,async()=>{
    await connectDB()
    console.log(`App is running at http://localhost:${PORT}`);
})