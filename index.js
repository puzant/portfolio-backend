import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import dotenv  from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

import Publications from './models/publications.js'
import publicationsRoute from './routes/publicationsRoute.js'
import { cache } from './cache.js'
import { wakeupJob } from './cron.js'
import { fetchTravelImages } from './utils.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(cors({
  origin: [process.env.FRONT_END_URL, "http://localhost:8080"],
  methods: ['GET', 'POST']
}))

app.use('/publications', publicationsRoute)

wakeupJob.start()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/cms', async (req, res) => {
  const publications = await Publications.find()
  const webpImages = await fetchTravelImages()

    res.render('index', {
      travelImages: webpImages,
      publications: publications,
      projects: [],
      title: 'CMS'
    })
})

app.get('/api/travel-images', async (req, res) => {
  try {
    const cachedImages = cache.get('travelImages')
    
    if (cachedImages) {
      return res.json({ images: cachedImages, success: true })
    }

    const webpImages = await fetchTravelImages()

    cache.set('travelImages', webpImages)
    res.json({ images: webpImages, success: true })
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch images from Cloudinary",
      error: err.message,
    });
  }
})

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});