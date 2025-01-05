import express from 'express'
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

export const addPublication = async (req, res) => {}

export const editPublication = async (req, res) => {
  const { id } = req.params
  const { title, publishedDate, link, duration, preview } = req.body
  const formattedPublishedDate = new Date(publishedDate)

  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, formattedPublishedDate, link, duration, preview },
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

export const deletePublication = async (req, res) => {}

export const renderEditPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
     if (!publication) 
      return res.status(404).send('Project not found')
     
     res.render('editPublication', { publication, title: 'Edit Publication' })

  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
