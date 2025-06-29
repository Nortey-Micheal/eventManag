import express from 'express'
import { getVenueById, createVenue, deleteVenue,getAllVenues, updateVenue } from '../controllers/venueController.js'
// import verifyJWTToken from '../middleware/verifyToken.js';

const venueRouter = express.Router()

venueRouter.post('/deleteVenue', deleteVenue)
venueRouter.post('/createVenue', createVenue)
venueRouter.get('/getVenueById',getVenueById)
venueRouter.get('/getAllVenues',getAllVenues)
venueRouter.post('/updateVenue',updateVenue)


export default venueRouter