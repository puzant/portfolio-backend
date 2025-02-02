import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import dotenv  from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { DateTime } from 'luxon'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

import { wakeupJob } from './cron.js'
import { fetchTravelImages } from './cloudinary.js'
import Publications from './models/publications.js'
import Projects from './models/project.js'
import projectsRoute from './routes/projectsRoute.js'
import publicationsRoute from './routes/publicationsRoute.js'
import travelImagesRoute from './routes/travelImagesRoute.js'
import authRoute from './routes/authRoute.js'

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
app.use('/projects', projectsRoute)
app.use('/travel-images', travelImagesRoute)
app.use('/auth', authRoute)

wakeupJob.start()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/cms', async (req, res) => {
  const projects = await Projects.find({}).lean()
  const publications = await Publications.find({}).sort({ publishedDate: -1 }).lean()
  const webpImages = await fetchTravelImages()

  const tranformedPublications = publications.map(p => {
    return {
      ...p, 
      publishedDate: DateTime.fromJSDate(p.publishedDate).toFormat('yyyy-MM-dd')
    }
  })

  res.render('index', {
    travelImages: webpImages,
    publications: tranformedPublications,
    projects: projects,
    title: 'CMS'
  })
})

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});