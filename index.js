import cors from 'cors'
import dotenv  from 'dotenv'
import express from 'express'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
  origin: [process.env.FRONT_END_URL, "http://localhost:8080"],
  methods: ['GET', 'POST']
}))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/api/travel-images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'travels',
      max_results: 50
    })

    const webpImage = result.resources.map(resource => ({
      url: cloudinary.url(resource.public_id, {
        transformation: [
          { width: 384, height: 288, crop: 'fill', format: 'webp', quality: 'auto' }
        ],
      }),
      display_name: resource.display_name,
      asset_id: resource.asset_id,
      public_id: resource.public_id
    }))

    res.json({ images: webpImage, success: true })
    
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