import BackupService from '../services/backup.service.js'

async function test() {
  const backupService = new BackupService()
  
  try {
    const result = await backupService.createBackup()
    console.log('Backup successful:', result)
  } catch (error) {
    console.error('Backup failed:', error.message)
    console.error(error.stack)
  }
}

test()