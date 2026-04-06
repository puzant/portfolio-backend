import DotenvFlow from 'dotenv-flow'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

DotenvFlow.config()
const direction = process.argv[2] || 'up'

async function run() {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), 'migrations'));
    const migrations = files.filter(f => f.endsWith('.js'))
    migrations.sort()

    const latestMigration = migrations[migrations.length - 1]
    const migrationPath = path.join(process.cwd(), 'migrations', latestMigration)
    const migrationURL = pathToFileURL(migrationPath).href
    const migration = await import(migrationURL)

    if (!migration[direction]) {
      console.error(`❌ Migration does not export a ${direction} function`)
      process.exit(1)
    }

    console.log(`🚀 Running '${direction}' for migration: ${latestMigration}`)
    await migration[direction]()
    console.log(`✅ Migration ${latestMigration} ${direction} executed successfully`)
    process.exit(0)
  } catch (err) {
    console.error(`❌ Migration ${direction} failed:`, err);
    process.exit(1);
  }
}

run()