import express from 'express'
import { createEvent, getAllEvents,getEventById, approveEvent, deleteEvent, updateEvent} from '../controllers/eventController.js'
// import verifyJWTToken from '../middleware/verifyToken.js';

const eventRouter = express.Router()

eventRouter.get('/getAllEvents', getAllEvents)
eventRouter.post('/createEvent',createEvent)
eventRouter.get('/getEventById',getEventById)
eventRouter.get('/getEventById',getEventById)
eventRouter.post('/approveEvent',approveEvent)
eventRouter.post('/deleteEvent',deleteEvent)
eventRouter.post('/updateEvent',updateEvent)


export default eventRouter