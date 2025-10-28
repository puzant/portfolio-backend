import fs from 'fs'
import path from 'path'

const [,, migrationName, modelName, fieldName] = process.argv
const modelNameLowerCased = modelName.charAt(0).toLowerCase() + modelName.slice(1)

if (!migrationName || !modelName || !fieldName) {
  console.error("❌ Usage: npm run generate:migration <name> <model> <field>")
  process.exit(1)
}

const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "")
const fileName = `${timestamp}-${modelNameLowerCased }.js`
const filePath = path.join("migrations", fileName)

const template = `
import mongoose from "mongoose"
import ${modelName} from "../models/${modelNameLowerCased}.model.js"

export async function up() {
  await mongoose.connect(process.env.MONGO_URI)
  await ${modelName}.updateMany({ w${fieldName}: { $exists: false } }, { $set: { ${fieldName}: null } });
  console.log("✅ Migration ${migrationName} applied")
  await mongoose.disconnect()  
}

export async function down() {
  await mongoose.connect(process.env.MONGO_URI)
  await ${modelName}.updateMany({}, { $unset: { ${fieldName}: "" } })
  console.log("⏪ Migration ${migrationName} reverted")
  await mongoose.disconnect()
}
`

fs.mkdirSync("migrations", { recursive: true })
fs.writeFileSync(filePath, template.trim())
console.log(`✅ created migration: ${filePath}`)