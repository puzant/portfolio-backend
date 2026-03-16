import { Worker } from "bullmq"
import RediSConnection from "../config/redis.js"
import EmailService from "#services/email.service.js"

class EmailWorker {
  constructor() {
    this.redis = new RediSConnection().getConnection()
    this.emailService = new EmailService()
    console.log('👨‍🍳 Initializing email worker...')

    this.worker = new Worker('email-notifications', 
      async (job) => {
        console.log(`\n🔔 Worker processing job ${job.id}: ${job.name}`)
        console.log(`   Data:`, job.data)

        switch (job.name) {
          case 'password-changed':
            await this.emailService.sendPasswordChangedEmail(job.data)
            break
          
          default:
            console.log(`⚠️ Unknown job type: ${job.name}`)
        }

        console.log(`✅ Job ${job.id} completed\n`)
        return { success: true }
      }, {
        connection: this.redis,
        concurrency: 3,
        limiter: {
          max: 10,
          duration: 60000
        }
      }
    )

    this.setupEventHandlers()
    console.log('✅ Email worker initialized and waiting for jobs...')
  }

  setupEventHandlers() {
    this.worker.on('completed', (job) => {
      console.log(`🎉 Job ${job.id} completed successfully`)
    })

    this.worker.on('failed', (job, err) => {
      console.error(`💥 Job ${job.id} failed:`, err.message)
    })

    this.worker.on('ready', () => {
      console.log('🚀 Worker is ready and processing jobs...')
    })

    this.worker.on('error', (err) => {
      console.error('Worker error:', err)
    })
  }

  async getWorkerStatus() {
    return {
      isRunning: this.worker.isRunning(),
      jobCounts: await this.worker.getJobCounts()
    }
  }

  async close() {
    console.log('Shutting down email worker...')
    await this.worker.close()
    console.log('Email worker closed')
  }
}

export default new EmailWorker()