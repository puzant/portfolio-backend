import { v2 as cloudinary } from 'cloudinary'
import project from "../models/project.js"

export const addProject = async (req, res) => {
  console.log("🚀 ~ addProject ~ req:", req.file)
  res.status(200)
}

export const editProject = async (req, res) => {}

export const deleteProject = async (req, res) => {}

export const renderAddProject = async (req, res) => {
  res.render('project/addProject', {
    title: 'Add Project'
  })
}

export const renderEditProject = async (req, res) => {
  res.render('project/editProject', {
    title: 'Edit Project'
  })
}
