import mongoose from "mongoose"

const travelImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  display_name: { type: String, required: true },
  assete_id: { type: String, required: true },
  public_id: { type: String, required: true }
})

export default mongoose.model('TravelImage', travelImageSchema)
