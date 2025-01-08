import { DateTime } from 'luxon'
import Publication from '../models/publications.js'

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find()
    res.status(200).json(publications)
  } catch (error) {
    console.error('Error fetching publications:', error)
    res.status(500).json({ error: 'Failed to fetch publications' })
  }
}

export const addPublication = async (req, res) => {  
  const { title, publishedDate, link, duration, preview } = req.body

  try {
     Publication.create({ title, publishedDate: new Date(publishedDate), link, duration, preview })
    res.status(200).json({message: 'publication created successfully!'})
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const editPublication = async (req, res) => {
  const { id } = req.params
  const { title, publishedDate, link, duration, preview } = req.body

  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, publishedDate: new Date(publishedDate), link, duration, preview },
      { new: true, runValidators: true }
    )

    if (!updatedPublication) {
      return res.status(404).json({ error: 'Document not found' })
    }

    res.json({
      success: 'Publication updated successfully!',
      data: updatedPublication
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deletePublication = async (req, res) => {
  try {
    const publicationToDelete = await Publication.findByIdAndDelete(req.params.id)

    if (!publicationToDelete) 
      return res.status(404).json({ message: 'Publication not found' })

    res.status(200).json({
      message: 'Publication deleted successfully', 
      publicationToDelete
    })
      
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

export const renderAddPublication = async (req, res) => {
  res.render('publication/addPublication', {
    title: 'Add Publication'
  })
}

export const renderEditPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
    
     if (!publication) 
      return res.status(404).send('Project not found')
     
     res.render('publication/editPublication', {
       publication: {
        _id: publication._id,
        title: publication.title, 
        publishedDate: DateTime.local().toFormat('yyyy-MM-dd'),
        link: publication.link, 
        duration: publication.duration, 
        preview: publication.preview, 
      },
       title: 'Edit Publication' 
      }
    )
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
