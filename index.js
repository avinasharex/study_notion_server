import dotenv from 'dotenv'
dotenv.config()
import connectDB from "./config/database.js";
import app from './app.js';


const PORT = process.env.PORT 


app.listen(PORT,async()=>{
    await connectDB()
    console.log(`App is running at http://localhost:${PORT}`);
})