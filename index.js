import cors from 'cors'
import dotenv  from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

import { cache } from './cache.js'
import { wakeupJob } from './cron.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(morgan('dev'))

app.use(cors({
  origin: [process.env.FRONT_END_URL, "http://localhost:8080"],
  methods: ['GET', 'POST']
}))

wakeupJob.start()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/cms', (req, res) => {
  res.render('index', {
    projects: [
      {name: 'Locus', description: 'Real-Estate Management Platform', link: 'https://www.locus.eu/', tech: ['React', 'Tailwind', 'React Query', 'Formik']},
      {name: 'TMDB Clone', description: 'Explore And Search Movies', link: 'https://react-app-movies-tracker.netlify.app/', tech: ['React', 'Tailwind', 'React Query', 'TypeScript', ]},
      {name: 'Puzant CV', description: 'Interactive Online CV', link: 'https://puzant-cv.netlify.app/', tech: ['AlpineJs', 'JavaScript', 'HTML', 'CSS']},
      {name: 'Password Generator', description: 'Complex Password Generator', link: 'https://complex-password-generator-app.netlify.app/', tech: ['JavaScript', 'HTML', 'Tailwind']},
    ],
    publications: [
      {
        title: 'Efficient Data Fetching and Mutation in React with Generic Hooks and HOCs',
        preview: 'In the ever-evolving landscape of web development, one constant remains: the need to interact with APIs. Whether you’re building web…',
        publishedDate: 'Sep 5, 2023',
        duration: '4',
        link: 'https://medium.com/@puzant24/efficient-data-fetching-and-mutation-in-react-with-generic-hooks-and-hocs-37728b444ac8'
      },
      {
        title: 'Building A Simple Images Carousel With ReactJs',
        preview: 'Carousel allows multiple image & videos to be displayed in a nice & interactive way',
        publishedDate: 'Feb 3, 2021',
        duration: '4',
        link: 'https://medium.com/@puzant24/building-a-simple-images-carousel-with-reactjs-377256bedc61'
      },
      {
        title: 'Infinite Scroll With ReactJs & Redux',
        preview: 'Infinite scroll has been widely used in today’s web & mobile apps, it simply loads data as you scroll down the page, this eliminated the…',
        publishedDate: 'Jul 8, 2020',
        duration: '3',
        link: 'https://medium.com/@puzant24/infinite-scroll-with-reactjs-redux-23bccea01dd0'
      }
    ]
  });
});

app.get('/api/travel-images', async (req, res) => {
  try {
    const cachedImages = cache.get('travelImages')
    
    if (cachedImages) {
      return res.json({ images: cachedImages, success: true })
    }

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'travels',
      max_results: 50
    })

    const webpImages = result.resources.map(resource => ({
      url: cloudinary.url(resource.public_id, {
        transformation: [
          { width: 384, height: 288, crop: 'fill', format: 'webp', quality: 'auto' }
        ],
      }),
      display_name: resource.display_name,
      asset_id: resource.asset_id,
      public_id: resource.public_id
    }))

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});