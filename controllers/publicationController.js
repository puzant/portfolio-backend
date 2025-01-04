import express from 'express'
import Publications from '../models/publications.js'

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publications.find()
    res.status(200).json(publications)
  } catch (error) {
    console.error('Error fetching publications:', error)
    res.status(500).json({ error: 'Failed to fetch publications' })
  }
}

export const addPublication = async (req, res) => {}

export const editPublication = async (req, res) => {}

export const deletePublication = async (req, res) => {}

export const renderEditPublication = async (req, res) => {
  try {
    const publication = await Publications.findById(req.params.id)
     if (!publication) 
      return res.status(404).send('Project not found')
     
     res.render('editPublication', { publication })

  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
