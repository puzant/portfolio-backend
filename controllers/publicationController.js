import { DateTime } from 'luxon'
import Publication from '../models/publications.js'

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find().sort({ publishedDate: -1 }).lean()
    res.status(200).json({
      success: true, 
      message: "Publications retrieved successfully",
      count: publications.length,
      publications: publications,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    })
  }
}

export const addPublication = async (req, res) => {  
  const { title, publishedDate, link, duration, preview } = req.body

  try {
    const publication = await Publication.create({ title, publishedDate: new Date(publishedDate), link, duration, preview })
    res.status(201).json({
      success: true,
      message: "Publication saved successfully",
      publication
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    })
  }
}

export const editPublication = async (req, res) => {
  const { id } = req.params
  const { title, publishedDate, link, duration, preview } = req.body

  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, publishedDate: new Date(publishedDate), link, duration, preview, lastModified: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedPublication) {
      return res.status(404).json({ 
        success: false,
        error: 'Publication was not found' 
      })
    }

    return res.status(200).json({
      success: true,
      message: "Publication updated successfully",
      updatedPublication
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    })
  }
}

export const deletePublication = async (req, res) => {
  try {
    const publicationToDelete = await Publication.findByIdAndDelete(req.params.id)

    if (!publicationToDelete) 
      return res.status(404).json({ message: 'Publication not found' })

    res.status(200).json({
      success: true,
      message: 'Publication deleted successfully', 
      publicationToDelete
    })
      
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    })
  }
}

// Route to render the Add Publication form
export const renderAddPublication = async (req, res) => {
  try {
    res.render('publication/addPublication', {
      title: 'Add Publication'
    })
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}

// Route to render the Edit Publication form
export const renderEditPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
    
     if (!publication) 
      return res.status(404).send('Publication not found')
     
     res.render('publication/editPublication', {
       publication: {
        _id: publication._id,
        title: publication.title, 
        publishedDate: DateTime.fromJSDate(publication.publishedDate).toFormat('yyyy-MM-dd'),
        lastModified: DateTime.fromJSDate(publication.lastModified).toFormat('yyyy-MM-dd HH:mm:ss'),
        link: publication.link, 
        duration: publication.duration, 
        preview: publication.preview, 
      },
       title: 'Edit Publication' 
      }
    )
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}