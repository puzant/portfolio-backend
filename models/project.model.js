import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  preview: { type: String, required: true },
  link: { type: String, required: true },
  public_id: { type: String, required: true },
  asset_id: { type: String, required: true },
  priority: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  repo: { type: String, required: true }
})

export default mongoose.model('Porject', projectSchema)