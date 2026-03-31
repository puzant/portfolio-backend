import mongoose from "mongoose"
import TravelImage from "../models/travelImage.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  const db = mongoose.connection.db
  const collection = db.collection('travelImages')

  await collection.updateMany({ country: { $exists: false } }, { $set: { country: null } });
  console.log("✅ Migration add_country_field applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  await collection.updateMany({}, { $unset: { country: "" } })
  console.log("⏪ Migration add_country_field reverted")
  await mongoose.disconnect()
}