import mongoose from "mongoose"
import Project from "../models/project.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  await Project.updateMany({ repo: { $exists: false } }, { $set: { repo: null } });
  console.log("✅ Migration add-repo-field-to-project applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  await Project.updateMany({}, { $unset: { repo: "" } })
  console.log("⏪ Migration add-repo-field-to-project reverted")
  await mongoose.disconnect()
}