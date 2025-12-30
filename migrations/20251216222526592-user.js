import mongoose from "mongoose"
import user from "../models/user.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  await user.updateMany(
  { $or: [{ role: { $exists: false } }, { role: 'user' }] },
  { $set: { role: 'admin' } }
);
  console.log("✅ Migration update-user-role applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
   await user.updateMany(
    { role: 'admin' },
    { $unset: { role: "" } }
  );
  console.log("⏪ Migration update-user-role reverted")
  await mongoose.disconnect()
}