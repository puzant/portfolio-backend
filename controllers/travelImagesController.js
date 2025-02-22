import { cache } from '../cache.js'
import { fetchTravelImages, removeTravelImage, uploadTravelImage } from '../cloudinary.js'

export const getAllTravelImages = async (req, res) => {
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
}

export const addTravelImage = async (req, res) => {
  try {
    const response = await uploadTravelImage(req.file.path)
    if (response.secure_url) {
      res.status(201).json({
        success: true,
        message: "Travel Image saved successfully",
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    })
  }
}

export const deleteTravelImage = async (req, res) => {
  const { publicId } = req.body
  if (!publicId) {
    return res.status(400).json({ success: false, message: "No publicId provided" })
  }

  const response = await removeTravelImage(publicId)
}

export const renderAddTravelImage = async (req, res) => {
  try {
    res.render('travelImages/addTravelImage', {
      title: 'Travel Images',
      user: req.user
    })
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}