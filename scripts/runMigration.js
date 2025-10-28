import path from 'path'
import { pathToFileURL } from 'url'
import dotenv  from 'dotenv'

dotenv.config()
const migrationFile = process.argv[2]

if (!migrationFile) {
  console.error("❌ Please provide a migration file name")
  process.exit(1)
}

async function run() {
  try {
    const migrationPath = path.join(process.cwd(), 'migrations', migrationFile)
    const migrationURL = pathToFileURL(migrationPath).href
    const migration = await import(migrationURL)

    if (!migration.up) {
      console.error("❌ Migration does not export an 'up' function")
      process.exit(1)
    }

    await migration.up()
    console.log(`✅ Migration ${migrationFile} executed successfully`);
    process.exit(0)
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run()