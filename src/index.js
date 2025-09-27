import dotenv from 'dotenv'
import app from './app.js';
import connectDB from './db/index.js'
dotenv.config({
    path: './.env'
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
