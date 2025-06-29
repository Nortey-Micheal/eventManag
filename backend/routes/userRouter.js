import express from 'express'
import { login, signup } from '../controllers/userController.js'
// import verifyJWTToken from '../middleware/verifyToken.js';

const userRouter = express.Router()

userRouter.post('/signup',signup)
// userRouter.post('/verify-email',verifyToken)
userRouter.post('/login',login)

export default userRouter