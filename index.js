import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import dotenv  from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'

import { wakeupJob } from './cron.js'

//  API Routes
import cmsRoute from './routes/cms.route.js'
import authRoute from './routes/auth.route.js'
import projectsRoute from './routes/projects.route.js'
import settingsRoute from './routes/settings.route.js'
import publicationsRoute from './routes/publications.route.js'
import travelImagesRoute from './routes/travelImages.route.js'

import renderRoutes from './routes/renderRoutes.js'

import errorHandler from './middlewares/errorMiddleware.js'
import notFoundHandler from './middlewares/notFoundHandler.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

dotenv.config()
const app = express()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(cors({
  origin: [process.env.FRONT_END_URL, "http://localhost:8080"],
  methods: ['GET', 'POST']
}))

//  Register routes
app.use(cmsRoute)
app.use(renderRoutes)

app.use('/v1/publications', publicationsRoute)
app.use('/v1/projects', projectsRoute)
app.use('/v1/travel-images', travelImagesRoute)
app.use('/v1/auth', authRoute)
app.use('/v1/settings', settingsRoute)


app.use("*", notFoundHandler)
app.use(errorHandler)

wakeupJob.start()

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});