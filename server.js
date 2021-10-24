import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

const PORT = process.env.PORT || 8000

// Connect MongoDB
import mongoClient from './config/db.js'
mongoClient()

//middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))

// IMPORT Routers
import userRouter from './routers/userRouter.js'

//USE ROUTERS
app.use('/api/v1/user', userRouter)

app.use('/', (req, res) => {
  res.json({ message: 'hello world' })
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log('Backend server is running!')
})