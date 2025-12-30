import mongoose from "mongoose"
import travelImage from "../models/travelImage.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  const images = await travelImage.find().sort({ order: 1 })

  for (let i = 0; i < images.length; i++) {
    const newOrder = i + 1
    if (images[i].order !== newOrder) {
      images[i].order = newOrder
      await images[i].save()
      console.log(`Updated image ${images[i]._id}: order ${images[i].order} → ${newOrder}`);
    }
  }

  console.log("✅ Migration fix_travel_images_order applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  const images = await travelImage.find().sort({ order: 1 })
  
  for (let i = 0; i < images.length; i++) {
    const newOrder = i

    if (images[i].order !== newOrder) {
      images[i].order = newOrder
      await images[i].save()
    }
  }

  console.log("⏪ Migration fix_travel_images_order reverted")
  await mongoose.disconnect()
}