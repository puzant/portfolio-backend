import mongoose from "mongoose"

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  preview: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  duration: { type: String, required: true },
  link: { type: String, required: true },
  lastModified: { type: Date, default: Date.now() }
});

export default mongoose.model('Publication', publicationSchema)