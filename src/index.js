import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary';
import app from './app.js';
import connectDB from './db/index.js'
dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
        process.exit(1);
    })
