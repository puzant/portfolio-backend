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
