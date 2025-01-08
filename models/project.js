import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
})

export default mongoose.model('Porject', projectSchema)