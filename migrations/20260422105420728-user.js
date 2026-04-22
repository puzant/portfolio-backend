import mongoose from "mongoose"
import user from "../models/user.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  await user.updateMany(
    { "preferences.dragDropEnabled": { $type: "bool" } },
    {
      $set: {
        "preferences.dragDropEnabled": {
          projects: true,
          travelImages: true
        }
      }
    }
  )
  console.log("✅ Migration fix_dragdrop_schema applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  await user.updateMany({}, { $unset: { dragDropEnabled: "" } })
  console.log("⏪ Migration fix_dragdrop_schema reverted")
  await mongoose.disconnect()
}