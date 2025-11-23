import mongoose from "mongoose"

const travelImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  display_name: { type: String, required: true },
  asset_id: { type: String, required: true },
  public_id: { type: String, required: true },
  order: { type: Number, required: true }
})

export default mongoose.model('TravelImage', travelImageSchema)
