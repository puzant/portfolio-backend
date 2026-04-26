import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import archiver from 'archiver'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const execAsync = promisify(exec)

class BackupService {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups')
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const dumpDir = path.join(this.backupDir, `dump-${timestamp}`)
    const zipPath = path.join(this.backupDir, `backup-${timestamp}.zip`)
    const dbName = 'portfolio'
    const uri = process.env.MONGO_URI

    console.log(`Starting backup at ${timestamp}`)
    console.log(`Dump location: ${dumpDir}`)
    console.log(`Zip location: ${zipPath}`)

    try {
      await execAsync(`mongodump --uri="${uri}" --db=${dbName} --out=${dumpDir}`)
      await this.zipDirectory(dumpDir, zipPath)
      fs.rmSync(dumpDir, { recursive: true, force: true })
      
      return {
        success: true,
        backupPath: zipPath,
        filename: path.basename(zipPath),
        size: fs.statSync(zipPath).size,
        timestamp
      }
    } catch (err) {
      console.log(err)
    }
  }

  async zipDirectory(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', resolve)
      archive.on('error', reject)

      archive.pipe(output)
      archive.directory(sourceDir, false)
      archive.finalize()
    })
  }
}


export default BackupService