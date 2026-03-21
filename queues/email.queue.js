import { Queue } from "bullmq"
import RediSConnection from "../config/redis.js"

class EmailQueue {
  constructor() {
    this.redis = new RediSConnection().getConnection()

    this.queue = new Queue('email-notifications', {
      connection: this.redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
      }
    })
    console.log('📧 Email queue initialized')
  }

  async addPasswordResetJob(userData) {
    console.log(`📝 Adding password reset job for: ${userData.email}`)

    const job = await this.queue.add('password-reset', {
      email: userData.email,
      name: userData.name,
      resetToken: userData.resetToken,
      expiresIn: '1 hour',
      ipAddress: userData.ipAddress,
      timestamp: new Date().toISOString()
    }, {
      priority: 1,
      attempts: 3
    })
    
    console.log(`✅ Job ID: ${job.id}`)
    return job
  }

  async addPasswordChangedJob(userData) {
    console.log(`📝 Adding password-changed job for: ${userData.email}`)

    const job = await this.queue.add('password-changed', {
      email: userData.email,
      name: userData.name,
      userId: userData.userId,
      ipAddress: userData.ipAddress,
      timestamp: new Date().toISOString()
    }, {
      priority: 1,
      attempts: 3
    })

    console.log(`✅ Job ID: ${job.id}`)
    return job
  }
}

export default new EmailQueue()