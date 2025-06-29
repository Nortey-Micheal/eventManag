import express from 'express'
import { cancelBooking, createBooking, getOrganizerEventBookings, getUserBookings } from '../controllers/bookingController.js'
// import verifyJWTToken from '../middleware/verifyToken.js';

const bookingRouter = express.Router()

bookingRouter.post('/cancelBooking', cancelBooking)
bookingRouter.post('/createBooking',createBooking)
bookingRouter.get('/getOrganizerEventBookings',getOrganizerEventBookings)
bookingRouter.get('/getUserBookings',getUserBookings)


export default bookingRouter