import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import bookingRouter from './routes/bookingRouter.js'
import eventRouter from './routes/eventRouter.js'
import venueRouter from './routes/venueRouter.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())

app.use('/api/user',userRouter)
// app.use('/api/transaction',transactionRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/event', eventRouter)
app.use('/api/venue', venueRouter)

try {

    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected successfully to the MongoDB database')
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port: ${process.env.PORT}`)
    })
    
} catch (error) {
    console.log(error)
}