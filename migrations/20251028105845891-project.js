import mongoose from "mongoose"
import project from "../models/project.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  await project.updateMany({ active: { $exists: false } }, { $set: { active: true } });
  console.log("✅ Migration add-active-field-for-properties applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  await project.updateMany({}, { $unset: { active: "" } })
  console.log("⏪ Migration add-active-field-for-properties reverted")
  await mongoose.disconnect()
}